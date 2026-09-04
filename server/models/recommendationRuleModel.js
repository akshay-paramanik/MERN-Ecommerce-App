const mongoose = require("mongoose");

const recommendationRuleSchema = new mongoose.Schema({
    lhs: [String],        // e.g. ["P001"]
    rhs: [String],        // e.g. ["P005"]
    support: Number,
    confidence: Number,
    lift: Number
}, { timestamps: true });

recommendationRuleSchema.index({ lhs: 1 });

module.exports = mongoose.model(
    "RecommendationRule",
    recommendationRuleSchema
);