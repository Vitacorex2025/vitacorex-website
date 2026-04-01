
(function(){
  const doc = document;
  const lang = (localStorage.getItem('vcx_lang') || doc.documentElement.getAttribute('lang') || 'en').toLowerCase();
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  doc.body && doc.body.classList.add('vcx-premium-polish');
  doc.documentElement.lang = ['en','ru','es'].includes(lang) ? lang : 'en';

  const TITLE_MAP = {
    'about.html': {
      ru: 'О VitaCoreX | Возврат выручки и контроль документации',
      es: 'Sobre VitaCoreX | Recuperación de ingresos y control documental'
    },
    'solutions.html': {
      ru: 'Решения | VitaCoreX LLC',
      es: 'Soluciones | VitaCoreX LLC'
    },
    'industries.html': {
      ru: 'Отрасли | VitaCoreX LLC',
      es: 'Sectores | VitaCoreX LLC'
    },
    'industry-healthcare-dental.html': {
      ru: 'Здравоохранение и стоматология | VitaCoreX LLC',
      es: 'Salud y odontología | VitaCoreX LLC'
    },
    'industry-subscription-recurring.html': {
      ru: 'Подписки и регулярные платежи | VitaCoreX LLC',
      es: 'Suscripciones y pagos recurrentes | VitaCoreX LLC'
    },
    'industry-fleet-logistics.html': {
      ru: 'Флот и логистика | VitaCoreX LLC',
      es: 'Flota y logística | VitaCoreX LLC'
    },
    'industry-contract-services.html': {
      ru: 'Контрактные сервисы | VitaCoreX LLC',
      es: 'Servicios contractuales | VitaCoreX LLC'
    },
    'privacy-policy.html': {
      ru: 'Политика конфиденциальности | VitaCoreX LLC',
      es: 'Política de privacidad | VitaCoreX LLC'
    },
    'terms-of-use.html': {
      ru: 'Условия использования | VitaCoreX LLC',
      es: 'Términos de uso | VitaCoreX LLC'
    },
    'cookie-policy.html': {
      ru: 'Политика файлов cookie | VitaCoreX LLC',
      es: 'Política de cookies | VitaCoreX LLC'
    },
    'thank-you.html': {
      ru: 'Заявка получена | VitaCoreX LLC',
      es: 'Solicitud recibida | VitaCoreX LLC'
    }
  };

  const TEXT = {
    ru: {
      'Structured Intake • Recovery Systems • Legal File Control': 'Структурированный разбор • Recovery-системы • Контроль файлов',
      'Structured Intake • File Control': 'Структурированный разбор • Контроль файлов',
      'Company & solutions': 'Компания и решения',
      'Review, privacy & contact': 'Разбор, конфиденциальность и контакты',
      'Solutions': 'Решения',
      'Industries': 'Отрасли',
      'About VitaCoreX': 'О VitaCoreX',
      'Private consultation': 'Конфиденциальная консультация',
      'Privacy Policy': 'Политика конфиденциальности',
      'Terms of Use': 'Условия использования',
      'Cookie Policy': 'Политика файлов cookie',
      'Menu': 'Меню',
      'Request confidential review': 'Запросить конфиденциальный разбор',
      'Review industries': 'Посмотреть отрасли',
      'Review solutions': 'Посмотреть решения',
      'Open structured intake': 'Открыть структурированный разбор',
      'Back to home': 'Вернуться на главную',
      'Established 2025': 'Работает с 2025 года',
      'VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. It is not a law firm and does not provide legal representation. Legal strategy and legal advice remain the responsibility of licensed counsel.': 'VitaCoreX LLC оказывает административную, документарную, операционную и бизнес-поддержку. Компания не является юридической фирмой и не оказывает юридическое представительство. Правовая стратегия и юридические советы относятся к компетенции лицензированного адвоката.',
      'The public forms are designed for general business documents and non-regulated materials. For highly sensitive or regulated records, request secure coordination first.': 'Публичные формы предназначены для общих деловых документов и нерегулируемых материалов. Для особо чувствительных или регулируемых данных сначала запросите защищённую координацию.',
      '© 2026 VitaCoreX LLC. All rights reserved.': '© 2026 VitaCoreX LLC. Все права защищены.',

      'Operational advisory for recovery, documentation control, and cleaner counsel handoff.': 'Операционный консалтинг по возврату выручки, контролю документации и более чистой передаче материалов внешнему юристу.',
      'VitaCoreX is positioned for operators that need stronger cash-control logic, cleaner packet discipline, and a more credible handoff before outside cost expands.': 'VitaCoreX работает с операторами, которым нужны более жёсткая логика управления денежным потоком, более аккуратная пакетная дисциплина и более надёжная передача материалов до того, как начнут расти внешние издержки.',
      'What VitaCoreX does': 'Что делает VitaCoreX',
      'Builds operational control before expensive escalation.': 'Выстраивает операционный контроль до дорогой эскалации.',
      'VitaCoreX helps complex operators improve cash control, documentation discipline, and counsel-ready file structure before avoidable fee pressure expands.': 'VitaCoreX помогает сложным операторам усилить контроль денежных потоков, дисциплину документации и структуру файлов в формате counsel-ready до того, как начнёт расти устранимое давление на расходы.',
      'What VitaCoreX does not do': 'Чего VitaCoreX не делает',
      'Not legal representation and not licensed collections activity.': 'Не оказывает юридическое представительство и не выступает как лицензированное коллекторское агентство.',
      'The firm does not provide legal advice or act as a law firm. It also does not position itself as a licensed collection agency. Those boundaries stay visible across the site.': 'Компания не оказывает юридические консультации и не действует как юридическая фирма. Она также не позиционирует себя как лицензированное коллекторское агентство. Эти границы последовательно обозначены по всему сайту.',
      'What a first engagement produces': 'Что даёт первый этап работы',
      'Diagnostic clarity, packet standards, and pilot logic.': 'Диагностическую ясность, стандарты пакетов и логику пилота.',
      'A serious first phase should produce a work product: a gap map, a recommended workstream, and a measurement path that leadership can actually review.': 'Серьёзная первая фаза должна заканчиваться конкретным результатом: картой пробелов, рекомендованным потоком работ и измеримой логикой, которую руководство действительно может оценить.',
      'Method': 'Метод',
      'Diagnose, pilot, then scale only when the evidence justifies it.': 'Сначала диагностика, затем пилот, и только после этого масштабирование — если это оправдано фактами.',
      'That is a stronger premium signal than generic promises. It shows operational discipline and keeps the story grounded in what can be documented.': 'Это более сильный премиальный сигнал, чем общие обещания. Он показывает операционную дисциплину и удерживает историю в рамках того, что можно документально подтвердить.',
      'Diagnose': 'Диагностика',
      'Review workflow friction, document quality, escalation logic, and where recoverable value leaks first.': 'Разобрать трение в процессе, качество документов, логику эскалации и точки, где в первую очередь теряется восстанавливаемая ценность.',
      'Pilot': 'Пилот',
      'Define a contained workstream with clear expectations, response windows, and measurement logic.': 'Определить ограниченный поток работ с понятными ожиданиями, сроками реакции и логикой измерения.',
      'Scale': 'Масштабирование',
      'Expand only when the pilot creates credible operator-owned evidence.': 'Расширять работу только тогда, когда пилот даёт убедимые данные на стороне оператора.',
      'Typical first-phase outputs': 'Типичные результаты первой фазы',
      'Current-state leakage and handoff review': 'Разбор текущих потерь и качества handoff',
      'Document gap list and packet standard': 'Список документарных пробелов и стандарт пакета',
      'Priority routing logic and next-step memo': 'Логика приоритетной маршрутизации и меморандум по следующему шагу',
      'Pilot scope with measurement criteria': 'Объём пилота с критериями измерения',
      'Operator fit': 'Кому подходит',
      'Built around buyers who care about margin, documentation discipline, and execution clarity.': 'Построено вокруг покупателей, которым важны маржа, дисциплина документов и ясность исполнения.',
      'The company-first lane is deliberate. Private-client support remains available selectively, but the public brand now makes the primary operating category much clearer.': 'Фокус на компаниях сделан намеренно. Поддержка частных клиентов остаётся доступной выборочно, но публичный бренд теперь гораздо яснее показывает основную операционную категорию.',
      'Strong fit': 'Сильное соответствие',
      'Finance-led teams and owners who want a cleaner path to cash control.': 'Команды и собственники с финансовым фокусом, которым нужен более чистый путь к контролю денежных потоков.',
      'Operators dealing with fragmented files, aged balances, or weak escalation handoff.': 'Операторы, работающие с фрагментированными файлами, стареющей дебиторкой или слабой передачей материалов на эскалацию.',
      'Counsel-adjacent environments where administrative cleanup is absorbing expensive time.': 'Сценарии, близкие к юридической работе, где административный cleanup поглощает дорогое время.',
      'Weak fit': 'Слабое соответствие',
      'Buyers seeking legal advice or fully outsourced collections operations.': 'Покупатели, которым нужны юридические консультации или полностью аутсорсинговое взыскание.',
      'Requests with no workable documents, no decision owner, and no interest in measurement.': 'Запросы без пригодных документов, без владельца решения и без интереса к измерениям.',
      'Use cases where the public website is being treated like a secure regulated intake.': 'Случаи, когда публичный сайт пытаются использовать как защищённый регулируемый intake.',

      'Three clear solution lanes instead of one blended story.': 'Три понятных направления вместо одной смешанной истории.',
      'The public architecture now makes it easier to understand whether the operator needs recovery design, file control, or a structured routing layer first.': 'Публичная архитектура сайта теперь ясно показывает, что нужно оператору в первую очередь: проектирование recovery-процесса, контроль файлов или структурированная маршрутизация.',
      'Company-first positioning': 'Позиционирование с фокусом на компании',
      'These pages support the corporate lane first: recovery design, documentation control, and cleaner handoff before outside cost expands.': 'Эти страницы в первую очередь поддерживают корпоративное направление: проектирование recovery-процесса, контроль документации и более чистую передачу материалов до роста внешних издержек.',
      'Revenue Recovery Infrastructure': 'Инфраструктура возврата выручки',
      'Pre-agency workflow design for cleaner commitments, better sequencing, and stronger measurement discipline.': 'Проектирование процесса до передачи во внешнее агентство: более чистые обязательства, более точная последовательность действий и более строгая дисциплина измерений.',
      'Behavioral segmentation and outreach timing': 'Поведенческая сегментация и тайминг коммуникаций',
      'Payment-plan structure and autopay logic': 'Структура платёжных планов и логика автосписаний',
      'Escalation control and pilot economics': 'Контроль эскалации и экономика пилота',
      'Corporate Legal File Control': 'Контроль корпоративной юридической документации',
      'Chronology cleanup, packet standards, and cleaner file readiness before outside counsel is asked to move.': 'Очистка хронологии, стандарты пакетов и лучшая готовность файлов до подключения внешнего юриста.',
      'Gap logs and chronology control': 'Журнал пробелов и контроль хронологии',
      'Exhibit order and packet assembly': 'Порядок приложений и сборка пакетов',
      'Counsel-ready documentation workflows': 'Документарные процессы в формате counsel-ready',
      'Structured Intake & Packet Build': 'Структурированный разбор и сборка пакета',
      'Best for routing, first-packet cleanup, and identifying the right workstream before scope expands.': 'Лучше всего подходит для маршрутизации, первичной очистки пакета и определения правильного потока работ до расширения объёма.',
      'Fit review and routing memo': 'Оценка соответствия и маршрутизационный меморандум',
      'Document request logic': 'Логика запроса документов',
      'Next-step recommendation': 'Рекомендация по следующему шагу',
      'When to start where': 'С чего начинать',
      'The correct entry point depends on the operational bottleneck.': 'Правильная точка входа зависит от операционного узкого места.',
      'The site now makes the three lanes more legible so buyers do not confuse a recovery problem with a file-control problem or a routing problem.': 'Теперь сайт делает три направления более различимыми, чтобы покупатель не путал проблему возврата выручки с проблемой контроля файлов или маршрутизации.',
      'Start with recovery infrastructure': 'Начните с инфраструктуры возврата выручки',
      'When the main issue is aging balances, inconsistent outreach, weak payment-plan structure, or early agency fee compression.': 'Когда основная проблема — стареющая дебиторка, несогласованная коммуникация, слабая структура платёжных планов или слишком ранняя потеря маржи на агентских комиссиях.',
      'Start with legal file control': 'Начните с контроля юридических файлов',
      'When outside counsel or internal leadership is losing time to chronology cleanup, exhibit disorder, or missing packet logic.': 'Когда внешний юрист или внутренняя команда теряют время на очистку хронологии, беспорядок в приложениях или отсутствие логики пакета.',
      'Start with structured intake': 'Начните со структурированного разбора',
      'When the matter is not yet clean enough to define the real workstream, but there is enough context to route it properly.': 'Когда дело ещё недостаточно собрано для определения реального потока работ, но контекста уже достаточно, чтобы правильно его маршрутизировать.',

      'Focused industry pages for the operator environments that fit VitaCoreX best.': 'Сфокусированные отраслевые страницы для тех операционных сред, где VitaCoreX подходит лучше всего.',
      'A tighter wedge improves both buyer clarity and search relevance. These pages show where the operational model has the strongest natural fit.': 'Более узкий фокус повышает и понятность для покупателя, и релевантность для поиска. Эти страницы показывают, где операционная модель имеет наилучшее естественное соответствие.',
      'Industry fit': 'Отраслевая применимость',
      'Focused landing pages make the offer easier to trust and easier to rank.': 'Точные посадочные страницы делают предложение более понятным, вызывают больше доверия и лучше подходят для ранжирования.',
      'Broad positioning can still exist, but a newer domain needs narrower entry points where the operating logic is more obvious and the buyer sees themselves faster.': 'Широкое позиционирование может сохраняться, но новому домену нужны более узкие точки входа, где логика предложения очевиднее и покупатель быстрее узнаёт себя.',
      'Healthcare & dental': 'Здравоохранение и стоматология',
      'Patient-balance environments with documentation drag and pre-agency leakage.': 'Среды с пациентской задолженностью, документарным трением и потерями до передачи во внешнее агентство.',
      'Useful where revenue recovery and packet discipline are both breaking down.': 'Подходит там, где одновременно слабеют и recovery-процесс, и дисциплина работы с пакетами документов.',
      'Subscription & recurring payments': 'Подписки и регулярные платежи',
      'Recurring billing operators balancing retention sensitivity with recovery discipline.': 'Операторы регулярного биллинга, которым нужно одновременно беречь удержание клиента и сохранять дисциплину возврата средств.',
      'Useful where dunning, commitments, and exceptions need stronger logic.': 'Подходит там, где досудебные касания, обязательства и исключения требуют более сильной логики.',
      'Fleet & logistics': 'Флот и логистика',
      'Contract-heavy portfolios with dispersed operations and uneven document control.': 'Портфели с большим числом договоров, распределёнными операциями и неравномерным контролем документов.',
      'Useful where supporting records and receivable actions are inconsistent across locations.': 'Подходит там, где подтверждающие документы и действия по дебиторке различаются между локациями.',
      'Contract-heavy services': 'Контрактные сервисы',
      'Commercial service businesses with invoice, authorization, and escalation complexity.': 'Коммерческие сервисные бизнесы со сложной логикой счетов, авторизаций и эскалаций.',
      'Useful where weak files and weak handoff logic create avoidable cash drag and cleanup cost.': 'Подходит там, где слабые файлы и слабая логика передачи создают лишнее давление на денежный поток и стоимость cleanup.',
      'Why this matters': 'Почему это важно',
      'Industry-specific pages create tighter search intent, stronger landing-page relevance, and a cleaner path for campaign traffic.': 'Отраслевые страницы создают более точное поисковое намерение, повышают релевантность посадочной страницы и дают более чистый путь для рекламного трафика.',
      'Guardrail': 'Ограничение',
      'The page should never promise guaranteed rankings or fixed performance outcomes. It should explain fit, process, and evidence standards.': 'Страница не должна обещать гарантированные позиции или фиксированные результаты. Она должна объяснять соответствие, процесс и стандарты подтверждения.',

      'Healthcare and dental operators need stronger control before balances decay into expensive escalation.': 'Операторам в здравоохранении и стоматологии нужен более сильный контроль до того, как задолженность превратится в дорогую эскалацию.',
      'This page narrows the story to one of the clearest operating wedges: patient-balance environments where cash leakage and file disorder are compounding each other.': 'Эта страница сужает фокус до одного из самых понятных сценариев: среды пациентской задолженности, где потери денег и беспорядок в файлах усиливают друг друга.',
      'Operating problem': 'Операционная проблема',
      'Healthcare and dental operators often lose margin before formal collections ever begin.': 'Операторы в здравоохранении и стоматологии часто теряют маржу ещё до начала формального взыскания.',
      'Balances age while outreach sequencing, payment-plan logic, documentation quality, and escalation records vary by location, team, or vendor. When the file finally needs outside review, too much attorney-rate or agency-rate time is spent on preventable cleanup.': 'Задолженность стареет, пока последовательность коммуникации, логика платёжных планов, качество документации и записи по эскалации различаются по локациям, командам или подрядчикам. Когда файл наконец доходит до внешней проверки, слишком много дорогого времени уходит на предотвратимый cleanup.',
      'What changes': 'Что меняется',
      'More consistent outreach and documented payment-plan structure before early fee compression sets in.': 'Более последовательная коммуникация и документированная структура платёжных планов до того, как начнётся ранняя потеря маржи.',
      'Cleaner packet rules for authorizations, notices, payment records, and escalation history.': 'Более чёткие правила пакетов по авторизациям, уведомлениям, платёжным записям и истории эскалации.',
      'A stronger handoff model from operator workflow to outside counsel when escalation becomes necessary.': 'Более надёжная модель передачи материалов из операционного процесса внешнему юристу, когда эскалация становится необходимой.',
      'Typical first outputs': 'Типичные первые результаты',
      'Current-state leakage review by cohort or operating lane.': 'Разбор текущих потерь по когортам или операционным направлениям.',
      'Packet and chronology standards for counsel-ready files.': 'Стандарты пакетов и хронологии для файлов в формате counsel-ready.',
      'Pilot measurement plan tied to cash movement, completion rates, and file quality.': 'План измерения пилота, привязанный к движению денег, уровню завершения и качеству файлов.',
      '90-day frame': 'Рамка на 90 дней',
      'Pilot before scale.': 'Сначала пилот, затем масштабирование.',
      'A stronger first phase documents the baseline, implements a contained control layer, and measures whether the changes are actually improving cash, file readiness, or escalation discipline.': 'Сильная первая фаза фиксирует базовую ситуацию, внедряет ограниченный контрольный слой и измеряет, действительно ли изменения улучшают денежный поток, готовность файлов и дисциплину эскалации.',
      'Weeks 1–2': 'Недели 1–2',
      'Map the current workflow, identify failure points, and establish the minimum packet and reporting standard.': 'Описать текущий процесс, выявить точки сбоя и задать минимальный стандарт пакета и отчётности.',
      'Weeks 3–8': 'Недели 3–8',
      'Run a contained workstream with documented decisions, response windows, and exception handling rules.': 'Запустить ограниченный поток работ с документированными решениями, сроками реакции и правилами обработки исключений.',
      'Weeks 9–12': 'Недели 9–12',
      'Review cohort movement, packet quality, and whether a broader rollout is justified.': 'Оценить движение когорт, качество пакетов и оправдано ли более широкое внедрение.',

      'Recovery design for recurring billing environments where cash control and customer experience both matter.': 'Проектирование recovery-процесса для среды регулярного биллинга, где важны и контроль денежных потоков, и клиентский опыт.',
      'The point is not aggressive collections rhetoric. It is better segmentation, commitment logic, documentation, and exception handling before escalation becomes expensive.': 'Речь не об агрессивной риторике взыскания. Речь о лучшей сегментации, логике обязательств, документации и обработке исключений до того, как эскалация станет дорогой.',
      'Subscription and recurring-payment operators need recovery logic that protects both cash and customer experience.': 'Операторам подписок и регулярных платежей нужна логика возврата средств, которая защищает и денежный поток, и клиентский опыт.',
      'Generic collections framing is often too blunt for recurring-billing businesses. The problem is not only delinquency; it is also poor segmentation, weak dunning discipline, inconsistent commitments, and exceptions that are not documented clearly enough to scale.': 'Обычная логика collections слишком груба для бизнеса с регулярным биллингом. Проблема не только в просрочке: это ещё и слабая сегментация, плохая дисциплина dunning, непоследовательные обязательства и исключения, которые недостаточно ясно документированы для масштабирования.',
      'Structured recovery paths based on cohort behavior and payment friction.': 'Структурированные recovery-пути на основе поведения когорт и причин платёжного трения.',
      'Cleaner commitment tracking, exception handling, and payment-plan documentation.': 'Более чистый учёт обязательств, обработка исключений и документация по платёжным планам.',
      'More credible escalation decisions when internal recovery steps have already been controlled.': 'Более обоснованные решения по эскалации, когда внутренний recovery-процесс уже взят под контроль.',
      'Segmentation and workflow review for aging cohorts.': 'Разбор сегментации и процесса для стареющих когорт.',
      'Commitment and exception-control standards.': 'Стандарты контроля обязательств и исключений.',
      'Pilot design tied to time-to-cash, cure rates, and avoidable external-cost exposure.': 'Дизайн пилота, привязанный к time-to-cash, показателям восстановления и устранимой внешней стоимости.',

      'Contract-heavy portfolios with dispersed teams, field activity, and inconsistent file quality need cleaner control before disputes or escalations widen.': 'Портфелям с большим числом договоров, распределёнными командами, полевой работой и неровным качеством файлов нужен более чистый контроль до того, как споры или эскалации расширятся.',
      'Fleet and logistics portfolios often carry a hidden documentation problem alongside the receivable problem.': 'Во флоте и логистике рядом с проблемой дебиторки часто скрывается проблема документации.',
      'Supporting records, guaranties, location-level practices, and contract amendments are often inconsistent. That makes recovery and escalation slower, less defensible, and more expensive than they should be.': 'Подтверждающие документы, гарантии, практики на уровне локаций и изменения договоров часто несогласованы. Это делает recovery и эскалацию более медленными, менее защищёнными и более дорогими, чем нужно.',
      'Stronger authorization trails and support records for disputed or aging accounts.': 'Более сильные цепочки авторизации и подтверждающие документы для спорных или стареющих счетов.',
      'Cleaner packet structure before attorney or agency review.': 'Более чистая структура пакета до проверки юристом или агентством.',
      'More consistent operating rules across locations or teams.': 'Более согласованные операционные правила между локациями и командами.',
      'Document gap map for supporting records, approvals, and contract changes.': 'Карта пробелов по подтверждающим документам, согласованиям и изменениям договоров.',
      'Packet rules for disputed or escalated accounts.': 'Правила пакетов для спорных или эскалированных счетов.',
      'Pilot scope tied to faster handoff and lower cleanup drag.': 'Пилотный объём работ, привязанный к более быстрой передаче материалов и меньшему cleanup-трению.',

      'Service businesses with layered contracts and invoicing often need cleaner control of the receivable and the escalation path at the same time.': 'Сервисным компаниям с многослойными договорами и выставлением счетов часто нужен более чистый контроль одновременно и над дебиторкой, и над путём эскалации.',
      'The problem is rarely just an unpaid invoice. It is usually a combination of weak authorization trails, incomplete service records, missing chronology, and ad hoc escalation behavior. That weak handoff compresses leverage and increases cleanup cost.': 'Проблема редко ограничивается неоплаченным счётом. Обычно это сочетание слабых цепочек авторизации, неполных сервисных записей, отсутствующей хронологии и несистемной эскалации. Такая слабая передача материалов снижает управляемость и увеличивает стоимость cleanup.',
      'Stronger authorization and invoice-support packet rules.': 'Более сильные правила по авторизациям и подтверждающим документам к счетам.',
      'More reliable chronology and issue mapping before escalation.': 'Более надёжная хронология и карта вопросов до эскалации.',
      'A clearer executive path from dispute review to operating decision.': 'Более ясный путь для руководства от разбора спора к операционному решению.',
      'Document gap map for invoice, authorization, and service records.': 'Карта пробелов по счетам, авторизациям и сервисным записям.',
      'Packet and chronology standards for cleaner downstream review.': 'Стандарты пакетов и хронологии для более чистой дальнейшей проверки.',
      'Pilot scope with measurable control points and next-step governance.': 'Пилотный объём работ с измеримыми контрольными точками и governance следующего шага.',

      'Privacy policy': 'Политика конфиденциальности',
      'How public-form data, optional analytics, and file-handling boundaries are treated on this site.': 'Как на этом сайте обрабатываются данные из публичных форм, необязательная аналитика и границы работы с файлами.',
      'This page was added to make privacy, consent, and document-handling expectations visible instead of implied.': 'Эта страница добавлена, чтобы сделать политику конфиденциальности, согласие и правила работы с документами явными, а не подразумеваемыми.',
      'Overview': 'Обзор',
      'This site collects the information that visitors choose to submit through forms, plus technical information necessary to operate the site and — where consent is given — optional analytics or campaign measurement data.': 'Сайт собирает информацию, которую посетители сами отправляют через формы, а также технические данные, необходимые для работы сайта, и — при наличии согласия — необязательные аналитические и рекламно-измерительные данные.',
      'The site is configured around a static marketing experience with form delivery, optional analytics slots, and downloadable public materials. The exact tracker mix can vary by deployment, but optional analytics and marketing scripts are intended to load only after consent.': 'Сайт построен как статический маркетинговый ресурс с отправкой форм, слотами для необязательной аналитики и публичными downloadable-материалами. Точный набор трекеров зависит от развёртывания, но необязательные аналитические и маркетинговые скрипты должны загружаться только после согласия.',
      'Information you submit': 'Информация, которую вы отправляете',
      'Name, company, phone number, email address, and the details you enter into the public forms.': 'Имя, компания, номер телефона, email и сведения, которые вы вводите в публичные формы.',
      'Files or packet drafts that you choose to upload through the structured intake.': 'Файлы или черновики пакетов, которые вы решите загрузить через структурированный разбор.',
      'Context such as selected service line, urgency, and other form-routing information.': 'Контекст, включая выбранное направление услуги, срочность и другую информацию для маршрутизации формы.',
      'How the information is used': 'Как используется информация',
      'To route, review, and respond to requests.': 'Для маршрутизации, рассмотрения и ответа на запросы.',
      'To measure which public pages and campaigns are generating inquiries.': 'Для оценки того, какие публичные страницы и кампании приводят обращения.',
      'To improve site performance, form handling, and conversion paths.': 'Для улучшения производительности сайта, обработки форм и конверсионных путей.',
      'Important file-handling boundary': 'Важная граница по работе с файлами',
      'The public forms are designed for general business documents and non-regulated materials. Do not upload highly sensitive regulated records, medical records, or other materials that require a dedicated secure workflow unless secure coordination has been arranged first.': 'Публичные формы предназначены для общих деловых документов и нерегулируемых материалов. Не загружайте особо чувствительные регулируемые записи, медицинские документы или иные материалы, требующие отдельного защищённого процесса, если заранее не организована защищённая координация.',
      'Cookies and consent': 'Cookie-файлы и согласие',
      'The site uses a consent banner that distinguishes essential functionality from optional analytics or marketing measurement. Visitors can choose essential only, analytics only, or full consent where available.': 'Сайт использует баннер согласия, который разделяет обязательную функциональность и необязательную аналитику или маркетинговое измерение. Посетитель может выбрать только обязательное, только аналитику или полное согласие, если такая опция доступна.',
      'For more detail, see the Cookie Policy .': 'Подробности приведены в Политике файлов cookie.',
      'Third-party services': 'Сторонние сервисы',
      'Form delivery, calendar scheduling, analytics, and campaign measurement may involve third-party services. Use of those services depends on the current deployment configuration and the visitor’s consent choices where applicable.': 'Отправка форм, календарное бронирование, аналитика и измерение кампаний могут использовать сторонние сервисы. Их применение зависит от текущей конфигурации развёртывания и выбора согласия со стороны посетителя, где это применимо.',
      'Contact': 'Контакты',
      'For privacy-related questions, use the public contact options on this site or call/text (888) 794-8292 .': 'По вопросам конфиденциальности используйте публичные контакты на сайте или позвоните / напишите на номер (888) 794-8292.',

      'Terms of use': 'Условия использования',
      'Public-site terms, legal boundaries, and user responsibilities.': 'Условия публичного сайта, юридические границы и ответственность пользователя.',
      'This page makes the public boundaries explicit: information, not legal advice; no automatic engagement; and no guarantee of results.': 'Эта страница прямо фиксирует границы: информация, а не юридическая консультация; отсутствие автоматического начала работы; отсутствие гарантий результата.',
      'Informational use': 'Информационное использование',
      'The public site is provided for informational and business-development purposes. It does not create an attorney-client relationship, agency relationship, or any binding engagement on its own.': 'Публичный сайт предоставляется для информационных целей и делового взаимодействия. Сам по себе он не создаёт отношения адвокат–клиент, агентские отношения или иное обязательное соглашение.',
      'No legal advice': 'Без юридических консультаций',
      'VitaCoreX LLC is not a law firm and does not provide legal advice or legal representation. Legal strategy and legal advice remain the responsibility of licensed counsel.': 'VitaCoreX LLC не является юридической фирмой и не оказывает юридические консультации или юридическое представительство. Правовая стратегия и юридические советы относятся к компетенции лицензированного адвоката.',
      'No licensed collections activity represented here': 'Здесь не представлена лицензированная коллекторская деятельность',
      'The site does not position VitaCoreX as a licensed collection agency. Recovery-related work is framed as workflow infrastructure, documentation control, and operator support before or around escalation decisions.': 'Сайт не позиционирует VitaCoreX как лицензированное коллекторское агентство. Работа, связанная с recovery, описывается как инфраструктура процесса, контроль документации и поддержка операторов до или вокруг решений об эскалации.',
      'No guarantee of results': 'Без гарантии результатов',
      'Any economics illustrations, examples, or pilot frames are informational. They are not guarantees of rankings, collections outcomes, ROI, or any fixed business result.': 'Любые иллюстрации экономики, примеры или рамки пилота носят информационный характер. Они не являются гарантией позиций, результатов взыскания, ROI или любого фиксированного бизнес-результата.',
      'User responsibilities': 'Ответственность пользователя',
      'Provide accurate contact information.': 'Предоставлять точные контактные данные.',
      'Do not submit unlawful content or content you are not authorized to share.': 'Не отправлять незаконный контент или материалы, которыми вы не уполномочены делиться.',
      'Do not use the public forms as a substitute for a secure workflow where one is required.': 'Не использовать публичные формы вместо защищённого процесса там, где он необходим.',
      'Engagements': 'Рабочие взаимодействия',
      'Any actual working engagement requires separate confirmation, scope definition, and the appropriate written agreement.': 'Любое фактическое рабочее взаимодействие требует отдельного подтверждения, определения объёма работ и соответствующего письменного соглашения.',

      'Cookie policy': 'Политика файлов cookie',
      'How the site handles essential functionality, analytics consent, and configured measurement tools.': 'Как сайт работает с обязательной функциональностью, согласием на аналитику и подключёнными инструментами измерения.',
      'The site already had a consent banner. This page makes the consent logic and tracker categories explicit.': 'На сайте уже был баннер согласия. Эта страница делает логику согласия и категории трекеров явными.',
      'How cookies are used': 'Как используются cookie-файлы',
      'The site uses essential functionality plus optional analytics and marketing measurement tools. Optional tools are intended to load only after consent.': 'Сайт использует обязательную функциональность, а также необязательные инструменты аналитики и маркетингового измерения. Необязательные инструменты должны загружаться только после согласия.',
      'Consent choices': 'Варианты согласия',
      'Essential only: basic site operation without optional analytics or marketing tags.': 'Только обязательное: базовая работа сайта без необязательной аналитики и маркетинговых тегов.',
      'Analytics only: essential functionality plus analytics-focused measurement.': 'Только аналитика: обязательная функциональность плюс аналитическое измерение.',
      'Accept all: essential, analytics, and any configured campaign/marketing measurement tools.': 'Принять всё: обязательная функциональность, аналитика и любые подключённые инструменты рекламного / маркетингового измерения.',
      'Configured tracker slots': 'Подготовленные слоты для трекеров',
      'The site is prepared for Google Analytics 4, Google Tag Manager, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag, and Apollo website tracking. Whether each tool is active depends on the current deployment settings and consent choice.': 'Сайт подготовлен для Google Analytics 4, Google Tag Manager, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag и Apollo website tracking. Активность каждого инструмента зависит от текущих настроек развёртывания и выбора согласия.',
      'Managing consent': 'Управление согласием',
      'You can manage consent through the banner when it is shown. Browser settings can also be used to control or clear cookies.': 'Управлять согласием можно через баннер, когда он отображается. Настройки браузера также можно использовать для контроля или удаления cookie-файлов.',

      'Thank you. We received your request.': 'Спасибо. Мы получили ваш запрос.',
      'Your request has been logged. A team review typically begins within 1-2 business days once the submission is complete.': 'Ваш запрос зарегистрирован. Команда обычно начинает рассмотрение в течение 1–2 рабочих дней после того, как отправка полностью завершена.',
      'Submission received': 'Заявка получена',
      'Next step': 'Следующий шаг',
      'Initial routing review': 'Первичный маршрутизационный разбор',
      'Response window': 'Срок ответа',
      '1-2 business days': '1–2 рабочих дня'
    },
    es: {
      'Structured Intake • Recovery Systems • Legal File Control': 'Intake estructurado • Sistemas de recuperación • Control de archivos',
      'Structured Intake • File Control': 'Intake estructurado • Control de archivos',
      'Company & solutions': 'Empresa y soluciones',
      'Review, privacy & contact': 'Revisión, privacidad y contacto',
      'Solutions': 'Soluciones',
      'Industries': 'Sectores',
      'About VitaCoreX': 'Sobre VitaCoreX',
      'Private consultation': 'Consulta privada',
      'Privacy Policy': 'Política de privacidad',
      'Terms of Use': 'Términos de uso',
      'Cookie Policy': 'Política de cookies',
      'Menu': 'Menú',
      'Request confidential review': 'Solicitar revisión confidencial',
      'Review industries': 'Ver sectores',
      'Review solutions': 'Ver soluciones',
      'Open structured intake': 'Abrir intake estructurado',
      'Back to home': 'Volver al inicio',
      'Established 2025': 'Establecida en 2025',
      'VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. It is not a law firm and does not provide legal representation. Legal strategy and legal advice remain the responsibility of licensed counsel.': 'VitaCoreX LLC ofrece soporte administrativo, documental, operativo y de negocio. No es un bufete jurídico y no presta representación legal. La estrategia legal y el asesoramiento jurídico siguen siendo responsabilidad de abogados con licencia.',
      'The public forms are designed for general business documents and non-regulated materials. For highly sensitive or regulated records, request secure coordination first.': 'Los formularios públicos están diseñados para documentos comerciales generales y materiales no regulados. Para registros muy sensibles o regulados, solicite primero una coordinación segura.',
      '© 2026 VitaCoreX LLC. All rights reserved.': '© 2026 VitaCoreX LLC. Todos los derechos reservados.',

      'Operational advisory for recovery, documentation control, and cleaner counsel handoff.': 'Asesoría operativa para recovery, control documental y un handoff más limpio hacia asesoría externa.',
      'VitaCoreX is positioned for operators that need stronger cash-control logic, cleaner packet discipline, and a more credible handoff before outside cost expands.': 'VitaCoreX trabaja con operadores que necesitan una lógica más fuerte de control de caja, una disciplina más limpia del paquete documental y un handoff más creíble antes de que crezcan los costos externos.',
      'What VitaCoreX does': 'Qué hace VitaCoreX',
      'Builds operational control before expensive escalation.': 'Construye control operativo antes de una escalación costosa.',
      'VitaCoreX helps complex operators improve cash control, documentation discipline, and counsel-ready file structure before avoidable fee pressure expands.': 'VitaCoreX ayuda a operadores complejos a mejorar el control de caja, la disciplina documental y la estructura del expediente en formato counsel-ready antes de que crezca una presión evitable de costos.',
      'What VitaCoreX does not do': 'Qué no hace VitaCoreX',
      'Not legal representation and not licensed collections activity.': 'No presta representación legal ni actúa como actividad de cobranza licenciada.',
      'The firm does not provide legal advice or act as a law firm. It also does not position itself as a licensed collection agency. Those boundaries stay visible across the site.': 'La firma no presta asesoría jurídica ni actúa como bufete. Tampoco se posiciona como una agencia de cobranza licenciada. Esos límites permanecen visibles en todo el sitio.',
      'What a first engagement produces': 'Qué produce una primera intervención',
      'Diagnostic clarity, packet standards, and pilot logic.': 'Claridad diagnóstica, estándares de paquete y lógica de piloto.',
      'A serious first phase should produce a work product: a gap map, a recommended workstream, and a measurement path that leadership can actually review.': 'Una primera fase seria debe producir un entregable real: un mapa de brechas, un flujo de trabajo recomendado y una ruta de medición que la dirección pueda revisar de verdad.',
      'Method': 'Método',
      'Diagnose, pilot, then scale only when the evidence justifies it.': 'Diagnosticar, pilotar y escalar solo cuando la evidencia lo justifique.',
      'That is a stronger premium signal than generic promises. It shows operational discipline and keeps the story grounded in what can be documented.': 'Esa es una señal premium más sólida que las promesas genéricas. Demuestra disciplina operativa y mantiene la narrativa anclada en lo que puede documentarse.',
      'Diagnose': 'Diagnóstico',
      'Review workflow friction, document quality, escalation logic, and where recoverable value leaks first.': 'Revisar la fricción del workflow, la calidad documental, la lógica de escalación y dónde se fuga primero el valor recuperable.',
      'Pilot': 'Piloto',
      'Define a contained workstream with clear expectations, response windows, and measurement logic.': 'Definir un flujo de trabajo acotado con expectativas claras, ventanas de respuesta y lógica de medición.',
      'Scale': 'Escalar',
      'Expand only when the pilot creates credible operator-owned evidence.': 'Expandir solo cuando el piloto genere evidencia creíble propiedad del operador.',
      'Typical first-phase outputs': 'Entregables típicos de la primera fase',
      'Current-state leakage and handoff review': 'Revisión de fugas actuales y calidad del handoff',
      'Document gap list and packet standard': 'Lista de brechas documentales y estándar de paquete',
      'Priority routing logic and next-step memo': 'Lógica de enrutamiento prioritario y memo del siguiente paso',
      'Pilot scope with measurement criteria': 'Alcance del piloto con criterios de medición',
      'Operator fit': 'Encaje del operador',
      'Built around buyers who care about margin, documentation discipline, and execution clarity.': 'Diseñado para compradores que se preocupan por el margen, la disciplina documental y la claridad de ejecución.',
      'The company-first lane is deliberate. Private-client support remains available selectively, but the public brand now makes the primary operating category much clearer.': 'La vía centrada en compañías es deliberada. El soporte para clientes privados sigue disponible de forma selectiva, pero la marca pública ahora deja mucho más clara la categoría operativa principal.',
      'Strong fit': 'Buen encaje',
      'Finance-led teams and owners who want a cleaner path to cash control.': 'Equipos y propietarios con enfoque financiero que quieren un camino más limpio hacia el control de caja.',
      'Operators dealing with fragmented files, aged balances, or weak escalation handoff.': 'Operadores que lidian con expedientes fragmentados, saldos envejecidos o un handoff débil hacia la escalación.',
      'Counsel-adjacent environments where administrative cleanup is absorbing expensive time.': 'Entornos cercanos a asesoría jurídica donde la limpieza administrativa está consumiendo tiempo costoso.',
      'Weak fit': 'Encaje débil',
      'Buyers seeking legal advice or fully outsourced collections operations.': 'Compradores que buscan asesoría jurídica o operaciones de cobranza totalmente externalizadas.',
      'Requests with no workable documents, no decision owner, and no interest in measurement.': 'Solicitudes sin documentos utilizables, sin responsable de decisión y sin interés por medir.',
      'Use cases where the public website is being treated like a secure regulated intake.': 'Casos donde el sitio público se trata como si fuera un intake seguro y regulado.',

      'Three clear solution lanes instead of one blended story.': 'Tres líneas de solución claras en lugar de una historia mezclada.',
      'The public architecture now makes it easier to understand whether the operator needs recovery design, file control, or a structured routing layer first.': 'La arquitectura pública ahora deja claro si el operador necesita primero diseño de recovery, control de archivos o una capa de enrutamiento estructurada.',
      'Company-first positioning': 'Posicionamiento centrado en compañías',
      'These pages support the corporate lane first: recovery design, documentation control, and cleaner handoff before outside cost expands.': 'Estas páginas priorizan la vía corporativa: diseño de recovery, control documental y un handoff más limpio antes de que crezcan los costos externos.',
      'Revenue Recovery Infrastructure': 'Infraestructura de recuperación de ingresos',
      'Pre-agency workflow design for cleaner commitments, better sequencing, and stronger measurement discipline.': 'Diseño de workflow previo a la agencia para compromisos más claros, mejor secuenciación y mayor disciplina de medición.',
      'Behavioral segmentation and outreach timing': 'Segmentación conductual y timing de outreach',
      'Payment-plan structure and autopay logic': 'Estructura de planes de pago y lógica de autopay',
      'Escalation control and pilot economics': 'Control de escalación y economía del piloto',
      'Corporate Legal File Control': 'Control corporativo de archivos legales',
      'Chronology cleanup, packet standards, and cleaner file readiness before outside counsel is asked to move.': 'Limpieza de cronología, estándares de paquete y mejor preparación del expediente antes de involucrar a asesoría externa.',
      'Gap logs and chronology control': 'Registro de brechas y control de cronología',
      'Exhibit order and packet assembly': 'Orden de anexos y armado del paquete',
      'Counsel-ready documentation workflows': 'Workflows documentales listos para asesoría externa',
      'Structured Intake & Packet Build': 'Intake estructurado y armado de paquete',
      'Best for routing, first-packet cleanup, and identifying the right workstream before scope expands.': 'Ideal para enrutar, limpiar el primer paquete e identificar el flujo correcto antes de ampliar el alcance.',
      'Fit review and routing memo': 'Revisión de encaje y memo de enrutamiento',
      'Document request logic': 'Lógica de solicitud de documentos',
      'Next-step recommendation': 'Recomendación del siguiente paso',
      'When to start where': 'Cuándo empezar por cada vía',
      'The correct entry point depends on the operational bottleneck.': 'El punto de entrada correcto depende del cuello de botella operativo.',
      'The site now makes the three lanes more legible so buyers do not confuse a recovery problem with a file-control problem or a routing problem.': 'El sitio ahora hace más legibles las tres vías para que el comprador no confunda un problema de recovery con uno de control de archivos o de enrutamiento.',
      'Start with recovery infrastructure': 'Empiece por la infraestructura de recovery',
      'When the main issue is aging balances, inconsistent outreach, weak payment-plan structure, or early agency fee compression.': 'Cuando el problema principal son saldos envejecidos, outreach inconsistente, planes de pago débiles o compresión temprana de margen por fees de agencia.',
      'Start with legal file control': 'Empiece por el control del expediente legal',
      'When outside counsel or internal leadership is losing time to chronology cleanup, exhibit disorder, or missing packet logic.': 'Cuando la asesoría externa o el liderazgo interno pierden tiempo por limpieza de cronología, desorden de anexos o falta de lógica del paquete.',
      'Start with structured intake': 'Empiece por el intake estructurado',
      'When the matter is not yet clean enough to define the real workstream, but there is enough context to route it properly.': 'Cuando el asunto aún no está lo bastante limpio para definir el flujo real, pero sí hay suficiente contexto para enrutarlo correctamente.',

      'Focused industry pages for the operator environments that fit VitaCoreX best.': 'Páginas sectoriales enfocadas en los entornos operativos que mejor encajan con VitaCoreX.',
      'A tighter wedge improves both buyer clarity and search relevance. These pages show where the operational model has the strongest natural fit.': 'Un enfoque más estrecho mejora tanto la claridad para el comprador como la relevancia de búsqueda. Estas páginas muestran dónde el modelo operativo encaja mejor de forma natural.',
      'Industry fit': 'Encaje sectorial',
      'Focused landing pages make the offer easier to trust and easier to rank.': 'Las landing pages enfocadas hacen que la oferta sea más fácil de entender, confiar y posicionar.',
      'Broad positioning can still exist, but a newer domain needs narrower entry points where the operating logic is more obvious and the buyer sees themselves faster.': 'El posicionamiento amplio puede mantenerse, pero un dominio nuevo necesita puntos de entrada más estrechos donde la lógica operativa sea más evidente y el comprador se reconozca más rápido.',
      'Healthcare & dental': 'Salud y odontología',
      'Patient-balance environments with documentation drag and pre-agency leakage.': 'Entornos de saldos de pacientes con fricción documental y fuga antes de la agencia.',
      'Useful where revenue recovery and packet discipline are both breaking down.': 'Útil cuando se están debilitando tanto el recovery como la disciplina del paquete documental.',
      'Subscription & recurring payments': 'Suscripciones y pagos recurrentes',
      'Recurring billing operators balancing retention sensitivity with recovery discipline.': 'Operadores de cobro recurrente que deben equilibrar sensibilidad de retención con disciplina de recovery.',
      'Useful where dunning, commitments, and exceptions need stronger logic.': 'Útil cuando dunning, compromisos y excepciones necesitan una lógica más fuerte.',
      'Fleet & logistics': 'Flota y logística',
      'Contract-heavy portfolios with dispersed operations and uneven document control.': 'Portafolios con muchos contratos, operaciones dispersas y control documental desigual.',
      'Useful where supporting records and receivable actions are inconsistent across locations.': 'Útil cuando los soportes y las acciones sobre la cartera son inconsistentes entre ubicaciones.',
      'Contract-heavy services': 'Servicios contractuales',
      'Commercial service businesses with invoice, authorization, and escalation complexity.': 'Negocios de servicios comerciales con complejidad en facturas, autorizaciones y escalación.',
      'Useful where weak files and weak handoff logic create avoidable cash drag and cleanup cost.': 'Útil cuando expedientes débiles y una lógica de handoff débil generan fricción evitable en caja y costo de limpieza.',
      'Why this matters': 'Por qué importa',
      'Industry-specific pages create tighter search intent, stronger landing-page relevance, and a cleaner path for campaign traffic.': 'Las páginas específicas por sector generan una intención de búsqueda más precisa, mayor relevancia de landing y un camino más limpio para el tráfico de campañas.',
      'Guardrail': 'Límite',
      'The page should never promise guaranteed rankings or fixed performance outcomes. It should explain fit, process, and evidence standards.': 'La página nunca debe prometer rankings garantizados ni resultados fijos. Debe explicar encaje, proceso y estándares de evidencia.',

      'Healthcare and dental operators need stronger control before balances decay into expensive escalation.': 'Los operadores de salud y odontología necesitan un control más fuerte antes de que los saldos se degraden en una escalación costosa.',
      'This page narrows the story to one of the clearest operating wedges: patient-balance environments where cash leakage and file disorder are compounding each other.': 'Esta página enfoca el mensaje en uno de los wedges operativos más claros: entornos de saldos de pacientes donde la fuga de caja y el desorden documental se refuerzan mutuamente.',
      'Operating problem': 'Problema operativo',
      'Healthcare and dental operators often lose margin before formal collections ever begin.': 'Los operadores de salud y odontología suelen perder margen antes incluso de que comience la cobranza formal.',
      'Balances age while outreach sequencing, payment-plan logic, documentation quality, and escalation records vary by location, team, or vendor. When the file finally needs outside review, too much attorney-rate or agency-rate time is spent on preventable cleanup.': 'Los saldos envejecen mientras la secuencia de contacto, la lógica de planes de pago, la calidad documental y los registros de escalación varían por ubicación, equipo o proveedor. Cuando el expediente finalmente requiere revisión externa, se consume demasiado tiempo costoso en una limpieza evitable.',
      'What changes': 'Qué cambia',
      'More consistent outreach and documented payment-plan structure before early fee compression sets in.': 'Un outreach más consistente y una estructura documentada de planes de pago antes de que aparezca la compresión temprana de margen.',
      'Cleaner packet rules for authorizations, notices, payment records, and escalation history.': 'Reglas más limpias para paquetes de autorizaciones, avisos, registros de pago e historial de escalación.',
      'A stronger handoff model from operator workflow to outside counsel when escalation becomes necessary.': 'Un modelo de handoff más sólido desde el workflow operativo hacia la asesoría externa cuando la escalación se vuelve necesaria.',
      'Typical first outputs': 'Resultados iniciales típicos',
      'Current-state leakage review by cohort or operating lane.': 'Revisión de fuga actual por cohorte o carril operativo.',
      'Packet and chronology standards for counsel-ready files.': 'Estándares de paquete y cronología para expedientes listos para asesoría externa.',
      'Pilot measurement plan tied to cash movement, completion rates, and file quality.': 'Plan de medición del piloto ligado a movimiento de caja, tasas de finalización y calidad documental.',
      '90-day frame': 'Marco de 90 días',
      'Pilot before scale.': 'Primero piloto, luego escala.',
      'A stronger first phase documents the baseline, implements a contained control layer, and measures whether the changes are actually improving cash, file readiness, or escalation discipline.': 'Una primera fase más sólida documenta la línea base, implementa una capa de control contenida y mide si los cambios realmente mejoran caja, preparación del expediente o disciplina de escalación.',
      'Weeks 1–2': 'Semanas 1–2',
      'Map the current workflow, identify failure points, and establish the minimum packet and reporting standard.': 'Mapear el workflow actual, identificar puntos de falla y establecer el estándar mínimo de paquete y reporte.',
      'Weeks 3–8': 'Semanas 3–8',
      'Run a contained workstream with documented decisions, response windows, and exception handling rules.': 'Ejecutar un flujo de trabajo acotado con decisiones documentadas, ventanas de respuesta y reglas de manejo de excepciones.',
      'Weeks 9–12': 'Semanas 9–12',
      'Review cohort movement, packet quality, and whether a broader rollout is justified.': 'Revisar el movimiento por cohortes, la calidad del paquete y si se justifica una implementación más amplia.',

      'Recovery design for recurring billing environments where cash control and customer experience both matter.': 'Diseño de recovery para entornos de cobro recurrente donde importan tanto el control de caja como la experiencia del cliente.',
      'The point is not aggressive collections rhetoric. It is better segmentation, commitment logic, documentation, and exception handling before escalation becomes expensive.': 'El punto no es una retórica agresiva de cobranza. El punto es mejor segmentación, lógica de compromisos, documentación y manejo de excepciones antes de que la escalación se vuelva costosa.',
      'Subscription and recurring-payment operators need recovery logic that protects both cash and customer experience.': 'Los operadores de suscripción y pagos recurrentes necesitan una lógica de recovery que proteja tanto la caja como la experiencia del cliente.',
      'Generic collections framing is often too blunt for recurring-billing businesses. The problem is not only delinquency; it is also poor segmentation, weak dunning discipline, inconsistent commitments, and exceptions that are not documented clearly enough to scale.': 'El enfoque genérico de collections suele ser demasiado tosco para negocios de cobro recurrente. El problema no es solo la morosidad; también es mala segmentación, disciplina débil de dunning, compromisos inconsistentes y excepciones mal documentadas para escalar.',
      'Structured recovery paths based on cohort behavior and payment friction.': 'Rutas de recovery estructuradas según comportamiento de cohortes y fricción de pago.',
      'Cleaner commitment tracking, exception handling, and payment-plan documentation.': 'Seguimiento más claro de compromisos, manejo de excepciones y documentación de planes de pago.',
      'More credible escalation decisions when internal recovery steps have already been controlled.': 'Decisiones de escalación más creíbles cuando los pasos internos de recovery ya están bajo control.',
      'Segmentation and workflow review for aging cohorts.': 'Revisión de segmentación y workflow para cohortes envejecidas.',
      'Commitment and exception-control standards.': 'Estándares de compromiso y control de excepciones.',
      'Pilot design tied to time-to-cash, cure rates, and avoidable external-cost exposure.': 'Diseño de piloto ligado a time-to-cash, tasas de regularización y exposición evitable a costos externos.',

      'Contract-heavy portfolios with dispersed teams, field activity, and inconsistent file quality need cleaner control before disputes or escalations widen.': 'Los portafolios con muchos contratos, equipos dispersos, actividad de campo y calidad documental desigual necesitan un control más limpio antes de que disputas o escalaciones se amplíen.',
      'Fleet and logistics portfolios often carry a hidden documentation problem alongside the receivable problem.': 'Los portafolios de flota y logística suelen arrastrar un problema documental oculto además del problema de cartera.',
      'Supporting records, guaranties, location-level practices, and contract amendments are often inconsistent. That makes recovery and escalation slower, less defensible, and more expensive than they should be.': 'Los soportes, garantías, prácticas por ubicación y enmiendas contractuales suelen ser inconsistentes. Eso vuelve el recovery y la escalación más lentos, menos defendibles y más costosos de lo necesario.',
      'Stronger authorization trails and support records for disputed or aging accounts.': 'Trazabilidad de autorizaciones y soportes más sólidos para cuentas disputadas o envejecidas.',
      'Cleaner packet structure before attorney or agency review.': 'Estructura de paquete más limpia antes de la revisión de abogados o agencia.',
      'More consistent operating rules across locations or teams.': 'Reglas operativas más consistentes entre ubicaciones o equipos.',
      'Document gap map for supporting records, approvals, and contract changes.': 'Mapa de brechas documentales para soportes, aprobaciones y cambios contractuales.',
      'Packet rules for disputed or escalated accounts.': 'Reglas de paquete para cuentas disputadas o escaladas.',
      'Pilot scope tied to faster handoff and lower cleanup drag.': 'Alcance del piloto ligado a un handoff más rápido y menor fricción de limpieza.',

      'Service businesses with layered contracts and invoicing often need cleaner control of the receivable and the escalation path at the same time.': 'Los negocios de servicios con contratos por capas y facturación compleja suelen necesitar un control más limpio tanto de la cartera como del camino de escalación.',
      'The problem is rarely just an unpaid invoice. It is usually a combination of weak authorization trails, incomplete service records, missing chronology, and ad hoc escalation behavior. That weak handoff compresses leverage and increases cleanup cost.': 'El problema rara vez es solo una factura impaga. Suele ser una combinación de autorizaciones débiles, registros de servicio incompletos, cronología ausente y una escalación ad hoc. Ese handoff débil reduce capacidad de maniobra y aumenta el costo de limpieza.',
      'Stronger authorization and invoice-support packet rules.': 'Reglas más sólidas para autorizaciones y soporte documental de facturas.',
      'More reliable chronology and issue mapping before escalation.': 'Cronología y mapeo de incidencias más fiables antes de la escalación.',
      'A clearer executive path from dispute review to operating decision.': 'Un camino ejecutivo más claro desde la revisión de la disputa hasta la decisión operativa.',
      'Document gap map for invoice, authorization, and service records.': 'Mapa de brechas para facturas, autorizaciones y registros de servicio.',
      'Packet and chronology standards for cleaner downstream review.': 'Estándares de paquete y cronología para una revisión posterior más limpia.',
      'Pilot scope with measurable control points and next-step governance.': 'Alcance de piloto con puntos de control medibles y gobierno del siguiente paso.',

      'Privacy policy': 'Política de privacidad',
      'How public-form data, optional analytics, and file-handling boundaries are treated on this site.': 'Cómo trata este sitio los datos de formularios públicos, la analítica opcional y los límites del manejo de archivos.',
      'This page was added to make privacy, consent, and document-handling expectations visible instead of implied.': 'Esta página se añadió para hacer explícitas las expectativas sobre privacidad, consentimiento y manejo documental.',
      'Overview': 'Resumen',
      'This site collects the information that visitors choose to submit through forms, plus technical information necessary to operate the site and — where consent is given — optional analytics or campaign measurement data.': 'Este sitio recopila la información que los visitantes deciden enviar mediante formularios, además de información técnica necesaria para operar el sitio y — cuando existe consentimiento — datos opcionales de analítica o medición de campañas.',
      'The site is configured around a static marketing experience with form delivery, optional analytics slots, and downloadable public materials. The exact tracker mix can vary by deployment, but optional analytics and marketing scripts are intended to load only after consent.': 'El sitio está configurado como una experiencia de marketing estática con envío de formularios, espacios opcionales de analítica y materiales públicos descargables. La combinación exacta de trackers puede variar según el despliegue, pero los scripts opcionales de analítica y marketing están pensados para cargarse solo tras el consentimiento.',
      'Information you submit': 'Información que usted envía',
      'Name, company, phone number, email address, and the details you enter into the public forms.': 'Nombre, empresa, número de teléfono, correo electrónico y los datos que introduzca en los formularios públicos.',
      'Files or packet drafts that you choose to upload through the structured intake.': 'Archivos o borradores de paquetes que decida cargar a través del intake estructurado.',
      'Context such as selected service line, urgency, and other form-routing information.': 'Contexto como la línea de servicio seleccionada, urgencia y otra información de enrutamiento de formularios.',
      'How the information is used': 'Cómo se utiliza la información',
      'To route, review, and respond to requests.': 'Para enrutar, revisar y responder solicitudes.',
      'To measure which public pages and campaigns are generating inquiries.': 'Para medir qué páginas públicas y campañas generan consultas.',
      'To improve site performance, form handling, and conversion paths.': 'Para mejorar el rendimiento del sitio, el manejo de formularios y las rutas de conversión.',
      'Important file-handling boundary': 'Límite importante para el manejo de archivos',
      'The public forms are designed for general business documents and non-regulated materials. Do not upload highly sensitive regulated records, medical records, or other materials that require a dedicated secure workflow unless secure coordination has been arranged first.': 'Los formularios públicos están diseñados para documentos comerciales generales y materiales no regulados. No cargue registros regulados muy sensibles, historias clínicas ni otros materiales que requieran un workflow seguro específico, salvo que antes se haya coordinado un canal seguro.',
      'Cookies and consent': 'Cookies y consentimiento',
      'The site uses a consent banner that distinguishes essential functionality from optional analytics or marketing measurement. Visitors can choose essential only, analytics only, or full consent where available.': 'El sitio utiliza un banner de consentimiento que distingue la funcionalidad esencial de la analítica o medición de marketing opcional. Los visitantes pueden elegir solo lo esencial, solo analítica o consentimiento completo cuando esté disponible.',
      'For more detail, see the Cookie Policy .': 'Para más detalle, consulte la Política de cookies.',
      'Third-party services': 'Servicios de terceros',
      'Form delivery, calendar scheduling, analytics, and campaign measurement may involve third-party services. Use of those services depends on the current deployment configuration and the visitor’s consent choices where applicable.': 'La entrega de formularios, la programación en calendario, la analítica y la medición de campañas pueden implicar servicios de terceros. El uso de esos servicios depende de la configuración actual del despliegue y de las elecciones de consentimiento del visitante, cuando corresponda.',
      'Contact': 'Contacto',
      'For privacy-related questions, use the public contact options on this site or call/text (888) 794-8292 .': 'Para cuestiones relacionadas con la privacidad, utilice las opciones públicas de contacto del sitio o llame / escriba al (888) 794-8292.',

      'Terms of use': 'Términos de uso',
      'Public-site terms, legal boundaries, and user responsibilities.': 'Términos del sitio público, límites legales y responsabilidades del usuario.',
      'This page makes the public boundaries explicit: information, not legal advice; no automatic engagement; and no guarantee of results.': 'Esta página deja claros los límites públicos: información, no asesoría jurídica; sin contratación automática; y sin garantía de resultados.',
      'Informational use': 'Uso informativo',
      'The public site is provided for informational and business-development purposes. It does not create an attorney-client relationship, agency relationship, or any binding engagement on its own.': 'El sitio público se ofrece con fines informativos y de desarrollo de negocio. No crea por sí solo una relación abogado-cliente, una relación de agencia ni ningún compromiso vinculante.',
      'No legal advice': 'No hay asesoría jurídica',
      'VitaCoreX LLC is not a law firm and does not provide legal advice or legal representation. Legal strategy and legal advice remain the responsibility of licensed counsel.': 'VitaCoreX LLC no es un bufete jurídico y no presta asesoría jurídica ni representación legal. La estrategia legal y el asesoramiento jurídico siguen siendo responsabilidad de abogados con licencia.',
      'No licensed collections activity represented here': 'Aquí no se representa actividad de cobranza licenciada',
      'The site does not position VitaCoreX as a licensed collection agency. Recovery-related work is framed as workflow infrastructure, documentation control, and operator support before or around escalation decisions.': 'El sitio no presenta a VitaCoreX como una agencia de cobranza licenciada. El trabajo relacionado con recovery se encuadra como infraestructura de workflow, control documental y soporte operativo antes o alrededor de decisiones de escalación.',
      'No guarantee of results': 'No hay garantía de resultados',
      'Any economics illustrations, examples, or pilot frames are informational. They are not guarantees of rankings, collections outcomes, ROI, or any fixed business result.': 'Toda ilustración económica, ejemplo o marco de piloto es informativo. No constituye garantía de rankings, resultados de cobranza, ROI ni de ningún resultado fijo de negocio.',
      'User responsibilities': 'Responsabilidades del usuario',
      'Provide accurate contact information.': 'Proporcionar información de contacto precisa.',
      'Do not submit unlawful content or content you are not authorized to share.': 'No enviar contenido ilícito ni contenido que no esté autorizado a compartir.',
      'Do not use the public forms as a substitute for a secure workflow where one is required.': 'No utilizar los formularios públicos como sustituto de un workflow seguro cuando este sea necesario.',
      'Engagements': 'Contrataciones',
      'Any actual working engagement requires separate confirmation, scope definition, and the appropriate written agreement.': 'Cualquier trabajo real requiere confirmación independiente, definición de alcance y el acuerdo escrito correspondiente.',

      'Cookie policy': 'Política de cookies',
      'How the site handles essential functionality, analytics consent, and configured measurement tools.': 'Cómo gestiona el sitio la funcionalidad esencial, el consentimiento analítico y las herramientas de medición configuradas.',
      'The site already had a consent banner. This page makes the consent logic and tracker categories explicit.': 'El sitio ya contaba con un banner de consentimiento. Esta página hace explícita la lógica de consentimiento y las categorías de trackers.',
      'How cookies are used': 'Cómo se usan las cookies',
      'The site uses essential functionality plus optional analytics and marketing measurement tools. Optional tools are intended to load only after consent.': 'El sitio utiliza funcionalidad esencial y herramientas opcionales de analítica y medición de marketing. Las herramientas opcionales están pensadas para cargarse solo después del consentimiento.',
      'Consent choices': 'Opciones de consentimiento',
      'Essential only: basic site operation without optional analytics or marketing tags.': 'Solo esenciales: funcionamiento básico del sitio sin analítica opcional ni etiquetas de marketing.',
      'Analytics only: essential functionality plus analytics-focused measurement.': 'Solo analítica: funcionalidad esencial más medición analítica.',
      'Accept all: essential, analytics, and any configured campaign/marketing measurement tools.': 'Aceptar todo: funcionalidad esencial, analítica y cualquier herramienta configurada de medición de campañas / marketing.',
      'Configured tracker slots': 'Slots de trackers configurados',
      'The site is prepared for Google Analytics 4, Google Tag Manager, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag, and Apollo website tracking. Whether each tool is active depends on the current deployment settings and consent choice.': 'El sitio está preparado para Google Analytics 4, Google Tag Manager, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag y Apollo website tracking. La activación de cada herramienta depende de la configuración actual del despliegue y de la elección de consentimiento.',
      'Managing consent': 'Gestión del consentimiento',
      'You can manage consent through the banner when it is shown. Browser settings can also be used to control or clear cookies.': 'Puede gestionar el consentimiento desde el banner cuando se muestre. La configuración del navegador también puede utilizarse para controlar o borrar cookies.',

      'Thank you. We received your request.': 'Gracias. Recibimos su solicitud.',
      'Your request has been logged. A team review typically begins within 1-2 business days once the submission is complete.': 'Su solicitud ha sido registrada. La revisión del equipo suele comenzar en un plazo de 1 a 2 días hábiles una vez que el envío está completo.',
      'Submission received': 'Solicitud recibida',
      'Next step': 'Siguiente paso',
      'Initial routing review': 'Revisión inicial de enrutamiento',
      'Response window': 'Ventana de respuesta',
      '1-2 business days': '1–2 días hábiles'
    }
  };

  function clean(text){ return String(text || '').replace(/\s+/g,' ').trim(); }

  function applySimpleTextMap(){
    if(lang === 'en') return;
    const map = TEXT[lang] || {};
    const selector = 'h1,h2,h3,p,li,a,button,span,strong,label,summary,div.metric-label,div.eyebrow';
    doc.querySelectorAll(selector).forEach((el)=>{
      if(!el || el.children.length) return;
      const key = clean(el.textContent);
      if(map[key]) el.textContent = map[key];
    });

    doc.querySelectorAll('.vcx-menu-text').forEach((el)=>{ if(map.Menu) el.textContent = map.Menu; });
    doc.querySelectorAll('.vcx-menu-btn').forEach((el)=>{ el.setAttribute('aria-label', map.Menu || 'Menu'); });

    doc.querySelectorAll('.footer-company .small-note').forEach((el)=>{
      const link = el.querySelector('.footer-phone-link');
      if(link){
        const prefix = lang === 'ru' ? 'Телефон (звонок / SMS): ' : 'Teléfono (llamada / texto): ';
        const node = Array.from(el.childNodes).find((n)=>n.nodeType===3);
        if(node) node.nodeValue = prefix;
      }
    });

    const titleMap = TITLE_MAP[page];
    if(titleMap && titleMap[lang]) doc.title = titleMap[lang];
  }

  function fallbackCommon(){
    const common = window.SITE_I18N && window.SITE_I18N[lang];
    if(!common) return;
    doc.querySelectorAll('[data-common]').forEach((el)=>{
      const key = el.getAttribute('data-common');
      if(common[key]) el.textContent = common[key];
    });
  }

  function hookLangButtons(){
    doc.querySelectorAll('.lang-btn').forEach((btn)=>{
      btn.classList.toggle('active', btn.dataset.lang === lang);
      if(btn.dataset.premiumFixBound) return;
      btn.dataset.premiumFixBound = '1';
      btn.addEventListener('click', ()=>{
        setTimeout(()=>{
          fallbackCommon();
          applySimpleTextMap();
        }, 40);
      });
    });
  }

  function optimizeHeroMedia(){
    const mobile = window.matchMedia('(max-width: 900px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    doc.querySelectorAll('.hero-video').forEach((wrap)=>{
      const video = wrap.querySelector('video');
      const poster = wrap.querySelector('img');
      if(!video) return;
      if(mobile || reduced){
        try{ video.pause(); }catch(err){}
        video.removeAttribute('autoplay');
        video.style.display = 'none';
        if(poster) poster.style.display = 'block';
        return;
      }
      if(video.style.display === 'none' || video.dataset.vcxForceHidden === '1') return;
      video.preload = 'metadata';
      const start = ()=>{
        if(video.style.display === 'none' || video.dataset.vcxForceHidden === '1') return;
        if(video.dataset.vcxPremiumPlayed) return;
        video.dataset.vcxPremiumPlayed = '1';
        const playPromise = video.play && video.play();
        if(playPromise && typeof playPromise.catch === 'function'){ playPromise.catch(()=>{}); }
      };
      if('requestIdleCallback' in window){
        window.requestIdleCallback(start, {timeout: 1200});
      }else{
        setTimeout(start, 600);
      }
    });
  }

  function fallbackCalculators(){
    const money = (value)=> new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value) || 0);

    const dragInputs = ['legalMatters','legalDragHours','legalDragRate'].map((id)=>doc.getElementById(id));
    const dragOut = doc.getElementById('legalDragOutput');
    const calcDrag = ()=>{
      if(!dragInputs.every(Boolean) || !dragOut) return;
      const [m,h,r] = dragInputs.map((el)=>Number(el.value) || 0);
      dragOut.textContent = money(m * h * r * 12);
    };
    dragInputs.forEach((el)=>{
      if(!el || el.dataset.vcxPremiumCalcBound) return;
      el.dataset.vcxPremiumCalcBound = '1';
      el.addEventListener('input', calcDrag);
      el.addEventListener('change', calcDrag);
    });
    calcDrag();

    const legalBtn = doc.getElementById('legalCalc');
    const legalExposure = doc.getElementById('legalExposure');
    const legalHours = doc.getElementById('legalHours');
    const legalRate = doc.getElementById('legalRate');
    const legalFiles = doc.getElementById('legalFiles');
    const legalHoursOut = doc.getElementById('legalExposureHours');
    const legalResult = doc.getElementById('legalResult');
    const runLegal = ()=>{
      if(!legalFiles || !legalRate || !legalHours || !legalExposure || !legalHoursOut) return;
      const files = Number(legalFiles.value) || 0;
      const rate = Number(legalRate.value) || 0;
      const hours = Number(legalHours.value) || 0;
      const exposure = files * rate * hours;
      const totalHours = files * hours;
      legalExposure.textContent = money(exposure);
      legalHoursOut.textContent = Math.round(totalHours).toLocaleString() + ' hrs';
      if(legalResult){
        legalResult.innerHTML = '<strong>Illustrative exposure</strong><p>At the current assumptions, administrative file cleanup may absorb <b>' + money(exposure) + '</b> in annual attorney time across approximately <b>' + Math.round(totalHours).toLocaleString() + ' hours</b>.</p>';
      }
    };
    if(legalBtn && !legalBtn.dataset.vcxPremiumCalcBound){
      legalBtn.dataset.vcxPremiumCalcBound = '1';
      legalBtn.addEventListener('click', runLegal);
    }

    const diagBtn = doc.getElementById('diagEvaluate');
    if(diagBtn && !diagBtn.dataset.vcxPremiumCalcBound){
      diagBtn.dataset.vcxPremiumCalcBound = '1';
      diagBtn.addEventListener('click', ()=>{
        const industry = doc.getElementById('diagIndustry')?.value;
        const complexity = doc.getElementById('diagComplexity')?.value;
        const docs = doc.getElementById('diagDocs')?.value;
        const pain = doc.getElementById('diagPain')?.value;
        const box = doc.getElementById('diagResult');
        if(!box) return;
        let recommendation = 'Begin with recovery infrastructure review.';
        if((docs === 'weak' && pain === 'counsel') || (docs === 'weak' && complexity !== 'standard')){
          recommendation = 'Begin with corporate legal file control and documentation governance.';
        }
        if((pain === 'recovery' && complexity !== 'standard' && docs !== 'structured') || (pain === 'agency' && complexity === 'critical')){
          recommendation = 'Run a combined 90-day pilot covering recovery workflow and legal file control.';
        }
        const sectorMap = {
          healthcare: 'Healthcare and dental operators usually benefit from earlier balance conversion, better payment documentation, and cleaner escalation discipline.',
          fleet: 'Fleet and logistics portfolios usually benefit from stronger authorization trails, cleaner packet logic, and more consistent operating rules.',
          subscription: 'Subscription environments usually benefit from stronger commitment logic, exception handling, and cleaner recurring-payment controls.',
          services: 'Contract-service operators usually benefit from tighter invoice support, issue mapping, and better handoff discipline.'
        };
        box.innerHTML = '<strong>' + recommendation + '</strong><p>' + (sectorMap[industry] || '') + '</p>';
      });
    }

    runLegal();
  }

  function init(){
    fallbackCommon();
    applySimpleTextMap();
    hookLangButtons();
    optimizeHeroMedia();
    fallbackCalculators();
  }

  if(doc.readyState === 'loading'){
    doc.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();
