# svoi.back

CMS кальян-бара «СВОИ»: секции главной, шапка и футер, меню, галерея, карточка заведения и заявки.

## Запуск

Весь стек — база, API и сайт — поднимается из корня репозитория:

```bash
docker compose up --build
```

Сайт: `http://localhost:3000`. API: `http://localhost:3001`. Postgres с хоста: `localhost:5433`.

Локально, без контейнеров приложения:

```bash
cp .env.example .env
pnpm install
pnpm prisma:generate
pnpm exec prisma migrate deploy
pnpm exec prisma db seed
pnpm start:dev
```

Сервис слушает `http://localhost:3001`. Публично доступны `GET /api/site`, `POST /api/bookings` и `POST /api/auth/login`. Запись в `/api/admin/*` требует `Authorization: Bearer <accessToken>`.

Сид создаёт администратора `admin` / `password`. Логин возвращает access-токен на 15 минут и refresh-токен на 30 дней. Новую пару даёт `POST /api/auth/refresh` с телом `{ "refreshToken": "..." }`. `POST /api/auth/logout` отзывает refresh-токен.

Координаты в сиде — центр Нижнего Новгорода, пока в карточке заведения не задана настоящая точка.
