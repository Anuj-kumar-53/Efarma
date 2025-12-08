import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC INFORMATION
    // ===============================
    title: {
      type: String,
      required: [true, "Scheme title is required"],
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: [true, "Scheme description is required"],
      trim: true,
    },

    benefits: {
      type: String,
      required: [true, "Scheme benefits are required"],
      trim: true,
    },

    // ===============================
    // OFFICIAL LINKS
    // ===============================
    officialLink: {
      type: String,
      required: [true, "Official application link is required"],
      trim: true,
    },

    sourceWebsite: {
      type: String,
      required: [true, "Source website is required"],
      trim: true,
    },

    // ===============================
    // CATEGORIES & TAGS
    // ===============================
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Education",
        "Health",
        "Farmer",
        "Women",
        "Housing",
        "Agriculture",
        "Livestock",
        "Irrigation",
        "Subsidy",
        "Loan",
        "Insurance",
      ],
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // ===============================
    // ELIGIBILITY DETAILS
    // ===============================
    eligibility: {
      age: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: null },
      },

      income: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: null }, // null = no limit
      },

      caste: [
        {
          type: String,
          trim: true,
        },
      ],

      applicantCategory: [
        {
          type: String,
          trim: true,
        },
      ],

      gender: {
        type: String,
        enum: ["Male", "Female", "Both", "Other"],
        default: "Both",
      },

      occupation: [
        {
          type: String,
          trim: true,
        },
      ],

      landHolding: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: null },
      },

      state: [
        {
          type: String,
          trim: true,
        },
      ],

      district: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    // ===============================
    // REQUIRED DOCUMENTS
    // ===============================
    requiredDocuments: [
      {
        type: String,
        trim: true,
      },
    ],

    // ===============================
    // TIMELINE
    // ===============================
    lastDate: {
      type: Date,
      default: null,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ===============================
    // TARGET AUDIENCE
    // ===============================
    targetAudience: [
      {
        type: String,
        trim: true,
      },
    ],

    // ===============================
    // ANALYTICS
    // ===============================
    views: {
      type: Number,
      default: 0,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    // ===============================
    // ADMIN INFORMATION
    // ===============================
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },
  },

  {
    timestamps: true, // creates createdAt & updatedAt automatically
  }
);


schemeSchema.index({ category: 1 });
schemeSchema.index({ tags: 1 });
schemeSchema.index({ "eligibility.state": 1 });
schemeSchema.index({ "eligibility.age.min": 1, "eligibility.age.max": 1 });
schemeSchema.index({ isActive: 1 });
schemeSchema.index({ lastDate: 1 });
schemeSchema.index({ views: -1 });


schemeSchema.statics.getPopularSchemes = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ views: -1 })
    .limit(limit)
    .select("title category views officialLink");
};

schemeSchema.statics.getByCategory = function (category) {
  return this.find({
    category: new RegExp(category, "i"),
    isActive: true,
  }).sort({ createdAt: -1 });
};

schemeSchema.statics.searchSchemes = function (searchTerm) {
  return this.find({
    isActive: true,
    $or: [
      { title: new RegExp(searchTerm, "i") },
      { description: new RegExp(searchTerm, "i") },
      { tags: new RegExp(searchTerm, "i") },
    ],
  });
};


schemeSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

schemeSchema.methods.incrementClicks = function () {
  this.clicks += 1;
  return this.save();
};


schemeSchema.virtual("isExpired").get(function () {
  if (!this.lastDate) return false;
  return this.lastDate < new Date();
});


const Scheme = mongoose.model("Scheme", schemeSchema);
export default Scheme;
