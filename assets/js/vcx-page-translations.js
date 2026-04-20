/* ============================================================
   VCX PAGE CONTENT TRANSLATIONS
   Auto-translates body content on all pages (EN/RU/ES)
   Works by matching English text → translated text
   ============================================================ */
;(function(w){
'use strict';

/* vcxSetLang is defined in vcx-i18n.js — do NOT redefine here */

/* ─── Translation dictionary ─────────────────────────────────
   Key = English text (trimmed), Value = {ru: '...', es: '...'}
   ──────────────────────────────────────────────────────────── */
var T = {};
function add(en, ru, es){ T[en] = {ru: ru, es: es}; }

// ─── ABOUT PAGE ──────────────────────────────────────────────
add('About VitaCoreX',
    'О VitaCoreX',
    'Acerca de VitaCoreX');
add('Operational advisory for recovery, documentation control, and cleaner counsel handoff.',
    'Операционный консалтинг по возврату средств, контролю документации и подготовке передач юристам.',
    'Asesoría operativa para recuperación, control documental y traspaso ordenado a abogados.');
add('VitaCoreX is positioned for operators that need stronger cash-control logic, cleaner packet discipline, and a more credible handoff before outside cost expands.',
    'VitaCoreX создан для операторов, которым нужна более сильная логика контроля денежного потока, дисциплина подготовки пакетов и качественная передача до роста внешних расходов.',
    'VitaCoreX está diseñado para operadores que necesitan mayor control de flujo de caja, mejor disciplina documental y un traspaso más creíble antes de que los costos externos crezcan.');
add('Company-first positioning',
    'Корпоративный приоритет',
    'Enfoque empresarial primero');
add('These pages support the corporate lane first: recovery design, documentation control, and cleaner handoff before outside cost expands.',
    'Эти страницы прежде всего поддерживают корпоративное направление: дизайн возврата, контроль документации и качественная передача до роста внешних расходов.',
    'Estas páginas apoyan primero el canal corporativo: diseño de recuperación, control documental y traspaso limpio antes de que los costos externos crezcan.');
add('What VitaCoreX does',
    'Что делает VitaCoreX',
    'Qué hace VitaCoreX');
add('Builds operational control before expensive escalation.',
    'Выстраивает операционный контроль до дорогостоящей эскалации.',
    'Construye control operativo antes de una escalación costosa.');
add('VitaCoreX helps complex operators improve cash control, documentation discipline, and counsel-ready file structure before avoidable fee pressure expands.',
    'VitaCoreX помогает сложным операторам улучшить контроль денежного потока, дисциплину документации и структуру файлов, готовых для юристов, до того как вырастет избежная ценовая нагрузка.',
    'VitaCoreX ayuda a operadores complejos a mejorar el control de caja, la disciplina documental y la estructura de expedientes listos para abogados, antes de que la presión de costos evitables crezca.');
add('What VitaCoreX does not do',
    'Чего VitaCoreX не делает',
    'Qué no hace VitaCoreX');
add('Not legal representation and not licensed collections activity.',
    'Не юридическое представительство и не лицензированная коллекторская деятельность.',
    'No representación legal y no actividad de cobranza con licencia.');
add('The firm does not provide legal advice or act as a law firm. It also does not position itself as a licensed collection agency. Those boundaries stay visible across the site.',
    'Компания не предоставляет юридические консультации и не действует как юридическая фирма. Она также не позиционирует себя как лицензированное коллекторское агентство. Эти границы видны на всём сайте.',
    'La firma no brinda asesoría legal ni actúa como bufete. Tampoco se posiciona como agencia de cobranza con licencia. Esos límites son visibles en todo el sitio.');
add('What a first engagement produces',
    'Что даёт первое взаимодействие',
    'Qué produce un primer compromiso');
add('Diagnostic clarity, packet standards, and pilot logic.',
    'Диагностическая ясность, стандарты пакетов и логика пилотного проекта.',
    'Claridad diagnóstica, estándares de paquetes y lógica de piloto.');
add('A serious first phase should produce a work product: a gap map, a recommended workstream, and a measurement path that leadership can actually review.',
    'Серьёзная первая фаза должна произвести рабочий продукт: карту пробелов, рекомендованный рабочий поток и путь измерений, который руководство может реально проверить.',
    'Una primera fase seria debe producir un producto de trabajo: mapa de brechas, flujo de trabajo recomendado y un plan de medición que la dirección pueda revisar.');
add('Method',
    'Метод',
    'Método');
add('Diagnose, pilot, then scale only when the evidence justifies it.',
    'Диагностика, пилот, затем масштабирование только при наличии обоснованных доказательств.',
    'Diagnosticar, pilotear, luego escalar solo cuando la evidencia lo justifique.');
add('That is a stronger premium signal than generic promises. It shows operational discipline and keeps the story grounded in what can be documented.',
    'Это более сильный премиальный сигнал, чем общие обещания. Он демонстрирует операционную дисциплину и основывается на том, что можно документировать.',
    'Eso es una señal premium más fuerte que las promesas genéricas. Demuestra disciplina operativa y mantiene la historia basada en lo que se puede documentar.');
add('Diagnose',
    'Диагностика',
    'Diagnosticar');
add('Review workflow friction, document quality, escalation logic, and where recoverable value leaks first.',
    'Анализ трений в рабочем процессе, качества документов, логики эскалации и источников утечки возмещаемой стоимости.',
    'Revisar fricción en el flujo, calidad documental, lógica de escalación y dónde se filtra el valor recuperable primero.');
add('Pilot',
    'Пилот',
    'Piloto');
add('Define a contained workstream with clear expectations, response windows, and measurement logic.',
    'Определить ограниченный рабочий поток с чёткими ожиданиями, окнами реагирования и логикой измерения.',
    'Definir un flujo contenido con expectativas claras, ventanas de respuesta y lógica de medición.');
add('Scale',
    'Масштабирование',
    'Escalar');
add('Expand only when the pilot creates credible operator-owned evidence.',
    'Масштабировать только когда пилот создаёт достоверные доказательства, принадлежащие оператору.',
    'Expandir solo cuando el piloto cree evidencia creíble propiedad del operador.');
add('Typical first-phase outputs',
    'Типичные результаты первой фазы',
    'Productos típicos de la primera fase');
add('Current-state leakage and handoff review',
    'Анализ текущих утечек и качества передачи',
    'Revisión de fugas actuales y traspaso');
add('Document gap list and packet standard',
    'Список пробелов в документации и стандарт пакета',
    'Lista de brechas documentales y estándar de paquete');
add('Priority routing logic and next-step memo',
    'Логика приоритетной маршрутизации и меморандум следующих шагов',
    'Lógica de enrutamiento prioritario y memo de próximos pasos');
add('Pilot scope with measurement criteria',
    'Объём пилота с критериями измерения',
    'Alcance del piloto con criterios de medición');
add('Operator fit',
    'Подходящий оператор',
    'Ajuste operativo');
add('Built around buyers who care about margin, documentation discipline, and execution clarity.',
    'Создан для покупателей, которым важны маржинальность, дисциплина документации и ясность исполнения.',
    'Diseñado para compradores que valoran el margen, la disciplina documental y la claridad de ejecución.');
add('The company-first lane is deliberate. Private-client support remains available selectively, but the public brand now makes the primary operating category much clearer.',
    'Корпоративный приоритет — намеренный выбор. Поддержка частных клиентов остаётся выборочно доступной, но публичный бренд теперь намного яснее обозначает основную категорию.',
    'El enfoque empresarial es deliberado. El soporte a clientes privados sigue disponible selectivamente, pero la marca pública ahora aclara mucho mejor la categoría operativa principal.');
add('Strong fit',
    'Хороший выбор',
    'Buen ajuste');
add('Finance-led teams and owners who want a cleaner path to cash control.',
    'Финансово-ориентированные команды и владельцы, которым нужен более чистый путь к контролю денежного потока.',
    'Equipos liderados por finanzas y propietarios que buscan un camino más limpio hacia el control de caja.');
add('Operators dealing with fragmented files, aged balances, or weak escalation handoff.',
    'Операторы с фрагментированными файлами, просроченными балансами или слабой передачей при эскалации.',
    'Operadores con archivos fragmentados, saldos vencidos o traspaso débil en escalación.');
add('Counsel-adjacent environments where administrative cleanup is absorbing expensive time.',
    'Окружения, смежные с юридическими, где административная очистка поглощает дорогое время.',
    'Entornos adyacentes a abogados donde la limpieza administrativa absorbe tiempo costoso.');
add('Weak fit',
    'Не подходит',
    'Ajuste débil');
add('Buyers seeking legal advice or fully outsourced collections operations.',
    'Покупатели, ищущие юридические консультации или полностью аутсорсинговые коллекторские операции.',
    'Compradores que buscan asesoría legal u operaciones de cobranza completamente subcontratadas.');
add('Requests with no workable documents, no decision owner, and no interest in measurement.',
    'Запросы без рабочих документов, без ответственного за решения и без интереса к измерению.',
    'Solicitudes sin documentos utilizables, sin responsable de decisiones y sin interés en medición.');
add('Use cases where the public website is being treated like a secure regulated intake.',
    'Случаи, когда публичный сайт используется как защищённый регулируемый приём.',
    'Casos donde el sitio público se trata como una admisión regulada segura.');
add('Open structured intake',
    'Открыть структурированный приём',
    'Abrir admisión estructurada');
add('Review industry fit',
    'Обзор отраслевой пригодности',
    'Revisar ajuste por industria');

// ─── SOLUTIONS PAGE ──────────────────────────────────────────
add('Solutions',
    'Решения',
    'Soluciones');
add('Three clear solution lanes instead of one blended story.',
    'Три чётких направления решений вместо одной смешанной истории.',
    'Tres líneas de solución claras en lugar de una historia mezclada.');
add('The public architecture now makes it easier to understand whether the operator needs recovery design, file control, or a structured routing layer first.',
    'Публичная архитектура теперь упрощает понимание, нужен ли оператору дизайн возврата, контроль файлов или структурированный уровень маршрутизации.',
    'La arquitectura pública ahora facilita entender si el operador necesita diseño de recuperación, control de archivos o una capa de enrutamiento estructurado.');
add('Revenue Recovery Infrastructure',
    'Инфраструктура возврата выручки',
    'Infraestructura de recuperación de ingresos');
add('Pre-agency workflow design for cleaner commitments, better sequencing, and stronger measurement discipline.',
    'Проектирование рабочих процессов до агентства для более чистых обязательств, лучшей последовательности и дисциплины измерений.',
    'Diseño de flujo pre-agencia para compromisos más limpios, mejor secuenciación y disciplina de medición más fuerte.');
add('Behavioral segmentation and outreach timing',
    'Поведенческая сегментация и время контакта',
    'Segmentación conductual y cronología de contacto');
add('Payment-plan structure and autopay logic',
    'Структура платёжных планов и логика автоплатежей',
    'Estructura de planes de pago y lógica de autopago');
add('Escalation control and pilot economics',
    'Контроль эскалации и экономика пилота',
    'Control de escalación y economía del piloto');
add('Corporate Legal File Control',
    'Контроль корпоративного юридического документооборота',
    'Control de expediente legal corporativo');
add('Chronology cleanup, packet standards, and cleaner file readiness before outside counsel is asked to move.',
    'Очистка хронологии, стандарты пакетов и более чистая готовность файлов до того, как внешнему юристу предложат действовать.',
    'Limpieza de cronología, estándares de paquetes y preparación más limpia antes de que el abogado externo deba actuar.');
add('Gap logs and chronology control',
    'Журналы пробелов и контроль хронологии',
    'Registros de brechas y control cronológico');
add('Exhibit order and packet assembly',
    'Порядок экспонатов и сборка пакета',
    'Orden de anexos y ensamblaje de paquete');
add('Counsel-ready documentation workflows',
    'Рабочие процессы документации, готовой для юристов',
    'Flujos documentales listos para abogados');
add('Structured Intake & Packet Build',
    'Структурированный приём и сборка пакета',
    'Admisión estructurada y armado de paquete');
add('Best for routing, first-packet cleanup, and identifying the right workstream before scope expands.',
    'Лучше всего для маршрутизации, очистки первого пакета и определения правильного рабочего потока до расширения объёма.',
    'Ideal para enrutamiento, limpieza del primer paquete e identificación del flujo correcto antes de expandir el alcance.');
add('Fit review and routing memo',
    'Проверка пригодности и меморандум маршрутизации',
    'Revisión de ajuste y memo de enrutamiento');
add('Document request logic',
    'Логика запроса документов',
    'Lógica de solicitud documental');
add('Next-step recommendation',
    'Рекомендация следующего шага',
    'Recomendación del próximo paso');
add('When to start where',
    'С чего начать',
    'Cuándo empezar dónde');
add('The correct entry point depends on the operational bottleneck.',
    'Правильная точка входа зависит от операционного узкого места.',
    'El punto de entrada correcto depende del cuello de botella operativo.');
add('Each service lane addresses a distinct operational need, so you can identify whether the priority is recovery, file control, or case routing.',
    'Каждое направление решает отдельную операционную задачу, чтобы вы могли определить приоритет: возврат, контроль файлов или маршрутизация дел.',
    'Cada línea de servicio aborda una necesidad operativa distinta, para que pueda identificar si la prioridad es recuperación, control de archivos o enrutamiento de casos.');
add('Start with recovery infrastructure',
    'Начните с инфраструктуры возврата',
    'Comience con infraestructura de recuperación');
add('When the main issue is aging balances, inconsistent outreach, weak payment-plan structure, or early agency fee compression.',
    'Когда главная проблема — просроченные балансы, непоследовательный контакт, слабая структура платёжных планов или раннее сжатие комиссий агентств.',
    'Cuando el problema principal son saldos vencidos, contacto inconsistente, estructura débil de planes de pago o compresión temprana de comisiones de agencia.');
add('Start with legal file control',
    'Начните с контроля юридических файлов',
    'Comience con control de archivos legales');
add('When outside counsel or internal leadership is losing time to chronology cleanup, exhibit disorder, or missing packet logic.',
    'Когда внешний юрист или внутреннее руководство теряет время на очистку хронологии, беспорядок экспонатов или отсутствие логики пакетов.',
    'Cuando el abogado externo o la dirección interna pierde tiempo en limpieza cronológica, desorden de anexos o falta de lógica de paquete.');
add('Start with structured intake',
    'Начните со структурированного приёма',
    'Comience con admisión estructurada');
add('When the matter is not yet clean enough to define the real workstream, but there is enough context to route it properly.',
    'Когда дело ещё недостаточно чистое для определения реального рабочего потока, но достаточно контекста для правильной маршрутизации.',
    'Cuando el asunto aún no está lo suficientemente claro para definir el flujo real, pero hay suficiente contexto para enrutarlo correctamente.');
add('Request confidential review',
    'Запросить конфиденциальный разбор',
    'Solicitar revisión confidencial');
add('Review industries',
    'Обзор отраслей',
    'Revisar industrias');

// ─── INDUSTRIES PAGE ─────────────────────────────────────────
add('Industries',
    'Отрасли',
    'Industrias');
add('Focused industry pages for the operator environments that fit VitaCoreX best.',
    'Целевые отраслевые страницы для операционных сред, которые лучше всего подходят VitaCoreX.',
    'Páginas industriales enfocadas para los entornos operativos que mejor se ajustan a VitaCoreX.');
add('Each industry page highlights where the recovery and documentation model delivers the strongest results for operators in that sector.',
    'Каждая отраслевая страница показывает, где модель возврата и документации даёт наиболее сильные результаты для операторов данного сектора.',
    'Cada página industrial destaca dónde el modelo de recuperación y documentación ofrece los resultados más sólidos para operadores de ese sector.');
add('Industry fit',
    'Отраслевое соответствие',
    'Ajuste industrial');
add('Focused landing pages make the offer easier to trust and easier to rank.',
    'Целевые отраслевые страницы помогают быстрее найти нужное решение для вашего сектора.',
    'Las páginas industriales enfocadas le ayudan a encontrar la solución adecuada para su sector más rápidamente.');
add('Broad positioning can still exist, but a newer domain needs narrower entry points where the operating logic is more obvious and the buyer sees themselves faster.',
    'Широкое позиционирование может существовать, но новый домен нуждается в более узких точках входа, где операционная логика очевиднее и покупатель быстрее себя узнаёт.',
    'El posicionamiento amplio puede existir, pero un dominio nuevo necesita puntos de entrada más estrechos donde la lógica operativa sea más obvia y el comprador se identifique más rápido.');
add('Healthcare & dental',
    'Здравоохранение и стоматология',
    'Salud y dental');
add('Patient-balance environments with documentation drag and pre-agency leakage.',
    'Среды с балансами пациентов, задержками документации и утечками до передачи агентству.',
    'Entornos de saldos de pacientes con retraso documental y fuga pre-agencia.');
add('Useful where revenue recovery and packet discipline are both breaking down.',
    'Полезно там, где и возврат доходов, и дисциплина пакетов нарушены.',
    'Útil donde tanto la recuperación de ingresos como la disciplina de paquetes están fallando.');
add('Subscription & recurring payments',
    'Подписки и повторяющиеся платежи',
    'Suscripciones y pagos recurrentes');
add('Recurring billing operators balancing retention sensitivity with recovery discipline.',
    'Операторы повторяющихся платежей, балансирующие чувствительность удержания с дисциплиной возврата.',
    'Operadores de facturación recurrente que equilibran la sensibilidad de retención con la disciplina de recuperación.');
add('Useful where dunning, commitments, and exceptions need stronger logic.',
    'Полезно там, где напоминания, обязательства и исключения нуждаются в более сильной логике.',
    'Útil donde los avisos de cobro, compromisos y excepciones necesitan lógica más fuerte.');
add('Fleet & logistics',
    'Автопарк и логистика',
    'Flota y logística');
add('Contract-heavy portfolios with dispersed operations and uneven document control.',
    'Портфели с большим количеством контрактов, распределёнными операциями и неравномерным контролем документов.',
    'Portafolios con muchos contratos, operaciones dispersas y control documental desigual.');
add('Useful where supporting records and receivable actions are inconsistent across locations.',
    'Полезно там, где сопроводительные записи и действия по дебиторской задолженности непоследовательны между локациями.',
    'Útil donde los registros de soporte y acciones de cuentas por cobrar son inconsistentes entre ubicaciones.');
add('Contract-heavy services',
    'Контрактоёмкие услуги',
    'Servicios con muchos contratos');
add('Commercial service businesses with invoice, authorization, and escalation complexity.',
    'Коммерческие сервисные бизнесы со сложностью счетов, авторизаций и эскалации.',
    'Negocios de servicios comerciales con complejidad de facturación, autorización y escalación.');
add('Useful where weak files and weak handoff logic create avoidable cash drag and cleanup cost.',
    'Полезно там, где слабые файлы и слабая логика передачи создают избежные задержки денежного потока и затраты на очистку.',
    'Útil donde archivos débiles y lógica de traspaso débil crean retraso de caja evitable y costos de limpieza.');
add('Why this matters',
    'Почему это важно',
    'Por qué esto importa');
add('Industry-specific pages create tighter search intent, stronger landing-page relevance, and a cleaner path for campaign traffic.',
    'Отраслевые страницы создают более точное поисковое намерение, более сильную релевантность посадочных страниц и чистый путь для рекламного трафика.',
    'Las páginas por industria crean intención de búsqueda más precisa, mayor relevancia de página de destino y un camino más limpio para el tráfico de campaña.');

// ─── CONTACT PAGE ────────────────────────────────────────────
add('Private consultation',
    'Конфиденциальная консультация',
    'Consulta privada');
add('Choose the right entry point.',
    'Выберите правильную точку входа.',
    'Elija el punto de entrada correcto.');
add('Use structured intake when materials are ready for review. Use private consultation when leadership needs routing, scoping, or a recommendation before assembling a packet.',
    'Используйте структурированный приём, когда материалы готовы к проверке. Используйте частную консультацию, когда руководству нужна маршрутизация, определение объёма или рекомендация перед сборкой пакета.',
    'Use admisión estructurada cuando los materiales estén listos. Use consulta privada cuando la dirección necesite enrutamiento, alcance o una recomendación antes de armar un paquete.');
add('Structured intake',
    'Структурированный приём',
    'Admisión estructurada');
add('Best for document-ready matters, active files, invoices, contracts, screenshots, or an existing packet.',
    'Лучше всего для дел с готовыми документами, активных файлов, счетов, контрактов, скриншотов или существующего пакета.',
    'Ideal para asuntos con documentos listos, archivos activos, facturas, contratos, capturas o un paquete existente.');
add('Document upload supported',
    'Поддерживается загрузка документов',
    'Carga de documentos soportada');
add('Routing and packet review',
    'Маршрутизация и проверка пакета',
    'Enrutamiento y revisión de paquete');
add('B2B-first service selection',
    'B2B-ориентированный выбор услуг',
    'Selección de servicios B2B primero');
add('Best for owners, operators, and counsel-adjacent teams who need scoping, sequencing, or a strategic recommendation first.',
    'Лучше всего для владельцев, операторов и команд, смежных с юридическими, которым сначала нужно определение объёма, последовательности или стратегическая рекомендация.',
    'Ideal para propietarios, operadores y equipos adyacentes a abogados que necesitan primero alcance, secuenciación o una recomendación estratégica.');
add('High-level operator conversation',
    'Разговор на уровне руководства',
    'Conversación de alto nivel operativo');
add('Implementation-path discussion',
    'Обсуждение пути внедрения',
    'Discusión de ruta de implementación');
add('No document upload required',
    'Загрузка документов не требуется',
    'No requiere carga de documentos');
add('Book consultation',
    'Записаться на консультацию',
    'Reservar consulta');
add('Private consultation line',
    'Частная линия консультации',
    'Línea de consulta privada');
add('For routing, confidential coordination, and fast direction.',
    'Для маршрутизации, конфиденциальной координации и быстрого направления.',
    'Para enrutamiento, coordinación confidencial y dirección rápida.');
add('Call or text when leadership needs a quick path before a formal packet is assembled.',
    'Позвоните или напишите, когда руководству нужен быстрый путь до сборки формального пакета.',
    'Llame o envíe mensaje cuando la dirección necesite un camino rápido antes de armar un paquete formal.');
add('Call or text',
    'Позвонить или написать',
    'Llamar o escribir');
add('(888) 794-8292',
    '(888) 794-8292',
    '(888) 794-8292');
add('Private line for consultation coordination',
    'Частная линия для координации консультаций',
    'Línea privada para coordinación de consultas');
add('Call private line',
    'Позвонить на частную линию',
    'Llamar a línea privada');
add('Response window',
    'Окно ответа',
    'Ventana de respuesta');
add('1–2 business days after a complete request.',
    '1–2 рабочих дня после полного запроса.',
    '1–2 días hábiles después de una solicitud completa.');
add('Faster routing is possible when the request is scoped clearly and the right workstream is selected at the start.',
    'Более быстрая маршрутизация возможна, когда запрос чётко определён и правильный рабочий поток выбран с самого начала.',
    'El enrutamiento más rápido es posible cuando la solicitud está bien definida y el flujo correcto se selecciona desde el inicio.');
add('Confidential coordination',
    'Конфиденциальная координация',
    'Coordinación confidencial');
add('Use the phone line for direction, not for sending regulated records.',
    'Используйте телефонную линию для направления, а не для отправки регулируемых записей.',
    'Use la línea telefónica para orientación, no para enviar registros regulados.');
add('The private consultation line is useful for routing and scoping. For sensitive materials, request a secure exchange path first.',
    'Частная линия консультации полезна для маршрутизации и определения объёма. Для чувствительных материалов сначала запросите безопасный канал обмена.',
    'La línea de consulta privada es útil para enrutamiento y alcance. Para materiales sensibles, solicite primero un canal seguro de intercambio.');
add('Buyer confidence',
    'Доверие покупателя',
    'Confianza del comprador');
add('Company-first routing remains the default posture.',
    'Корпоративная маршрутизация остаётся позицией по умолчанию.',
    'El enrutamiento empresarial sigue siendo la postura predeterminada.');
add('Private-client support remains available selectively, but the public contact flow is designed around serious operator engagements first.',
    'Поддержка частных клиентов остаётся выборочно доступной, но публичный контактный поток ориентирован прежде всего на серьёзные операторские взаимодействия.',
    'El soporte a clientes privados sigue disponible selectivamente, pero el flujo de contacto público está diseñado primero para compromisos operativos serios.');

// ─── CAREERS PAGE ────────────────────────────────────────────
add('Careers',
    'Сотрудничество',
    'Carreras');
add('Work with discretion, judgment, and disciplined execution.',
    'Работайте с осмотрительностью, здравым смыслом и дисциплинированным исполнением.',
    'Trabaje con discreción, criterio y ejecución disciplinada.');
add('We look for people who write clearly, think carefully, and can protect quality in a documentation-intensive environment.',
    'Мы ищем людей, которые ясно пишут, тщательно думают и могут защищать качество в документационно-насыщенной среде.',
    'Buscamos personas que escriban con claridad, piensen cuidadosamente y puedan proteger la calidad en un entorno intensivo en documentación.');
add('Preferred profile',
    'Предпочтительный профиль',
    'Perfil preferido');
add('Strong English, clear business writing, verified recommendations preferred, and prior experience in documentation, operations, client support, legal support, or litigation support.',
    'Сильный английский, ясное деловое письмо, предпочтительно подтверждённые рекомендации и опыт в документации, операциях, клиентской поддержке, юридической поддержке или поддержке судебных процессов.',
    'Inglés fuerte, escritura comercial clara, recomendaciones verificadas preferidas y experiencia previa en documentación, operaciones, soporte al cliente, soporte legal o soporte de litigios.');
add('Who we look for',
    'Кого мы ищем',
    'A quién buscamos');
add('Disciplined candidates who can work in a documentation-first operating model.',
    'Дисциплинированных кандидатов, способных работать в операционной модели с приоритетом документации.',
    'Candidatos disciplinados que puedan trabajar en un modelo operativo centrado en documentación.');
add('Strong and confident English.',
    'Сильный и уверенный английский.',
    'Inglés fuerte y seguro.');
add('Verifiable recommendations strongly preferred.',
    'Подтверждаемые рекомендации настоятельно приветствуются.',
    'Se prefieren fuertemente recomendaciones verificables.');
add('Preference for Russian-speaking candidates with excellent English.',
    'Предпочтение русскоязычным кандидатам с отличным английским.',
    'Preferencia por candidatos de habla rusa con excelente inglés.');
add('How to apply',
    'Как подать заявку',
    'Cómo postularse');
add('Full Name',
    'Полное имя',
    'Nombre completo');
add('Email',
    'Электронная почта',
    'Correo electrónico');
add('Select role',
    'Выберите роль',
    'Seleccionar rol');
add('Operations support',
    'Операционная поддержка',
    'Soporte operativo');
add('Documentation support',
    'Документационная поддержка',
    'Soporte documental');
add('Intake support',
    'Поддержка приёма',
    'Soporte de admisión');
add('Translation support',
    'Поддержка переводов',
    'Soporte de traducción');
add('Admin support',
    'Административная поддержка',
    'Soporte administrativo');
add('Client coordination',
    'Координация с клиентами',
    'Coordinación con clientes');
add('Business documentation support',
    'Поддержка деловой документации',
    'Soporte de documentación empresarial');
add('Submit application',
    'Отправить заявку',
    'Enviar solicitud');
add('Complete all required fields to activate the application email.',
    'Заполните все обязательные поля для активации электронного письма с заявкой.',
    'Complete todos los campos requeridos para activar el correo de solicitud.');
add('Application handling',
    'Обработка заявки',
    'Manejo de solicitudes');
add('Send only the materials needed to assess fit.',
    'Отправьте только материалы, необходимые для оценки пригодности.',
    'Envíe solo los materiales necesarios para evaluar el ajuste.');
add('Use the form for standard professional information. Do not send highly sensitive identity documents or regulated records through the public career form.',
    'Используйте форму для стандартной профессиональной информации. Не отправляйте особо чувствительные документы, удостоверяющие личность, или регулируемые записи через публичную карьерную форму.',
    'Use el formulario para información profesional estándar. No envíe documentos de identidad altamente sensibles o registros regulados a través del formulario público de carreras.');
add('Work style',
    'Стиль работы',
    'Estilo de trabajo');
add('Clarity, discretion, and repeatable execution matter more than theatrics.',
    'Ясность, сдержанность и воспроизводимое исполнение важнее театральности.',
    'La claridad, la discreción y la ejecución repetible importan más que la teatralidad.');
add('That standard now shows up consistently across the site and in the hiring flow.',
    'Этот стандарт теперь последовательно отражён на всём сайте и в процессе найма.',
    'Ese estándar ahora se refleja consistentemente en todo el sitio y en el flujo de contratación.');

// ─── ADDITIONAL SERVICES ─────────────────────────────────────
add('Private client services',
    'Услуги для частных клиентов',
    'Servicios para clientes privados');
add('Curated private-client support for documentation-led matters.',
    'Курированная поддержка частных клиентов для дел, основанных на документации.',
    'Soporte curado para clientes privados en asuntos basados en documentación.');
add('Selected private matters remain available where the work is administrative, documentation-heavy, and clearly scoped. The company-first VitaCoreX position remains primary.',
    'Отдельные частные дела остаются доступными, когда работа административная, насыщенная документацией и с чётким объёмом. Корпоративный приоритет VitaCoreX остаётся главным.',
    'Asuntos privados seleccionados siguen disponibles cuando el trabajo es administrativo, intensivo en documentación y con alcance claro. La posición empresarial de VitaCoreX sigue siendo primaria.');
add('Curated and selective',
    'Курированный и избирательный подход',
    'Curado y selectivo');
add('These services remain available, but intentionally secondary, so the core brand stays centered on corporate advisory and disciplined execution.',
    'Эти услуги доступны для избранных частных вопросов, подкреплённые той же дисциплиной документации и стандартами качества корпоративного консалтинга.',
    'Estos servicios están disponibles para asuntos individuales seleccionados, respaldados por la misma disciplina documental y estándares de calidad de la consultoría corporativa.');
add('Curated services',
    'Курированные услуги',
    'Servicios curados');
add('Contracts & Documentation',
    'Контракты и документация',
    'Contratos y documentación');
add('Administrative support for contract review, structured document cleanup, and support packets.',
    'Административная поддержка для проверки контрактов, структурированной очистки документов и вспомогательных пакетов.',
    'Soporte administrativo para revisión de contratos, limpieza documental estructurada y paquetes de soporte.');
add('Contract review support',
    'Поддержка проверки контрактов',
    'Soporte de revisión de contratos');
add('Document organization',
    'Организация документов',
    'Organización documental');
add('Demand-letter packet preparation',
    'Подготовка пакета претензионных писем',
    'Preparación de paquete de cartas de demanda');
add('Try Contract Scanner',
    'Попробовать сканер договоров',
    'Probar escáner de contratos');
add('Request review',
    'Запросить проверку',
    'Solicitar revisión');
add('Immigration Packet Organization',
    'Организация иммиграционных пакетов',
    'Organización de paquetes de inmigración');
add('Documentation-first help for form packets, evidence ordering, and submission readiness.',
    'Помощь с приоритетом документации для пакетов форм, упорядочивания доказательств и готовности к подаче.',
    'Ayuda centrada en documentación para paquetes de formularios, ordenamiento de evidencia y preparación para presentación.');
add('Packet organization',
    'Организация пакетов',
    'Organización de paquetes');
add('Evidence checklist cleanup',
    'Очистка чеклиста доказательств',
    'Limpieza de lista de verificación de evidencia');
add('Submission-readiness review',
    'Проверка готовности к подаче',
    'Revisión de preparación para presentación');
add('Try Immigration Helper',
    'Попробовать помощник по иммиграции',
    'Probar ayudante de inmigración');
add('Auto Deal Fee & Payment Calculator',
    'Калькулятор сборов и платежей автосделки',
    'Calculadora de tarifas y pagos de trato automotriz');
add('Enter deal numbers to flag fees above common thresholds and calculate true monthly payments before signing.',
    'Введите числа сделки для выявления сборов выше обычных порогов и расчёта реальных ежемесячных платежей до подписания.',
    'Ingrese los números del trato para señalar tarifas por encima de umbrales comunes y calcular pagos mensuales reales antes de firmar.');
add('Fee threshold check (doc fee, GAP, warranty)',
    'Проверка порогов сборов (документационный сбор, GAP, гарантия)',
    'Verificación de umbrales de tarifas (doc fee, GAP, garantía)');
add('Monthly payment calculator with APR',
    'Калькулятор ежемесячных платежей с годовой ставкой',
    'Calculadora de pago mensual con APR');
add('Negotiation points summary',
    'Сводка переговорных позиций',
    'Resumen de puntos de negociación');
add('Try Auto Deal Check',
    'Попробовать проверку автосделки',
    'Probar verificación de trato automotriz');
add('Florida Official Source Locator',
    'Поиск по официальным источникам Флориды',
    'Localizador de fuentes oficiales de Florida');
add('Routes you to the correct official Florida government portal for tolls, traffic citations, and court records. We do not retrieve records directly.',
    'Направляет вас на правильный официальный портал правительства Флориды для сборов, штрафов и судебных записей. Мы не получаем записи напрямую.',
    'Lo dirige al portal oficial correcto del gobierno de Florida para peajes, multas de tráfico y registros judiciales. No recuperamos registros directamente.');
add('Routes to SunPass, CFX, and county toll portals',
    'Направляет на порталы SunPass, CFX и окружные порталы сборов',
    'Dirige a portales SunPass, CFX y portales de peaje del condado');
add('Links to county clerk traffic citation portals',
    'Ссылки на порталы штрафов клерков округов',
    'Enlaces a portales de multas de tráfico del secretario del condado');
add('Links to Florida Courts and PACER portals',
    'Ссылки на порталы судов Флориды и PACER',
    'Enlaces a portales de tribunales de Florida y PACER');
add('Start Portal Locator',
    'Начать поиск по порталам',
    'Iniciar localizador de portales');
add('Corporate advisory remains the primary position',
    'Корпоративный консалтинг остаётся основной позицией',
    'La asesoría corporativa sigue siendo la posición principal');
add('If the matter belongs on the company side—revenue recovery, legal-file control, or a corporate packet—use structured intake instead of this private-client page.',
    'Если дело относится к корпоративной стороне — возврат доходов, контроль юридических файлов или корпоративный пакет — используйте структурированный приём вместо этой страницы для частных клиентов.',
    'Si el asunto pertenece al lado empresarial — recuperación de ingresos, control de archivos legales o paquete corporativo — use admisión estructurada en lugar de esta página de clientes privados.');

// ─── RESOURCES PAGE ──────────────────────────────────────────
add('Executive library',
    'Библиотека для руководства',
    'Biblioteca ejecutiva');
add('Executive materials for owners, CFOs, operators, and counsel.',
    'Материалы для руководства: владельцев, финансовых директоров, операторов и юристов.',
    'Materiales ejecutivos para propietarios, CFOs, operadores y abogados.');
add('Designed for internal forwarding, investment discussions, and cleaner first conversations.',
    'Предназначены для внутренней пересылки, инвестиционных обсуждений и более чистых первых разговоров.',
    'Diseñados para reenvío interno, discusiones de inversión y conversaciones iniciales más limpias.');
add('What each resource provides',
    'Что предоставляет каждый ресурс',
    'Qué proporciona cada recurso');
add('Concise briefing material for founders, operators, CFOs, counsel, and internal stakeholders who need an executive frame before a call.',
    'Краткий информационный материал для основателей, операторов, финансовых директоров, юристов и внутренних заинтересованных сторон, которым нужна руководящая перспектива перед звонком.',
    'Material informativo conciso para fundadores, operadores, CFOs, abogados e interesados internos que necesitan un marco ejecutivo antes de una llamada.');
add('Healthcare leakage brief',
    'Бриф по утечкам в здравоохранении',
    'Resumen de fugas en salud');
add('Healthcare CFO brief',
    'Бриф для финансового директора в здравоохранении',
    'Resumen para CFO de salud');
add('Dental institutional deck',
    'Институциональная презентация для стоматологии',
    'Presentación institucional dental');
add('Pre-collection executive review',
    'Исполнительный обзор до взыскания',
    'Revisión ejecutiva pre-cobranza');
add('Use by role',
    'Использование по роли',
    'Uso por rol');
add('Each brief should answer a specific internal question.',
    'Каждый бриф должен отвечать на конкретный внутренний вопрос.',
    'Cada resumen debe responder una pregunta interna específica.');
add('Owner / CEO',
    'Владелец / CEO',
    'Propietario / CEO');
add('Should clarify where margin is leaking and why the operating layer matters before outside cost grows.',
    'Должен прояснить, где утекает маржа и почему операционный уровень важен до роста внешних расходов.',
    'Debe aclarar dónde se filtra el margen y por qué la capa operativa importa antes de que crezcan los costos externos.');
add('CFO / finance',
    'Финансовый директор / финансы',
    'CFO / finanzas');
add('Should frame cash velocity, fee compression, and how pilot measurement would be documented.',
    'Должен представить скорость денежного потока, сжатие комиссий и как будут документированы измерения пилота.',
    'Debe enmarcar la velocidad de caja, la compresión de tarifas y cómo se documentaría la medición del piloto.');
add('Operations',
    'Операции',
    'Operaciones');
add('Should explain workflow sequencing, packet discipline, and how exceptions are handled more cleanly.',
    'Должен объяснить последовательность рабочих процессов, дисциплину пакетов и как исключения обрабатываются чище.',
    'Debe explicar la secuenciación del flujo, la disciplina de paquetes y cómo se manejan las excepciones de manera más limpia.');
add('Counsel-adjacent teams',
    'Команды, смежные с юридическими',
    'Equipos adyacentes a abogados');
add('Should show why better file readiness reduces administrative cleanup before legal strategy begins.',
    'Должен показать, почему лучшая готовность файлов сокращает административную очистку до начала юридической стратегии.',
    'Debe mostrar por qué una mejor preparación de archivos reduce la limpieza administrativa antes de que comience la estrategia legal.');
add('Review industry pages',
    'Обзор отраслевых страниц',
    'Revisar páginas por industria');

// ─── STRUCTURED INTAKE PAGE ─────────────────────────────────
add('Submit materials for structured review.',
    'Отправьте материалы для структурированной проверки.',
    'Envíe materiales para revisión estructurada.');
add('Use this page when a file, packet, invoice set, contract stack, or dispute record is ready for disciplined review.',
    'Используйте эту страницу, когда файл, пакет, набор счетов, стопка контрактов или запись о споре готовы к дисциплинированной проверке.',
    'Use esta página cuando un archivo, paquete, conjunto de facturas, pila de contratos o registro de disputa esté listo para revisión disciplinada.');
add('Best for document-ready matters',
    'Лучше всего для дел с готовыми документами',
    'Ideal para asuntos con documentos listos');
add('Company operators remain the primary fit. Private-client matters are reviewed where documentation quality and scope are already clear.',
    'Корпоративные операторы остаются основным соответствием. Частные дела рассматриваются, когда качество документации и объём уже ясны.',
    'Los operadores corporativos siguen siendo el ajuste principal. Los asuntos de clientes privados se revisan donde la calidad documental y el alcance ya están claros.');
add('Company / Portfolio',
    'Компания / Портфель',
    'Empresa / Portafolio');
add('Private Client',
    'Частный клиент',
    'Cliente privado');
add('Phone',
    'Телефон',
    'Teléfono');
add('State',
    'Штат',
    'Estado');
add('Urgency',
    'Срочность',
    'Urgencia');
add('Select urgency',
    'Выберите срочность',
    'Seleccionar urgencia');
add('Standard',
    'Стандартный',
    'Estándar');
add('48 hours',
    '48 часов',
    '48 horas');
add('24 hours',
    '24 часа',
    '24 horas');
add('Same day / urgent',
    'В тот же день / срочно',
    'Mismo día / urgente');
add('Service type',
    'Тип услуги',
    'Tipo de servicio');
add('Select service type',
    'Выберите тип услуги',
    'Seleccionar tipo de servicio');
add('Other',
    'Другое',
    'Otro');
add('Message / Situation summary',
    'Сообщение / Описание ситуации',
    'Mensaje / Resumen de situación');
add('Request structured intake',
    'Запросить структурированный приём',
    'Solicitar admisión estructurada');
add('What happens next',
    'Что происходит дальше',
    'Qué sucede después');
add('Structured review before any recommendation is made.',
    'Структурированная проверка до выдачи любой рекомендации.',
    'Revisión estructurada antes de cualquier recomendación.');
add('Confidentiality',
    'Конфиденциальность',
    'Confidencialidad');
add('Governance',
    'Управление',
    'Gobernanza');
add('Privacy Policy',
    'Политика конфиденциальности',
    'Política de privacidad');
add('Terms of Use',
    'Условия использования',
    'Términos de uso');
add('Cookie Policy',
    'Политика cookies',
    'Política de cookies');

// ─── SHARED / REPEATED STRINGS ──────────────────────────────
add('Request a confidential review',
    'Запросить конфиденциальный разбор',
    'Solicitar revisión confidencial');
add('View executive briefs',
    'Просмотр материалов для руководства',
    'Ver informes ejecutivos');
add('Where this fits',
    'Где это применимо',
    'Dónde encaja');
add('Where this fits best',
    'Где это подходит лучше всего',
    'Dónde encaja mejor');
add('VCX Product',
    'Продукт VCX',
    'Producto VCX');
add('Contract Review Desk',
    'Кабинет проверки контрактов',
    'Mesa de revisión de contratos');
add('Open review desk',
    'Открыть кабинет проверки',
    'Abrir mesa de revisión');
add('Packet Room',
    'Комната пакетов',
    'Sala de paquetes');
add('Open packet room',
    'Открыть комнату пакетов',
    'Abrir sala de paquetes');
add('Legal Assistant',
    'Юридический ассистент',
    'Asistente legal');
add('Open assistant',
    'Открыть ассистента',
    'Abrir asistente');
add('Deadline Calendar',
    'Календарь дедлайнов',
    'Calendario de plazos');
add('Open calendar',
    'Открыть календарь',
    'Abrir calendario');
add('Good fit',
    'Хорошее соответствие',
    'Buen ajuste');
add('Not designed for',
    'Не предназначено для',
    'No diseñado para');
add('Review privacy policy',
    'Обзор политики конфиденциальности',
    'Revisar política de privacidad');
add('Guardrail',
    'Ограничение',
    'Salvaguarda');
add('PDF',
    'PDF',
    'PDF');
add('Executive brief',
    'Бриф для руководства',
    'Resumen ejecutivo');
add('Open PDF',
    'Открыть PDF',
    'Abrir PDF');
add('CFO brief',
    'Бриф для финансового директора',
    'Resumen para CFO');
add('Institutional deck',
    'Институциональная презентация',
    'Presentación institucional');
add('Executive review',
    'Исполнительный обзор',
    'Revisión ejecutiva');
add('About VitaCoreX',
    'О VitaCoreX',
    'Acerca de VitaCoreX');

// ─── Revenue Recovery (key strings) ─────────────────────────
add('Private advisory for operators that want stronger cash conversion, cleaner documentation, and less contingency leakage before agency escalation or outside legal spend expands.',
    'Частный консалтинг для операторов, которые хотят более сильную конверсию денежных потоков, более чистую документацию и меньше утечек до эскалации в агентство или роста внешних юридических расходов.',
    'Asesoría privada para operadores que quieren mayor conversión de efectivo, documentación más limpia y menos fugas antes de la escalación a agencia o el crecimiento de costos legales externos.');
add('Executive framing',
    'Руководящая перспектива',
    'Marco ejecutivo');
add('How pilot proof is established',
    'Как устанавливается доказательство пилота',
    'Cómo se establece la prueba del piloto');
add('Framework components',
    'Компоненты фреймворка',
    'Componentes del marco');
add('KPI dashboard',
    'Панель KPI',
    'Panel de KPI');
add('What leadership monitors',
    'Что контролирует руководство',
    'Qué monitorea la dirección');
add('Pilot measurement plan',
    'План измерений пилота',
    'Plan de medición del piloto');
add('Typical operating components',
    'Типичные операционные компоненты',
    'Componentes operativos típicos');
add('Pilot work product',
    'Рабочий продукт пилота',
    'Producto de trabajo del piloto');
add('What a serious first phase should produce',
    'Что должна произвести серьёзная первая фаза',
    'Qué debe producir una primera fase seria');
add('Recovery Pilot Studio',
    'Студия пилота возврата',
    'Estudio de piloto de recuperación');
add('Start pilot',
    'Начать пилот',
    'Iniciar piloto');
add('Intake OS',
    'Система приёма',
    'Sistema de admisión');
add('Open intake',
    'Открыть приём',
    'Abrir admisión');

// ─── ADDITIONAL SERVICES — missing ──────────────────────────
add('Selected support for individuals and one-off matters.',
    'Избранная поддержка для физических лиц и разовых дел.',
    'Apoyo seleccionado para individuos y asuntos puntuales.');
add('Private-client matters remain available where the work is administrative, documentation-heavy, and clearly scoped.',
    'Дела частных клиентов остаются доступными, когда работа административная, насыщенная документацией и с чётким объёмом.',
    'Los asuntos de clientes privados siguen disponibles cuando el trabajo es administrativo, intensivo en documentación y con alcance claro.');
add('Open structured intake',
    'Открыть структурированный приём',
    'Abrir admisión estructurada');
add('These services remain available where there is fit, while the primary VitaCoreX position remains executive consulting for companies.',
    'Эти услуги остаются доступными при наличии соответствия, но основная позиция VitaCoreX — управленческий консалтинг для компаний.',
    'Estos servicios siguen disponibles donde hay ajuste, mientras que la posición principal de VitaCoreX sigue siendo consultoría ejecutiva para empresas.');
add('VitaCoreX serves company operators and selected private clients. Individual matters are accepted when the scope is clear, documentation-driven, and aligned with our quality standards.',
    'VitaCoreX обслуживает корпоративных операторов и избранных частных клиентов. Индивидуальные дела принимаются, когда объём ясен, работа документарная и соответствует нашим стандартам качества.',
    'VitaCoreX atiende a operadores empresariales y clientes privados seleccionados. Los asuntos individuales se aceptan cuando el alcance es claro, basado en documentación y alineado con nuestros estándares de calidad.');
add('Server-side clause extraction and risk scoring. Upload contracts for structured analysis beyond the free scanner.',
    'Серверное извлечение условий и оценка рисков. Загрузите контракты для структурированного анализа за пределами бесплатного сканера.',
    'Extracción de cláusulas del lado del servidor y puntuación de riesgo. Cargue contratos para análisis estructurado más allá del escáner gratuito.');
add('First-pass workflow guidance for contracts, immigration packets, auto deals, and Florida official-source routing.',
    'Первичное руководство по рабочим процессам для контрактов, иммиграционных пакетов, автосделок и маршрутизации по официальным источникам Флориды.',
    'Orientación de primera pasada para contratos, paquetes de inmigración, tratos automotrices y enrutamiento a fuentes oficiales de Florida.');
add('Secure client portal for matter tracking, document uploads, comments, and deliverable downloads.',
    'Защищённый клиентский портал для отслеживания дел, загрузки документов, комментариев и скачивания результатов.',
    'Portal seguro para clientes para seguimiento de asuntos, carga de documentos, comentarios y descarga de entregables.');
add('Risk-first deadline tracking for legal cases, payments, hearings, and follow-ups. Your personal operations calendar with AI assistance.',
    'Отслеживание сроков с приоритетом рисков для юридических дел, платежей, слушаний и последующих действий. Ваш персональный операционный календарь с ИИ-помощником.',
    'Seguimiento de plazos con prioridad de riesgo para casos legales, pagos, audiencias y seguimientos. Su calendario operativo personal con asistencia de IA.');
add('Company & solutions',
    'Компания и решения',
    'Empresa y soluciones');
add('Review, privacy & contact',
    'Разбор, конфиденциальность и контакты',
    'Revisión, privacidad y contacto');

// ─── CORPORATE LEGAL FILE CONTROL ───────────────────────────
add('Corporate Legal File Control for operators that need counsel-ready files and less attorney-rate cleanup.',
    'Контроль корпоративного юридического документооборота для операторов, которым нужны файлы, готовые для юристов, и меньше дорогостоящей доработки.',
    'Control de expediente legal corporativo para operadores que necesitan archivos listos para abogados y menos limpieza a tarifa de abogado.');
add('Typical control outputs',
    'Типичные результаты контроля',
    'Resultados de control típicos');
add('First-week work product',
    'Результаты первой недели',
    'Producto de trabajo de la primera semana');
add('Typical engagement rhythm',
    'Типичный ритм работы',
    'Ritmo de trabajo típico');
add('Commercial structure',
    'Коммерческая структура',
    'Estructura comercial');
add('See attorney-rate drag, file quality, and handoff readiness in one view.',
    'Посмотрите влияние стоимости юриста, качество файлов и готовность к передаче в одном обзоре.',
    'Vea el arrastre de tarifa de abogado, la calidad del expediente y la preparación del traspaso en una sola vista.');
add('Estimate how much expensive cleanup work is being absorbed before counsel can move.',
    'Оцените, сколько дорогостоящей доработки поглощается до того, как юристы смогут приступить к работе.',
    'Estime cuánto trabajo de limpieza costoso se absorbe antes de que el abogado pueda avanzar.');
add('Relevant operator environments',
    'Релевантные операционные среды',
    'Entornos operativos relevantes');
add('Attorney-rate drag estimator',
    'Калькулятор влияния стоимости юриста',
    'Estimador de arrastre de tarifa de abogado');
add('File readiness index',
    'Индекс готовности файлов',
    'Índice de preparación de expedientes');
add('Illustrative matter flow',
    'Иллюстративный ход дела',
    'Flujo ilustrativo del asunto');
add('What premium file control should signal',
    'Что должен показывать премиальный контроль файлов',
    'Qué debe señalar el control premium de expedientes');
add('Attorney cleanup exposure',
    'Риск затрат на доработку юристом',
    'Exposición a limpieza por abogado');
add('Estimated annual exposure',
    'Расчётная годовая экспозиция',
    'Exposición anual estimada');

// ─── SHARED INDUSTRY ENVIRONMENTS ───────────────────────────
add('Patient-balance and packet-discipline environments.',
    'Среды с балансами пациентов и дисциплиной пакетов.',
    'Entornos de saldos de pacientes y disciplina de paquetes.');
add('Recurring billing and churn-sensitive recovery workflows.',
    'Повторяющийся биллинг и процессы возврата, чувствительные к оттоку.',
    'Facturación recurrente y flujos de recuperación sensibles al churn.');
add('Dispersed operations with contract-heavy receivables.',
    'Распределённые операции с контрактоёмкой дебиторской задолженностью.',
    'Operaciones dispersas con cuentas por cobrar con muchos contratos.');
add('Multi-party documentation and escalation-control needs.',
    'Многосторонняя документация и потребности в контроле эскалации.',
    'Documentación multipartita y necesidades de control de escalación.');

// ─── REVENUE RECOVERY ───────────────────────────────────────
add('What gets reviewed each week',
    'Что проверяется каждую неделю',
    'Qué se revisa cada semana');
add('See pilot measurement plan',
    'Посмотреть план измерений пилота',
    'Ver plan de medición del piloto');

// ─── RESOURCES — missing ────────────────────────────────────
add('These briefs are public executive materials.',
    'Эти брифы являются публичными материалами для руководства.',
    'Estos informes son materiales ejecutivos públicos.');

// ─── STRUCTURED INTAKE — missing ────────────────────────────
add('Preliminary intake output',
    'Предварительные результаты приёма',
    'Resultado preliminar de admisión');

// ─── SHARED FOOTER ──────────────────────────────────────────
add('Company & solutions',
    'Компания и решения',
    'Empresa y soluciones');
add('Review, privacy & contact',
    'Обзор, конфиденциальность и контакт',
    'Revisión, privacidad y contacto');
add('Trust & procurement',
    'Доверие и закупки',
    'Confianza y compras');

// ─── PROCUREMENT PAGES (Phase 8) ─────────────────────────────
// Covers: pricing-and-engagement-tiers, sub-processors-and-dpa,
// security-and-compliance, sample-deliverable, procurement-FAQ,
// privacy-policy, terms-of-use — visible procurement-facing strings.

// -- Pricing & engagement tiers --
add('Pricing & engagement tiers · Published',
    'Цены и уровни взаимодействия · Публично',
    'Precios y niveles de contratación · Publicado');
add('Three tiers, published fees, no contingency.',
    'Три уровня, публикуемые ставки, без гонораров от результата.',
    'Tres niveles, tarifas publicadas, sin honorarios contingentes.');
add('Why bands, not a single price',
    'Почему диапазоны, а не одна цена',
    'Por qué bandas y no un único precio');
add('The three tiers',
    'Три уровня',
    'Los tres niveles');
add('Fixed fees where we can. Bands where scope genuinely varies.',
    'Фиксированные ставки, где возможно. Диапазоны, где объём действительно различается.',
    'Tarifas fijas donde es posible. Bandas donde el alcance realmente varía.');
add('Diagnostic',
    'Диагностика',
    'Diagnóstico');
add('90-day Pilot',
    'Пилот на 90 дней',
    'Piloto de 90 días');
add('Programme',
    'Программа',
    'Programa');
add('Most common',
    'Чаще всего',
    'Más común');
add('Request a Diagnostic',
    'Запросить диагностику',
    'Solicitar un diagnóstico');
add('Start a 90-day Pilot',
    'Запустить пилот на 90 дней',
    'Iniciar un piloto de 90 días');
add('Discuss a Programme',
    'Обсудить программу',
    'Conversar sobre un programa');
add('Billing & termination mechanics',
    'Механика оплаты и расторжения',
    'Mecánica de facturación y terminación');
add('Exactly what happens at start, mid, and end of engagement.',
    'Что именно происходит в начале, середине и в конце взаимодействия.',
    'Qué sucede exactamente al inicio, a medio camino y al cierre del contrato.');
add('Event',
    'Событие',
    'Evento');
add('Deposit at start',
    'Авансовый платёж в начале',
    'Depósito inicial');
add('Payment terms',
    'Условия оплаты',
    'Términos de pago');
add('Scope change',
    'Изменение объёма',
    'Cambio de alcance');
add('Early termination by operator',
    'Досрочное расторжение со стороны оператора',
    'Terminación anticipada por el operador');
add('Early termination by VitaCoreX',
    'Досрочное расторжение со стороны VitaCoreX',
    'Terminación anticipada por VitaCoreX');
add('Data & playbook ownership',
    'Принадлежность данных и плейбука',
    'Propiedad de datos y playbook');
add('Invoice form',
    'Форма счёта',
    'Formato de factura');
add('ROI framework',
    'Методика расчёта ROI',
    'Marco de ROI');
add('How we measure, and what "works" actually means.',
    'Как мы измеряем и что на самом деле значит «работает».',
    'Cómo medimos y qué significa realmente que «funciona».');
add('What we count',
    'Что мы считаем',
    'Qué contamos');
add("What we don't count",
    'Что мы не считаем',
    'Qué no contamos');
add('Start a structured intake',
    'Начать структурированный приём',
    'Iniciar admisión estructurada');
add("See what you'd receive",
    'Посмотреть, что вы получите',
    'Ver qué recibiría');

// -- Sub-processors & DPA --
add('Sub-processors & DPA · Named, dated, scoped',
    'Субпроцессоры и DPA · Поимённо, с датами, с объёмом',
    'Sub-procesadores y DPA · Nombrados, con fecha, con alcance');
add('Who touches the data, in what role, and what we put in writing.',
    'Кто касается данных, в какой роли и что мы фиксируем письменно.',
    'Quién toca los datos, en qué rol y qué ponemos por escrito.');
add('Named vendors and what they touch',
    'Именованные поставщики и зона их доступа',
    'Proveedores nombrados y a qué acceden');
add('Data Processing Addendum summary',
    'Краткое изложение соглашения об обработке данных (DPA)',
    'Resumen del Addendum de Procesamiento de Datos (DPA)');
add('Change notification',
    'Уведомление об изменениях',
    'Notificación de cambios');
add('Artifacts available on request',
    'Артефакты, предоставляемые по запросу',
    'Artefactos disponibles bajo solicitud');
add('DPA & contracts',
    'DPA и контракты',
    'DPA y contratos');
add('Vendor diligence',
    'Проверка поставщиков',
    'Debida diligencia de proveedores');
add('Purpose limitation & scope',
    'Ограничение цели и объёма',
    'Limitación de propósito y alcance');
add('Sub-processor binding',
    'Обязательства субпроцессоров',
    'Vinculación de sub-procesadores');
add('Security baseline',
    'Базовый уровень безопасности',
    'Línea base de seguridad');
add('Breach notification (72 hours)',
    'Уведомление об утечке (72 часа)',
    'Notificación de brecha (72 horas)');
add('Data-subject rights & cooperation',
    'Права субъектов данных и сотрудничество',
    'Derechos del sujeto de datos y cooperación');
add('Retention & destruction',
    'Хранение и уничтожение',
    'Retención y destrucción');
add('Audit rights',
    'Права на аудит',
    'Derechos de auditoría');
add('International transfers',
    'Международная передача',
    'Transferencias internacionales');
add('Regulatory boundaries',
    'Регуляторные границы',
    'Límites regulatorios');

// -- Security & compliance (key headers) --
add('Security & Compliance · Procurement-grade disclosure',
    'Безопасность и комплаенс · Раскрытие для закупок',
    'Seguridad y cumplimiento · Divulgación para compras');
add('What your procurement, legal, and security teams need to file us as a vendor.',
    'Что нужно вашим отделам закупок, юристам и безопасности, чтобы оформить нас как поставщика.',
    'Lo que sus equipos de compras, legal y seguridad necesitan para registrarnos como proveedor.');
add('Data handling posture',
    'Подход к обработке данных',
    'Postura de manejo de datos');
add('Access controls',
    'Управление доступом',
    'Controles de acceso');
add('Incident response',
    'Реагирование на инциденты',
    'Respuesta a incidentes');
add('Compliance boundaries',
    'Границы комплаенса',
    'Límites de cumplimiento');
add('Procurement artifacts',
    'Артефакты для закупок',
    'Artefactos para compras');
add('Read the full security posture',
    'Прочитать полный обзор безопасности',
    'Leer la postura de seguridad completa');

// -- Sample deliverable --
add('Sample deliverable · Redacted 30-day diagnostic',
    'Образец отчёта · 30-дневная диагностика (с редактированием)',
    'Entregable de muestra · Diagnóstico de 30 días (editado)');
add('What a VitaCoreX diagnostic actually looks like.',
    'Как на самом деле выглядит диагностика VitaCoreX.',
    'Cómo se ve realmente un diagnóstico de VitaCoreX.');
add('What this sample is',
    'Что представляет собой этот образец',
    'Qué es esta muestra');
add("What's redacted and why",
    'Что отредактировано и почему',
    'Qué se ha editado y por qué');
add('Sample sections (abbreviated)',
    'Разделы образца (сокращённо)',
    'Secciones de la muestra (abreviadas)');
add('Review security & compliance',
    'Просмотреть безопасность и комплаенс',
    'Revisar seguridad y cumplimiento');

// -- Procurement FAQ (key questions) --
add('Procurement & Vendor Onboarding',
    'Закупки и подключение поставщика',
    'Compras e incorporación de proveedores');
add('Do you provide W-9, Certificate of Insurance, and NDA on request?',
    'Предоставляете ли вы W-9, сертификат страхования и NDA по запросу?',
    '¿Proporciona W-9, Certificado de Seguro y NDA bajo solicitud?');
add('Will you sign an NDA before the first technical conversation?',
    'Подпишете ли вы NDA до первого технического разговора?',
    '¿Firmarán un NDA antes de la primera conversación técnica?');
add('Where is client data stored, and in what jurisdiction?',
    'Где хранятся данные клиента и в какой юрисдикции?',
    '¿Dónde se almacenan los datos del cliente y en qué jurisdicción?');
add('Can you work inside our environment instead of yours?',
    'Можете ли вы работать в нашей среде, а не в вашей?',
    '¿Pueden trabajar dentro de nuestro entorno en lugar del suyo?');
add('Do you work on contingency or outcome-based pricing?',
    'Работаете ли вы за гонорар от результата или по модели оплаты по итогам?',
    '¿Trabajan con honorarios contingentes o precios basados en resultados?');
add('How do you measure ROI and report results?',
    'Как вы измеряете ROI и отчитываетесь о результатах?',
    '¿Cómo miden el ROI y reportan los resultados?');

// -- Privacy & terms (hero + key sections) --
add('Privacy policy · Last updated 17 April 2026',
    'Политика конфиденциальности · Обновлено 17 апреля 2026',
    'Política de privacidad · Actualizado el 17 de abril de 2026');
add('How site data, engagement data, and operator data are handled — stated, not implied.',
    'Как обрабатываются данные сайта, данные взаимодействия и данные оператора — явно, а не по умолчанию.',
    'Cómo se tratan los datos del sitio, los datos del contrato y los datos del operador — declarado, no implícito.');
add('Two streams of data',
    'Два потока данных',
    'Dos flujos de datos');
add('Information you submit via the public site',
    'Информация, которую вы отправляете через публичный сайт',
    'Información que envía a través del sitio público');
add('How site data is used',
    'Как используются данные сайта',
    'Cómo se usan los datos del sitio');
add('Important file-handling boundary',
    'Важная граница по работе с файлами',
    'Límite importante para el manejo de archivos');
add('Cookies and consent',
    'Cookies и согласие',
    'Cookies y consentimiento');
add('Third-party services and sub-processors',
    'Сторонние сервисы и субпроцессоры',
    'Servicios de terceros y sub-procesadores');
add('Operator data: purpose limitation & scope',
    'Данные оператора: ограничение цели и объёма',
    'Datos del operador: limitación de propósito y alcance');
add('Retention & destruction',
    'Хранение и уничтожение',
    'Retención y destrucción');
add('Breach notification',
    'Уведомление об утечке',
    'Notificación de brecha');
add('Your rights & data-subject requests',
    'Ваши права и запросы субъекта данных',
    'Sus derechos y solicitudes del sujeto de datos');
add('Governing law & jurisdiction',
    'Применимое право и юрисдикция',
    'Ley aplicable y jurisdicción');
add('Changes to this policy',
    'Изменения этой политики',
    'Cambios a esta política');
add('Contact',
    'Контакт',
    'Contacto');
add('Terms of use · Last updated 17 April 2026',
    'Условия использования · Обновлено 17 апреля 2026',
    'Términos de uso · Actualizado el 17 de abril de 2026');
add('Site terms, engagement-letter supremacy, and procurement-relevant boundaries.',
    'Условия сайта, верховенство договора о взаимодействии и границы, важные для закупок.',
    'Términos del sitio, supremacía de la carta de contratación y límites relevantes para compras.');
add('Informational use of the public site',
    'Информационное использование публичного сайта',
    'Uso informativo del sitio público');
add('No legal advice',
    'Без юридических консультаций',
    'Sin asesoría legal');
add('No licensed collections activity represented here',
    'Лицензированная коллекторская деятельность здесь не представлена',
    'Aquí no se representa actividad de cobranza con licencia');
add('No guarantee of results',
    'Без гарантии результата',
    'Sin garantía de resultados');
add('Engagement letter supersedes these terms',
    'Договор о взаимодействии имеет приоритет над этими условиями',
    'La carta de contratación prevalece sobre estos términos');
add('User responsibilities',
    'Обязанности пользователя',
    'Responsabilidades del usuario');
add('Intellectual property on the public site',
    'Интеллектуальная собственность на публичном сайте',
    'Propiedad intelectual en el sitio público');
add('Engagement IP & data ownership',
    'Интеллектуальная собственность и данные в рамках взаимодействия',
    'Propiedad intelectual y datos en el contrato');
add('Confidentiality',
    'Конфиденциальность',
    'Confidencialidad');
add('Disclaimer of warranties (site use)',
    'Отказ от гарантий (использование сайта)',
    'Renuncia de garantías (uso del sitio)');
add('Limitation of liability (site use)',
    'Ограничение ответственности (использование сайта)',
    'Limitación de responsabilidad (uso del sitio)');
add('Indemnification',
    'Возмещение убытков',
    'Indemnización');
add('Governing law, venue, dispute resolution',
    'Применимое право, место рассмотрения, разрешение споров',
    'Ley aplicable, jurisdicción, resolución de disputas');
add('Severability',
    'Делимость условий',
    'Divisibilidad');
add('Changes to these terms',
    'Изменения этих условий',
    'Cambios a estos términos');

// ─── PRIVACY POLICY — body strings ──────────────────────────
add('This policy covers both the public website (forms, optional analytics, cookies) and data VitaCoreX processes during engagements (operator data governed by the Data Processing Addendum). See Sub-processors & DPA and Security & Compliance for the full procurement posture.',
    'Эта политика охватывает как публичный сайт (формы, опциональная аналитика, cookie), так и данные, обрабатываемые VitaCoreX в ходе взаимодействий (данные оператора, регулируемые DPA). См. <a href="sub-processors-and-dpa.html">Субпроцессоры и DPA</a> и <a href="security-and-compliance.html">Безопасность и соответствие</a> для полной закупочной позиции.',
    'Esta política cubre tanto el sitio público (formularios, analítica opcional, cookies) como los datos que VitaCoreX procesa durante los compromisos (datos del operador regidos por el DPA). Consulte <a href="sub-processors-and-dpa.html">Subprocesadores y DPA</a> y <a href="security-and-compliance.html">Seguridad y cumplimiento</a> para la postura completa de procurement.');

add('This policy covers two distinct data streams that are handled differently:',
    'Эта политика охватывает два различных потока данных, которые обрабатываются по-разному:',
    'Esta política cubre dos flujos de datos distintos que se manejan de forma diferente:');

add('Site data — submissions through public forms, cookies, and optional analytics on vitacorexllc.com. Governed by this privacy policy.',
    '<strong>Данные сайта</strong> — отправки через публичные формы, cookie и опциональная аналитика на vitacorexllc.com. Регулируются этой политикой конфиденциальности.',
    '<strong>Datos del sitio</strong> — envíos a través de formularios públicos, cookies y analítica opcional en vitacorexllc.com. Regidos por esta política de privacidad.');

add("Operator data — data processed during engagements under a signed engagement letter (and, on request, a Data Processing Addendum). Governed by the DPA clauses summarized on the Sub-processors & DPA page and by the operator's own data-handling requirements where stricter.",
    '<strong>Данные оператора</strong> — данные, обрабатываемые в ходе взаимодействий по подписанному соглашению (и, по запросу, DPA). Регулируются положениями DPA, изложенными на странице <a href="sub-processors-and-dpa.html">Субпроцессоры и DPA</a>, и собственными требованиями оператора к обработке данных, если они строже.',
    '<strong>Datos del operador</strong> — datos procesados durante los compromisos bajo una carta de contratación firmada (y, a petición, un DPA). Regidos por las cláusulas del DPA resumidas en la página <a href="sub-processors-and-dpa.html">Subprocesadores y DPA</a> y por los requisitos de manejo de datos del propio operador cuando sean más estrictos.');

add('Unless otherwise stated, sections below apply to site data. Operator-data sections are marked explicitly.',
    'Если не указано иное, разделы ниже относятся к данным сайта. Разделы о данных оператора помечены явно.',
    'A menos que se indique lo contrario, las secciones siguientes aplican a los datos del sitio. Las secciones sobre datos del operador están marcadas explícitamente.');

add('Name, company, phone number, email address, and the details you enter into the public forms.',
    'Имя, компания, номер телефона, адрес электронной почты и данные, которые вы вводите в публичные формы.',
    'Nombre, empresa, teléfono, correo electrónico y los detalles que ingresa en los formularios públicos.');

add('Files or packet drafts that you choose to upload through the structured intake.',
    'Файлы или черновики пакетов, которые вы загружаете через структурированный приём.',
    'Archivos o borradores de paquetes que usted sube a través de la admisión estructurada.');

add('Context such as selected service line, urgency, and other form-routing information.',
    'Контекст, такой как выбранное направление услуг, срочность и другая информация маршрутизации форм.',
    'Contexto como línea de servicio seleccionada, urgencia y otra información de enrutamiento del formulario.');

add('To route, review, and respond to requests.',
    'Для маршрутизации, рассмотрения и ответов на запросы.',
    'Para enrutar, revisar y responder a las solicitudes.');

add('To measure which public pages and campaigns are generating inquiries.',
    'Для измерения того, какие публичные страницы и кампании генерируют запросы.',
    'Para medir qué páginas públicas y campañas están generando consultas.');

add('To improve site performance, form handling, and conversion paths.',
    'Для улучшения производительности сайта, обработки форм и путей конверсии.',
    'Para mejorar el rendimiento del sitio, el manejo de formularios y las rutas de conversión.');

add('Site data is not sold, rented, or shared for third-party marketing. Where consented analytics (GA4) is active, measurement data is aggregated and retained per the consent banner choices.',
    'Данные сайта не продаются, не сдаются в аренду и не передаются для стороннего маркетинга. Там, где активна аналитика с согласием (GA4), данные измерений агрегируются и хранятся в соответствии с выбором в баннере согласия.',
    'Los datos del sitio no se venden, alquilan ni comparten para marketing de terceros. Donde está activa la analítica con consentimiento (GA4), los datos de medición se agregan y conservan según las elecciones del banner de consentimiento.');

add('The public forms are designed for general business documents and non-regulated materials. Do not upload highly sensitive regulated records, medical records subject to HIPAA, financial records subject to GLBA, or other materials that require a dedicated secure workflow unless secure coordination has been arranged first. For regulated-data engagements the correct intake path is the Structured Case Intake followed by an engagement letter and, where applicable, a Business Associate Agreement.',
    'Публичные формы предназначены для общих деловых документов и нерегулируемых материалов. Не загружайте высокочувствительные регулируемые записи, медицинские записи, подпадающие под HIPAA, финансовые записи, подпадающие под GLBA, или другие материалы, требующие выделенного безопасного процесса, без предварительного согласования. Для взаимодействий с регулируемыми данными правильный путь приёма — <a href="structured-case-intake.html">Структурированный приём дел</a>, за которым следует соглашение о взаимодействии и, где применимо, BAA.',
    'Los formularios públicos están diseñados para documentos empresariales generales y materiales no regulados. No suba registros regulados altamente sensibles, registros médicos bajo HIPAA, registros financieros bajo GLBA ni otros materiales que requieran un flujo seguro dedicado sin coordinación segura previa. Para compromisos con datos regulados, la ruta correcta es la <a href="structured-case-intake.html">Admisión estructurada de casos</a> seguida de una carta de contratación y, donde aplique, un BAA.');

add('The site uses a consent banner that distinguishes essential functionality from optional analytics or marketing measurement. Visitors can choose essential only, analytics only, or full consent where available. See the Cookie Policy for the specific cookie inventory.',
    'Сайт использует баннер согласия, который отделяет базовую функциональность от опциональной аналитики или измерения маркетинга. Посетители могут выбрать только базовое, только аналитику или полное согласие, где доступно. См. <a href="cookie-policy.html">Политику cookie</a> для конкретного перечня.',
    'El sitio usa un banner de consentimiento que distingue la funcionalidad esencial de la analítica opcional o la medición de marketing. Los visitantes pueden elegir solo esencial, solo analítica o consentimiento completo donde esté disponible. Consulte la <a href="cookie-policy.html">Política de cookies</a> para el inventario específico.');

add('Form delivery, calendar scheduling, analytics, email infrastructure, CRM, document signature, and optional campaign measurement rely on named third-party services. The complete list — vendor, purpose, data categories touched, and region — is published on the Sub-processors & DPA page and is updated when vendors are added, changed, or removed (30-day standard notice; 15-day objection window; 5-day emergency notice for security-driven swaps).',
    'Доставка форм, планирование календаря, аналитика, почтовая инфраструктура, CRM, электронная подпись и опциональное измерение кампаний опираются на названные сторонние сервисы. Полный список — поставщик, цель, категории затрагиваемых данных и регион — публикуется на странице <a href="sub-processors-and-dpa.html">Субпроцессоры и DPA</a> и обновляется при добавлении, изменении или удалении поставщиков (стандартное уведомление 30 дней; окно возражения 15 дней; экстренное уведомление 5 дней при замене из соображений безопасности).',
    'La entrega de formularios, la programación de calendario, la analítica, la infraestructura de correo, el CRM, la firma electrónica y la medición opcional de campañas dependen de servicios de terceros nombrados. La lista completa — proveedor, propósito, categorías de datos afectadas y región — se publica en la página <a href="sub-processors-and-dpa.html">Subprocesadores y DPA</a> y se actualiza cuando se añaden, cambian o eliminan proveedores (aviso estándar de 30 días; ventana de objeción de 15 días; aviso de emergencia de 5 días para cambios impulsados por seguridad).');

add('Applies to engagement data, not site data. Operator data processed during engagements is used only for the purposes named in the engagement letter. It is not repurposed for marketing, training of general-purpose AI models, or use on other engagements. Operator data stays isolated in engagement-scoped storage with access limited to the named engagement team.',
    '<em>Применяется к данным взаимодействия, а не к данным сайта.</em> Данные оператора, обрабатываемые в ходе взаимодействий, используются только для целей, указанных в соглашении. Они не перенаправляются для маркетинга, обучения универсальных ИИ-моделей или использования в других взаимодействиях. Данные оператора изолированы в хранилище, ограниченном рамками взаимодействия, с доступом только для названной команды.',
    '<em>Aplica a datos del compromiso, no a datos del sitio.</em> Los datos del operador procesados durante compromisos se usan solo para los fines nombrados en la carta de contratación. No se reutilizan para marketing, entrenamiento de modelos de IA de propósito general ni para otros compromisos. Los datos del operador permanecen aislados en almacenamiento con alcance del compromiso, con acceso limitado al equipo nombrado.');

add('Site data: form submissions are retained while the inquiry is open plus 36 months for pattern analysis, then aggregated or deleted. Analytics data follows the GA4 default 14-month window unless you opt out.',
    '<em>Данные сайта:</em> отправки форм хранятся пока запрос открыт плюс 36 месяцев для анализа паттернов, затем агрегируются или удаляются. Данные аналитики следуют окну GA4 по умолчанию 14 месяцев, если вы не откажетесь.',
    '<em>Datos del sitio:</em> los envíos de formularios se conservan mientras la consulta esté abierta más 36 meses para análisis de patrones, luego se agregan o eliminan. Los datos de analítica siguen la ventana predeterminada de GA4 de 14 meses a menos que usted renuncie.');

add('Operator data: default retention is engagement duration plus 90 days unless the operator requests extended retention in writing. Certificates of destruction are issued at close and list what was destroyed and the method used. Operator-environment engagements require no destruction action on our side — access is revoked at close. Full retention matrix on the Security & Compliance page.',
    '<em>Данные оператора:</em> стандартное хранение — продолжительность взаимодействия плюс 90 дней, если оператор не запросит продлённое хранение письменно. Сертификаты уничтожения выдаются при закрытии и перечисляют, что уничтожено и каким методом. Взаимодействия в среде оператора не требуют действий по уничтожению с нашей стороны — доступ отзывается при закрытии. Полная матрица хранения на странице <a href="security-and-compliance.html">Безопасность и соответствие</a>.',
    '<em>Datos del operador:</em> la retención predeterminada es la duración del compromiso más 90 días salvo que el operador solicite retención extendida por escrito. Los certificados de destrucción se emiten al cierre y enumeran qué se destruyó y el método. Los compromisos en entorno del operador no requieren acción de destrucción de nuestro lado — el acceso se revoca al cierre. Matriz completa de retención en la página <a href="security-and-compliance.html">Seguridad y cumplimiento</a>.');

add('If VitaCoreX becomes aware of a personal-data or operator-data breach, the affected operator (for engagement data) or the affected individual (for site data, where individual notice is appropriate) is notified without undue delay and in no case later than 72 hours of becoming aware. Notification includes scope of data affected, systems affected, initial containment actions, and a named point of contact for the remediation thread. See the incident-response posture on the Security & Compliance page and the DPA clause on the Sub-processors & DPA page.',
    'Если VitaCoreX узнаёт о нарушении личных данных или данных оператора, затронутый оператор (по данным взаимодействия) или затронутое лицо (по данным сайта, если индивидуальное уведомление уместно) уведомляется без необоснованной задержки и ни в коем случае не позднее чем через <strong>72 часа</strong> после того, как стало известно. Уведомление включает объём затронутых данных, затронутые системы, первоначальные меры локализации и названную точку контакта для цепочки устранения. См. позицию по реагированию на инциденты на странице <a href="security-and-compliance.html">Безопасность и соответствие</a> и положение DPA на странице <a href="sub-processors-and-dpa.html">Субпроцессоры и DPA</a>.',
    'Si VitaCoreX tiene conocimiento de una violación de datos personales o datos del operador, el operador afectado (para datos del compromiso) o la persona afectada (para datos del sitio, donde sea apropiado el aviso individual) es notificado sin demora indebida y en ningún caso más tarde de <strong>72 horas</strong> de tener conocimiento. La notificación incluye el alcance de los datos afectados, los sistemas afectados, las acciones iniciales de contención y un punto de contacto nombrado para el hilo de remediación. Consulte la postura de respuesta a incidentes en la página <a href="security-and-compliance.html">Seguridad y cumplimiento</a> y la cláusula del DPA en la página <a href="sub-processors-and-dpa.html">Subprocesadores y DPA</a>.');

add('Individuals whose data is held on site forms or in engagement records may request, within limits imposed by legal hold or ongoing litigation:',
    'Лица, чьи данные хранятся в формах сайта или записях взаимодействия, могут запросить, в пределах, установленных юридическим удержанием или текущими разбирательствами:',
    'Las personas cuyos datos se conservan en formularios del sitio o en registros de compromiso pueden solicitar, dentro de los límites impuestos por retenciones legales o litigios en curso:');

add('Confirmation of what data is held and the purpose of processing.',
    'Подтверждение того, какие данные хранятся, и цели обработки.',
    'Confirmación de qué datos se conservan y el propósito del procesamiento.');

add('A portable copy of data you submitted (CSV/PDF/JSON where practical).',
    'Портативную копию отправленных данных (CSV/PDF/JSON где практично).',
    'Una copia portable de los datos que envió (CSV/PDF/JSON donde sea práctico).');

add('Correction of inaccurate data.',
    'Исправление неточных данных.',
    'Corrección de datos inexactos.');

add('Deletion of data, subject to retention obligations under applicable law and active engagement letters.',
    'Удаление данных при соблюдении обязательств по хранению в соответствии с применимым правом и действующими соглашениями.',
    'Eliminación de datos, sujeta a obligaciones de retención bajo la ley aplicable y cartas de contratación activas.');

add('Withdrawal of consent for optional analytics at any time via the cookie-consent banner.',
    'Отзыв согласия на опциональную аналитику в любое время через баннер согласия cookie.',
    'Retiro del consentimiento para la analítica opcional en cualquier momento a través del banner de consentimiento de cookies.');

add('Submit requests to (888) 794-8292 or through the contact form with subject line "privacy request." Standard response time is 10 business days; verification of requester identity may be required for non-trivial requests. For engagement data, requests run through the operator (data controller) rather than VitaCoreX directly.',
    'Направляйте запросы по телефону <a href="tel:+18887948292">(888) 794-8292</a> или через <a href="contact.html">контактную форму</a> с темой «privacy request». Стандартное время ответа — 10 рабочих дней; может потребоваться проверка личности заявителя для нетривиальных запросов. По данным взаимодействия запросы проходят через оператора (контролёра данных), а не напрямую через VitaCoreX.',
    'Envíe solicitudes al <a href="tel:+18887948292">(888) 794-8292</a> o a través del <a href="contact.html">formulario de contacto</a> con el asunto "privacy request". El tiempo de respuesta estándar es 10 días hábiles; puede requerirse verificación de identidad del solicitante para peticiones no triviales. Para datos del compromiso, las solicitudes corren a través del operador (controlador de datos) en lugar de VitaCoreX directamente.');

add('All site data and all operator data are stored and processed on US-based infrastructure with US-based cloud vendors. No client or site data is stored in, processed in, or transits through jurisdictions outside the United States in ordinary operation. If a future engagement requires a different posture, it is documented in the engagement letter with the controlling transfer mechanism named in writing.',
    'Все данные сайта и все данные оператора хранятся и обрабатываются на <strong>инфраструктуре на территории США у поставщиков облака в США</strong>. В обычной работе никакие данные клиентов или сайта не хранятся, не обрабатываются и не транзитируют через юрисдикции за пределами США. Если будущее взаимодействие требует иной позиции, это документируется в соглашении с указанным в письменной форме механизмом передачи.',
    'Todos los datos del sitio y todos los datos del operador se almacenan y procesan en <strong>infraestructura con sede en EE.UU. con proveedores de nube de EE.UU.</strong>. En operación ordinaria, ningún dato de cliente o sitio se almacena, procesa ni transita por jurisdicciones fuera de Estados Unidos. Si un compromiso futuro requiere una postura distinta, se documenta en la carta de contratación con el mecanismo de transferencia controlador nombrado por escrito.');

add('Site-data handling is governed by the laws of the State of Florida, United States, without regard to conflict-of-laws principles. Engagement-data handling is governed by the engagement letter and its DPA where applicable.',
    'Обработка данных сайта регулируется законами штата Флорида, США, без учёта принципов коллизии законов. Обработка данных взаимодействия регулируется соглашением и его DPA, где применимо.',
    'El manejo de datos del sitio se rige por las leyes del Estado de Florida, EE.UU., sin considerar los principios de conflicto de leyes. El manejo de datos del compromiso se rige por la carta de contratación y su DPA donde aplique.');

add('Material changes are announced on this page with a new "Last updated" date at the top. For engagements under a signed DPA, changes to data handling that materially affect operator data are communicated directly to the named operator contact with a 30-day notice window unless the change is security-driven, in which case the emergency 5-day notice applies.',
    'Существенные изменения объявляются на этой странице с новой датой «Последнее обновление» в верхней части. Для взаимодействий по подписанному DPA изменения в обработке данных, существенно затрагивающие данные оператора, сообщаются напрямую названному контакту оператора с окном уведомления в 30 дней, если только изменение не вызвано соображениями безопасности, в этом случае применяется экстренное уведомление за 5 дней.',
    'Los cambios materiales se anuncian en esta página con una nueva fecha "Última actualización" en la parte superior. Para compromisos bajo un DPA firmado, los cambios en el manejo de datos que afecten materialmente los datos del operador se comunican directamente al contacto nombrado del operador con una ventana de aviso de 30 días, a menos que el cambio sea impulsado por seguridad, en cuyo caso aplica el aviso de emergencia de 5 días.');

add('Privacy-related questions: contact form (subject line "privacy") or call/text (888) 794-8292. Procurement contacts can also reach the designated procurement point of contact named in the engagement letter.',
    'Вопросы по конфиденциальности: <a href="contact.html">контактная форма</a> (тема «privacy») или звонок/SMS <a href="tel:+18887948292">(888) 794-8292</a>. Контакты закупок также могут связаться с назначенной точкой контакта закупок, указанной в соглашении.',
    'Preguntas relacionadas con privacidad: <a href="contact.html">formulario de contacto</a> (asunto "privacy") o llamada/texto <a href="tel:+18887948292">(888) 794-8292</a>. Los contactos de procurement también pueden llegar al punto de contacto designado nombrado en la carta de contratación.');

// ─── TERMS OF USE — body strings ──────────────────────────
add('These terms govern use of the public site. Engagement terms (fees, scope, IP, confidentiality, liability) are set in a signed engagement letter and, where applicable, a DPA — both of which supersede this page for contracted work. See Pricing & Engagement Tiers for the published fee structure.',
    'Эти условия регулируют использование публичного сайта. Условия взаимодействия (гонорары, объём, ИС, конфиденциальность, ответственность) устанавливаются в подписанном соглашении и, где применимо, DPA — которые имеют приоритет над этой страницей для контрактной работы. См. <a href="pricing-and-engagement-tiers.html">Цены и уровни взаимодействия</a> для опубликованной структуры гонораров.',
    'Estos términos rigen el uso del sitio público. Los términos del compromiso (honorarios, alcance, IP, confidencialidad, responsabilidad) se establecen en una carta de contratación firmada y, donde aplique, un DPA — los cuales prevalecen sobre esta página para el trabajo contratado. Consulte <a href="pricing-and-engagement-tiers.html">Precios y niveles de contratación</a> para la estructura publicada de honorarios.');

add('The public site is provided for informational and business-development purposes. It does not create an attorney-client relationship, agency relationship, fiduciary relationship, or any binding engagement on its own.',
    'Публичный сайт предоставляется в информационных целях и для развития бизнеса. Сам по себе он не создаёт адвокатско-клиентских, агентских, фидуциарных или иных связующих отношений.',
    'El sitio público se proporciona con fines informativos y de desarrollo comercial. Por sí solo no crea relación abogado-cliente, de agencia, fiduciaria ni ningún compromiso vinculante.');

add('VitaCoreX LLC is not a law firm and does not provide legal advice or legal representation. Legal strategy and legal advice remain the responsibility of licensed counsel. Content on this site describing legal-adjacent workflows (lien calendars, FDCPA boundaries, HIPAA boundaries, file-readiness) is administrative and procedural, not a substitute for advice of counsel.',
    'VitaCoreX LLC не является юридической фирмой и не предоставляет юридических консультаций или представительства. Юридическая стратегия и консультации остаются обязанностью лицензированных юристов. Содержание сайта, описывающее смежные с юриспруденцией процессы (календари залогов, границы FDCPA, границы HIPAA, готовность файлов), является административным и процедурным, а не заменой консультации юриста.',
    'VitaCoreX LLC no es un bufete de abogados y no brinda asesoría legal ni representación legal. La estrategia y la asesoría legal siguen siendo responsabilidad de abogados licenciados. El contenido de este sitio que describe flujos adyacentes al derecho (calendarios de gravámenes, límites FDCPA, límites HIPAA, preparación de expedientes) es administrativo y procesal, no un sustituto del consejo de un abogado.');

add("The site does not position VitaCoreX as a licensed collection agency. Recovery-related work is framed as workflow infrastructure, documentation control, and operator support before or around escalation decisions. Where licensed collections activity is required, the operator retains a licensed agency or counsel directly; VitaCoreX's role is to make the handoff file-ready.",
    'Сайт не позиционирует VitaCoreX как лицензированное коллекторское агентство. Работа по возврату оформляется как инфраструктура процесса, контроль документации и поддержка оператора до или вокруг решений об эскалации. Там, где требуется лицензированная коллекторская деятельность, оператор нанимает лицензированное агентство или юриста напрямую; роль VitaCoreX — сделать передачу готовой по файлам.',
    'El sitio no posiciona a VitaCoreX como agencia de cobro licenciada. El trabajo relacionado con recuperación se enmarca como infraestructura de flujo, control documental y apoyo al operador antes o alrededor de las decisiones de escalación. Donde se requiera actividad de cobro con licencia, el operador contrata a una agencia o abogado licenciado directamente; el rol de VitaCoreX es preparar el traspaso a nivel de expediente.');

add('Any economics illustrations, examples, case studies, pilot frames, or benchmarks (including the published 2.2–4.4× pilot-ROI band on the Pricing & Engagement Tiers page) are informational. They are not guarantees of rankings, collections outcomes, ROI, DSO reduction, or any fixed business result. Actual results depend on portfolio composition, documentation quality, and operator cooperation.',
    'Любые экономические иллюстрации, примеры, кейсы, рамки пилотов или бенчмарки (включая опубликованный диапазон ROI пилота 2.2–4.4× на странице <a href="pricing-and-engagement-tiers.html">Цены и уровни взаимодействия</a>) являются информационными. Они не гарантируют рейтинги, результаты коллекторской работы, ROI, снижение DSO или иной фиксированный бизнес-результат. Фактические результаты зависят от состава портфеля, качества документации и сотрудничества оператора.',
    'Cualquier ilustración económica, ejemplo, caso de estudio, marco piloto o benchmark (incluida la banda publicada de ROI de piloto 2.2–4.4× en la página <a href="pricing-and-engagement-tiers.html">Precios y niveles de contratación</a>) es informacional. No son garantías de rankings, resultados de cobranza, ROI, reducción de DSO ni ningún resultado comercial fijo. Los resultados reales dependen de la composición del portafolio, la calidad documental y la cooperación del operador.');

add('Any working engagement requires a separate written engagement letter that defines scope, fees, timelines, deliverables, payment terms, termination rights, confidentiality, IP assignment, and liability. Where a provision of the engagement letter conflicts with a provision of these site terms, the engagement letter controls for the engaged scope. The fee structure reference is published at Pricing & Engagement Tiers; the procurement-facing documentation posture at Security & Compliance and Sub-processors & DPA.',
    'Любое рабочее взаимодействие требует отдельного письменного соглашения, определяющего объём, гонорары, сроки, результаты, условия оплаты, права на прекращение, конфиденциальность, передачу ИС и ответственность. Там, где положение соглашения противоречит положению этих условий сайта, соглашение имеет приоритет для согласованного объёма. Справка по структуре гонораров опубликована на <a href="pricing-and-engagement-tiers.html">Цены и уровни взаимодействия</a>; документационная позиция для закупок — на <a href="security-and-compliance.html">Безопасность и соответствие</a> и <a href="sub-processors-and-dpa.html">Субпроцессоры и DPA</a>.',
    'Cualquier compromiso de trabajo requiere una carta de contratación escrita por separado que defina alcance, honorarios, cronogramas, entregables, términos de pago, derechos de terminación, confidencialidad, asignación de IP y responsabilidad. Donde una disposición de la carta de contratación entre en conflicto con una disposición de estos términos del sitio, la carta de contratación prevalece para el alcance contratado. La referencia de la estructura de honorarios se publica en <a href="pricing-and-engagement-tiers.html">Precios y niveles de contratación</a>; la postura documental para procurement en <a href="security-and-compliance.html">Seguridad y cumplimiento</a> y <a href="sub-processors-and-dpa.html">Subprocesadores y DPA</a>.');

add('Provide accurate contact information.',
    'Предоставлять точную контактную информацию.',
    'Proporcionar información de contacto precisa.');

add('Do not submit unlawful content, malware, or content you are not authorized to share.',
    'Не отправлять незаконный контент, вредоносное ПО или контент, который вы не имеете права распространять.',
    'No enviar contenido ilegal, malware ni contenido que no esté autorizado a compartir.');

add('Do not submit regulated data (PHI, GLBA NPI, payment-card data, export-controlled records) through the public forms; use the structured intake path followed by an engagement letter and, where applicable, a Business Associate Agreement.',
    'Не отправлять регулируемые данные (PHI, GLBA NPI, данные платёжных карт, записи под экспортным контролем) через публичные формы; использовать путь структурированного приёма с последующим соглашением и, где применимо, BAA.',
    'No enviar datos regulados (PHI, GLBA NPI, datos de tarjetas de pago, registros bajo control de exportación) a través de los formularios públicos; use la ruta de admisión estructurada seguida de una carta de contratación y, donde aplique, un BAA.');

add('Do not use the public forms as a substitute for a secure workflow where one is required.',
    'Не использовать публичные формы вместо безопасного процесса там, где он требуется.',
    'No usar los formularios públicos como sustituto de un flujo seguro donde sea requerido.');

add('Respect the intellectual-property notice below: the site content is licensed for review, not republication.',
    'Уважать уведомление об интеллектуальной собственности ниже: содержание сайта лицензировано для обзора, а не для повторной публикации.',
    'Respetar el aviso de propiedad intelectual abajo: el contenido del sitio está licenciado para revisión, no para republicación.');

add('All content on vitacorexllc.com — text, graphics, logos, diagrams, sample deliverables, and JSON-LD metadata — is owned by VitaCoreX LLC or used under license. Visitors receive a limited, non-exclusive, non-transferable license to view and print pages for internal procurement review and for vendor-evaluation purposes. Republication, resale, training of third-party machine-learning models on site content in bulk, or competitive-product derivation without written permission is not authorized. Quoting short excerpts for procurement documentation with attribution is permitted.',
    'Всё содержимое vitacorexllc.com — тексты, графика, логотипы, диаграммы, образцы результатов и метаданные JSON-LD — принадлежит VitaCoreX LLC или используется по лицензии. Посетители получают ограниченную, неисключительную, непередаваемую лицензию на просмотр и печать страниц для внутреннего обзора закупок и оценки поставщиков. Повторная публикация, перепродажа, массовое обучение сторонних моделей машинного обучения на содержимом сайта или создание конкурентных продуктов без письменного разрешения не допускается. Цитирование коротких выдержек для документации закупок с указанием источника разрешается.',
    'Todo el contenido de vitacorexllc.com — texto, gráficos, logotipos, diagramas, entregables de muestra y metadatos JSON-LD — es propiedad de VitaCoreX LLC o se usa bajo licencia. Los visitantes reciben una licencia limitada, no exclusiva y no transferible para ver e imprimir páginas para revisión interna de procurement y fines de evaluación de proveedores. La republicación, reventa, entrenamiento masivo de modelos de aprendizaje automático de terceros con contenido del sitio, o derivación de productos competidores sin permiso escrito no está autorizado. Se permite citar extractos cortos para documentación de procurement con atribución.');

add('Under a signed engagement letter, the default posture is:',
    'По подписанному соглашению позиция по умолчанию следующая:',
    'Bajo una carta de contratación firmada, la postura predeterminada es:');

add('Operator data — the operator retains full ownership. VitaCoreX processes it under the DPA summarized on the Sub-processors & DPA page.',
    '<strong>Данные оператора</strong> — оператор сохраняет полное владение. VitaCoreX обрабатывает их по DPA, изложенному на странице <a href="sub-processors-and-dpa.html">Субпроцессоры и DPA</a>.',
    '<strong>Datos del operador</strong> — el operador conserva la propiedad total. VitaCoreX los procesa bajo el DPA resumido en la página <a href="sub-processors-and-dpa.html">Subprocesadores y DPA</a>.');

add('Engagement deliverables — playbooks, templates, runbooks, dashboards, and process artifacts built during the engagement are delivered to the operator with a perpetual, transferable, internal-use license. Operator retains full ownership of its data inputs; VitaCoreX retains ownership of underlying methodology and generic templates that predate the engagement.',
    '<strong>Результаты взаимодействия</strong> — плейбуки, шаблоны, ранбуки, дашборды и артефакты процесса, созданные в ходе взаимодействия, передаются оператору с бессрочной, передаваемой лицензией для внутреннего использования. Оператор сохраняет полное владение вводными данными; VitaCoreX сохраняет владение базовой методологией и общими шаблонами, существовавшими до взаимодействия.',
    '<strong>Entregables del compromiso</strong> — playbooks, plantillas, runbooks, dashboards y artefactos de proceso construidos durante el compromiso se entregan al operador con una licencia perpetua, transferible y de uso interno. El operador conserva la propiedad total de sus datos de entrada; VitaCoreX conserva la propiedad de la metodología subyacente y las plantillas genéricas anteriores al compromiso.');

add('Exit deliverables — complete export (CSV, PDF, DOCX where appropriate) at close, with no data-hostage fees. See Pricing & Engagement Tiers for the termination clauses.',
    '<strong>Выходные результаты</strong> — полный экспорт (CSV, PDF, DOCX где уместно) при закрытии, без плат за удержание данных. См. <a href="pricing-and-engagement-tiers.html">Цены и уровни взаимодействия</a> для условий прекращения.',
    '<strong>Entregables de salida</strong> — exportación completa (CSV, PDF, DOCX donde corresponda) al cierre, sin tarifas de retención de datos. Consulte <a href="pricing-and-engagement-tiers.html">Precios y niveles de contratación</a> para las cláusulas de terminación.');

add("A mutual non-disclosure agreement is signed before any discussion that touches specific portfolio composition, sub-processor details, diagnostic methodology beyond what is already published, or reference contacts. Either party's NDA template is acceptable — VitaCoreX does not require its own. Information exchanged before an NDA is in place is limited to what is already public on this site.",
    'Взаимное соглашение о неразглашении подписывается до любого обсуждения, касающегося конкретного состава портфеля, сведений о субпроцессорах, диагностической методологии сверх уже опубликованной или референсных контактов. Шаблон NDA любой из сторон приемлем — VitaCoreX не требует собственного. Информация, обмениваемая до подписания NDA, ограничена тем, что уже публично на этом сайте.',
    'Se firma un acuerdo de confidencialidad mutuo antes de cualquier discusión que toque composición específica del portafolio, detalles de subprocesadores, metodología diagnóstica más allá de lo ya publicado, o contactos de referencia. La plantilla NDA de cualquiera de las partes es aceptable — VitaCoreX no requiere la suya propia. La información intercambiada antes de firmar NDA se limita a lo ya público en este sitio.');

add('The public site is provided "as is" and "as available" without warranty of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, non-infringement, or accuracy of information. Engagement deliverables under a signed engagement letter carry the warranties stated in that engagement letter, not this clause.',
    'Публичный сайт предоставляется «как есть» и «как доступен» без гарантий любого рода, явных или подразумеваемых, включая гарантии товарной пригодности, пригодности для определённой цели, ненарушения или точности информации. Результаты взаимодействия по подписанному соглашению несут гарантии, указанные в этом соглашении, а не в данном положении.',
    'El sitio público se proporciona "tal cual" y "según disponibilidad" sin garantía de ningún tipo, expresa o implícita, incluidas garantías de comerciabilidad, idoneidad para un propósito particular, no infracción o exactitud de la información. Los entregables bajo una carta de contratación firmada llevan las garantías establecidas en esa carta, no esta cláusula.');

add("To the maximum extent permitted by applicable law, VitaCoreX LLC's aggregate liability arising from use of the public site is limited to $100. This clause does not apply to engagement liability, which is governed by the engagement letter. Nothing in these terms limits liability for fraud, gross negligence, or any liability that cannot be limited under applicable law.",
    'В максимальной степени, разрешённой применимым правом, совокупная ответственность VitaCoreX LLC, возникающая из использования публичного сайта, ограничена $100. Это положение не применяется к ответственности по взаимодействию, которая регулируется соглашением. Ничто в этих условиях не ограничивает ответственность за мошенничество, грубую небрежность или любую ответственность, которую нельзя ограничить по применимому праву.',
    'Hasta el máximo permitido por la ley aplicable, la responsabilidad agregada de VitaCoreX LLC derivada del uso del sitio público se limita a $100. Esta cláusula no aplica a la responsabilidad del compromiso, que se rige por la carta de contratación. Nada en estos términos limita la responsabilidad por fraude, negligencia grave o cualquier responsabilidad que no pueda limitarse bajo la ley aplicable.');

add('You agree to indemnify and hold VitaCoreX LLC harmless from claims arising out of your submission of unlawful content, your misuse of the public site, or your violation of third-party rights through your use of the site. Reciprocal indemnification for engagement scope is addressed in the engagement letter.',
    'Вы соглашаетесь возмещать и освобождать VitaCoreX LLC от претензий, возникающих из вашей подачи незаконного контента, вашего неправомерного использования публичного сайта или вашего нарушения прав третьих лиц через ваше использование сайта. Взаимное возмещение по объёму взаимодействия рассматривается в соглашении.',
    'Usted acepta indemnizar y mantener a VitaCoreX LLC indemne de reclamos derivados de su envío de contenido ilegal, uso indebido del sitio público o violación de derechos de terceros a través de su uso del sitio. La indemnización recíproca por el alcance del compromiso se aborda en la carta de contratación.');

add('If any provision of these terms is held invalid or unenforceable, the remaining provisions continue in full force, and the invalid provision is modified to the minimum extent necessary to make it enforceable while preserving intent.',
    'Если какое-либо положение этих условий признано недействительным или не подлежащим исполнению, остальные положения остаются в полной силе, а недействительное положение изменяется в минимальной необходимой степени для его исполнимости с сохранением намерения.',
    'Si alguna disposición de estos términos se declara inválida o inaplicable, las demás disposiciones permanecen en plena vigencia, y la disposición inválida se modifica en la mínima medida necesaria para hacerla aplicable preservando la intención.');

add('Material changes are announced on this page with a new "Last updated" date at the top. Continued use of the site after an update constitutes acceptance of the updated terms. Engagement letters in effect are not affected by changes to this page.',
    'Существенные изменения объявляются на этой странице с новой датой «Последнее обновление» в верхней части. Продолжение использования сайта после обновления означает принятие обновлённых условий. Действующие соглашения не затрагиваются изменениями на этой странице.',
    'Los cambios materiales se anuncian en esta página con una nueva fecha "Última actualización" en la parte superior. El uso continuo del sitio después de una actualización constituye aceptación de los términos actualizados. Las cartas de contratación vigentes no se ven afectadas por cambios en esta página.');

add('Questions about these terms: contact form or call/text (888) 794-8292. Procurement points of contact for engagement-specific terms are named in the engagement letter.',
    'Вопросы по этим условиям: <a href="contact.html">контактная форма</a> или звонок/SMS <a href="tel:+18887948292">(888) 794-8292</a>. Точки контакта закупок по условиям конкретного взаимодействия указаны в соглашении.',
    'Preguntas sobre estos términos: <a href="contact.html">formulario de contacto</a> o llamada/texto <a href="tel:+18887948292">(888) 794-8292</a>. Los puntos de contacto de procurement para términos específicos del compromiso se nombran en la carta de contratación.');

// ─── FAQ PAGE — body strings ──────────────────────────
add('Frequently Asked Questions',
    'Часто задаваемые вопросы',
    'Preguntas frecuentes');

add('Everything you need to know about VitaCoreX LLC services. Tampa, FL. Available in English, Russian, and Spanish.',
    'Всё, что нужно знать об услугах VitaCoreX LLC. Тампа, Флорида. Доступно на английском, русском и испанском.',
    'Todo lo que necesita saber sobre los servicios de VitaCoreX LLC. Tampa, FL. Disponible en inglés, ruso y español.');

add('Revenue Recovery & Pre-Collection',
    'Возврат выручки и досудебный возврат',
    'Recuperación de ingresos y pre-cobranza');

add('What is pre-collection and how does it differ from traditional debt collection?',
    'Что такое досудебный возврат и чем он отличается от традиционной коллекторской работы?',
    '¿Qué es la pre-cobranza y en qué se diferencia del cobro de deudas tradicional?');

add("Pre-collection is a revenue recovery approach that contacts debtors before accounts are sent to traditional collection agencies. VitaCoreX's pre-collection workflows use professional, relationship-preserving communication to recover outstanding balances. Unlike traditional collection agencies, pre-collection has no negative impact on customer relationships, typically achieves higher net recovery rates (35-55 cents per dollar vs. 10-14 cents), and costs significantly less in fees.",
    'Досудебный возврат — это подход к возврату выручки, при котором с должниками связываются до передачи счетов в традиционные коллекторские агентства. Процессы досудебного возврата VitaCoreX используют профессиональную коммуникацию, сохраняющую отношения. В отличие от традиционных агентств, досудебный возврат не наносит ущерба отношениям с клиентом, обычно достигает более высоких чистых показателей возврата (35–55 центов на доллар против 10–14 центов) и стоит значительно меньше.',
    'La pre-cobranza es un enfoque de recuperación de ingresos que contacta a los deudores antes de que las cuentas se envíen a agencias de cobro tradicionales. Los flujos de pre-cobranza de VitaCoreX usan comunicación profesional que preserva la relación para recuperar saldos pendientes. A diferencia de las agencias tradicionales, la pre-cobranza no tiene impacto negativo en las relaciones con el cliente, típicamente logra tasas de recuperación neta más altas (35–55 centavos por dólar vs 10–14 centavos) y cuesta significativamente menos.');

add('How does VitaCoreX improve net recovery rates?',
    'Как VitaCoreX улучшает чистые показатели возврата?',
    '¿Cómo mejora VitaCoreX las tasas de recuperación neta?');

add('VitaCoreX improves net recovery rates through structured pre-collection workflows that include systematic debtor communication, evidence-based documentation, compliance monitoring, and customized recovery strategies for each industry. Our approach reduces Days Sales Outstanding (DSO), minimizes bad debt write-offs, and preserves customer relationships while maximizing cash recovery.',
    'VitaCoreX улучшает чистые показатели возврата через структурированные процессы досудебного возврата, включающие систематическую коммуникацию с должниками, документацию на основе доказательств, мониторинг комплаенса и индивидуальные стратегии возврата для каждой отрасли. Наш подход уменьшает DSO, минимизирует списания безнадёжных долгов и сохраняет отношения с клиентами, максимизируя возврат денежных средств.',
    'VitaCoreX mejora las tasas de recuperación neta mediante flujos estructurados de pre-cobranza que incluyen comunicación sistemática con deudores, documentación basada en evidencia, monitoreo de cumplimiento y estrategias de recuperación personalizadas por industria. Nuestro enfoque reduce los DSO, minimiza las bajas por deuda incobrable y preserva las relaciones con clientes mientras maximiza la recuperación de efectivo.');

add('What is DSO and why does it matter?',
    'Что такое DSO и почему это важно?',
    '¿Qué es DSO y por qué importa?');

add('DSO (Days Sales Outstanding) measures the average number of days it takes to collect payment after a sale. A high DSO means money is tied up in unpaid invoices, hurting cash flow. VitaCoreX helps businesses reduce DSO through pre-collection workflows, systematic follow-up, and optimized billing processes. Lower DSO means faster cash flow and healthier financials.',
    'DSO (Days Sales Outstanding) измеряет среднее количество дней на получение оплаты после продажи. Высокое DSO означает, что деньги застревают в неоплаченных счетах, ухудшая денежный поток. VitaCoreX помогает бизнесу снижать DSO через процессы досудебного возврата, систематический follow-up и оптимизированные процессы выставления счетов. Более низкое DSO означает более быстрый денежный поток и более здоровые финансы.',
    'DSO (Days Sales Outstanding) mide el número promedio de días para cobrar un pago después de una venta. Un DSO alto significa que el dinero está atado en facturas impagas, perjudicando el flujo de caja. VitaCoreX ayuda a las empresas a reducir el DSO mediante flujos de pre-cobranza, seguimiento sistemático y procesos de facturación optimizados. Un DSO más bajo significa flujo de caja más rápido y finanzas más saludables.');

add('Is VitaCoreX a collection agency?',
    'Является ли VitaCoreX коллекторским агентством?',
    '¿Es VitaCoreX una agencia de cobros?');

add('No. VitaCoreX is not a collection agency. We provide pre-collection recovery infrastructure that works before accounts reach the collection stage. Our approach is FDCPA-compliant and focuses on preserving business relationships while recovering outstanding revenue. We are a collection agency alternative.',
    'Нет. VitaCoreX не является коллекторским агентством. Мы предоставляем инфраструктуру досудебного возврата, которая работает до того, как счета доходят до стадии коллекторской работы. Наш подход соответствует FDCPA и сосредоточен на сохранении деловых отношений при возврате невыплаченной выручки. Мы — альтернатива коллекторскому агентству.',
    'No. VitaCoreX no es una agencia de cobros. Proporcionamos infraestructura de recuperación pre-cobranza que funciona antes de que las cuentas lleguen a la etapa de cobranza. Nuestro enfoque cumple con FDCPA y se centra en preservar relaciones comerciales mientras recuperamos ingresos pendientes. Somos una alternativa a las agencias de cobros.');

add('Pricing, Engagement & ROI',
    'Цены, взаимодействие и ROI',
    'Precios, contratación y ROI');

add('How much does VitaCoreX cost?',
    'Сколько стоит VitaCoreX?',
    '¿Cuánto cuesta VitaCoreX?');

add('VitaCoreX offers three transparent engagement tiers. (1) Revenue Recovery Diagnostic: a fixed $1,500 fee for a two-week scoped assessment — best for companies that want a limited review before committing to an implementation or pilot. Fee is credited against a subsequent Paid Workflow Pilot if engaged within 30 days. (2) Paid Workflow Pilot: from $2,500/month — best for companies that need workflow buildout, documentation controls, dashboards, SOPs, and file readiness but do not qualify for the no-retainer recovery pilot. Fee is committed regardless of outcome; performance-linked component available on request. (3) Qualified Net Recovery Pilot: $0 upfront for approved portfolios, compensation is a consulting success fee only on eligible recovered cash (15 / 18 / 22.5% by AR age band) — best for U.S. companies with qualifying AR portfolios. Explicitly excludes: legal advice, licensed collection activity, consumer-facing third-party collection, court representation, and payment custody. All three tiers have published prices. VitaCoreX is not a law firm and is not a debt collector.',
    'VitaCoreX предлагает три прозрачные ступени. (1) <strong>Revenue Recovery Diagnostic</strong>: фиксированный гонорар $1,500 за двухнедельный scoped-разбор — подходит компаниям, которым нужен ограниченный обзор до принятия обязательств. Сумма зачитывается в последующий Paid Workflow Pilot, если договор заключён в течение 30 дней. (2) <strong>Paid Workflow Pilot</strong>: от $2,500/мес — подходит компаниям, которым нужен buildout workflow, документационные контроли, дашборды, SOP и file readiness, но которые не проходят на no-retainer recovery pilot. Оплата фиксируется независимо от результата; performance-linked компонент доступен по запросу. (3) <strong>Qualified Net Recovery Pilot</strong>: $0 upfront для одобренных портфелей, компенсация — consulting success fee только с eligible возвращённых денег (15 / 18 / 22,5% по возрастным группам AR) — подходит U.S.-компаниям с квалифицирующимися AR-портфелями. Явно исключено: юридические советы, лицензированная collection-активность, consumer-facing third-party collection, представительство в суде, payment custody. У всех трёх ступеней цены опубликованы. VitaCoreX — не юридическая фирма и не сборщик долгов.',
    'VitaCoreX ofrece tres niveles de contratación transparentes. (1) <strong>Revenue Recovery Diagnostic</strong>: una tarifa fija de $1,500 por una evaluación scoped de dos semanas — ideal para empresas que quieren una revisión limitada antes de comprometerse con una implementación o piloto. La tarifa se acredita al Paid Workflow Pilot posterior si se contrata dentro de 30 días. (2) <strong>Paid Workflow Pilot</strong>: desde $2,500/mes — ideal para empresas que necesitan buildout de workflow, controles documentales, dashboards, SOPs y file readiness pero no califican para el no-retainer recovery pilot. El pago se compromete independientemente del resultado; componente performance-linked disponible a solicitud. (3) <strong>Qualified Net Recovery Pilot</strong>: $0 upfront para portafolios aprobados, la compensación es una consulting success fee solo sobre efectivo recuperado elegible (15 / 18 / 22,5% por tramo de edad de AR) — ideal para empresas de EE. UU. con portafolios AR que califican. Excluye explícitamente: asesoramiento legal, actividad de cobranza licenciada, cobranza consumer-facing de terceros, representación en tribunal y custodia de pagos. Los tres niveles tienen precios publicados. VitaCoreX no es un bufete ni un cobrador de deudas.');

add('How fast do we see results?',
    'Как быстро мы увидим результаты?',
    '¿Qué tan rápido vemos resultados?');

add('Most clients see first cash movement within 30 days of workflow activation. The 10-day Diagnostic produces a dollarized map of recovery opportunities immediately. During a 90-day Pilot, typical milestones are: weeks 1–2 onboarding and data integration, weeks 3–6 first batch recovery (30–50% of quick-win balances), weeks 7–12 structured recovery of aged accounts and DSO reduction. Fresh receivables (under 90 days) recover fastest; older accounts take longer but still achieve meaningful recovery versus agency write-off.',
    'Большинство клиентов видят первое движение денег в течение 30 дней с активации процесса. 10-дневная диагностика сразу же создаёт долларизированную карту возможностей возврата. В течение 90-дневного пилота типичные этапы: недели 1–2 онбординг и интеграция данных, недели 3–6 первый пакетный возврат (30–50% быстровыигрышных балансов), недели 7–12 структурированный возврат устаревших счетов и снижение DSO. Свежие дебиторские задолженности (младше 90 дней) возвращаются быстрее; более старые счета занимают дольше, но всё же обеспечивают значимый возврат по сравнению со списанием агентством.',
    'La mayoría de los clientes ven el primer movimiento de caja dentro de 30 días desde la activación del flujo. El Diagnóstico de 10 días produce un mapa dolarizado de oportunidades de recuperación de inmediato. Durante un Piloto de 90 días, los hitos típicos son: semanas 1–2 onboarding e integración de datos, semanas 3–6 primer lote de recuperación (30–50% de saldos de victoria rápida), semanas 7–12 recuperación estructurada de cuentas antiguas y reducción de DSO. Las cuentas por cobrar frescas (menos de 90 días) se recuperan más rápido; las cuentas más antiguas tardan más pero aún logran recuperación significativa frente al write-off de agencia.');

add('Do you guarantee recovery results?',
    'Гарантируете ли вы результаты возврата?',
    '¿Garantizan los resultados de recuperación?');

add('We guarantee the workflow, measurement rigor, and pilot deliverables — not a specific recovery percentage, because results depend on portfolio age, industry, documentation quality, and debtor solvency. What we do commit to: transparent weekly metrics (contact rate, promise-to-pay rate, cash recovered), a documented exit if the pilot underperforms our stated benchmarks, and no hidden fees. The Diagnostic phase sets realistic, industry-specific recovery targets before you commit to a pilot, so expectations are grounded in your actual AR data, not generic promises.',
    'Мы гарантируем процесс, строгость измерений и результаты пилота — не конкретный процент возврата, потому что результаты зависят от возраста портфеля, отрасли, качества документации и платёжеспособности должника. На что мы обязуемся: прозрачные еженедельные метрики (процент контактов, процент обещаний оплаты, возвращённые деньги), документированный выход, если пилот не соответствует заявленным бенчмаркам, и отсутствие скрытых плат. Фаза диагностики устанавливает реалистичные отраслевые цели возврата до того, как вы перейдёте к пилоту, поэтому ожидания основаны на ваших реальных данных AR, а не на общих обещаниях.',
    'Garantizamos el flujo, el rigor de medición y los entregables del piloto — no un porcentaje específico de recuperación, porque los resultados dependen de la edad del portafolio, la industria, la calidad documental y la solvencia del deudor. A lo que sí nos comprometemos: métricas semanales transparentes (tasa de contacto, tasa de promesa de pago, efectivo recuperado), una salida documentada si el piloto no cumple nuestros benchmarks, y sin tarifas ocultas. La fase Diagnóstica establece metas realistas específicas de la industria antes de comprometerse a un piloto, por lo que las expectativas se basan en sus datos reales de AR, no en promesas genéricas.');

add('How long is the contract and can I cancel?',
    'Насколько длителен контракт и могу ли я его отменить?',
    '¿Cuánto dura el contrato y puedo cancelar?');

add('The Diagnostic is a one-time fixed-fee engagement with no ongoing commitment. The 90-day Pilot is a fixed 3-month engagement designed to prove ROI before any long-term contract. After the pilot, Programme clients move to a month-to-month retainer with 30-day written notice. We do not use multi-year lock-in contracts. Your data, playbooks, and communication templates remain yours — there are no exit penalties or data-hostage fees.',
    'Диагностика — это разовое взаимодействие с фиксированным гонораром без текущих обязательств. 90-дневный пилот — это фиксированное 3-месячное взаимодействие, призванное доказать ROI до любого долгосрочного контракта. После пилота клиенты Программы переходят на ежемесячный ретейнер с письменным уведомлением за 30 дней. Мы не используем многолетние lock-in контракты. Ваши данные, плейбуки и шаблоны коммуникации остаются вашими — нет штрафов за выход или плат за удержание данных.',
    'El Diagnóstico es un compromiso único con honorario fijo sin compromiso continuo. El Piloto de 90 días es un compromiso fijo de 3 meses diseñado para probar el ROI antes de cualquier contrato de largo plazo. Después del piloto, los clientes de Programa pasan a un retainer mes a mes con aviso escrito de 30 días. No usamos contratos de lock-in plurianuales. Sus datos, playbooks y plantillas de comunicación permanecen suyos — no hay penalizaciones de salida ni tarifas de retención de datos.');

add('How does VitaCoreX compare to a traditional collection agency?',
    'Как VitaCoreX сравнивается с традиционным коллекторским агентством?',
    '¿Cómo se compara VitaCoreX con una agencia de cobros tradicional?');

add('Traditional agencies typically recover 10–14 cents per dollar on aged accounts, take 30–50% contingency, and damage the customer relationship — making that customer unlikely to return. VitaCoreX pre-collection workflows recover 35–55 cents per dollar on fresh AR, use transparent fixed fees, and preserve the customer relationship (preserving lifetime value that often exceeds the recovered balance). See our detailed side-by-side comparison at vitacorex-vs-traditional-agency.html.',
    'Традиционные агентства обычно возвращают 10–14 центов на доллар на устаревших счетах, берут 30–50% contingency и наносят ущерб отношениям с клиентом — делая возврат того клиента маловероятным. Процессы досудебного возврата VitaCoreX возвращают 35–55 центов на доллар на свежих AR, используют прозрачные фиксированные гонорары и сохраняют отношения с клиентом (сохраняя lifetime value, часто превышающую возвращённый баланс). См. наше подробное сравнение на <a href="vitacorex-vs-traditional-agency.html">vitacorex-vs-traditional-agency.html</a>.',
    'Las agencias tradicionales típicamente recuperan 10–14 centavos por dólar en cuentas antiguas, toman 30–50% de contingencia y dañan la relación con el cliente — haciendo improbable que ese cliente regrese. Los flujos de pre-cobranza de VitaCoreX recuperan 35–55 centavos por dólar en AR fresca, usan honorarios fijos transparentes y preservan la relación con el cliente (preservando lifetime value que a menudo excede el saldo recuperado). Consulte nuestra comparación detallada en <a href="vitacorex-vs-traditional-agency.html">vitacorex-vs-traditional-agency.html</a>.');

add('What is the onboarding process?',
    'Каков процесс онбординга?',
    '¿Cuál es el proceso de onboarding?');

add('Onboarding takes 5–10 business days. Week 1: discovery call, secure data intake (CSV, API, or read-only system access), workflow scoping, and compliance review. Week 2: playbook customization for your industry, templates approved by your team, and recovery calendar locked. We integrate with most PM and billing systems (Epic, Eaglesoft, Dentrix, OpenDental, QuickBooks, NetSuite, Stripe, custom systems). No replatforming required — we work around your existing stack.',
    'Онбординг занимает 5–10 рабочих дней. Неделя 1: discovery-звонок, безопасный приём данных (CSV, API или доступ к системе только для чтения), определение объёма процесса и обзор комплаенса. Неделя 2: настройка плейбука под вашу отрасль, шаблоны, утверждённые вашей командой, и заблокированный календарь возврата. Мы интегрируемся с большинством PM и биллинговых систем (Epic, Eaglesoft, Dentrix, OpenDental, QuickBooks, NetSuite, Stripe, кастомные системы). Replatforming не требуется — мы работаем вокруг вашего существующего стека.',
    'El onboarding toma 5–10 días hábiles. Semana 1: llamada de descubrimiento, admisión segura de datos (CSV, API o acceso solo-lectura al sistema), definición de alcance y revisión de cumplimiento. Semana 2: personalización del playbook para su industria, plantillas aprobadas por su equipo y calendario de recuperación bloqueado. Integramos con la mayoría de los sistemas de PM y facturación (Epic, Eaglesoft, Dentrix, OpenDental, QuickBooks, NetSuite, Stripe, sistemas personalizados). No se requiere replatforming — trabajamos alrededor de su stack existente.');

add("What's the minimum AR size to work with VitaCoreX?",
    'Каков минимальный размер AR для работы с VitaCoreX?',
    '¿Cuál es el tamaño mínimo de AR para trabajar con VitaCoreX?');

add('The Diagnostic ($2,500) is viable for any business with at least $100,000 in receivables older than 30 days. The 90-day Pilot makes clear economic sense when outstanding AR is $500,000+ or when monthly write-offs exceed $25,000. Below those thresholds, our ROI calculator at revenue-recovery-workflow.html helps determine fit. Multi-location operators (DSOs, hospital networks, gym chains, fleet operators) see the highest ROI because fixed workflow investment amortizes across locations.',
    'Диагностика ($2,500) жизнеспособна для любого бизнеса с минимум $100,000 в дебиторской задолженности старше 30 дней. 90-дневный пилот имеет чёткий экономический смысл, когда непогашенная AR составляет $500,000+ или ежемесячные списания превышают $25,000. Ниже этих порогов наш ROI-калькулятор на <a href="revenue-recovery-workflow.html#roi-calculator">revenue-recovery-workflow.html</a> помогает определить соответствие. Операторы с несколькими локациями (DSO, больничные сети, сети тренажёрных залов, флитовые операторы) видят наивысший ROI, потому что фиксированные инвестиции в процесс амортизируются по локациям.',
    'El Diagnóstico ($2,500) es viable para cualquier negocio con al menos $100,000 en cuentas por cobrar mayores a 30 días. El Piloto de 90 días tiene sentido económico claro cuando la AR pendiente es $500,000+ o los write-offs mensuales exceden $25,000. Por debajo de esos umbrales, nuestra calculadora de ROI en <a href="revenue-recovery-workflow.html#roi-calculator">revenue-recovery-workflow.html</a> ayuda a determinar el ajuste. Los operadores multi-ubicación (DSOs, redes hospitalarias, cadenas de gimnasios, operadores de flotas) ven el ROI más alto porque la inversión fija en flujo se amortiza entre ubicaciones.');

add('Who owns the data and playbooks we build together?',
    'Кому принадлежат данные и плейбуки, которые мы создаём вместе?',
    '¿Quién posee los datos y los playbooks que construimos juntos?');

add("You do. All debtor data, communication templates, recovery playbooks, and process documentation built during the engagement remain the client's property. At offboarding, we provide a complete export of all materials in standard formats (CSV, PDF, DOCX). This is a deliberate contrast to agency lock-in models where the agency retains control of debtor relationships, making switching expensive. VitaCoreX is a service, not a platform with switching costs.",
    'Вам. Все данные должников, шаблоны коммуникации, плейбуки возврата и процессная документация, созданные в ходе взаимодействия, остаются собственностью клиента. При оффбординге мы предоставляем полный экспорт всех материалов в стандартных форматах (CSV, PDF, DOCX). Это намеренный контраст с lock-in моделями агентств, где агентство сохраняет контроль над отношениями с должниками, делая смену дорогостоящей. VitaCoreX — это услуга, а не платформа с издержками переключения.',
    'Usted. Todos los datos de deudores, plantillas de comunicación, playbooks de recuperación y documentación de procesos construidos durante el compromiso permanecen como propiedad del cliente. Al offboarding, proporcionamos una exportación completa de todos los materiales en formatos estándar (CSV, PDF, DOCX). Este es un contraste deliberado con los modelos de lock-in de agencia donde la agencia retiene el control de las relaciones con deudores, haciendo costoso el cambio. VitaCoreX es un servicio, no una plataforma con costos de cambio.');

add('Do you work on contingency or outcome-based pricing?',
    'Работаете ли вы по модели contingency или оплаты на основе результата?',
    '¿Trabajan con precios de contingencia o basados en resultados?');

add('Programme-tier clients can structure a portion of fees as outcome-based (recovery milestones, DSO reduction targets, or bad debt reduction). However, we do not operate on pure contingency for a simple reason: contingency models incentivize aggressive collection tactics that damage customer relationships. Our structure is intentionally aligned with long-term customer value, not short-term recovery maximization at the cost of churn. Pilot clients pay fixed fees to keep incentives clean. Full fee bands, billing mechanics, and termination terms are published on the Pricing & Engagement Tiers page.',
    'Клиенты уровня Программы могут структурировать часть гонораров как оплату на основе результата (этапы возврата, цели снижения DSO или снижения безнадёжных долгов). Однако мы не работаем на чистой contingency по простой причине: модели contingency стимулируют агрессивные тактики взыскания, наносящие ущерб отношениям с клиентами. Наша структура намеренно согласована с долгосрочной ценностью клиента, а не с краткосрочной максимизацией возврата ценой оттока. Клиенты Пилота платят фиксированные гонорары для сохранения чистоты стимулов. Полные диапазоны гонораров, механика биллинга и условия прекращения опубликованы на странице <a href="pricing-and-engagement-tiers.html">Цены и уровни взаимодействия</a>.',
    'Los clientes de nivel Programa pueden estructurar una porción de los honorarios como basada en resultados (hitos de recuperación, metas de reducción de DSO o reducción de deuda incobrable). Sin embargo, no operamos con contingencia pura por una razón simple: los modelos de contingencia incentivan tácticas de cobro agresivas que dañan las relaciones con clientes. Nuestra estructura está intencionalmente alineada con el valor de cliente de largo plazo, no con la maximización de recuperación de corto plazo a costa de churn. Los clientes Piloto pagan honorarios fijos para mantener los incentivos limpios. Las bandas completas de honorarios, mecánica de facturación y términos de terminación se publican en la página <a href="pricing-and-engagement-tiers.html">Precios y niveles de contratación</a>.');

add('Yes. The standard vendor-onboarding pack is issued to a named procurement contact within two business days of request under mutual NDA. Contents: W-9, Certificate of Insurance (General Liability + Professional Liability / E&O), mutual NDA, MSA template, data-handling attestation, specific sub-processor list, and reference contacts from prior engagements. Request the pack via contact.html?subject=vendor-onboarding or see the full list on our Security & Compliance page.',
    'Да. Стандартный пакет онбординга поставщика выдаётся названному контакту закупок в течение двух рабочих дней с запроса по взаимному NDA. Содержимое: W-9, сертификат страхования (общая ответственность + профессиональная ответственность / E&O), взаимное NDA, шаблон MSA, аттестация обработки данных, конкретный список субпроцессоров и референсные контакты из предыдущих взаимодействий. Запросите пакет через <a href="contact.html?subject=vendor-onboarding">contact.html?subject=vendor-onboarding</a> или см. полный список на странице <a href="security-and-compliance.html">Безопасность и соответствие</a>.',
    'Sí. El paquete estándar de onboarding de proveedor se emite a un contacto nombrado de procurement dentro de dos días hábiles de la solicitud bajo NDA mutuo. Contenidos: W-9, Certificado de Seguro (Responsabilidad General + Responsabilidad Profesional / E&O), NDA mutuo, plantilla MSA, atestación de manejo de datos, lista específica de subprocesadores y contactos de referencia de compromisos previos. Solicite el paquete vía <a href="contact.html?subject=vendor-onboarding">contact.html?subject=vendor-onboarding</a> o consulte la lista completa en nuestra página <a href="security-and-compliance.html">Seguridad y cumplimiento</a>.');

add("Yes. A mutual NDA is signed before any discussion that touches specific portfolio composition, sub-processor details, diagnostic methodology beyond what is already published, or reference contacts. Either party's NDA template is acceptable — we do not require ours. Turnaround on NDA review is typically under one business day.",
    'Да. Взаимное NDA подписывается до любого обсуждения, касающегося конкретного состава портфеля, сведений о субпроцессорах, диагностической методологии сверх опубликованной или референсных контактов. Шаблон NDA любой из сторон приемлем — мы не требуем нашего. Время рассмотрения NDA обычно менее одного рабочего дня.',
    'Sí. Un NDA mutuo se firma antes de cualquier discusión que toque la composición específica del portafolio, detalles de subprocesadores, metodología diagnóstica más allá de lo ya publicado, o contactos de referencia. La plantilla NDA de cualquier parte es aceptable — no requerimos la nuestra. El tiempo de respuesta en la revisión del NDA es típicamente menos de un día hábil.');

add('US-only. All client data resides on US-based infrastructure with US-based cloud vendors. No client data is stored in, processed in, or transits through jurisdictions outside the United States. Transport is TLS 1.2+ minimum; storage is AES-256 encrypted at rest; access is role-based with MFA and named-user accountability. Full data-handling posture is published on the Security & Compliance page.',
    'Только США. Все данные клиентов находятся на инфраструктуре на территории США у поставщиков облака в США. Никакие данные клиентов не хранятся, не обрабатываются и не транзитируют через юрисдикции за пределами США. Транспорт — минимум TLS 1.2+; хранение — AES-256 в покое; доступ — на основе ролей с MFA и именной ответственностью. Полная позиция по обработке данных опубликована на странице <a href="security-and-compliance.html">Безопасность и соответствие</a>.',
    'Solo EE.UU. Todos los datos del cliente residen en infraestructura con sede en EE.UU. con proveedores de nube de EE.UU. Ningún dato del cliente se almacena, procesa ni transita por jurisdicciones fuera de Estados Unidos. Transporte es TLS 1.2+ mínimo; almacenamiento es AES-256 encriptado en reposo; acceso es basado en roles con MFA y responsabilidad de usuario nombrado. Postura completa de manejo de datos publicada en la página <a href="security-and-compliance.html">Seguridad y cumplimiento</a>.');

add("Yes — operator-environment execution is our preference, not the exception. For clients with mature SSO, SIEM, and data-governance controls, we operate inside the operator's environment with named-user access and activity logging visible to the operator's security team. This keeps PHI, PII, and financial records on the operator's infrastructure and under the operator's retention policy. Most multi-site healthcare and finance engagements follow this pattern.",
    'Да — исполнение в среде оператора — наше предпочтение, а не исключение. Для клиентов со зрелыми контролями SSO, SIEM и data-governance мы работаем внутри среды оператора с именным доступом и логированием активности, видимым команде безопасности оператора. Это сохраняет PHI, PII и финансовые записи на инфраструктуре оператора и в рамках политики хранения оператора. Большинство многообъектных взаимодействий в здравоохранении и финансах следуют этому шаблону.',
    'Sí — la ejecución en entorno del operador es nuestra preferencia, no la excepción. Para clientes con controles maduros de SSO, SIEM y gobernanza de datos, operamos dentro del entorno del operador con acceso de usuario nombrado y registro de actividad visible al equipo de seguridad del operador. Esto mantiene PHI, PII y registros financieros en la infraestructura del operador y bajo la política de retención del operador. La mayoría de los compromisos multi-sitio de salud y finanzas siguen este patrón.');

add('Do you hold SOC 2, ISO 27001, or HITRUST certifications?',
    'Имеете ли вы сертификаты SOC 2, ISO 27001 или HITRUST?',
    '¿Poseen certificaciones SOC 2, ISO 27001 o HITRUST?');

add('No. VitaCoreX LLC is a US-based firm established 2025 and we do not claim SOC 2 Type II, ISO 27001, or HITRUST certification. We state this in writing at the top of vendor onboarding so procurement teams do not have to extract it during contract review. Our controls are published plainly on the Security & Compliance page, and we will complete a standard vendor-security questionnaire (SIG, CAIQ, or equivalent) on request. Certification work is scheduled on a dated roadmap; we will not misrepresent timeline.',
    'Нет. VitaCoreX LLC — фирма в США, основанная в 2025 году, и мы не заявляем о сертификации SOC 2 Type II, ISO 27001 или HITRUST. Мы указываем это письменно в начале онбординга поставщика, чтобы командам закупок не приходилось извлекать эту информацию при обзоре контракта. Наши контроли опубликованы в ясной форме на странице <a href="security-and-compliance.html">Безопасность и соответствие</a>, и мы заполним стандартный опросник безопасности поставщика (SIG, CAIQ или эквивалент) по запросу. Работа по сертификации запланирована на датированной дорожной карте; мы не будем искажать сроки.',
    'No. VitaCoreX LLC es una firma con sede en EE.UU. establecida en 2025 y no reclamamos certificación SOC 2 Type II, ISO 27001 ni HITRUST. Declaramos esto por escrito al inicio del onboarding de proveedor para que los equipos de procurement no tengan que extraerlo durante la revisión del contrato. Nuestros controles están publicados claramente en la página <a href="security-and-compliance.html">Seguridad y cumplimiento</a>, y completaremos un cuestionario estándar de seguridad de proveedor (SIG, CAIQ o equivalente) bajo solicitud. El trabajo de certificación está programado en un roadmap con fechas; no tergiversaremos los plazos.');

add('Are you a HIPAA Covered Entity? Will you sign a BAA?',
    'Являетесь ли вы HIPAA Covered Entity? Подпишете ли BAA?',
    '¿Son una Entidad Cubierta HIPAA? ¿Firmarán un BAA?');

add("We are not a HIPAA Covered Entity. When an engagement touches PHI, VitaCoreX signs a Business Associate Agreement (BAA) with the Covered Entity and operates under the Covered Entity's HIPAA program — we do not design NPPs, breach-response policies, or BAA templates on the operator's behalf. We maintain role-based access, MFA, encryption-in-transit and at-rest, and named-user audit trails consistent with BA obligations under 45 CFR 164.504(e).",
    'Мы не являемся HIPAA Covered Entity. Когда взаимодействие касается PHI, VitaCoreX подписывает Business Associate Agreement (BAA) с Covered Entity и работает по программе HIPAA Covered Entity — мы не разрабатываем NPP, политики реагирования на нарушения или шаблоны BAA от имени оператора. Мы поддерживаем доступ на основе ролей, MFA, шифрование в транзите и в покое и именной аудиторский след, соответствующий обязательствам BA по 45 CFR 164.504(e).',
    'No somos una Entidad Cubierta HIPAA. Cuando un compromiso toca PHI, VitaCoreX firma un Business Associate Agreement (BAA) con la Entidad Cubierta y opera bajo el programa HIPAA de la Entidad Cubierta — no diseñamos NPPs, políticas de respuesta a brechas ni plantillas BAA en nombre del operador. Mantenemos acceso basado en roles, MFA, encriptación en tránsito y en reposo, y registros de auditoría de usuario nombrado consistentes con las obligaciones de BA bajo 45 CFR 164.504(e).');

add('Are you a registered debt collector under the FDCPA?',
    'Зарегистрированы ли вы как коллектор по FDCPA?',
    '¿Están registrados como cobrador de deudas bajo FDCPA?');

add('No. VitaCoreX does not meet the FDCPA definition of a "debt collector" and does not operate as one. We do not contact debtors on the operator\'s behalf, do not threaten legal action, and do not collect debts as our principal business. Our role is workflow design, documentation infrastructure, and file-readiness discipline that sits entirely upstream of any debt-collection activity. Patient and customer contact remains the operator\'s role. State-level (e.g., Florida FCCPA) boundaries follow the same discipline.',
    'Нет. VitaCoreX не соответствует определению «коллектора» по FDCPA и не работает как таковой. Мы не связываемся с должниками от имени оператора, не угрожаем юридическими действиями и не взимаем долги как наш основной бизнес. Наша роль — проектирование процессов, инфраструктура документации и дисциплина готовности файлов, которая находится полностью выше по потоку любой коллекторской деятельности. Контакт с пациентом и клиентом остаётся ролью оператора. Границы уровня штата (например, Florida FCCPA) следуют той же дисциплине.',
    'No. VitaCoreX no cumple la definición FDCPA de "cobrador de deudas" y no opera como tal. No contactamos deudores en nombre del operador, no amenazamos con acción legal y no cobramos deudas como nuestro negocio principal. Nuestro rol es diseño de flujo, infraestructura documental y disciplina de preparación de expedientes que está completamente aguas arriba de cualquier actividad de cobro. El contacto con paciente y cliente sigue siendo el rol del operador. Los límites a nivel estatal (p. ej., Florida FCCPA) siguen la misma disciplina.');

add('What is your sub-processor list?',
    'Каков ваш список субпроцессоров?',
    '¿Cuál es su lista de subprocesadores?');

add('The specific sub-processor list — named vendors by category (cloud infrastructure, email delivery, analytics, payment processing, AI tooling) — is provided under NDA as part of the vendor-onboarding pack. We commit to 30-day written notice before adding or changing any sub-processor that touches client data, with the operator retaining the right to object. High-level categories are published on the Security & Compliance page; specific vendor names are NDA-scoped to prevent targeted supply-chain reconnaissance.',
    'Конкретный список субпроцессоров — названные поставщики по категориям (облачная инфраструктура, доставка почты, аналитика, платёжная обработка, инструменты ИИ) — предоставляется по NDA как часть пакета онбординга поставщика. Мы обязуемся предоставить письменное уведомление за 30 дней до добавления или изменения любого субпроцессора, касающегося данных клиента, с правом оператора возражать. Категории высокого уровня опубликованы на странице <a href="security-and-compliance.html">Безопасность и соответствие</a>; конкретные имена поставщиков защищены NDA для предотвращения целенаправленной разведки цепочки поставок.',
    'La lista específica de subprocesadores — proveedores nombrados por categoría (infraestructura de nube, entrega de correo, analítica, procesamiento de pagos, herramientas de IA) — se proporciona bajo NDA como parte del paquete de onboarding de proveedor. Nos comprometemos a un aviso escrito de 30 días antes de agregar o cambiar cualquier subprocesador que toque datos del cliente, conservando el operador el derecho a objetar. Las categorías de alto nivel se publican en la página <a href="security-and-compliance.html">Seguridad y cumplimiento</a>; los nombres específicos de proveedores están bajo NDA para prevenir reconocimiento dirigido de cadena de suministro.');

add('How long do you retain client data after engagement close?',
    'Как долго вы храните данные клиента после закрытия взаимодействия?',
    '¿Cuánto tiempo retienen los datos del cliente después del cierre del compromiso?');

add("Default retention is 90 days post-engagement for operational handback support, after which all client data is destroyed with a signed certificate of destruction issued to the operator. Early destruction at seven days is available on written request, also with certificate. If the engagement ran inside the operator's environment, retention follows the operator's own retention policy — VCX retains only engagement metadata necessary for billing and audit.",
    'Стандартное хранение — 90 дней после взаимодействия для операционной поддержки возврата, после чего все данные клиента уничтожаются с подписанным сертификатом уничтожения, выданным оператору. Досрочное уничтожение за семь дней доступно по письменному запросу, также с сертификатом. Если взаимодействие проходило внутри среды оператора, хранение следует собственной политике хранения оператора — VCX сохраняет только метаданные взаимодействия, необходимые для биллинга и аудита.',
    'La retención predeterminada es 90 días post-compromiso para soporte operacional de entrega, tras los cuales todos los datos del cliente son destruidos con certificado firmado emitido al operador. La destrucción temprana a siete días está disponible bajo solicitud escrita, también con certificado. Si el compromiso corrió dentro del entorno del operador, la retención sigue la política de retención del propio operador — VCX retiene solo metadatos del compromiso necesarios para facturación y auditoría.');

add('Can you provide reference contacts from prior engagements?',
    'Можете ли вы предоставить референсные контакты из предыдущих взаимодействий?',
    '¿Pueden proporcionar contactos de referencia de compromisos previos?');

add("Yes — under NDA, and only with the prior client's written consent on a per-request basis. References are named individuals at operator level (CFO, COO, or GC) who have agreed to a scheduled reference call, not a list of logo anonymized testimonials. For procurement teams that need page-for-page review of a live deliverable, one consenting prior client has authorized un-redacted access to their full 30-day diagnostic under mutual NDA — see the Sample Deliverable page for the redacted version and the request path.",
    'Да — по NDA и только с письменного согласия предыдущего клиента по каждому запросу. Референсы — это названные лица на уровне оператора (CFO, COO или GC), согласившиеся на запланированный референс-звонок, а не список анонимных отзывов. Для команд закупок, которым требуется построчный обзор реального результата, один согласившийся предыдущий клиент авторизовал нередактированный доступ к их полной 30-дневной диагностике по взаимному NDA — см. страницу <a href="sample-deliverable.html">Образец результата</a> для редактированной версии и пути запроса.',
    'Sí — bajo NDA, y solo con el consentimiento escrito del cliente previo por cada solicitud. Las referencias son personas nombradas a nivel operador (CFO, COO o GC) que han acordado una llamada de referencia programada, no una lista de testimonios anonimizados. Para equipos de procurement que necesitan revisión página por página de un entregable real, un cliente previo consintiendo ha autorizado acceso sin redactar a su diagnóstico completo de 30 días bajo NDA mutuo — consulte la página <a href="sample-deliverable.html">Entregable de muestra</a> para la versión redactada y la ruta de solicitud.');

add('What is your incident response posture?',
    'Какова ваша позиция по реагированию на инциденты?',
    '¿Cuál es su postura de respuesta a incidentes?');

add('Hour 0–24: containment and scope determination. Hour 24–72: written notice to affected operators including known scope, affected data categories, and remediation plan — within the 72-hour window used by many operator breach-response policies. Day 3–14: remediation, post-mortem, and written root-cause analysis delivered to operator security contact. We run an annual tabletop exercise against the most probable scenarios. Full timeline with obligations per stage is on the Security & Compliance page.',
    'Часы 0–24: локализация и определение объёма. Часы 24–72: письменное уведомление затронутых операторов, включающее известный объём, затронутые категории данных и план устранения — в течение 72-часового окна, используемого многими политиками реагирования на нарушения операторов. Дни 3–14: устранение, post-mortem и письменный анализ первопричины, доставленный контакту безопасности оператора. Мы проводим ежегодные tabletop-учения по наиболее вероятным сценариям. Полный график с обязательствами по этапам — на странице <a href="security-and-compliance.html#incident-response">Безопасность и соответствие</a>.',
    'Hora 0–24: contención y determinación de alcance. Hora 24–72: aviso escrito a operadores afectados incluyendo alcance conocido, categorías de datos afectadas y plan de remediación — dentro de la ventana de 72 horas usada por muchas políticas de respuesta a brechas de operadores. Día 3–14: remediación, post-mortem y análisis escrito de causa raíz entregado al contacto de seguridad del operador. Ejecutamos un ejercicio tabletop anual contra los escenarios más probables. Cronograma completo con obligaciones por etapa en la página <a href="security-and-compliance.html#incident-response">Seguridad y cumplimiento</a>.');

add('Will you complete our vendor security questionnaire?',
    'Заполните ли вы наш опросник безопасности поставщика?',
    '¿Completarán nuestro cuestionario de seguridad de proveedor?');

add('Yes. We complete SIG (Shared Assessments), CAIQ (Cloud Security Alliance), or operator-specific security questionnaires under NDA within five business days of receipt. We do not outsource questionnaire completion to a third party — responses are authored and signed by our Director. If a question cannot be answered affirmatively, the response is written as a plain "no" with the relevant non-certification, not as hedged language.',
    'Да. Мы заполняем SIG (Shared Assessments), CAIQ (Cloud Security Alliance) или опросники безопасности, специфичные для оператора, по NDA в течение пяти рабочих дней с получения. Мы не передаём заполнение опросника третьей стороне — ответы составляются и подписываются нашим директором. Если на вопрос нельзя ответить утвердительно, ответ пишется как ясное «нет» с соответствующей несертификацией, а не как размытая формулировка.',
    'Sí. Completamos SIG (Shared Assessments), CAIQ (Cloud Security Alliance) o cuestionarios de seguridad específicos del operador bajo NDA dentro de cinco días hábiles de recibidos. No tercerizamos la cumplimentación del cuestionario a un tercero — las respuestas son autoría y firmadas por nuestro Director. Si una pregunta no puede responderse afirmativamente, la respuesta se escribe como un "no" claro con la no-certificación relevante, no como lenguaje ambiguo.');

add('Healthcare & Dental Revenue Recovery',
    'Возврат выручки в здравоохранении и стоматологии',
    'Recuperación de ingresos en salud y odontología');

add('Does VitaCoreX help hospitals and emergency rooms with revenue recovery?',
    'Помогает ли VitaCoreX больницам и отделениям неотложной помощи с возвратом выручки?',
    '¿VitaCoreX ayuda a hospitales y salas de emergencia con la recuperación de ingresos?');

add('Yes. VitaCoreX provides revenue recovery solutions for hospitals, emergency rooms, medical practices, and healthcare systems. Our healthcare-specific workflows address patient AR, insurance follow-up, billing optimization, and bad debt reduction while maintaining HIPAA compliance.',
    'Да. VitaCoreX предоставляет решения по возврату выручки для больниц, отделений неотложной помощи, медицинских практик и систем здравоохранения. Наши процессы для здравоохранения работают с пациентской AR, follow-up по страховке, оптимизацией биллинга и снижением безнадёжных долгов при сохранении соответствия HIPAA.',
    'Sí. VitaCoreX proporciona soluciones de recuperación de ingresos para hospitales, salas de emergencia, consultorios médicos y sistemas de salud. Nuestros flujos específicos de salud abordan AR del paciente, seguimiento de seguros, optimización de facturación y reducción de deuda incobrable manteniendo cumplimiento HIPAA.');

add('Can VitaCoreX help dental clinics and DSOs with collections?',
    'Может ли VitaCoreX помочь стоматологическим клиникам и DSO с взысканиями?',
    '¿Puede VitaCoreX ayudar a clínicas dentales y DSOs con cobros?');

add('Yes. VitaCoreX offers a dental collections alternative through pre-collection workflows designed specifically for dental clinics, Dental Service Organizations (DSOs), orthodontist practices, oral surgery centers, and pediatric dentistry. We handle dental insurance follow-up, patient balance recovery, and dental billing optimization.',
    'Да. VitaCoreX предлагает альтернативу стоматологическим взысканиям через процессы досудебного возврата, разработанные специально для стоматологических клиник, Dental Service Organizations (DSO), ортодонтических практик, центров оральной хирургии и детской стоматологии. Мы занимаемся follow-up по стоматологической страховке, возвратом баланса пациента и оптимизацией стоматологического биллинга.',
    'Sí. VitaCoreX ofrece una alternativa de cobros dentales a través de flujos de pre-cobranza diseñados específicamente para clínicas dentales, Dental Service Organizations (DSOs), consultorios de ortodoncia, centros de cirugía oral y odontopediatría. Manejamos seguimiento de seguros dentales, recuperación de saldo del paciente y optimización de facturación dental.');

add('What is a Dental Service Organization (DSO)?',
    'Что такое Dental Service Organization (DSO)?',
    '¿Qué es una Dental Service Organization (DSO)?');

add('A Dental Service Organization (DSO) is a company that provides management and business support services to dental practices, allowing dentists to focus on patient care. VitaCoreX provides revenue recovery services specifically designed for DSOs, handling patient balance recovery, insurance follow-up, and AR management across multiple dental locations.',
    'Dental Service Organization (DSO) — это компания, предоставляющая услуги управления и бизнес-поддержки стоматологическим практикам, позволяя стоматологам сосредоточиться на уходе за пациентами. VitaCoreX предоставляет услуги возврата выручки, специально разработанные для DSO, управляя возвратом баланса пациента, follow-up по страховке и AR-менеджментом по нескольким стоматологическим локациям.',
    'Una Dental Service Organization (DSO) es una empresa que proporciona servicios de gestión y apoyo comercial a consultorios dentales, permitiendo a los dentistas enfocarse en el cuidado del paciente. VitaCoreX proporciona servicios de recuperación de ingresos diseñados específicamente para DSOs, manejando recuperación de saldo del paciente, seguimiento de seguros y gestión de AR a través de múltiples ubicaciones dentales.');

add('Gym & Fitness Membership Recovery',
    'Возврат абонементов тренажёрных залов и фитнеса',
    'Recuperación de membresías de gimnasios y fitness');

add('Does VitaCoreX help gyms and fitness centers recover unpaid memberships?',
    'Помогает ли VitaCoreX тренажёрным залам и фитнес-центрам возвращать неоплаченные абонементы?',
    '¿VitaCoreX ayuda a gimnasios y centros fitness a recuperar membresías impagas?');

add('Yes. VitaCoreX provides membership recovery services for gyms, fitness centers, health clubs, CrossFit boxes, yoga studios, and boutique fitness operators. Our approach recovers unpaid membership dues while preserving member relationships, reducing involuntary churn, and optimizing dunning processes.',
    'Да. VitaCoreX предоставляет услуги по возврату абонементов для тренажёрных залов, фитнес-центров, оздоровительных клубов, CrossFit-залов, йога-студий и бутик-фитнес-операторов. Наш подход возвращает неоплаченные абонементские взносы, сохраняя отношения с участниками, снижая непроизвольный отток и оптимизируя процессы dunning.',
    'Sí. VitaCoreX proporciona servicios de recuperación de membresías para gimnasios, centros fitness, clubes de salud, CrossFit boxes, estudios de yoga y operadores boutique. Nuestro enfoque recupera cuotas de membresía impagas mientras preserva relaciones con miembros, reduce churn involuntario y optimiza procesos dunning.');

add('Immigration Document Preparation',
    'Подготовка иммиграционных документов',
    'Preparación de documentos de inmigración');

add('Does VitaCoreX help with immigration documents?',
    'Помогает ли VitaCoreX с иммиграционными документами?',
    '¿VitaCoreX ayuda con documentos de inmigración?');

add('Yes. VitaCoreX offers immigration packet preparation services including organizing documentation for USCIS forms such as I-130 (Petition for Alien Relative), I-485 (Adjustment of Status), I-765 (Employment Authorization), K-1 visa petitions, N-400 (Naturalization), asylum applications, and DACA renewals. Services are available in English, Russian, and Spanish. VitaCoreX is not a law firm and does not provide legal advice.',
    'Да. VitaCoreX предлагает услуги подготовки иммиграционных пакетов, включая организацию документации для форм USCIS, таких как I-130 (петиция для иностранного родственника), I-485 (корректировка статуса), I-765 (разрешение на работу), петиции визы K-1, N-400 (натурализация), заявления на убежище и продления DACA. Услуги доступны на английском, русском и испанском. VitaCoreX не является юридической фирмой и не предоставляет юридических консультаций.',
    'Sí. VitaCoreX ofrece servicios de preparación de paquetes de inmigración incluyendo organización de documentación para formularios USCIS como I-130 (Petición para Familiar Extranjero), I-485 (Ajuste de Estatus), I-765 (Autorización de Empleo), peticiones de visa K-1, N-400 (Naturalización), solicitudes de asilo y renovaciones DACA. Servicios disponibles en inglés, ruso y español. VitaCoreX no es un bufete y no proporciona asesoría legal.');

add('What USCIS forms does VitaCoreX help organize?',
    'Какие формы USCIS VitaCoreX помогает организовать?',
    '¿Qué formularios USCIS ayuda a organizar VitaCoreX?');

add('VitaCoreX helps organize documentation for I-130 (family petition), I-485 (green card adjustment), I-765 (work permit), K-1 (fiance visa), N-400 (citizenship/naturalization), asylum applications, DACA renewals, and other USCIS forms. We prepare the document packet for attorney review and filing.',
    'VitaCoreX помогает организовать документацию для I-130 (семейная петиция), I-485 (корректировка грин-карты), I-765 (разрешение на работу), K-1 (виза жениха/невесты), N-400 (гражданство/натурализация), заявлений на убежище, продлений DACA и других форм USCIS. Мы готовим пакет документов для обзора юристом и подачи.',
    'VitaCoreX ayuda a organizar documentación para I-130 (petición familiar), I-485 (ajuste de green card), I-765 (permiso de trabajo), K-1 (visa de prometido), N-400 (ciudadanía/naturalización), solicitudes de asilo, renovaciones DACA y otros formularios USCIS. Preparamos el paquete de documentos para revisión y presentación por abogado.');

add('Company Formation & LLC',
    'Регистрация компании и LLC',
    'Formación de empresas y LLC');

add('Can VitaCoreX help me form an LLC in Florida?',
    'Может ли VitaCoreX помочь мне зарегистрировать LLC во Флориде?',
    '¿Puede VitaCoreX ayudarme a formar una LLC en Florida?');

add('Yes. VitaCoreX provides company formation document services in Florida including LLC registration, S-Corp and C-Corp formation, articles of incorporation preparation, operating agreement drafting, EIN application, and business license guidance. Services available in English, Russian, and Spanish.',
    'Да. VitaCoreX предоставляет услуги по регистрации компаний во Флориде, включая регистрацию LLC, формирование S-Corp и C-Corp, подготовку учредительных документов, составление operating agreement, подачу заявки на EIN и руководство по бизнес-лицензиям. Услуги доступны на английском, русском и испанском.',
    'Sí. VitaCoreX proporciona servicios de documentos de formación de empresas en Florida incluyendo registro de LLC, formación de S-Corp y C-Corp, preparación de artículos de incorporación, redacción de operating agreement, solicitud de EIN y guía de licencia comercial. Servicios disponibles en inglés, ruso y español.');

add('What types of businesses can VitaCoreX help form?',
    'Какие типы бизнесов VitaCoreX может помочь сформировать?',
    '¿Qué tipos de negocios puede ayudar a formar VitaCoreX?');

add('VitaCoreX assists with documentation for LLC (Limited Liability Company), S-Corporation, and C-Corporation formation in Florida. We help prepare articles of incorporation, operating agreements, EIN applications, Florida business license applications, and registered agent documentation.',
    'VitaCoreX помогает с документацией для формирования LLC (Limited Liability Company), S-Corporation и C-Corporation во Флориде. Мы помогаем подготовить учредительные документы, operating agreements, заявки на EIN, заявки на бизнес-лицензию Флориды и документацию registered agent.',
    'VitaCoreX asiste con documentación para formación de LLC (Limited Liability Company), S-Corporation y C-Corporation en Florida. Ayudamos a preparar artículos de incorporación, operating agreements, solicitudes de EIN, solicitudes de licencia comercial de Florida y documentación de registered agent.');

add('Auto Deal Review',
    'Проверка автосделки',
    'Revisión de transacciones automotrices');

add('How can VitaCoreX help me save money when buying a car?',
    'Как VitaCoreX может помочь мне сэкономить деньги при покупке автомобиля?',
    '¿Cómo puede VitaCoreX ayudarme a ahorrar dinero al comprar un auto?');

add("VitaCoreX's Auto Deal Check tool analyzes your car purchase deal to identify unnecessary dealer fees, overpriced GAP insurance, inflated warranty costs, and unfavorable loan terms. Use our free car purchase calculator at vitacorexllc.com/auto-purchase.html to review your deal before signing at the dealership.",
    'Инструмент Auto Deal Check от VitaCoreX анализирует сделку покупки автомобиля, чтобы выявить ненужные дилерские сборы, переоценённую GAP-страховку, завышенные стоимости гарантий и невыгодные условия кредита. Используйте наш бесплатный калькулятор покупки автомобиля на vitacorexllc.com/auto-purchase.html для обзора сделки перед подписанием в дилерстве.',
    'La herramienta Auto Deal Check de VitaCoreX analiza su transacción de compra de auto para identificar tarifas de concesionario innecesarias, seguro GAP sobreprecio, costos de garantía inflados y términos de préstamo desfavorables. Use nuestra calculadora gratuita de compra de auto en vitacorexllc.com/auto-purchase.html para revisar su transacción antes de firmar en el concesionario.');

add('What dealer fees should I watch out for when buying a car?',
    'Каких дилерских сборов следует опасаться при покупке автомобиля?',
    '¿De qué tarifas de concesionario debo cuidarme al comprar un auto?');

add("Common dealer fees to watch include documentation fees (doc fees), dealer preparation fees, advertising fees, market adjustment markups, overpriced GAP insurance, extended warranty upsells, and paint protection packages. VitaCoreX's auto deal tool checks these fees against common thresholds and provides negotiation points.",
    'Общие дилерские сборы, которых следует опасаться: документационные сборы (doc fees), сборы за подготовку дилера, рекламные сборы, наценки market adjustment, переоценённая GAP-страховка, продажи расширенных гарантий и пакетов защиты краски. Инструмент авто-сделки VitaCoreX проверяет эти сборы против общих пороговых значений и предоставляет аргументы для переговоров.',
    'Las tarifas comunes de concesionario a vigilar incluyen tarifas de documentación (doc fees), tarifas de preparación del concesionario, tarifas de publicidad, markups de ajuste de mercado, seguro GAP sobreprecio, upsells de garantía extendida y paquetes de protección de pintura. La herramienta de auto deal de VitaCoreX verifica estas tarifas contra umbrales comunes y proporciona puntos de negociación.');

add('Legal Document Services',
    'Услуги по юридическим документам',
    'Servicios de documentos legales');

add('What legal document services does VitaCoreX provide?',
    'Какие услуги по юридическим документам предоставляет VitaCoreX?',
    '¿Qué servicios de documentos legales proporciona VitaCoreX?');

add('VitaCoreX provides corporate legal file control, contract review and clause analysis, NDA review, non-compete agreement review, demand letter preparation, litigation support, discovery management, and legal evidence organization. Our AI-powered Contract Scanner analyzes contracts for risks and issues automatically.',
    'VitaCoreX предоставляет контроль корпоративных юридических файлов, обзор контрактов и анализ положений, обзор NDA, обзор соглашений о неконкуренции, подготовку претензионных писем, поддержку судебных разбирательств, управление discovery и организацию юридических доказательств. Наш Contract Scanner на базе ИИ автоматически анализирует контракты на риски и проблемы.',
    'VitaCoreX proporciona control de expedientes legales corporativos, revisión de contratos y análisis de cláusulas, revisión de NDA, revisión de acuerdos de no competencia, preparación de cartas de demanda, apoyo a litigios, gestión de discovery y organización de evidencia legal. Nuestro Contract Scanner con IA analiza contratos automáticamente por riesgos y problemas.');

add('Is VitaCoreX a law firm?',
    'Является ли VitaCoreX юридической фирмой?',
    '¿Es VitaCoreX un bufete de abogados?');

add('No. VitaCoreX LLC is not a law firm and does not provide legal advice or legal representation. We provide document preparation, organization, and analysis services. For legal advice, please consult a licensed attorney. We can prepare documentation packets for attorney review.',
    'Нет. VitaCoreX LLC не является юридической фирмой и не предоставляет юридических консультаций или представительства. Мы предоставляем услуги по подготовке, организации и анализу документов. За юридической консультацией обратитесь к лицензированному юристу. Мы можем подготовить пакеты документации для обзора юристом.',
    'No. VitaCoreX LLC no es un bufete de abogados y no proporciona asesoría legal ni representación legal. Proporcionamos servicios de preparación, organización y análisis de documentos. Para asesoría legal, consulte a un abogado licenciado. Podemos preparar paquetes de documentación para revisión por abogado.');

add('General Questions',
    'Общие вопросы',
    'Preguntas generales');

add('Where is VitaCoreX located?',
    'Где находится VitaCoreX?',
    '¿Dónde se encuentra VitaCoreX?');

add('VitaCoreX LLC is based in Tampa, Florida. We serve clients nationwide across the United States and offer services in English, Russian, and Spanish. Contact us at (888) 794-8292.',
    'VitaCoreX LLC базируется в Тампе, Флорида. Мы обслуживаем клиентов по всей территории Соединённых Штатов и предлагаем услуги на английском, русском и испанском. Свяжитесь с нами по телефону (888) 794-8292.',
    'VitaCoreX LLC tiene su base en Tampa, Florida. Servimos clientes a nivel nacional en Estados Unidos y ofrecemos servicios en inglés, ruso y español. Contáctenos al (888) 794-8292.');

add('What languages does VitaCoreX support?',
    'Какие языки поддерживает VitaCoreX?',
    '¿Qué idiomas soporta VitaCoreX?');

add('VitaCoreX provides all services in three languages: English, Russian, and Spanish. Our website, documents, and client communication are available in all three languages.',
    'VitaCoreX предоставляет все услуги на трёх языках: английский, русский и испанский. Наш сайт, документы и коммуникация с клиентами доступны на всех трёх языках.',
    'VitaCoreX proporciona todos los servicios en tres idiomas: inglés, ruso y español. Nuestro sitio web, documentos y comunicación con clientes están disponibles en los tres idiomas.');

add('What industries does VitaCoreX serve?',
    'Какие отрасли обслуживает VitaCoreX?',
    '¿Qué industrias sirve VitaCoreX?');

add('VitaCoreX serves healthcare (hospitals, ERs, medical practices), dental (clinics, DSOs, orthodontists), gyms and fitness (health clubs, CrossFit, yoga), subscription/SaaS businesses, fleet and logistics operators, construction and B2B companies, and individual private clients needing immigration, company formation, auto deal, or legal document services.',
    'VitaCoreX обслуживает здравоохранение (больницы, ER, медицинские практики), стоматологию (клиники, DSO, ортодонты), тренажёрные залы и фитнес (health clubs, CrossFit, йога), подписочные/SaaS-бизнесы, флит- и логистических операторов, строительные и B2B-компании, а также индивидуальных частных клиентов, нуждающихся в иммиграции, регистрации компании, автосделке или услугах юридических документов.',
    'VitaCoreX sirve salud (hospitales, ERs, consultorios médicos), odontología (clínicas, DSOs, ortodoncistas), gimnasios y fitness (health clubs, CrossFit, yoga), negocios de suscripción/SaaS, operadores de flota y logística, empresas de construcción y B2B, y clientes privados individuales que necesitan inmigración, formación de empresas, auto deal o servicios de documentos legales.');

add('How do I contact VitaCoreX?',
    'Как мне связаться с VitaCoreX?',
    '¿Cómo contacto a VitaCoreX?');

add("Contact VitaCoreX LLC at (888) 794-8292, email stevenmiller@vitacorexllc.com, or visit our contact page at vitacorexllc.com/contact.html. We're located in Tampa, FL and serve clients nationwide in English, Russian, and Spanish. You can also book a 30-minute consultation at calendly.com/vitacorex2025/30min.",
    'Свяжитесь с VitaCoreX LLC по телефону (888) 794-8292, по электронной почте stevenmiller@vitacorexllc.com или посетите нашу контактную страницу vitacorexllc.com/contact.html. Мы находимся в Тампе, Флорида, и обслуживаем клиентов по всей стране на английском, русском и испанском. Вы также можете забронировать 30-минутную консультацию на calendly.com/vitacorex2025/30min.',
    'Contacte a VitaCoreX LLC al (888) 794-8292, correo stevenmiller@vitacorexllc.com, o visite nuestra página de contacto en vitacorexllc.com/contact.html. Estamos en Tampa, FL y servimos clientes a nivel nacional en inglés, ruso y español. También puede reservar una consulta de 30 minutos en calendly.com/vitacorex2025/30min.');

add('Ready to Get Started?',
    'Готовы начать?',
    '¿Listo para comenzar?');

add('Contact VitaCoreX for a confidential consultation. Available in English, Russian, and Spanish.',
    'Свяжитесь с VitaCoreX для конфиденциальной консультации. Доступно на английском, русском и испанском.',
    'Contacte a VitaCoreX para una consulta confidencial. Disponible en inglés, ruso y español.');

/* ================================================================
   FULL-SITE COVERAGE — all remaining page strings (home / industries /
   immigration forms / city pages / solutions / misc)
   ================================================================ */

/* --- INDEX (home) --- */
add('Two ways to engage',
    'Два способа начать работу',
    'Dos formas de colaborar');
add('Who are you coming for?',
    'Кто вы?',
    '¿Quién solicita el servicio?');
add('VitaCoreX serves two distinct audiences. Each has its own engagement standard, documentation depth, and delivery cadence — so the work fits the context, not the other way around.',
    'VitaCoreX обслуживает две разные аудитории. У каждой — свой стандарт работы, глубина документации и ритм поставки, чтобы работа соответствовала контексту, а не наоборот.',
    'VitaCoreX atiende a dos audiencias distintas. Cada una tiene su propio estándar de colaboración, profundidad documental y ritmo de entrega — el trabajo se adapta al contexto, no al revés.');
add('Revenue recovery, documentation control, escalation readiness.',
    'Возврат дебиторки, контроль документов, готовность к эскалации.',
    'Recuperación de ingresos, control documental, preparación para escalamiento.');
add('Structured infrastructure for companies that cannot afford a weak handoff. Built around pre-collection discipline, counsel-ready files, and 90-day pilot visibility.',
    'Структурированная инфраструктура для компаний, которым нельзя допускать слабую передачу дел. Построена вокруг дисциплины досудебного этапа, файлов уровня адвокатской готовности и 90-дневного пилотного контроля.',
    'Infraestructura estructurada para empresas que no pueden permitirse un traspaso débil. Basada en disciplina pre-cobranza, expedientes listos para abogado y visibilidad de piloto a 90 días.');
add('— Pre-collection & commercial AR recovery',
    '— Досудебная работа и возврат коммерческой дебиторки',
    '— Pre-cobranza y recuperación de cuentas por cobrar comerciales');
add('— Corporate legal file control & contract governance',
    '— Контроль корпоративных юридических файлов и управление контрактами',
    '— Control de expedientes legales corporativos y gobernanza contractual');
add('— Structured intake & escalation protocols',
    '— Структурированный приём обращений и протоколы эскалации',
    '— Admisión estructurada y protocolos de escalamiento');
add('Contract review, immigration packets, auto-deal analysis.',
    'Проверка контрактов, иммиграционные пакеты, анализ автосделок.',
    'Revisión de contratos, paquetes de inmigración, análisis de compraventa de auto.');
add('Defined-scope advisory for individuals facing high-stakes documents. Clear timeframe, clear format, discretion by default.',
    'Консультирование с чётко определённым объёмом для частных клиентов, работающих с документами высокой важности. Понятные сроки, понятный формат, конфиденциальность по умолчанию.',
    'Asesoría con alcance definido para personas que enfrentan documentos de alta relevancia. Plazo claro, formato claro, discreción por defecto.');
add('— Contract & lease review',
    '— Проверка контрактов и договоров аренды',
    '— Revisión de contratos y arrendamientos');
add('— Immigration document preparation',
    '— Подготовка иммиграционных документов',
    '— Preparación de documentos migratorios');
add('— Auto-deal & major-purchase review',
    '— Проверка автосделок и крупных покупок',
    '— Revisión de compraventa de auto y compras mayores');
add('Not sure where you fit? Start with a confidential review →',
    'Не уверены, куда вы относитесь? Начните с конфиденциальной консультации →',
    '¿No está seguro dónde encaja? Comience con una revisión confidencial →');
add('Counsel-Ready',
    'Готовность для адвоката',
    'Listo para abogado');
add('Audit-Grade Security',
    'Безопасность аудиторского уровня',
    'Seguridad grado auditoría');
add('Every document encrypted, access-logged, and compliant with federal retention standards.',
    'Каждый документ зашифрован, доступ логируется, соответствие федеральным стандартам хранения.',
    'Cada documento cifrado, con registro de accesos y conforme a los estándares federales de retención.');
add('Recovery Analytics',
    'Аналитика возврата',
    'Analítica de recuperación');
add('Live dashboards tracking cohort aging, collection velocity, and escalation timing across every matter.',
    'Живые дашборды со старением когорт, скоростью взыскания и таймингом эскалации по каждому делу.',
    'Paneles en vivo con antigüedad de cohortes, velocidad de cobro y tiempos de escalamiento en cada caso.');
add('Compliance Infrastructure',
    'Инфраструктура комплаенса',
    'Infraestructura de cumplimiento');
add('FDCPA, FCCPA, and state-level compliance built into every workflow. Automated audit trails and escalation triggers.',
    'FDCPA, FCCPA и соответствие законам штатов встроены в каждый процесс. Автоматические аудит-логи и триггеры эскалации.',
    'Cumplimiento FDCPA, FCCPA y estatal integrado en cada flujo. Rastros de auditoría y disparadores de escalamiento automatizados.');
add('Trusted by Operators',
    'Доверие операторов',
    'Elegido por operadores');
add('CFOs, compliance directors, and legal operations teams across the U.S. choose VitaCoreX for structured recovery infrastructure.',
    'Финансовые директора, руководители комплаенса и юридических операций по всей территории США выбирают VitaCoreX ради структурированной инфраструктуры возврата.',
    'Directores financieros, de cumplimiento y de operaciones legales de todo EE. UU. eligen VitaCoreX por su infraestructura estructurada de recuperación.');
add('Based on structured AR methodology benchmarks. Sources: Clio Legal Trends 2024, HBMA Revenue Cycle Report 2024.',
    'На основе отраслевых бенчмарков структурированной работы с дебиторкой. Источники: Clio Legal Trends 2024, HBMA Revenue Cycle Report 2024.',
    'Basado en referencias de metodología estructurada de cuentas por cobrar. Fuentes: Clio Legal Trends 2024, HBMA Revenue Cycle Report 2024.');
add('6-location DSO with $1.1M in receivables 30—180 days old. Pre-collection workflow prioritized fresh balances (<90 days) and structured outreach preserved patient relationships across all locations.',
    'DSO из 6 клиник с $1,1 млн дебиторки возрастом 30—180 дней. Досудебный процесс приоритизировал свежие балансы (<90 дней), структурированная коммуникация сохранила отношения с пациентами во всех точках.',
    'DSO de 6 clínicas con $1,1M en cuentas por cobrar de 30—180 días. El flujo pre-cobranza priorizó saldos recientes (<90 días) y el contacto estructurado preservó la relación con los pacientes en todas las sedes.');
add('DSO reduced from 62 → 41 days',
    'DSO сокращён с 62 до 41 дня',
    'DSO reducido de 62 a 41 días');
add('Net recovery rate: 47¢ per dollar (vs 12¢ agency baseline)',
    'Чистый возврат: 47¢ с доллара (против 12¢ базовой ставки агентства)',
    'Tasa neta de recuperación: 47¢ por dólar (vs 12¢ de referencia de agencia)');
add('Pilot ROI: 3.9× fees in 90 days',
    'ROI пилота: 3,9× от стоимости за 90 дней',
    'ROI del piloto: 3,9× honorarios en 90 días');
add('Multi-specialty clinic network with fragmented billing processes across 12 sites. Diagnostic identified $2.8M in recoverable AR. Structured 6-month programme rebuilt patient AR workflow and standardized escalation thresholds.',
    'Мультидисциплинарная сеть клиник с фрагментированным биллингом на 12 точках. Диагностика выявила $2,8 млн возвратной дебиторки. 6-месячная программа перестроила процесс работы с пациентскими балансами и унифицировала пороги эскалации.',
    'Red de clínicas multiespecialidad con procesos de facturación fragmentados en 12 sedes. El diagnóstico identificó $2,8M de cuentas por cobrar recuperables. El programa estructurado de 6 meses reconstruyó el flujo de cuentas por cobrar de pacientes y estandarizó umbrales de escalamiento.');
add('DSO reduced from 58 → 36 days',
    'DSO сокращён с 58 до 36 дней',
    'DSO reducido de 58 a 36 días');
add('Bad debt write-offs down 41% year over year',
    'Списания безнадёжной задолженности снижены на 41% год к году',
    'Castigos por incobrables reducidos 41% año contra año');
add('HIPAA-compliant, patient NPS neutral-to-positive',
    'Соответствие HIPAA, NPS пациентов — нейтральный/позитивный',
    'Conforme a HIPAA, NPS de pacientes entre neutro y positivo');
add('Regional fleet operator with $1.6M in disputed and overdue fuel card balances from 340 SMB accounts. Structured dispute resolution, documentation discipline, and clean escalation path cleared the backlog.',
    'Региональный флит-оператор с $1,6 млн спорных и просроченных балансов по топливным картам по 340 SMB-аккаунтам. Структурированное разрешение споров, документальная дисциплина и чистый путь эскалации расчистили бэклог.',
    'Operador regional de flota con $1,6M en saldos disputados y vencidos de tarjetas de combustible de 340 cuentas PyME. La resolución estructurada de disputas, la disciplina documental y una ruta de escalamiento limpia eliminaron el atraso.');
add('Dispute resolution cycle: 21 → 9 days',
    'Цикл разрешения споров: 21 → 9 дней',
    'Ciclo de resolución de disputas: 21 → 9 días');
add('Net recovery: 41¢ per dollar on aged balances',
    'Чистый возврат: 41¢ с доллара по старым балансам',
    'Recuperación neta: 41¢ por dólar en saldos antiguos');
add('78% of accounts retained (vs typical 20—30% post-collection)',
    '78% аккаунтов удержаны (против типичных 20—30% после коллекторов)',
    '78% de cuentas retenidas (vs 20—30% habitual después de cobranza)');
add('9-location fitness operator with 2,100 delinquent memberships and rising involuntary churn. Automated dunning sequence plus personalized outreach converted 44% of lapsed accounts back to active billing.',
    'Фитнес-оператор из 9 точек с 2 100 просроченных абонементов и растущим involuntary churn. Автоматическая последовательность напоминаний плюс персонализированная коммуникация вернули 44% просроченных аккаунтов к активному биллингу.',
    'Operador de fitness con 9 sedes, 2 100 membresías morosas y churn involuntario en aumento. La secuencia automatizada de recordatorios con contacto personalizado reactivó la facturación del 44% de las cuentas caducadas.');
add('Involuntary churn: -38% over pilot period',
    'Involuntary churn: −38% за пилотный период',
    'Churn involuntario: −38% durante el piloto');
add('Reactivation rate: 44% of delinquent members',
    'Реактивация: 44% просроченных участников',
    'Tasa de reactivación: 44% de miembros morosos');
add('Pilot ROI: 2.8× fees in 90 days',
    'ROI пилота: 2,8× от стоимости за 90 дней',
    'ROI del piloto: 2,8× honorarios en 90 días');
add('Mid-market SaaS with $780K in failed subscription renewals and card-decline backlog. Intelligent retry sequencing combined with professional outreach rescued accounts that standard dunning had written off.',
    'Mid-market SaaS с $780K неудачных продлений подписок и бэклогом отклонённых карт. Интеллектуальная последовательность повторов и профессиональная коммуникация спасли аккаунты, уже списанные стандартным процессом.',
    'SaaS mid-market con $780K en renovaciones fallidas de suscripción y acumulación de rechazos de tarjeta. La secuencia inteligente de reintentos y el contacto profesional recuperaron cuentas que el dunning estándar había descartado.');
add('Failed payment recovery rate: 67% (vs 20% prior)',
    'Возврат неудачных платежей: 67% (против 20% ранее)',
    'Tasa de recuperación de pagos fallidos: 67% (vs 20% anterior)');
add('Customer LTV preserved on 89% of recovered accounts',
    'LTV клиента сохранён в 89% возвращённых аккаунтов',
    'LTV del cliente preservado en el 89% de las cuentas recuperadas');
add('Pilot ROI: 4.1× fees in 60 days',
    'ROI пилота: 4,1× от стоимости за 60 дней',
    'ROI del piloto: 4,1× honorarios en 60 días');
add('Regional commercial contractor with $1.8M in aged progress billings and disputed change orders. Legal-file control discipline and structured demand cycle cleared disputes before counsel engagement was required.',
    'Региональный коммерческий подрядчик с $1,8 млн старых progress billings и спорными change orders. Дисциплина контроля юридического файла и структурированный демандный цикл закрыли споры до подключения адвоката.',
    'Contratista comercial regional con $1,8M en facturaciones por avance antiguas y órdenes de cambio disputadas. La disciplina de control de expediente legal y el ciclo estructurado de demanda resolvieron disputas sin necesidad de involucrar abogado.');
add('Avoided $180K in projected outside-counsel fees',
    'Сэкономлено $180K прогнозируемых расходов на внешнего адвоката',
    'Evitados $180K de honorarios proyectados de abogado externo');
add('File readiness at 94% — qualified for clean escalation',
    'Готовность файла 94% — подходит для чистой эскалации',
    'Preparación del expediente al 94% — apto para escalamiento limpio');
add('GC relationships preserved on 100% of engagements',
    'Отношения с генподрядчиками сохранены в 100% проектов',
    'Relaciones con contratistas generales preservadas en el 100% de los compromisos');
add('Representative composite scenarios derived from VitaCoreX engagement data and industry benchmarks. Actual results depend on AR age, portfolio mix, documentation condition, and operator readiness. Individual engagement outcomes vary materially.',
    'Репрезентативные составные сценарии на основе данных проектов VitaCoreX и отраслевых бенчмарков. Фактические результаты зависят от возраста дебиторки, состава портфеля, состояния документации и готовности оператора. Индивидуальные итоги существенно варьируются.',
    'Escenarios compuestos representativos derivados de datos de proyectos de VitaCoreX y referencias del sector. Los resultados reales dependen de la antigüedad de las cuentas por cobrar, la composición del portafolio, el estado documental y la preparación del operador. Los resultados individuales varían de forma significativa.');
add('Hear from the CFOs, compliance directors, and legal operations leaders who chose VitaCoreX.',
    'Отзывы финансовых директоров, руководителей комплаенса и юридических операций, выбравших VitaCoreX.',
    'Testimonios de directores financieros, de cumplimiento y de operaciones legales que eligieron VitaCoreX.');
add('"The structured intake process gave us visibility into recovery gaps we had been ignoring. For the first time, our AR workflow had a documented standard."',
    '«Структурированный процесс приёма дел показал нам пробелы в возврате, которые мы игнорировали. Впервые у нашего AR-процесса появился задокументированный стандарт».',
    '«El proceso estructurado de admisión nos dio visibilidad de brechas de recuperación que estábamos ignorando. Por primera vez nuestro flujo de cuentas por cobrar tuvo un estándar documentado».');
add('"We\'ve seen incredible results with the recovery infrastructure. Expertise and dedication beyond expectations."',
    '«Мы видим впечатляющие результаты от инфраструктуры возврата. Экспертиза и вовлечённость — выше ожиданий».',
    '«Vemos resultados increíbles con la infraestructura de recuperación. Experiencia y dedicación más allá de lo esperado».');
add('"Their team is highly professional, and innovative solutions have truly transformed the way we handle escalation."',
    '«Их команда крайне профессиональна, а инновационные решения действительно изменили то, как мы ведём эскалацию».',
    '«Su equipo es altamente profesional, y las soluciones innovadoras han transformado nuestra forma de manejar el escalamiento».');
add('"The packet discipline brought everything to counsel-ready state — chronology, exhibits, gap log — so outside attorneys could start immediately."',
    '«Дисциплина пакета привела всё в состояние готовности для адвоката — хронология, приложения, gap log — внешние юристы смогли начать сразу».',
    '«La disciplina de expedientes dejó todo listo para abogado — cronología, anexos, registro de brechas — los abogados externos pudieron empezar de inmediato».');
add('"Customer support is absolutely exceptional. They are always available, incredibly helpful with every question."',
    '«Поддержка клиентов — абсолютно исключительная. Всегда на связи, невероятно помогают по любому вопросу».',
    '«El soporte al cliente es absolutamente excepcional. Siempre están disponibles, increíblemente útiles con cada pregunta».');
add('"VitaCoreX has been a key partner in our growth journey. Structured approach changed everything."',
    '«VitaCoreX стал ключевым партнёром в нашем росте. Структурированный подход изменил всё».',
    '«VitaCoreX ha sido un socio clave en nuestro crecimiento. El enfoque estructurado cambió todo».');
add('"The 90-day pilot gave our board a clear before-and-after picture. We moved from fragmented billing to a repeatable infrastructure with measurable results. A true game-changer."',
    '«90-дневный пилот дал совету директоров чёткую картину «до и после». Мы перешли от фрагментированного биллинга к воспроизводимой инфраструктуре с измеримыми результатами. Настоящий game-changer».',
    '«El piloto de 90 días le dio a nuestra junta una foto clara del antes y después. Pasamos de una facturación fragmentada a una infraestructura repetible con resultados medibles. Un verdadero cambio de juego».');

/* --- SHARED immigration pages (I-130/I-485/N-400) --- */
add('Immigration Document Services',
    'Услуги по подготовке иммиграционных документов',
    'Servicios de Documentos de Inmigración');
add('How VitaCoreX helps',
    'Как помогает VitaCoreX',
    'Cómo ayuda VitaCoreX');
add('Frequently asked questions',
    'Часто задаваемые вопросы',
    'Preguntas frecuentes');
add('Get started',
    'Начать работу',
    'Comenzar');
add('Contact VitaCoreX today for a consultation. We serve clients in English, Russian, and Spanish throughout Tampa, Florida and nationwide.',
    'Свяжитесь с VitaCoreX сегодня для консультации. Мы обслуживаем клиентов на английском, русском и испанском по всей Тампе, Флорида, и по всей стране.',
    'Contacte a VitaCoreX hoy para una consulta. Atendemos a clientes en inglés, ruso y español en Tampa, Florida y en todo el país.');
add('Disclaimer: VitaCoreX LLC is NOT a law firm and does not provide legal advice. We provide document preparation, organization, and administrative support services. Legal strategy and legal representation remain the responsibility of licensed attorneys. If you need legal counsel, we recommend consulting a qualified immigration attorney.',
    'Отказ от ответственности: VitaCoreX LLC НЕ является юридической фирмой и не оказывает юридических консультаций. Мы предоставляем услуги по подготовке документов, их организации и административной поддержке. Юридическая стратегия и представительство остаются зоной ответственности лицензированных адвокатов. Если нужна юридическая консультация — рекомендуем обратиться к квалифицированному иммиграционному адвокату.',
    'Aviso legal: VitaCoreX LLC NO es una firma de abogados y no proporciona asesoría legal. Ofrecemos servicios de preparación de documentos, organización y apoyo administrativo. La estrategia legal y la representación legal son responsabilidad de abogados licenciados. Si necesita asesoría legal, recomendamos consultar a un abogado de inmigración calificado.');
add('Passport-style photographs (2x2 inches)',
    'Фотографии формата паспорта (2×2 дюйма)',
    'Fotografías tipo pasaporte (2×2 pulgadas)');
add('Divorce decrees or death certificates of prior spouses',
    'Решения о разводе или свидетельства о смерти предыдущих супругов',
    'Sentencias de divorcio o actas de defunción de cónyuges previos');
add('Certified English translations for all foreign-language documents',
    'Сертифицированные переводы на английский для всех документов на иностранном языке',
    'Traducciones certificadas al inglés de todos los documentos en idioma extranjero');
add('What documents are needed?',
    'Какие документы требуются?',
    '¿Qué documentos se necesitan?');

/* --- I-130 page --- */
add('What is concurrent filing?',
    'Что такое одновременная подача?',
    '¿Qué es la presentación simultánea?');
add('Form I-130 — Petition for Alien Relative',
    'Форма I-130 — Ходатайство о родственнике-иностранце',
    'Formulario I-130 — Petición para Familiar Extranjero');
add('VitaCoreX prepares, organizes, and reviews your I-130 petition package so your family-based immigration case starts with a complete, well-structured file. Available in English, Russian, and Spanish.',
    'VitaCoreX готовит, организует и проверяет пакет ходатайства I-130, чтобы ваше семейное иммиграционное дело стартовало с полного, хорошо структурированного файла. Доступно на английском, русском и испанском.',
    'VitaCoreX prepara, organiza y revisa su paquete de petición I-130 para que su caso de inmigración familiar comience con un expediente completo y bien estructurado. Disponible en inglés, ruso y español.');
add('Understanding the I-130',
    'Понимание формы I-130',
    'Entender el I-130');
add('What is Form I-130 and why does it matter?',
    'Что такое форма I-130 и почему она важна?',
    '¿Qué es el Formulario I-130 y por qué importa?');
add('Purpose of the I-130',
    'Назначение формы I-130',
    'Propósito del I-130');
add('USCIS Form I-130 is the foundational petition in family-based immigration. Filed by a U.S. citizen or lawful permanent resident, it establishes a qualifying family relationship between the petitioner and the foreign-national beneficiary. Without an approved I-130, the beneficiary cannot proceed to obtain an immigrant visa or adjust status within the United States.',
    'Форма USCIS I-130 — базовое ходатайство в семейной иммиграции. Подаётся гражданином США или обладателем законного постоянного резидентства и устанавливает квалифицирующие семейные отношения между петиционером и бенефициаром — иностранным гражданином. Без одобренной I-130 бенефициар не сможет получить иммиграционную визу или изменить статус внутри США.',
    'El Formulario USCIS I-130 es la petición base de la inmigración familiar. Presentado por un ciudadano estadounidense o residente permanente legal, establece una relación familiar calificada entre el peticionario y el beneficiario extranjero. Sin un I-130 aprobado, el beneficiario no puede obtener una visa de inmigrante ni ajustar su estatus dentro de Estados Unidos.');
add('The petition itself does not grant a green card. It is the first required step that proves the family tie exists and is legitimate. Once approved, the beneficiary moves forward through consular processing abroad or adjustment of status if already in the U.S.',
    'Само ходатайство не предоставляет грин-карту. Это первый обязательный шаг, подтверждающий существование и легитимность семейной связи. После одобрения бенефициар движется дальше — через консульскую обработку за рубежом или изменение статуса, если уже находится в США.',
    'La petición por sí sola no otorga la green card. Es el primer paso requerido que prueba que el vínculo familiar existe y es legítimo. Una vez aprobada, el beneficiario avanza mediante el procesamiento consular en el extranjero o el ajuste de estatus si ya está en EE.UU.');
add('Who can file?',
    'Кто может подавать?',
    '¿Quién puede presentar?');
add('U.S. citizens may petition for a spouse, unmarried children under 21 (immediate relatives), married or unmarried adult children, parents (if petitioner is 21+), and siblings.',
    'Граждане США могут ходатайствовать за супруга, несовершеннолетних неженатых детей (immediate relatives), женатых и неженатых взрослых детей, родителей (если петиционеру 21+) и братьев/сестёр.',
    'Los ciudadanos estadounidenses pueden presentar petición por cónyuge, hijos solteros menores de 21 (familiares inmediatos), hijos adultos casados o solteros, padres (si el peticionario tiene 21+) y hermanos.');
add('Lawful permanent residents may petition for a spouse and unmarried children only.',
    'Законные постоянные резиденты могут ходатайствовать только за супруга и неженатых детей.',
    'Los residentes permanentes legales pueden presentar petición solo por cónyuge e hijos solteros.');
add('The petitioner must be at least 18 years old for spousal petitions and must demonstrate the ability to financially support the beneficiary.',
    'Для супружеских ходатайств петиционеру должно быть не менее 18 лет, и он должен подтвердить финансовую возможность содержать бенефициара.',
    'El peticionario debe tener al menos 18 años para peticiones conyugales y demostrar la capacidad financiera de mantener al beneficiario.');
add('Immediate relatives of U.S. citizens have no annual visa cap, while preference categories are subject to per-country limits and visa bulletin wait times.',
    'Ближайшие родственники граждан США не имеют годового лимита виз, тогда как преференциальные категории подчиняются лимитам по странам и срокам Visa Bulletin.',
    'Los familiares inmediatos de ciudadanos estadounidenses no tienen tope anual de visas, mientras que las categorías de preferencia están sujetas a límites por país y a los tiempos del Visa Bulletin.');
add('Document checklist',
    'Чек-лист документов',
    'Lista de verificación de documentos');
add('Required documents for your I-130 petition',
    'Необходимые документы для ходатайства I-130',
    'Documentos requeridos para su petición I-130');
add('Petitioner evidence',
    'Доказательства петиционера',
    'Evidencia del peticionario');
add('Proof of U.S. citizenship (birth certificate, naturalization certificate, or U.S. passport)',
    'Доказательство гражданства США (свидетельство о рождении, сертификат о натурализации или паспорт США)',
    'Prueba de ciudadanía estadounidense (acta de nacimiento, certificado de naturalización o pasaporte de EE.UU.)');
add('Proof of lawful permanent residence (green card copy, front and back)',
    'Доказательство законного постоянного резидентства (копия грин-карты, обе стороны)',
    'Prueba de residencia permanente legal (copia de la green card, ambos lados)');
add('Government-issued photo ID',
    'Удостоверение личности с фото, выданное государством',
    'Identificación oficial con foto');
add('Relationship evidence',
    'Доказательства родства',
    'Evidencia de la relación');
add('Marriage certificate (for spousal petitions)',
    'Свидетельство о браке (для супружеских ходатайств)',
    'Acta de matrimonio (para peticiones conyugales)');
add('Birth certificates showing parent-child relationship',
    'Свидетельства о рождении, подтверждающие отношения родитель-ребёнок',
    'Actas de nacimiento que muestren la relación padre-hijo');
add('Adoption decree (if applicable)',
    'Решение об усыновлении (если применимо)',
    'Sentencia de adopción (si aplica)');
add('Supporting materials',
    'Подтверждающие материалы',
    'Materiales de respaldo');
add('Joint financial records, shared lease agreements, or photos (spousal petitions)',
    'Совместные финансовые документы, совместные договоры аренды или фотографии (для супружеских ходатайств)',
    'Registros financieros conjuntos, contratos de arrendamiento compartidos o fotos (peticiones conyugales)');
add('Affidavits from family or friends attesting to the relationship',
    'Аффидевиты от родственников или друзей, подтверждающие отношения',
    'Declaraciones juradas de familiares o amigos que acrediten la relación');
add('Filing fee payment (check or money order payable to U.S. Department of Homeland Security)',
    'Оплата пошлины за подачу (чек или денежный перевод на U.S. Department of Homeland Security)',
    'Pago de la tarifa de presentación (cheque u orden de pago a U.S. Department of Homeland Security)');
add('Common mistakes',
    'Типичные ошибки',
    'Errores comunes');
add('Errors that delay or deny I-130 petitions',
    'Ошибки, задерживающие или приводящие к отказу по I-130',
    'Errores que retrasan o niegan peticiones I-130');
add('Filing and documentation errors',
    'Ошибки подачи и документов',
    'Errores de presentación y documentación');
add('Submitting an outdated form edition — USCIS rejects petitions not using the current version',
    'Подача устаревшей редакции формы — USCIS отклоняет ходатайства, где используется не актуальная версия',
    'Presentar una edición obsoleta del formulario — USCIS rechaza peticiones que no usen la versión vigente');
add('Missing signatures or incomplete fields on the petition form',
    'Отсутствующие подписи или незаполненные поля в форме ходатайства',
    'Firmas faltantes o campos incompletos en el formulario de petición');
add('Failing to include certified translations for documents in languages other than English',
    'Отсутствие сертифицированных переводов для документов не на английском языке',
    'No incluir traducciones certificadas para documentos en idiomas distintos al inglés');
add('Sending the wrong filing fee amount or using an unaccepted payment method',
    'Неверная сумма пошлины или недопустимый способ оплаты',
    'Enviar el monto incorrecto de la tarifa o usar un método de pago no aceptado');
add('Evidence and eligibility issues',
    'Проблемы с доказательствами и правомочностью',
    'Problemas de evidencia y elegibilidad');
add('Insufficient proof of a bona fide relationship, especially in spousal cases',
    'Недостаточные доказательства подлинности отношений, особенно в супружеских делах',
    'Prueba insuficiente de una relación de buena fe, especialmente en casos conyugales');
add('Not providing evidence that a prior marriage was legally terminated before the current marriage',
    'Отсутствие доказательств законного прекращения предыдущего брака до заключения текущего',
    'No proporcionar prueba de que un matrimonio anterior terminó legalmente antes del matrimonio actual');
add('Filing in the wrong preference category or misunderstanding LPR vs. citizen filing rights',
    'Подача в неверной преференциальной категории или непонимание прав LPR vs. гражданина',
    'Presentar en la categoría de preferencia incorrecta o malinterpretar los derechos de LPR vs. ciudadano');
add('Overlooking name discrepancies across documents without explanatory evidence',
    'Игнорирование расхождений в именах между документами без пояснительных материалов',
    'Ignorar discrepancias de nombres entre documentos sin evidencia explicativa');
add('Structured document preparation for your I-130 case',
    'Структурированная подготовка документов для вашего дела I-130',
    'Preparación documental estructurada para su caso I-130');
add('VitaCoreX organizes your complete petition package, checks for common errors, and ensures every required document is accounted for before you submit. Services available in English, Russian, and Spanish.',
    'VitaCoreX собирает ваш полный пакет ходатайства, проверяет типичные ошибки и следит, чтобы до подачи все обязательные документы были на месте. Услуги доступны на английском, русском и испанском.',
    'VitaCoreX organiza su paquete completo de petición, revisa errores comunes y asegura que cada documento requerido esté en su lugar antes de presentar. Servicios disponibles en inglés, ruso y español.');
add('Document assembly',
    'Сборка документов',
    'Armado del expediente');
add('We compile and organize every required form, photo, and supporting exhibit into a structured filing package with a cover letter and document index for USCIS review.',
    'Мы собираем и упорядочиваем каждую форму, фото и приложение в структурированный пакет подачи с сопроводительным письмом и индексом документов для рассмотрения USCIS.',
    'Compilamos y organizamos cada formulario, foto y anexo de respaldo en un paquete estructurado con carta de presentación e índice documental para revisión de USCIS.');
add('Error review',
    'Проверка на ошибки',
    'Revisión de errores');
add('Our team reviews the petition for missing signatures, incorrect fee amounts, outdated form editions, and inconsistencies that commonly trigger Requests for Evidence (RFEs).',
    'Наша команда проверяет ходатайство на отсутствующие подписи, неверные суммы пошлин, устаревшие редакции форм и несоответствия, которые обычно приводят к Requests for Evidence (RFE).',
    'Nuestro equipo revisa la petición para detectar firmas faltantes, montos de tarifa incorrectos, ediciones obsoletas del formulario e inconsistencias que suelen generar Requests for Evidence (RFE).');
add('Multilingual support',
    'Многоязычная поддержка',
    'Soporte multilingüe');
add('We assist clients in English, Russian, and Spanish, and coordinate certified translations for foreign-language civil documents required by USCIS.',
    'Помогаем клиентам на английском, русском и испанском, координируем сертифицированные переводы гражданских документов на иностранных языках, требуемых USCIS.',
    'Asistimos a clientes en inglés, ruso y español y coordinamos traducciones certificadas de documentos civiles en idiomas extranjeros requeridos por USCIS.');
add('Common questions about Form I-130',
    'Частые вопросы о форме I-130',
    'Preguntas frecuentes sobre el Formulario I-130');
add('What is Form I-130?',
    'Что такое форма I-130?',
    '¿Qué es el Formulario I-130?');
add('Form I-130, Petition for Alien Relative, is filed by a U.S. citizen or permanent resident to establish a qualifying family relationship with a foreign-national relative. It is the first step in the family-based immigration process and must be approved before the beneficiary can apply for an immigrant visa or adjustment of status.',
    'Форма I-130, Petition for Alien Relative, подаётся гражданином США или постоянным резидентом для подтверждения квалифицирующих семейных отношений с иностранным родственником. Это первый шаг в процессе семейной иммиграции, и она должна быть одобрена до того, как бенефициар сможет подать на иммиграционную визу или изменение статуса.',
    'El Formulario I-130, Petición para Familiar Extranjero, es presentado por un ciudadano estadounidense o residente permanente para establecer una relación familiar calificada con un familiar extranjero. Es el primer paso del proceso de inmigración familiar y debe aprobarse antes de que el beneficiario pueda solicitar una visa de inmigrante o ajuste de estatus.');
add('Who can file Form I-130?',
    'Кто может подать форму I-130?',
    '¿Quién puede presentar el Formulario I-130?');
add('U.S. citizens may petition for spouses, children, parents, and siblings. Lawful permanent residents may petition for spouses and unmarried children. The petitioner must demonstrate the financial ability to support the beneficiary.',
    'Граждане США могут ходатайствовать за супругов, детей, родителей и братьев/сестёр. Законные постоянные резиденты — за супругов и неженатых детей. Петиционер должен подтвердить финансовую возможность содержать бенефициара.',
    'Los ciudadanos estadounidenses pueden presentar petición por cónyuges, hijos, padres y hermanos. Los residentes permanentes legales por cónyuges e hijos solteros. El peticionario debe demostrar capacidad financiera para mantener al beneficiario.');
add('Key documents include proof of the petitioner\'s citizenship or LPR status, evidence of the qualifying family relationship (marriage or birth certificates), passport photos, and certified English translations of any foreign-language documents.',
    'Ключевые документы: подтверждение гражданства или статуса LPR петиционера, доказательства квалифицирующих семейных отношений (свидетельства о браке или рождении), фото на паспорт и сертифицированные переводы на английский любых документов на иностранном языке.',
    'Los documentos clave incluyen la prueba de ciudadanía o estatus LPR del peticionario, evidencia de la relación familiar calificada (actas de matrimonio o nacimiento), fotos de pasaporte y traducciones certificadas al inglés de cualquier documento en idioma extranjero.');
add('How long does the I-130 take?',
    'Сколько времени занимает I-130?',
    '¿Cuánto tarda el I-130?');
add('Processing times depend on the relationship category and country of origin. Immediate relatives of U.S. citizens generally experience shorter processing times, while preference categories may require years of waiting based on visa bulletin dates.',
    'Сроки обработки зависят от категории родства и страны происхождения. У ближайших родственников граждан США сроки обычно короче, тогда как преференциальные категории могут ждать годы в зависимости от дат Visa Bulletin.',
    'Los tiempos de procesamiento dependen de la categoría de relación y del país de origen. Los familiares inmediatos de ciudadanos estadounidenses suelen tener tiempos más cortos, mientras que las categorías de preferencia pueden requerir años según las fechas del Visa Bulletin.');
add('Ready to begin your I-130 petition?',
    'Готовы начать подачу I-130?',
    '¿Listo para comenzar su petición I-130?');

/* --- I-485 page --- */
add('Form I-485 — Adjustment of Status',
    'Форма I-485 — Изменение иммиграционного статуса',
    'Formulario I-485 — Ajuste de Estatus');
add('VitaCoreX prepares, organizes, and reviews your I-485 application package so your path to permanent residence starts with a complete, well-structured file. Available in English, Russian, and Spanish.',
    'VitaCoreX готовит, организует и проверяет пакет заявления I-485, чтобы ваш путь к постоянному резидентству начался с полного, хорошо структурированного файла. Доступно на английском, русском и испанском.',
    'VitaCoreX prepara, organiza y revisa su paquete de solicitud I-485 para que su camino a la residencia permanente comience con un expediente completo y bien estructurado. Disponible en inglés, ruso y español.');
add('Understanding the I-485',
    'Понимание формы I-485',
    'Entender el I-485');
add('What is Form I-485 and how does it work?',
    'Что такое форма I-485 и как она работает?',
    '¿Qué es el Formulario I-485 y cómo funciona?');
add('Purpose of adjustment of status',
    'Назначение процедуры изменения статуса',
    'Propósito del ajuste de estatus');
add('USCIS Form I-485 allows eligible individuals who are physically present in the United States to apply for lawful permanent resident status without leaving the country. Instead of returning to a home country for consular visa processing, qualified applicants submit I-485 to adjust their immigration status directly from within the U.S.',
    'Форма USCIS I-485 позволяет подходящим лицам, физически находящимся в США, подавать на статус законного постоянного резидента без выезда из страны. Вместо возвращения в страну проживания для консульской обработки квалифицированные заявители подают I-485, меняя иммиграционный статус прямо внутри США.',
    'El Formulario USCIS I-485 permite a personas elegibles que están físicamente presentes en Estados Unidos solicitar el estatus de residente permanente legal sin salir del país. En lugar de regresar al país de origen para procesamiento consular, los solicitantes calificados presentan el I-485 para ajustar su estatus migratorio directamente desde EE.UU.');
add('This form is used across multiple immigration categories including family-based, employment-based, diversity visa, asylee, and refugee adjustments. Upon approval, the applicant receives a green card granting permanent residence in the United States.',
    'Форма используется в нескольких иммиграционных категориях: семейной, трудовой, Diversity Visa, для лиц с убежищем и беженцев. После одобрения заявитель получает грин-карту, дающую постоянное проживание в США.',
    'Este formulario se usa en múltiples categorías migratorias, incluyendo familiar, basada en empleo, visa de diversidad, asilados y refugiados. Al aprobarse, el solicitante recibe la green card que otorga residencia permanente en Estados Unidos.');
add('Eligibility requirements',
    'Требования к праву на подачу',
    'Requisitos de elegibilidad');
add('Physical presence: The applicant must be in the United States at the time of filing.',
    'Физическое присутствие: на момент подачи заявитель должен находиться в США.',
    'Presencia física: el solicitante debe estar en Estados Unidos al momento de presentar.');
add('Lawful admission or parole: Most categories require that the applicant was inspected and admitted or paroled into the U.S.',
    'Законный въезд или parole: большинство категорий требуют, чтобы заявитель прошёл инспекцию и был допущен в США или находился по parole.',
    'Admisión legal o parole: la mayoría de las categorías requieren que el solicitante haya sido inspeccionado y admitido o ingresado bajo parole a EE.UU.');
add('Visa availability: An immigrant visa number must be immediately available based on the applicant\'s priority date and preference category.',
    'Доступность визы: иммиграционный визовый номер должен быть доступен немедленно на основании приоритетной даты и преференциальной категории заявителя.',
    'Disponibilidad de visa: debe haber un número de visa de inmigrante inmediatamente disponible según la fecha de prioridad y categoría de preferencia del solicitante.');
add('No disqualifying bars: Certain criminal, security, and immigration violations may bar adjustment eligibility.',
    'Отсутствие дисквалифицирующих оснований: некоторые уголовные, связанные с безопасностью и иммиграционные нарушения могут лишить права на изменение статуса.',
    'Sin impedimentos descalificantes: ciertas infracciones penales, de seguridad e inmigratorias pueden impedir la elegibilidad para el ajuste.');
add('Immediate relatives: Spouses, parents, and unmarried children under 21 of U.S. citizens do not face visa number limits.',
    'Ближайшие родственники: супруги, родители и неженатые дети до 21 года граждан США не сталкиваются с ограничениями по визовым номерам.',
    'Familiares inmediatos: cónyuges, padres e hijos solteros menores de 21 de ciudadanos estadounidenses no enfrentan límites de números de visa.');
add('Concurrent filing',
    'Одновременная подача',
    'Presentación simultánea');
add('Filing I-485 together with I-130',
    'Подача I-485 одновременно с I-130',
    'Presentar el I-485 junto con el I-130');
add('Immediate relatives of U.S. citizens may file Form I-485 at the same time as the underlying Form I-130 petition, rather than waiting months or years for the I-130 to be approved first. This approach, known as concurrent filing, can substantially reduce total processing time and allows applicants to request work authorization (EAD) and advance parole while the case is pending.',
    'Ближайшие родственники граждан США могут подавать форму I-485 одновременно с лежащим в основе ходатайством I-130, не дожидаясь месяцев или лет его одобрения. Этот подход, известный как concurrent filing, может существенно сократить общее время обработки и позволяет заявителям запросить разрешение на работу (EAD) и advance parole на время рассмотрения дела.',
    'Los familiares inmediatos de ciudadanos estadounidenses pueden presentar el Formulario I-485 al mismo tiempo que la petición base I-130, sin esperar meses o años a que el I-130 sea aprobado primero. Este enfoque, conocido como presentación simultánea, puede reducir sustancialmente el tiempo total de procesamiento y permite a los solicitantes pedir autorización de trabajo (EAD) y advance parole mientras el caso está pendiente.');
add('Companion forms',
    'Сопутствующие формы',
    'Formularios complementarios');
add('Form I-765: Application for Employment Authorization Document (EAD), allowing the applicant to work while the I-485 is pending.',
    'Форма I-765: заявление на Employment Authorization Document (EAD), позволяющее заявителю работать в период рассмотрения I-485.',
    'Formulario I-765: solicitud de Documento de Autorización de Empleo (EAD), que permite al solicitante trabajar mientras el I-485 está pendiente.');
add('Form I-131: Application for Advance Parole, permitting the applicant to travel abroad and return without abandoning the pending adjustment application.',
    'Форма I-131: заявление на Advance Parole, позволяющее заявителю выезжать за рубеж и возвращаться, не отказываясь от ожидающего рассмотрения заявления на изменение статуса.',
    'Formulario I-131: solicitud de Advance Parole, que permite al solicitante viajar al extranjero y regresar sin abandonar la solicitud de ajuste pendiente.');
add('Form I-693: Report of Medical Examination and Vaccination Record, completed by a USCIS-designated civil surgeon.',
    'Форма I-693: отчёт о медицинском осмотре и прививках, заполняемый civil surgeon, утверждённым USCIS.',
    'Formulario I-693: Informe de Examen Médico y Registro de Vacunación, completado por un civil surgeon designado por USCIS.');
add('Form I-864: Affidavit of Support from the petitioning sponsor, demonstrating financial ability to support the applicant.',
    'Форма I-864: Affidavit of Support от спонсора-петиционера, подтверждающий финансовую возможность содержать заявителя.',
    'Formulario I-864: Affidavit of Support del patrocinador peticionario, que demuestra la capacidad financiera de mantener al solicitante.');
add('Medical exam',
    'Медицинский осмотр',
    'Examen médico');
add('Immigration medical examination for the I-485',
    'Иммиграционный медицинский осмотр для I-485',
    'Examen médico de inmigración para el I-485');
add('What the exam includes',
    'Что включает осмотр',
    'Qué incluye el examen');
add('Every I-485 applicant must complete a medical examination performed by a USCIS-designated civil surgeon. The civil surgeon completes Form I-693, which is submitted as part of the I-485 filing package. The examination covers a physical evaluation, review of vaccination records, and any required laboratory tests including tuberculosis screening.',
    'Каждый заявитель I-485 должен пройти медицинский осмотр у civil surgeon, утверждённого USCIS. Civil surgeon заполняет форму I-693, которая подаётся в составе пакета I-485. Осмотр включает физическое обследование, проверку данных о прививках и необходимые лабораторные тесты, включая скрининг на туберкулёз.',
    'Cada solicitante de I-485 debe completar un examen médico realizado por un civil surgeon designado por USCIS. El civil surgeon completa el Formulario I-693, que se presenta como parte del paquete del I-485. El examen incluye evaluación física, revisión de registros de vacunación y cualquier prueba de laboratorio requerida, incluido el tamizaje de tuberculosis.');
add('The completed I-693 is valid for two years from the date of the civil surgeon\'s signature and must remain valid at the time of the adjustment interview or final adjudication.',
    'Заполненная I-693 действительна два года с даты подписи civil surgeon и должна оставаться действительной на момент интервью по изменению статуса или финального решения.',
    'El I-693 completado es válido por dos años desde la fecha de la firma del civil surgeon y debe permanecer vigente al momento de la entrevista de ajuste o adjudicación final.');
add('Vaccination requirements',
    'Требования к прививкам',
    'Requisitos de vacunación');
add('Applicants must show proof of vaccination against diseases required by USCIS, including mumps, measles, rubella, polio, tetanus, diphtheria, pertussis, hepatitis A and B, influenza, and COVID-19 (subject to current policy).',
    'Заявители должны предоставить доказательства прививок от заболеваний, требуемых USCIS: паротит, корь, краснуха, полиомиелит, столбняк, дифтерия, коклюш, гепатит A и B, грипп и COVID-19 (по действующим правилам).',
    'Los solicitantes deben mostrar prueba de vacunación contra las enfermedades requeridas por USCIS, incluidas paperas, sarampión, rubéola, polio, tétanos, difteria, tos ferina, hepatitis A y B, influenza y COVID-19 (sujeto a la política vigente).');
add('If vaccination records are unavailable, the civil surgeon may administer required vaccines during the exam.',
    'Если записи о прививках отсутствуют, civil surgeon может сделать необходимые прививки во время осмотра.',
    'Si no se dispone de registros de vacunación, el civil surgeon puede administrar las vacunas requeridas durante el examen.');
add('Waivers may be available on religious or medical grounds for certain vaccinations.',
    'По религиозным или медицинским основаниям могут применяться исключения для отдельных прививок.',
    'Pueden existir exenciones por motivos religiosos o médicos para ciertas vacunas.');
add('VitaCoreX helps clients compile vaccination records and understand what to bring to the civil surgeon appointment.',
    'VitaCoreX помогает клиентам собрать записи о прививках и подготовить перечень того, что взять на приём к civil surgeon.',
    'VitaCoreX ayuda a los clientes a compilar registros de vacunación y entender qué llevar a la cita con el civil surgeon.');
add('Structured document preparation for your I-485 case',
    'Структурированная подготовка документов для вашего дела I-485',
    'Preparación documental estructurada para su caso I-485');
add('VitaCoreX organizes your complete adjustment-of-status package, reviews companion forms, and ensures every document and exhibit is accounted for. Services available in English, Russian, and Spanish.',
    'VitaCoreX собирает полный пакет изменения статуса, проверяет сопутствующие формы и следит, чтобы все документы и приложения были учтены. Услуги на английском, русском и испанском.',
    'VitaCoreX organiza su paquete completo de ajuste de estatus, revisa los formularios complementarios y asegura que cada documento y anexo esté contabilizado. Servicios disponibles en inglés, ruso y español.');
add('Full package assembly',
    'Сборка полного пакета',
    'Armado del paquete completo');
add('We compile and organize the I-485 along with companion forms (I-765, I-131, I-864, I-693 envelope), supporting evidence, and a detailed document index for a structured USCIS submission.',
    'Собираем и упорядочиваем I-485 вместе с сопутствующими формами (I-765, I-131, I-864, конверт I-693), подтверждающими доказательствами и подробным индексом документов для структурированной подачи в USCIS.',
    'Compilamos y organizamos el I-485 junto con los formularios complementarios (I-765, I-131, I-864, sobre del I-693), evidencia de respaldo y un índice documental detallado para una presentación estructurada ante USCIS.');
add('Concurrent filing coordination',
    'Координация одновременной подачи',
    'Coordinación de presentación simultánea');
add('For immediate relatives of U.S. citizens, we organize the I-130 and I-485 for simultaneous submission along with work permit and travel document applications to maximize efficiency.',
    'Для ближайших родственников граждан США мы организуем одновременную подачу I-130 и I-485 вместе с заявлениями на разрешение на работу и проездные документы — ради максимальной эффективности.',
    'Para familiares inmediatos de ciudadanos estadounidenses, organizamos el I-130 y el I-485 para presentación simultánea junto con las solicitudes de permiso de trabajo y documentos de viaje, maximizando la eficiencia.');
add('Interview preparation support',
    'Поддержка подготовки к интервью',
    'Apoyo de preparación para la entrevista');
add('We prepare clients with a document review checklist for the USCIS adjustment interview, organize the evidence binder, and provide a timeline of what to expect at the field office appointment.',
    'Готовим клиентов с чек-листом проверки документов для интервью USCIS по изменению статуса, организуем папку доказательств и предоставляем таймлайн того, что ожидать на приёме в field office.',
    'Preparamos a los clientes con una lista de verificación para la entrevista de ajuste de USCIS, organizamos la carpeta de evidencia y proporcionamos un cronograma de lo que pueden esperar en la cita de la oficina local.');
add('Common questions about Form I-485',
    'Частые вопросы о форме I-485',
    'Preguntas frecuentes sobre el Formulario I-485');
add('What is Form I-485?',
    'Что такое форма I-485?',
    '¿Qué es el Formulario I-485?');
add('Form I-485 is the application used to adjust immigration status to lawful permanent resident (green card holder) from within the United States. It eliminates the need for consular processing abroad for eligible applicants.',
    'Форма I-485 — заявление на изменение иммиграционного статуса на статус законного постоянного резидента (обладатель грин-карты) изнутри США. Она избавляет подходящих заявителей от необходимости консульской обработки за рубежом.',
    'El Formulario I-485 es la solicitud que se usa para ajustar el estatus migratorio a residente permanente legal (titular de green card) desde dentro de Estados Unidos. Elimina la necesidad de procesamiento consular en el extranjero para los solicitantes elegibles.');
add('Who is eligible to file?',
    'Кто имеет право подавать?',
    '¿Quién es elegible para presentar?');
add('Eligibility generally requires physical presence in the U.S., lawful admission or parole, an available immigrant visa number, and no disqualifying bars. Immediate relatives of U.S. citizens have the most straightforward path.',
    'Как правило, требуются физическое присутствие в США, законный въезд или parole, доступный иммиграционный визовый номер и отсутствие дисквалифицирующих оснований. Ближайшие родственники граждан США имеют наиболее прямой путь.',
    'La elegibilidad generalmente requiere presencia física en EE.UU., admisión legal o parole, un número de visa de inmigrante disponible y la ausencia de impedimentos descalificantes. Los familiares inmediatos de ciudadanos estadounidenses tienen la ruta más directa.');
add('Concurrent filing allows immediate relatives of U.S. citizens to submit Form I-485 simultaneously with Form I-130, reducing total processing time and enabling earlier access to work authorization and travel documents.',
    'Concurrent filing позволяет ближайшим родственникам граждан США подавать форму I-485 одновременно с I-130, сокращая общее время обработки и давая более ранний доступ к разрешению на работу и проездным документам.',
    'La presentación simultánea permite a los familiares inmediatos de ciudadanos estadounidenses enviar el Formulario I-485 junto con el Formulario I-130, reduciendo el tiempo total de procesamiento y permitiendo acceso más temprano a la autorización de trabajo y documentos de viaje.');
add('Is a medical exam required?',
    'Требуется ли медицинский осмотр?',
    '¿Se requiere examen médico?');
add('Yes. All I-485 applicants must complete Form I-693, a medical examination conducted by a USCIS-designated civil surgeon. The exam covers physical health, vaccinations, and required lab work.',
    'Да. Все заявители I-485 должны заполнить форму I-693 — медицинский осмотр, проводимый civil surgeon, утверждённым USCIS. Осмотр охватывает физическое здоровье, прививки и необходимые лабораторные анализы.',
    'Sí. Todos los solicitantes de I-485 deben completar el Formulario I-693, un examen médico realizado por un civil surgeon designado por USCIS. El examen cubre salud física, vacunaciones y pruebas de laboratorio requeridas.');
add('Ready to begin your adjustment of status?',
    'Готовы начать изменение статуса?',
    '¿Listo para comenzar su ajuste de estatus?');

/* --- N-400 page --- */
add('Form N-400 — Application for Naturalization',
    'Форма N-400 — Заявление на натурализацию',
    'Formulario N-400 — Solicitud de Naturalización');
add('VitaCoreX prepares your N-400 application package, organizes supporting documents, and helps you prepare for the citizenship interview and civics test. Available in English, Russian, and Spanish.',
    'VitaCoreX готовит ваш пакет N-400, собирает подтверждающие документы и помогает подготовиться к интервью на гражданство и civics-тесту. Доступно на английском, русском и испанском.',
    'VitaCoreX prepara su paquete de solicitud N-400, organiza los documentos de respaldo y le ayuda a prepararse para la entrevista de ciudadanía y el examen de civismo. Disponible en inglés, ruso y español.');
add('Understanding the N-400',
    'Понимание формы N-400',
    'Entender el N-400');
add('What is Form N-400 and who qualifies?',
    'Что такое форма N-400 и кто имеет право?',
    '¿Qué es el Formulario N-400 y quién califica?');
add('Purpose of the N-400',
    'Назначение формы N-400',
    'Propósito del N-400');
add('USCIS Form N-400 is the application used by lawful permanent residents to apply for U.S. citizenship through the naturalization process. It is the final step in the immigration journey, granting the applicant full rights as a United States citizen including the right to vote, hold public office, and obtain a U.S. passport.',
    'Форма USCIS N-400 — заявление, которое законные постоянные резиденты используют для получения гражданства США через процесс натурализации. Это финальный шаг иммиграционного пути, дающий заявителю полные права гражданина США, включая право голосовать, занимать государственные должности и получать паспорт США.',
    'El Formulario USCIS N-400 es la solicitud que usan los residentes permanentes legales para obtener la ciudadanía estadounidense mediante el proceso de naturalización. Es el último paso del recorrido migratorio y otorga al solicitante plenos derechos como ciudadano de Estados Unidos, incluidos el derecho a votar, ocupar cargos públicos y obtener pasaporte estadounidense.');
add('The application covers personal history, travel records, employment, moral character, and willingness to take the Oath of Allegiance. Once submitted, the applicant is scheduled for a biometrics appointment and then a naturalization interview.',
    'Заявление охватывает личную историю, записи о поездках, трудоустройство, моральный облик и готовность принять Oath of Allegiance. После подачи заявителя записывают на биометрию, затем на интервью по натурализации.',
    'La solicitud cubre historial personal, registros de viajes, empleo, carácter moral y disposición a prestar el Juramento de Lealtad. Una vez presentada, al solicitante se le programa una cita de biometría y luego una entrevista de naturalización.');
add('Eligibility pathways',
    'Пути приобретения права',
    'Rutas de elegibilidad');
add('5-year rule: Lawful permanent residents who have held a green card for at least 5 years, with continuous residence and at least 30 months of physical presence in the U.S. during that period.',
    'Правило 5 лет: законные постоянные резиденты с грин-картой не менее 5 лет, с непрерывным проживанием и не менее 30 месяцев физического присутствия в США за этот период.',
    'Regla de 5 años: residentes permanentes legales con green card por al menos 5 años, con residencia continua y al menos 30 meses de presencia física en EE.UU. durante ese período.');
add('3-year spouse rule: LPRs married to and living with a U.S. citizen for at least 3 years, with continuous residence and at least 18 months of physical presence.',
    'Правило 3 лет для супругов: LPR, состоящие в браке и проживающие с гражданином США не менее 3 лет, с непрерывным проживанием и не менее 18 месяцев физического присутствия.',
    'Regla de 3 años por cónyuge: LPR casados y conviviendo con un ciudadano estadounidense por al menos 3 años, con residencia continua y al menos 18 meses de presencia física.');
add('Military service: Current or former members of the U.S. armed forces may qualify under expedited naturalization provisions.',
    'Военная служба: действующие или бывшие военнослужащие США могут подпадать под ускоренную натурализацию.',
    'Servicio militar: miembros actuales o anteriores de las fuerzas armadas de EE.UU. pueden calificar bajo disposiciones de naturalización expedita.');
add('Age and language: Applicants must be at least 18 years old. Certain applicants over 50 or 55 with long-term residency may qualify for language exemptions.',
    'Возраст и язык: заявителю должно быть не менее 18 лет. Некоторые заявители старше 50 или 55 с долгосрочным резидентством могут быть освобождены от языкового требования.',
    'Edad e idioma: los solicitantes deben tener al menos 18 años. Ciertos solicitantes mayores de 50 o 55 años con residencia prolongada pueden calificar para exenciones de idioma.');
add('Good moral character: Applicants must demonstrate good moral character for the statutory period prior to filing.',
    'Добропорядочность: заявитель должен подтвердить good moral character за установленный законом период до подачи.',
    'Buen carácter moral: los solicitantes deben demostrar buen carácter moral durante el período legal previo a la presentación.');
add('Required documents',
    'Необходимые документы',
    'Documentos requeridos');
add('What you need for your N-400 application',
    'Что понадобится для заявления N-400',
    'Qué necesita para su solicitud N-400');
add('Identity and status',
    'Личность и статус',
    'Identidad y estatus');
add('Copy of green card (front and back)',
    'Копия грин-карты (обе стороны)',
    'Copia de la green card (ambos lados)');
add('Valid government-issued photo ID',
    'Действительное удостоверение личности с фото',
    'Identificación oficial con foto vigente');
add('Travel documents and passport pages showing entries and exits',
    'Проездные документы и страницы паспорта со штампами въезда и выезда',
    'Documentos de viaje y páginas del pasaporte que muestren entradas y salidas');
add('Personal history',
    'Личная история',
    'Historial personal');
add('Tax returns for the past 5 years (or 3 years for spouse-based filing)',
    'Налоговые декларации за последние 5 лет (или 3 года для подачи через супруга)',
    'Declaraciones de impuestos de los últimos 5 años (o 3 años para presentación por cónyuge)');
add('Complete travel history with dates of all trips outside the U.S.',
    'Полная история поездок с датами всех выездов за пределы США',
    'Historial completo de viajes con fechas de todos los viajes fuera de EE.UU.');
add('Employment history for the past 5 years',
    'История трудоустройства за последние 5 лет',
    'Historial laboral de los últimos 5 años');
add('Residential address history for the past 5 years',
    'История адресов проживания за последние 5 лет',
    'Historial de direcciones de residencia de los últimos 5 años');
add('Additional evidence',
    'Дополнительные доказательства',
    'Evidencia adicional');
add('Marriage certificate (if applying under the 3-year spouse rule)',
    'Свидетельство о браке (при подаче по правилу 3 лет через супруга)',
    'Acta de matrimonio (si aplica la regla de 3 años por cónyuge)');
add('Court records for any arrests, citations, or criminal history',
    'Судебные документы по арестам, штрафам или судимостям',
    'Registros judiciales de cualquier arresto, citación o antecedente penal');
add('Citizenship interview',
    'Интервью на гражданство',
    'Entrevista de ciudadanía');
add('What to expect at the naturalization interview',
    'Чего ожидать на интервью по натурализации',
    'Qué esperar en la entrevista de naturalización');
add('Interview structure',
    'Структура интервью',
    'Estructura de la entrevista');
add('The naturalization interview is conducted by a USCIS officer at your local field office. The officer will place you under oath and review every question on your N-400 application to verify accuracy. You will be asked to confirm your answers, and any changes or corrections will be noted on the record.',
    'Интервью по натурализации проводит офицер USCIS в местном field office. Офицер приводит вас к присяге и проходит все вопросы вашего заявления N-400, проверяя точность. Вас попросят подтвердить ответы; любые изменения или корректировки фиксируются в протоколе.',
    'La entrevista de naturalización la realiza un oficial de USCIS en su oficina local. El oficial le tomará juramento y revisará cada pregunta de su solicitud N-400 para verificar su exactitud. Se le pedirá confirmar sus respuestas, y cualquier cambio o corrección quedará registrado.');
add('The interview also includes an English language test with three components: reading (you must read one sentence correctly out of three attempts), writing (you must write one sentence correctly out of three attempts), and speaking (evaluated throughout the interview conversation).',
    'Интервью также включает тест по английскому из трёх частей: чтение (нужно правильно прочитать одно предложение из трёх попыток), письмо (правильно написать одно предложение из трёх попыток) и устная речь (оценивается в ходе разговора на интервью).',
    'La entrevista también incluye un examen de inglés con tres componentes: lectura (debe leer correctamente una oración en tres intentos), escritura (debe escribir correctamente una oración en tres intentos) y conversación (evaluada durante toda la entrevista).');
add('Civics test preparation',
    'Подготовка к civics-тесту',
    'Preparación del examen de civismo');
add('The civics test covers 100 possible questions about U.S. history, government structure, and civic principles.',
    'Civics-тест охватывает 100 возможных вопросов об истории США, структуре правительства и принципах гражданского устройства.',
    'El examen de civismo cubre 100 preguntas posibles sobre historia de EE.UU., estructura del gobierno y principios cívicos.');
add('During the interview, the officer asks up to 10 questions. You must answer at least 6 correctly to pass.',
    'Во время интервью офицер задаёт до 10 вопросов. Нужно правильно ответить минимум на 6, чтобы сдать.',
    'Durante la entrevista, el oficial hace hasta 10 preguntas. Debe responder correctamente al menos 6 para aprobar.');
add('Topics include the Constitution, branches of government, rights and freedoms, U.S. history, and geography.',
    'Темы: Конституция, ветви власти, права и свободы, история США и география.',
    'Los temas incluyen la Constitución, ramas del gobierno, derechos y libertades, historia de EE.UU. y geografía.');
add('Applicants 65 years or older with 20+ years of permanent residence qualify for a simplified version of the test (20 designated questions).',
    'Заявители от 65 лет с 20+ годами постоянного резидентства имеют право на упрощённый тест (20 определённых вопросов).',
    'Los solicitantes de 65 años o más con 20+ años de residencia permanente califican para una versión simplificada del examen (20 preguntas designadas).');
add('VitaCoreX provides civics study materials and practice question sessions in English, Russian, and Spanish to help applicants prepare.',
    'VitaCoreX предоставляет учебные материалы по civics и сессии тренировочных вопросов на английском, русском и испанском для помощи в подготовке.',
    'VitaCoreX proporciona materiales de estudio de civismo y sesiones de preguntas de práctica en inglés, ruso y español para ayudar a los solicitantes a prepararse.');
add('Structured support for your naturalization application',
    'Структурированная поддержка вашего заявления на натурализацию',
    'Apoyo estructurado para su solicitud de naturalización');
add('VitaCoreX organizes your complete N-400 package, reviews your application for common errors, and helps you prepare for the citizenship interview. Services available in English, Russian, and Spanish.',
    'VitaCoreX собирает полный пакет N-400, проверяет заявление на типичные ошибки и помогает подготовиться к интервью на гражданство. Услуги на английском, русском и испанском.',
    'VitaCoreX organiza su paquete completo de N-400, revisa la solicitud en busca de errores comunes y le ayuda a prepararse para la entrevista de ciudadanía. Servicios disponibles en inglés, ruso y español.');
add('Application assembly',
    'Сборка заявления',
    'Armado de la solicitud');
add('We compile and organize your N-400 form, supporting documents, photographs, and evidence into a structured filing package with a document index and cover letter for USCIS review.',
    'Собираем и упорядочиваем вашу форму N-400, подтверждающие документы, фото и доказательства в структурированный пакет с индексом документов и сопроводительным письмом для USCIS.',
    'Compilamos y organizamos su formulario N-400, documentos de respaldo, fotografías y evidencia en un paquete estructurado con índice documental y carta de presentación para la revisión de USCIS.');
add('Travel and residency audit',
    'Аудит поездок и резидентства',
    'Auditoría de viajes y residencia');
add('We review your travel history, residency timeline, and physical presence calculations to identify any gaps or issues that could affect your continuous residence or physical presence requirements.',
    'Мы проверяем вашу историю поездок, таймлайн резидентства и расчёт физического присутствия, выявляя пробелы или проблемы, способные повлиять на требования о непрерывном проживании или физическом присутствии.',
    'Revisamos su historial de viajes, línea de tiempo de residencia y cálculos de presencia física para identificar cualquier brecha o problema que pueda afectar los requisitos de residencia continua o presencia física.');
add('Interview preparation',
    'Подготовка к интервью',
    'Preparación para la entrevista');
add('We provide civics study materials, practice question sessions, and a walkthrough of the interview process so applicants know what to expect. Preparation available in English, Russian, and Spanish.',
    'Предоставляем учебные материалы по civics, сессии тренировочных вопросов и прохождение процедуры интервью шаг за шагом, чтобы заявитель знал, чего ожидать. Подготовка — на английском, русском и испанском.',
    'Proporcionamos materiales de estudio de civismo, sesiones de preguntas de práctica y un recorrido por el proceso de entrevista para que los solicitantes sepan qué esperar. Preparación disponible en inglés, ruso y español.');
add('Common questions about Form N-400',
    'Частые вопросы о форме N-400',
    'Preguntas frecuentes sobre el Formulario N-400');
add('What is Form N-400?',
    'Что такое форма N-400?',
    '¿Qué es el Formulario N-400?');
add('Form N-400 is the application for U.S. citizenship through naturalization. Lawful permanent residents who meet residency, physical presence, and good moral character requirements use this form to begin the process of becoming a U.S. citizen.',
    'Форма N-400 — заявление на гражданство США через натурализацию. Законные постоянные резиденты, отвечающие требованиям к резидентству, физическому присутствию и good moral character, используют эту форму для начала процесса получения гражданства США.',
    'El Formulario N-400 es la solicitud de ciudadanía estadounidense mediante naturalización. Los residentes permanentes legales que cumplen los requisitos de residencia, presencia física y buen carácter moral usan este formulario para iniciar el proceso de convertirse en ciudadano estadounidense.');
add('What are the eligibility requirements?',
    'Каковы требования к праву на подачу?',
    '¿Cuáles son los requisitos de elegibilidad?');
add('General requirements include holding a green card for 5 years (or 3 years if married to a U.S. citizen), continuous U.S. residence, physical presence for at least 30 months (or 18 months for the 3-year rule), being at least 18, and demonstrating good moral character.',
    'Общие требования: владение грин-картой 5 лет (или 3 года при браке с гражданином США), непрерывное проживание в США, физическое присутствие не менее 30 месяцев (или 18 месяцев для правила 3 лет), возраст от 18 лет и подтверждённый good moral character.',
    'Los requisitos generales incluyen tener green card por 5 años (o 3 años si está casado con ciudadano estadounidense), residencia continua en EE.UU., presencia física de al menos 30 meses (o 18 meses para la regla de 3 años), tener al menos 18 años y demostrar buen carácter moral.');
add('Key documents include your green card copy, passport photos, tax returns for the past 5 years, complete travel records, employment and address history, and any marriage, divorce, or court records. Foreign-language documents require certified translations.',
    'Ключевые документы: копия грин-карты, фото на паспорт, налоговые декларации за последние 5 лет, полные данные о поездках, история трудоустройства и адресов, а также любые брачные, разводные или судебные документы. Документы на иностранных языках требуют сертифицированных переводов.',
    'Los documentos clave incluyen copia de su green card, fotos de pasaporte, declaraciones de impuestos de los últimos 5 años, registros completos de viajes, historial laboral y de direcciones, y cualquier acta de matrimonio, divorcio o registro judicial. Los documentos en idioma extranjero requieren traducciones certificadas.');
add('What happens at the interview?',
    'Что происходит на интервью?',
    '¿Qué sucede en la entrevista?');
add('A USCIS officer reviews your application under oath, tests your English reading, writing, and speaking abilities, and administers a civics test. You must correctly answer 6 out of 10 questions on U.S. history and government to pass.',
    'Офицер USCIS разбирает ваше заявление под присягой, проверяет ваше чтение, письмо и устную речь на английском и проводит civics-тест. Нужно правильно ответить на 6 из 10 вопросов по истории и государственному устройству США, чтобы пройти.',
    'Un oficial de USCIS revisa su solicitud bajo juramento, evalúa sus habilidades de lectura, escritura y conversación en inglés y administra un examen de civismo. Debe responder correctamente 6 de 10 preguntas sobre historia y gobierno de EE.UU. para aprobar.');
add('Ready to begin your path to U.S. citizenship?',
    'Готовы начать путь к гражданству США?',
    '¿Listo para comenzar su camino a la ciudadanía estadounidense?');

/* --- immigration-services-tampa.html --- */
add('Phone: (888) 794-8292',
    'Телефон: (888) 794-8292',
    'Teléfono: (888) 794-8292');
add('Tampa, Florida',
    'Тампа, Флорида',
    'Tampa, Florida');
add('Immigration Document Preparation in Tampa, FL',
    'Подготовка иммиграционных документов в Тампе, Флорида',
    'Preparación de Documentos de Inmigración en Tampa, FL');
add('VitaCoreX LLC provides immigration document preparation and packet organization for individuals and families in the Tampa Bay area. We help you assemble, organize, and review USCIS form packets so your filing is complete, properly ordered, and ready for submission. Our team works in English, Russian, and Spanish to serve Tampa\'s diverse immigrant communities.',
    'VitaCoreX LLC готовит иммиграционные документы и организует пакеты для частных лиц и семей в регионе Тампа-Бей. Мы помогаем собрать, упорядочить и проверить пакеты форм USCIS — чтобы ваша подача была полной, правильно структурированной и готовой к отправке. Наша команда работает на английском, русском и испанском, обслуживая разнообразные иммигрантские сообщества Тампы.',
    'VitaCoreX LLC proporciona preparación de documentos de inmigración y organización de paquetes para personas y familias en el área de Tampa Bay. Le ayudamos a ensamblar, organizar y revisar los paquetes de formularios USCIS para que su presentación esté completa, debidamente ordenada y lista para enviar. Nuestro equipo trabaja en inglés, ruso y español para atender a las diversas comunidades inmigrantes de Tampa.');
add('Important: VitaCoreX is not a law firm and does not provide legal advice or legal representation. We provide document preparation and organizational support. For legal strategy, consult a licensed immigration attorney.',
    'Важно: VitaCoreX не является юридической фирмой и не оказывает юридических консультаций или представительства. Мы предоставляем услуги по подготовке и организации документов. За юридической стратегией обращайтесь к лицензированному иммиграционному адвокату.',
    'Importante: VitaCoreX no es una firma de abogados y no ofrece asesoría legal ni representación. Proporcionamos preparación de documentos y apoyo organizacional. Para estrategia legal, consulte a un abogado de inmigración licenciado.');
add('USCIS Form Packets We Prepare',
    'Пакеты форм USCIS, которые мы готовим',
    'Paquetes de Formularios USCIS que Preparamos');
add('I-130: Petition for Alien Relative',
    'I-130: Ходатайство о родственнике-иностранце',
    'I-130: Petición para Familiar Extranjero');
add('Family-based immigration starts with the I-130 petition. We help Tampa families organize the supporting documentation: proof of relationship, civil documents, financial evidence, and the cover letter that presents your case clearly. Whether you are petitioning for a spouse, parent, or child, we ensure every required attachment is included and properly ordered before submission to the USCIS lockbox or local field office.',
    'Семейная иммиграция начинается с ходатайства I-130. Мы помогаем семьям Тампы организовать подтверждающие материалы: доказательства родства, гражданские документы, финансовые доказательства и сопроводительное письмо, чётко представляющее дело. Независимо от того, ходатайствуете вы за супруга, родителя или ребёнка, мы обеспечим наличие и правильный порядок всех обязательных приложений до отправки в USCIS lockbox или местное field office.',
    'La inmigración familiar comienza con la petición I-130. Ayudamos a las familias de Tampa a organizar la documentación de respaldo: pruebas de relación, documentos civiles, evidencia financiera y la carta de presentación que expone claramente su caso. Ya sea que presente petición por cónyuge, padre o hijo, aseguramos que cada anexo requerido esté incluido y debidamente ordenado antes del envío al lockbox de USCIS o a la oficina local.');
add('I-485: Adjustment of Status',
    'I-485: Изменение иммиграционного статуса',
    'I-485: Ajuste de Estatus');
add('The I-485 application to adjust status to lawful permanent resident involves extensive documentation: medical examination records (Form I-693), affidavit of support (I-864), employment verification, tax transcripts, and civil documents. We organize these materials into a complete filing packet with proper tabbing, exhibit labels, and a cover sheet that maps every attachment to the corresponding form field.',
    'Заявление I-485 на изменение статуса до законного постоянного резидента требует обширной документации: данных медосмотра (форма I-693), аффидевита поддержки (I-864), подтверждения трудоустройства, налоговых транскриптов и гражданских документов. Мы собираем эти материалы в полный пакет с правильными закладками, маркировкой приложений и cover sheet, сопоставляющей каждое приложение с соответствующим полем формы.',
    'La solicitud I-485 para ajustar el estatus a residente permanente legal implica documentación extensa: registros de examen médico (Formulario I-693), affidavit of support (I-864), verificación de empleo, transcripciones fiscales y documentos civiles. Organizamos estos materiales en un paquete completo con pestañas adecuadas, etiquetas de anexos y una hoja de cubierta que relaciona cada anexo con el campo correspondiente del formulario.');
add('I-765: Employment Authorization',
    'I-765: Разрешение на трудоустройство',
    'I-765: Autorización de Empleo');
add('Work permit applications filed concurrently with I-485 or independently require supporting photographs, identity documents, and category-specific evidence. We prepare the I-765 packet with correctly formatted photos, proper category selection documentation, and any required fee documentation to avoid processing delays from incomplete filings.',
    'Заявления на разрешение на работу, поданные одновременно с I-485 или отдельно, требуют фотографий, документов личности и доказательств, соответствующих категории. Мы готовим пакет I-765 с корректно отформатированными фото, документами выбора правильной категории и любой необходимой документацией по пошлинам — чтобы избежать задержек из-за неполной подачи.',
    'Las solicitudes de permiso de trabajo presentadas junto con el I-485 o por separado requieren fotografías de respaldo, documentos de identidad y evidencia específica de categoría. Preparamos el paquete I-765 con fotos correctamente formateadas, documentación de selección de categoría adecuada y cualquier documentación de tarifa requerida para evitar retrasos por presentaciones incompletas.');
add('K-1: Fiance(e) Visa Packet',
    'K-1: Пакет визы для жениха/невесты',
    'K-1: Paquete de Visa de Prometido(a)');
add('The K-1 fiance(e) visa petition requires proof of a genuine relationship including photographs, communication records, travel evidence, and meeting documentation. We organize these materials into a structured evidence binder that presents the relationship timeline clearly, alongside the required USCIS forms, police clearances, and medical documentation that must accompany the petition.',
    'Ходатайство на визу K-1 требует доказательств подлинности отношений: фотографий, записей общения, доказательств поездок и документов о встречах. Мы собираем эти материалы в структурированную папку доказательств, ясно отражающую таймлайн отношений, вместе с необходимыми формами USCIS, полицейскими справками и медицинской документацией, которая должна сопровождать ходатайство.',
    'La petición de visa K-1 de prometido(a) requiere prueba de una relación genuina, incluyendo fotografías, registros de comunicación, evidencia de viajes y documentación de encuentros. Organizamos estos materiales en una carpeta de evidencia estructurada que presenta claramente la cronología de la relación, junto con los formularios USCIS requeridos, antecedentes policiales y documentación médica que deben acompañar la petición.');
add('N-400: Naturalization Application',
    'N-400: Заявление на натурализацию',
    'N-400: Solicitud de Naturalización');
add('Citizenship applicants must document their continuous residence, physical presence, tax compliance, and good moral character over the statutory period. We prepare the N-400 packet with organized travel records, tax return copies, address history verification, and any supplemental documentation required for applicants with prior immigration violations, criminal history, or extended absences from the United States.',
    'Заявители на гражданство должны задокументировать непрерывное проживание, физическое присутствие, соблюдение налогового законодательства и good moral character за установленный законом период. Мы готовим пакет N-400 с упорядоченными данными о поездках, копиями налоговых деклараций, подтверждением истории адресов и любой дополнительной документацией для заявителей с прошлыми иммиграционными нарушениями, судимостями или продолжительными отсутствиями в США.',
    'Los solicitantes de ciudadanía deben documentar su residencia continua, presencia física, cumplimiento fiscal y buen carácter moral durante el período legal. Preparamos el paquete N-400 con registros de viajes organizados, copias de declaraciones fiscales, verificación del historial de direcciones y cualquier documentación suplementaria requerida para solicitantes con infracciones migratorias previas, antecedentes penales o ausencias prolongadas de EE.UU.');
add('Additional Filings',
    'Дополнительные подачи',
    'Presentaciones Adicionales');
add('We also prepare document packets for I-131 (Advance Parole), I-751 (Removal of Conditions), I-90 (Green Card Renewal), asylum applications, DACA renewals, and TPS re-registration. Each packet is organized with a table of contents, tabbed exhibits, and a checklist confirming all required elements are present.',
    'Мы также готовим пакеты документов для I-131 (Advance Parole), I-751 (снятие условий), I-90 (продление грин-карты), заявлений на убежище, продлений DACA и повторной регистрации TPS. Каждый пакет содержит оглавление, пронумерованные приложения и чек-лист, подтверждающий наличие всех обязательных элементов.',
    'También preparamos paquetes de documentos para I-131 (Advance Parole), I-751 (Eliminación de Condiciones), I-90 (Renovación de Green Card), solicitudes de asilo, renovaciones de DACA y re-registro de TPS. Cada paquete se organiza con tabla de contenido, anexos con pestañas y una lista de verificación que confirma la presencia de todos los elementos requeridos.');
add('Serving Tampa\'s Immigrant Communities',
    'Обслуживаем иммигрантские сообщества Тампы',
    'Atendiendo a las Comunidades Inmigrantes de Tampa');
add('Russian-Speaking Families',
    'Русскоязычные семьи',
    'Familias de Habla Rusa');
add('Spanish-Speaking Families',
    'Испаноязычные семьи',
    'Familias de Habla Hispana');
add('Hillsborough County\'s Hispanic population represents a substantial portion of Tampa\'s residents, with communities from Mexico, Colombia, Venezuela, Cuba, Puerto Rico, and Central America. Immigration filings for Spanish-speaking families often involve coordinating documents from multiple countries with different civil registration systems. We provide Spanish-language guidance on document requirements, help obtain apostilles and certified translations, and organize packets that present international civil documents in the format USCIS adjudicators expect.',
    'Hispanic-население округа Hillsborough — значительная часть жителей Тампы, с общинами из Мексики, Колумбии, Венесуэлы, Кубы, Пуэрто-Рико и Центральной Америки. Иммиграционные подачи для испаноязычных семей часто включают координацию документов из нескольких стран с разными системами гражданской регистрации. Мы даём консультации на испанском по требованиям к документам, помогаем получить apostille и сертифицированные переводы и собираем пакеты, представляющие международные гражданские документы в формате, ожидаемом офицерами USCIS.',
    'La población hispana del condado de Hillsborough representa una parte sustancial de los residentes de Tampa, con comunidades de México, Colombia, Venezuela, Cuba, Puerto Rico y Centroamérica. Las presentaciones migratorias para familias hispanohablantes suelen implicar coordinar documentos de múltiples países con distintos sistemas de registro civil. Ofrecemos orientación en español sobre requisitos documentales, ayudamos a obtener apostillas y traducciones certificadas, y organizamos paquetes que presentan documentos civiles internacionales en el formato que esperan los adjudicadores de USCIS.');
add('How Our Document Preparation Works',
    'Как работает наша подготовка документов',
    'Cómo Funciona Nuestra Preparación de Documentos');
add('Initial review: We review your current documents and identify what is missing, what needs translation, and what additional evidence should be gathered.',
    'Начальная проверка: мы анализируем ваши текущие документы и определяем, чего не хватает, что нужно перевести и какие дополнительные доказательства стоит собрать.',
    'Revisión inicial: revisamos sus documentos actuales e identificamos qué falta, qué requiere traducción y qué evidencia adicional debe recopilarse.');
add('Document collection: We provide a checklist of required documents specific to your filing type and help you obtain certified translations, apostilles, and supporting evidence.',
    'Сбор документов: предоставляем чек-лист обязательных документов для вашего типа подачи и помогаем получить сертифицированные переводы, apostille и подтверждающие доказательства.',
    'Recolección de documentos: proporcionamos una lista de verificación de documentos requeridos específicos para su tipo de presentación y ayudamos a obtener traducciones certificadas, apostillas y evidencia de respaldo.');
add('Packet assembly: We organize your complete filing into a structured packet with a table of contents, tabbed exhibits, cover letters, and form-field cross-references.',
    'Сборка пакета: организуем вашу полную подачу в структурированный пакет с оглавлением, пронумерованными приложениями, сопроводительными письмами и перекрёстными ссылками на поля форм.',
    'Ensamblado del paquete: organizamos su presentación completa en un paquete estructurado con tabla de contenido, anexos con pestañas, cartas de presentación y referencias cruzadas a los campos del formulario.');
add('Quality review: Before delivery, we verify that every required field is completed, every attachment is present, photos meet specifications, and fee calculations are correct.',
    'Проверка качества: перед передачей мы проверяем, что каждое обязательное поле заполнено, каждое приложение присутствует, фото соответствуют требованиям, а расчёты пошлин верны.',
    'Revisión de calidad: antes de la entrega verificamos que cada campo requerido esté completo, cada anexo esté presente, las fotos cumplan las especificaciones y los cálculos de tarifas sean correctos.');
add('Delivery: You receive your completed packet ready for submission to USCIS, along with a copy for your personal records.',
    'Передача: вы получаете готовый пакет, готовый к подаче в USCIS, вместе с копией для ваших личных записей.',
    'Entrega: recibe su paquete completo listo para presentar a USCIS, junto con una copia para sus registros personales.');
add('Schedule an Immigration Document Consultation',
    'Записаться на консультацию по иммиграционным документам',
    'Agendar una Consulta de Documentos de Inmigración');
add('Call us directly or book a 30-minute consultation to discuss your USCIS filing and get a clear picture of which documents you need and how we can help organize them.',
    'Позвоните нам напрямую или забронируйте 30-минутную консультацию, чтобы обсудить вашу подачу в USCIS и понять, какие документы нужны и как мы поможем их организовать.',
    'Llámenos directamente o reserve una consulta de 30 minutos para discutir su presentación a USCIS y obtener una idea clara de qué documentos necesita y cómo podemos ayudarle a organizarlos.');

/* --- llc-formation-florida.html --- */
add('Florida Business Formation',
    'Регистрация бизнеса во Флориде',
    'Formación de Empresas en Florida');
add('LLC Formation in Florida — Start Your Business',
    'Регистрация LLC во Флориде — начните ваш бизнес',
    'Formación de LLC en Florida — Inicie su Negocio');
add('VitaCoreX LLC prepares the documents you need to form a Florida limited liability company, corporation, or other business entity. From Articles of Organization through EIN application to operating agreement drafting, we handle the paperwork so you can focus on building your business. Our team supports English, Russian, and Spanish speakers throughout the process.',
    'VitaCoreX LLC готовит документы для создания LLC, корпорации или другого бизнес-юрлица во Флориде. От Articles of Organization через EIN до разработки operating agreement — мы занимаемся бумажной работой, чтобы вы сосредоточились на развитии бизнеса. Наша команда поддерживает англо-, русско- и испаноязычных клиентов на всех этапах.',
    'VitaCoreX LLC prepara los documentos necesarios para formar una LLC, corporación u otra entidad comercial en Florida. Desde los Articles of Organization hasta la solicitud de EIN y la redacción del operating agreement, nos encargamos del papeleo para que usted se concentre en construir su negocio. Nuestro equipo apoya a hablantes de inglés, ruso y español durante todo el proceso.');
add('Important: VitaCoreX is not a law firm and does not provide legal advice. We provide document preparation and organizational support for business formation filings. For legal strategy regarding entity structure, consult a licensed attorney or CPA.',
    'Важно: VitaCoreX не является юридической фирмой и не оказывает юридических консультаций. Мы предоставляем подготовку документов и организационную поддержку для регистрационных подач. За юридической стратегией по структуре юрлица обращайтесь к лицензированному адвокату или CPA.',
    'Importante: VitaCoreX no es una firma de abogados y no proporciona asesoría legal. Ofrecemos preparación de documentos y apoyo organizacional para las presentaciones de formación empresarial. Para estrategia legal sobre la estructura de la entidad, consulte a un abogado licenciado o CPA.');
add('Florida LLC Formation Documents',
    'Документы для регистрации LLC во Флориде',
    'Documentos de Formación de LLC en Florida');
add('Florida is one of the most popular states for LLC formation in the United States, with no state income tax, strong asset protection statutes, and a streamlined filing process through the Division of Corporations (Sunbiz.org). Forming a Florida LLC requires filing Articles of Organization with the state, but a properly structured business needs several additional documents to operate effectively and maintain liability protection.',
    'Флорида — один из самых популярных штатов для регистрации LLC в США: отсутствие подоходного налога штата, сильные нормы защиты активов и упрощённая процедура подачи через Division of Corporations (Sunbiz.org). Создание флоридского LLC требует подачи Articles of Organization в штат, но правильно структурированный бизнес нуждается в нескольких дополнительных документах для эффективной работы и сохранения защиты от ответственности.',
    'Florida es uno de los estados más populares para la formación de LLC en Estados Unidos, sin impuesto estatal sobre la renta, con sólidas leyes de protección de activos y un proceso simplificado mediante la División de Corporaciones (Sunbiz.org). Formar una LLC en Florida requiere presentar Articles of Organization ante el estado, pero un negocio bien estructurado necesita varios documentos adicionales para operar con eficacia y mantener la protección de responsabilidad.');
add('Articles of Organization',
    'Articles of Organization',
    'Articles of Organization');
add('The Articles of Organization is the foundational document filed with the Florida Division of Corporations through Sunbiz.org. We prepare the filing with your company name (after availability verification), registered agent designation, principal office address, management structure (member-managed or manager-managed), and effective date. Florida charges a $125 filing fee payable directly to the Division of Corporations. We prepare the documentation; you submit and pay the state directly.',
    'Articles of Organization — базовый документ, подаваемый в Florida Division of Corporations через Sunbiz.org. Мы готовим подачу с названием компании (после проверки доступности), назначением registered agent, адресом главного офиса, структурой управления (member-managed или manager-managed) и датой вступления в силу. Флорида взимает пошлину $125, оплачиваемую напрямую в Division of Corporations. Мы готовим документы; вы подаёте и оплачиваете штату напрямую.',
    'Los Articles of Organization son el documento base presentado ante la División de Corporaciones de Florida a través de Sunbiz.org. Preparamos la presentación con el nombre de su empresa (tras verificación de disponibilidad), designación del registered agent, dirección de la oficina principal, estructura de administración (member-managed o manager-managed) y fecha de vigencia. Florida cobra una tarifa de $125 pagadera directamente a la División de Corporaciones. Nosotros preparamos la documentación; usted presenta y paga al estado directamente.');
add('Operating Agreement',
    'Operating Agreement',
    'Operating Agreement');
add('Florida does not legally require an operating agreement, but operating without one leaves your LLC governed entirely by Florida\'s default statutes, which may not match your intentions. We prepare a customized operating agreement covering member ownership percentages, capital contributions, profit and loss distribution, management authority, voting rights, transfer restrictions, dissolution procedures, and buy-sell provisions. For single-member LLCs, we prepare a simplified agreement that still documents the separation between personal and business assets critical for liability protection.',
    'Флорида юридически не требует operating agreement, но без него LLC полностью регулируется диспозитивными нормами штата, которые могут не соответствовать вашим намерениям. Мы готовим настраиваемый operating agreement с долями участников, вкладами в капитал, распределением прибыли и убытков, полномочиями управления, правом голоса, ограничениями на передачу долей, процедурами ликвидации и buy-sell положениями. Для single-member LLC мы готовим упрощённое соглашение, которое всё равно фиксирует разделение личных и бизнес-активов, критичное для защиты от ответственности.',
    'Florida no exige legalmente un operating agreement, pero operar sin él deja a su LLC totalmente regida por los estatutos supletorios de Florida, que pueden no coincidir con sus intenciones. Preparamos un operating agreement personalizado con porcentajes de propiedad de los miembros, aportaciones de capital, distribución de pérdidas y ganancias, autoridad de administración, derechos de voto, restricciones de transferencia, procedimientos de disolución y cláusulas buy-sell. Para LLC de un solo miembro, preparamos un acuerdo simplificado que igualmente documenta la separación entre activos personales y de negocio, crítica para la protección de responsabilidad.');
add('EIN Application (IRS Form SS-4)',
    'Заявление EIN (форма IRS SS-4)',
    'Solicitud de EIN (Formulario IRS SS-4)');
add('Your Employer Identification Number is required to open a business bank account, hire employees, and file federal tax returns. We prepare the IRS Form SS-4 application with the correct entity classification, responsible party designation, and business activity codes. For newly formed LLCs, we ensure the application reflects the correct tax treatment: default pass-through for single-member or multi-member LLCs, or S-Corp or C-Corp election if you intend to file Form 2553 or Form 8832.',
    'EIN нужен для открытия бизнес-счёта, найма сотрудников и подачи федеральных налоговых деклараций. Мы готовим заявление IRS SS-4 с правильной классификацией юрлица, указанием ответственного лица и кодами видов деятельности. Для вновь созданных LLC мы обеспечиваем корректное отражение налогового режима: по умолчанию pass-through для single-member или multi-member LLC, либо выбор S-Corp или C-Corp, если вы планируете подать форму 2553 или 8832.',
    'Su Employer Identification Number es necesario para abrir una cuenta bancaria empresarial, contratar empleados y presentar declaraciones fiscales federales. Preparamos la solicitud IRS SS-4 con la clasificación de entidad correcta, la designación de responsible party y los códigos de actividad comercial. Para LLC recién formadas, aseguramos que la solicitud refleje el tratamiento fiscal correcto: pass-through por defecto para LLC de uno o varios miembros, o elección de S-Corp o C-Corp si planea presentar el Formulario 2553 o 8832.');
add('Entity Type Options',
    'Варианты типов юрлиц',
    'Opciones de Tipo de Entidad');
add('Standard Florida LLC',
    'Стандартная флоридская LLC',
    'LLC Estándar de Florida');
add('The default Florida LLC is taxed as a disregarded entity (single member) or partnership (multi-member) for federal purposes. This is the simplest structure for most small businesses, freelancers, and real estate investors. Florida imposes no state income tax on individuals, making the pass-through LLC structure particularly tax-efficient for Florida residents.',
    'По умолчанию флоридская LLC облагается как disregarded entity (один участник) или partnership (несколько участников) для федеральных целей. Это простейшая структура для большинства малых бизнесов, фрилансеров и инвесторов в недвижимость. Флорида не взимает подоходный налог штата с физических лиц, что делает pass-through структуру LLC особенно выгодной для резидентов штата.',
    'La LLC estándar de Florida tributa como entidad desconocida (un miembro) o sociedad (varios miembros) a efectos federales. Es la estructura más simple para la mayoría de pequeños negocios, freelancers e inversionistas inmobiliarios. Florida no impone impuesto estatal sobre la renta a personas físicas, lo que hace que la estructura LLC pass-through sea especialmente eficiente desde el punto de vista fiscal para residentes de Florida.');
add('S-Corp Election (Form 2553)',
    'Выбор S-Corp (форма 2553)',
    'Elección de S-Corp (Formulario 2553)');
add('LLCs that elect S-Corp tax treatment can reduce self-employment tax by splitting income between salary and distributions. We prepare the IRS Form 2553 election alongside your LLC formation documents. This election is most beneficial when your LLC generates consistent net income above $40,000-$50,000 annually and you can justify a reasonable salary. We prepare the election paperwork; consult your CPA to confirm this structure benefits your specific tax situation.',
    'LLC, выбирающие налоговый режим S-Corp, могут снизить self-employment tax за счёт разделения дохода на зарплату и распределения. Мы готовим выбор по форме IRS 2553 вместе с регистрационными документами LLC. Этот выбор особенно выгоден, когда LLC стабильно приносит чистый доход выше $40 000—$50 000 в год и вы можете обосновать разумную зарплату. Мы готовим документы по выбору; проконсультируйтесь с CPA, чтобы подтвердить выгоду структуры в вашей конкретной налоговой ситуации.',
    'Las LLC que eligen tributar como S-Corp pueden reducir el impuesto de autoempleo al dividir los ingresos entre salario y distribuciones. Preparamos la elección del Formulario IRS 2553 junto con sus documentos de formación de LLC. Esta elección es más beneficiosa cuando su LLC genera ingresos netos consistentes superiores a $40.000—$50.000 anuales y puede justificar un salario razonable. Preparamos la documentación de la elección; consulte a su CPA para confirmar que esta estructura favorece su situación fiscal específica.');
add('C-Corp Formation',
    'Создание C-Corp',
    'Formación de C-Corp');
add('For businesses seeking venture capital, planning to issue stock options, or requiring a corporate structure for contractual reasons, we prepare Florida Articles of Incorporation, corporate bylaws, initial board resolutions, stock certificates, and the organizational minutes documenting the corporation\'s formation. C-Corps are subject to double taxation at both corporate and individual levels, but offer advantages for certain growth-stage businesses and those retaining significant earnings.',
    'Для бизнеса, привлекающего венчурный капитал, планирующего выпуск stock options или требующего корпоративной структуры по договорным причинам, мы готовим флоридские Articles of Incorporation, корпоративные bylaws, первоначальные резолюции совета директоров, stock certificates и organizational minutes, фиксирующие создание корпорации. C-Corp подвергается двойному налогообложению на корпоративном и личном уровнях, но имеет преимущества для определённых growth-stage компаний и тех, кто удерживает значительную прибыль.',
    'Para negocios que buscan capital de riesgo, planean emitir opciones sobre acciones o requieren una estructura corporativa por razones contractuales, preparamos los Articles of Incorporation de Florida, bylaws corporativos, resoluciones iniciales de la junta, certificados de acciones y las actas organizacionales que documentan la formación de la corporación. Las C-Corp están sujetas a doble tributación a nivel corporativo e individual, pero ofrecen ventajas para ciertas empresas en fase de crecimiento y aquellas que retienen ganancias significativas.');
add('Additional Formation Documents',
    'Дополнительные документы для регистрации',
    'Documentos Adicionales de Formación');
add('Registered Agent Documentation',
    'Документы Registered Agent',
    'Documentación de Registered Agent');
add('Every Florida LLC and corporation must designate a registered agent with a physical Florida street address. We prepare the registered agent designation forms and help you understand the requirements. If you need a registered agent service, we can recommend options, but VitaCoreX does not serve as a registered agent itself.',
    'Каждая флоридская LLC и корпорация должна назначить registered agent с физическим адресом во Флориде. Мы готовим формы назначения registered agent и поясняем требования. Если вам нужен сервис registered agent, мы можем порекомендовать варианты, но сам VitaCoreX не выступает в роли registered agent.',
    'Cada LLC y corporación de Florida debe designar un registered agent con una dirección física en Florida. Preparamos los formularios de designación de registered agent y le ayudamos a entender los requisitos. Si necesita un servicio de registered agent, podemos recomendar opciones, pero VitaCoreX no actúa como registered agent.');
add('Sunbiz Annual Report',
    'Годовой отчёт Sunbiz',
    'Reporte Anual Sunbiz');
add('Florida requires every LLC and corporation to file an annual report with the Division of Corporations by May 1 each year. The filing fee is $138.75 for LLCs and $150 for corporations. We prepare your annual report documentation and remind you of the filing deadline so your entity remains in active standing and avoids the $400 late fee or administrative dissolution.',
    'Флорида требует, чтобы каждая LLC и корпорация подавали годовой отчёт в Division of Corporations до 1 мая каждого года. Пошлина — $138,75 для LLC и $150 для корпораций. Мы готовим документацию годового отчёта и напоминаем о сроке подачи, чтобы ваше юрлицо оставалось в active standing и избежало $400 late fee или административного роспуска.',
    'Florida exige que cada LLC y corporación presente un reporte anual ante la División de Corporaciones antes del 1 de mayo de cada año. La tarifa es de $138,75 para LLC y $150 para corporaciones. Preparamos su documentación del reporte anual y le recordamos la fecha límite para que su entidad permanezca en active standing y evite el recargo de $400 o la disolución administrativa.');
add('Business License Research',
    'Исследование бизнес-лицензий',
    'Investigación de Licencias Comerciales');
add('Depending on your business type and location within Florida, you may need county or city business tax receipts, professional licenses, or industry-specific permits. We provide a checklist of likely licensing requirements based on your business activity and operating location within Hillsborough, Pinellas, Orange, Miami-Dade, or Broward counties.',
    'В зависимости от типа бизнеса и локации во Флориде могут понадобиться business tax receipts округа или города, профессиональные лицензии или отраслевые разрешения. Мы предоставляем чек-лист вероятных лицензионных требований на основе вашей деятельности и локации — Hillsborough, Pinellas, Orange, Miami-Dade или Broward.',
    'Según el tipo de negocio y su ubicación en Florida, puede necesitar business tax receipts del condado o ciudad, licencias profesionales o permisos específicos del sector. Ofrecemos una lista de verificación de los requisitos de licencia probables según su actividad comercial y ubicación operativa en los condados de Hillsborough, Pinellas, Orange, Miami-Dade o Broward.');
add('Formation Process',
    'Процесс регистрации',
    'Proceso de Formación');
add('Consultation: We discuss your business goals, planned activities, and ownership structure to determine the appropriate entity type and document package.',
    'Консультация: обсуждаем цели бизнеса, планируемую деятельность и структуру собственности, чтобы определить подходящий тип юрлица и пакет документов.',
    'Consulta: discutimos sus objetivos comerciales, actividades planificadas y estructura de propiedad para determinar el tipo de entidad y paquete documental apropiado.');
add('Name verification: We check your desired business name against the Florida Division of Corporations database to confirm availability before preparing filing documents.',
    'Проверка названия: сверяем желаемое название бизнеса с базой Florida Division of Corporations, чтобы подтвердить доступность до подготовки документов подачи.',
    'Verificación de nombre: comprobamos el nombre deseado de su negocio contra la base de datos de la División de Corporaciones de Florida para confirmar disponibilidad antes de preparar los documentos de presentación.');
add('Document preparation: We prepare your Articles of Organization (or Incorporation), operating agreement (or bylaws), EIN application, and any additional documents specific to your entity type.',
    'Подготовка документов: готовим ваши Articles of Organization (или Incorporation), operating agreement (или bylaws), заявление EIN и любые дополнительные документы под ваш тип юрлица.',
    'Preparación de documentos: preparamos sus Articles of Organization (o Incorporation), operating agreement (o bylaws), solicitud de EIN y cualquier documento adicional específico para su tipo de entidad.');
add('Review and delivery: You receive a complete formation document package with filing instructions, fee schedules, and a post-formation checklist covering bank account setup, licenses, and ongoing compliance requirements.',
    'Проверка и передача: вы получаете полный пакет регистрационных документов с инструкциями по подаче, тарифной сеткой и чек-листом после регистрации: открытие банковского счёта, лицензии и текущие комплаенс-требования.',
    'Revisión y entrega: recibe un paquete completo de documentos de formación con instrucciones de presentación, tarifas y una lista de verificación post-formación que cubre apertura de cuenta bancaria, licencias y requisitos de cumplimiento continuos.');
add('Post-formation support: After your entity is active, we remain available for annual report preparation, operating agreement amendments, and additional documentation needs as your business grows.',
    'Поддержка после регистрации: когда ваше юрлицо станет активным, мы остаёмся доступны для подготовки годового отчёта, изменений operating agreement и дополнительных документов по мере роста бизнеса.',
    'Apoyo posterior a la formación: una vez activa su entidad, permanecemos disponibles para la preparación del reporte anual, enmiendas al operating agreement y necesidades documentales adicionales a medida que su negocio crece.');
add('Start Your Florida Business',
    'Запустите ваш бизнес во Флориде',
    'Inicie su Negocio en Florida');
add('Call us directly or book a 30-minute consultation to discuss your business formation needs and get a clear picture of the documents, filings, and timeline involved.',
    'Позвоните нам напрямую или забронируйте 30-минутную консультацию, чтобы обсудить ваши потребности по регистрации бизнеса и понять документы, подачи и сроки.',
    'Llámenos directamente o reserve una consulta de 30 minutos para discutir sus necesidades de formación empresarial y obtener una visión clara de documentos, presentaciones y cronograma.');

/* --- SHARED industry labels --- */
add('Where the work anchors',
    'Где закрепляется работа',
    'Dónde se ancla el trabajo');
add('Operating problem',
    'Операционная проблема',
    'Problema operativo');
add('What changes',
    'Что меняется',
    'Qué cambia');
add('Typical first outputs',
    'Типичные первые результаты',
    'Primeras entregas típicas');
add('Weeks 1—2 · Baseline',
    'Недели 1—2 · Базовая точка',
    'Semanas 1—2 · Línea base');
add('Weeks 3—8 · Pilot',
    'Недели 3—8 · Пилот',
    'Semanas 3—8 · Piloto');
add('Weeks 9—12 · Decision',
    'Недели 9—12 · Решение',
    'Semanas 9—12 · Decisión');
add('30-day diagnostic report with a low/high recovery band and 90-day prioritized roadmap — see the redacted sample deliverable for the format.',
    '30-дневный диагностический отчёт с нижней/верхней границей возврата и приоритизированным 90-дневным планом — формат см. в отредактированном образце.',
    'Informe diagnóstico de 30 días con banda baja/alta de recuperación y hoja de ruta priorizada a 90 días — consulte el formato en el entregable de muestra redactado.');
add('Subscription',
    'Подписочная модель',
    'Suscripción');
add('Contract services',
    'Контрактные услуги',
    'Servicios contractuales');

/* --- industry-contract-services.html --- */
add('Contract-heavy services · Construction, professional, B2B',
    'Контракто-ёмкие услуги · Стройка, профуслуги, B2B',
    'Servicios contract-heavy · Construcción, profesional, B2B');
add('In contract-heavy work, the invoice is rarely the problem. The change order without a signature, the scope drift without a PCO, and the lien deadline that already passed — those are the problem.',
    'В контракто-ёмкой работе инвойс редко является проблемой. Проблема — change order без подписи, scope drift без PCO и уже пропущенный дедлайн по lien.',
    'En el trabajo contract-heavy, la factura rara vez es el problema. El change order sin firma, el scope drift sin PCO y el plazo de lien que ya venció — ese es el problema.');
add('This page is written for general contractors and sub-tier trades, professional-services firms on milestone or retainer billing, multi-tier B2B service operators, and commercial specialty vendors whose disputes rarely hinge on delivery quality — they hinge on authorization trail, change-order discipline, lien-period calendar, and the chronology binder that either exists or doesn\'t when counsel asks for it. Cash and leverage move together: they erode together, and they recover together.',
    'Страница адресована генподрядчикам и субподрядчикам, профуслугам на milestone или retainer-биллинге, многоуровневым B2B-операторам и коммерческим специализированным поставщикам, чьи споры редко упираются в качество поставки — они упираются в authorization trail, дисциплину change order, календарь lien-периодов и папку хронологии, которая либо есть, либо нет, когда её запрашивает адвокат. Кэш и рычаг идут вместе: вместе ослабевают и вместе возвращаются.',
    'Esta página está dirigida a contratistas generales y subcontratistas, firmas de servicios profesionales con facturación por hitos o retainer, operadores B2B multinivel y proveedores comerciales especializados cuyas disputas rara vez dependen de la calidad de entrega: dependen del authorization trail, la disciplina de change order, el calendario de lien y la carpeta de cronología que existe o no cuando el abogado la pide. Caja y palanca se mueven juntas: se erosionan juntas y se recuperan juntas.');
add('Change-order and PCO discipline, signed-authorization trail, lien-period calendar, scope-drift memo habit, multi-tier payment flow-down reconciliation, and the counsel-handoff packet that makes filing or enforcement practical instead of a reconstruction project. VitaCoreX is not a law firm — all legal advice, lien filing, and litigation decisions remain with the operator\'s licensed counsel. Our lane is documentation control and file-readiness.',
    'Дисциплина change order и PCO, подписанный authorization trail, календарь lien-периодов, привычка к scope-drift memo, сверка multi-tier payment flow-down и counsel-handoff packet, делающий подачу или принудительное исполнение практическим действием, а не проектом реконструкции. VitaCoreX не является юридической фирмой — все юридические советы, подача lien и решения по судам остаются за лицензированным адвокатом оператора. Наша зона — контроль документации и готовность файла.',
    'Disciplina de change order y PCO, authorization trail firmado, calendario de lien, hábito de memo de scope-drift, conciliación de flow-down de pagos multinivel y paquete counsel-handoff que hace que la presentación o ejecución sea práctica y no un proyecto de reconstrucción. VitaCoreX no es una firma de abogados — toda asesoría legal, presentación de lien y decisiones de litigio permanecen con el abogado licenciado del operador. Nuestro carril es el control documental y la preparación del expediente.');
add('The receivable is usually collectable. The chronology supporting it usually isn\'t assembled yet.',
    'Дебиторка обычно возвратная. Хронология, подтверждающая её, — обычно ещё не собрана.',
    'La cuenta por cobrar suele ser recuperable. La cronología que la respalda suele no estar armada.');
add('Change-order discipline: every verbal direction becomes a written PCO with pricing and a signature window before work proceeds — no exceptions absorbed quietly into the next invoice.',
    'Дисциплина change order: каждое устное указание превращается в письменный PCO с ценой и окном подписания до начала работы — никаких исключений, молча абсорбированных в следующий инвойс.',
    'Disciplina de change order: cada indicación verbal se convierte en un PCO escrito con precio y ventana de firma antes de proceder con el trabajo — sin excepciones absorbidas silenciosamente en la siguiente factura.');
add('Authorization trail built at the time of the event, not reconstructed at dispute — signed daily reports, photo-dated progress, and change directives filed with the invoice packet.',
    'Authorization trail строится в момент события, а не реконструируется при споре — подписанные ежедневные отчёты, progress с фото-датой и change directives, подшитые к пакету инвойса.',
    'Authorization trail construido en el momento del evento, no reconstruido en la disputa — daily reports firmados, progreso con foto-fecha y change directives archivados junto al paquete de facturación.');
add('Lien-period calendar owned by a named role, calibrated to the jurisdiction of each project, with hard preliminary-notice and NTO deadlines tracked and reminded.',
    'Календарь lien-периодов ведёт названная роль, откалиброванная под юрисдикцию каждого проекта, с жёстко отслеживаемыми и напоминаемыми сроками preliminary notice и NTO.',
    'Calendario de lien a cargo de un rol designado, calibrado a la jurisdicción de cada proyecto, con plazos duros de preliminary notice y NTO monitoreados y recordados.');
add('Milestone billing events tied to completion evidence in one reconciled packet — not "check the PM portal, check the billing system, check the project drive".',
    'Milestone-биллинг события привязаны к доказательствам завершения в одном согласованном пакете — не «посмотрите в PM-портале, посмотрите в биллинг-системе, посмотрите в project drive».',
    'Eventos de facturación por hitos vinculados a la evidencia de finalización en un solo paquete conciliado — no "revisa el portal de PM, revisa el sistema de facturación, revisa el project drive".');
add('Counsel-handoff packet: contract chain, change-order log, authorization trail, payment history, dispute chronology, and lien-period status — one artifact per disputed balance, ready on request.',
    'Counsel-handoff packet: цепочка контрактов, лог change order, authorization trail, история платежей, хронология спора и статус lien-периода — один артефакт на спорный баланс, готовый по запросу.',
    'Paquete counsel-handoff: cadena contractual, registro de change orders, authorization trail, historial de pagos, cronología de disputa y estado de lien — un artefacto por saldo disputado, listo a pedido.');
add('Change-order inventory on active and trailing-12-month projects — categorized as signed, verbal-only-documented, and undocumented.',
    'Инвентаризация change orders по активным и trailing-12-месячным проектам — с категоризацией: подписанные, только устные задокументированные и недокументированные.',
    'Inventario de change orders en proyectos activos y de los últimos 12 meses — categorizados como firmados, solo verbales documentados y no documentados.');
add('Authorization-trail audit on a sample of disputed receivables — scored against an industry-standard packet checklist.',
    'Аудит authorization trail на выборке спорных требований — с оценкой по отраслевому чек-листу пакета.',
    'Auditoría de authorization trail en una muestra de cuentas disputadas — puntuada contra una lista de verificación de paquete estándar del sector.');
add('Lien-period calendar review per jurisdiction with any missed or at-risk preliminary-notice deadlines surfaced.',
    'Обзор календаря lien-периодов по юрисдикциям с выявлением пропущенных или рискованных сроков preliminary notice.',
    'Revisión del calendario de lien por jurisdicción con los plazos de preliminary notice perdidos o en riesgo destacados.');
add('Milestone-to-billing reconciliation on open invoices, producing a delta per project between delivered scope and billed amount.',
    'Сверка milestone-to-billing по открытым инвойсам с дельтой на проект между поставленным scope и выставленной суммой.',
    'Conciliación milestone-to-billing de facturas abiertas con un delta por proyecto entre el alcance entregado y el monto facturado.');
add('90-day frame · Counsel-ready by design',
    '90-дневный фрейм · Counsel-ready by design',
    'Marco de 90 días · Counsel-ready by design');
add('Tighten the packet before leverage softens further.',
    'Укрепите пакет до того, как рычаг ослабнет ещё сильнее.',
    'Refuerce el expediente antes de que la palanca se debilite más.');
add('Contract-services rollouts that skip the packet step end up funding expensive reconstruction work at counsel rates. The standard frame is to freeze the baseline, run the new packet discipline on active projects first (future change orders, future lien deadlines, future milestones), then retrofit the packet standard back onto the disputed balances that are closest to lien or demand action. Counsel engagement is sequenced last, not first — the file walks in ready.',
    'Внедрения в contract-services, пропускающие этап пакета, в итоге финансируют дорогую работу по реконструкции по ставкам адвокатов. Стандартный фрейм: заморозить baseline, сначала запустить новую дисциплину пакета на активных проектах (будущие change orders, будущие lien-сроки, будущие milestones), затем ретроактивно наложить стандарт пакета на спорные балансы, ближайшие к lien или demand. Привлечение адвоката — последним шагом, а не первым: файл приходит готовым.',
    'Los despliegues en contract-services que omiten el paso de expediente terminan financiando un trabajo caro de reconstrucción a tarifas de abogado. El marco estándar es congelar la línea base, ejecutar la nueva disciplina de expediente primero en proyectos activos (futuros change orders, futuros plazos de lien, futuros hitos), y luego retrofit del estándar sobre los saldos disputados más cercanos al lien o demand. La participación del abogado se secuencia al final, no al inicio — el expediente llega listo.');
add('Change-order inventory, authorization-trail audit, lien-calendar review per jurisdiction. Baseline file-readiness score per project and per disputed balance.',
    'Инвентаризация change orders, аудит authorization trail, обзор календаря lien по юрисдикциям. Базовая оценка file-readiness по проекту и по спорному балансу.',
    'Inventario de change orders, auditoría de authorization trail, revisión del calendario de lien por jurisdicción. Puntuación base de file-readiness por proyecto y saldo disputado.');
add('PCO discipline enforced on new change directions; signed daily-report and photo-dated progress habit embedded; lien-period calendar with a named owner; milestone-to-billing reconciliation on active projects; counsel-handoff packet template drafted and exercised on one disputed balance end-to-end.',
    'Дисциплина PCO применяется к новым change directions; привычка подписанных daily reports и progress с фото-датой закреплена; календарь lien-периодов с названным владельцем; сверка milestone-to-billing на активных проектах; шаблон counsel-handoff packet разработан и отработан на одном спорном балансе end-to-end.',
    'Disciplina PCO aplicada a nuevas change directions; hábito de daily reports firmados y progreso con foto-fecha incorporado; calendario de lien con owner designado; conciliación milestone-to-billing en proyectos activos; plantilla de counsel-handoff packet redactada y ejercitada end-to-end en un saldo disputado.');
add('Retrofit of packet standard onto the highest-leverage disputed balances; file-readiness score improvement measured; and a counsel-engagement recommendation per balance — file-ready, demand-ready, lien-ready, or litigation-ready. Honest governance choice at the end of the window.',
    'Ретроактивное применение стандарта пакета к спорным балансам с наибольшим рычагом; измерение улучшения оценки file-readiness; рекомендация по вовлечению адвоката для каждого баланса — file-ready, demand-ready, lien-ready или litigation-ready. Честный выбор governance в конце окна.',
    'Retrofit del estándar de expediente sobre los saldos disputados de mayor palanca; medición de la mejora del score de file-readiness; y recomendación de counsel-engagement por saldo — file-ready, demand-ready, lien-ready o litigation-ready. Elección honesta de gobernanza al final del marco.');

/* --- industry-fleet-logistics.html --- */
add('Fleet, fuel & logistics · Contract-heavy portfolios',
    'Флит, топливо и логистика · Контракто-ёмкие портфели',
    'Flota, combustible y logística · Portafolios contract-heavy');
add('Fleet receivables don\'t die on the aging report. They die in the gap between fuel-card swipe, signed BOL, and the dispute log that nobody owns.',
    'Флит-дебиторка умирает не в aging-отчёте. Она умирает в разрыве между fuel-card swipe, подписанным BOL и dispute log, которым никто не владеет.',
    'Las cuentas por cobrar de flota no mueren en el reporte de antigüedad. Mueren en la brecha entre el swipe de fuel-card, el BOL firmado y el dispute log que nadie posee.');
add('This page is written for fleet operators, fuel-card portfolio managers, equipment-leasing firms, and logistics / 3PL / freight-broker AR teams whose dispute volume has outrun the recordkeeping that should support it. The operating layer usually fails first — weak authorization trails, swipes without driver attestation, BOLs filed separately from the invoice — which is why counsel time is spent on reconstruction instead of enforcement.',
    'Страница адресована флит-операторам, менеджерам портфелей fuel-card, компаниям по лизингу оборудования и AR-командам логистики / 3PL / freight-broker, где объём споров обогнал документооборот, который должен их поддерживать. Операционный слой обычно падает первым — слабые authorization trails, swipe-операции без подтверждения водителя, BOL, хранящиеся отдельно от инвойса — поэтому время адвоката уходит на реконструкцию, а не на принудительное исполнение.',
    'Esta página está dirigida a operadores de flota, gestores de portafolios de fuel-card, firmas de equipment-leasing y equipos AR de logística / 3PL / freight-broker cuyo volumen de disputas supera al registro que debería respaldarlas. La capa operativa suele fallar primero — authorization trails débiles, swipes sin atestación del conductor, BOL archivados por separado de la factura — por lo que el tiempo de abogado se gasta en reconstrucción en lugar de ejecución.');
add('Fuel-card reconciliation, BOL-to-invoice pairing, driver-attestation workflow, equipment-lease default packet discipline, and the dispute log that sits between operations and finance. VitaCoreX is not a debt collector under FDCPA — all counterparty contact remains with the operator. Our lane is packet quality, dispute log rigor, and file-readiness before any counsel escalation.',
    'Сверка fuel-card, связка BOL-to-invoice, процесс driver-attestation, дисциплина пакета по equipment-lease default и dispute log между операциями и финансами. VitaCoreX не является debt collector по FDCPA — все контакты с контрагентами остаются за оператором. Наша зона — качество пакета, строгость dispute log и file-readiness до любой эскалации к адвокату.',
    'Conciliación de fuel-card, emparejamiento BOL-to-invoice, flujo de driver-attestation, disciplina del paquete de equipment-lease default y el dispute log que se sitúa entre operaciones y finanzas. VitaCoreX no es un debt collector bajo FDCPA — todo contacto con contrapartes permanece con el operador. Nuestro carril es la calidad del paquete, el rigor del dispute log y la preparación del expediente antes de cualquier escalamiento a abogado.');
add('The dispute is usually winnable. The file usually isn\'t ready.',
    'Спор обычно можно выиграть. Файл обычно не готов.',
    'La disputa suele ser ganable. El expediente suele no estar listo.');
add('Across fleet, fuel-card, equipment-leasing, and logistics / 3PL portfolios, the common pattern isn\'t customer insolvency — it\'s fragmented authorization evidence (fuel-card swipes without driver signature, detention charges without customer sign-off, accessorial fees logged in a separate system from the master invoice), BOLs stored separately from the billing packet, equipment-lease default packets missing telematics timestamps, and no single dispute log that finance and operations both trust. By the time a dispute reaches counsel, half the work is reconstruction rather than enforcement.',
    'По портфелям флит, fuel-card, equipment-leasing и логистики / 3PL общий паттерн — не неплатёжеспособность клиента, а фрагментированные доказательства авторизации (fuel-card swipe без подписи водителя, detention-списания без подтверждения клиента, accessorial fees в отдельной системе от мастер-инвойса), BOL, хранящиеся отдельно от биллинг-пакета, пакеты equipment-lease default без телематических timestamps и отсутствие единого dispute log, которому доверяют финансы и операции. К моменту, когда спор доходит до адвоката, половина работы — реконструкция, а не принудительное исполнение.',
    'En portafolios de flota, fuel-card, equipment-leasing y logística / 3PL, el patrón común no es la insolvencia del cliente — es la evidencia de autorización fragmentada (swipes de fuel-card sin firma del conductor, cargos de detention sin sign-off del cliente, tarifas accesorias registradas en un sistema separado del master invoice), BOL almacenados aparte del paquete de facturación, paquetes de equipment-lease default sin timestamps telemáticos y la ausencia de un único dispute log en el que confíen finanzas y operaciones. Para cuando la disputa llega al abogado, la mitad del trabajo es reconstrucción en lugar de ejecución.');
add('Unified invoice packet: master invoice, BOL/POD, accessorial evidence, driver attestation, and any customer sign-off in one artifact bundled at billing — not reconstructed at dispute.',
    'Единый пакет инвойса: мастер-инвойс, BOL/POD, доказательства accessorial, driver attestation и любое sign-off клиента в одном артефакте, скомпонованном при биллинге — а не восстановленном при споре.',
    'Paquete de factura unificado: master invoice, BOL/POD, evidencia accesoria, driver attestation y cualquier sign-off del cliente en un solo artefacto empaquetado al facturar — no reconstruido en la disputa.');
add('Fuel-card reconciliation cadence (weekly, minimum) matching swipe data to vehicle / driver / authorized-use boundary, with exception queue for mismatches.',
    'Ритм сверки fuel-card (минимум еженедельно): сопоставление swipe-данных с транспортом / водителем / границами авторизованного использования с очередью исключений для несовпадений.',
    'Cadencia de conciliación de fuel-card (mínimo semanal): casar los datos de swipe con vehículo / conductor / frontera de uso autorizado, con cola de excepciones para las discrepancias.');
add('Equipment-lease default packet standard: lease chain, payment history, telematics/usage log at default date, notices sent, cure-period documentation.',
    'Стандарт пакета equipment-lease default: цепочка лизинга, история платежей, телематический/usage log на дату дефолта, отправленные уведомления, документация cure-period.',
    'Estándar del paquete de equipment-lease default: cadena de arrendamiento, historial de pagos, registro telemático/de uso en fecha de default, notificaciones enviadas, documentación del cure-period.');
add('One shared dispute log between operations, finance, and legal — not three overlapping spreadsheets. Every dispute carries status, evidence index, and next-action owner.',
    'Один общий dispute log между операциями, финансами и юристами — а не три пересекающихся таблицы. Каждый спор несёт статус, индекс доказательств и владельца next-action.',
    'Un único dispute log compartido entre operaciones, finanzas y legal — no tres hojas superpuestas. Cada disputa lleva estado, índice de evidencia y owner de la siguiente acción.');
add('File-readiness KPI measured before counsel engagement: 90% packet complete, or the balance does not leave the operator\'s environment.',
    'KPI file-readiness измеряется до привлечения адвоката: 90% полноты пакета — или баланс не покидает среду оператора.',
    'KPI de file-readiness medido antes del counsel engagement: 90% de paquete completo, o el saldo no sale del entorno del operador.');
add('Dispute inventory across the trailing 12 months — categorized by counterparty type (shipper, carrier, broker, driver, fleet customer), dispute cause, and current status.',
    'Инвентаризация споров за trailing-12 месяцев — по типу контрагента (шиппер, carrier, broker, водитель, fleet-клиент), причине спора и текущему статусу.',
    'Inventario de disputas de los últimos 12 meses — categorizado por tipo de contraparte (shipper, carrier, broker, conductor, cliente de flota), causa de la disputa y estado actual.');
add('Fuel-card swipe audit against driver roster, authorized-use policy, and vehicle assignment — surfaced outliers quantified in dollars.',
    'Аудит swipe-операций fuel-card против реестра водителей, политики authorized use и назначения транспорта — выявленные outliers в долларах.',
    'Auditoría de swipes de fuel-card contra la lista de conductores, la política de uso autorizado y la asignación de vehículos — outliers destacados cuantificados en dólares.');
add('Packet-completeness audit on 60—80 representative invoices, scored against an industry-standard checklist.',
    'Аудит полноты пакета по 60—80 репрезентативным инвойсам с оценкой по отраслевому чек-листу.',
    'Auditoría de completitud de paquete en 60—80 facturas representativas, puntuada contra una lista de verificación estándar del sector.');
add('Equipment-lease default review on current-delinquent accounts, producing a file-readiness score per lease.',
    'Обзор equipment-lease default по текущим просроченным счетам с оценкой file-readiness по каждому лизингу.',
    'Revisión de equipment-lease default en cuentas actualmente morosas, con score de file-readiness por cada arrendamiento.');
add('30-day diagnostic report with a low/high recovery band and a 90-day prioritized roadmap — see the redacted sample deliverable for the format.',
    '30-дневный диагностический отчёт с нижней/верхней границей возврата и приоритизированным 90-дневным планом — формат см. в отредактированном образце.',
    'Informe diagnóstico de 30 días con banda baja/alta de recuperación y hoja de ruta priorizada a 90 días — consulte el formato en el entregable de muestra redactado.');
add('90-day frame · Dispute log first',
    '90-дневный фрейм · Сначала dispute log',
    'Marco de 90 días · Primero el dispute log');
add('Prove the packet before scaling the workflow.',
    'Сначала докажите пакет, потом масштабируйте workflow.',
    'Demuestre el expediente antes de escalar el flujo.');
add('Fleet-and-logistics rollouts that skip the dispute log step tend to accelerate the wrong work. The standard frame is to start at the dispute log itself — establish a single source of truth, then retrofit the packet standard to every category of dispute that actually shows up in the data, then measure packet completeness before expanding into customer / carrier contact cadence.',
    'Внедрения во флит и логистике, пропускающие шаг dispute log, обычно ускоряют неправильную работу. Стандартный фрейм: начать с самого dispute log — установить single source of truth, затем ретроактивно приложить стандарт пакета к каждой категории спора, реально появляющейся в данных, и только потом измерить completeness пакета перед расширением в ритм контактов с клиентом/carrier.',
    'Los despliegues en flota y logística que omiten el paso del dispute log suelen acelerar el trabajo equivocado. El marco estándar es comenzar por el dispute log mismo — establecer una única fuente de verdad, luego aplicar retroactivamente el estándar de paquete a cada categoría de disputa que realmente aparece en los datos, y solo entonces medir la completitud del paquete antes de expandirse a la cadencia de contacto con cliente/carrier.');
add('Dispute inventory pulled, categorized, and quantified. Fuel-card swipe audit against driver and vehicle assignment. Baseline packet-completeness score per counterparty type.',
    'Инвентаризация споров собрана, категоризирована и количественно оценена. Аудит fuel-card swipe против назначения водителей и транспорта. Базовая оценка полноты пакета по типу контрагента.',
    'Inventario de disputas extraído, categorizado y cuantificado. Auditoría de swipes de fuel-card contra asignación de conductor y vehículo. Score base de completitud de paquete por tipo de contraparte.');
add('Single dispute log live for one business unit or customer cohort. Packet standard enforced on new invoices in that cohort. Weekly reconciliation cadence re-established where it had lapsed.',
    'Единый dispute log запущен для одного бизнес-юнита или когорты клиентов. Стандарт пакета применяется к новым инвойсам в этой когорте. Еженедельный ритм сверки восстановлен там, где он был потерян.',
    'Dispute log único activo para una unidad de negocio o cohorte de clientes. Estándar de paquete aplicado a nuevas facturas de esa cohorte. Cadencia semanal de conciliación restablecida donde había caído.');
add('Measured: dispute-to-cure velocity, packet-completeness score, dollars moved from dispute bucket to paid, number of accounts newly counsel-ready. Expansion only if metrics justify it.',
    'Измеряется: скорость dispute-to-cure, score полноты пакета, доллары, переведённые из dispute-бакета в оплаченные, число счетов, ставших counsel-ready. Расширение — только при подтверждающих метриках.',
    'Se mide: velocidad dispute-to-cure, score de completitud del paquete, dólares movidos del bucket de disputa a pagado, número de cuentas recién counsel-ready. La expansión solo si las métricas lo justifican.');

/* --- industry-healthcare-dental.html --- */
add('Healthcare & dental · Multi-site operators',
    'Здравоохранение и стоматология · Мульти-сайт операторы',
    'Salud y dental · Operadores multi-sede');
add('Patient AR doesn\'t fail at collections. It fails at documentation timing, escalation variance, and portal fragmentation — long before a balance is written off.',
    'Пациентская дебиторка падает не на этапе коллекторов. Она падает на тайминге документов, вариативности эскалации и фрагментации портала — задолго до списания баланса.',
    'La cuenta por cobrar de pacientes no falla en cobranza. Falla en el timing documental, la variabilidad del escalamiento y la fragmentación del portal — mucho antes de que un saldo se castigue.');
add('This page is written for multi-site health systems, dental groups, DSOs, orthodontic networks, and specialty practices whose aging curve is drifting past 90 days across locations that inherited different billing discipline. Workflow and documentation — not pressure. Patient NPS measured alongside cash, not sacrificed for it.',
    'Страница адресована мульти-сайт систем здравоохранения, стоматологическим группам, DSO, ортодонтическим сетям и специализированным практикам, чья aging-кривая уползает за 90 дней по локациям с разной биллинг-дисциплиной. Процесс и документация — не давление. NPS пациента измеряется рядом с кэшем, а не жертвуется ради него.',
    'Esta página está dirigida a sistemas de salud multi-sede, grupos dentales, DSO, redes de ortodoncia y prácticas especializadas cuya curva de antigüedad rebasa los 90 días en sedes con distinta disciplina de facturación. Flujo y documentación — no presión. El NPS del paciente se mide junto con la caja, no se sacrifica por ella.');
add('A BAA-backed, operator-environment engagement. VitaCoreX is not a HIPAA Covered Entity and not a debt collector under FDCPA. PHI stays on the operator\'s infrastructure, patient contact stays under the operator\'s identity, counsel stays with the operator\'s law firm. Our lane is packet quality, escalation discipline, and file readiness.',
    'Работа под BAA в среде оператора. VitaCoreX не является HIPAA Covered Entity и не является debt collector по FDCPA. PHI остаётся на инфраструктуре оператора, контакт с пациентом — под идентичностью оператора, юрист — за юрфирмой оператора. Наша зона — качество пакета, дисциплина эскалации и готовность файла.',
    'Colaboración respaldada por BAA, en el entorno del operador. VitaCoreX no es una HIPAA Covered Entity ni un debt collector bajo FDCPA. La PHI permanece en la infraestructura del operador, el contacto con el paciente bajo la identidad del operador, el abogado con la firma legal del operador. Nuestro carril es la calidad del paquete, la disciplina de escalamiento y la preparación del expediente.');
add('The aging report is usually right. The packet behind it often isn\'t.',
    'Aging-отчёт обычно прав. Пакет за ним — часто нет.',
    'El reporte de antigüedad suele estar bien. El expediente detrás, a menudo no.');
add('Across multi-site healthcare and dental operators, the common pattern is not patient unwillingness — it is documentation timing (statements generated at billing, stale by day 90), escalation variance (identical balances treated differently by site), payment-path fragmentation (portal at some locations, paper-only at others), and EHR-to-practice-management reconciliation gaps that quietly understate true AR.',
    'В мульти-сайт здравоохранении и стоматологии общий паттерн — не нежелание пациента, а тайминг документов (выписки создаются при биллинге и устаревают к 90 дню), вариативность эскалации (одинаковые балансы обрабатываются по-разному на разных точках), фрагментация путей оплаты (портал на одних точках, бумага — на других) и пробелы сверки EHR-to-practice-management, тихо занижающие истинный AR.',
    'En operadores multi-sede de salud y odontología, el patrón común no es la reticencia del paciente — es el timing documental (estados de cuenta generados en la facturación y obsoletos al día 90), la variabilidad de escalamiento (saldos idénticos tratados distinto por sede), la fragmentación de rutas de pago (portal en unas sedes, solo papel en otras) y las brechas de conciliación EHR-to-practice-management que silenciosamente subestiman el AR real.');
add('Documentation regenerated at each escalation threshold, not frozen at initial billing — stale packets are the most common cause of payer and patient challenge.',
    'Документы регенерируются на каждом пороге эскалации, а не замораживаются на начальном биллинге — устаревшие пакеты — самая частая причина оспаривания со стороны плательщика и пациента.',
    'Documentación regenerada en cada umbral de escalamiento, no congelada en la facturación inicial — los paquetes obsoletos son la causa más común de disputa del pagador y del paciente.');
add('Unified escalation thresholds across sites (45 / 75 / 120 days) with documented override criteria, replacing manager-by-manager variance.',
    'Единые пороги эскалации по всем точкам (45 / 75 / 120 дней) с задокументированными критериями override, заменяющие менеджер-to-менеджер разнобой.',
    'Umbrales de escalamiento unificados entre sedes (45 / 75 / 120 días) con criterios de override documentados, que reemplazan la variabilidad manager-a-manager.');
add('Portal option extended network-wide with paper retained as fallback — no site forced digital-only, no site trapped in paper-only.',
    'Опция портала распространяется на всю сеть с бумагой как fallback — ни одной точке не навязан только digital, ни одна не заперта только в бумаге.',
    'Opción de portal extendida a toda la red con papel retenido como fallback — ninguna sede forzada a solo digital, ninguna sede atrapada solo en papel.');
add('Weekly EHR-to-practice-management reconciliation restored where it lapsed post-acquisition, with published variance tolerance.',
    'Еженедельная сверка EHR-to-practice-management восстановлена там, где она была потеряна после поглощения, с опубликованным допуском расхождений.',
    'Conciliación semanal EHR-to-practice-management restaurada donde se perdió tras una adquisición, con tolerancia de variación publicada.');
add('Counsel-handoff packet template measured as a standing KPI — 90% file readiness before any balance leaves the operator\'s environment.',
    'Шаблон counsel-handoff packet измеряется как постоянный KPI — 90% готовности файла до того, как любой баланс покинет среду оператора.',
    'Plantilla de counsel-handoff packet medida como KPI permanente — 90% de preparación del expediente antes de que cualquier saldo salga del entorno del operador.');
add('Cross-site aging dashboard reconciled weekly, with per-site and per-specialty cohort views.',
    'Кросс-сайт aging-дашборд сверяется еженедельно, с разрезом по сайтам и специальностям.',
    'Dashboard de antigüedad entre sedes conciliado semanalmente, con vistas de cohorte por sede y por especialidad.');
add('Packet-quality audit across a stratified sample of balances — itemized statement presence, insurance activity, coverage context, next-step clarity.',
    'Аудит качества пакета по стратифицированной выборке балансов — наличие itemized statement, активность страховой, контекст покрытия, ясность next-step.',
    'Auditoría de calidad de paquete en una muestra estratificada de saldos — presencia de estado de cuenta itemizado, actividad del seguro, contexto de cobertura, claridad del siguiente paso.');
add('Escalation-threshold audit by billing manager interview, producing the delta between written policy and observed practice.',
    'Аудит порогов эскалации через интервью с менеджерами биллинга с выявлением дельты между письменной политикой и наблюдаемой практикой.',
    'Auditoría de umbrales de escalamiento mediante entrevistas con los managers de facturación, produciendo el delta entre política escrita y práctica observada.');
add('Patient-path walkthrough from statement receipt through portal login on each site\'s production configuration.',
    'Walkthrough пути пациента от получения statement до логина в портал в production-конфигурации каждой точки.',
    'Walkthrough de la ruta del paciente desde la recepción del estado de cuenta hasta el inicio de sesión en el portal en la configuración de producción de cada sede.');
add('30-day diagnostic report with a low/high recovery band and a 90-day prioritized roadmap — see the redacted sample deliverable.',
    '30-дневный диагностический отчёт с нижней/верхней границей возврата и приоритизированным 90-дневным планом — см. отредактированный образец.',
    'Informe diagnóstico de 30 días con banda baja/alta de recuperación y hoja de ruta priorizada a 90 días — consulte el entregable de muestra redactado.');
add('90-day frame · Patient-NPS protected',
    '90-дневный фрейм · NPS пациента защищён',
    'Marco de 90 días · NPS del paciente protegido');
add('Pilot on a subset before network rollout.',
    'Пилот на подмножестве до раскатки на сеть.',
    'Piloto en un subconjunto antes del despliegue en la red.');
add('Healthcare and dental rollouts that move too fast damage patient relationships. The standard frame is to pilot on a small site mix — one high-volume general, one specialty, one underperformer — validate packet quality and threshold discipline on real balances, then expand. Patient NPS is tracked the entire time. See the multi-site case study for a 12-clinic engagement walked week by week.',
    'Внедрения в здравоохранении и стоматологии, которые движутся слишком быстро, разрушают отношения с пациентами. Стандартный фрейм: пилот на небольшом миксе точек — одна high-volume общая, одна специальная, одна underperformer — валидация качества пакета и дисциплины порогов на реальных балансах, затем расширение. NPS пациента отслеживается всё время. Кейс из 12 клиник — разобран неделя за неделей.',
    'Los despliegues en salud y odontología que avanzan demasiado rápido dañan las relaciones con los pacientes. El marco estándar es pilotar en una pequeña mezcla de sedes — una de alto volumen general, una de especialidad, una underperformer — validar la calidad del paquete y la disciplina de umbrales en saldos reales, y luego expandir. El NPS del paciente se rastrea todo el tiempo. Vea el caso multi-sede para un engagement de 12 clínicas recorrido semana a semana.');
add('Pull aging report per site, sample packet quality against a 12-item rubric, audit escalation thresholds by observed practice (not written policy). Deliverable: baseline memo with variance map.',
    'Снять aging-отчёт по каждой точке, оценить выборку качества пакета по 12-пунктовой рубрике, провести аудит порогов эскалации по наблюдаемой практике (не по письменной политике). Deliverable: baseline-memo с картой разночтений.',
    'Extraer el reporte de antigüedad por sede, muestrear la calidad del paquete con una rúbrica de 12 ítems, auditar los umbrales de escalamiento por la práctica observada (no la política escrita). Entregable: memo base con mapa de variaciones.');
add('Pilot 2—3 sites by mix. Packet template live, portal extended with paper fallback, weekly exception queue on a fixed cadence. Compliance lead reviews every patient-facing template before send.',
    'Пилот на 2—3 точках по миксу. Шаблон пакета в продакшене, портал расширен с бумагой как fallback, еженедельная очередь исключений с фиксированным ритмом. Compliance-лид проверяет каждый шаблон, идущий пациенту, до отправки.',
    'Pilote 2—3 sedes por mezcla. Plantilla de paquete en vivo, portal extendido con fallback en papel, cola de excepciones semanal a cadencia fija. El líder de cumplimiento revisa cada plantilla dirigida a pacientes antes del envío.');
add('Measured against baseline: cash recovered, DSO movement, packet-quality score, patient-NPS delta, exception-queue throughput. Network rollout only if metrics justify it.',
    'Измерение против baseline: возвращённый кэш, движение DSO, оценка качества пакета, дельта NPS пациента, пропускная способность очереди исключений. Раскатка на сеть — только при подтверждающих метриках.',
    'Medición contra la línea base: caja recuperada, movimiento de DSO, score de calidad de paquete, delta de NPS del paciente, throughput de la cola de excepciones. Despliegue en red solo si las métricas lo justifican.');

/* --- industry-subscription-recurring.html --- */
add('Subscription & recurring · SaaS, membership, fitness',
    'Подписка и регулярные платежи · SaaS, членство, фитнес',
    'Suscripción y recurrente · SaaS, membresía, fitness');
add('Involuntary churn isn\'t a collections problem. It\'s a retry-logic, dunning-ladder, and card-update problem that escalated into a collections decision — usually one month too late.',
    'Involuntary churn — это не проблема коллекторов. Это проблема retry-логики, dunning-лестницы и flow обновления карты, которая доросла до решения об эскалации — обычно на месяц позже.',
    'El churn involuntario no es un problema de cobranza. Es un problema de retry-logic, escalera de dunning y flujo de actualización de tarjeta que escaló hasta una decisión de cobranza — generalmente un mes demasiado tarde.');
add('This page is written for SaaS operators, B2B subscription finance teams, membership platforms, and gym / fitness / wellness multi-location chains whose failed-payment recovery has drifted into hard-collections territory while the underlying retry logic, dunning ladder, and card-on-file update flow remain un-tuned. Most of the recoverable dollars are still fully collectable with retention preserved — if the upstream workflow is fixed first.',
    'Страница адресована SaaS-операторам, финансовым командам B2B-подписок, платформам членства и мульти-сайт сетям gym / fitness / wellness, чей возврат failed payments уполз в территорию hard collections, пока базовая retry-логика, dunning-лестница и flow обновления card-on-file остаются неотстроенными. Большую часть возвратных долларов можно вернуть с сохранением retention — если сначала починить upstream workflow.',
    'Esta página está dirigida a operadores SaaS, equipos de finanzas de suscripciones B2B, plataformas de membresía y cadenas multi-sede de gym / fitness / wellness cuya recuperación de pagos fallidos derivó a territorio de hard collections mientras la retry-logic, la escalera de dunning y el flujo de actualización de card-on-file permanecen sin ajustar. La mayoría de los dólares recuperables siguen siendo cobrables con el retention intacto — si primero se arregla el flujo upstream.');
add('Retry-logic design, dunning-ladder sequencing, card-update flow, cohort-level rescue vs churn decisions, and the escalation gate that separates "retention-salvageable" from "collections-justified." VitaCoreX is not a debt collector under FDCPA — all member / subscriber contact stays under the operator\'s brand. Our lane is upstream workflow, segmentation discipline, and the decision log that keeps retention and recovery aligned.',
    'Дизайн retry-логики, секвенирование dunning-лестницы, flow обновления карты, решения rescue vs churn на уровне когорт и escalation gate, отделяющий «retention-salvageable» от «collections-justified». VitaCoreX не является debt collector по FDCPA — весь контакт с member / subscriber остаётся под брендом оператора. Наша зона — upstream workflow, дисциплина сегментации и decision log, удерживающий retention и recovery в согласии.',
    'Diseño de retry-logic, secuenciación de la escalera de dunning, flujo de actualización de tarjeta, decisiones rescue vs churn a nivel de cohorte y el escalation gate que separa "retention-salvageable" de "collections-justified". VitaCoreX no es un debt collector bajo FDCPA — todo el contacto con el miembro/suscriptor permanece bajo la marca del operador. Nuestro carril es el flujo upstream, la disciplina de segmentación y el decision log que mantiene alineadas retención y recuperación.');
add('The failed payment is fixable. The decision to escalate usually isn\'t fixable after the fact.',
    'Неудачный платёж можно исправить. Решение об эскалации обычно нельзя исправить постфактум.',
    'El pago fallido es reparable. La decisión de escalar generalmente no es reparable a posteriori.');
add('Retry logic tuned to card-network behavior — retry timing aligned with issuer posting windows and avoid-decline rules, not arbitrary time-of-day.',
    'Retry-логика настроена под поведение card-network — тайминг ретраев согласован с posting-окнами эмитента и правилами avoid-decline, а не с произвольным временем суток.',
    'Retry-logic ajustada al comportamiento de la red de tarjetas — timing de retry alineado con las ventanas de posting del emisor y reglas de avoid-decline, no con una hora arbitraria del día.');
add('Dunning ladder rewritten by stage with tone discipline — cooperative framing up to day 14, firmer framing day 15—30, escalation framing only past day 30.',
    'Dunning-лестница переписана по стадиям с дисциплиной тона — кооперативный фрейминг до 14 дня, более жёсткий фрейминг 15—30 день, escalation-фрейминг только после 30 дня.',
    'Escalera de dunning reescrita por etapa con disciplina de tono — tono cooperativo hasta el día 14, tono más firme entre los días 15—30, tono de escalamiento solo después del día 30.');
add('Card-on-file update flow surfaced one click deep in the subscriber-facing UX, not buried — with a mobile-first fallback path for hard declines.',
    'Flow обновления card-on-file — один клик глубины в UX подписчика, а не закопан — с mobile-first fallback-путём для hard declines.',
    'Flujo de actualización de card-on-file a un clic de profundidad en la UX del suscriptor, no enterrado — con una ruta fallback mobile-first para hard declines.');
add('Cohort segmentation: rescue-eligible (active use, recent success, soft decline) vs churn-expected (inactive, hard decline, cancel-signal) treated on different ladders, not the same one.',
    'Сегментация когорт: rescue-eligible (активное использование, недавний успех, soft decline) vs churn-expected (неактивные, hard decline, cancel-signal) обрабатываются по разным лестницам, а не по одной.',
    'Segmentación de cohortes: rescue-eligible (uso activo, éxito reciente, soft decline) vs churn-expected (inactivos, hard decline, cancel-signal) tratados en escaleras distintas, no la misma.');
add('Escalation gate documented: specific criteria that move a subscriber from retention to collections, signed off by a named owner, logged per decision.',
    'Escalation gate задокументирован: конкретные критерии, переводящие подписчика из retention в collections, подписаны именованным владельцем, каждое решение залогировано.',
    'Escalation gate documentado: criterios específicos que mueven a un suscriptor de retención a cobranza, firmados por un owner designado, registrados por decisión.');
add('Failed-payment cohort audit across the trailing 90 days — soft vs hard decline, recovered vs churned, time-to-cure distribution.',
    'Аудит когорты failed payments за trailing-90 дней — soft vs hard decline, возвращённые vs churn, распределение time-to-cure.',
    'Auditoría de cohorte de pagos fallidos en los últimos 90 días — soft vs hard decline, recuperados vs churn, distribución del time-to-cure.');
add('Retry-logic audit against issuer posting behavior — surface retries firing in known-decline windows.',
    'Аудит retry-логики против поведения posting эмитента — выявить retry, срабатывающие в known-decline окнах.',
    'Auditoría de retry-logic contra el comportamiento de posting del emisor — identificar retries que se disparan en ventanas de known-decline.');
add('Dunning-ladder content review with tone scoring per stage and per channel (email, SMS, in-app).',
    'Проверка контента dunning-лестницы с оценкой тона по стадии и по каналу (email, SMS, in-app).',
    'Revisión de contenido de la escalera de dunning con puntuación de tono por etapa y por canal (email, SMS, in-app).');
add('Card-update flow walkthrough on production UX, timed click-depth and mobile compatibility.',
    'Walkthrough flow обновления карты в production UX, с замером click-depth и совместимости с мобильными.',
    'Walkthrough del flujo de actualización de tarjeta en la UX de producción, con medición de click-depth y compatibilidad móvil.');
add('90-day frame · Retention preserved',
    '90-дневный фрейм · Retention сохранён',
    'Marco de 90 días · Retención preservada');
add('Fix the upstream ladder before touching the escalation gate.',
    'Почините upstream-лестницу до того, как трогать escalation gate.',
    'Arregle la escalera upstream antes de tocar el escalation gate.');
add('Subscription rollouts that go straight to the escalation gate often leave rescue-eligible dollars on the table. The standard frame is to rebuild the retry logic and dunning ladder first, measure the shift in cure rate and time-to-cure on a single cohort, then re-examine the escalation gate once the upstream flow is tuned. LTV is tracked alongside cash throughout — recovered dollars that churn the subscriber are not net wins.',
    'Подписочные внедрения, сразу идущие к escalation gate, часто оставляют rescue-eligible доллары на столе. Стандартный фрейм: сначала перестроить retry-логику и dunning-лестницу, измерить сдвиг cure-rate и time-to-cure на одной когорте, затем переосмыслить escalation gate, когда upstream flow настроен. LTV отслеживается рядом с кэшем — возвращённые доллары, отъедающие подписчика в churn, не являются net-wins.',
    'Los despliegues de suscripción que van directamente al escalation gate suelen dejar dólares rescue-eligible sobre la mesa. El marco estándar es reconstruir primero la retry-logic y la escalera de dunning, medir el cambio en cure rate y time-to-cure en una sola cohorte, y luego reexaminar el escalation gate una vez que el flujo upstream está ajustado. El LTV se rastrea junto con la caja — los dólares recuperados que hacen churn al suscriptor no son ganancias netas.');
add('Failed-payment cohort pull, retry-logic audit, dunning-ladder review. Baseline cure rate, time-to-cure distribution, and involuntary-churn percentage documented.',
    'Выборка когорты failed payments, аудит retry-логики, ревью dunning-лестницы. Базовые cure rate, распределение time-to-cure и процент involuntary churn задокументированы.',
    'Extracción de cohorte de pagos fallidos, auditoría de retry-logic, revisión de escalera de dunning. Cure rate base, distribución de time-to-cure y porcentaje de churn involuntario documentados.');
add('Retry timing and dunning ladder live on one subscriber cohort (plan, region, or acquisition channel). Card-update flow surfaced. Cohort-level rescue vs churn segmentation running.',
    'Retry-тайминг и dunning-лестница запущены на одной когорте подписчиков (план, регион или канал привлечения). Flow обновления карты выведен на поверхность. Сегментация rescue vs churn на уровне когорт работает.',
    'Timing de retry y escalera de dunning en vivo en una cohorte de suscriptores (plan, región o canal de adquisición). Flujo de actualización de tarjeta expuesto. Segmentación rescue vs churn a nivel de cohorte en funcionamiento.');
add('Measured: cure rate vs baseline, time-to-cure shift, involuntary-churn delta, LTV preservation on recovered cohort. Broader rollout and escalation-gate rewrite only if metrics justify it.',
    'Измерено: cure rate против baseline, сдвиг time-to-cure, дельта involuntary churn, сохранение LTV на возвращённой когорте. Более широкая раскатка и переписывание escalation gate — только при подтверждающих метриках.',
    'Medido: cure rate vs línea base, desplazamiento de time-to-cure, delta de churn involuntario, preservación de LTV en la cohorte recuperada. Despliegue más amplio y reescritura del escalation gate solo si las métricas lo justifican.');

/* --- revenue-recovery-miami.html --- */
add('Miami, Florida',
    'Майами, Флорида',
    'Miami, Florida');
add('Revenue Recovery Services in Miami, FL',
    'Услуги возврата дебиторки в Майами, Флорида',
    'Servicios de Recuperación de Ingresos en Miami, FL');
add('VitaCoreX LLC extends its structured pre-collection infrastructure to Miami-Dade County, serving operators across South Florida\'s hospitality, healthcare, and construction industries. Miami\'s fast-moving commercial environment creates unique AR challenges that demand localized recovery workflows built for multilingual populations and seasonal revenue cycles.',
    'VitaCoreX LLC расширяет структурированную инфраструктуру pre-collection на округ Miami-Dade, обслуживая операторов в гостиничной, медицинской и строительной индустриях Южной Флориды. Быстро меняющаяся коммерческая среда Майами создаёт уникальные AR-вызовы, требующие локализованных recovery workflows под многоязычную аудиторию и сезонные циклы выручки.',
    'VitaCoreX LLC extiende su infraestructura estructurada de pre-cobranza al condado de Miami-Dade, atendiendo a operadores de las industrias hospitalaria, de salud y construcción del sur de Florida. El entorno comercial acelerado de Miami crea desafíos únicos de cuentas por cobrar que requieren flujos de recuperación localizados para poblaciones multilingües y ciclos estacionales de ingresos.');
add('Hospitality Revenue Recovery in Miami',
    'Возврат дебиторки гостиничного сектора в Майами',
    'Recuperación de Ingresos de Hospitalidad en Miami');
add('Miami-Dade County hosts over 60,000 hotel rooms, thousands of restaurants, and a convention and events industry that generates billions in annual revenue. Hospitality operators from Miami Beach to Coral Gables face persistent challenges with group billing disputes, banquet receivables, and corporate event balances that age past 60 days without structured follow-up. Seasonal revenue swings between peak winter tourism and slower summer months compound the problem, creating cash flow gaps when AR management is most critical.',
    'Miami-Dade насчитывает более 60 000 гостиничных номеров, тысячи ресторанов и конвенционно-событийную индустрию, генерирующую миллиарды годовой выручки. Гостиничные операторы от Miami Beach до Coral Gables постоянно сталкиваются с group-billing спорами, банкетной дебиторкой и балансами корпоративных мероприятий, уходящими за 60 дней без структурированного follow-up. Сезонные колебания выручки между пиковым зимним туризмом и медленным летом усиливают проблему, создавая cash-flow разрывы именно тогда, когда AR-менеджмент критичнее всего.',
    'El condado de Miami-Dade tiene más de 60.000 habitaciones de hotel, miles de restaurantes y una industria de convenciones y eventos que genera miles de millones en ingresos anuales. Los operadores hospitalarios desde Miami Beach hasta Coral Gables enfrentan desafíos persistentes con disputas de facturación grupal, cuentas por cobrar de banquetes y saldos de eventos corporativos que superan los 60 días sin un follow-up estructurado. Los cambios estacionales entre el turismo invernal de temporada alta y los meses más lentos del verano agravan el problema, generando brechas de flujo de caja cuando la gestión de cuentas por cobrar es más crítica.');
add('VitaCoreX builds recovery workflows designed for hospitality-specific billing patterns: group block disputes, catering overages, late cancellation fees, and corporate direct-bill accounts. Our multilingual outreach capacity in English, Spanish, and Portuguese aligns with Miami\'s international business environment, reducing communication barriers that delay payment resolution.',
    'VitaCoreX строит recovery workflows под специфику гостиничного биллинга: споры по групповым блокам, кейтеринговые overages, late cancellation fees и корпоративные direct-bill счета. Наши многоязычные возможности на английском, испанском и португальском соответствуют международной деловой среде Майами и снижают коммуникационные барьеры, задерживающие разрешение оплаты.',
    'VitaCoreX construye flujos de recuperación diseñados para patrones de facturación hospitalaria específicos: disputas de bloqueo grupal, excesos de catering, cargos por cancelación tardía y cuentas corporativas de facturación directa. Nuestra capacidad multilingüe en inglés, español y portugués se alinea con el entorno empresarial internacional de Miami, reduciendo las barreras de comunicación que retrasan la resolución de pagos.');
add('Healthcare Networks Across Miami-Dade',
    'Медицинские сети в Miami-Dade',
    'Redes de Salud en Miami-Dade');
add('Miami\'s healthcare landscape includes major hospital systems like Jackson Health, Baptist Health South Florida, and Mount Sinai Medical Center, alongside hundreds of independent physician groups, ambulatory surgery centers, and urgent care clinics spread across Kendall, Hialeah, Doral, and Homestead. Patient balance recovery in Miami-Dade is complicated by a highly diverse population, multiple language preferences, and a payer mix that includes significant Medicare Advantage and Medicaid managed-care enrollment.',
    'Медицинский ландшафт Майами включает крупные больничные системы Jackson Health, Baptist Health South Florida и Mount Sinai Medical Center, а также сотни независимых врачебных групп, ambulatory surgery centers и urgent care клиник в Kendall, Hialeah, Doral и Homestead. Возврат пациентских балансов в Miami-Dade осложнён крайне разнообразной популяцией, множеством языковых предпочтений и payer mix со значительной долей Medicare Advantage и Medicaid managed-care.',
    'El panorama sanitario de Miami incluye grandes sistemas hospitalarios como Jackson Health, Baptist Health South Florida y Mount Sinai Medical Center, junto con cientos de grupos médicos independientes, centros de cirugía ambulatoria y clínicas de atención urgente repartidos por Kendall, Hialeah, Doral y Homestead. La recuperación de saldos de pacientes en Miami-Dade se complica por una población muy diversa, múltiples preferencias de idioma y un payer mix con importante inscripción en Medicare Advantage y Medicaid managed-care.');
add('VitaCoreX structures patient outreach sequences that account for Miami\'s demographics, delivering communications in the patient\'s preferred language and coordinating with the managed-care plans that dominate the local market. Our documentation infrastructure captures every contact attempt in a compliance-ready format, supporting both HIPAA requirements and Florida\'s consumer protection framework.',
    'VitaCoreX структурирует последовательности outreach с пациентами с учётом демографии Майами, предоставляя коммуникацию на предпочтительном языке пациента и координируясь с managed-care планами, доминирующими на местном рынке. Наша документная инфраструктура фиксирует каждую попытку контакта в compliance-ready формате, поддерживая требования HIPAA и защиту прав потребителей Флориды.',
    'VitaCoreX estructura secuencias de contacto con pacientes que consideran la demografía de Miami, entregando comunicaciones en el idioma preferido del paciente y coordinándose con los planes de managed-care que dominan el mercado local. Nuestra infraestructura documental captura cada intento de contacto en un formato listo para cumplimiento, respaldando los requisitos de HIPAA y el marco de protección al consumidor de Florida.');
add('Construction and Contractor Payment Recovery',
    'Возврат оплаты в строительстве и подрядах',
    'Recuperación de Pagos en Construcción y Contratistas');
add('South Florida\'s construction market operates at a pace and scale that makes payment disputes inevitable. General contractors, subcontractors, and specialty trades across Miami face payment delays driven by change order disputes, retainage holdbacks, and multi-tier billing chains where a single project may involve 30-50 separate vendors. Unpaid invoices in the 60-to-120-day range represent a significant working capital drain for contractors operating on thin margins.',
    'Строительный рынок Южной Флориды работает в темпе и масштабе, делающих payment disputes неизбежными. Генподрядчики, субподрядчики и специализированные направления в Майами сталкиваются с задержками оплаты из-за споров по change order, retainage holdbacks и multi-tier billing-цепочек, в которых один проект может включать 30—50 отдельных поставщиков. Неоплаченные инвойсы в диапазоне 60—120 дней — существенная утечка оборотного капитала для подрядчиков, работающих на тонкой марже.',
    'El mercado de construcción del sur de Florida opera a un ritmo y escala que hacen inevitables las disputas de pago. Contratistas generales, subcontratistas y oficios especializados en Miami enfrentan retrasos de pago por disputas de change order, retainage y cadenas de facturación multinivel donde un solo proyecto puede involucrar 30—50 proveedores distintos. Las facturas impagas de 60 a 120 días representan una fuga significativa de capital de trabajo para contratistas que operan con márgenes ajustados.');
add('VitaCoreX provides structured pre-collection support for construction and B2B operators, including documented escalation sequences, lien-right timeline tracking, and payment demand correspondence that meets Florida statutory requirements under Chapter 713. Our approach preserves business relationships while creating the documentation trail necessary for formal enforcement if voluntary payment does not occur.',
    'VitaCoreX обеспечивает структурированную pre-collection поддержку для строительных и B2B-операторов: задокументированные escalation-последовательности, отслеживание таймлайна lien-прав и payment-demand корреспонденция, соответствующая законам Флориды (глава 713). Наш подход сохраняет бизнес-отношения и создаёт документный след, необходимый для формального принудительного исполнения, если добровольная оплата не происходит.',
    'VitaCoreX ofrece soporte estructurado de pre-cobranza para operadores de construcción y B2B, incluyendo secuencias de escalamiento documentadas, seguimiento del calendario de lien-rights y correspondencia de demanda de pago que cumple los requisitos de la Ley de Florida bajo el Capítulo 713. Nuestro enfoque preserva las relaciones comerciales a la vez que crea el rastro documental necesario para la ejecución formal si el pago voluntario no ocurre.');
add('Miami-Specific Advantages',
    'Преимущества для Майами',
    'Ventajas específicas para Miami');
add('Multilingual Outreach',
    'Многоязычный outreach',
    'Contacto Multilingüe');
add('Miami\'s population is over 70% Hispanic or Latino. Our recovery communications deploy in English, Spanish, and Portuguese, matching the language that will produce the fastest response from each account holder.',
    'Население Майами более чем на 70% Hispanic или Latino. Наши recovery-коммуникации разворачиваются на английском, испанском и португальском — под язык, который даст самый быстрый отклик от конкретного держателя счёта.',
    'Más del 70% de la población de Miami es hispana o latina. Nuestras comunicaciones de recuperación se despliegan en inglés, español y portugués, coincidiendo con el idioma que producirá la respuesta más rápida de cada titular de cuenta.');
add('Seasonal Revenue Calibration',
    'Калибровка сезонной выручки',
    'Calibración Estacional de Ingresos');
add('Miami businesses experience significant revenue swings between peak season (November through April) and off-season. Our recovery timelines adjust outreach intensity based on seasonal cash flow patterns specific to South Florida operators.',
    'Бизнесы Майами переживают значительные колебания выручки между пиковым сезоном (ноябрь—апрель) и off-season. Наши recovery-таймлайны подстраивают интенсивность outreach под сезонные cash-flow паттерны, специфичные для операторов Южной Флориды.',
    'Los negocios de Miami experimentan cambios significativos de ingresos entre la temporada alta (noviembre a abril) y la temporada baja. Nuestros cronogramas de recuperación ajustan la intensidad de contacto según los patrones estacionales de flujo de caja específicos del sur de Florida.');
add('Florida-Compliant Documentation',
    'Документация по нормам Флориды',
    'Documentación Conforme a Florida');
add('Every outreach, escalation, and demand letter follows Florida\'s consumer protection statutes and FDCPA requirements. Litigation-ready documentation from day one means faster resolution if formal enforcement becomes necessary.',
    'Каждый outreach, эскалация и demand letter следуют нормам защиты прав потребителей Флориды и требованиям FDCPA. Litigation-ready документация с первого дня означает более быстрое разрешение, если потребуется формальное принудительное исполнение.',
    'Cada contacto, escalamiento y carta de demanda sigue los estatutos de protección al consumidor de Florida y los requisitos de FDCPA. La documentación lista para litigio desde el día uno significa una resolución más rápida si se vuelve necesaria la ejecución formal.');
add('Start Recovering Revenue in Miami',
    'Начните возвращать дебиторку в Майами',
    'Comience a Recuperar Ingresos en Miami');
add('Call us directly or book a 30-minute consultation to review your current AR aging and identify recovery opportunities specific to your Miami-Dade operation.',
    'Позвоните нам напрямую или забронируйте 30-минутную консультацию, чтобы разобрать текущий aging AR и выявить recovery-возможности для вашей операции в Miami-Dade.',
    'Llámenos directamente o reserve una consulta de 30 minutos para revisar su antigüedad actual de cuentas por cobrar e identificar oportunidades de recuperación específicas para su operación en Miami-Dade.');

/* --- revenue-recovery-orlando.html --- */
add('Orlando, Florida',
    'Орландо, Флорида',
    'Orlando, Florida');
add('Revenue Recovery Services in Orlando, FL',
    'Услуги возврата дебиторки в Орландо, Флорида',
    'Servicios de Recuperación de Ingresos en Orlando, FL');
add('VitaCoreX LLC delivers structured pre-collection recovery infrastructure to operators across Orange County and Central Florida. Orlando\'s tourism-driven economy creates distinct revenue cycle challenges for hospitality venues, attraction operators, and the healthcare providers who serve a transient population of over 75 million annual visitors alongside permanent residents.',
    'VitaCoreX LLC поставляет структурированную инфраструктуру pre-collection операторам в округе Orange и Центральной Флориде. Туристическая экономика Орландо создаёт отдельные вызовы revenue cycle для hospitality, операторов аттракционов и медицинских провайдеров, обслуживающих транзитную популяцию более 75 млн гостей ежегодно плюс постоянных жителей.',
    'VitaCoreX LLC brinda infraestructura estructurada de pre-cobranza a operadores del condado de Orange y Florida Central. La economía turística de Orlando genera desafíos distintos de ciclo de ingresos para sedes de hospitalidad, operadores de atracciones y proveedores de salud que atienden a una población transitoria de más de 75 millones de visitantes anuales además de residentes permanentes.');
add('Tourism and Attraction Operator Recovery',
    'Возврат для туризма и операторов аттракционов',
    'Recuperación para Turismo y Operadores de Atracciones');
add('Orlando is the most-visited destination in the United States, anchored by Walt Disney World, Universal Studios, SeaWorld, and the Orange County Convention Center. The tourism ecosystem extends far beyond the parks into thousands of hotels, vacation rental operators, tour companies, event planners, and transportation services along International Drive and the Kissimmee corridor. These operators face a unique AR challenge: their customers are often out-of-state or international visitors who are difficult to reach once they leave the Orlando area.',
    'Орландо — самое посещаемое направление в США, с якорями Walt Disney World, Universal Studios, SeaWorld и Orange County Convention Center. Туристическая экосистема простирается далеко за пределы парков — в тысячи отелей, операторов vacation rental, туркомпаний, event planners и транспортных сервисов вдоль International Drive и коридора Kissimmee. У этих операторов уникальный AR-вызов: их клиенты часто out-of-state или международные гости, до которых сложно достучаться после их отъезда из Орландо.',
    'Orlando es el destino más visitado de Estados Unidos, anclado por Walt Disney World, Universal Studios, SeaWorld y el Orange County Convention Center. El ecosistema turístico se extiende mucho más allá de los parques hacia miles de hoteles, operadores de rentas vacacionales, empresas de tours, planificadores de eventos y servicios de transporte a lo largo de International Drive y el corredor de Kissimmee. Estos operadores enfrentan un desafío AR único: sus clientes suelen ser visitantes de otros estados o internacionales difíciles de contactar una vez que abandonan el área de Orlando.');
add('VitaCoreX builds recovery workflows tailored to tourism-adjacent businesses where the debtor is geographically dispersed. Our structured outreach sequences prioritize the 14-to-45-day window when contact information is still valid and the customer still recalls the service. For vacation rental operators dealing with property damage claims and late checkout fees, we create documentation-first recovery paths that move from courtesy notice to demand letter within a compressed timeline.',
    'VitaCoreX строит recovery workflows под tourism-adjacent бизнесы, где должник географически разнесён. Наши структурированные последовательности outreach приоритизируют окно 14—45 дней, когда контактная информация ещё актуальна, а клиент ещё помнит услугу. Для операторов vacation rental, работающих с исками об ущербе имуществу и late checkout fees, мы создаём documentation-first recovery-пути, переходящие от courtesy notice к demand letter в сжатом таймлайне.',
    'VitaCoreX construye flujos de recuperación adaptados a negocios adyacentes al turismo donde el deudor está geográficamente disperso. Nuestras secuencias estructuradas de contacto priorizan la ventana de 14 a 45 días cuando la información de contacto sigue siendo válida y el cliente aún recuerda el servicio. Para operadores de vacation rental que gestionan reclamos por daños a la propiedad y cargos por late checkout, creamos rutas de recuperación documentation-first que pasan de aviso cortés a carta de demanda en un cronograma comprimido.');
add('Hospitality and Convention Revenue Recovery',
    'Возврат дебиторки для гостиниц и конвенций',
    'Recuperación de Ingresos de Hospitalidad y Convenciones');
add('Orlando\'s convention industry generates significant group and corporate billing that moves through multi-layer approval chains. Hotels in the Convention Center district, downtown Orlando, and Lake Buena Vista regularly carry $200,000+ in aged group billing receivables from corporate events, trade shows, and association conferences. Disputed master account charges, attrition penalties, and food-and-beverage overages sit in AR queues while hotel revenue teams focus on forward bookings rather than backward collections.',
    'Конвенционная индустрия Орландо генерирует значительный группо-корпоративный биллинг, проходящий через multi-layer approval-цепочки. Отели в Convention Center district, downtown Orlando и Lake Buena Vista регулярно держат $200 000+ старой группо-дебиторки от корпоративных мероприятий, trade shows и ассоциационных конференций. Спорные master account charges, attrition penalties и F&B overages зависают в AR-очередях, пока команды выручки отелей фокусируются на будущих бронированиях, а не на прошлых взысканиях.',
    'La industria de convenciones de Orlando genera una importante facturación grupal y corporativa que pasa por cadenas de aprobación de múltiples capas. Los hoteles del distrito del Convention Center, downtown Orlando y Lake Buena Vista suelen arrastrar más de $200.000 en cuentas por cobrar grupales antiguas de eventos corporativos, ferias y conferencias de asociaciones. Cargos disputados en cuenta maestra, penalizaciones de attrition y excesos de alimentos y bebidas se quedan en las colas de AR mientras los equipos de ingresos de los hoteles se centran en reservas futuras en lugar de cobros pasados.');
add('VitaCoreX provides structured B2B recovery for hospitality operators, including documented escalation to the corporate accounts payable contact, dispute resolution tracking, and compliance-ready correspondence that positions the hotel for favorable resolution whether payment is voluntary or requires formal enforcement. Our process recovers balances that hotel teams have effectively abandoned in their AR aging reports.',
    'VitaCoreX обеспечивает структурированный B2B-возврат для гостиничных операторов: задокументированная эскалация к corporate AP контактам, отслеживание разрешения споров и compliance-ready корреспонденция, дающая отелю позицию для благоприятного разрешения — добровольного или через формальное принудительное исполнение. Наш процесс возвращает балансы, которые команды отеля фактически забросили в своих AR aging-отчётах.',
    'VitaCoreX proporciona recuperación B2B estructurada para operadores hospitalarios, incluidas escalamiento documentado al contacto corporativo de cuentas por pagar, seguimiento de resolución de disputas y correspondencia lista para cumplimiento que posiciona al hotel para una resolución favorable, ya sea que el pago sea voluntario o requiera ejecución formal. Nuestro proceso recupera saldos que los equipos del hotel han abandonado efectivamente en sus reportes de antigüedad de AR.');
add('Healthcare Provider Recovery in Central Florida',
    'Возврат для медицинских провайдеров Центральной Флориды',
    'Recuperación para Proveedores de Salud en Florida Central');
add('Central Florida\'s healthcare market serves both a permanent population of over 2.6 million in the Orlando metro and a transient visitor population that generates emergency room visits, urgent care encounters, and walk-in clinic services throughout the year. AdventHealth, Orlando Health, and HCA Florida Healthcare operate major hospital networks across Orange, Osceola, and Seminole counties, alongside hundreds of independent physician groups and outpatient facilities.',
    'Медицинский рынок Центральной Флориды обслуживает как постоянную популяцию более 2,6 млн в Orlando metro, так и транзитную популяцию посетителей, генерирующую визиты ER, urgent care и walk-in clinic в течение года. AdventHealth, Orlando Health и HCA Florida Healthcare управляют крупными больничными сетями в Orange, Osceola и Seminole, плюс сотни независимых врачебных групп и outpatient-учреждений.',
    'El mercado sanitario de Florida Central atiende tanto a una población permanente de más de 2,6 millones en el área metropolitana de Orlando como a una población transitoria que genera visitas a salas de emergencia, atención urgente y clínicas walk-in durante todo el año. AdventHealth, Orlando Health y HCA Florida Healthcare operan grandes redes hospitalarias en los condados de Orange, Osceola y Seminole, junto con cientos de grupos médicos independientes e instalaciones ambulatorias.');
add('Patient balance recovery in Orlando is complicated by the visitor population: out-of-state patients who receive emergency treatment and leave Florida without resolving their financial obligation. VitaCoreX builds cross-state outreach sequences for these cases while maintaining standard recovery workflows for local patients covered by Florida Blue, Aetna, Cigna, and United Healthcare plans prevalent in the Central Florida market.',
    'Возврат пациентских балансов в Орландо осложнён визитерской популяцией: out-of-state пациенты получают экстренную помощь и уезжают из Флориды, не разрешив финансовое обязательство. VitaCoreX строит cross-state outreach-последовательности для таких случаев, одновременно поддерживая стандартные recovery workflows для местных пациентов, покрываемых Florida Blue, Aetna, Cigna и United Healthcare — ключевыми планами рынка Центральной Флориды.',
    'La recuperación de saldos de pacientes en Orlando se complica por la población visitante: pacientes de fuera del estado que reciben tratamiento de emergencia y abandonan Florida sin resolver su obligación financiera. VitaCoreX construye secuencias de contacto interestatales para estos casos mientras mantiene flujos estándar de recuperación para pacientes locales cubiertos por los planes Florida Blue, Aetna, Cigna y United Healthcare dominantes en el mercado de Florida Central.');
add('Orlando Market Advantages',
    'Преимущества для рынка Орландо',
    'Ventajas del Mercado de Orlando');
add('Tourism-Calibrated Recovery',
    'Recovery под туризм',
    'Recuperación Calibrada para Turismo');
add('Orlando\'s transient customer base demands compressed recovery timelines. Our workflows prioritize early outreach when contact data is fresh, recovering balances from out-of-state visitors before they become unreachable.',
    'Транзитная клиентская база Орландо требует сжатых recovery-таймлайнов. Наши workflows приоритизируют ранний outreach, пока контактные данные свежие, возвращая балансы от out-of-state посетителей до того, как они станут недоступны.',
    'La base de clientes transitoria de Orlando exige cronogramas de recuperación comprimidos. Nuestros flujos priorizan el contacto temprano cuando los datos de contacto están frescos, recuperando saldos de visitantes de fuera del estado antes de que se vuelvan inalcanzables.');
add('Convention and Group Billing',
    'Конвенции и group billing',
    'Facturación de Convenciones y Grupos');
add('We handle the complex B2B recovery that Orlando hospitality teams deprioritize: group master account disputes, attrition penalties, and corporate direct-bill aging that accumulates across convention seasons.',
    'Мы ведём сложный B2B recovery, который гостиничные команды Орландо деприоритизируют: споры group master account, attrition penalties и aging корпоративного direct-bill, накапливающийся сезонами конвенций.',
    'Manejamos la compleja recuperación B2B que los equipos hospitalarios de Orlando despriorizan: disputas de master account grupal, penalizaciones de attrition y antigüedad de facturación directa corporativa que se acumula entre temporadas de convenciones.');
add('Cross-State Patient Recovery',
    'Межштатное восстановление пациентских балансов',
    'Recuperación Interestatal de Pacientes');
add('For healthcare providers treating visitors, our cross-state outreach infrastructure reaches patients who have returned home to other states, using documented contact sequences that comply with multi-state consumer protection requirements.',
    'Для медицинских провайдеров, лечащих посетителей, наша cross-state outreach инфраструктура достигает пациентов, вернувшихся домой в другие штаты, используя задокументированные последовательности контактов, соответствующие multi-state требованиям защиты прав потребителей.',
    'Para proveedores de salud que atienden a visitantes, nuestra infraestructura de contacto interestatal llega a pacientes que regresaron a casa en otros estados, usando secuencias de contacto documentadas que cumplen los requisitos de protección al consumidor de múltiples estados.');
add('Start Recovering Revenue in Orlando',
    'Начните возвращать дебиторку в Орландо',
    'Comience a Recuperar Ingresos en Orlando');
add('Call us directly or book a 30-minute consultation to review your current AR aging and identify recovery opportunities specific to your Central Florida operation.',
    'Позвоните нам напрямую или забронируйте 30-минутную консультацию, чтобы разобрать текущий aging AR и выявить recovery-возможности для вашей операции в Центральной Флориде.',
    'Llámenos directamente o reserve una consulta de 30 minutos para revisar su antigüedad actual de cuentas por cobrar e identificar oportunidades de recuperación específicas para su operación en Florida Central.');

/* --- revenue-recovery-tampa.html --- */
add('Revenue Recovery Services in Tampa, FL',
    'Услуги возврата дебиторки в Тампе, Флорида',
    'Servicios de Recuperación de Ingresos en Tampa, FL');
add('VitaCoreX LLC is headquartered in Tampa and delivers structured pre-collection recovery infrastructure to operators across Hillsborough County and the greater Tampa Bay region. We work with healthcare providers, dental practices, and fitness operators to recover aged balances before they reach write-off or third-party placement.',
    'Головной офис VitaCoreX LLC находится в Тампе. Мы поставляем структурированную инфраструктуру pre-collection операторам в округе Hillsborough и большом регионе Tampa Bay. Работаем с медицинскими провайдерами, стоматологическими практиками и фитнес-операторами, возвращая старые балансы до того, как они дойдут до write-off или third-party placement.',
    'VitaCoreX LLC tiene sede en Tampa y brinda infraestructura estructurada de pre-cobranza a operadores del condado de Hillsborough y la gran área de Tampa Bay. Trabajamos con proveedores de salud, prácticas dentales y operadores de fitness para recuperar saldos antiguos antes de que lleguen al castigo o la colocación a terceros.');
add('Healthcare Revenue Recovery in Tampa',
    'Возврат дебиторки в здравоохранении Тампы',
    'Recuperación de Ingresos de Salud en Tampa');
add('Tampa\'s healthcare market includes over 25 hospitals, hundreds of specialty clinics, and a growing network of urgent care and outpatient surgical centers. Providers across South Tampa, Westchase, Brandon, and Temple Terrace face persistent patient-balance leakage in the 30-to-90-day window after service delivery. High-deductible health plans have shifted financial responsibility to patients, and many Tampa-area practices absorb 8-12% revenue loss from balances that age past 120 days without structured follow-up.',
    'Медицинский рынок Тампы — более 25 больниц, сотни специализированных клиник и растущая сеть urgent care и outpatient surgical centers. Провайдеры в South Tampa, Westchase, Brandon и Temple Terrace сталкиваются с постоянной утечкой patient-balance в окне 30—90 дней после оказания услуги. High-deductible планы сместили финансовую ответственность на пациентов, и многие практики Тампы теряют 8—12% выручки на балансах, проходящих за 120 дней без структурированного follow-up.',
    'El mercado de salud de Tampa incluye más de 25 hospitales, cientos de clínicas especializadas y una red creciente de atención urgente y centros quirúrgicos ambulatorios. Los proveedores en South Tampa, Westchase, Brandon y Temple Terrace enfrentan una fuga persistente de saldos de pacientes en la ventana de 30 a 90 días tras la prestación del servicio. Los planes de salud con deducibles altos han trasladado la responsabilidad financiera a los pacientes, y muchas prácticas del área de Tampa absorben un 8—12% de pérdida de ingresos de saldos que superan los 120 días sin un follow-up estructurado.');
add('VitaCoreX builds tiered outreach sequences calibrated to Tampa\'s payer mix, including coordination with Florida Blue, Aetna, and United Healthcare plans that dominate the Hillsborough County market. Our structured documentation ensures every patient interaction is logged, timestamped, and escalation-ready if the balance moves toward formal collection.',
    'VitaCoreX строит tiered outreach-последовательности, откалиброванные под payer mix Тампы, включая координацию с Florida Blue, Aetna и United Healthcare — ключевыми планами рынка Hillsborough. Наша структурированная документация обеспечивает, что каждое взаимодействие с пациентом залогировано, с timestamp и готово к эскалации, если баланс пойдёт к формальному взысканию.',
    'VitaCoreX construye secuencias de contacto escalonadas calibradas al payer mix de Tampa, incluida la coordinación con los planes Florida Blue, Aetna y United Healthcare que dominan el mercado del condado de Hillsborough. Nuestra documentación estructurada garantiza que cada interacción con el paciente esté registrada, con timestamp y lista para escalamiento si el saldo avanza hacia cobro formal.');
add('Dental Practice Recovery Across Tampa Bay',
    'Возврат для стоматологических практик Tampa Bay',
    'Recuperación para Prácticas Dentales en Tampa Bay');
add('Tampa Bay supports over 1,200 dental practices ranging from solo general dentistry offices in Carrollwood and Riverview to multi-location DSO-affiliated groups in downtown Tampa and Westshore. Dental AR presents unique challenges: smaller average balances, high patient volume, and front-desk teams stretched between scheduling, insurance verification, and follow-up. The result is consistent leakage on balances between $150 and $2,000 that never receive a second contact attempt.',
    'В Tampa Bay работает более 1 200 стоматологических практик — от сольных врачей в Carrollwood и Riverview до multi-location DSO-групп в downtown Tampa и Westshore. Dental AR несёт уникальные вызовы: меньшие средние балансы, большой поток пациентов и front-desk команды, разрывающиеся между scheduling, страховой верификацией и follow-up. Результат — стабильная утечка на балансах от $150 до $2 000, по которым никогда не было второй попытки контакта.',
    'Tampa Bay alberga más de 1.200 prácticas dentales, desde consultorios generales individuales en Carrollwood y Riverview hasta grupos multi-sede afiliados a DSO en downtown Tampa y Westshore. El AR dental presenta desafíos únicos: saldos promedio menores, alto volumen de pacientes y equipos de recepción estirados entre agenda, verificación de seguros y follow-up. El resultado es una fuga consistente en saldos entre $150 y $2.000 que nunca reciben un segundo intento de contacto.');
add('VitaCoreX provides dental-specific recovery workflows that integrate with practice management systems. We handle the structured outreach that front-desk staff cannot prioritize, recovering balances that would otherwise age into write-off territory within 90-120 days.',
    'VitaCoreX предоставляет dental-specific recovery workflows, интегрирующиеся с practice management системами. Мы ведём структурированный outreach, который front-desk персонал не может приоритизировать, возвращая балансы, которые иначе зашли бы в write-off за 90—120 дней.',
    'VitaCoreX ofrece flujos de recuperación específicos para dental que se integran con sistemas de practice management. Manejamos el contacto estructurado que el personal de recepción no puede priorizar, recuperando saldos que de otra manera envejecerían hasta el castigo en 90—120 días.');
add('Gym and Fitness Membership Recovery',
    'Возврат по членствам gym и фитнеса',
    'Recuperación de Membresías de Gym y Fitness');
add('Tampa\'s fitness industry extends from large-format gyms along Dale Mabry Highway to boutique studios in Hyde Park, SoHo, and Seminole Heights. Membership-based operators deal with involuntary churn from failed credit card charges, disputed billing, and members who stop attending but remain under contract. A single gym location in Tampa can accumulate $15,000-$40,000 in unrecovered membership fees annually.',
    'Фитнес-индустрия Тампы — от large-format гимов вдоль Dale Mabry Highway до бутик-студий в Hyde Park, SoHo и Seminole Heights. Membership-операторы имеют дело с involuntary churn от неудачных списаний с карт, спорных биллингов и участников, прекративших посещение, но оставшихся по контракту. Одна фитнес-точка в Тампе может накопить $15 000—$40 000 невозвращённых membership-сборов в год.',
    'La industria del fitness de Tampa va desde gimnasios de gran formato a lo largo de Dale Mabry Highway hasta estudios boutique en Hyde Park, SoHo y Seminole Heights. Los operadores basados en membresías lidian con churn involuntario por cargos fallidos de tarjeta de crédito, facturación disputada y miembros que dejan de asistir pero permanecen bajo contrato. Una sola sede de gimnasio en Tampa puede acumular $15.000—$40.000 anuales en cuotas de membresía no recuperadas.');
add('Our pre-collection recovery system targets failed payments within the first 14-30 days, using structured outreach that preserves the member relationship while recovering revenue. This approach recovers 35-55 cents on the dollar compared to 10-14 cents through traditional agency placement after 120+ days.',
    'Наша pre-collection система нацелена на неудачные платежи в первые 14—30 дней, используя структурированный outreach, сохраняющий отношения с участником и возвращающий выручку. Этот подход возвращает 35—55 центов с доллара против 10—14 центов при традиционном размещении в агентстве после 120+ дней.',
    'Nuestro sistema de recuperación de pre-cobranza apunta a los pagos fallidos dentro de los primeros 14—30 días, usando un contacto estructurado que preserva la relación con el miembro mientras recupera ingresos. Este enfoque recupera 35—55 centavos por dólar frente a 10—14 centavos mediante colocación tradicional en agencia después de los 120+ días.');
add('Why Tampa Operators Choose VitaCoreX',
    'Почему операторы Тампы выбирают VitaCoreX',
    'Por Qué los Operadores de Tampa Eligen VitaCoreX');
add('Local Presence, Direct Access',
    'Локальное присутствие, прямой доступ',
    'Presencia Local, Acceso Directo');
add('Our headquarters sit in Tampa. You work with a local team that understands Hillsborough County\'s business environment, payer landscape, and regulatory context. No offshore call centers or generic templates.',
    'Наш офис — в Тампе. Вы работаете с местной командой, понимающей деловую среду Hillsborough, payer landscape и регуляторный контекст. Никаких offshore call-центров и generic-шаблонов.',
    'Nuestra sede está en Tampa. Trabaja con un equipo local que entiende el entorno empresarial del condado de Hillsborough, el panorama de pagadores y el contexto regulatorio. Sin call centers offshore ni plantillas genéricas.');
add('Pre-Collection, Not Debt Collection',
    'Pre-collection, а не debt collection',
    'Pre-cobranza, No Cobranza');
add('We operate in the window before traditional collections. Structured outreach, compliant documentation, and escalation-ready files mean higher recovery rates and lower patient friction than agency placement.',
    'Мы работаем в окне до традиционных коллекторов. Структурированный outreach, compliant-документация и escalation-ready файлы дают более высокие recovery rates и меньше трения с пациентом, чем размещение в агентстве.',
    'Operamos en la ventana previa a la cobranza tradicional. Contacto estructurado, documentación conforme y expedientes listos para escalamiento significan tasas de recuperación más altas y menor fricción con el paciente que la colocación en agencia.');
add('Measurable Outcomes',
    'Измеримые результаты',
    'Resultados Medibles');
add('Every engagement starts with a current-state leakage review. We identify where revenue is falling off, build the recovery workflow, and measure results against a defined baseline. No vague promises.',
    'Каждый проект начинается с обзора current-state leakage. Мы определяем, где выручка утекает, строим recovery workflow и измеряем результаты против заданного baseline. Никаких расплывчатых обещаний.',
    'Cada compromiso comienza con una revisión de fuga del estado actual. Identificamos dónde se está perdiendo el ingreso, construimos el flujo de recuperación y medimos resultados contra una línea base definida. Sin promesas vagas.');
add('Schedule a Revenue Recovery Assessment',
    'Запишитесь на оценку возврата дебиторки',
    'Agende una Evaluación de Recuperación de Ingresos');
add('Call us directly or book a 30-minute consultation to review your current AR aging and identify recovery opportunities specific to your Tampa-area operation.',
    'Позвоните нам напрямую или забронируйте 30-минутную консультацию, чтобы разобрать текущий aging AR и выявить recovery-возможности для вашей операции в регионе Тампы.',
    'Llámenos directamente o reserve una consulta de 30 minutos para revisar su antigüedad actual de cuentas por cobrar e identificar oportunidades de recuperación específicas para su operación en el área de Tampa.');

/* ----------------------------------------------------------------
   404 / about / app / contact / cookie-policy / corporate-legal-file-control /
   industries / resources / thank-you / redirect pages
   ---------------------------------------------------------------- */

// --- 404.html ---
add('Page Not Found',
    'Страница не найдена',
    'Página no encontrada');
add('The page you\'re looking for may have been moved or no longer exists. VitaCoreX LLC provides revenue recovery, immigration services, LLC formation, auto deal review, and legal document services for businesses and individuals.',
    'Возможно, страница была перемещена или больше не существует. VitaCoreX LLC предоставляет услуги возврата дебиторки, иммиграционные услуги, регистрацию LLC, разбор авто-сделок и юридические документарные сервисы для бизнеса и частных клиентов.',
    'Es posible que la página haya sido movida o ya no exista. VitaCoreX LLC ofrece recuperación de ingresos, servicios de inmigración, formación de LLC, revisión de operaciones de autos y servicios de documentos legales para empresas y particulares.');
add('Explore Our Services',
    'Наши услуги',
    'Explore nuestros servicios');
add('Pre-collection workflows for healthcare, dental, gyms, SaaS',
    'Процессы pre-collection для медицины, стоматологии, фитнеса и SaaS',
    'Flujos previos a la cobranza para salud, odontología, gimnasios y SaaS');
add('Corporate document management and litigation support',
    'Корпоративный документооборот и поддержка судебных процессов',
    'Gestión de documentos corporativos y soporte en litigios');
add('USCIS packet preparation, visa, green card documentation',
    'Подготовка пакетов USCIS, визовая и грин-карт документация',
    'Preparación de paquetes USCIS, visa y documentación de green card');
add('LLC, S-Corp, C-Corp formation in Florida',
    'Регистрация LLC, S-Corp, C-Corp во Флориде',
    'Formación de LLC, S-Corp y C-Corp en Florida');
add('Dealer fee analysis, GAP insurance, loan calculator',
    'Разбор комиссий дилера, GAP-страховка, кредитный калькулятор',
    'Análisis de tarifas del concesionario, seguro GAP y calculadora de préstamo');
add('AI contract analysis, NDA, non-compete review',
    'AI-анализ контрактов, NDA, проверка non-compete',
    'Análisis de contratos con IA, NDA y revisión de no competencia');
add('Healthcare, dental, gyms, fleet, construction, SaaS',
    'Медицина, стоматология, фитнес, автопарки, строительство, SaaS',
    'Salud, odontología, gimnasios, flotas, construcción, SaaS');
add('Tampa FL • EN / RU / ES • (888) 794-8292',
    'Тампа, Флорида • EN / RU / ES • (888) 794-8292',
    'Tampa FL • EN / RU / ES • (888) 794-8292');

// --- about.html ---
add('Leadership',
    'Руководство',
    'Liderazgo');
add('Who runs VitaCoreX.',
    'Кто руководит VitaCoreX.',
    'Quién dirige VitaCoreX.');
add('Boutique advisory firms are bought as much for the principal as for the method. This page exists to make that principal visible — and verifiable — before the first call.',
    'В бутиковых консалтинговых фирмах клиент покупает не только метод, но и руководителя. Эта страница существует, чтобы сделать его видимым — и проверяемым — до первого звонка.',
    'En firmas de asesoría boutique se contrata tanto al principal como al método. Esta página existe para hacer visible — y verificable — a ese principal antes de la primera llamada.');
add('Steven Miller',
    'Стивен Миллер',
    'Steven Miller');
add('Founder & Managing Director',
    'Основатель и управляющий директор',
    'Fundador y director general');
add('Steven founded VitaCoreX LLC in 2025 to close a practical gap operators kept describing: administrative work that was not legal enough to require outside counsel, but not simple enough to run cleanly in-house — and that steadily bled margin before anyone escalated it. The firm focuses on three operational lanes: revenue recovery design, corporate legal file control, and structured case intake.',
    'Стивен основал VitaCoreX LLC в 2025 году, чтобы закрыть практический пробел, о котором операторы говорили снова и снова: административная работа, которая недостаточно юридическая, чтобы привлекать внешнего советника, но и не настолько простая, чтобы чисто вести её внутри — и которая стабильно размывает маржу до того, как кто-то её эскалирует. Фирма работает по трём операционным линиям: дизайн возврата доходов, контроль корпоративных юридических файлов и структурированный intake кейсов.',
    'Steven fundó VitaCoreX LLC en 2025 para cerrar una brecha práctica que los operadores repetían: trabajo administrativo no lo suficientemente legal como para requerir asesoría externa, pero tampoco lo suficientemente simple como para gestionarse limpiamente dentro de la empresa — y que erosionaba el margen antes de que alguien lo escalara. La firma se enfoca en tres líneas operativas: diseño de recuperación de ingresos, control de archivos legales corporativos e intake estructurado de casos.');
add('VitaCoreX is intentionally positioned as a boutique, non-agency, non-law-firm advisory so engagements stay measurable and handoffs stay clean. Steven works directly with finance-led and counsel-adjacent operators who want cash-control logic and packet discipline in place before outside cost expands. Verification points — Sunbiz entity record, EIN, and LinkedIn — are made available before any engagement commitment.',
    'VitaCoreX намеренно позиционирована как бутиковая не-агентская и не-юридическая консалтинговая фирма, чтобы проекты оставались измеримыми, а передачи материалов чистыми. Стивен работает напрямую с операторами, где финансы ведут повестку, а также с counsel-adjacent командами, которым нужна логика контроля cash и дисциплина packet до того, как расходы на внешних подрядчиков раздуются. Точки верификации — запись Sunbiz, EIN и LinkedIn — предоставляются до любых обязательств по сотрудничеству.',
    'VitaCoreX está intencionalmente posicionada como una firma boutique de asesoría — no es una agencia y no es un bufete — para que los compromisos permanezcan medibles y las entregas permanezcan limpias. Steven trabaja directamente con operadores liderados por finanzas y equipos counsel-adjacent que quieren lógica de control de efectivo y disciplina de paquetes antes de que el costo externo se expanda. Los puntos de verificación — registro de Sunbiz, EIN y LinkedIn — están disponibles antes de cualquier compromiso de contratación.');
add('For procurement and security teams',
    'Для отделов закупок и безопасности',
    'Para equipos de compras y seguridad');
add('Vendor onboarding packets — including W-9, Certificate of Insurance, data handling procedures, and references — are provided during procurement review. Request these materials directly at stevenmiller@vitacorexllc.com.',
    'Пакеты onboarding вендора — включая W-9, Certificate of Insurance, процедуры обработки данных и референсы — предоставляются в рамках procurement review. Запросите эти материалы напрямую на stevenmiller@vitacorexllc.com.',
    'Los paquetes de onboarding de proveedor — incluyendo W-9, Certificado de Seguro, procedimientos de manejo de datos y referencias — se entregan durante la revisión de compras. Solicite estos materiales directamente en stevenmiller@vitacorexllc.com.');
add('Founder LinkedIn, Sunbiz entity record, and EIN are independently verifiable before any engagement commitment.',
    'LinkedIn основателя, запись в Sunbiz и EIN можно независимо проверить до принятия любых обязательств по сотрудничеству.',
    'El LinkedIn del fundador, el registro en Sunbiz y el EIN son verificables de forma independiente antes de cualquier compromiso de contratación.');

// --- app.html ---
add('Workspace redirect',
    'Переадресация в рабочее пространство',
    'Redirección al workspace');
add('The secure VitaCoreX workspace now opens from the current sign-in route.',
    'Защищённое рабочее пространство VitaCoreX теперь открывается по текущему маршруту входа.',
    'El workspace seguro de VitaCoreX ahora se abre desde la ruta de inicio de sesión actual.');
add('This utility page is no longer a public product surface. It forwards operators to the active secure entry instead of the older legacy handoff.',
    'Эта служебная страница больше не является публичной частью продукта. Она перенаправляет операторов на актуальную защищённую точку входа вместо устаревшего handoff.',
    'Esta página utilitaria ya no es una superficie pública del producto. Redirige a los operadores al punto de acceso seguro activo en lugar del handoff heredado.');
add('VitaCoreX is not a law firm.',
    'VitaCoreX не является юридической фирмой.',
    'VitaCoreX no es un bufete de abogados.');

// --- contact.html (disclaimer variant) ---
add('VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. It is not a law firm and not a licensed collection agency.',
    'VitaCoreX LLC предоставляет административные, документарные, операционные и бизнес-поддерживающие услуги. Компания не является юридической фирмой и не является лицензированным коллекторским агентством.',
    'VitaCoreX LLC ofrece servicios administrativos, documentales, de flujo de trabajo y de soporte empresarial. No es un bufete de abogados ni una agencia de cobranza con licencia.');

// --- cookie-policy.html ---
add('Cookie policy',
    'Политика cookie',
    'Política de cookies');
add('How the site handles essential functionality, analytics consent, and configured measurement tools.',
    'Как сайт работает с необходимыми функциями, согласием на аналитику и настроенными измерительными инструментами.',
    'Cómo gestiona el sitio la funcionalidad esencial, el consentimiento de analítica y las herramientas de medición configuradas.');
add('The site already had a consent banner. This page makes the consent logic and tracker categories explicit.',
    'На сайте уже был баннер согласия. Эта страница делает явной логику согласия и категории трекеров.',
    'El sitio ya tenía un banner de consentimiento. Esta página explicita la lógica de consentimiento y las categorías de trackers.');
add('How cookies are used',
    'Как используются cookie',
    'Cómo se usan las cookies');
add('The site uses essential functionality plus optional analytics and marketing measurement tools. Optional tools are intended to load only after consent.',
    'Сайт использует необходимые функции плюс опциональные инструменты аналитики и маркетингового измерения. Опциональные инструменты загружаются только после согласия.',
    'El sitio usa funcionalidad esencial más herramientas opcionales de analítica y medición de marketing. Las herramientas opcionales están diseñadas para cargarse solo después del consentimiento.');
add('Consent choices',
    'Варианты согласия',
    'Opciones de consentimiento');
add('Essential only: basic site operation without optional analytics or marketing tags.',
    'Только необходимые: базовая работа сайта без опциональных тегов аналитики или маркетинга.',
    'Solo esenciales: operación básica del sitio sin etiquetas opcionales de analítica o marketing.');
add('Analytics only: essential functionality plus analytics-focused measurement.',
    'Только аналитика: необходимая функциональность плюс аналитическое измерение.',
    'Solo analítica: funcionalidad esencial más medición orientada a analítica.');
add('Accept all: essential, analytics, and any configured campaign/marketing measurement tools.',
    'Принять все: необходимые, аналитика и любые настроенные инструменты измерения кампаний/маркетинга.',
    'Aceptar todo: esenciales, analítica y cualquier herramienta de medición de campaña/marketing configurada.');
add('Configured tracker slots',
    'Настроенные слоты трекеров',
    'Slots de trackers configurados');
add('The site is prepared for Google Analytics 4, Google Tag Manager, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag, and Apollo website tracking. Whether each tool is active depends on the current deployment settings and consent choice.',
    'Сайт подготовлен для Google Analytics 4, Google Tag Manager, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag и Apollo website tracking. Активен ли каждый инструмент, зависит от текущих настроек деплоя и выбора согласия.',
    'El sitio está preparado para Google Analytics 4, Google Tag Manager, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag y Apollo website tracking. Si cada herramienta está activa depende de la configuración del despliegue actual y de la elección de consentimiento.');
add('Managing consent',
    'Управление согласием',
    'Gestión del consentimiento');
add('You can manage consent through the banner when it is shown. Browser settings can also be used to control or clear cookies.',
    'Вы можете управлять согласием через баннер, когда он отображается. Настройки браузера также можно использовать для контроля или очистки cookie.',
    'Puede gestionar el consentimiento desde el banner cuando se muestra. También se pueden usar los ajustes del navegador para controlar o borrar cookies.');

// --- corporate-legal-file-control.html ---
add('Estimator',
    'Калькулятор',
    'Estimador');
add('Impact view',
    'Вид влияния',
    'Vista de impacto');
add('Use the estimator to quantify how much high-cost attorney time may be consumed by administrative file preparation.',
    'Используйте калькулятор, чтобы оценить, сколько дорогого времени адвоката может уходить на административную подготовку файлов.',
    'Use el estimador para cuantificar cuánto tiempo costoso de abogado puede consumirse en la preparación administrativa de expedientes.');
add('Upload contracts for server-side clause extraction, risk scoring, and structured analysis memos.',
    'Загружайте контракты для серверного извлечения пунктов, оценки рисков и структурированных аналитических меморандумов.',
    'Suba contratos para extracción de cláusulas del lado del servidor, puntuación de riesgo y memos de análisis estructurado.');
add('Secure portal for matter status, document uploads, comments thread, and deliverable downloads.',
    'Защищённый портал для статуса дела, загрузки документов, обсуждения и скачивания результатов.',
    'Portal seguro para estado del asunto, carga de documentos, hilo de comentarios y descarga de entregables.');

// --- industries.html ---
add('A tighter wedge improves both buyer clarity and search relevance. These pages show where the operational model has the strongest natural fit.',
    'Более узкий фокус повышает как ясность для покупателя, так и релевантность в поиске. Эти страницы показывают, где операционная модель ложится естественнее всего.',
    'Un enfoque más estrecho mejora tanto la claridad para el comprador como la relevancia en búsqueda. Estas páginas muestran dónde el modelo operativo tiene el encaje natural más fuerte.');
add('The page should never promise guaranteed rankings or fixed performance outcomes. It should explain fit, process, and evidence standards.',
    'Страница никогда не должна обещать гарантированные позиции или фиксированные результаты. Она должна объяснять соответствие, процесс и стандарты доказательств.',
    'La página nunca debe prometer rankings garantizados ni resultados fijos. Debe explicar ajuste, proceso y estándares de evidencia.');

// --- resources.html ---
add('5 leakage points in healthcare operators, why sequencing matters, and how early agency escalation compresses margin.',
    '5 точек утечки у операторов здравоохранения, почему важна последовательность и как ранняя эскалация в агентство сжимает маржу.',
    '5 puntos de fuga en operadores de salud, por qué importa la secuencia y cómo la escalada temprana a una agencia comprime el margen.');
add('Compact CFO-facing summary with DSO, leakage, and executive rationale.',
    'Компактное CFO-обобщение с DSO, leakage и executive-обоснованием.',
    'Resumen compacto para el CFO con DSO, fugas y justificación ejecutiva.');
add('Institutional deck for pilot economics, operating framework, and executive positioning.',
    'Институциональная презентация об экономике пилота, операционной модели и executive-позиционировании.',
    'Deck institucional sobre economía del piloto, marco operativo y posicionamiento ejecutivo.');
add('Framework logic, escalation control, and executive review for pre-agency sequencing.',
    'Логика фреймворка, контроль эскалации и executive review для последовательности до агентства.',
    'Lógica del marco, control de escalada y revisión ejecutiva para la secuencia previa a la agencia.');
add('Proprietary methodology materials for executive review and internal forwarding.',
    'Материалы собственной методологии для executive review и внутренней пересылки.',
    'Materiales de metodología propia para revisión ejecutiva y reenvío interno.');
add('Each PDF is designed to move a specific internal conversation — recovery economics, DSO leakage, pilot structure — past the first meeting without another sales call.',
    'Каждый PDF создан, чтобы продвинуть конкретный внутренний разговор — экономика возврата, DSO leakage, структура пилота — дальше первой встречи без ещё одного sales call.',
    'Cada PDF está diseñado para mover una conversación interna específica — economía de recuperación, fugas de DSO, estructura de piloto — más allá de la primera reunión sin otra llamada de ventas.');
add('Share them with your CFO, operations lead, or counsel-adjacent team. The "proprietary" badge means the underlying methodology is copyrighted; the document itself is intended for distribution inside the recipient\'s organization. For engagement-specific deliverables or custom analysis, request a confidential review.',
    'Делитесь ими с CFO, руководителем операций или командой, работающей рядом с counsel. Бейдж «proprietary» означает, что лежащая в основе методология защищена авторским правом; сам документ предназначен для распространения внутри организации получателя. Для deliverables под конкретное engagement или кастомного анализа запросите конфиденциальный разбор.',
    'Compártalos con su CFO, responsable de operaciones o equipo cercano a los abogados. La insignia "proprietary" indica que la metodología subyacente está protegida por derechos de autor; el documento en sí está destinado a distribuirse dentro de la organización del receptor. Para entregables específicos del engagement o análisis a medida, solicite una revisión confidencial.');
add('That makes the resource library more than lead bait. It becomes a forwarding tool for owners, CFOs, operators, and counsel-adjacent teams.',
    'Это делает библиотеку ресурсов чем-то большим, чем lead bait. Она становится инструментом пересылки для владельцев, CFO, операторов и команд, работающих рядом с counsel.',
    'Eso convierte la biblioteca de recursos en algo más que lead bait. Se convierte en una herramienta de reenvío para dueños, CFO, operadores y equipos cercanos a los abogados.');

// --- thank-you.html ---
add('Thank you. We received your request.',
    'Спасибо. Мы получили ваш запрос.',
    'Gracias. Hemos recibido su solicitud.');
add('Your request has been logged. A team review typically begins within 1-2 business days once the submission is complete.',
    'Ваш запрос зарегистрирован. Разбор командой обычно начинается в течение 1–2 рабочих дней после получения полной информации.',
    'Su solicitud ha quedado registrada. La revisión del equipo suele comenzar en 1–2 días hábiles tras completarse el envío.');

// --- redirect pages (HTML children — translated value must include the <a>) ---
add('Redirecting to additional-services.html',
    'Переадресация на <a href="additional-services.html">additional-services.html</a>',
    'Redirigiendo a <a href="additional-services.html">additional-services.html</a>');
add('Redirecting to corporate-legal-file-control.html',
    'Переадресация на <a href="corporate-legal-file-control.html">corporate-legal-file-control.html</a>',
    'Redirigiendo a <a href="corporate-legal-file-control.html">corporate-legal-file-control.html</a>');
add('Redirecting to revenue-recovery-workflow.html',
    'Переадресация на <a href="revenue-recovery-workflow.html">revenue-recovery-workflow.html</a>',
    'Redirigiendo a <a href="revenue-recovery-workflow.html">revenue-recovery-workflow.html</a>');

/* ----------------------------------------------------------------
   solutions.html
   ---------------------------------------------------------------- */
add('The site now makes the three lanes more legible so buyers do not confuse a recovery problem with a file-control problem or a routing problem.',
    'Сайт теперь делает три направления более читаемыми, чтобы покупатели не путали проблему возврата с проблемой контроля файлов или проблемой маршрутизации.',
    'El sitio ahora hace más legibles los tres carriles para que los compradores no confundan un problema de recuperación con uno de control de archivos o de enrutamiento.');
add('Engagement tiers',
    'Уровни сотрудничества',
    'Niveles de engagement');
add('Three entry points. Every commitment starts with a measurable scope.',
    'Три точки входа. Каждое обязательство начинается с измеримого объёма работ.',
    'Tres puntos de entrada. Cada compromiso comienza con un alcance medible.');
add('Indicative ranges below reflect current pilot and programme structures. Final fee is confirmed after the confidential review and depends on matter volume, industry compliance scope, and integration complexity.',
    'Диапазоны ниже — ориентировочные, они отражают текущие структуры пилотов и программ. Итоговая стоимость подтверждается после конфиденциального разбора и зависит от объёма дел, compliance-рамок отрасли и сложности интеграции.',
    'Los rangos indicativos a continuación reflejan las estructuras actuales de pilotos y programas. La tarifa final se confirma tras la revisión confidencial y depende del volumen de asuntos, el alcance de cumplimiento de la industria y la complejidad de integración.');
add('Revenue Recovery Diagnostic',
    'Revenue Recovery Diagnostic',
    'Revenue Recovery Diagnostic');
add('$1,500 fixed fee',
    '$1,500 фиксированно',
    '$1,500 tarifa fija');
add('Two-week assessment · for companies that want a limited review before committing',
    'Двухнедельная оценка · для компаний, которым нужен ограниченный разбор до принятия обязательств',
    'Evaluación de dos semanas · para empresas que quieren una revisión limitada antes de comprometerse');
add('Workflow audit, AR leakage map, file-control gap log, and a 12-month roadmap. Fee applied to a subsequent Paid Workflow Pilot if engaged within 30 days.',
    'Аудит workflow, карта утечек AR, журнал пробелов в контроле файлов и 12-месячный roadmap. Сумма зачитывается в последующий Paid Workflow Pilot при заключении договора в течение 30 дней.',
    'Auditoría de flujo, mapa de fugas de AR, registro de brechas de control documental y hoja de ruta a 12 meses. La tarifa se acredita al Paid Workflow Pilot posterior si se contrata dentro de 30 días.');
add('Remote kickoff and data intake',
    'Удалённый kickoff и приём данных',
    'Arranque remoto y captura de datos');
add('Recovery-probability model for your AR mix',
    'Модель вероятности возврата для вашего AR-микса',
    'Modelo de probabilidad de recuperación para su mix de AR');
add('Written deliverable plus 45-min readout',
    'Письменный deliverable плюс 45-минутный readout',
    'Entregable escrito más lectura de 45 minutos');
add('Paid Workflow Pilot',
    'Paid Workflow Pilot',
    'Paid Workflow Pilot');
add('From $2,500/mo',
    'От $2,500/мес',
    'Desde $2,500/mes');
add('For companies that need workflow buildout but do not qualify for the no-retainer recovery pilot',
    'Для компаний, которым нужно выстроить workflow, но которые не проходят на no-retainer recovery pilot',
    'Para empresas que necesitan buildout de workflow pero no califican para el no-retainer recovery pilot');
add('Workflow deployment, documentation controls, dashboards, SOPs, and file readiness for one business unit or one matter lane. Monthly engagement; performance-linked components available where appropriate.',
    'Развёртывание workflow, документационные контроли, дашборды, SOP и file readiness для одного бизнес-подразделения или одной категории дел. Ежемесячная оплата; performance-linked компоненты доступны по ситуации.',
    'Despliegue de workflow, controles documentales, dashboards, SOPs y file readiness para una unidad de negocio o una línea de casos. Engagement mensual; componentes performance-linked disponibles cuando corresponde.');
add('Documented SOPs and escalation ladder',
    'Документированные SOP и лестница эскалации',
    'SOPs documentados y escalera de escalación');
add('File-control standards applied to live packets',
    'Стандарты контроля файлов, применённые к живым пакетам',
    'Estándares de control documental aplicados a paquetes en vivo');
add('Weekly scorecards; counsel-ready handoff format',
    'Еженедельные scorecards; формат handoff, готовый для counsel',
    'Scorecards semanales; formato de handoff listo para counsel');
add('Custom scope',
    'Индивидуальный объём',
    'Alcance personalizado');
add('Multi-unit, 12-month minimum',
    'Несколько подразделений, минимум 12 месяцев',
    'Multi-unidad, mínimo 12 meses');
add('Post-pilot roll-out across business units, industries, or regions. Includes quarterly governance reviews, compliance alignment (FDCPA, HIPAA, CFPB Reg F, Florida F.S. 559/605), and dedicated packet-room infrastructure.',
    'Раскатка после пилота на бизнес-подразделения, отрасли или регионы. Включает quarterly governance reviews, согласование compliance (FDCPA, HIPAA, CFPB Reg F, Florida F.S. 559/605) и выделенную инфраструктуру packet-room.',
    'Despliegue post-piloto en unidades de negocio, industrias o regiones. Incluye revisiones trimestrales de gobernanza, alineación de cumplimiento (FDCPA, HIPAA, CFPB Reg F, Florida F.S. 559/605) e infraestructura de packet-room dedicada.');
add('Dedicated workflow owner on the VitaCoreX side',
    'Выделенный владелец workflow со стороны VitaCoreX',
    'Dueño de flujo dedicado del lado de VitaCoreX');
add('Quarterly business reviews with CFO-level reporting',
    'Quarterly business reviews с отчётностью уровня CFO',
    'Revisiones trimestrales de negocio con reporting de nivel CFO');
add('Priority routing for regulated and high-value matters',
    'Приоритетная маршрутизация для регулируемых и высокоценных дел',
    'Enrutamiento prioritario para asuntos regulados y de alto valor');
add('Ranges are indicative. Final fee depends on matter volume, compliance scope, and integration depth. VitaCoreX LLC is not a law firm; fees are for administrative, documentation, and workflow services only.',
    'Диапазоны ориентировочные. Итоговая стоимость зависит от объёма дел, compliance-рамок и глубины интеграции. VitaCoreX LLC не является юридической фирмой; стоимость покрывает только административные, документарные и workflow-услуги.',
    'Los rangos son indicativos. La tarifa final depende del volumen de asuntos, el alcance de cumplimiento y la profundidad de integración. VitaCoreX LLC no es un bufete; las tarifas cubren únicamente servicios administrativos, documentales y de flujo.');

/* ----------------------------------------------------------------
   revenue-recovery-workflow.html
   ---------------------------------------------------------------- */
add('Pilot evidence should come from operator baselines, documented process changes, and measured file-quality improvements rather than illustrative public claims.',
    'Доказательства пилота должны исходить из baseline оператора, задокументированных изменений процесса и измеримых улучшений качества файлов, а не из иллюстративных публичных заявлений.',
    'La evidencia del piloto debe venir de las líneas base del operador, cambios de proceso documentados y mejoras medibles de calidad documental, no de afirmaciones ilustrativas públicas.');
add('Behavioral segmentation',
    'Поведенческая сегментация',
    'Segmentación conductual');
add('Conditional offer conversion',
    'Конверсия условного предложения',
    'Conversión de oferta condicional');
add('Guarantor activation',
    'Активация гаранта',
    'Activación del garante');
add('ACH-first discipline',
    'Дисциплина ACH-first',
    'Disciplina ACH-first');
add('Litigation-ready documentation',
    'Документация, готовая к суду',
    'Documentación lista para litigio');
add('90-day pilot',
    'Пилот на 90 дней',
    'Piloto de 90 días');
add('Balances converted before agency escalation',
    'Балансы, закрытые до эскалации в агентство',
    'Saldos convertidos antes de escalar a agencia');
add('Documented payment commitments and cure rates',
    'Задокументированные платёжные обязательства и cure rates',
    'Compromisos de pago documentados y tasas de cura');
add('Exception queues, follow-up discipline, and aging movement',
    'Очереди исключений, дисциплина follow-up и движение aging',
    'Colas de excepción, disciplina de seguimiento y movimiento de antigüedad');
add('File quality improvements that reduce downstream cleanup',
    'Улучшения качества файлов, сокращающие downstream cleanup',
    'Mejoras de calidad documental que reducen la limpieza posterior');
add('Measure the operator\'s own baseline first, then compare the pilot against that live operating context.',
    'Сначала измерьте собственный baseline оператора, затем сравнивайте пилот с этим живым операционным контекстом.',
    'Mida primero la línea base propia del operador y luego compare el piloto contra ese contexto operativo vivo.');
add('Use a live pilot to validate the economic case with operator-owned data.',
    'Используйте живой пилот, чтобы валидировать экономическое обоснование на данных оператора.',
    'Use un piloto en vivo para validar el caso económico con datos propios del operador.');
add('Starting portfolio mix and pre-agency balance volume',
    'Стартовый микс портфеля и объём балансов до агентства',
    'Mix inicial del portafolio y volumen de saldos pre-agencia');
add('Acceptance rate, completion rate, and time-to-cash',
    'Acceptance rate, completion rate и time-to-cash',
    'Tasa de aceptación, tasa de finalización y time-to-cash');
add('Agency referrals avoided or deferred through cleaner internal sequencing',
    'Передачи в агентство, которых удалось избежать или отложить за счёт более чистой внутренней последовательности',
    'Derivaciones a agencia evitadas o diferidas mediante una secuencia interna más limpia');
add('Documentation quality at handoff when escalation remains necessary',
    'Качество документации при handoff, когда эскалация всё-таки нужна',
    'Calidad de la documentación en el handoff cuando la escalada sigue siendo necesaria');
add('FDCPA / Regulation F / Florida FCCPA / E-SIGN / Florida UETA are referenced as guardrails for workflow design, documentation control, and escalation structuring. VitaCoreX LLC is not a law firm and not a licensed collection agency.',
    'FDCPA / Regulation F / Florida FCCPA / E-SIGN / Florida UETA используются как guardrails для дизайна workflow, контроля документации и структурирования эскалации. VitaCoreX LLC не является юридической фирмой и не является лицензированным коллекторским агентством.',
    'FDCPA / Regulation F / Florida FCCPA / E-SIGN / Florida UETA se citan como guardrails para el diseño de flujos, control documental y estructuración de escalada. VitaCoreX LLC no es un bufete ni una agencia de cobranza con licencia.');
add('The goal is controlled implementation evidence, not illustrative case-study theatre.',
    'Цель — контролируемые доказательства внедрения, а не театр иллюстративных case study.',
    'El objetivo es evidencia de implementación controlada, no un teatro ilustrativo de case studies.');
add('Multi-step diagnostic wizard with executive brief generation and KPI baseline computation.',
    'Многоступенчатый диагностический мастер с генерацией executive brief и расчётом KPI baseline.',
    'Asistente diagnóstico multi-paso con generación de brief ejecutivo y cálculo de línea base de KPI.');
add('Structured intake pipeline with triage scoring, magic-link status tracking, and admin review queue.',
    'Структурированный intake-пайплайн с triage-скорингом, отслеживанием статуса по magic-link и очередью admin review.',
    'Pipeline de intake estructurado con scoring de triage, seguimiento de estado por magic-link y cola de revisión admin.');
add('Interactive estimator',
    'Интерактивный калькулятор',
    'Estimador interactivo');
add('What would a structured pilot recover on your AR?',
    'Сколько структурированный пилот мог бы вернуть с вашего AR?',
    '¿Cuánto recuperaría un piloto estructurado en su AR?');
add('Enter your outstanding receivables and the typical aging. The estimator applies industry recovery-rate benchmarks and the aging-curve multiplier to produce a 90-day pilot range. Results are illustrative, not a guarantee.',
    'Введите вашу непогашенную дебиторку и типичное aging. Калькулятор применяет отраслевые recovery-rate benchmarks и множитель aging-curve, чтобы получить диапазон для 90-дневного пилота. Результаты иллюстративные, не гарантия.',
    'Ingrese sus cuentas por cobrar pendientes y la antigüedad típica. El estimador aplica benchmarks de tasa de recuperación del sector y el multiplicador de curva de antigüedad para producir un rango de piloto a 90 días. Los resultados son ilustrativos, no una garantía.');
add('Enter an outstanding AR balance above $1,000 to see the estimate.',
    'Введите непогашенный баланс AR более $1,000, чтобы увидеть оценку.',
    'Ingrese un saldo pendiente de AR superior a $1,000 para ver la estimación.');
add('Use the industry pages when the buyer needs a more specific operating frame than a general service description can provide.',
    'Используйте страницы по отраслям, когда покупателю нужна более конкретная операционная рамка, чем даёт общее описание услуги.',
    'Use las páginas de industria cuando el comprador necesite un marco operativo más específico que el de una descripción general de servicio.');

/* ----------------------------------------------------------------
   vitacorex-vs-traditional-agency.html
   ---------------------------------------------------------------- */
add('Side-by-side comparison',
    'Сравнение бок о бок',
    'Comparación lado a lado');
add('VitaCoreX vs Traditional Collection Agency',
    'VitaCoreX против традиционного коллекторского агентства',
    'VitaCoreX frente a agencia de cobranza tradicional');
add('Two different economic models for the same problem: unpaid balances. One treats revenue recovery as an infrastructure discipline before the matter gets expensive. The other takes a contingency fee after the balance has already aged past its recoverability curve.',
    'Две разные экономические модели для одной проблемы: неоплаченные балансы. Одна относится к возврату выручки как к инфраструктурной дисциплине до того, как дело становится дорогим. Другая берёт contingency fee уже после того, как баланс ушёл за кривую recoverability.',
    'Dos modelos económicos distintos para el mismo problema: saldos impagos. Uno trata la recuperación de ingresos como una disciplina de infraestructura antes de que el asunto se vuelva caro. El otro cobra contingency fee después de que el saldo ya haya envejecido más allá de su curva de recuperabilidad.');
add('VitaCoreX LLC is not a collection agency and not a law firm. We design and operate structured pre-collection workflows for operators. Third-party collection agencies operate under FDCPA, state licensing, and charge-off assumptions.',
    'VitaCoreX LLC не является коллекторским агентством и не является юридической фирмой. Мы проектируем и управляем структурированными pre-collection workflows для операторов. Сторонние коллекторские агентства работают по FDCPA, state licensing и charge-off assumptions.',
    'VitaCoreX LLC no es una agencia de cobranza ni un bufete. Diseñamos y operamos flujos estructurados pre-cobranza para operadores. Las agencias de cobranza de terceros operan bajo FDCPA, licencia estatal y supuestos de charge-off.');
add('When to choose what',
    'Когда что выбирать',
    'Cuándo elegir qué');
add('Not every balance belongs inside VitaCoreX.',
    'Не каждый баланс подходит для VitaCoreX.',
    'No todos los saldos pertenecen a VitaCoreX.');
add('Balances already 12+ months old, already charged off, or already in dispute typically belong with a licensed collection agency or counsel. Pre-collection infrastructure is a different tool for a different stage of the AR curve.',
    'Балансы старше 12 месяцев, уже charged off или уже в споре, как правило, относятся к ведению лицензированного коллекторского агентства или counsel. Инфраструктура pre-collection — это другой инструмент для другого этапа AR-кривой.',
    'Los saldos con más de 12 meses de antigüedad, ya charged off o ya en disputa suelen corresponder a una agencia de cobranza con licencia o a abogados. La infraestructura pre-cobranza es una herramienta distinta para una etapa distinta de la curva de AR.');
add('Choose VitaCoreX',
    'Выбирайте VitaCoreX',
    'Elija VitaCoreX');
add('When 30-, 60-, and 90-day buckets are leaking revenue, when the customer relationship is still worth protecting, and when counsel is spending hours reorganizing your file packets.',
    'Когда 30-, 60- и 90-дневные buckets теряют выручку, когда отношения с клиентом ещё стоит беречь и когда counsel тратит часы на переорганизацию ваших file packets.',
    'Cuando los buckets de 30, 60 y 90 días están fugando ingresos, cuando la relación con el cliente aún vale la pena proteger y cuando los abogados pasan horas reorganizando sus paquetes documentales.');
add('Choose a collection agency',
    'Выбирайте коллекторское агентство',
    'Elija una agencia de cobranza');
add('When a balance is already 12+ months old, when the customer relationship is already ended, or when the account is already charged off and contingency-fee recovery is the right economic model.',
    'Когда балансу уже больше 12 месяцев, когда отношения с клиентом уже закончены или когда счёт уже charged off и contingency-fee recovery — правильная экономическая модель.',
    'Cuando el saldo ya tiene más de 12 meses, cuando la relación con el cliente ya terminó, o cuando la cuenta ya está charged off y el modelo de recuperación por contingencia es el correcto.');
add('Choose both',
    'Выбирайте оба',
    'Elija ambos');
add('Mature AR programs run VitaCoreX on fresh-to-aged balances (where most recoverable dollars live) and use collection agencies on the long tail where the economic model fits.',
    'Зрелые AR-программы запускают VitaCoreX на балансах от свежих до aged (там сосредоточена большая часть recoverable dollars) и используют коллекторские агентства на long tail, где подходит их экономическая модель.',
    'Los programas maduros de AR aplican VitaCoreX en saldos frescos a envejecidos (donde está la mayor parte de los dólares recuperables) y usan agencias de cobranza en la long tail donde su modelo económico encaja.');
add('Source benchmarks',
    'Источники benchmarks',
    'Benchmarks de referencia');
add('Why these numbers hold across industries.',
    'Почему эти цифры держатся в разных отраслях.',
    'Por qué estos números se sostienen entre industrias.');
add('Fresh vs aged recoverability',
    'Recoverability: свежие vs aged',
    'Recuperabilidad: frescos vs envejecidos');
add('Industry data shows 70–90% recoverability on invoices under 6 months old, dropping to 45–55% at 6 months and 20–30% at 12 months. Every week of inaction reduces expected recovery by ~1%.',
    'Отраслевые данные показывают 70–90% recoverability по счетам младше 6 месяцев, падение до 45–55% в 6 месяцев и до 20–30% в 12 месяцев. Каждая неделя бездействия снижает ожидаемый возврат примерно на 1%.',
    'Los datos del sector muestran 70–90% de recuperabilidad en facturas con menos de 6 meses, cayendo a 45–55% a los 6 meses y 20–30% a los 12 meses. Cada semana de inacción reduce la recuperación esperada ~1%.');
add('Agency net-to-creditor economics',
    'Net-to-creditor экономика агентств',
    'Economía net-to-creditor de agencias');
add('After a 25–50% contingency commission, traditional agency placements net 10–14¢ per dollar to the creditor on aged balances. The math reflects both commission and the recoverability curve.',
    'После contingency commission в 25–50% размещения в традиционных агентствах приносят кредитору 10–14¢ на доллар на aged-балансах. Эта математика отражает и комиссию, и recoverability-кривую.',
    'Tras una comisión por contingencia del 25–50%, las colocaciones en agencias tradicionales dejan 10–14¢ por dólar al acreedor en saldos envejecidos. La matemática refleja tanto la comisión como la curva de recuperabilidad.');
add('Pilot ROI benchmark',
    'Benchmark ROI пилота',
    'Benchmark de ROI de piloto');
add('VitaCoreX controlled pilots typically report 2.2–4.4x ROI over a 90-day window driven by faster pre-escalation recovery, reduced agency placement volume, and reduced counsel reorganization cost.',
    'Контролируемые пилоты VitaCoreX обычно показывают 2.2–4.4x ROI за 90 дней за счёт более быстрого до-эскалационного возврата, сокращения объёма размещений в агентствах и снижения расходов counsel на переорганизацию.',
    'Los pilotos controlados de VitaCoreX reportan típicamente 2.2–4.4x ROI en 90 días, impulsados por recuperación previa a escalada más rápida, menor volumen de colocaciones en agencia y menor costo de reorganización por abogados.');
add('Figures are industry benchmarks and VitaCoreX methodology outputs, not guaranteed outcomes. VitaCoreX LLC is not a law firm; legal strategy remains the responsibility of licensed counsel.',
    'Цифры — отраслевые benchmarks и результаты методологии VitaCoreX, а не гарантированные исходы. VitaCoreX LLC не является юридической фирмой; юридическая стратегия остаётся ответственностью лицензированного counsel.',
    'Las cifras son benchmarks del sector y resultados de la metodología VitaCoreX, no resultados garantizados. VitaCoreX LLC no es un bufete; la estrategia legal sigue siendo responsabilidad de abogados con licencia.');

/* ----------------------------------------------------------------
   structured-case-intake.html
   ---------------------------------------------------------------- */
add('Attachment is optional. Use the public form for general business documents and non-regulated materials only.',
    'Вложение не обязательно. Используйте публичную форму только для общих бизнес-документов и нерегулируемых материалов.',
    'El adjunto es opcional. Use el formulario público solo para documentos de negocio generales y materiales no regulados.');
add('Private Client Self-Service Tools',
    'Self-service инструменты для частных клиентов',
    'Herramientas de autoservicio para clientes privados');
add('Need a quick analysis before you submit? Use one of these tools first — results are instant and stay in your browser.',
    'Нужен быстрый анализ перед отправкой? Сначала воспользуйтесь одним из этих инструментов — результаты мгновенные и остаются в вашем браузере.',
    '¿Necesita un análisis rápido antes de enviar? Use primero una de estas herramientas: los resultados son instantáneos y permanecen en su navegador.');
add('Recommended service lineStructured intake review aligned to route, urgency, and file readiness.',
    '<div><strong>Рекомендуемое направление услуги</strong></div><span>Структурированный разбор intake с учётом маршрута, срочности и готовности файла.</span>',
    '<div><strong>Línea de servicio recomendada</strong></div><span>Revisión de intake estructurado alineada a ruta, urgencia y disposición del expediente.</span>');
add('Routing confidenceUpdated when the required fields, service type, and urgency are complete.',
    '<div><strong>Уверенность маршрутизации</strong></div><span>Обновляется по мере заполнения обязательных полей, типа услуги и срочности.</span>',
    '<div><strong>Confianza de enrutamiento</strong></div><span>Se actualiza cuando se completan los campos requeridos, el tipo de servicio y la urgencia.</span>');
add('What to send nowContract, invoice, payment history, screenshots, notices, and any existing file references.',
    '<div><strong>Что прислать сейчас</strong></div><span>Контракт, счёт, историю платежей, скриншоты, уведомления и любые существующие ссылки на файлы.</span>',
    '<div><strong>Qué enviar ahora</strong></div><span>Contrato, factura, historial de pagos, capturas de pantalla, notificaciones y cualquier referencia existente del expediente.</span>');
add('Response window24–48 business hours after a complete intake and usable supporting material.',
    '<div><strong>Срок ответа</strong></div><span>24–48 рабочих часов после получения полного intake и пригодных подтверждающих материалов.</span>',
    '<div><strong>Plazo de respuesta</strong></div><span>24–48 horas hábiles tras un intake completo y materiales de respaldo utilizables.</span>');
add('Recommended next stepRouting review, document gap check, and consultation handoff.',
    '<div><strong>Рекомендуемый следующий шаг</strong></div><span>Разбор маршрутизации, проверка пробелов в документах и handoff на консультацию.</span>',
    '<div><strong>Siguiente paso recomendado</strong></div><span>Revisión de enrutamiento, chequeo de brechas documentales y handoff a consulta.</span>');
add('This summary becomes more precise as the intake is completed. It is not legal advice.',
    'Это резюме становится точнее по мере заполнения intake. Оно не является юридической консультацией.',
    'Este resumen se vuelve más preciso a medida que se completa el intake. No constituye asesoramiento legal.');
add('Initial routing review to confirm the right workstream and identify obvious gaps.',
    'Первичный разбор маршрутизации, чтобы подтвердить правильный workstream и выявить очевидные пробелы.',
    'Revisión inicial de enrutamiento para confirmar el workstream correcto e identificar brechas evidentes.');
add('Request for missing materials only when they materially improve the next step.',
    'Запрос недостающих материалов — только когда они существенно улучшают следующий шаг.',
    'Solicitud de materiales faltantes solo cuando mejoran materialmente el siguiente paso.');
add('Response-window guidance based on urgency, fit, and document readiness.',
    'Ориентир по сроку ответа на основе срочности, fit и готовности документов.',
    'Orientación de plazo de respuesta según urgencia, ajuste y disposición documental.');
add('Use the public intake for general business documents and non-regulated materials. For highly sensitive or regulated records, request secure coordination first.',
    'Используйте публичный intake для общих бизнес-документов и нерегулируемых материалов. Для особо чувствительных или регулируемых записей сначала запросите защищённую координацию.',
    'Use el intake público para documentos de negocio generales y materiales no regulados. Para registros altamente sensibles o regulados, solicite primero coordinación segura.');
add('VitaCoreX is not a law firm and not a licensed collection agency. Legal strategy and legal advice remain with licensed counsel.',
    'VitaCoreX не является юридической фирмой и не является лицензированным коллекторским агентством. Юридическая стратегия и советы остаются за лицензированным counsel.',
    'VitaCoreX no es un bufete ni una agencia de cobranza con licencia. La estrategia legal y los consejos legales permanecen con abogados con licencia.');

/* ================================================================
   TRANSLATION ENGINE — walks the DOM and replaces text
   ================================================================ */

// Elements to translate (content area only, skip nav/header/footer handled by shell-i18n)
var SELECTORS = 'h1, h2, h3, p, li, span.eyebrow, span.pill, a.btn, a.btn-primary, a.btn-secondary, label, option, button[type="submit"], .hero-copy .lead, .section-intro, .card p, .card h3, .timeline-item h3, .timeline-item p, .pilot-panel h3, .pilot-panel li, .fit-card li, .fit-card span, .cta-row a, .problem-item h3, .problem-item p, .about-card h3, .about-card p, .about-card span, summary, .tool-link h4, .tool-link p, .use-card h3, .use-card p, .use-card li, .governance p, .governance h3';

// Skip elements already handled by shell-i18n
var SKIP_PARENTS = ['vcx-main-nav', 'vcx-mobile-nav', 'footer', 'vcx-header-meta', 'vcx-lang-switch'];

function shouldSkip(el) {
  // Skip elements handled by vcx-i18n.js (runs on all pages before this event fires)
  if (el.hasAttribute('data-common') || el.hasAttribute('data-tx')) return true;
  var node = el;
  while (node) {
    if (node.tagName === 'NAV' || node.tagName === 'FOOTER') return true;
    if (node.classList) {
      for (var i = 0; i < SKIP_PARENTS.length; i++) {
        if (node.classList.contains(SKIP_PARENTS[i])) return true;
      }
    }
    if (node.tagName === 'HEADER') return true;
    node = node.parentElement;
  }
  return false;
}

function normText(s) {
  return (s || '')
    // Fold curly quotes / dashes / ellipsis to ASCII so keys match regardless of
    // whether the HTML source used typographic or straight punctuation.
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '\u2014') // en/em dash -> em dash
    .replace(/\u2026/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}
function isHtml(s) { return /<[a-z][^>]*>/i.test(s); }

// Skip if an element OR any descendant is already owned by a structured
// translator (data-page / data-i18n / data-v52 / data-common / data-tx).
// Without this check we'd cache whatever text the structured translator
// already wrote (often non-EN) as "original English", which produces stuck
// translations when the user flips back to EN.
function ownedByStructured(el) {
  if (el.hasAttribute('data-common') || el.hasAttribute('data-tx') ||
      el.hasAttribute('data-page')   || el.hasAttribute('data-i18n') ||
      el.hasAttribute('data-v52')) return true;
  if (el.querySelector('[data-page],[data-i18n],[data-v52],[data-common],[data-tx]')) return true;
  return false;
}

function translatePage(lang) {
  if (lang === 'en') {
    // Restore originals (skip elements handled by structured translators).
    document.querySelectorAll('[data-en-orig]').forEach(function(el) {
      if (ownedByStructured(el)) return;
      // If we cached the original HTML (rich paragraph case), restore innerHTML;
      // otherwise restore textContent.
      var html = el.getAttribute('data-en-orig-html');
      if (html !== null) {
        el.innerHTML = html;
      } else {
        el.textContent = el.getAttribute('data-en-orig');
      }
    });
    return;
  }

  var els = document.querySelectorAll(SELECTORS);
  els.forEach(function(el) {
    if (shouldSkip(el)) return;
    // Skip elements owned by structured translators (direct OR via descendants).
    if (ownedByStructured(el)) return;

    // Key is always the textContent (normalized). This lets us also translate
    // paragraphs that contain inline <a>/<strong> children by providing the
    // translated value as an innerHTML snippet (with the links restored).
    var hasChildren = el.children.length > 0;
    var textKey = normText(el.getAttribute('data-en-orig') || el.textContent);
    if (!textKey) return;

    // Save original English (both text and, if children exist, innerHTML so we
    // can restore the exact inline markup when the user switches back to EN).
    if (!el.hasAttribute('data-en-orig')) {
      el.setAttribute('data-en-orig', textKey);
      if (hasChildren) {
        el.setAttribute('data-en-orig-html', el.innerHTML);
      }
    }

    var entry = T[textKey];
    if (entry && entry[lang]) {
      var val = entry[lang];
      // Use innerHTML if the translated value contains markup OR the element
      // originally had children (so we preserve the structure / inline links).
      if (isHtml(val) || hasChildren) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });
}

// Listen for language change event from vcx-i18n.js
document.addEventListener('vcx:lang-change', function(e) {
  var lang = (e.detail && e.detail.lang) || 'en';
  translatePage(lang);
});

// Also apply on DOMContentLoaded (after vcx-i18n.js has run)
document.addEventListener('DOMContentLoaded', function() {
  var lang = w.vcxCurrentLang ? w.vcxCurrentLang() : 'en';
  if (lang !== 'en') {
    // Small delay to let shell-i18n finish first
    setTimeout(function() { translatePage(lang); }, 50);
  }
});

})(window);
