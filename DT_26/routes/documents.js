const express = require("express");
const { z } = require("zod");

const router = express.Router();

// Demo database (in-memory)
const documents = {
  "DOC-101": {
    id: "DOC-101",
    title: "Company Leave Policy",
    versions: []
  }
};

// Input validation schemas
const versionSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters"),
  changeNote: z.string().min(5, "Change note must be at least 5 characters")
});

const approvalSchema = z.object({
  versionNumber: z.number().int().positive(),
  decision: z.enum(["approved", "rejected"]),
  comment: z.string().min(3, "Comment is required")
});

// Helper: create errors
function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Create a new document version
router.post("/:documentId/versions", (req, res, next) => {
  try {
    const { documentId } = req.params;

    // Permission check
    if (!["editor", "admin"].includes(req.headers["x-role"])) {
      throw createError("Only editors or admins can create versions", 403);
    }

    // Validate request body
    const result = versionSchema.safeParse(req.body);

    if (!result.success) {
      throw createError(
        result.error.issues.map(issue => issue.message).join(", "),
        400
      );
    }

    const document = documents[documentId];

    if (!document) {
      throw createError("Document not found", 404);
    }

    const version = {
      versionNumber: document.versions.length + 1,
      content: result.data.content,
      changeNote: result.data.changeNote,
      createdBy: req.headers["x-user-id"] || "unknown",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    document.versions.push(version);

    res.status(201).json({
      success: true,
      message: "Document version created",
      data: version
    });
  } catch (error) {
    next(error);
  }
});

// Approve or reject a document version
router.post("/:documentId/approve", (req, res, next) => {
  try {
    // Permission check
    if (!["approver", "admin"].includes(req.headers["x-role"])) {
      throw createError("Only approvers or admins can review versions", 403);
    }

    const result = approvalSchema.safeParse(req.body);

    if (!result.success) {
      throw createError(
        result.error.issues.map(issue => issue.message).join(", "),
        400
      );
    }

    const document = documents[req.params.documentId];

    if (!document) {
      throw createError("Document not found", 404);
    }

    const version = document.versions.find(
      v => v.versionNumber === result.data.versionNumber
    );

    if (!version) {
      throw createError("Document version not found", 404);
    }

    if (version.status !== "pending") {
      throw createError("This version has already been reviewed", 409);
    }

    version.status = result.data.decision;
    version.reviewComment = result.data.comment;
    version.reviewedBy = req.headers["x-user-id"] || "unknown";
    version.reviewedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Version ${version.versionNumber} ${version.status}`,
      data: version
    });
  } catch (error) {
    next(error);
  }
});

// Get document and its version history
router.get("/:documentId", (req, res, next) => {
  try {
    const document = documents[req.params.documentId];

    if (!document) {
      throw createError("Document not found", 404);
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;