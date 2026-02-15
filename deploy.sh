#!/bin/bash
# Деплой на Vercel — запусти в терминале
cd "$(dirname "$0")"

echo "=== Шаг 1: Линк (если ещё не сделано) ==="
echo "Выбери ng-vladimirs-projects, затем проект или создай новый (wlife)"
npx vercel link

echo ""
echo "=== Шаг 2: BOT_TOKEN ==="
echo "Вставь токен когда спросит:"
echo "7979632678:AAEowdcdS8DDHym7H-iwdgwSDAC7FeWTed0"
echo ""
printf "7979632678:AAEowdcdS8DDHym7H-iwdgwSDAC7FeWTed0\n" | npx vercel env add BOT_TOKEN production

echo ""
echo "=== Шаг 3: Деплой ==="
npx vercel --prod

echo ""
echo "Готово! URL выше → в приложении Настройки → Telegram → вставь URL"
