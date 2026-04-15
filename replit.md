# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Qamqor (artifacts/qamqor)

React + Vite landing page for a Kazakhstan-based care platform connecting volunteers/helpers with elderly people and people with special needs.

### Architecture: Feature-Sliced Design (FSD)

```
src/
├── app/                    # App initialization
│   ├── index.tsx           # Root App component
│   ├── providers.tsx       # All React providers combined
│   ├── router.tsx          # Route definitions (wouter)
│   └── guards/
│       └── auth-guard.tsx  # AuthGuard HOC for protected routes
├── pages/                  # Page-level components
│   ├── home/index.tsx      # Landing page
│   ├── auth/
│   │   ├── index.tsx       # Login + Register (tabs)
│   │   ├── verify/index.tsx     # SMS OTP verification
│   │   ├── forgot/index.tsx     # Forgot password
│   │   └── reset/index.tsx      # Reset password
│   └── not-found/index.tsx
├── widgets/                # Large independent UI blocks
│   ├── navbar/index.tsx
│   ├── footer/index.tsx
│   ├── hero/index.tsx      # Auth-guarded CTA buttons
│   ├── how-it-works/index.tsx
│   ├── find-helpers/index.tsx
│   ├── advantages/index.tsx
│   ├── testimonials/index.tsx
│   └── cta-banner/index.tsx    # Auth-guarded CTA buttons
├── features/               # Business features
│   ├── auth/model/context.tsx          # AuthContext + MOCK_OTP_CODE="1234"
│   ├── accessibility/model/context.tsx # High-contrast mode (22px font)
│   └── language/model/context.tsx      # i18n (RU/KZ/EN, localStorage)
├── entities/
│   └── user/api/mock-users.json        # Mock user data
└── shared/
    └── lib/i18n/translations.ts        # All translations (RU/KZ/EN)
```

Shadcn/ui components remain in `src/components/ui/` — accessible via `@shared/ui/*` alias.

### Path Aliases (vite.config.ts + tsconfig.json)
- `@shared/ui` → `src/components/ui` (shadcn components)
- `@shared` → `src/shared`
- `@features` → `src/features`
- `@widgets` → `src/widgets`
- `@entities` → `src/entities`
- `@pages` → `src/pages`
- `@app` → `src/app`
- `@` → `src` (legacy, for shadcn internal imports)

### Key Behavior
- **Auth guard**: `AuthGuard` HOC in `src/app/guards/` checks `currentUser` from AuthContext
- **Landing buttons**: Hero ("Найти помощника", "Предложить помощь") and CTABanner ("Зарегистрироваться", "Найти помощника") redirect to `/auth` if user is not logged in
- **Registration roles**: 2 options — "Я хочу найти помощника" (`seek-help`) / "Я хочу помочь" (`offer-help`)
- **Mock credentials**: email `ivan@example.com` / password `password123`; SMS OTP: `1234`
- **Accessibility**: High-contrast mode sets `html` font-size to 22px, stored in localStorage
