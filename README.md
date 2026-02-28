# SouqCart 🛒

A modern, full-featured multi-vendor e-commerce platform built with Next.js 14, TypeScript, and Prisma. SouqCart enables multiple vendors to sell their products on a unified platform with comprehensive admin controls, vendor dashboards, and a seamless customer shopping experience. Features bilingual support (English/Arabic) with RTL layout support.

## ✨ Key Features

### For Customers
- **Product Browsing**: Browse products from verified vendors with detailed product pages
- **Advanced Search & Filters**: Dedicated search page with filters by category, price, rating, and more
- **Category & Vendor Browsing**: Explore products by category or browse vendor storefronts
- **Shopping Cart**: Add products to cart with variant selection (persisted via Zustand)
- **Wishlist**: Save favorite products for later (persisted via Zustand)
- **Secure Checkout**: Stripe integration for secure payments with order confirmation page
- **Order Tracking**: Track order status from placement to delivery, with cancellation support
- **Reviews & Ratings**: Read and write product reviews
- **Multi-Address Management**: Save multiple shipping addresses
- **Bilingual Support**: Full support for English and Arabic with RTL layout
- **Dark Mode**: Toggle between light and dark themes

### For Vendors
- **Vendor Dashboard**: Comprehensive dashboard with sales overview and analytics
- **Product Management**: Create, edit, and manage product listings with image uploads
- **Inventory Tracking**: Real-time stock management and low stock alerts
- **Order Management**: View and process vendor-specific orders
- **Revenue Analytics**: Track sales, revenue, and performance metrics with charts (Recharts)
- **Review Management**: Monitor product reviews
- **Store Settings**: Customize store name, logo, banner, and description

### For Administrators
- **Admin Panel**: Centralized control panel for platform management with analytics charts
- **Vendor Approval**: Review and approve new vendor applications
- **User Management**: Manage customer and vendor accounts with search/filtering
- **Product Oversight**: View and manage all platform products with search/filtering
- **Category Management**: Create, edit, and organize product categories
- **Order Oversight**: Monitor all platform orders
- **Coupon Management**: Create and manage discount coupons with validation
- **Analytics Dashboard**: Platform-wide sales and performance metrics
- **Platform Settings**: Configure commission rates and platform-wide settings

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives (25+ components via shadcn/ui pattern)
- **Lucide React** - Icon library
- **next-themes** - Dark mode support
- **next-intl** - Internationalization (i18n) for English/Arabic with RTL
- **Zustand** - Persistent state management for cart, wishlist, and UI state
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Recharts** - Data visualization for analytics dashboards
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - 25 RESTful API endpoints
- **Prisma** - Type-safe database ORM (15 models, 4 enums)
- **PostgreSQL** - Primary database
- **NextAuth.js v4** - Authentication with Google OAuth + Credentials providers
- **bcryptjs** - Password hashing

### Payment & Media
- **Stripe** - Payment processing (Checkout Sessions API + webhooks)
- **Cloudinary** - Image upload and optimization

### Development Tools
- **ESLint** - Code linting (Next.js config)
- **TypeScript** - Static type checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** (v13 or higher)
- **Git**

You'll also need accounts for:
- **Stripe** (for payment processing)
- **Cloudinary** (for image uploads)
- **Google OAuth** (optional, for social login)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AbubakerImran/souqcart.git
cd souqcart
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/souqcart"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Database Setup

Run Prisma migrations to set up your database schema:

```bash
npx prisma generate
npx prisma db push
# or for production
npx prisma migrate deploy
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
souqcart/
├── prisma/
│   └── schema.prisma              # Database schema (15 models, 4 enums)
├── messages/                       # i18n translation files
│   ├── en.json                    # English translations (300+ keys)
│   └── ar.json                    # Arabic translations (300+ keys)
├── src/
│   ├── i18n.ts                    # Internationalization config
│   ├── middleware.ts              # Next.js middleware (locale routing)
│   ├── app/
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global styles
│   │   ├── [locale]/              # Internationalized routes
│   │   │   ├── layout.tsx         # Locale layout (RTL support)
│   │   │   ├── not-found.tsx      # 404 page
│   │   │   ├── (storefront)/      # Customer-facing pages
│   │   │   │   ├── layout.tsx     # Storefront layout (navbar + footer)
│   │   │   │   ├── page.tsx       # Homepage
│   │   │   │   ├── products/      # Product listing & detail pages
│   │   │   │   ├── categories/    # Category listing & detail pages
│   │   │   │   ├── vendors/       # Vendor listing & detail pages
│   │   │   │   ├── search/        # Search results page
│   │   │   │   ├── cart/          # Shopping cart
│   │   │   │   ├── checkout/      # Checkout & order success pages
│   │   │   │   ├── auth/          # Sign in & sign up pages
│   │   │   │   ├── about/         # About page
│   │   │   │   ├── contact/       # Contact page
│   │   │   │   ├── privacy/       # Privacy policy page
│   │   │   │   └── terms/         # Terms of service page
│   │   │   └── (dashboard)/       # Authenticated dashboards
│   │   │       ├── account/       # Customer dashboard
│   │   │       │   ├── page.tsx       # Account overview
│   │   │       │   ├── profile/       # Profile settings
│   │   │       │   ├── orders/        # Order history & detail
│   │   │       │   ├── addresses/     # Address management
│   │   │       │   └── wishlist/      # Saved items
│   │   │       ├── vendor/        # Vendor dashboard
│   │   │       │   ├── page.tsx       # Dashboard overview
│   │   │       │   ├── products/      # Product CRUD (list/new/edit)
│   │   │       │   ├── orders/        # Vendor order management
│   │   │       │   ├── analytics/     # Revenue analytics
│   │   │       │   ├── reviews/       # Review monitoring
│   │   │       │   └── settings/      # Store settings
│   │   │       └── admin/         # Admin panel
│   │   │           ├── page.tsx       # Admin overview
│   │   │           ├── users/         # User management
│   │   │           ├── vendors/       # Vendor approval
│   │   │           ├── products/      # Product oversight
│   │   │           ├── orders/        # Order management
│   │   │           ├── categories/    # Category management
│   │   │           ├── coupons/       # Coupon management
│   │   │           ├── analytics/     # Platform analytics
│   │   │           └── settings/      # Platform settings
│   │   └── api/                   # 25 RESTful API routes
│   │       ├── auth/              # NextAuth.js authentication
│   │       ├── products/          # Product CRUD
│   │       ├── categories/        # Category CRUD
│   │       ├── vendors/           # Vendor management & approval
│   │       ├── orders/            # Order management & cancellation
│   │       ├── checkout/          # Stripe checkout & webhooks
│   │       ├── users/             # User management
│   │       ├── addresses/         # Address CRUD
│   │       ├── reviews/           # Product reviews
│   │       ├── wishlist/          # Wishlist operations
│   │       ├── coupons/           # Coupon CRUD & validation
│   │       ├── search/            # Product search
│   │       ├── upload/            # Image uploads (Cloudinary)
│   │       └── analytics/         # Admin & vendor analytics
│   ├── components/
│   │   ├── layout/                # Navbar, footer, dashboard sidebars
│   │   ├── storefront/            # Hero banner, product card, category grid, etc.
│   │   ├── shared/                # Auth & theme providers
│   │   └── ui/                    # 25 UI components (shadcn/ui + Radix)
│   ├── lib/
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── stripe.ts              # Stripe client (lazy initialization)
│   │   └── utils.ts               # Utility functions (cn helper)
│   ├── store/                     # Zustand state management
│   │   ├── cart.ts                # Shopping cart (persisted)
│   │   ├── wishlist.ts            # Wishlist (persisted)
│   │   └── ui.ts                  # UI state (mobile menu, cart drawer, search)
│   └── types/
│       └── next-auth.d.ts         # NextAuth type extensions
└── package.json
```

## 🗄️ Database Schema

The Prisma schema defines **15 models** and **4 enums**:

### Models
| Model | Description |
|-------|-------------|
| `User` | User accounts with role-based access |
| `Account` | OAuth provider accounts (NextAuth adapter) |
| `Session` | User sessions (NextAuth adapter) |
| `VerificationToken` | Email verification tokens |
| `Vendor` | Vendor profiles and store information |
| `Product` | Product listings with descriptions and pricing |
| `ProductImage` | Product image gallery |
| `ProductVariant` | Product variants (size, color, etc.) |
| `Category` | Self-referential product categories |
| `Review` | Customer product reviews and ratings |
| `Address` | Customer shipping addresses |
| `Order` | Customer orders with status tracking |
| `OrderItem` | Individual items within an order |
| `Wishlist` | Customer saved products |
| `Coupon` | Discount coupons with validation rules |

### Enums
- **`Role`**: `CUSTOMER`, `VENDOR`, `ADMIN`
- **`OrderStatus`**: Order lifecycle states
- **`PaymentStatus`**: Payment processing states
- **`CouponType`**: Discount types (percentage, fixed amount)

## 👥 User Roles

The platform supports three user roles:

### 1. Customer (CUSTOMER)
- Default role for new users
- Browse products, categories, and vendor stores
- Search for products
- Manage shopping cart and wishlist
- Place orders with Stripe checkout
- Track and cancel orders
- Manage shipping addresses
- Write product reviews

### 2. Vendor (VENDOR)
- Apply to become a vendor (requires admin approval)
- Access vendor dashboard with sales overview
- Create, edit, and manage product listings
- Upload product images via Cloudinary
- Process and manage orders
- View revenue analytics with charts
- Monitor product reviews
- Configure store settings

### 3. Administrator (ADMIN)
- Full platform access and control
- Approve or reject vendor applications
- Manage all users, vendors, and products
- Create and organize product categories
- Monitor all platform orders
- Create and manage discount coupons
- View platform-wide analytics
- Configure platform settings and commissions

## 🔌 API Endpoints

All API routes are located in `src/app/api/` and follow a consistent response shape with role-based auth guards and Zod validation.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| - | `/api/auth/[...nextauth]` | NextAuth.js handler (signin, signout, session, callbacks) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List products with filters |
| `POST` | `/api/products` | Create product (vendor/admin) |
| `GET` | `/api/products/[id]` | Get product details |
| `PUT` | `/api/products/[id]` | Update product (vendor/admin) |
| `DELETE` | `/api/products/[id]` | Delete product (vendor/admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | List categories |
| `POST` | `/api/categories` | Create category (admin) |
| `GET` | `/api/categories/[id]` | Get category details |
| `PUT` | `/api/categories/[id]` | Update category (admin) |
| `DELETE` | `/api/categories/[id]` | Delete category (admin) |

### Vendors
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/vendors` | List vendors |
| `POST` | `/api/vendors` | Apply to become a vendor |
| `GET` | `/api/vendors/[id]` | Get vendor details |
| `PUT` | `/api/vendors/[id]` | Update vendor profile |
| `PUT` | `/api/vendors/[id]/approve` | Approve vendor (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | List user orders |
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders/[id]` | Get order details |
| `PUT` | `/api/orders/[id]` | Update order status |
| `POST` | `/api/orders/[id]/cancel` | Cancel order |

### Checkout
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/checkout` | Create Stripe checkout session |
| `POST` | `/api/checkout/webhook` | Handle Stripe webhooks |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List users (admin) |
| `GET` | `/api/users/[id]` | Get user details |
| `PUT` | `/api/users/[id]` | Update user |
| `DELETE` | `/api/users/[id]` | Delete user (admin) |

### Addresses
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/addresses` | List user addresses |
| `POST` | `/api/addresses` | Create address |
| `PUT` | `/api/addresses/[id]` | Update address |
| `DELETE` | `/api/addresses/[id]` | Delete address |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews` | List reviews |
| `POST` | `/api/reviews` | Create review |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wishlist` | Get user wishlist |
| `POST` | `/api/wishlist` | Add/remove wishlist item |

### Coupons
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/coupons` | List coupons (admin) |
| `POST` | `/api/coupons` | Create coupon (admin) |
| `POST` | `/api/coupons/validate` | Validate coupon code |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search` | Search products |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload image to Cloudinary |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/admin` | Platform-wide analytics (admin) |
| `GET` | `/api/analytics/vendor` | Vendor-specific analytics |

## 🌍 Internationalization

The application supports English and Arabic with full RTL support:

- **next-intl v3** for locale management and translations
- Switch languages using the language selector in the navbar
- All UI text is translated in `messages/en.json` and `messages/ar.json` (300+ keys each)
- RTL layout automatically applied for Arabic via `dir="rtl"` on the HTML element
- Locale-based routing: `/en/*` and `/ar/*`
- Middleware handles locale detection and redirects

## 🎨 Theming

- **Light/Dark Mode**: Toggle between light and dark themes via `next-themes`
- **Responsive Design**: Fully responsive across all devices
- **Tailwind CSS**: Customizable theme via `tailwind.config.ts`
- **shadcn/ui Components**: 25 accessible UI components built with Radix UI primitives

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AbubakerImran/souqcart)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `DATABASE_URL` — Production PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random secret key
- `NEXTAUTH_URL` — Your production domain URL
- `STRIPE_SECRET_KEY` — Stripe production secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe production publishable key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `GOOGLE_CLIENT_ID` — Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret (optional)

### Database Migration

For production, use Prisma migrations:

```bash
npx prisma migrate deploy
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [shadcn/ui](https://ui.shadcn.com/) - UI component patterns
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Media management
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## 📧 Contact

For questions or support, please open an issue on GitHub or contact the maintainer.

---

**Built with ❤️ by Abubaker Imran**
