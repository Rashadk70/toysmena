const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
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

// Get analytics data
router.get('/', protect, admin, async (req, res) => {
  try {
    const { timeRange } = req.query;
    const { start, end } = getDateRange(timeRange);

    // Get orders within date range
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('customer', 'name email');

    // Calculate summary metrics
    const summary = {
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      orders: orders.length,
      customers: await User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      avgOrderValue: orders.length > 0 ? 
        orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0
    };

    // Generate sales trend data
    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: "$_id",
          revenue: 1,
          orders: 1,
          _id: 0
        }
      }
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get category distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0
        }
      }
    ]);

    // Get customer segments
    const customerSegments = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$total" }
        }
      },
      {
        $bucket: {
          groupBy: "$totalSpent",
          boundaries: [0, 100, 500, 1000, 5000, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 }
          }
        }
      },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 100] }, then: "0-100" },
                { case: { $eq: ["$_id", 500] }, then: "100-500" },
                { case: { $eq: ["$_id", 1000] }, then: "500-1000" },
                { case: { $eq: ["$_id", 5000] }, then: "1000-5000" },
                { case: { $eq: ["$_id", Infinity] }, then: "5000+" }
              ],
              default: "Other"
            }
          },
          value: "$count"
        }
      }
    ]);

    // Get revenue by location
    const revenueByLocation = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$shippingAddress.city",
          orders: { $sum: 1 },
          revenue: { $sum: "$total" }
        }
      },
      {
        $project: {
          name: "$_id",
          orders: 1,
          revenue: 1,
          _id: 0
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        summary,
        salesTrend,
        topProducts,
        categoryDistribution,
        customerSegments,
        revenueByLocation
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// Export analytics data
router.get('/export', protect, admin, async (req, res) => {
  try {
    const { timeRange } = req.query;
    const { start, end } = getDateRange(timeRange);

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Orders Sheet
    const ordersSheet = workbook.addWorksheet('Orders');
    ordersSheet.columns = [
      { header: 'Order ID', key: 'id' },
      { header: 'Date', key: 'date' },
      { header: 'Customer', key: 'customer' },
      { header: 'Total', key: 'total' },
      { header: 'Status', key: 'status' }
    ];

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('customer', 'name');

    orders.forEach(order => {
      ordersSheet.addRow({
        id: order._id,
        date: order.createdAt.toLocaleDateString(),
        customer: order.customer.name,
        total: order.total,
        status: order.status
      });
    });

    // Products Sheet
    const productsSheet = workbook.addWorksheet('Top Products');
    productsSheet.columns = [
      { header: 'Product', key: 'name' },
      { header: 'Sales', key: 'sales' },
      { header: 'Revenue', key: 'revenue' }
    ];

    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    topProducts.forEach(product => {
      productsSheet.addRow({
        name: product.name,
        sales: product.sales,
        revenue: product.revenue
      });
    });

    // Customer Segments Sheet
    const customersSheet = workbook.addWorksheet('Customer Segments');
    customersSheet.columns = [
      { header: 'Segment', key: 'segment' },
      { header: 'Customers', key: 'customers' },
      { header: 'Total Revenue', key: 'revenue' }
    ];

    const customerSegments = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$total" }
        }
      },
      {
        $bucket: {
          groupBy: "$totalSpent",
          boundaries: [0, 100, 500, 1000, 5000, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
            revenue: { $sum: "$totalSpent" }
          }
        }
      }
    ]);

    customerSegments.forEach(segment => {
      customersSheet.addRow({
        segment: segment._id === Infinity ? '5000+' : `${segment._id}-${segment._id * 5}`,
        customers: segment.count,
        revenue: segment.revenue
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=analytics-report-${timeRange}.xlsx`
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
