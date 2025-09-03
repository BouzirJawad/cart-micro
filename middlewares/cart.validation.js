const { body, param } = require("express-validator");

/**
 * We'll provide re-usable validators for the routes.
 * - productId must be a non-empty string
 * - quantity must be int >= 1
 * - userId/guestId path params must be present
 */

// Path param validators
const userIdParam = param("userId").notEmpty().withMessage("userId is required");
const guestIdParam = param("guestId").notEmpty().withMessage("guestId is required");

// Body validators
const productIdBody = body("productId").notEmpty().withMessage("productId is required").isString();
const quantityRequired = body("quantity")
  .notEmpty().withMessage("quantity is required")
  .isInt({ min: 1 }).withMessage("quantity must be an integer >= 1");

const replaceItemsBody = [
  body("items").isArray().withMessage("items must be an array"),
  body("items.*.productId").notEmpty().withMessage("each item.productId is required"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("each item.quantity must be >=1")
];

module.exports = {
  userIdParam,
  guestIdParam,
  productIdBody,
  quantityRequired,
  replaceItemsBody
};
