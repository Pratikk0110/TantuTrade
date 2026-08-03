# TantuTrade — B2B Textile Marketplace (Prototype)

A hackathon prototype of a B2B textile marketplace connecting fabric buyers and suppliers,
built on the MERN stack.

## Stack
- **Frontend**: React 19 + Vite, React Router, Tailwind CSS v4, lucide-react icons
- **Backend**: Node.js + Express, JWT auth, role-based access control (buyer / supplier)
- **Database**: MongoDB + Mongoose

## Project structure
```
textile-marketplace/
├── backend/          Express REST API
│   ├── config/        DB connection
│   ├── models/        User, BuyerProfile, SupplierProfile, Product, Cart, Order
│   ├── middleware/     JWT auth + role guard
│   ├── controllers/    Business logic per resource
│   ├── routes/         REST endpoints
│   └── seed/           Demo data (2 suppliers, 1 buyer, 8 products)
└── frontend/          React SPA
    └── src/
        ├── pages/       Landing, auth, marketplace, product, cart, checkout,
        │                buyer/* (onboarding, dashboard), supplier/* (onboarding,
        │                dashboard, inventory, orders, profile)
        ├── components/  Navbar, ProductCard, AIAssistantWidget, StatusBadge, etc.
        ├── context/     AuthContext, CartContext
        └── services/    Axios API client
```

## Running locally

### 1. Backend
```bash
cd backend
cp .env.example .env      # edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed               # populates demo suppliers, buyer, and products
npm run dev                # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env       # VITE_API_URL, defaults to http://localhost:5000/api
npm install
npm run dev                 # starts on http://localhost:5173
```

### Demo accounts (after seeding)
| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Supplier | supplier1@demo.com  | password123 |
| Supplier | supplier2@demo.com  | password123 |
| Buyer    | buyer@demo.com      | password123 |

## What's implemented
**Buyer**: landing page, category browsing, search + filters, product grid, product
detail page with similar-product suggestions, AI chat assistant (rule-based NL parsing
of category/fabric/price — swap in a hosted model where noted in `aiController.js`),
conversational onboarding, cart, 3-step checkout (shipping → review → confirmation),
dashboard with current/previous orders.

**Supplier**: conversational onboarding, dashboard (product/order stats + low-stock
alerts), full inventory CRUD with availability toggle, incoming order management with
a pending → accepted → preparing → ready for dispatch → completed status flow,
business profile editor.

**Cross-cutting**: JWT auth with role-based route protection on both API and frontend,
shared MongoDB schema, responsive Tailwind UI with a "shade card" visual motif (dashed
borders + swatch dots) tying the design to the physical textile-sourcing artifacts
(shade cards, spec sheets) the marketplace replaces.

## Out of scope (per brief)
Payment gateway integration, escrow, logistics/delivery integration, admin dashboards.

## Extending the AI assistant
`backend/controllers/aiController.js` currently does lightweight keyword parsing over
the product catalog. To upgrade to a real LLM (e.g. a Hugging Face-hosted model), replace
`parseQuery()` with a call to your model of choice, keeping the same filter-object shape
so the rest of the search/response pipeline is unchanged.
