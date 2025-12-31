# BTC Jobs - Bitcoin Community Job Portal

A wallet-based job portal for the Bitcoin community built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- 🔐 **Wallet-Based Identity** - No emails or passwords, just connect your wallet
- 👤 **Seeker Profiles** - Showcase skills, bio, and project links
- 🔍 **Talent Discovery** - Find skilled individuals in the Bitcoin ecosystem
- 🔒 **Privacy First** - Contact info hidden until explicitly revealed
- ⭐ **Endorsements** - Community-based reputation system (placeholder)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Wallet-based (RainbowKit + Wagmi)
- **UI Components**: shadcn/ui inspired

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- WalletConnect Project ID (get from [WalletConnect Cloud](https://cloud.walletconnect.com))

### Installation

1. Clone the repository and install dependencies:

```bash
cd btc-jobs
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database URL and WalletConnect project ID.

3. Generate Prisma client and push schema:

```bash
npm run db:generate
npm run db:push
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
btc-jobs/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── onboarding/
│   │   └── seeker/
│   │       └── page.tsx    # Seeker onboarding flow
│   └── seekers/
│       └── page.tsx        # Talent discovery page
├── components/
│   ├── navigation.tsx      # Header with wallet connect
│   ├── providers.tsx       # Web3 providers wrapper
│   ├── seeker-card.tsx     # Seeker profile card
│   ├── seeker-onboarding-form.tsx
│   └── ui/                 # shadcn/ui components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── tag-input.tsx
│       └── textarea.tsx
├── actions/
│   └── auth.ts             # Server actions for auth & profiles
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── utils.ts            # Utility functions
│   └── wagmi.ts            # Wagmi/RainbowKit config
└── prisma/
    └── schema.prisma       # Database schema
```

## Database Schema

### User Model
- `walletAddress` (unique) - User's wallet address
- `role` - SEEKER or EMPLOYER

### Profile Model
- `name` - Display name
- `bio` - User bio/description
- `telegramHandle` - Contact (hidden until revealed)
- `skillTags` - Array of skill strings
- `projectLinks` - JSON array of project links
- `endorsements` - Count of community endorsements

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero and features |
| `/seekers` | Talent discovery grid |
| `/onboarding/seeker` | Multi-step seeker profile creation |

## Server Actions

- `authenticateWithWallet()` - Verify signature and upsert user
- `saveProfile()` - Create/update seeker profile
- `getSeekers()` - Fetch all seekers with profiles
- `revealTelegramHandle()` - Reveal contact info (for employers)

## Customization

### Adding New Skills
Edit the `commonSkills` array in `components/ui/tag-input.tsx`.

### Theming
Modify CSS variables in `app/globals.css` and Tailwind config in `tailwind.config.ts`.

## Next Steps

- [ ] Implement employer onboarding flow
- [ ] Add endorsement system with on-chain verification
- [ ] Integrate Lightning payments for contact reveals
- [ ] Add job posting functionality
- [ ] Implement search and filtering
- [ ] Add notifications via Telegram bot

## License

MIT
