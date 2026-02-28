# SouqCart 🛒

A modern, full-featured multi-vendor e-commerce platform built with Next.js 14, TypeScript, and Prisma. SouqCart enables multiple vendors to sell their products on a unified platform with comprehensive admin controls, vendor dashboards, and a seamless customer shopping experience. Features bilingual support (English/Arabic) with RTL layout support.

## ✨ Key Features

### For Customers
- **Product Browsing**: Browse thousands of products from verified vendors
- **Advanced Search & Filters**: Search with filters by category, price, rating, and more
- **Shopping Cart**: Add products to cart with variant selection
- **Wishlist**: Save favorite products for later
- **Secure Checkout**: Stripe integration for secure payments
- **Order Tracking**: Track order status from placement to delivery
- **Reviews & Ratings**: Read and write product reviews
- **Multi-Address Management**: Save multiple shipping addresses
- **Bilingual Support**: Full support for English and Arabic (RTL)

### For Vendors
- **Vendor Dashboard**: Comprehensive dashboard with analytics
- **Product Management**: Create, edit, and manage product listings
- **Inventory Tracking**: Real-time stock management and low stock alerts
- **Order Management**: View and process vendor-specific orders
- **Revenue Analytics**: Track sales, revenue, and performance metrics
- **Review Management**: Monitor and respond to product reviews
- **Store Customization**: Customize store name, logo, banner, and description

### For Administrators
- **Admin Panel**: Centralized control panel for platform management
- **Vendor Approval**: Review and approve new vendor applications
- **User Management**: Manage customer and vendor accounts
- **Category Management**: Create and organize product categories
- **Order Oversight**: Monitor all platform orders
- **Coupon Management**: Create and manage discount coupons
- **Analytics Dashboard**: Platform-wide sales and performance metrics
- **Commission Settings**: Configure vendor commission rates

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **next-themes** - Dark mode support
- **next-intl** - Internationalization (i18n) for English/Arabic
- **Zustand** - State management for cart and wishlist
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Recharts** - Data visualization for analytics

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication with multiple providers
- **bcryptjs** - Password hashing

### Payment & Media
- **Stripe** - Payment processing
- **Cloudinary** - Image upload and optimization

### Development Tools
- **ESLint** - Code linting
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

**Optional: Seed the database with sample data**

To seed your database, you'll need to create a seed script first. Add a `prisma/seed.ts` file and configure it in `package.json`. See [Prisma seeding documentation](https://www.prisma.io/docs/guides/database/seed-database) for details.

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
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── (storefront)/  # Customer-facing pages
│   │   │   │   ├── page.tsx   # Homepage
│   │   │   │   ├── products/  # Product pages
│   │   │   │   ├── cart/      # Shopping cart
│   │   │   │   ├── checkout/  # Checkout process
│   │   │   │   └── auth/      # Sign in/up pages
│   │   │   └── (dashboard)/   # Authenticated dashboards
│   │   │       ├── account/   # Customer dashboard
│   │   │       ├── vendor/    # Vendor dashboard
│   │   │       └── admin/     # Admin panel
│   │   ├── api/               # API routes
│   │   │   ├── products/      # Product APIs
│   │   │   ├── orders/        # Order APIs
│   │   │   ├── auth/          # Authentication
│   │   │   └── checkout/      # Payment processing
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── storefront/        # Storefront components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # UI components (Radix)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   ├── stripe.ts          # Stripe configuration
│   │   └── utils.ts           # Utility functions
│   ├── store/                 # Zustand state management
│   │   ├── cart.ts            # Cart store
│   │   └── wishlist.ts        # Wishlist store
│   └── types/                 # TypeScript types
├── messages/                   # i18n translations
│   ├── en.json                # English translations
│   └── ar.json                # Arabic translations
└── package.json
```

## 👥 User Roles

The platform supports three user roles:

### 1. **Customer (CUSTOMER)**
- Default role for new users
- Browse and purchase products
- Manage orders, wishlist, and addresses
- Write reviews

### 2. **Vendor (VENDOR)**
- Apply to become a vendor (requires admin approval)
- Access vendor dashboard
- Manage products and inventory
- Process orders
- View analytics and revenue

### 3. **Administrator (ADMIN)**
- Full platform access
- Manage users, vendors, and products
- Configure platform settings
- View platform-wide analytics
- Manage categories and coupons

## 🔌 API Endpoints

### Authentication
- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints (signin, signout, session, etc.)
- User signup is handled through the authentication flow

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (vendor/admin)
- `PUT /api/products/[id]` - Update product (vendor/admin)
- `DELETE /api/products/[id]` - Delete product (vendor/admin)

### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/[id]` - Update order status

### Checkout
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/checkout/webhook` - Handle Stripe webhooks

### Vendors
- `GET /api/vendors` - List vendors
- `POST /api/vendors` - Apply to become vendor
- `PUT /api/vendors/[id]/approve` - Approve vendor (admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin)

See API routes in `src/app/api/` for complete documentation.

## 🌍 Internationalization

The application supports English and Arabic with full RTL support:

- Switch languages using the language selector in the navbar
- All UI text is translated in `messages/en.json` and `messages/ar.json`
- RTL layout automatically applied for Arabic
- Locale-based routing: `/en/*` and `/ar/*`

## 🎨 Theming

- **Light/Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive across all devices
- **Tailwind CSS**: Easily customizable theme via `tailwind.config.ts`

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
- Database URL (use a production PostgreSQL instance)
- NextAuth URL (set to your production domain)
- Stripe keys (use production keys)
- Cloudinary credentials

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
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Media management

## 📧 Contact

For questions or support, please open an issue on GitHub or contact the maintainer.

---

**Built with ❤️ by Abubaker Imran**
