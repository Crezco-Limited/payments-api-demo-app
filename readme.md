> [!WARNING]
> This is demo application and is not designed for production usage, it is purely meant for demo purposes

# Crezco API demo

An example demo app that allows the test usage of Crezco's account's payable partner API

## Features

- Create and manage organisations
- Connect bank accounts
- Process payments
- Multi-step form workflow

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment variables:

```bash
cp .env.example .env.local
```

3. Add your environment variables to `.env.local`:

Contact us for these

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
