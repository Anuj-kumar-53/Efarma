import Scheme from "../model/scheme.js";
import mongoose from 'mongoose';

export const getAllSchemes = async (req, res) => {
  try {
    const {
      category,
      state,
      tag,
      search,
      minAge,
      maxAge,
      minIncome,
      maxIncome,
      gender,
      page = 1,
      limit = 10
    } = req.query;

    let filter = { isActive: true };

    // Category filter
    if (category) filter.category = new RegExp(category, 'i');

    // State filter
    if (state) filter['eligibility.state'] = new RegExp(state, 'i');

    // Tag filter
    if (tag) filter.tags = new RegExp(tag, 'i');

    // Gender filter (strict)
    if (gender && ['Male', 'Female', 'Both', 'Other'].includes(gender)) {
      filter['eligibility.gender'] = gender;
    }

    // AGE FILTER
    if (minAge || maxAge) {
      filter.$and = filter.$and || [];
      if (minAge) {
        filter.$and.push({
          $or: [
            { 'eligibility.age.max': null },
            { 'eligibility.age.max': { $gte: Number(minAge) } }
          ]
        });
      }
      if (maxAge) {
        filter.$and.push({
          $or: [
            { 'eligibility.age.min': null },
            { 'eligibility.age.min': { $lte: Number(maxAge) } }
          ]
        });
      }
    }

    // INCOME FILTER
    if (minIncome || maxIncome) {
      filter.$and = filter.$and || [];

      if (minIncome) {
        filter.$and.push({
          $or: [
            { 'eligibility.income.max': null },
            { 'eligibility.income.max': { $gte: Number(minIncome) } }
          ]
        });
      }
      if (maxIncome) {
        filter.$and.push({
          $or: [
            { 'eligibility.income.min': null },
            { 'eligibility.income.min': { $lte: Number(maxIncome) } }
          ]
        });
      }
    }

    // SEARCH FILTER
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const schemes = await Scheme.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('addedBy', 'name email');

    const total = await Scheme.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: schemes.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: schemes
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching schemes',
      error: error.message
    });
  }
};

// ---------------------------------------------
// GET SCHEME BY ID
// ---------------------------------------------
export const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid scheme ID' });
    }

    const scheme = await Scheme.findById(id).populate('addedBy', 'name email');
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    await scheme.incrementViews();

    return res.status(200).json({ success: true, data: scheme });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching scheme',
      error: error.message
    });
  }
};

// ---------------------------------------------
// CREATE SCHEME
// ---------------------------------------------
export const createScheme = async (req, res) => {
  try {
    const scheme = new Scheme({
      ...req.body,
      addedBy: req.admin.id
    });

    await scheme.save();
    await scheme.populate('addedBy', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: scheme
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating scheme',
      error: error.message
    });
  }
};

// ---------------------------------------------
// UPDATE SCHEME
// ---------------------------------------------
export const updateScheme = async (req, res) => {
  try {
    const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid scheme ID' });
    }

    const scheme = await Scheme.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('addedBy', 'name email');

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Scheme updated successfully',
      data: scheme
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error updating scheme',
      error: error.message
    });
  }
};

// ---------------------------------------------
// DELETE SCHEME
// ---------------------------------------------
export const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid scheme ID' });
    }

    const scheme = await Scheme.findByIdAndDelete(id);

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Scheme deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting scheme',
      error: error.message
    });
  }
};

// ---------------------------------------------
// INCREMENT CLICK COUNTER
// ---------------------------------------------
export const incrementClicks = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid scheme ID' });
    }

    const scheme = await Scheme.findById(id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    await scheme.incrementClicks();

    return res.status(200).json({
      success: true,
      message: 'Click counted successfully',
      officialLink: scheme.officialLink
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error counting click',
      error: error.message
    });
  }
};

// ---------------------------------------------
// POPULAR SCHEMES
// ---------------------------------------------
export const getPopularSchemes = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const schemes = await Scheme.getPopularSchemes(limit);

    return res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching popular schemes',
      error: error.message
    });
  }
};

// ---------------------------------------------
// GET SCHEMES BY CATEGORY
// ---------------------------------------------
export const getSchemesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      category: new RegExp(category, 'i'),
      isActive: true
    };

    const schemes = await Scheme.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'name email');

    const total = await Scheme.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: schemes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: schemes
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching category schemes',
      error: error.message
    });
  }
};

// ---------------------------------------------
// SEARCH SCHEMES
// ---------------------------------------------
export const searchSchemes = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const results = await Scheme.searchSchemes(q);

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error searching schemes',
      error: error.message
    });
  }
};

// ---------------------------------------------
// ANALYTICS
// ---------------------------------------------
export const getSchemeAnalytics = async (req, res) => {
  try {
    const mostViewed = await Scheme.find({ isActive: true })
      .sort({ views: -1 })
      .limit(5)
      .select('title views clicks category');

    const mostClicked = await Scheme.find({ isActive: true })
      .sort({ clicks: -1 })
      .limit(5)
      .select('title views clicks category');

    const categoryStats = await Scheme.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalClicks: { $sum: '$clicks' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        mostViewed,
        mostClicked,
        categoryStats
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
