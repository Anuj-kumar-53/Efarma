import farmer from '../model/farmer.js';
import KnowledgeHub from '../model/knowledge.js';
import scheme from '../model/scheme.js';

export const adminDashboard = async (req, res) => {
  try {
    const [
      totalFarmers,
      totalArticles,
      totalVideos,
      publishedItems,
      draftItems,
      totalSchemes,
    ] = await Promise.all([
      farmer.countDocuments(),
      KnowledgeHub.countDocuments({ mediaType: 'article' }),
      KnowledgeHub.countDocuments({ mediaType: 'video' }),
      KnowledgeHub.countDocuments({ isPublished: true }),
      KnowledgeHub.countDocuments({ isPublished: false }),
      scheme.countDocuments(),
    ]);

    const dashboardStats = {
      message: 'Hi Admin! Welcome to your dashboard',
      stats: {
        totalFarmers,
        totalArticles,
        totalVideos,
        totalSchemes,
        publishedItems,
        draftItems,
      },
      admin: req.admin,
    };

    res.json({
      success: true,
      data: dashboardStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const adminAnalytics = async (req, res) => {
  try {
    // Content distribution by category and media type
    const [categoryBreakdown, mediaTypeBreakdown] = await Promise.all([
      KnowledgeHub.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      KnowledgeHub.aggregate([
        { $group: { _id: '$mediaType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Top viewed schemes
    const topSchemes = await scheme
      .find({})
      .sort({ views: -1 })
      .limit(5)
      .select('title category views isActive');

    // Monthly farmer growth for last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyAgg = await farmer.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyFarmerGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const label = `${monthNames[month - 1]} ${String(year).slice(-2)}`;
      const found = monthlyAgg.find((item) => item._id.year === year && item._id.month === month);
      monthlyFarmerGrowth.push({ month: label, count: found ? found.count : 0 });
    }

    res.json({
      success: true,
      data: {
        contentDistribution: {
          byCategory: categoryBreakdown.map((c) => ({ category: c._id || 'Uncategorized', value: c.count })),
          byMediaType: mediaTypeBreakdown.map((c) => ({ type: c._id || 'unknown', value: c.count })),
        },
        topSchemes,
        monthlyFarmerGrowth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};