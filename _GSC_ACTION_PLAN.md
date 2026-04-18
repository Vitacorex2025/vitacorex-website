# Google Search Console — план действий (15 минут руками)

> Код-часть я сделал (IndexNow, sitemap, robots, schema.org — всё на месте).
> Осталось ТО, что можно сделать ТОЛЬКО из твоего аккаунта Google.

Открой: https://search.google.com/search-console?resource_id=https://vitacorexllc.com/

---

## 1. Проверь, что домен верифицирован (30 сек)

Слева вверху должен быть выбран property `https://vitacorexllc.com/`.
Если рядом красный знак — кликни `Settings` (Настройки) → `Ownership verification` → убедись что зелёная галка.

---

## 2. Отправь sitemap (2 мин) ⚠️ ГЛАВНОЕ

**Это самая вероятная причина, почему из 54 страниц в индексе только 1-2.**

1. Левое меню → **Sitemaps** (Файлы Sitemap)
2. Поле **Add a new sitemap** (Добавить новый файл) → введи:
   ```
   sitemap.xml
   ```
3. Кнопка **Submit** (Отправить)
4. Через 1-2 минуты статус должен стать `Success` и показать `54 discovered URLs`

Если уже отправлен, но статус `Couldn't fetch` — нажми иконку с тремя точками → `Remove`, потом добавь заново.

---

## 3. Request indexing вручную для 7 приоритетных страниц (8 мин)

Для каждого URL ниже:
1. Левое меню → **URL Inspection** (Проверка URL) в самом верху
2. Вставь полный URL в поле сверху → Enter
3. Подожди ~10 сек → появится статус
4. Нажми **Request Indexing** (Запросить индексирование)
5. Дождись подтверждения `Indexing requested` (до 2 мин) → переходи к следующему

**Порядок (по важности для B2B воронки):**

```
https://vitacorexllc.com/
https://vitacorexllc.com/solutions.html
https://vitacorexllc.com/revenue-recovery-workflow.html
https://vitacorexllc.com/corporate-legal-file-control.html
https://vitacorexllc.com/structured-case-intake.html
https://vitacorexllc.com/vitacorex-vs-traditional-agency.html
https://vitacorexllc.com/about.html
```

**Лимит Google:** ~10-12 `Request Indexing` в сутки. Если увидишь `Quota exceeded` — остальное завтра.

---

## 4. Проверь Coverage отчёт (2 мин — диагностика)

1. Левое меню → **Pages** (Страницы) или **Coverage** (Покрытие)
2. Посмотри секцию **Why pages aren't indexed** (Почему страницы не проиндексированы)
3. Самые частые причины для нового сайта:
   - `Crawled - currently not indexed` → Google нашёл, но решил что недостаточно уникально/ценно → **нужны бэклинки** (п. 6)
   - `Discovered - currently not indexed` → очередь на обход → просто ждать 1-4 недели
   - `Duplicate without user-selected canonical` → сообщи мне, это фиксим в коде
   - `Page with redirect` → сообщи мне

Если увидишь что-то из последних двух — пришли скриншот, починю.

---

## 5. Request indexing для остальных 47 страниц (по 10 в день)

**Не делай всё сразу.** Google наказывает за спам в Request Indexing.

Стратегия на неделю:
- **День 2:** контакты, privacy, terms, disclaimer, resources
- **День 3:** все `/ru/` страницы (7 штук)
- **День 4:** все `/uk/`
- **День 5:** все `/hi/`
- **День 6:** все `/zh/`
- **День 7:** все `/es/`

Полный список URL — в `sitemap.xml`.

---

## 6. Backlinks — без них Google не проиндексирует глубокие страницы (30 мин)

Google для нового домена .com за 2026 год требует хотя бы 3-5 внешних ссылок прежде чем выделит бюджет обхода. Сделай СЕГОДНЯ:

### 6.1. LinkedIn Company Page (10 мин)
- https://www.linkedin.com/company/setup/new/
- В поле "Website" → `https://vitacorexllc.com`
- Заполни About секцию (скопируй из `about.html`)
- **Один пост** со ссылкой на `revenue-recovery-workflow.html`

### 6.2. Google Business Profile (15 мин)
- https://business.google.com/create
- Категория: `Legal services` + `Business consultant`
- Website: `https://vitacorexllc.com`
- Верификация по почте займёт до 5 дней — начни сейчас

### 6.3. Быстрые бэклинки (5 мин каждый)
- **Crunchbase** — https://www.crunchbase.com/home → Add Company (free)
- **F6S** — https://www.f6s.com/companies/add
- **BuiltWith** — сам проиндексируется когда домен получит трафик

**НЕ делай:** комментарии в блогах, PBN, покупные ссылки — Google Penguin убьёт домен.

---

## 7. Что я сделал на стороне кода (для контекста)

- ✅ **IndexNow ping** → 54 URL отправлены в Bing/Yandex/Seznam/Naver **только что** (HTTP 200/200/202)
- ✅ **Key file** живёт на `https://vitacorexllc.com/vitacorex2025indexnow.txt`
- ✅ **sitemap.xml** валиден, 54 URL, lastmod корректный
- ✅ **robots.txt** открыт для Googlebot/Bingbot/YandexBot
- ✅ **schema.org Organization** с `taxID`, `sameAs`, многоязычный `knowsAbout`
- ✅ **Канонические URL** прописаны на каждой странице
- ✅ **Чёрный текст на синем фоне в exit-intent popup** → исправлен (белый на синем)

---

## 8. Ожидания по срокам

| Поисковик | Когда появится в выдаче |
|-----------|------------------------|
| **Bing** | 1-3 дня (IndexNow работает быстро) |
| **Yandex** | 3-7 дней |
| **Seznam / Naver** | 7-14 дней |
| **Google (после GSC действий)** | 2-4 недели для главной, 4-8 недель для глубоких страниц |
| **Google (без бэклинков)** | Может не проиндексировать вообще — так работает Google с 2024 |

---

## 9. Через 3 дня проверь

- Bing: https://www.bing.com/search?q=site%3Avitacorexllc.com
- Google: https://www.google.com/search?q=site%3Avitacorexllc.com
- Yandex: https://yandex.com/search/?text=site%3Avitacorexllc.com

Если Bing показал 50+ страниц, а Google всё ещё 1-2 — причина = нет бэклинков. Возвращайся к пункту 6.

---

**Если что-то в GSC покажет ошибку — скриншоть, пришли, починю код.**
