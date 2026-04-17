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

function translatePage(lang) {
  if (lang === 'en') {
    // Restore originals (skip elements handled by vcx-i18n.js / vcx-translations.js)
    document.querySelectorAll('[data-en-orig]').forEach(function(el) {
      if (el.hasAttribute('data-common') || el.hasAttribute('data-tx') || el.hasAttribute('data-page') || el.hasAttribute('data-i18n') || el.hasAttribute('data-v52')) return;
      el.textContent = el.getAttribute('data-en-orig');
    });
    return;
  }

  var els = document.querySelectorAll(SELECTORS);
  els.forEach(function(el) {
    if (shouldSkip(el)) return;
    // Skip elements handled by vcx-translations.js (data-page, data-i18n, data-v52)
    if (el.hasAttribute('data-page') || el.hasAttribute('data-i18n') || el.hasAttribute('data-v52')) return;
    // Skip elements with child elements (complex nesting)
    if (el.children.length > 0 && el.tagName !== 'LI' && el.tagName !== 'A' && el.tagName !== 'BUTTON' && el.tagName !== 'LABEL') return;

    var text = (el.getAttribute('data-en-orig') || el.textContent || '').trim();
    if (!text) return;

    // Save original English
    if (!el.hasAttribute('data-en-orig')) {
      el.setAttribute('data-en-orig', text);
    }

    var entry = T[text];
    if (entry && entry[lang]) {
      el.textContent = entry[lang];
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
