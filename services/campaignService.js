const cron = require('node-cron');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const emailService = require('./emailService');

class CampaignService {
  constructor() {
    this.initializeCrons();
  }

  initializeCrons() {
    // Welcome series for new users (daily check)
    cron.schedule('0 10 * * *', () => {
      this.sendWelcomeSeries();
    });

    // Abandoned cart reminders (every 4 hours)
    cron.schedule('0 */4 * * *', () => {
      this.sendAbandonedCartReminders();
    });

    // Weekly newsletter (every Monday at 10 AM)
    cron.schedule('0 10 * * 1', () => {
      this.sendWeeklyNewsletter();
    });

    // Product restock notifications (every 2 hours)
    cron.schedule('0 */2 * * *', () => {
      this.sendRestockNotifications();
    });

    // Review requests (daily at 2 PM)
    cron.schedule('0 14 * * *', () => {
      this.sendReviewRequests();
    });

    // Customer win-back campaign (weekly on Wednesday)
    cron.schedule('0 11 * * 3', () => {
      this.sendWinBackCampaign();
    });
  }

  async sendWelcomeSeries() {
    try {
      // Get users registered in the last 24 hours who haven't received welcome email
      const newUsers = await User.find({
        createdAt: { 
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          $lte: new Date()
        },
        welcomeEmailSent: { $ne: true }
      });

      for (const user of newUsers) {
        await emailService.sendWelcomeEmail(user);
        
        // Schedule follow-up emails
        setTimeout(async () => {
          await this.sendFollowUpEmail(user, 'getting_started');
        }, 2 * 24 * 60 * 60 * 1000); // 2 days later

        setTimeout(async () => {
          await this.sendFollowUpEmail(user, 'product_discovery');
        }, 4 * 24 * 60 * 60 * 1000); // 4 days later

        user.welcomeEmailSent = true;
        await user.save();
      }
    } catch (error) {
      console.error('Welcome series error:', error);
    }
  }

  async sendAbandonedCartReminders() {
    try {
      // Get abandoned carts from last 24 hours
      const abandonedCarts = await User.find({
        'cart.updatedAt': {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          $lte: new Date(Date.now() - 1 * 60 * 60 * 1000) // At least 1 hour old
        },
        'cart.items.0': { $exists: true },
        'cart.reminderSent': { $ne: true }
      });

      for (const user of abandonedCarts) {
        await emailService.sendAbandonedCartEmail(user, user.cart);
        user.cart.reminderSent = true;
        await user.save();
      }
    } catch (error) {
      console.error('Abandoned cart reminder error:', error);
    }
  }

  async sendWeeklyNewsletter() {
    try {
      // Get subscribed users
      const subscribers = await User.find({
        newsletterSubscribed: true,
        emailVerified: true
      });

      // Get featured products and deals
      const featuredProducts = await Product.find({
        featured: true,
        quantity: { $gt: 0 }
      }).limit(6);

      const deals = await Product.find({
        discount: { $gt: 0 },
        quantity: { $gt: 0 }
      }).limit(6);

      for (const user of subscribers) {
        await emailService.sendNewsletterEmail(user, {
          featuredProducts,
          deals,
          weeklyHighlights: this.getWeeklyHighlights()
        });
      }
    } catch (error) {
      console.error('Weekly newsletter error:', error);
    }
  }

  async sendRestockNotifications() {
    try {
      // Get recently restocked products
      const restockedProducts = await Product.find({
        restockDate: {
          $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
        },
        quantity: { $gt: 0 }
      });

      for (const product of restockedProducts) {
        // Get users who requested restock notifications
        const interestedUsers = await User.find({
          'restockAlerts.productId': product._id
        });

        for (const user of interestedUsers) {
          await emailService.sendRestockNotification(user, product);
          
          // Remove product from user's restock alerts
          user.restockAlerts = user.restockAlerts.filter(
            alert => alert.productId.toString() !== product._id.toString()
          );
          await user.save();
        }
      }
    } catch (error) {
      console.error('Restock notification error:', error);
    }
  }

  async sendReviewRequests() {
    try {
      // Get orders delivered 7 days ago without reviews
      const eligibleOrders = await Order.find({
        status: 'delivered',
        deliveredAt: {
          $gte: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        'items.reviewed': { $ne: true }
      }).populate('customer');

      for (const order of eligibleOrders) {
        await emailService.sendReviewRequestEmail(order.customer, order);
      }
    } catch (error) {
      console.error('Review request error:', error);
    }
  }

  async sendWinBackCampaign() {
    try {
      // Get users who haven't ordered in 30 days
      const inactiveUsers = await User.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $match: {
            orders: {
              $not: {
                $elemMatch: {
                  createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  }
                }
              }
            },
            winBackEmailSent: { $ne: true }
          }
        }
      ]);

      for (const user of inactiveUsers) {
        // Get personalized product recommendations
        const recommendations = await this.getPersonalizedRecommendations(user);
        
        await emailService.sendWinBackEmail(user, {
          recommendations,
          specialOffer: this.generateSpecialOffer(user)
        });

        await User.findByIdAndUpdate(user._id, { winBackEmailSent: true });
      }
    } catch (error) {
      console.error('Win-back campaign error:', error);
    }
  }

  async sendFollowUpEmail(user, type) {
    try {
      switch (type) {
        case 'getting_started':
          await emailService.sendGettingStartedEmail(user);
          break;
        case 'product_discovery':
          const recommendations = await this.getPersonalizedRecommendations(user);
          await emailService.sendProductDiscoveryEmail(user, recommendations);
          break;
      }
    } catch (error) {
      console.error(`Follow-up email error (${type}):`, error);
    }
  }

  async getPersonalizedRecommendations(user) {
    try {
      // Get user's order history
      const orders = await Order.find({ customer: user._id });
      
      // Extract categories and products user has shown interest in
      const categories = new Set();
      const purchasedProducts = new Set();
      
      orders.forEach(order => {
        order.items.forEach(item => {
          categories.add(item.category);
          purchasedProducts.add(item.productId.toString());
        });
      });

      // Find similar products in same categories
      const recommendations = await Product.find({
        category: { $in: Array.from(categories) },
        _id: { $nin: Array.from(purchasedProducts) },
        quantity: { $gt: 0 }
      })
      .sort('-rating')
      .limit(6);

      return recommendations;
    } catch (error) {
      console.error('Recommendations error:', error);
      return [];
    }
  }

  generateSpecialOffer(user) {
    // Generate personalized offer based on user's purchase history
    return {
      discountCode: `WIN${user._id.toString().substr(-6)}`,
      discountPercent: 15,
      validDays: 7
    };
  }

  getWeeklyHighlights() {
    return {
      topCategories: ['Educational Toys', 'STEM Toys', 'Creative Arts'],
      newArrivals: true,
      specialOffers: true
    };
  }
}

module.exports = new CampaignService();
