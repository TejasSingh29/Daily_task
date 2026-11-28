
const express = require("express");
const Screening = require("../models/Screening");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// All routes below require authentication
router.use(protect);

// Create a screening record
router.post("/", authorize("recruiter", "admin"), async (req, res) => {
  try {
    const {
      candidateName,
      resumeFile,
      criteria
    } = req.body;

    if (
      typeof candidateName !== "string" ||
      !candidateName.trim() ||
      typeof resumeFile !== "string" ||
      !resumeFile.trim() ||
      !criteria ||
      !Array.isArray(criteria.requiredSkills) ||
      typeof criteria.experienceRequired !== "number" ||
      criteria.experienceRequired < 0 ||
      criteria.experienceRequired > 50 ||
      typeof criteria.educationRequired !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid screening information."
      });
    }

    const screening = await Screening.create({
      candidateName: candidateName.trim(),
      resumeFile: resumeFile.trim(),
      criteria,
      createdBy: req.user._id,
      aiRecommendation: "needs_review",
      humanReview: {
        status: "pending"
      }
    });

    res.status(201).json({
      message: "Screening record created.",
      screening
    });

  } catch (error) {
    res.status(500).json({
      message: "Could not create screening record."
    });
  }
});

// Get screening records
// Recruiters see their own records; admins see all.
router.get("/", authorize("recruiter", "admin"), async (req, res) => {
  try {
    const filter = req.user.role === "admin"
      ? {}
      : { createdBy: req.user._id };

    const screenings = await Screening.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(screenings);

  } catch (error) {
    res.status(500).json({
      message: "Could not fetch screening records."
    });
  }
});

// Get one screening record with ownership verification
router.get("/:id", async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id);

    if (!screening) {
      return res.status(404).json({
        message: "Screening record not found."
      });
    }

    const isOwner =
      screening.createdBy.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You cannot access another recruiter's record."
      });
    }

    res.json(screening);

  } catch (error) {
    res.status(400).json({
      message: "Invalid screening ID."
    });
  }
});

// Human review of an AI recommendation
router.patch(
  "/:id/review",
  authorize("recruiter", "admin"),
  async (req, res) => {
    try {
      const { status, rationale } = req.body;

      if (
        !["approved", "rejected"].includes(status) ||
        typeof rationale !== "string" ||
        !rationale.trim() ||
        rationale.trim().length > 1000
      ) {
        return res.status(400).json({
          message: "A valid decision and review rationale are required."
        });
      }

      const screening = await Screening.findById(req.params.id);

      if (!screening) {
        return res.status(404).json({
          message: "Screening record not found."
        });
      }

      const isOwner =
        screening.createdBy.toString() === req.user._id.toString();

      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          message: "You cannot review another recruiter's candidate."
        });
      }

      screening.humanReview = {
        status,
        reviewer: req.user._id,
        rationale: rationale.trim(),
        reviewedAt: new Date()
      };

      await screening.save();

      res.json({
        message: "Human review saved successfully.",
        screening
      });

    } catch (error) {
      res.status(400).json({
        message: "Unable to complete human review."
      });
    }
  }
);

module.exports = router;
