# Метаданные и Open Graph для Hermit Diary

## Обзор

Добавлены полные метаданные и Open Graph теги для всех основных страниц приложения Hermit Diary. Это улучшит SEO, социальные сети и общий пользовательский опыт.

## Добавленные метаданные

### 1. Корневой Layout (`src/app/layout.tsx`)

- Базовые метаданные для всего приложения
- Open Graph теги
- Twitter Card поддержка
- Robots директивы
- PWA manifest ссылка
- Русский язык (`lang="ru"`)

### 2. Главная страница (`src/app/(routing)/(homepage)/`)

- Статические метаданные для домашней страницы
- Описание проекта и ключевые слова
- Open Graph изображения

### 3. Страница дневника (`src/app/(diary-view)/diary/[diary_code]/`)

- Динамические метаданные на основе данных дневника
- Название дневника, автор, описание
- Обложка дневника или изображение пользователя
- Open Graph с типом "website"

### 4. Страница заметки (`src/app/(routing)/note/[note_code]/`)

- Метаданные на основе содержимого заметки
- Связь с дневником и автором
- Open Graph с типом "article"
- Временные метки создания/обновления

### 5. Профиль пользователя (`src/app/(routing)/user/[user_code]/`)

- Метаданные профиля другого пользователя
- Количество дневников
- Open Graph с типом "profile"
- Аватар пользователя

### 6. Мой профиль (`src/app/(routing)/profile/`)

- Метаданные для личного профиля
- Robots: noindex (личная информация)

### 7. Страница "О нас" (`src/app/(routing)/about/`)

- Информация о проекте
- Ключевые слова и описание

## Особенности реализации

### Динамические метаданные

- Используют `generateMetadata` функцию Next.js 13+
- Получают данные с сервера для актуальности
- Fallback метаданные при ошибках

### Open Graph

- Поддержка различных типов контента (website, article, profile)
- Оптимизированные изображения (1200x630 для общих, 400x400 для профилей)
- Русская локализация

### SEO оптимизация

- Ключевые слова на русском языке
- Авторы и создатели контента
- Canonical URLs
- Robots директивы для публичного/приватного контента

### PWA поддержка

- Manifest.json файл
- Theme colors
- Иконки приложения

## Структура файлов

```
src/app/
├── layout.tsx (корневые метаданные)
├── (homepage)/
│   ├── homepage-metadata.tsx
│   └── page.tsx
├── (diary-view)/diary/[diary_code]/
│   ├── diary-metadata.tsx
│   ├── diary-page-client.tsx
│   └── page.tsx
├── (routing)/
│   ├── about/
│   │   ├── about-metadata.tsx
│   │   └── page.tsx
│   ├── note/[note_code]/
│   │   ├── note-metadata.tsx
│   │   └── page.tsx
│   ├── profile/
│   │   ├── profile-metadata.tsx
│   │   └── page.tsx
│   └── user/[user_code]/
│       ├── user-metadata.tsx
│       └── page.tsx
public/
└── manifest.json
```

## Использование

Все метаданные автоматически применяются при загрузке страниц. Для добавления новых страниц:

1. Создайте файл `*-metadata.tsx` с функцией `generateMetadata`
2. Экспортируйте её в `page.tsx`
3. Используйте типы `Metadata` из Next.js

## Тестирование

Метаданные можно проверить:

- В инструментах разработчика браузера (Elements > head)
- Через социальные сети (Facebook Debugger, Twitter Card Validator)
- SEO инструментами (Google Search Console, Yandex.Webmaster)
