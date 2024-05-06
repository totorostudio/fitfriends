## Структура проекта


### Backend

1. Перейдите в директорию `backend`. Все команды ниже запускаются из этой директории.

2. Установите зависимости, выполнив команду `npm install`.

3. Создайте файл `.env`, наполнив его данными аналогично `.env-example`.

4. Запустите докер выполнив `docker-compose up -d`.

5. Сформируйте базу данных и схему призмы, выполнив команду `npm run generate:dev` или `npm run generate:prod`.

6. Наполните базу тестовыми данными, выполнив `npm run seed`. Создастся по 5 пользователей и тренировок. Остальное можно наполнить через Swagger UI интерфейс.

7. Запустите проект в dev-режиме (`npm start`) или в боевом режиме (`npm run start:prod`).

8. Перейдите в API документацию: `http://localhost:3000/api`


### Frontend

- В разработке
