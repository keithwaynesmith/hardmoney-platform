# HardMoney Platform

A comprehensive Next.js 14 application for hard money lending platform built with TypeScript, Tailwind CSS, and Supabase.

## Features

- 🏠 **Loan Management** - Track and manage all your loans from application to payoff
- 📊 **Portfolio Analytics** - Get detailed insights into your lending performance
- 👥 **Borrower Portal** - Self-service portal for applications, documents, and payments
- 🏢 **Property Valuation** - Integrated property valuation tools
- ✅ **Compliance Tools** - Automated document generation and regulatory reporting
- 💳 **Payment Processing** - Secure payment processing with automated reminders

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hardmoney-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your Supabase project:
   - Create a new Supabase project
   - Copy your project URL and anon key to `.env.local`
   - Set up your database schema

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── supabase/         # Supabase client configurations
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware for auth
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.






