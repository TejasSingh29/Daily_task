
const mongoose = require("mongoose");

const screeningSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true
  },

  resumeFile: {
    type: String,
    required: true
  },

  criteria: {
    requiredSkills: [String],
    experienceRequired: Number,
    educationRequired: String
  },

  aiRecommendation: {
    type: String,
    enum: ["recommended", "needs_review", "not_recommended"],
    default: "needs_review"
  },

  aiScore: {
    type: Number,
    min: 0,
    max: 100
  },

  humanReview: {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    rationale: String,
    reviewedAt: Date
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Screening", screeningSchema);
