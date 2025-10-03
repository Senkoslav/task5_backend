# User Management System - Backend

Система управления пользователями с аутентификацией, построенная на Node.js, Express, TypeScript и PostgreSQL.

## Особенности

- ✅ Регистрация и аутентификация пользователей
- ✅ JWT токены для авторизации
- ✅ Email верификация (асинхронная отправка)
- ✅ Уникальный индекс для email в базе данных
- ✅ Массовые операции (блокировка, разблокировка, удаление)
- ✅ Сортировка пользователей по времени последнего входа
- ✅ Middleware для проверки существования и статуса пользователя
- ✅ Полное удаление пользователей (не маркировка)

## Требования

- Node.js 18+
- PostgreSQL
- npm или yarn

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```

3. Скопируйте файл окружения:
```bash
cp .env-example .env
```

4. Настройте переменные окружения в `.env`:
```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/task5_db"
JWT_SECRET="your-super-secret-jwt-key-here"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="your-email@gmail.com"
FRONTEND_URL="http://localhost:3000"
```

5. Настройте базу данных:
```bash
npm run db:generate
npm run db:push
```

## Запуск

### Режим разработки
```bash
npm run dev
```

### Продакшн
```bash
npm run build
npm start
```

## API Endpoints

### Аутентификация (публичные)
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/verify/:id` - Верификация email

### Управление пользователями (требует аутентификации)
- `GET /api/users` - Получить всех пользователей
- `POST /api/users/block` - Заблокировать пользователей
- `POST /api/users/unblock` - Разблокировать пользователей
- `POST /api/users/delete` - Удалить пользователей
- `DELETE /api/users/unverified` - Удалить неверифицированных пользователей

### Служебные
- `GET /api/health` - Проверка состояния API

## Структура проекта

```
src/
├── controller/         # Контроллеры
├── middleware/         # Middleware функции
├── routes/            # Маршруты API
├── service/           # Бизнес-логика
├── types/             # TypeScript типы
├── utils/             # Утилиты
└── app.ts             # Главный файл приложения
```

## Безопасность

- Пароли хешируются с помощью bcrypt (12 раундов)
- JWT токены с истечением через 24 часа
- Проверка существования и статуса пользователя перед каждым запросом
- Уникальный индекс для email на уровне базы данных
- CORS настроен для фронтенда

## База данных

Схема включает:
- Уникальный индекс для email (требование ТЗ)
- Статусы: UNVERIFIED, ACTIVE, BLOCKED
- Сортировка по времени последнего входа
- Автоматические временные метки

## Email верификация

- Асинхронная отправка email после регистрации
- Поддержка Gmail SMTP
- Ссылки верификации с ID пользователя