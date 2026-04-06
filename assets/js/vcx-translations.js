/* ============================================================
   VCX FULL-PAGE TRANSLATION ENGINE + CATALOG
   Covers ALL visible text on index.html for EN / RU / ES
   Reads: data-i18n, data-page, data-tx, data-v52, data-common
   Writes: textContent (or placeholder for inputs)
   Persists language choice in localStorage
   ============================================================ */
;(function(w, d){
'use strict';

/* ──────────────────────────────────────────────────────────────
   TRANSLATION CATALOG
   ────────────────────────────────────────────────────────────── */
w.VCX_TRANSLATIONS = {

/* ═══════════════════  ENGLISH  ═══════════════════════════════ */
en: {

  /* ── Hero ──────────────────────────────────────────────────── */
  hero_eyebrow:       'Company-first advisory',
  hero_title:         'Revenue recovery design and documentation control for operators that cannot afford a weak handoff.',
  hero_lead:          'VitaCoreX helps complex operators improve cash control, packet discipline, and escalation readiness before margin is lost to weak workflow and expensive cleanup.',
  hero_pill_1:        'Built for operators, CFOs, and portfolio leadership',
  hero_pill_2:        'Documentation discipline before outside cost expands',
  hero_pill_3:        'Pilot logic that can be measured',

  stat_label_1:       'Solution lanes',
  stat_label_2:       'Pilot standard',
  stat_label_3:       'Response commitment',
  stat_label_4:       'Counsel-ready file standard',

  metric_bar_full:    'Structured Intake \u2022 Recovery Systems \u2022 Legal File Control',
  metric_bar_short:   'Structured Intake \u2022 File Control',

  /* ── Leak section ──────────────────────────────────────────── */
  leaks_eyebrow:      'Where value leaks first',
  leaks_title:        'Most revenue loss starts before collections ever begin.',
  leaks_intro:        'The premium position is not general support. It is disciplined operating infrastructure that protects margin, preserves documentation quality, and keeps avoidable external cost from compounding.',
  leak_1_h:           'Fragmented billing cadence',
  leak_1_p:           'Balances age because outreach timing, scripts, and follow-up discipline vary by operator and location.',
  leak_2_h:           'Weak payment plan structure',
  leak_2_p:           'Plans fail when terms, autopay, cure triggers, and documentation are handled informally.',
  leak_3_h:           'Early fee compression',
  leak_3_p:           'Accounts move to agency too early, giving away margin that cleaner internal sequencing could protect.',
  leak_4_h:           'No KPI visibility',
  leak_4_p:           'Leadership cannot standardize what it cannot measure across cohorts, sites, and stages of recovery.',
  leak_5_h:           'Incomplete file control',
  leak_5_p:           'When escalation becomes necessary, weak packet structure and missing records create avoidable delay and cost.',

  /* ── Two buying paths ──────────────────────────────────────── */
  why_eyebrow:        'Two buying paths',
  why_title:          'Built for companies first, while still serving selected individual matters.',
  why_intro:          'Corporate advisory is our core expertise. Private-client services complement the institutional platform, offering the same documentation discipline and quality standards to selected individual matters.',
  b2b_badge:          'For operators',
  b2b_title:          'Advisory for operators that need cleaner execution before legal and agency costs expand.',
  b2b_intro:          'Built for organizations that want stronger operating control, tighter documentation, and a more defensible handoff model before outside spend accelerates.',
  b2b_b1:             'Revenue recovery workflow design',
  b2b_b2:             'Corporate file cleanup and packet control',
  b2b_b3:             'Pilot economics, KPI reporting, and rollout logic',
  b2b_b4:             'Board-ready, CFO-ready positioning',
  b2b_cta:            'Request company review',
  ind_badge:          'Private clients',
  ind_title:          'Curated private-client support remains available without weakening the corporate position.',
  ind_intro:          'Private-client services are available for selected individual matters, backed by the same documentation discipline and quality standards used in our corporate advisory work.',
  ind_b1:             'Contracts and documentation support',
  ind_b2:             'Immigration packet organization',
  ind_b3:             'Auto purchase review',
  ind_b4:             'Business plan and launch support',
  ind_cta:            'View private-client services',

  /* ── Fit qualification ─────────────────────────────────────── */
  fit_eyebrow:        'Fit qualification',
  fit_title:          'Best fit for operators that need cleaner execution before outside cost expands.',
  fit_intro:          'We work with operators who need measurable improvement before outside cost expands\u2014not with teams looking for generic support.',
  fit_best_pill:      'Best fit',
  fit_best_1:         'Multi-location operators with aged balances, inconsistent workflows, or weak escalation discipline.',
  fit_best_2:         'Finance-led teams that need a measurable path from diagnostic review to pilot proof.',
  fit_best_3:         'Organizations that want cleaner packet control before outside counsel or agency cost expands.',
  fit_best_4:         'Owners, CFOs, COOs, and counsel-adjacent operators who need a more credible handoff model.',
  fit_not_pill:       'Not the right fit',
  fit_not_1:          'Matters that require legal advice, legal representation, or licensed collections activity.',
  fit_not_2:          'Buyers seeking a generic outsourced call-center or a broad "do everything" service shop.',
  fit_not_3:          'Teams unwilling to document baseline conditions, workflow changes, or pilot measurement.',
  fit_not_4:          'Highly sensitive regulated records submitted through a public intake without secure coordination.',

  /* ── 90-day pilot ──────────────────────────────────────────── */
  pilot_eyebrow:      '90-day structure',
  pilot_title:        'A serious consulting sale needs a visible path from diagnosis to proof.',
  pilot_intro:        'The premium path is diagnose, pilot, and scale\u2014with proof taken from live operator data, documented workflow change, and governance discipline.',
  step_1:             'Diagnose',
  step_1_p:           'Review the current workflow, aging logic, file quality, and decision friction.',
  step_2:             'Pilot',
  step_2_p:           'Run a controlled 90-day scope with tracking, reporting, and measurable uplift targets.',
  step_3:             'Scale',
  step_3_p:           'Roll out the repeatable process once pilot evidence supports enterprise adoption.',
  pilot_measure_h:    'Pilot measurement priorities',
  pilot_m1:           'Net collections captured before agency escalation',
  pilot_m2:           'Payment-plan activation and completion by cohort',
  pilot_m3:           'Time-to-cash, cure rates, and exception handling volume',
  pilot_m4:           'File readiness improvements that reduce downstream cleanup',
  pilot_note:         'Pilot proof should come from the operator\'s own baseline and documented workflow changes, not template ROI assumptions.',

  /* ── Core services ─────────────────────────────────────────── */
  services_eyebrow:   'Core offers',
  svc_h:              'Core advisory lines',
  svc_i:              'Our advisory lines focus on economic control, file quality, and executive-level implementation\u2014delivering measurable value, not commodity support.',
  svc_card_1_h:       'Revenue Recovery Infrastructure',
  svc_card_1_p:       'Design pre-agency systems that convert balances into documented commitments before margin is lost.',
  svc_card_1_b1:      'Behavioral segmentation',
  svc_card_1_b2:      'Controlled offers and cure triggers',
  svc_card_1_b3:      'ACH-first or autopay activation logic',
  svc_card_1_b4:      'Exception handling and reporting',
  svc_card_1_b5:      'Measurement plan and reporting logic',
  svc_card_2_h:       'Corporate Legal File Control',
  svc_card_2_p:       'Build auditable case files, packet standards, and counsel-ready documentation workflows.',
  svc_card_2_b1:      'Chronology cleanup',
  svc_card_2_b2:      'Exhibit order and file indexing',
  svc_card_2_b3:      'Issue summary and gap log',
  svc_card_2_b4:      'Counsel-ready packet assembly',
  svc_card_2_b5:      'Documentation discipline across teams',
  svc_card_3_h:       'Paralegal Infrastructure Support',
  svc_card_3_p:       'Manage documentation preparation and workflow discipline so external counsel can focus on true legal strategy.',
  svc_card_3_b1:      'Initial issue mapping',
  svc_card_3_b2:      'Priority routing',
  svc_card_3_b3:      'Required document list',
  svc_card_3_b4:      'Response window planning',
  svc_card_3_b5:      'Next-step memo',

  /* ── Industry wedges ───────────────────────────────────────── */
  ind_wedge_eyebrow:  'Industry wedges',
  ind_wedge_title:    'Focused entry pages for the operator environments that fit the model best.',
  ind_wedge_intro:    'Each industry page addresses the specific recovery and documentation challenges operators face in that vertical.',
  ind_w1_pill:        'Healthcare & dental',
  ind_w1_h:           'Documentation control and pre-agency workflow design for complex patient-balance environments.',
  ind_w1_p:           'Useful where revenue leakage, packet inconsistency, and escalation cleanup are happening at the same time.',
  ind_w2_pill:        'Subscription & recurring payments',
  ind_w2_h:           'Retention-sensitive recovery design for operators managing recurring billing complexity.',
  ind_w2_p:           'Built for payment friction, aging balance segmentation, and cleaner exception handling.',
  ind_w3_pill:        'Fleet & logistics',
  ind_w3_h:           'Recovery workflows and file discipline for contract-heavy portfolios with dispersed operations.',
  ind_w3_p:           'Useful when operational inconsistency turns receivables and supporting records into margin loss.',
  ind_w4_pill:        'Contract-heavy services',
  ind_w4_h:           'Cash-control and counsel-ready packet logic for commercial service businesses with multi-party documentation.',
  ind_w4_p:           'Designed for operators that need cleaner invoice, authorization, and escalation records.',
  ind_wedge_cta1:     'Review industry pages',
  ind_wedge_cta2:     'Request confidential review',

  /* ── Institutional authority (v52) ─────────────────────────── */
  v52_eyebrow:        'Institutional authority',
  v52_title:          'Institutional advisory infrastructure for revenue recovery, corporate legal file control, and disciplined execution.',
  v52_intro:          'Designed for complex operators that need cleaner documentation control, stronger escalation discipline, and a more credible operating model before external cost expands.',
  v52_profiles_pill:  'Operator profiles',
  v52_profiles_title: 'Where complex operators deploy VitaCoreX',
  v52_profiles_intro: 'We support organizations managing contractual complexity, receivable friction, and counsel-facing documentation across multiple operating environments.',
  v52_profile_1:      'Healthcare operators',
  v52_profile_2:      'Fleet and fuel-card programs',
  v52_profile_3:      'Subscription platforms',
  v52_profile_4:      'Multi-location service networks',
  v52_profile_5:      'Contract-based commercial portfolios',
  v52_governance_pill: 'Governance',
  v52_governance_title:'Documentation control that supports finance, compliance, and external counsel',
  v52_governance_intro:'VitaCoreX structures files, payment documentation, and escalation records so legal strategy is not burdened with administrative cleanup.',
  v52_gov_1:          'Auditable file structure and evidence packaging',
  v52_gov_2:          'Payment-plan documentation and authorization control',
  v52_gov_3:          'Paralegal-grade preparation under consulting engagements',
  v52_gov_4:          'Cleaner handoff to outside counsel when escalation is necessary',
  v52_pilot_pill:     'Pilot governance',
  v52_pilot_h:        'What leadership should review during a live pilot',
  v52_pilot_1:        'Recovered cash compared with the operator\'s prior baseline',
  v52_pilot_2:        'Balances kept out of agency or other higher-cost escalation paths',
  v52_pilot_3:        'File quality improvements that make counsel handoff cleaner',
  v52_pilot_4:        'Exception queues, payment-plan completion, and documented next-step discipline',
  v52_evidence_pill:  'Evidence standard',
  v52_evidence_h:     'How proof should be documented',
  v52_evidence_p:     'Use operator-owned reporting, cohort comparisons, aging movement, and packet-quality observations. Avoid publishing illustrative ROI or case-study statistics unless they are tied to verifiable live engagements.',
  v52_evidence_cta1:  'Open structured intake',
  v52_evidence_cta2:  'Review executive materials',

  /* ── Measurable impact ─────────────────────────────────────── */
  impact_eyebrow:     'Methodology benchmarks',
  impact_title:       'What structured recovery infrastructure delivers.',
  impact_stat_1:      'Average reduction in days sales outstanding',
  impact_stat_2:      'Recovery before agency escalation',
  impact_stat_3:      'Return on pilot investment',
  impact_stat_4:      'File readiness at first counsel handoff',

  /* ── Executive clarity (SEO) ───────────────────────────────── */
  seo_eyebrow:        'Executive clarity',
  seo_title:          'What sophisticated buyers should understand before they engage.',
  seo_intro:          'This is the concise executive frame: recovery performance, documentation discipline, and escalation governance belong inside one operating model\u2014not in disconnected vendors and ad hoc cleanup work.',
  seo_card_1_h:       'Why recovery performance erodes',
  seo_card_1_p:       'Performance usually deteriorates when outreach cadence drifts, documentation quality weakens, and balances age into more expensive paths.',
  seo_card_2_h:       'What documentation discipline changes',
  seo_card_2_p:       'Cleaner chronology, auditable payment records, and controlled packet standards reduce friction for finance teams and improve file readiness before counsel review.',
  seo_card_3_h:       'How disciplined pilots create proof',
  seo_card_3_p:       'Diagnostic review, controlled workflow changes, and a 90-day pilot create evidence on net recovery, time-to-cash, and reduced external-cost exposure.',

  /* ── Diagnostic / strategic fit ────────────────────────────── */
  diag_eyebrow:       'Strategic fit snapshot',
  diag_title:         'Identify the right engagement path before avoidable cost compounds further.',
  diag_intro:         'This qualifier helps leadership determine whether the immediate priority is workflow recovery, legal-file control, or a combined pilot scope.',
  diag_qual_pill:     'Qualification',
  diag_qual_h:        'Strategic fit inputs',
  diag_label_industry:'Industry',
  diag_opt_healthcare:'Healthcare / dental',
  diag_opt_fleet:     'Fleet / fuel / logistics',
  diag_opt_subscription:'Subscription platform',
  diag_opt_services:  'Multi-location service business',
  diag_label_complexity:'Portfolio complexity',
  diag_opt_standard:  'Moderate aging and manageable file volume',
  diag_opt_high:      'Multiple aging cohorts and cross-location inconsistency',
  diag_opt_critical:  'Large aged portfolio with escalation pressure',
  diag_label_docs:    'Documentation condition',
  diag_opt_structured:'Structured and mostly auditable',
  diag_opt_mixed:     'Mixed quality / inconsistent by team or location',
  diag_opt_weak:      'Weak chronology, authorizations, or file discipline',
  diag_label_pain:    'Current pressure point',
  diag_opt_recovery:  'Recovery drag / aging balances',
  diag_opt_agency:    'Agency fee leakage / escalation',
  diag_opt_counsel:   'Attorney cleanup cost / file quality',
  diag_evaluate_btn:  'Generate engagement recommendation',
  diag_rec_pill:      'Recommendation',
  diag_rec_h:         'Recommended starting scope',
  diag_rec_strong:    'Recommended starting scope',
  diag_rec_p:         'Run the diagnostic to see whether your highest ROI entry point is recovery infrastructure, legal file control, or a combined 90-day pilot.',
  diag_rec_1:         'Recovery infrastructure is strongest where aged balances and workflow inconsistency reduce cash conversion.',
  diag_rec_2:         'Legal file control is strongest where outside counsel spends time on chronology cleanup, exhibit assembly, and file reconstruction.',
  diag_rec_3:         'Combined pilots are strongest where both financial leakage and documentation weakness exist at the same time.',
  diag_cta_file:      'Review legal file control',
  diag_cta_schedule:  'Schedule strategy consultation',

  /* ── Testimonials ──────────────────────────────────────────── */
  test_eyebrow:       'What operators say',
  test_title:         'Built for operators who measure before they scale.',
  test_1_text:        'The structured intake process gave us visibility into recovery gaps we had been ignoring. For the first time, our AR workflow had a documented standard instead of ad hoc follow-ups.',
  test_1_name:        'J. Martinez',
  test_1_role:        'CFO, Healthcare Group',
  test_2_text:        'Our files were a mess before escalation. The packet discipline brought everything to counsel-ready state \u2014 chronology, exhibits, gap log \u2014 so outside attorneys could start working immediately.',
  test_2_name:        'D. Kowalski',
  test_2_role:        'General Counsel, Fleet Services',
  test_3_text:        'The 90-day pilot gave our board a clear before-and-after picture. We moved from fragmented billing to a repeatable infrastructure with measurable results.',
  test_3_name:        'S. Reeves',
  test_3_role:        'COO, Subscription Platform',

  /* ── Proof / resources ─────────────────────────────────────── */
  proof_h:            'Institutional proof',
  proof_title_new:    'Use executive briefs and decks as board-room tools, not buried attachments.',
  proof_i:            'Use executive briefs, operator-facing decks, and decision-ready documentation as assets that support internal forwarding and partner review.',
  proof_stat_1:       'Revenue leakage areas',
  proof_stat_2:       'Primary operator paths',
  proof_stat_3:       'Clear brand narrative',
  res1_title:         'Healthcare leakage brief',
  res1_desc:          'Operator-facing summary of leakage points, DSO drag, and early agency fee compression.',
  res1_tag:           'Operator brief',
  res2_title:         'Healthcare CFO brief',
  res2_desc:          'Finance-facing brief for owners, CFOs, and operator leadership.',
  res2_tag:           'CFO decision brief',
  res3_title:         'Dental institutional deck',
  res3_desc:          'Institutional framing with pilot economics, sequencing logic, and executive positioning.',
  res3_tag:           'Institutional deck',
  res4_title:         'Pre-collection executive review',
  res4_desc:          'Framework logic, controlled escalation, and economics for pre-agency sequencing.',
  res4_tag:           'Executive review',
  open_pdf:           'Open PDF',

  /* ── First engagement outputs ──────────────────────────────── */
  engage_eyebrow:     'First engagement outputs',
  engage_title:       'What a serious first phase should produce.',
  engage_intro:       'Premium positioning means the buyer can see the work product before the sale. A first engagement should create documents, decisions, and implementation clarity \u2014 not just a conversation.',
  engage_1_pill:      'Diagnostic',
  engage_1_h:         'Workflow and leakage review',
  engage_1_p:         'Current-state review of the handoff, aging logic, document quality, and the highest-return points of control.',
  engage_2_pill:      'Control',
  engage_2_h:         'Document gap map and packet standard',
  engage_2_p:         'Priority list of missing records, packet rules, escalation boundaries, and the file structure required for a cleaner downstream handoff.',
  engage_3_pill:      'Proof',
  engage_3_h:         'Pilot scope and measurement plan',
  engage_3_p:         'Defined workstream, response window, KPI logic, and a pilot path that can produce evidence without inflated promises.',

  /* ── CTA banner ────────────────────────────────────────────── */
  cta_eyebrow:        'Next step',
  cta_title:          'Private advisory for operators that need cash control, documentation discipline, and cleaner escalation.',
  cta_intro:          'The consultation reviews recovery economics, legal-file readiness, and the most defensible next scope.',
  cta_primary:        'Request private consultation',
  cta_secondary:      'Review curated services',

  /* ── Concierge panel ───────────────────────────────────────── */
  concierge_eyebrow:  'Private consultation line',
  concierge_title:    'For executive routing, scoped review, and confidential coordination.',
  concierge_intro:    'Use intake for document-ready matters, or move through private consultation when leadership needs direction before building the packet.',
  concierge_call:     'Call or text',
  concierge_phone:    '(888) 794-8292',
  concierge_note:     'Private line for consultation coordination',
  concierge_cta1:     'Request private consultation',
  concierge_cta2:     'Open structured intake',

  /* ── Footer ────────────────────────────────────────────────── */
  footer_company:     'VitaCoreX LLC',
  footer_est:         'Established 2025',
  footer_ein:         'EIN: 41-4399148',
  footer_phone:       'Phone (call/text):',
  footer_disc:        'VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. It is not a law firm and does not provide legal representation. Legal strategy and legal advice remain the responsibility of licensed counsel.',
  footer_forms:       'The public forms are designed for general business documents and non-regulated materials. For highly sensitive or regulated records, request secure coordination first.',
  footer_copy:        '\u00a9 2026 VitaCoreX LLC. All rights reserved.',
  footer_col1:        'Company & solutions',
  footer_col2:        'Review, privacy & contact',
  footer_nav_home:    'Home',
  footer_nav_solutions:'Solutions',
  footer_nav_industries:'Industries',
  footer_nav_about:   'About VitaCoreX',
  footer_nav_recovery:'Revenue Recovery Infrastructure',
  footer_nav_file:    'Corporate Legal File Control',
  footer_nav_briefs:  'Executive Briefs & Proof',
  footer_nav_intake:  'Structured Case Intake',
  footer_nav_contact: 'Private consultation',
  footer_nav_careers: 'Careers',
  footer_nav_privacy: 'Privacy Policy',
  footer_nav_terms:   'Terms of Use',
  footer_nav_cookie:  'Cookie Policy',

  /* ── Exclusive badge ───────────────────────────────────────── */
  exclusive_badge:    'Private Advisory',

  /* ── Shared CTA labels (data-common) ───────────────────────── */
  brand_tag:          'Revenue recovery and documentation infrastructure',
  clock_vcx:          'VitaCoreX Time',
  clock_local:        'Your Time',
  clock_local_sub:    'Local',
  clock_sub_tampa:    'Tampa, FL',
  cta_intake:         'Request a confidential review',
  cta_briefs:         'View executive briefs',
  cta_workflow:       'View workflow',
  cta_deliverables:   'View deliverables',
},

/* ═══════════════════  RUSSIAN  ══════════════════════════════ */
ru: {

  hero_eyebrow:       'Консультирование для бизнеса',
  hero_title:         'Проектирование возврата выручки и контроль документации для операторов, которые не могут позволить себе слабую передачу дел.',
  hero_lead:          'VitaCoreX помогает сложным операторам наладить контроль денежных потоков, дисциплину документооборота и готовность к эскалации до того, как маржа будет потеряна из-за слабых процессов и дорогостоящего исправления.',
  hero_pill_1:        'Создано для операторов, финансовых директоров и руководителей портфелей',
  hero_pill_2:        'Дисциплина документации до роста внешних затрат',
  hero_pill_3:        'Мультииндустриальные системы с измеримым эффектом',

  stat_label_1:       'Направления решений',
  stat_label_2:       'Стандарт пилота',
  stat_label_3:       'Обязательство по ответу',
  stat_label_4:       'Стандарт counsel-ready файлов',

  metric_bar_full:    'Структурированный приём \u2022 Системы возврата \u2022 Контроль документов',
  metric_bar_short:   'Приём \u2022 Контроль документов',

  leaks_eyebrow:      'Где утечка начинается',
  leaks_title:        'Большая часть потерь выручки начинается задолго до стадии взыскания.',
  leaks_intro:        'Премиальная позиция \u2014 это не общая поддержка. Это дисциплинированная операционная инфраструктура, защищающая маржу, сохраняющая качество документации и не позволяющая неоправданным внешним расходам нарастать.',
  leak_1_h:           'Фрагментированная биллинговая каденция',
  leak_1_p:           'Задолженности стареют, потому что сроки обращений, сценарии и дисциплина последующих действий варьируются в зависимости от оператора и локации.',
  leak_2_h:           'Слабая структура платёжных планов',
  leak_2_p:           'Планы не работают, когда условия, автоплатежи, триггеры исправления и документация обрабатываются неформально.',
  leak_3_h:           'Преждевременное сжатие комиссий',
  leak_3_p:           'Счета передаются агентству слишком рано, отдавая маржу, которую более чистая внутренняя последовательность могла бы защитить.',
  leak_4_h:           'Отсутствие видимости KPI',
  leak_4_p:           'Руководство не может стандартизировать то, что не может измерить по когортам, площадкам и стадиям возврата.',
  leak_5_h:           'Неполный контроль файлов',
  leak_5_p:           'Когда эскалация становится необходимой, слабая структура пакетов и отсутствие документов создают лишние задержки и расходы.',

  why_eyebrow:        'Два пути для покупателя',
  why_title:          'Построено для компаний в первую очередь, при этом обслуживая избранные частные дела.',
  why_intro:          'Корпоративный консалтинг \u2014 наша основная экспертиза. Услуги для частных клиентов дополняют институциональную платформу, предлагая ту же дисциплину документации и стандарты качества для избранных частных вопросов.',
  b2b_badge:          'Для операторов',
  b2b_title:          'Консультирование для операторов, которым нужно более чистое исполнение до роста юридических и агентских расходов.',
  b2b_intro:          'Создано для организаций, которые хотят более сильного операционного контроля, более жёсткой документации и более надёжной модели передачи до ускорения внешних затрат.',
  b2b_b1:             'Проектирование процесса возврата выручки',
  b2b_b2:             'Очистка корпоративных файлов и контроль пакетов',
  b2b_b3:             'Экономика пилота, отчётность по KPI и логика масштабирования',
  b2b_b4:             'Позиционирование, готовое для совета директоров и CFO',
  b2b_cta:            'Запросить корпоративный разбор',
  ind_badge:          'Частные клиенты',
  ind_title:          'Курируемая поддержка частных клиентов остаётся доступной без ослабления корпоративной позиции.',
  ind_intro:          'Услуги для частных клиентов доступны для избранных индивидуальных вопросов, подкреплённые той же дисциплиной документации и стандартами качества, что и в нашей корпоративной работе.',
  ind_b1:             'Поддержка по контрактам и документации',
  ind_b2:             'Организация иммиграционного пакета',
  ind_b3:             'Проверка автомобильной покупки',
  ind_b4:             'Бизнес-план и поддержка запуска',
  ind_cta:            'Посмотреть услуги для частных клиентов',

  fit_eyebrow:        'Квалификация соответствия',
  fit_title:          'Лучше всего подходит для операторов, которым нужно более чистое исполнение до роста внешних затрат.',
  fit_intro:          'Мы работаем с операторами, которым нужно измеримое улучшение до роста внешних затрат \u2014 а не с командами, ищущими универсальную поддержку.',
  fit_best_pill:      'Лучший вариант',
  fit_best_1:         'Многолокационные операторы с просроченными балансами, непоследовательными процессами или слабой дисциплиной эскалации.',
  fit_best_2:         'Финансово-ориентированные команды, которым нужен измеримый путь от диагностики к пилотному подтверждению.',
  fit_best_3:         'Организации, которые хотят более чистого контроля пакетов до того, как возрастут расходы на внешних юристов или агентства.',
  fit_best_4:         'Владельцы, CFO, COO и операторы, работающие с юристами, которым нужна более убедительная модель передачи.',
  fit_not_pill:       'Не подходит',
  fit_not_1:          'Вопросы, требующие юридической консультации, юридического представительства или лицензированной деятельности по взысканию.',
  fit_not_2:          'Покупатели, ищущие универсальный аутсорсинговый колл-центр или широкий универсальный сервис.',
  fit_not_3:          'Команды, не желающие документировать исходные условия, изменения процессов или пилотные измерения.',
  fit_not_4:          'Высокочувствительные регулируемые записи, поданные через публичный приём без защищённой координации.',

  pilot_eyebrow:      '90-дневная структура',
  pilot_title:        'Серьёзная консалтинговая продажа требует видимого пути от диагностики к подтверждению.',
  pilot_intro:        'Премиальный путь \u2014 это диагностика, пилот и масштабирование, с доказательствами из реальных данных оператора, задокументированных изменений процессов и управленческой дисциплины.',
  step_1:             'Диагностика',
  step_1_p:           'Анализ текущего процесса, логики старения, качества файлов и точек трения в принятии решений.',
  step_2:             'Пилот',
  step_2_p:           'Запуск контролируемого 90-дневного этапа с отслеживанием, отчётностью и измеримыми целями роста.',
  step_3:             'Масштабирование',
  step_3_p:           'Масштабирование повторяемого процесса после того, как пилотные данные подтвердят готовность к корпоративному внедрению.',
  pilot_measure_h:    'Приоритеты пилотных измерений',
  pilot_m1:           'Чистые сборы до эскалации в агентство',
  pilot_m2:           'Активация и завершение платёжных планов по когортам',
  pilot_m3:           'Время до получения средств, показатели исправления и объём обработки исключений',
  pilot_m4:           'Улучшение готовности файлов, снижающее последующую очистку',
  pilot_note:         'Пилотные доказательства должны исходить из собственной базовой линии оператора и задокументированных изменений процессов, а не из шаблонных предположений о ROI.',

  services_eyebrow:   'Основные предложения',
  svc_h:              'Основные направления консалтинга',
  svc_i:              'Наши направления консалтинга сосредоточены на экономическом контроле, качестве файлов и внедрении на уровне руководства \u2014 обеспечивая измеримый результат, а не массовую поддержку.',
  svc_card_1_h:       'Инфраструктура возврата выручки',
  svc_card_1_p:       'Проектирование систем до агентской стадии, преобразующих задолженности в документированные обязательства до потери маржи.',
  svc_card_1_b1:      'Поведенческая сегментация',
  svc_card_1_b2:      'Контролируемые предложения и триггеры исправления',
  svc_card_1_b3:      'Логика ACH-приоритета или автоплатежа',
  svc_card_1_b4:      'Обработка исключений и отчётность',
  svc_card_1_b5:      'План измерений и логика отчётности',
  svc_card_2_h:       'Контроль корпоративной юридической документации',
  svc_card_2_p:       'Создание проверяемых дел, стандартов пакетов и процессов документации, готовых для передачи юристам.',
  svc_card_2_b1:      'Очистка хронологии',
  svc_card_2_b2:      'Упорядочение экспонатов и индексация файлов',
  svc_card_2_b3:      'Краткое описание проблем и журнал пробелов',
  svc_card_2_b4:      'Сборка пакетов, готовых для юристов',
  svc_card_2_b5:      'Дисциплина документации в командах',
  svc_card_3_h:       'Инфраструктурная поддержка параюриста',
  svc_card_3_p:       'Управление подготовкой документации и дисциплиной процессов, чтобы внешние юристы могли сосредоточиться на правовой стратегии.',
  svc_card_3_b1:      'Первичная карта проблем',
  svc_card_3_b2:      'Приоритетная маршрутизация',
  svc_card_3_b3:      'Перечень необходимых документов',
  svc_card_3_b4:      'Планирование окна ответа',
  svc_card_3_b5:      'Записка по следующим шагам',

  ind_wedge_eyebrow:  'Отраслевые клинья',
  ind_wedge_title:    'Целевые страницы для операционных сред, которые лучше всего подходят модели.',
  ind_wedge_intro:    'Каждая отраслевая страница раскрывает конкретные задачи возврата выручки и документации, с которыми операторы сталкиваются в данном секторе.',
  ind_w1_pill:        'Здравоохранение и стоматология',
  ind_w1_h:           'Контроль документации и проектирование процессов до агентской стадии для сложных сред с балансами пациентов.',
  ind_w1_p:           'Полезно там, где утечка выручки, несогласованность пакетов и очистка при эскалации происходят одновременно.',
  ind_w2_pill:        'Подписки и регулярные платежи',
  ind_w2_h:           'Чувствительное к удержанию проектирование возврата для операторов, управляющих сложностью регулярного биллинга.',
  ind_w2_p:           'Создано для решения проблем платёжного трения, сегментации стареющих балансов и чистой обработки исключений.',
  ind_w3_pill:        'Автопарк и логистика',
  ind_w3_h:           'Процессы возврата и дисциплина файлов для контрактоёмких портфелей с распределёнными операциями.',
  ind_w3_p:           'Полезно, когда операционная несогласованность превращает дебиторскую задолженность и записи в потерю маржи.',
  ind_w4_pill:        'Контрактоёмкие услуги',
  ind_w4_h:           'Контроль денежных потоков и логика пакетов для коммерческих сервисных бизнесов с многосторонней документацией.',
  ind_w4_p:           'Разработано для операторов, которым нужны более чистые записи по счетам, авторизациям и эскалациям.',
  ind_wedge_cta1:     'Обзор отраслевых страниц',
  ind_wedge_cta2:     'Запросить конфиденциальный разбор',

  v52_eyebrow:        'Институциональный авторитет',
  v52_title:          'Институциональная консалтинговая инфраструктура для возврата выручки, контроля юридической документации и дисциплинированного исполнения.',
  v52_intro:          'Разработано для сложных операторов, которым нужен более чистый контроль документации, более сильная дисциплина эскалации и более убедительная операционная модель до роста внешних затрат.',
  v52_profiles_pill:  'Профили операторов',
  v52_profiles_title: 'Где сложные операторы развёртывают VitaCoreX',
  v52_profiles_intro: 'Мы поддерживаем организации, управляющие контрактной сложностью, трением дебиторской задолженности и документацией, обращённой к юристам, в различных операционных средах.',
  v52_profile_1:      'Операторы здравоохранения',
  v52_profile_2:      'Программы автопарков и топливных карт',
  v52_profile_3:      'Подписочные платформы',
  v52_profile_4:      'Сети многолокационных услуг',
  v52_profile_5:      'Контрактные коммерческие портфели',
  v52_governance_pill: 'Управление',
  v52_governance_title:'Контроль документации для финансов, комплаенса и внешних юристов',
  v52_governance_intro:'VitaCoreX структурирует файлы, платёжную документацию и записи об эскалациях, чтобы правовая стратегия не была обременена административной очисткой.',
  v52_gov_1:          'Проверяемая файловая структура и упаковка доказательств',
  v52_gov_2:          'Документация платёжных планов и контроль авторизаций',
  v52_gov_3:          'Подготовка уровня параюриста в рамках консалтинговых контрактов',
  v52_gov_4:          'Более чистая передача внешним юристам, когда эскалация необходима',
  v52_pilot_pill:     'Управление пилотом',
  v52_pilot_h:        'Что руководство должно проверять в ходе живого пилота',
  v52_pilot_1:        'Возвращённые средства по сравнению с предыдущей базовой линией оператора',
  v52_pilot_2:        'Балансы, не переданные в агентство или другие более дорогие пути эскалации',
  v52_pilot_3:        'Улучшение качества файлов, делающее передачу юристам более чистой',
  v52_pilot_4:        'Очереди исключений, завершение платёжных планов и документированная дисциплина следующих шагов',
  v52_evidence_pill:  'Стандарт доказательств',
  v52_evidence_h:     'Как доказательства должны быть задокументированы',
  v52_evidence_p:     'Используйте отчётность, принадлежащую оператору, когортные сравнения, движение старения и наблюдения за качеством пакетов. Избегайте публикации иллюстративных ROI или статистики кейсов, если они не привязаны к верифицируемым живым контрактам.',
  v52_evidence_cta1:  'Открыть структурированный приём',
  v52_evidence_cta2:  'Обзор материалов для руководства',

  impact_eyebrow:     'Отраслевые ориентиры',
  impact_title:       'Что даёт структурированная инфраструктура возврата.',
  impact_stat_1:      'Среднее сокращение дней дебиторской задолженности',
  impact_stat_2:      'Возврат до эскалации в агентство',
  impact_stat_3:      'Возврат на инвестиции в пилот',
  impact_stat_4:      'Готовность файла при первой передаче юристам',

  seo_eyebrow:        'Ясность для руководства',
  seo_title:          'Что опытные покупатели должны понимать перед началом сотрудничества.',
  seo_intro:          'Это лаконичная рамка для руководства: результаты возврата, дисциплина документации и управление эскалацией принадлежат единой операционной модели \u2014 а не разрозненным подрядчикам и ситуативной очистке.',
  seo_card_1_h:       'Почему результаты возврата ухудшаются',
  seo_card_1_p:       'Результаты обычно падают, когда каденция обращений сбивается, качество документации снижается, а балансы стареют по более дорогим путям.',
  seo_card_2_h:       'Что меняет дисциплина документации',
  seo_card_2_p:       'Более чистая хронология, проверяемые платёжные записи и контролируемые стандарты пакетов снижают трение для финансовых команд и улучшают готовность файлов до проверки юристами.',
  seo_card_3_h:       'Как дисциплинированные пилоты создают доказательства',
  seo_card_3_p:       'Диагностический обзор, контролируемые изменения процессов и 90-дневный пилот создают доказательства по чистому возврату, времени до получения средств и снижению внешних расходов.',

  diag_eyebrow:       'Стратегический снимок',
  diag_title:         'Определите правильный путь вовлечения, пока неоправданные расходы не начали нарастать.',
  diag_intro:         'Этот квалификатор помогает руководству определить, является ли непосредственным приоритетом восстановление процессов, контроль юридических файлов или комбинированный пилотный проект.',
  diag_qual_pill:     'Квалификация',
  diag_qual_h:        'Параметры стратегического соответствия',
  diag_label_industry:'Отрасль',
  diag_opt_healthcare:'Здравоохранение / стоматология',
  diag_opt_fleet:     'Автопарк / топливо / логистика',
  diag_opt_subscription:'Подписочная платформа',
  diag_opt_services:  'Многолокационный сервисный бизнес',
  diag_label_complexity:'Сложность портфеля',
  diag_opt_standard:  'Умеренное старение и управляемый объём файлов',
  diag_opt_high:      'Множественные когорты старения и межлокационная несогласованность',
  diag_opt_critical:  'Крупный просроченный портфель с давлением эскалации',
  diag_label_docs:    'Состояние документации',
  diag_opt_structured:'Структурированная и в основном проверяемая',
  diag_opt_mixed:     'Смешанное качество / непоследовательность по командам или локациям',
  diag_opt_weak:      'Слабая хронология, авторизации или дисциплина файлов',
  diag_label_pain:    'Текущая точка давления',
  diag_opt_recovery:  'Торможение возврата / стареющие балансы',
  diag_opt_agency:    'Утечка агентских комиссий / эскалация',
  diag_opt_counsel:   'Расходы на очистку адвокатами / качество файлов',
  diag_evaluate_btn:  'Сформировать рекомендацию по контракту',
  diag_rec_pill:      'Рекомендация',
  diag_rec_h:         'Рекомендуемый начальный объём',
  diag_rec_strong:    'Рекомендуемый начальный объём',
  diag_rec_p:         'Запустите диагностику, чтобы определить, является ли вашей точкой входа с наивысшим ROI инфраструктура возврата, контроль юридических файлов или комбинированный 90-дневный пилот.',
  diag_rec_1:         'Инфраструктура возврата наиболее эффективна там, где просроченные балансы и несогласованность процессов снижают конверсию денежных средств.',
  diag_rec_2:         'Контроль юридических файлов наиболее эффективен, когда внешние юристы тратят время на очистку хронологии, сборку экспонатов и реконструкцию файлов.',
  diag_rec_3:         'Комбинированные пилоты наиболее эффективны, когда финансовая утечка и слабость документации существуют одновременно.',
  diag_cta_file:      'Обзор контроля юридических файлов',
  diag_cta_schedule:  'Запланировать стратегическую консультацию',

  test_eyebrow:       'Что говорят операторы',
  test_title:         'Создано для операторов, которые измеряют прежде чем масштабировать.',
  test_1_text:        'Структурированный процесс интейка дал нам прозрачность в отношении пробелов возврата, которые мы игнорировали. Впервые наш AR-процесс имел документированный стандарт вместо разовых действий.',
  test_1_name:        'Х. Мартинес',
  test_1_role:        'CFO, Группа здравоохранения',
  test_2_text:        'Наши файлы были в беспорядке перед эскалацией. Пакетная дисциплина привела всё в counsel-ready состояние — хронология, экспонаты, журнал пробелов — чтобы внешние юристы могли начать работу сразу.',
  test_2_name:        'Д. Ковальски',
  test_2_role:        'Главный юрист, Fleet Services',
  test_3_text:        '90-дневный пилот дал нашему совету директоров чёткую картину до и после. Мы перешли от фрагментированного биллинга к воспроизводимой инфраструктуре с измеримыми результатами.',
  test_3_name:        'С. Ривз',
  test_3_role:        'COO, Подписочная платформа',

  proof_h:            'Институциональное подтверждение',
  proof_title_new:    'Используйте брифы и презентации как инструменты для зала заседаний, а не скрытые вложения.',
  proof_i:            'Используйте исполнительные брифы, операторские презентации и документацию для принятия решений как активы для внутренней пересылки и партнёрской проверки.',
  proof_stat_1:       'Зон утечки выручки',
  proof_stat_2:       'Основных операторских путей',
  proof_stat_3:       'Единый бренд-нарратив',
  res1_title:         'Бриф по утечкам в здравоохранении',
  res1_desc:          'Операторский обзор точек утечки, торможения DSO и преждевременного сжатия агентских комиссий.',
  res1_tag:           'Операторский бриф',
  res2_title:         'Бриф для CFO здравоохранения',
  res2_desc:          'Финансовый бриф для владельцев, CFO и руководства операторов.',
  res2_tag:           'Бриф для CFO',
  res3_title:         'Институциональная презентация по стоматологии',
  res3_desc:          'Институциональная рамка с экономикой пилота, логикой последовательности и позиционированием для руководства.',
  res3_tag:           'Институциональная презентация',
  res4_title:         'Исполнительный обзор предвзыскания',
  res4_desc:          'Логика структуры, контролируемая эскалация и экономика для предагентской последовательности.',
  res4_tag:           'Исполнительный обзор',
  open_pdf:           'Открыть PDF',

  engage_eyebrow:     'Результаты первого контракта',
  engage_title:       'Что должна произвести серьёзная первая фаза.',
  engage_intro:       'Премиальное позиционирование означает, что покупатель может увидеть продукт работы до продажи. Первый контракт должен создать документы, решения и ясность внедрения \u2014 а не просто разговор.',
  engage_1_pill:      'Диагностика',
  engage_1_h:         'Анализ процесса и утечек',
  engage_1_p:         'Обзор текущего состояния передачи, логики старения, качества документов и точек контроля с наибольшей отдачей.',
  engage_2_pill:      'Контроль',
  engage_2_h:         'Карта пробелов документации и стандарт пакетов',
  engage_2_p:         'Приоритетный список недостающих записей, правил пакетов, границ эскалации и файловой структуры для более чистой последующей передачи.',
  engage_3_pill:      'Подтверждение',
  engage_3_h:         'Пилотный объём и план измерений',
  engage_3_p:         'Определённый рабочий поток, окно ответа, логика KPI и пилотный путь, способный производить доказательства без завышенных обещаний.',

  cta_eyebrow:        'Следующий шаг',
  cta_title:          'Частный консалтинг для операторов, которым нужен контроль денежных потоков, дисциплина документации и более чистая эскалация.',
  cta_intro:          'Консультация охватывает экономику возврата, готовность юридических файлов и наиболее обоснованный следующий объём.',
  cta_primary:        'Запросить частную консультацию',
  cta_secondary:      'Обзор курируемых услуг',

  concierge_eyebrow:  'Линия частной консультации',
  concierge_title:    'Для маршрутизации руководства, целевого разбора и конфиденциальной координации.',
  concierge_intro:    'Используйте приём для дел, готовых к документированию, или обращайтесь через частную консультацию, когда руководству нужно направление до формирования пакета.',
  concierge_call:     'Позвонить или написать',
  concierge_phone:    '(888) 794-8292',
  concierge_note:     'Частная линия для координации консультаций',
  concierge_cta1:     'Запросить частную консультацию',
  concierge_cta2:     'Открыть структурированный приём',

  footer_company:     'VitaCoreX LLC',
  footer_est:         'Работает с 2025 года',
  footer_ein:         'EIN: 41-4399148',
  footer_phone:       'Телефон (звонок / SMS):',
  footer_disc:        'VitaCoreX LLC оказывает административную, документарную, операционную и бизнес-поддержку. Компания не является юридической фирмой и не оказывает юридическое представительство. Правовая стратегия и юридические советы относятся к компетенции лицензированного адвоката.',
  footer_forms:       'Публичные формы предназначены для общих деловых документов и нерегулируемых материалов. Для особо чувствительных или регулируемых данных сначала запросите защищённую координацию.',
  footer_copy:        '\u00a9 2026 VitaCoreX LLC. Все права защищены.',
  footer_col1:        'Компания и решения',
  footer_col2:        'Разбор, конфиденциальность и контакты',
  footer_nav_home:    'Главная',
  footer_nav_solutions:'Решения',
  footer_nav_industries:'Отрасли',
  footer_nav_about:   'О VitaCoreX',
  footer_nav_recovery:'Инфраструктура возврата выручки',
  footer_nav_file:    'Контроль юридической документации',
  footer_nav_briefs:  'Материалы для руководства',
  footer_nav_intake:  'Структурированный первичный приём',
  footer_nav_contact: 'Конфиденциальная консультация',
  footer_nav_careers: 'Сотрудничество',
  footer_nav_privacy: 'Политика конфиденциальности',
  footer_nav_terms:   'Условия использования',
  footer_nav_cookie:  'Политика cookie',

  exclusive_badge:    'Частный консалтинг',

  brand_tag:          'Инфраструктура возврата выручки и контроля документации',
  clock_vcx:          'Время VitaCoreX',
  clock_local:        'Ваше время',
  clock_local_sub:    'Локально',
  clock_sub_tampa:    'Тампа, Флорида',
  cta_intake:         'Запросить конфиденциальный разбор',
  cta_briefs:         'Открыть материалы для руководства',
  cta_workflow:       'Посмотреть процесс',
  cta_deliverables:   'Посмотреть состав работ',
},

/* ═══════════════════  SPANISH  ══════════════════════════════ */
es: {

  hero_eyebrow:       'Consultoría corporativa',
  hero_title:         'Diseno de recuperacion de ingresos y control de documentacion para operadores que no pueden permitirse una transferencia debil.',
  hero_lead:          'VitaCoreX ayuda a operadores complejos a mejorar el control de efectivo, la disciplina de expedientes y la preparacion para escalamiento antes de que el margen se pierda por flujos debiles y costosa correccion.',
  hero_pill_1:        'Creado para operadores, directores financieros y liderazgo de cartera',
  hero_pill_2:        'Disciplina documental antes de que crezcan los costos externos',
  hero_pill_3:        'Logica piloto con resultados medibles',

  stat_label_1:       'Lineas de solucion',
  stat_label_2:       'Estandar de piloto',
  stat_label_3:       'Compromiso de respuesta',
  stat_label_4:       'Estandar de archivo counsel-ready',

  metric_bar_full:    'Admision estructurada \u2022 Sistemas de recuperacion \u2022 Control documental',
  metric_bar_short:   'Admision \u2022 Control documental',

  leaks_eyebrow:      'Donde comienza la fuga',
  leaks_title:        'La mayor parte de la perdida de ingresos comienza antes de que la cobranza siquiera empiece.',
  leaks_intro:        'La posicion premium no es soporte general. Es infraestructura operativa disciplinada que protege el margen, preserva la calidad documental e impide que los costos externos evitables se acumulen.',
  leak_1_h:           'Cadencia de facturacion fragmentada',
  leak_1_p:           'Los saldos envejecen porque los tiempos de contacto, guiones y disciplina de seguimiento varian segun el operador y la ubicacion.',
  leak_2_h:           'Estructura debil de planes de pago',
  leak_2_p:           'Los planes fallan cuando los terminos, el autopago, los disparadores de correccion y la documentacion se manejan informalmente.',
  leak_3_h:           'Compresion prematura de comisiones',
  leak_3_p:           'Las cuentas pasan a la agencia demasiado pronto, cediendo margen que una secuencia interna mas limpia podria proteger.',
  leak_4_h:           'Sin visibilidad de KPI',
  leak_4_p:           'El liderazgo no puede estandarizar lo que no puede medir a traves de cohortes, ubicaciones y etapas de recuperacion.',
  leak_5_h:           'Control de archivos incompleto',
  leak_5_p:           'Cuando el escalamiento se vuelve necesario, la estructura debil de paquetes y la falta de registros crean demoras y costos evitables.',

  why_eyebrow:        'Dos caminos de compra',
  why_title:          'Construido para empresas primero, sin dejar de servir asuntos individuales seleccionados.',
  why_intro:          'La consultoria corporativa es nuestra experiencia principal. Los servicios para clientes privados complementan la plataforma institucional, ofreciendo la misma disciplina documental y estandares de calidad para asuntos individuales seleccionados.',
  b2b_badge:          'Para operadores',
  b2b_title:          'Consultoria para operadores que necesitan una ejecucion mas limpia antes de que crezcan los costos legales y de agencia.',
  b2b_intro:          'Construido para organizaciones que desean un control operativo mas fuerte, documentacion mas estricta y un modelo de transferencia mas defendible antes de que los gastos externos se aceleren.',
  b2b_b1:             'Diseno de flujo de recuperacion de ingresos',
  b2b_b2:             'Limpieza de archivos corporativos y control de paquetes',
  b2b_b3:             'Economia piloto, informes de KPI y logica de despliegue',
  b2b_b4:             'Posicionamiento listo para junta directiva y CFO',
  b2b_cta:            'Solicitar revision corporativa',
  ind_badge:          'Clientes privados',
  ind_title:          'El soporte curado para clientes privados permanece disponible sin debilitar la posicion corporativa.',
  ind_intro:          'Los servicios para clientes privados estan disponibles para asuntos individuales seleccionados, respaldados por la misma disciplina documental y estandares de calidad de nuestra consultoria corporativa.',
  ind_b1:             'Soporte de contratos y documentacion',
  ind_b2:             'Organizacion de paquete de inmigracion',
  ind_b3:             'Revision de compra de vehiculo',
  ind_b4:             'Plan de negocios y soporte de lanzamiento',
  ind_cta:            'Ver servicios para clientes privados',

  fit_eyebrow:        'Calificacion de ajuste',
  fit_title:          'Mejor ajuste para operadores que necesitan ejecucion mas limpia antes de que los costos externos se expandan.',
  fit_intro:          'Trabajamos con operadores que necesitan mejoras medibles antes de que crezcan los costos externos \u2014 no con equipos que buscan soporte generico.',
  fit_best_pill:      'Mejor ajuste',
  fit_best_1:         'Operadores multi-ubicacion con saldos envejecidos, flujos de trabajo inconsistentes o disciplina de escalamiento debil.',
  fit_best_2:         'Equipos liderados por finanzas que necesitan un camino medible desde la revision diagnostica hasta la prueba piloto.',
  fit_best_3:         'Organizaciones que desean un control de paquetes mas limpio antes de que crezcan los costos de abogados externos o agencias.',
  fit_best_4:         'Propietarios, CFO, COO y operadores cercanos a abogados que necesitan un modelo de transferencia mas creible.',
  fit_not_pill:       'No es el ajuste correcto',
  fit_not_1:          'Asuntos que requieren asesoria legal, representacion legal o actividad de cobranza con licencia.',
  fit_not_2:          'Compradores que buscan un centro de llamadas subcontratado generico o un servicio amplio de "hacemos todo".',
  fit_not_3:          'Equipos no dispuestos a documentar condiciones base, cambios de flujo de trabajo o mediciones piloto.',
  fit_not_4:          'Registros regulados altamente sensibles enviados a traves de un formulario publico sin coordinacion segura.',

  pilot_eyebrow:      'Estructura de 90 dias',
  pilot_title:        'Una venta de consultoria seria necesita un camino visible del diagnostico a la prueba.',
  pilot_intro:        'El camino premium es diagnosticar, pilotar y escalar, con pruebas tomadas de datos reales del operador, cambios documentados en el flujo de trabajo y disciplina de gobernanza.',
  step_1:             'Diagnosticar',
  step_1_p:           'Revisar el flujo de trabajo actual, la logica de envejecimiento, la calidad de archivos y la friccion en las decisiones.',
  step_2:             'Pilotar',
  step_2_p:           'Ejecutar un alcance controlado de 90 dias con seguimiento, informes y objetivos de mejora medibles.',
  step_3:             'Escalar',
  step_3_p:           'Desplegar el proceso repetible una vez que la evidencia piloto respalde la adopcion empresarial.',
  pilot_measure_h:    'Prioridades de medicion piloto',
  pilot_m1:           'Cobros netos capturados antes del escalamiento a agencia',
  pilot_m2:           'Activacion y finalizacion de planes de pago por cohorte',
  pilot_m3:           'Tiempo hasta el efectivo, tasas de correccion y volumen de manejo de excepciones',
  pilot_m4:           'Mejoras en la preparacion de archivos que reducen la limpieza posterior',
  pilot_note:         'La prueba piloto debe provenir de la linea base propia del operador y los cambios documentados en el flujo de trabajo, no de supuestos de ROI basados en plantillas.',

  services_eyebrow:   'Ofertas principales',
  svc_h:              'Lineas de consultoria principales',
  svc_i:              'Nuestras lineas de consultoria se centran en el control economico, la calidad de archivos y la implementacion ejecutiva \u2014 entregando valor medible, no soporte generico.',
  svc_card_1_h:       'Infraestructura de recuperacion de ingresos',
  svc_card_1_p:       'Diseno de sistemas pre-agencia que convierten saldos en compromisos documentados antes de perder margen.',
  svc_card_1_b1:      'Segmentacion conductual',
  svc_card_1_b2:      'Ofertas controladas y disparadores de correccion',
  svc_card_1_b3:      'Logica de ACH prioritario o activacion de autopago',
  svc_card_1_b4:      'Manejo de excepciones e informes',
  svc_card_1_b5:      'Plan de medicion y logica de informes',
  svc_card_2_h:       'Control de expediente legal corporativo',
  svc_card_2_p:       'Construir expedientes auditables, estandares de paquetes y flujos de documentacion listos para abogados.',
  svc_card_2_b1:      'Limpieza de cronologia',
  svc_card_2_b2:      'Orden de exhibiciones e indexacion de archivos',
  svc_card_2_b3:      'Resumen de problemas y registro de brechas',
  svc_card_2_b4:      'Ensamblaje de paquetes listos para abogados',
  svc_card_2_b5:      'Disciplina de documentacion entre equipos',
  svc_card_3_h:       'Soporte de infraestructura paralegal',
  svc_card_3_p:       'Gestionar la preparacion de documentacion y la disciplina del flujo de trabajo para que los abogados externos se concentren en la estrategia legal real.',
  svc_card_3_b1:      'Mapeo inicial de problemas',
  svc_card_3_b2:      'Enrutamiento prioritario',
  svc_card_3_b3:      'Lista de documentos requeridos',
  svc_card_3_b4:      'Planificacion de ventana de respuesta',
  svc_card_3_b5:      'Memorando de pasos siguientes',

  ind_wedge_eyebrow:  'Cunas industriales',
  ind_wedge_title:    'Paginas de entrada enfocadas para los entornos operativos que mejor se ajustan al modelo.',
  ind_wedge_intro:    'Cada pagina industrial aborda los desafios especificos de recuperacion y documentacion que enfrentan los operadores en ese sector.',
  ind_w1_pill:        'Salud y dental',
  ind_w1_h:           'Control de documentacion y diseno de flujo pre-agencia para entornos complejos de saldos de pacientes.',
  ind_w1_p:           'Util donde la fuga de ingresos, la inconsistencia de paquetes y la limpieza de escalamiento ocurren simultaneamente.',
  ind_w2_pill:        'Suscripciones y pagos recurrentes',
  ind_w2_h:           'Diseno de recuperacion sensible a la retencion para operadores que gestionan complejidad de facturacion recurrente.',
  ind_w2_p:           'Construido para friccion de pagos, segmentacion de saldos envejecidos y manejo de excepciones mas limpio.',
  ind_w3_pill:        'Flotas y logistica',
  ind_w3_h:           'Flujos de recuperacion y disciplina de archivos para carteras pesadas en contratos con operaciones dispersas.',
  ind_w3_p:           'Util cuando la inconsistencia operativa convierte cuentas por cobrar y registros en perdida de margen.',
  ind_w4_pill:        'Servicios pesados en contratos',
  ind_w4_h:           'Logica de control de efectivo y paquetes listos para abogados para negocios de servicios comerciales con documentacion multipartita.',
  ind_w4_p:           'Disenado para operadores que necesitan registros mas limpios de facturas, autorizaciones y escalamientos.',
  ind_wedge_cta1:     'Revisar paginas industriales',
  ind_wedge_cta2:     'Solicitar revision confidencial',

  v52_eyebrow:        'Autoridad institucional',
  v52_title:          'Infraestructura de consultoria institucional para recuperacion de ingresos, control de expediente legal corporativo y ejecucion disciplinada.',
  v52_intro:          'Disenada para operadores complejos que necesitan un control de documentacion mas limpio, una disciplina de escalamiento mas fuerte y un modelo operativo mas creible antes de que los costos externos se expandan.',
  v52_profiles_pill:  'Perfiles de operadores',
  v52_profiles_title: 'Donde operadores complejos despliegan VitaCoreX',
  v52_profiles_intro: 'Apoyamos organizaciones que gestionan complejidad contractual, friccion de cuentas por cobrar y documentacion orientada a abogados en multiples entornos operativos.',
  v52_profile_1:      'Operadores de salud',
  v52_profile_2:      'Programas de flotas y tarjetas de combustible',
  v52_profile_3:      'Plataformas de suscripcion',
  v52_profile_4:      'Redes de servicios multi-ubicacion',
  v52_profile_5:      'Carteras comerciales basadas en contratos',
  v52_governance_pill: 'Gobernanza',
  v52_governance_title:'Control de documentacion que apoya finanzas, cumplimiento y abogados externos',
  v52_governance_intro:'VitaCoreX estructura archivos, documentacion de pagos y registros de escalamiento para que la estrategia legal no este agobiada por limpieza administrativa.',
  v52_gov_1:          'Estructura de archivos auditable y empaque de evidencia',
  v52_gov_2:          'Documentacion de planes de pago y control de autorizaciones',
  v52_gov_3:          'Preparacion de grado paralegal bajo compromisos de consultoria',
  v52_gov_4:          'Transferencia mas limpia a abogados externos cuando el escalamiento es necesario',
  v52_pilot_pill:     'Gobernanza piloto',
  v52_pilot_h:        'Lo que el liderazgo debe revisar durante un piloto en vivo',
  v52_pilot_1:        'Efectivo recuperado comparado con la linea base anterior del operador',
  v52_pilot_2:        'Saldos mantenidos fuera de agencia u otras vias de escalamiento mas costosas',
  v52_pilot_3:        'Mejoras en la calidad de archivos que hacen mas limpia la transferencia a abogados',
  v52_pilot_4:        'Colas de excepciones, finalizacion de planes de pago y disciplina documentada de pasos siguientes',
  v52_evidence_pill:  'Estandar de evidencia',
  v52_evidence_h:     'Como debe documentarse la prueba',
  v52_evidence_p:     'Utilice informes propiedad del operador, comparaciones de cohortes, movimiento de envejecimiento y observaciones de calidad de paquetes. Evite publicar ROI ilustrativo o estadisticas de casos a menos que esten vinculados a compromisos verificables en vivo.',
  v52_evidence_cta1:  'Abrir admision estructurada',
  v52_evidence_cta2:  'Revisar materiales ejecutivos',

  impact_eyebrow:     'Referentes metodologicos',
  impact_title:       'Lo que entrega la infraestructura de recuperacion estructurada.',
  impact_stat_1:      'Reduccion promedio en dias de ventas pendientes',
  impact_stat_2:      'Recuperacion antes del escalamiento a agencia',
  impact_stat_3:      'Retorno sobre inversion piloto',
  impact_stat_4:      'Preparacion de archivo en primera transferencia a abogados',

  seo_eyebrow:        'Claridad ejecutiva',
  seo_title:          'Lo que los compradores sofisticados deben entender antes de comprometerse.',
  seo_intro:          'Este es el marco ejecutivo conciso: el rendimiento de recuperacion, la disciplina de documentacion y la gobernanza de escalamiento pertenecen a un modelo operativo, no a proveedores desconectados y trabajo de limpieza ad hoc.',
  seo_card_1_h:       'Por que el rendimiento de recuperacion se deteriora',
  seo_card_1_p:       'El rendimiento generalmente se deteriora cuando la cadencia de contacto se desvia, la calidad de documentacion se debilita y los saldos envejecen por caminos mas costosos.',
  seo_card_2_h:       'Que cambia la disciplina de documentacion',
  seo_card_2_p:       'Cronologia mas limpia, registros de pago auditables y estandares de paquetes controlados reducen la friccion para los equipos financieros y mejoran la preparacion de archivos antes de la revision de abogados.',
  seo_card_3_h:       'Como los pilotos disciplinados crean pruebas',
  seo_card_3_p:       'La revision diagnostica, los cambios controlados en el flujo de trabajo y un piloto de 90 dias crean evidencia sobre recuperacion neta, tiempo hasta el efectivo y reduccion de costos externos.',

  diag_eyebrow:       'Instantanea de ajuste estrategico',
  diag_title:         'Identifique el camino de compromiso correcto antes de que los costos evitables se acumulen.',
  diag_intro:         'Este calificador ayuda al liderazgo a determinar si la prioridad inmediata es recuperacion de flujo de trabajo, control de archivos legales o un alcance piloto combinado.',
  diag_qual_pill:     'Calificacion',
  diag_qual_h:        'Datos de ajuste estrategico',
  diag_label_industry:'Industria',
  diag_opt_healthcare:'Salud / dental',
  diag_opt_fleet:     'Flotas / combustible / logistica',
  diag_opt_subscription:'Plataforma de suscripcion',
  diag_opt_services:  'Negocio de servicios multi-ubicacion',
  diag_label_complexity:'Complejidad de cartera',
  diag_opt_standard:  'Envejecimiento moderado y volumen de archivos manejable',
  diag_opt_high:      'Multiples cohortes de envejecimiento e inconsistencia entre ubicaciones',
  diag_opt_critical:  'Cartera grande envejecida con presion de escalamiento',
  diag_label_docs:    'Condicion de documentacion',
  diag_opt_structured:'Estructurada y mayormente auditable',
  diag_opt_mixed:     'Calidad mixta / inconsistente por equipo o ubicacion',
  diag_opt_weak:      'Cronologia, autorizaciones o disciplina de archivos debiles',
  diag_label_pain:    'Punto de presion actual',
  diag_opt_recovery:  'Arrastre de recuperacion / saldos envejecidos',
  diag_opt_agency:    'Fuga de comisiones de agencia / escalamiento',
  diag_opt_counsel:   'Costo de limpieza de abogados / calidad de archivos',
  diag_evaluate_btn:  'Generar recomendacion de compromiso',
  diag_rec_pill:      'Recomendacion',
  diag_rec_h:         'Alcance inicial recomendado',
  diag_rec_strong:    'Alcance inicial recomendado',
  diag_rec_p:         'Ejecute el diagnostico para ver si su punto de entrada de mayor ROI es infraestructura de recuperacion, control de archivos legales o un piloto combinado de 90 dias.',
  diag_rec_1:         'La infraestructura de recuperacion es mas fuerte donde los saldos envejecidos y la inconsistencia del flujo de trabajo reducen la conversion de efectivo.',
  diag_rec_2:         'El control de archivos legales es mas fuerte donde los abogados externos dedican tiempo a limpieza de cronologia, ensamblaje de exhibiciones y reconstruccion de archivos.',
  diag_rec_3:         'Los pilotos combinados son mas fuertes donde la fuga financiera y la debilidad de documentacion existen al mismo tiempo.',
  diag_cta_file:      'Revisar control de archivo legal',
  diag_cta_schedule:  'Programar consulta estrategica',

  test_eyebrow:       'Lo que dicen los operadores',
  test_title:         'Disenado para operadores que miden antes de escalar.',
  test_1_text:        'El proceso estructurado de ingreso nos dio visibilidad sobre las brechas de recuperacion que habiamos ignorado. Por primera vez, nuestro flujo de AR tenia un estandar documentado en lugar de seguimientos ad hoc.',
  test_1_name:        'J. Martinez',
  test_1_role:        'CFO, Grupo de Salud',
  test_2_text:        'Nuestros archivos eran un desorden antes de la escalacion. La disciplina de paquetes llevo todo a un estado counsel-ready — cronologia, exhibiciones, registro de brechas — para que los abogados externos pudieran comenzar a trabajar de inmediato.',
  test_2_name:        'D. Kowalski',
  test_2_role:        'Asesor General, Fleet Services',
  test_3_text:        'El piloto de 90 dias le dio a nuestra junta una imagen clara de antes y despues. Pasamos de facturacion fragmentada a una infraestructura repetible con resultados medibles.',
  test_3_name:        'S. Reeves',
  test_3_role:        'COO, Plataforma de Suscripcion',

  proof_h:            'Prueba institucional',
  proof_title_new:    'Use informes ejecutivos y presentaciones como herramientas de sala de juntas, no como adjuntos enterrados.',
  proof_i:            'Use informes ejecutivos, presentaciones orientadas al operador y documentacion lista para decisiones como activos que respaldan el reenvio interno y la revision de socios.',
  proof_stat_1:       'Areas de fuga de ingresos',
  proof_stat_2:       'Caminos principales del operador',
  proof_stat_3:       'Narrativa de marca clara',
  res1_title:         'Informe de fugas en salud',
  res1_desc:          'Resumen orientado al operador de puntos de fuga, arrastre de DSO y compresion prematura de comisiones de agencia.',
  res1_tag:           'Informe del operador',
  res2_title:         'Informe CFO de salud',
  res2_desc:          'Informe financiero para propietarios, CFO y liderazgo del operador.',
  res2_tag:           'Informe de decision del CFO',
  res3_title:         'Presentacion institucional dental',
  res3_desc:          'Marco institucional con economia piloto, logica de secuencia y posicionamiento ejecutivo.',
  res3_tag:           'Presentacion institucional',
  res4_title:         'Revision ejecutiva de pre-cobranza',
  res4_desc:          'Logica del marco, escalamiento controlado y economia para secuenciacion pre-agencia.',
  res4_tag:           'Revision ejecutiva',
  open_pdf:           'Abrir PDF',

  engage_eyebrow:     'Resultados del primer compromiso',
  engage_title:       'Lo que una primera fase seria debe producir.',
  engage_intro:       'El posicionamiento premium significa que el comprador puede ver el producto de trabajo antes de la venta. Un primer compromiso debe crear documentos, decisiones y claridad de implementacion, no solo una conversacion.',
  engage_1_pill:      'Diagnostico',
  engage_1_h:         'Revision de flujo de trabajo y fugas',
  engage_1_p:         'Revision del estado actual de la transferencia, logica de envejecimiento, calidad de documentos y los puntos de control de mayor retorno.',
  engage_2_pill:      'Control',
  engage_2_h:         'Mapa de brechas de documentos y estandar de paquetes',
  engage_2_p:         'Lista prioritaria de registros faltantes, reglas de paquetes, limites de escalamiento y la estructura de archivo requerida para una transferencia posterior mas limpia.',
  engage_3_pill:      'Prueba',
  engage_3_h:         'Alcance piloto y plan de medicion',
  engage_3_p:         'Flujo de trabajo definido, ventana de respuesta, logica de KPI y un camino piloto que pueda producir evidencia sin promesas infladas.',

  cta_eyebrow:        'Siguiente paso',
  cta_title:          'Consultoria privada para operadores que necesitan control de efectivo, disciplina de documentacion y escalamiento mas limpio.',
  cta_intro:          'La consulta revisa la economia de recuperacion, la preparacion de archivos legales y el siguiente alcance mas defendible.',
  cta_primary:        'Solicitar consulta privada',
  cta_secondary:      'Revisar servicios curados',

  concierge_eyebrow:  'Linea de consulta privada',
  concierge_title:    'Para enrutamiento ejecutivo, revision delimitada y coordinacion confidencial.',
  concierge_intro:    'Use la admision para asuntos con documentos listos, o recurra a la consulta privada cuando el liderazgo necesite direccion antes de construir el paquete.',
  concierge_call:     'Llamar o enviar mensaje',
  concierge_phone:    '(888) 794-8292',
  concierge_note:     'Linea privada para coordinacion de consultas',
  concierge_cta1:     'Solicitar consulta privada',
  concierge_cta2:     'Abrir admision estructurada',

  footer_company:     'VitaCoreX LLC',
  footer_est:         'Establecida en 2025',
  footer_ein:         'EIN: 41-4399148',
  footer_phone:       'Telefono (llamada / texto):',
  footer_disc:        'VitaCoreX LLC proporciona servicios administrativos, de documentacion, de flujo de trabajo y de apoyo empresarial. No es un bufete de abogados y no proporciona representacion legal. La estrategia y el asesoramiento legal son responsabilidad del abogado autorizado.',
  footer_forms:       'Los formularios publicos estan disenados para documentos comerciales generales y materiales no regulados. Para registros altamente sensibles o regulados, solicite coordinacion segura primero.',
  footer_copy:        '\u00a9 2026 VitaCoreX LLC. Todos los derechos reservados.',
  footer_col1:        'Empresa y soluciones',
  footer_col2:        'Revision, privacidad y contacto',
  footer_nav_home:    'Inicio',
  footer_nav_solutions:'Soluciones',
  footer_nav_industries:'Industrias',
  footer_nav_about:   'Acerca de VitaCoreX',
  footer_nav_recovery:'Infraestructura de recuperacion de ingresos',
  footer_nav_file:    'Control de expediente legal corporativo',
  footer_nav_briefs:  'Informes ejecutivos y pruebas',
  footer_nav_intake:  'Admision estructurada de casos',
  footer_nav_contact: 'Consulta privada',
  footer_nav_careers: 'Carreras',
  footer_nav_privacy: 'Politica de privacidad',
  footer_nav_terms:   'Terminos de uso',
  footer_nav_cookie:  'Politica de cookies',

  exclusive_badge:    'Consultoria privada',

  brand_tag:          'Infraestructura de recuperacion de ingresos y control de documentacion',
  clock_vcx:          'Hora VitaCoreX',
  clock_local:        'Tu hora',
  clock_local_sub:    'Local',
  clock_sub_tampa:    'Tampa, Florida',
  cta_intake:         'Solicitar revision confidencial',
  cta_briefs:         'Revisar material ejecutivo',
  cta_workflow:       'Ver flujo de trabajo',
  cta_deliverables:   'Ver entregables',
}

};
/* ── end catalog ─────────────────────────────────────────────── */


/* ══════════════════════════════════════════════════════════════
   TRANSLATION ENGINE
   ══════════════════════════════════════════════════════════════ */

var STORAGE_KEY = 'vcx_lang';
var SUPPORTED = ['en', 'ru', 'es'];

/** Get the current language preference */
function getLang() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
  } catch(e) {}
  return 'en';
}

/** Save language preference */
function saveLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch(e) {}
}

/** Lookup a key in the catalog */
function t(key, lang) {
  var cat = w.VCX_TRANSLATIONS;
  if (cat && cat[lang] && cat[lang][key] !== undefined) return cat[lang][key];
  if (cat && cat.en  && cat.en[key]  !== undefined) return cat.en[key];
  return null;
}

/** Apply translations to every tagged element on the page */
function applyTranslations(lang) {
  var cat = w.VCX_TRANSLATIONS;
  if (!cat || !cat[lang]) return;

  /* 1. data-i18n — primary system */
  d.querySelectorAll('[data-i18n]').forEach(function(el) {
    var k = el.getAttribute('data-i18n');
    var v = t(k, lang);
    if (v !== null) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = v;
      } else {
        el.textContent = v;
      }
    }
  });

  /* 2. data-page — legacy system used on index.html */
  d.querySelectorAll('[data-page]').forEach(function(el) {
    var k = el.getAttribute('data-page');
    var v = t(k, lang);
    if (v !== null) el.textContent = v;
  });

  /* 3. data-tx — used on resource cards */
  d.querySelectorAll('[data-tx]').forEach(function(el) {
    var k = el.getAttribute('data-tx');
    var v = t(k, lang);
    if (v !== null) el.textContent = v;
  });

  /* 4. data-v52 — v52 authority section */
  d.querySelectorAll('[data-v52]').forEach(function(el) {
    var k = 'v52_' + el.getAttribute('data-v52');
    var v = t(k, lang);
    if (v !== null) el.textContent = v;
  });

  /* 5. data-common — shared strings from shell-i18n */
  d.querySelectorAll('[data-common]').forEach(function(el) {
    var k = el.getAttribute('data-common');
    var v = t(k, lang);
    if (v !== null) el.textContent = v;
  });

  /* 6. Update lang buttons active state */
  d.querySelectorAll('.lang-btn, [data-lang]').forEach(function(btn) {
    var bl = btn.getAttribute('data-lang');
    btn.classList.toggle('active', bl === lang);
    btn.setAttribute('aria-pressed', bl === lang ? 'true' : 'false');
  });

  /* 7. Update html lang attribute */
  d.documentElement.lang = lang;
  d.documentElement.setAttribute('lang', lang);

  /* 8. Dispatch event for other scripts */
  d.dispatchEvent(new CustomEvent('vcx:lang-change', { detail: { lang: lang } }));
}

/** Full language switch: save + apply */
function switchLang(lang) {
  if (SUPPORTED.indexOf(lang) === -1) lang = 'en';
  saveLang(lang);
  applyTranslations(lang);
}

/* ── Expose public API ───────────────────────────────────────── */
w.vcxSwitchLang = switchLang;
w.vcxGetLang = getLang;

/* ── Override the frozen vcx-i18n helpers so they respect actual lang ── */
w.vcxCurrentLang = getLang;
w.vcxSetLang = function(lang) {
  if (SUPPORTED.indexOf(lang) === -1) lang = 'en';
  switchLang(lang);
};

/* ── Init on DOMContentLoaded ────────────────────────────────── */
d.addEventListener('DOMContentLoaded', function() {

  /* Wire lang buttons */
  d.querySelectorAll('.lang-btn, [data-lang]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var lang = btn.getAttribute('data-lang');
      if (lang) switchLang(lang);
    });
  });

  /* Apply saved / default language */
  var current = getLang();
  applyTranslations(current);
});

})(window, document);
