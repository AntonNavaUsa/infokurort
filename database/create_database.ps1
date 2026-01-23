# Скрипт для создания базы данных Ski Concierge
# Выполните от имени пользователя postgres

Write-Host "=== Создание базы данных ski_concierge ===" -ForegroundColor Green

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

Write-Host "`nВыполнение от имени postgres..." -ForegroundColor Yellow
Write-Host "Вам нужно будет ввести пароль пользователя postgres`n" -ForegroundColor Yellow

$sql = @"
-- Создание базы данных
CREATE DATABASE ski_concierge
    WITH 
    OWNER = infokurort_user
    ENCODING = 'UTF8';

-- Подключение к новой базе
\c ski_concierge

-- Установка pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Права пользователю
GRANT ALL ON SCHEMA public TO infokurort_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO infokurort_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO infokurort_user;

-- Проверка
SELECT 'База данных создана успешно!' as status;
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
"@

# Сохранить SQL во временный файл
$tempSqlFile = "$env:TEMP\setup_ski_db.sql"
$sql | Out-File -FilePath $tempSqlFile -Encoding UTF8

Write-Host "SQL скрипт сохранен в: $tempSqlFile`n" -ForegroundColor Cyan

# Выполнить скрипт
& $psqlPath -U postgres -f $tempSqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ База данных успешно создана!" -ForegroundColor Green
    Write-Host "`nТеперь выполните:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Cyan
    Write-Host "  npm run prisma:migrate" -ForegroundColor Cyan
    Write-Host "  npm run db:seed" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Ошибка при создании базы данных" -ForegroundColor Red
    Write-Host "Проверьте пароль и повторите попытку" -ForegroundColor Yellow
}

# Удалить временный файл
Remove-Item $tempSqlFile -ErrorAction SilentlyContinue
