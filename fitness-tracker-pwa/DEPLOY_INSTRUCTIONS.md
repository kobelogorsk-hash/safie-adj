# 🌸 건강친구 - Корейский фитнес-трекер PWA

Приложение готово для деплоя на GitHub Pages!

## 🚀 Как запустить на GitHub Pages:

### Шаг 1: Создайте репозиторий на GitHub
1. Зайдите на https://github.com
2. Нажмите "+" → "New repository"
3. Назовите репозиторий (например, `fitness-tracker-pwa`)
4. Сделайте его публичным
5. **Не инициализируйте** его (не добавляйте README, .gitignore)
6. Нажмите "Create repository"

### Шаг 2: Отправьте код на GitHub
В терминале выполните команды (замените `YOUR_USERNAME` на ваш логин GitHub):

```bash
cd /workspace/fitness-tracker-pwa
git remote add origin https://github.com/YOUR_USERNAME/fitness-tracker-pwa.git
git push -u origin main
```

### Шаг 3: Включите GitHub Pages
1. Зайдите в настройки репозитория на GitHub
2. Перейдите в раздел **"Pages"** (в левом меню)
3. В разделе **"Build and deployment"**:
   - Source: выберите **"Deploy from a branch"**
   - Branch: выберите **"main"** и папку **"/ (root)"**
4. Нажмите **"Save"**

### Шаг 4: Готово!
Через 1-2 минуты ваше приложение будет доступно по адресу:
```
https://YOUR_USERNAME.github.io/fitness-tracker-pwa/
```

## 📱 Установка PWA

После деплоя:
1. Откройте ссылку в браузере (Chrome, Safari)
2. На мобильном: нажмите "Поделиться" → "На экран «Домой»"
3. На ПК: нажмите иконку установки в адресной строке

## 🔧 Примечания

- Service Worker автоматически кэширует файлы для офлайн-работы
- При обновлении кода просто сделайте `git push` - GitHub Pages обновится автоматически
- Убедитесь, что все файлы (index.html, manifest.json, sw.js) загружены в корень репозитория

## 📂 Структура проекта

```
fitness-tracker-pwa/
├── index.html          # Главная страница
├── styles.css          # Стили (корейский дизайн)
├── app.js              # Логика приложения
├── sw.js               # Service Worker
├── manifest.json       # PWA манифест
├── icon-192.png        # Иконка 192x192
├── icon-512.png        # Иконка 512x512
└── README.md           # Этот файл
```

즐거운 운동 되세요! (Удачной тренировки!) 🏃‍♀️🌸
