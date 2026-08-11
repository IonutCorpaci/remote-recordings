# 📋 Remote Recordings — Чеклист задач

> Пошаговый план действий. Без кода, только задачи.
> Рекомендую выполнять строго в этом порядке — каждая следующая фаза зависит от предыдущей.
>
> **Подход:** Server Actions для всего CRUD, API Routes только для auth (им нужен ручной контроль cookies).
> **БД при разработке:** SQLite. При деплое — переключить на PostgreSQL (изменить provider + DATABASE_URL).

---

## Фаза 1: База данных (~1-2ч)
- [x] Установить `prisma` и `@prisma/client`
- [x] Запустить `npx prisma init --datasource-provider sqlite`
- [x] Написать Prisma Schema по модели из `PLAN.md` (User, RefreshToken, Trip, Car, Participant)
- [x] Заменить `enum` на `String` (SQLite не поддерживает enum — валидировать через Zod)
- [x] Запустить первую миграцию `npx prisma migrate dev --name init`
- [x] Создать файл Prisma Client Singleton (`src/lib/prisma.ts`)
- [x] Проверить через `npx prisma studio` что таблицы создались

---

## Фаза 2: Аутентификация (~4-6ч)
- [x] Установить зависимости: `jose`, `bcryptjs`, `zod` + типы
- [x] Добавить `JWT_SECRET` в `.env`
- [x] Создать утилиту хеширования паролей (`src/features/auth/utils/password.ts`)
- [x] Создать утилиту для JWT — sign/verify с помощью `jose` (`src/features/auth/utils/jwt.ts`)
- [x] Создать утилиту управления cookies — set/get/clear HttpOnly cookies (`src/features/auth/utils/session.ts`)
- [x] Создать Zod-схемы валидации для login и register (`src/features/auth/validations/authSchema.ts`)
- [x] Реализовать API Route: `POST /api/auth/register`
- [x] Реализовать API Route: `POST /api/auth/login`
~~- [x] Реализовать API Route: `POST /api/auth/refresh` (ротация токенов)~~ (Отменено, перешли на 30-дневный токен)
- [x] Реализовать API Route: `POST /api/auth/logout`
- [x] Реализовать API Route: `GET /api/auth/me` (текущий юзер)
- [x] Создать `src/middleware.ts` — защита маршрутов (пропускать `/login`, `/register`, `/share`)
- [x] Подключить форму Login к API
- [x] Подключить форму Register к API
- [x] Проверить полный цикл: register → login → refresh → logout → redirect

---

## Фаза 3: CRUD Поездок (~2-3ч)
- [x] Создать Zod-схемы для создания/обновления поездки (`src/features/trips/validations/tripSchema.ts`)
- [x] Создать файл Server Actions для поездок (`src/features/trips/actions/trips.ts`)
- [x] Реализовать Server Action: `getTrips()` — список всех поездок
- [x] Реализовать Server Action: `createTrip(formData)` — создание поездки
- [x] Реализовать Server Action: `getTrip(id)` — одна поездка со всеми связями
- [x] Реализовать Server Action: `updateTrip(id, formData)` — обновление
- [x] Реализовать Server Action: `deleteTrip(id)` — удаление
- [x] Подключить Dashboard (`page.tsx`) — загрузка данных через Server Component напрямую из Prisma
- [x] Подключить форму создания поездки — вызывать Server Action, редирект на поездку
- [x] Проверить: создать поездку → увидеть её на дашборде → открыть → удалить

---

## Фаза 4: Участники и Машины (~3-4ч)
- [x] Создать файл Server Actions для участников (`src/features/participants/actions.ts`)
- [x] Реализовать Server Action: `addParticipant(tripId, name, phone?)` — добавить участника
- [x] Реализовать Server Action: `removeParticipant(participantId)` — удалить участника
- [x] Создать файл Server Actions для машин (`src/features/cars/actions.ts`)
- [x] Реализовать Server Action: `addCar(tripId, driverId | newDriverName, carModel?, totalSeats)` — добавить машину
- [x] Реализовать Server Action: `removeCar(carId)` — удалить машину (пассажиры → «не распределены»)
- [x] Реализовать Server Action: `assignParticipant(participantId, carId | null)` — назначить/убрать из машины
- [x] При назначении — проверять количество свободных мест
- [x] Подключить страницу Trip Detail к реальным данным (разделить на Server + Client Component)
- [x] Подключить инпут «Добавить участника» к Server Action
- [x] Подключить модальное окно «Добавить машину» к Server Action
- [ ] Проверить: добавить людей → добавить машину → назначить участника в машину → удалить

---

## Фаза 5: Drag-and-Drop (~4-6ч)
- [x] Установить `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- [x] Обернуть доску распределения в `<DndContext>`
- [x] Карточки участников сделать draggable
- [x] Машины и колонку «Не распределены» сделать droppable
- [x] В `onDragEnd` вызывать Server Action `assignParticipant()`
- [x] Добавить визуальную обратную связь при перетаскивании (подсветка drop-зоны)
- [x] Протестировать на мобильном (touch events)

---

## Фаза 6: Публичная ссылка (~1-2ч)
- [x] Сделать `share/[token]/page.tsx` серверным компонентом — загружать данные напрямую из Prisma по shareToken
- [x] Реализовать кнопку «Поделиться ссылкой» — копировать URL в буфер обмена
- [x] Добавить toast-уведомление «Ссылка скопирована»
- [x] Убедиться что middleware пропускает `/share/*` без авторизации

---

## Фаза 7: PWA (~1-2ч)
- [x] Создать `src/app/manifest.ts` (название, иконки, цвета, display: standalone)
- [x] Сгенерировать иконки 192x192 и 512x512 из `logo.png`, положить в `public/icons/`
- [x] Создать минимальный Service Worker в `public/sw.js`
- [x] Зарегистрировать Service Worker в root layout
- [x] Собрать production билд (`npm run build && npm start`)
- [x] Проверить в Chrome DevTools → Application → проверить что Manifest и SW работают
- [x] Попробовать установить на телефон

---

## Фаза 8: Полировка (~2-3ч)
- [x] Добавить Loading States (скелетоны при загрузке данных)
- [x] Добавить Error States (красивые сообщения об ошибках)
- [x] Добавить Toast-уведомления (успех/ошибка после действий)
- [x] Добавить подтверждение при удалении (поездки, машины, участника)
- [x] Проверить адаптивность на разных размерах экрана
- [x] Запустить `npm run build` — убедиться что нет ошибок TypeScript
- [x] Запустить `npm run lint` — убедиться что нет ошибок ESLint

---

## Фаза 9: Деплой (~1-2ч)
- [ ] Создать PostgreSQL базу для production (Neon.tech)
- [ ] В `schema.prisma` сменить `provider` на `"postgresql"` и `url` на `env("DATABASE_URL")`
- [ ] Создать репозиторий на GitHub, запушить код
- [ ] Подключить репозиторий к Vercel
- [ ] Добавить environment variables в Vercel (`DATABASE_URL`, `JWT_SECRET`)
- [ ] Запустить `npx prisma migrate deploy` на production базе
- [ ] Проверить работу на живом домене
- [ ] Установить PWA на телефон с production URL

---

## Итого

| Фаза | Время |
|:---|:---|
| 1. База данных | 1-2ч |
| 2. Аутентификация | 4-6ч |
| 3. CRUD Поездок | 2-3ч |
| 4. Участники и Машины | 3-4ч |
| 5. Drag-and-Drop | 4-6ч |
| 6. Публичная ссылка | 1-2ч |
| 7. PWA | 1-2ч |
| 8. Полировка | 2-3ч |
| 9. Деплой | 1-2ч |
| **Итого** | **~20-30ч** |
