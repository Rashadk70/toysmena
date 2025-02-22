const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Load email templates
const loadTemplate = async (templateName, data) => {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.ejs`);
  return await ejs.renderFile(templatePath, data);
};

// Email sending functions
const emailService = {
  // Send order confirmation to customer
  async sendOrderConfirmation(order) {
    try {
      const html = await loadTemplate('orderConfirmation', {
        order,
        storeName: 'ToysMena',
        supportEmail: 'support@toysmena.com',
      });

      await transporter.sendMail({
        from: `"ToysMena" <${process.env.SMTP_FROM}>`,
        to: order.customer.email,
        subject: `Order Confirmation #${order.id}`,
        html,
      });
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      throw error;
    }
  },

  // Send order status update to customer
  async sendOrderStatusUpdate(order) {
    try {
      const html = await loadTemplate('orderStatusUpdate', {
        order,
        storeName: 'ToysMena',
        supportEmail: 'support@toysmena.com',
      });

      await transporter.sendMail({
        from: `"ToysMena" <${process.env.SMTP_FROM}>`,
        to: order.customer.email,
        subject: `Order Status Update #${order.id}`,
        html,
      });
    } catch (error) {
      console.error('Failed to send order status update email:', error);
      throw error;
    }
  },

  // Send welcome email to new users
  async sendWelcomeEmail(user) {
    try {
      const html = await loadTemplate('welcome', {
        user,
        storeName: 'ToysMena',
        supportEmail: 'support@toysmena.com',
      });

      await transporter.sendMail({
        from: `"ToysMena" <${process.env.SMTP_FROM}>`,
        to: user.email,
        subject: 'Welcome to ToysMena!',
        html,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  },

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const html = await loadTemplate('passwordReset', {
        user,
        resetToken,
        storeName: 'ToysMena',
        supportEmail: 'support@toysmena.com',
      });

      await transporter.sendMail({
        from: `"ToysMena" <${process.env.SMTP_FROM}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  },

  // Send seller verification email
  async sendSellerVerificationEmail(seller) {
    try {
      const html = await loadTemplate('sellerVerification', {
        seller,
        storeName: 'ToysMena',
        supportEmail: 'support@toysmena.com',
      });

      await transporter.sendMail({
        from: `"ToysMena" <${process.env.SMTP_FROM}>`,
        to: seller.email,
        subject: 'Seller Account Verification',
        html,
      });
    } catch (error) {
      console.error('Failed to send seller verification email:', error);
      throw error;
    }
  },

  // Send low stock notification to seller
  async sendLowStockNotification(seller, product) {
    try {
      const html = await loadTemplate('lowStock', {
        seller,
        product,
        storeName: 'ToysMena',
        supportEmail: 'support@toysmena.com',
      });

      await transporter.sendMail({
        from: `"ToysMena" <${process.env.SMTP_FROM}>`,
        to: seller.email,
        subject: `Low Stock Alert: ${product.name}`,
        html,
      });
    } catch (error) {
      console.error('Failed to send low stock notification:', error);
      throw error;
    }
  },

  // Send order notification to seller
  async sendSellerOrderNotification(seller, order) {
    try {
      const html = await loadTemplate('sellerOrderNotification', {
        seller,
        order,
        storeName: 'ToysMena',
        supportEmail: 'support@toysmena.com',
      });

      await transporter.sendMail({
        from: `"ToysMena" <${process.env.SMTP_FROM}>`,
        to: seller.email,
        subject: `New Order Received #${order.id}`,
        html,
      });
    } catch (error) {
      console.error('Failed to send seller order notification:', error);
      throw error;
    }
  },
};

module.exports = emailService;
