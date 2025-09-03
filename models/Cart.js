const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    addedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, index: { unique: true, sparse: true } },
    guestId: { type: String, index: { unique: true, sparse: true } },
    items: { type: [itemSchema], default: [] }
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  if (!this.userId && !this.guestId) {
    return next(new Error("Either userId or guestId must be provided"));
  }
  next();
});

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel
