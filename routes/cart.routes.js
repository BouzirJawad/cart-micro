const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const validateRequest = require("../middlewares/validateRequest");
const {
  userIdParam,
  guestIdParam,
  productIdBody,
  quantityRequired,
  replaceItemsBody
} = require("../middlewares/cart.validation");

/**
 * Routes design:
 * - User routes: /api/cart/user/:userId/...
 * - Guest routes: /api/cart/guest/:guestId/...
 *
 * Also a merge endpoint: POST /api/cart/merge  { userId, guestId }
 */

// Add item (POST) -> merge if exists
router.post("/user/:userId/items", userIdParam, productIdBody, quantityRequired, validateRequest, (req, res) => {
  // forward as type 'user'
  req.params.type = "user";
  req.params.id = req.params.userId;
  return cartController.addItem(req, res);
});
router.post("/guest/:guestId/items", guestIdParam, productIdBody, quantityRequired, validateRequest, (req, res) => {
  req.params.type = "guest";
  req.params.id = req.params.guestId;
  return cartController.addItem(req, res);
});

// Get cart
router.get("/user/:userId", userIdParam, validateRequest, (req, res) => {
  req.params.type = "user";
  req.params.id = req.params.userId;
  return cartController.getCart(req, res);
});
router.get("/guest/:guestId", guestIdParam, validateRequest, (req, res) => {
  req.params.type = "guest";
  req.params.id = req.params.guestId;
  return cartController.getCart(req, res);
});

// Update item (set quantity)
router.put("/user/:userId/items", userIdParam, productIdBody, quantityRequired, validateRequest, (req, res) => {
  req.params.type = "user";
  req.params.id = req.params.userId;
  return cartController.updateItem(req, res);
});
router.put("/guest/:guestId/items", guestIdParam, productIdBody, quantityRequired, validateRequest, (req, res) => {
  req.params.type = "guest";
  req.params.id = req.params.guestId;
  return cartController.updateItem(req, res);
});

// Remove one item
router.delete("/user/:userId/items", userIdParam, productIdBody, validateRequest, (req, res) => {
  req.params.type = "user";
  req.params.id = req.params.userId;
  return cartController.removeItem(req, res);
});
router.delete("/guest/:guestId/items", guestIdParam, productIdBody, validateRequest, (req, res) => {
  req.params.type = "guest";
  req.params.id = req.params.guestId;
  return cartController.removeItem(req, res);
});

// Replace full cart (send items array)
router.put("/user/:userId", userIdParam, ...replaceItemsBody, validateRequest, (req, res) => {
  req.params.type = "user";
  req.params.id = req.params.userId;
  return cartController.replaceCart(req, res);
});
router.put("/guest/:guestId", guestIdParam, ...replaceItemsBody, validateRequest, (req, res) => {
  req.params.type = "guest";
  req.params.id = req.params.guestId;
  return cartController.replaceCart(req, res);
});

// Clear cart (empty items)
router.delete("/user/:userId/clear", userIdParam, validateRequest, (req, res) => {
  req.params.type = "user";
  req.params.id = req.params.userId;
  return cartController.clearCart(req, res);
});
router.delete("/guest/:guestId/clear", guestIdParam, validateRequest, (req, res) => {
  req.params.type = "guest";
  req.params.id = req.params.guestId;
  return cartController.clearCart(req, res);
});

// Delete cart document
router.delete("/user/:userId", userIdParam, validateRequest, (req, res) => {
  req.params.type = "user";
  req.params.id = req.params.userId;
  return cartController.deleteCart(req, res);
});
router.delete("/guest/:guestId", guestIdParam, validateRequest, (req, res) => {
  req.params.type = "guest";
  req.params.id = req.params.guestId;
  return cartController.deleteCart(req, res);
});

// Merge guest -> user
router.post("/merge", cartController.mergeGuestToUser);

module.exports = router;
