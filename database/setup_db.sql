-- Создание базы данных для Ski Concierge
-- Выполните этот скрипт от имени superuser (postgres)

-- Создать базу данных
CREATE DATABASE ski_concierge
    WITH 
    OWNER = infokurort_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'Russian_Russia.1251'
    LC_CTYPE = 'Russian_Russia.1251'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Подключиться к новой базе
\c ski_concierge

-- Установить расширение pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Дать права пользователю
GRANT ALL PRIVILEGES ON DATABASE ski_concierge TO infokurort_user;
GRANT ALL ON SCHEMA public TO infokurort_user;

-- Проверка
SELECT version();
SELECT * FROM pg_extension WHERE extname = 'vector';
