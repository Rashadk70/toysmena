const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ExcelJS = require('exceljs');

// Helper function to get date range
const getDateRange = (timeRange) => {
  const end = new Date();
  const start = new Date();
  
  switch (timeRange) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    default:
      start.setDate(end.getDate() - 7);
  }
  
  return { start, end };
};

// Get seller analytics data
router.get('/', protect, seller, async (req, res) => {
  try {
    const { timeRange } = req.query;
    const { start, end } = getDateRange(timeRange);
    const sellerId = req.user._id;

    // Get orders for this seller within date range
    const orders = await Order.find({
      'items.seller': sellerId,
      createdAt: { $gte: start, $lte: end }
    });

    // Calculate previous period metrics for comparison
    const previousStart = new Date(start);
    const previousEnd = new Date(end);
    previousStart.setDate(previousStart.getDate() - (end - start) / (1000 * 60 * 60 * 24));
    previousEnd.setDate(previousEnd.getDate() - (end - start) / (1000 * 60 * 60 * 24));

    const previousOrders = await Order.find({
      'items.seller': sellerId,
      createdAt: { $gte: previousStart, $lte: previousEnd }
    });

    // Calculate summary metrics
    const calculateRevenue = (orders) => {
      return orders.reduce((sum, order) => {
        const sellerItems = order.items.filter(item => item.seller.toString() === sellerId.toString());
        return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
      }, 0);
    };

    const currentRevenue = calculateRevenue(orders);
    const previousRevenue = calculateRevenue(previousOrders);
    const revenueTrend = previousRevenue === 0 ? 100 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    // Get active products count
    const activeProducts = await Product.countDocuments({
      seller: sellerId,
      status: 'active'
    });

    // Calculate conversion rate (orders / product views)
    const productViews = await Product.aggregate([
      {
        $match: {
          seller: sellerId
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const conversionRate = productViews.length > 0 && productViews[0].totalViews > 0
      ? (orders.length / productViews[0].totalViews) * 100
      : 0;

    const summary = {
      revenue: currentRevenue,
      orders: orders.length,
      products: activeProducts,
      conversion: conversionRate,
      trends: {
        revenue: revenueTrend,
        orders: previousOrders.length === 0 ? 100 : ((orders.length - previousOrders.length) / previousOrders.length) * 100
      }
    };

    // Generate revenue chart data
    const revenueChart = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $match: {
          'items.seller': sellerId
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          date: '$_id',
          revenue: 1,
          orders: { $size: '$orders' },
          _id: 0
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $match: {
          'items.seller': sellerId
        }
      },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Calculate growth for each top product
    for (let product of topProducts) {
      const previousSales = await Order.aggregate([
        {
          $match: {
            'items.seller': sellerId,
            'items.productId': product._id,
            createdAt: { $gte: previousStart, $lte: previousEnd }
          }
        },
        {
          $unwind: '$items'
        },
        {
          $match: {
            'items.seller': sellerId,
            'items.productId': product._id
          }
        },
        {
          $group: {
            _id: null,
            sales: { $sum: '$items.quantity' }
          }
        }
      ]);

      product.growth = previousSales.length === 0 ? 100 :
        ((product.sales - previousSales[0].sales) / previousSales[0].sales) * 100;
    }

    // Get inventory status
    const inventoryStatus = await Product.aggregate([
      {
        $match: {
          seller: sellerId
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ['$quantity', 0] }, then: 'Out of Stock' },
                { case: { $lte: ['$quantity', '$lowStockThreshold'] }, then: 'Low Stock' },
                { case: { $gt: ['$quantity', '$lowStockThreshold'] }, then: 'In Stock' }
              ],
              default: 'Unknown'
            }
          },
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: 1,
          _id: 0
        }
      }
    ]);

    // Get customer retention data
    const customerRetention = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$customer',
          orderCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$orderCount', 1] },
              then: 'new',
              else: 'returning'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$count',
          _id: 0
        }
      }
    ]);

    // Get order status distribution
    const orderStatus = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary,
        revenueChart,
        topProducts,
        inventoryStatus,
        customerRetention,
        orderStatus
      }
    });
  } catch (error) {
    console.error('Seller analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// Export seller analytics data
router.get('/export', protect, seller, async (req, res) => {
  try {
    const { timeRange } = req.query;
    const { start, end } = getDateRange(timeRange);
    const sellerId = req.user._id;

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Sales Sheet
    const salesSheet = workbook.addWorksheet('Sales');
    salesSheet.columns = [
      { header: 'Date', key: 'date' },
      { header: 'Order ID', key: 'orderId' },
      { header: 'Product', key: 'product' },
      { header: 'Quantity', key: 'quantity' },
      { header: 'Price', key: 'price' },
      { header: 'Total', key: 'total' },
      { header: 'Status', key: 'status' }
    ];

    const orders = await Order.find({
      'items.seller': sellerId,
      createdAt: { $gte: start, $lte: end }
    });

    orders.forEach(order => {
      order.items
        .filter(item => item.seller.toString() === sellerId.toString())
        .forEach(item => {
          salesSheet.addRow({
            date: order.createdAt.toLocaleDateString(),
            orderId: order._id,
            product: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            status: order.status
          });
        });
    });

    // Products Sheet
    const productsSheet = workbook.addWorksheet('Products');
    productsSheet.columns = [
      { header: 'Product', key: 'name' },
      { header: 'SKU', key: 'sku' },
      { header: 'Category', key: 'category' },
      { header: 'Price', key: 'price' },
      { header: 'Quantity', key: 'quantity' },
      { header: 'Total Sales', key: 'sales' },
      { header: 'Revenue', key: 'revenue' }
    ];

    const products = await Product.find({ seller: sellerId });
    for (const product of products) {
      const sales = await Order.aggregate([
        {
          $match: {
            'items.seller': sellerId,
            'items.productId': product._id,
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $unwind: '$items'
        },
        {
          $match: {
            'items.seller': sellerId,
            'items.productId': product._id
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        }
      ]);

      productsSheet.addRow({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        sales: sales.length > 0 ? sales[0].totalSales : 0,
        revenue: sales.length > 0 ? sales[0].totalRevenue : 0
      });
    }

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=store-analytics-${timeRange}.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics data'
    });
  }
});

module.exports = router;
