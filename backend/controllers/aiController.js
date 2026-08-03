const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Very lightweight NL "understanding": pulls out category/fabric/price hints from free text
// and reuses normal DB queries. Swap this out for a real hosted LLM (e.g. via Hugging Face
// Inference API) by replacing parseQuery() with a model call that returns the same shape.
function parseQuery(message) {
  const text = message.toLowerCase();
  const filters = {};

  const priceMatch = text.match(/under\s+(\d+)/) || text.match(/below\s+(\d+)/);
  if (priceMatch) filters.maxPrice = Number(priceMatch[1]);

  const knownFabrics = ['cotton', 'silk', 'linen', 'denim', 'wool', 'polyester', 'chiffon', 'velvet', 'satin'];
  const foundFabric = knownFabrics.find((f) => text.includes(f));
  if (foundFabric) filters.fabricType = foundFabric;

  // Anything left over becomes a free-text search term
  filters.search = message;
  return filters;
}

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'message is required' });

  const filters = parseQuery(message);
  const query = { status: 'available' };
  if (filters.fabricType) query.fabricType = new RegExp(filters.fabricType, 'i');
  if (filters.maxPrice) query.price = { $lte: filters.maxPrice };
  if (filters.search) query.$text = { $search: filters.search };

  let items = await Product.find(query).limit(6);
  if (items.length === 0) {
    // fall back to a looser search if the strict query returns nothing
    items = await Product.find({ status: 'available' }).sort({ featured: -1 }).limit(6);
  }

  const reply = items.length
    ? `Here are some options that match "${message}".`
    : `I couldn't find an exact match for "${message}", but here are some popular picks.`;

  res.json({ reply, products: items });
});

const compare = asyncHandler(async (req, res) => {
  const { productIds } = req.body;
  if (!Array.isArray(productIds) || productIds.length < 2) {
    return res.status(400).json({ message: 'Provide at least 2 productIds to compare' });
  }
  const products = await Product.find({ _id: { $in: productIds } });
  res.json({ products });
});

module.exports = { chat, compare };
