const Cart = require("../models/Cart");

/**
 * Helper: get or create cart by key
 * type = 'user' | 'guest', id = userId or guestId
 */
async function getOrCreateCartBy(type, id) {
  const query = type === "user" ? { userId: id } : { guestId: id };
  let cart = await Cart.findOne(query);
  if (!cart) {
    const payload = type === "user" ? { userId: id } : { guestId: id };
    cart = new Cart({ ...payload, items: [] });
    await cart.save();
  }
  return cart;
}

/* -------------------------
   Controllers
   -------------------------*/

// Add item (merge quantity if exists)
exports.addItem = async (req, res) => {
  try {
    const { type, id } = req.params; // type 'user' or 'guest'
    const { productId, quantity } = req.body;

    // basic type check
    if (type !== "user" && type !== "guest") {
      return res.status(400).json({ error: "Invalid type param (use 'user' or 'guest')" });
    }

    const cart = await getOrCreateCartBy(type, id);

    const found = cart.items.find(i => i.productId === productId);
    if (found) {
      found.quantity = Number(found.quantity) + Number(quantity);
      found.addedAt = new Date();
    } else {
      cart.items.push({ productId, quantity: Number(quantity) });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error("addItem error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type !== "user" && type !== "guest") {
      return res.status(400).json({ error: "Invalid type param (use 'user' or 'guest')" });
    }
    const query = type === "user" ? { userId: id } : { guestId: id };
    const cart = await Cart.findOne(query);
    // Return empty cart shape if not found (useful for frontend)
    if (!cart) {
      return res.status(200).json({ userId: type === "user" ? id : undefined, guestId: type === "guest" ? id : undefined, items: [] });
    }
    return res.status(200).json(cart);
  } catch (err) {
    console.error("getCart error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Update item quantity (set exact)
exports.updateItem = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { productId, quantity } = req.body;

    if (type !== "user" && type !== "guest") {
      return res.status(400).json({ error: "Invalid type param (use 'user' or 'guest')" });
    }

    const cart = await getOrCreateCartBy(type, id);
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return res.status(404).json({ error: "Item not in cart" });

    item.quantity = Number(quantity);
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error("updateItem error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Remove single item
exports.removeItem = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { productId } = req.body;

    if (type !== "user" && type !== "guest") {
      return res.status(400).json({ error: "Invalid type param (use 'user' or 'guest')" });
    }

    const cart = await Cart.findOne(type === "user" ? { userId: id } : { guestId: id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(i => i.productId !== productId);
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error("removeItem error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Clear cart (items -> [])
exports.clearCart = async (req, res) => {
  try {
    const { type, id } = req.params;
    const cart = await Cart.findOne(type === "user" ? { userId: id } : { guestId: id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error("clearCart error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Delete cart document entirely
exports.deleteCart = async (req, res) => {
  try {
    const { type, id } = req.params;
    await Cart.findOneAndDelete(type === "user" ? { userId: id } : { guestId: id });
    return res.status(200).json({ message: "Cart deleted" });
  } catch (err) {
    console.error("deleteCart error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Merge guest cart into user cart and delete guest cart (call this after login)
exports.mergeGuestToUser = async (req, res) => {
  try {
    const { userId, guestId } = req.body;
    if (!userId || !guestId) return res.status(400).json({ error: "userId and guestId are required" });

    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart || guestCart.items.length === 0) {
      return res.status(200).json({ message: "No items in guest cart to merge" });
    }

    let userCart = await Cart.findOne({ userId });
    if (!userCart) userCart = new Cart({ userId, items: [] });

    // merge quantities
    for (const gItem of guestCart.items) {
      const idx = userCart.items.findIndex(i => i.productId === gItem.productId);
      if (idx > -1) {
        userCart.items[idx].quantity = Number(userCart.items[idx].quantity) + Number(gItem.quantity);
      } else {
        userCart.items.push({ productId: gItem.productId, quantity: gItem.quantity });
      }
    }

    await userCart.save();
    await guestCart.deleteOne(); // remove guest cart after merge
    return res.status(200).json({ message: "Merge successful", cart: userCart });
  } catch (err) {
    console.error("mergeGuestToUser error:", err);
    return res.status(500).json({ error: err.message });
  }
};
