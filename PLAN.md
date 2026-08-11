# 🚗 Remote Recordings — Приложение для организации еженедельных поездок

Веб-приложение (PWA) для управления еженедельными поездками с друзьями: кто едет, кто с машинами, сколько мест, распределение пассажиров по машинам.

## Стек

| Технология | Версия / Детали |
|:---|:---|
| **Next.js** | Latest (App Router, Turbopack) |
| **TypeScript** | Strict mode |
| **Prisma** | ORM + PostgreSQL |
| **Tailwind CSS** | v4 (CSS-first конфигурация) |
| **JWT Auth** | HttpOnly cookies, access + refresh tokens |
| **PWA** | Manifest + Service Worker |

---

## Архитектура и модели данных (Для самостоятельной реализации)

### Основные сущности (Prisma Schema)

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(ADMIN)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Trip {
  id          String   @id @default(cuid())
  title       String              // "Поездка в Кишинёв"
  destination String              // Город назначения
  date        DateTime            // Дата поездки
  status      TripStatus @default(PLANNING)
  shareToken  String   @unique @default(cuid())  // Для публичной ссылки
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  cars         Car[]
  participants Participant[]
}

model Car {
  id          String   @id @default(cuid())
  carModel    String?            // "BMW X5", опционально
  totalSeats  Int                // Всего мест (включая водителя)
  tripId      String
  trip        Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)

  driverId    String      @unique
  driver      Participant @relation("CarDriver", fields: [driverId], references: [id], onDelete: Cascade)

  passengers  Participant[] @relation("CarPassengers")

  createdAt   DateTime @default(now())
}

model Participant {
  id        String   @id @default(cuid())
  name      String             // Имя участника
  phone     String?            // Телефон (опционально)
  tripId    String
  trip      Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  carId     String?            // null = не распределён
  car       Car?     @relation("CarPassengers", fields: [carId], references: [id], onDelete: SetNull)

  ownedCar  Car?     @relation("CarDriver")

  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
}

enum TripStatus {
  PLANNING    // В процессе планирования
  CONFIRMED   // Подтверждена
  COMPLETED   // Завершена
  CANCELLED   // Отменена
}
```

---

## Структура проекта (Feature-Sliced подход)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Страница входа
│   │   └── register/page.tsx       # Страница регистрации (одноразовая)
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Layout с навигацией (protected)
│   │   ├── page.tsx                # Dashboard — список поездок
│   │   └── trips/
│   │       ├── new/page.tsx        # Создание поездки
│   │       └── [id]/
│   │           ├── page.tsx        # Детали поездки + управление
│   │           └── edit/page.tsx   # Редактирование поездки
│   ├── share/
│   │   └── [token]/page.tsx        # Публичная страница (без авторизации)
│   ├── api/                        # API Routes (бэкенд)
│   ├── manifest.ts                 # PWA manifest
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Tailwind v4 imports + тема
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth/                       # Логика аутентификации
│   ├── validations/                # Zod схемы
│   └── utils.ts                    # cn(), formatDate() и т.д.
├── components/
│   ├── ui/                         # Переиспользуемые UI компоненты
│   ├── layout/                     # Header, Sidebar, MobileNav
│   └── features/                   # Компоненты фич (Trips, Cars, Participants)
├── hooks/                          # React hooks
├── types/                          # TypeScript типы
└── middleware.ts                   # Route protection
```

---

## UI/UX Дизайн (Уже сверстано ✅)

- **Тёмная тема** как основная (mobile-first)
- **Glassmorphism** эффекты для карточек
- **Градиенты** для акцентных элементов
- **Шрифт**: Inter (Google Fonts)
- **Анимации**: Smooth transitions, micro-interactions
- **Mobile-first**: Bottom navigation bar

### Ключевые экраны (готовы)
1. ✅ Вход/Регистрация
2. ✅ Dashboard — список поездок
3. ✅ Детали поездки — доска распределения
4. ✅ Модальное окно добавления машины
5. ✅ Публичная страница для друзей
6. ✅ Настройки
