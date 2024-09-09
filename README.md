This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

You need node installed on your computer to run this project locally.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

You'll also likely want to set up a `.env.development.local` file in the root directory with the required environment variables (e.g. `DATABASE_URL`)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## @prisma/client/sql Import Errors

If you're having issues with import errors associated with the above file, you may need to generate the SQL for prisma.
This can be done with:
```bash
 npx prisma generate --sql
```

If it's not seeing your local env variables, you may install dotenv (`npm install -g dotenv-cli`) and run it with:
```bash
 dotenv -e .env.development.local -- npx prisma generate --sql
```

## Current endpoints

By default, we set the URL on https://tsalpha.klckh.com/api/game-results, but it is configurable

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
