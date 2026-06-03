# CLAUDE.md — massash-site

## Эталонный файл
massage/index.html — эталон для всех новых страниц.
Любая новая страница должна точно совпадать по структуре
и стилям с этим файлом перед деплоем.

## Сквозные блоки (копировать из massage/index.html)
- Хедер — точная копия
- Футер — точная копия  
- Блок формы записи — точная копия
- Стили кружков FAQ +/− — точная копия
- Карусель отзывов — точная копия JS и CSS

## Стек и стили
- Фон: #faf8f4, акцент: #2d6a4f
- Шрифты: serif заголовки, sans-serif текст
- Кружки +/−: стиль из index.html (главная)
- Карусель отзывов: JS из index.html
- Блок контактов: телефон → email → адрес → часы
- Футер: email после телефона

## Мобильная версия (max-width: 768px)
- Карусель — одна карточка, свайп, dots
- FAQ кружки — стиль как на index.html
- Форма — не ломается в колонку

## SEO (обязательно для каждой новой страницы)
- Title: [Услуга] в Москве — [уточнение] | massash
- H1: главный высокочастотный запрос
- Meta description: 150-160 символов
- Canonical: прописать

## Юридический фильтр (Александр не врач)
❌ лечение, диагностика, медицинская помощь
✅ восстановление, коррекция, работа с, снятие, укрепление

## Генератор страниц

### Запуск
python generator/generate.py [название_файла]

### Пути — только абсолютные
/css/variables.css, /css/main.css, /js/main.js, /assets/image/favicon.svg

### Фото
Hero (массаж): /assets/image/general/hero.jpg
Методология: /assets/image/services/[раздел]/[название].jpg

### Зафиксированные CSS-стандарты шаблона
.service-zones-inner: display:grid; grid-template-columns:repeat(2,1fr); gap:48px; align-items:stretch
.service-zones-inner > div: display:flex; flex-direction:column
.zones-list: flex:1
.service-zones-h2: min-height:52px
.service-zones-sub: min-height:56px
Hero-фото: object-position: center 30%
НЕ использовать инлайн style= на заголовках в шаблоне
