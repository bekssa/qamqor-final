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
- **Mock credentials**: `ivan@example.com`/`password123` (seek-help); `aigerim@example.com`/`password123` (offer-help); SMS OTP: `1234`
- **Accessibility**: High-contrast mode sets `html` font-size to 22px, stored in localStorage
- **Role-based dashboard**: `seek-help` users see tabbed view with CreateRequestTab (form + active requests table); `offer-help` users see HelperDashboard (welcome banner + active requests + available requests)
- **EditRequestModal**: Opens from "Редактировать" button on active request rows; allows editing service, description, price, date, address
- **CompletionModal**: Opens from "Завершить" button in HelperDashboard; asks if user agreed on initial price (Yes/No); No reveals price input; submits and removes the request from active list
- **HelperDashboard**: Shows active requests with red "Завершить" button; available requests with chat/accept/reject action buttons; filter dropdown for sorting
- **Storage key**: `qamqor-requests-v2-${userId}` with SEED: 4 active, 4 completed, 2 cancelled
- **DatePickerField**: Calendar popup triggered on focus; past dates disabled; strict JS Date validation (non-existent dates → "Такой даты не существует"; past → "Дата не может быть в прошлом")
- **SuccessModal**: Green checkmark modal shown after request creation; text says "Заявка создана!" + "станет доступна помощникам"
- **AddressPickerModal**: 2-step map address picker. Step 1: city selection (Алматы 🏔️ / Астана 🏛️). Step 2: Leaflet map (OpenStreetMap tiles) centered on selected city + search input with Nominatim autocomplete suggestions + "Моё местоположение" geolocation button + click-on-map reverse geocode. Selected city saved to ServiceRequest.city field for region-based helper filtering. Leaflet v1.x installed via pnpm.
- **ServiceRequest.city**: Optional string field storing city name (e.g. "Алматы") alongside address string
- **FindHelpersTab** ("Поиск услуг"): 12 mock helpers in 2-column card grid; search by name/category/description; city dropdown filter (Все города/Алматы/Астана); "Выбрать" flow: if user has active requests without helper → SelectRequestModal (pick request), then ConfirmHelperModal (confirm); after confirm → HelperRequestForm (date+time+comment+price+address picker → "Отправить заявку") → success state → back to grid
- **NotificationsTab** ("Уведомления"): Static mock notifications grouped by Сегодня/Вчера/Ранее; types: accepted (green check), new_response (bell, opens ConfirmHelperModal in response mode with "Отклонить"/"Подтвердить"), reminder (bell), rejected (red X), message (orange bubble); response confirm → "Ваша заявка принята" success state in modal; Вчера section uses 2-column grid layout
- **HelperAvatar**: Colored initials circle component; **StarRating**: Yellow star row component; both reused across search/notifications
- **AccountSettingsTab** ("Настройки аккаунта"): Profile form — avatar upload (file input → object URL preview), role toggle (seek-help/offer-help buttons), city select (Алматы/Астана), Имя/Фамилия inputs, email/phone with inline edit toggle (pen → checkmark), password pen icon → PasswordResetModal, green "сохранить" (disabled when clean); "Категории" section visible only for offer-help role — pills with ✕ to remove, "Добавить ещё" dropdown → CategoryPickerModal (5 category cards with Выбрать/Убрать toggle); "Мои документы" section with "посмотреть" → DocumentsView (table of 3 required docs with загрузить/открыть buttons, Bezopasnost block when all uploaded); "Удалить мой аккаунт" → DeleteAccountModal. Both roles now see all 4 dashboard tabs.
- **updateProfile(updates)**: New method in AuthContext — merges partial User updates into currentUser state and persists to localStorage
- **UnsavedChangesModal**: Tab-level guard in DashboardContent (intercepts tab clicks when settingsDirty + activeTab="settings"); Nav-level guard in DashboardPage (intercepts sidebar nav clicks when settingsDirty). Both show "Несохранённые изменения" modal with "Не сохранять" / "Сохранить" buttons. settingsSaveRef (useRef) plumbed from DashboardPage → DashboardContent → AccountSettingsTab for external save triggering.
