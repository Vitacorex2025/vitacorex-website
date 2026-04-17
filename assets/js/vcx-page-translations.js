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

add('VitaCoreX offers three engagement tiers. (1) Diagnostic: a fixed-fee $2,500 revenue leakage audit delivered in 10 business days — identifies where cash is stuck and quantifies recovery upside. (2) 90-day Pilot: from $8,500/month, targeting 2.2–4.4× ROI on pilot fees through measured AR recovery. (3) Programme: custom retainer plus outcome-based fee for ongoing recovery infrastructure. Unlike traditional collection agencies that take 30–50% contingency, our fees are transparent and predictable, so clients keep the majority of recovered revenue.',
    'VitaCoreX предлагает три уровня взаимодействия. (1) <strong>Диагностика</strong>: фиксированный гонорар $2,500 за аудит утечек выручки, доставляемый за 10 рабочих дней — выявляет, где застревает кэш, и количественно оценивает потенциал возврата. (2) <strong>90-дневный пилот</strong>: от $8,500/месяц, нацелен на ROI 2.2–4.4× на гонорары пилота через измеряемый возврат AR. (3) <strong>Программа</strong>: индивидуальный ретейнер плюс гонорар на основе результата за текущую инфраструктуру возврата. В отличие от традиционных агентств, берущих 30–50% contingency, наши гонорары прозрачны и предсказуемы, так что клиенты сохраняют большинство возвращённой выручки.',
    'VitaCoreX ofrece tres niveles de contratación. (1) <strong>Diagnóstico</strong>: una auditoría de fuga de ingresos con honorario fijo de $2,500 entregada en 10 días hábiles — identifica dónde está atascado el efectivo y cuantifica el potencial de recuperación. (2) <strong>Piloto de 90 días</strong>: desde $8,500/mes, apuntando a un ROI de 2.2–4.4× sobre los honorarios del piloto mediante recuperación medida de AR. (3) <strong>Programa</strong>: retainer personalizado más honorario basado en resultados para infraestructura continua de recuperación. A diferencia de las agencias tradicionales que toman 30–50% de contingencia, nuestros honorarios son transparentes y predecibles, por lo que los clientes conservan la mayoría de los ingresos recuperados.');

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

add("Contact VitaCoreX LLC at (888) 794-8292, email vitacorex2025@gmail.com, or visit our contact page at vitacorexllc.com/contact.html. We're located in Tampa, FL and serve clients nationwide in English, Russian, and Spanish. You can also book a 30-minute consultation at calendly.com/vitacorex2025/30min.",
    'Свяжитесь с VitaCoreX LLC по телефону (888) 794-8292, по электронной почте vitacorex2025@gmail.com или посетите нашу контактную страницу vitacorexllc.com/contact.html. Мы находимся в Тампе, Флорида, и обслуживаем клиентов по всей стране на английском, русском и испанском. Вы также можете забронировать 30-минутную консультацию на calendly.com/vitacorex2025/30min.',
    'Contacte a VitaCoreX LLC al (888) 794-8292, correo vitacorex2025@gmail.com, o visite nuestra página de contacto en vitacorexllc.com/contact.html. Estamos en Tampa, FL y servimos clientes a nivel nacional en inglés, ruso y español. También puede reservar una consulta de 30 minutos en calendly.com/vitacorex2025/30min.');

add('Ready to Get Started?',
    'Готовы начать?',
    '¿Listo para comenzar?');

add('Contact VitaCoreX for a confidential consultation. Available in English, Russian, and Spanish.',
    'Свяжитесь с VitaCoreX для конфиденциальной консультации. Доступно на английском, русском и испанском.',
    'Contacte a VitaCoreX para una consulta confidencial. Disponible en inglés, ruso y español.');

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

function translatePage(lang) {
  if (lang === 'en') {
    // Restore originals (skip elements handled by vcx-i18n.js / vcx-translations.js)
    document.querySelectorAll('[data-en-orig]').forEach(function(el) {
      if (el.hasAttribute('data-common') || el.hasAttribute('data-tx') || el.hasAttribute('data-page') || el.hasAttribute('data-i18n') || el.hasAttribute('data-v52')) return;
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
    // Skip elements handled by vcx-translations.js (data-page, data-i18n, data-v52)
    if (el.hasAttribute('data-page') || el.hasAttribute('data-i18n') || el.hasAttribute('data-v52')) return;

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
