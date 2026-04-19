/* scripts/build-samples.js — Generate /samples/<slug>.html from inline content.
 * Part of P03 Step 3.2. Anchored by ADR-008 Sample Deliverable Standards.
 *
 * Usage: node scripts/build-samples.js
 *
 * Produces 6 new HTML samples (sample #7 diagnostic-report is migrated by
 * a separate step — the migration preserves 664-line original content verbatim).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'samples');

/* ── Content definitions (all 6 new samples) ────────────────────────────── */
/* Each sample follows the ADR-008 template contract:                       */
/*   cover → metadata → TOC → section 1..6 → CTA → disclaimer               */
/* Each content object provides EN / RU / ES blocks.                        */

const SAMPLES = [
  /* ========================================================================
   * 1. AR Leakage Map (B2B, gated)
   * ====================================================================== */
  {
    slug: 'ar-leakage-map',
    audience: 'b2b',
    gating: 'gated',
    title: {
      en: 'AR Leakage Map — Sample Deliverable | VitaCoreX LLC',
      ru: 'AR Leakage Map — пример deliverable | VitaCoreX LLC',
      es: 'Mapa de fugas de AR — muestra de entregable | VitaCoreX LLC'
    },
    description: {
      en: 'Redacted sample of the AR Leakage Map deliverable: seven-domain diagnostic identifying where accounts receivable are leaking value across aging, documentation, escalation, and handoff.',
      ru: 'Отредактированный пример AR Leakage Map: диагностика по семи направлениям, где дебиторская задолженность теряет ценность — старение, документация, эскалация, передача в исполнение.',
      es: 'Muestra redactada del entregable AR Leakage Map: diagnostico por siete dominios donde las cuentas por cobrar pierden valor — antiguedad, documentacion, escalamiento, entrega.'
    },
    content: {
      en: {
        eyebrow: 'Sample deliverable · Redacted · B2B · Gated',
        h1: 'AR Leakage Map — the seven places value leaves the receivable.',
        lead: 'This redacted replica shows how VitaCoreX maps every stage where an accounts-receivable dollar loses probability of recovery. The live version is delivered under NDA. This sample shares structure, rubric, and tone; specific values are replaced with marked redactions.',
        side_t: 'Redaction standard',
        side_p: 'Client legal name, exact dollar amounts, site counts, personnel names, and dates within 90 days are replaced with [REDACTED]. Methodology, domain rubric, scoring logic, and recommendation framing are published verbatim.',
        meta_k1_l: 'Client', meta_k1_v: '[REDACTED]', meta_k1_n: 'Subscription SaaS, mid-market, US Southeast',
        meta_k2_l: 'Engagement type', meta_k2_v: '14-day scoped leakage map', meta_k2_n: 'Read-only access; no collection activity',
        meta_k3_l: 'Prepared by', meta_k3_v: 'VitaCoreX LLC', meta_k3_n: 'Lead: [REDACTED], Director',
        meta_k4_l: 'Distribution', meta_k4_v: 'CFO · Controller · Collections lead', meta_k4_n: 'No distribution outside list without written consent',
        toc_1: 'Executive summary',
        toc_2: 'Methodology',
        toc_3: 'Findings across seven domains',
        toc_4: 'Leakage band — low vs. recoverable',
        toc_5: '90-day remediation roadmap',
        toc_6: 'Out of scope',
        s1_e: 'Section 1', s1_h: 'Executive summary.',
        s1_p: 'Five observations tied to dollar magnitude the finance team can recognize. No recommendation in this section — recommendations live in Section 5 after findings are established.',
        s1_li1: 'Total AR under review is $[REDACTED]M across [REDACTED] customer segments; [REDACTED]% sits past 90 days.',
        s1_li2: 'Packet quality score averaged [REDACTED]/12 — the 9.0 threshold where counsel accepts a handoff without additional research is not being met.',
        s1_li3: 'Escalation thresholds drift between [REDACTED] and [REDACTED] days depending on who owns the account; similar balances are treated differently.',
        s1_li4: 'Dispute ledger has [REDACTED] open items; median age is [REDACTED] days, which silently extends the recovery window on every balance they touch.',
        s1_li5: 'Write-off trend is up [REDACTED]% YoY — underlying driver is documentation timing, not customer creditworthiness.',
        s2_e: 'Section 2', s2_h: 'Methodology.',
        s2_p: 'Fourteen days broken into three phases: data intake (days 1–5), domain scoring (days 6–10), synthesis and readout (days 11–14). Read-only access only; no system writes, no customer contact.',
        s2_li1: 'AR aging pulls reconciled to operator close — weekly snapshots across trailing 180 days.',
        s2_li2: 'Statistically sampled packet audit — [REDACTED] balances drawn across aging buckets, segments, and amounts; each scored against a 12-item rubric.',
        s2_li3: 'Escalation practice interview — one per owning-role (CSM, billing lead, collections lead) focused on observed behavior rather than policy on paper.',
        s2_li4: 'Dispute ledger audit — median age, resolution rate, root-cause mix across the ledger.',
        s2_li5: 'Counsel-readiness check — if this balance walked to counsel today, which fields would counsel demand we fill in before acting?',
        s3_e: 'Section 3', s3_h: 'Findings across seven domains.',
        s3_p: 'Each finding follows: Observation → Impact → Root cause → Recommendation. Same template the live deliverable uses.',
        s3_f1_t: 'Finding 3.1 — Aging visibility',
        s3_f1_b: 'Observation: aging is visible per-segment but not reconciled to write-off trend. Impact: finance cannot distinguish collection delay from bad-debt acceptance. Root cause: report pipeline stops at 90-day bucket. Recommendation: extend aging view through 365 days with trailing write-off overlay.',
        s3_f2_t: 'Finding 3.2 — Packet quality',
        s3_f2_b: 'Observation: [REDACTED]% of 90+-day balances lack a single source-of-truth invoice matched to an executed contract line. Impact: every customer challenge requires a research cycle averaging [REDACTED] days. Root cause: packet is generated at billing, not re-generated at escalation. Recommendation: regenerate fresh packet at each escalation threshold.',
        s3_f3_t: 'Finding 3.3 — Escalation discipline',
        s3_f3_b: 'Observation: thresholds drift [REDACTED]–[REDACTED] days by owner. Impact: identical-profile balances experience materially different timelines — fairness and compliance exposure. Root cause: no network-wide written policy; thresholds inherited informally. Recommendation: 45 / 75 / 120 unified thresholds with documented overrides.',
        s3_f4_t: 'Finding 3.4 — Dispute ledger hygiene',
        s3_f4_b: 'Observation: [REDACTED] open disputes, median age [REDACTED] days. Impact: silently extends recovery window on every touched balance. Root cause: no SLA for dispute close; no owner by default. Recommendation: 10-day SLA with named owner; weekly stand-up on the over-SLA tail.',
        s3_f5_t: 'Finding 3.5 — Counsel-handoff readiness',
        s3_f5_b: 'Observation: readiness averages [REDACTED]% against the 90% counsel requires. Impact: counsel delays or bills additional research hours — both slow recovery and erode margin. Root cause: no single handoff template. Recommendation: codify handoff template; measure readiness as standing KPI.',
        s4_e: 'Section 4', s4_h: 'Leakage band — low vs. recoverable.',
        s4_p: 'Range-framed, not single-point. Low end assumes partial adoption; high end assumes full workflow adoption with packet refresh discipline.',
        s4_k1_l: 'Low-band 6-month recovery', s4_k1_v: '$[REDACTED]M', s4_k1_n: 'Partial adoption, refresh every 60 days',
        s4_k2_l: 'High-band 6-month recovery', s4_k2_v: '$[REDACTED]M', s4_k2_n: 'Full adoption, weekly refresh, unified thresholds held',
        s4_k3_l: 'DSO compression estimate', s4_k3_v: '[REDACTED] days', s4_k3_n: 'Weighted-average at the 6-month mark',
        s4_k4_l: 'Write-off trajectory', s4_k4_v: 'Declining', s4_k4_n: 'Direction, not magnitude — engagement-close measurement',
        s4_note_t: 'Assumptions underlying the band',
        s4_note_b: 'No payer renegotiation. No new collection vendor. No outside counsel engaged unless a balance crosses the 120-day threshold. Every assumption failure narrows the band toward the low end.',
        s5_e: 'Section 5', s5_h: '90-day remediation roadmap.',
        s5_p: 'The sequencing the diagnostic recommends. Not a quote — scope and price are negotiated separately. Published so the operator can evaluate fit before discussing commercial terms.',
        s5_m1_l: 'Days 1–30', s5_m1_t: 'Unified aging view, packet template, pilot segment',
        s5_m1_b: 'Extend aging report through 365 days with write-off overlay. Publish the packet template. Select [REDACTED] pilot segments by volume and aging profile. No network-wide rollout in this window — containment until the pilot validates.',
        s5_m2_l: 'Days 31–60', s5_m2_t: 'Dispute SLA, threshold policy, refresh cadence',
        s5_m2_b: 'Deploy 10-day dispute SLA. Publish unified threshold policy with override rubric. Launch weekly packet refresh cadence on the over-60-day tail.',
        s5_m3_l: 'Days 61–90', s5_m3_t: 'Counsel-handoff template, operator handback',
        s5_m3_b: 'Publish counsel-handoff template with readiness KPI. Begin handback of monitoring cadence to the operator team with VitaCoreX in observer role through engagement close.',
        s6_e: 'Section 6', s6_h: 'Out of scope.',
        s6_p: 'Scope is deliberately narrow. Items below are either operator-side, counsel-side, or a separate commercial engagement.',
        s6_li1: 'No legal representation or legal advice. Items that become legal matters remain with the operator counsel.',
        s6_li2: 'No debt-collection activity. No balance is contacted, assigned, or referred by VitaCoreX during the engagement.',
        s6_li3: 'No customer contact of any kind. All customer-facing execution remains the operator\u2019s role.',
        s6_li4: 'No contract renegotiation. Contracts read for ambiguity only; renegotiation is a separate engagement.',
        s6_li5: 'No PHI, PCI, or regulated-data handling on VitaCoreX-owned infrastructure — all workflow runs inside the operator environment.',
        s6_li6: 'No warranty of specific recovery outcome. Section 4 band is a modeled range, not a guarantee.',
        cta_h: 'Want the un-redacted version under NDA?',
        cta_p: 'The un-redacted AR Leakage Map is gated. Qualified procurement teams requesting the live version will receive it under mutual NDA after brief qualification (company + role + work email + AR portfolio band).',
        cta_primary: 'Request the un-redacted version',
        cta_secondary: 'Review security & procurement',
        disclaimer: 'VitaCoreX LLC is not a law firm and does not provide legal representation. This sample is a redacted replica of a deliverable produced under a prior engagement. It is not an offer of service, not legal advice, not a recommendation about any specific matter, and not a warranty of any particular outcome. Any engagement is governed by a separate written Statement of Work. Legal strategy remains the responsibility of licensed counsel.'
      },
      ru: {
        eyebrow: 'Пример deliverable · отредактирован · B2B · с формой доступа',
        h1: 'AR Leakage Map — семь мест, где выручка уходит из дебиторской задолженности.',
        lead: 'Это отредактированная копия: показана структура, рубрика и тон деливерабла VitaCoreX, в котором картируется каждая стадия, где дебиторский доллар теряет вероятность возврата. Живая версия выдаётся под NDA; конкретные значения заменены маркированными [REDACTED].',
        side_t: 'Стандарт редакции',
        side_p: 'Юридическое имя клиента, точные суммы, количество площадок, персональные имена и даты в пределах 90 дней заменены на [REDACTED]. Методология, рубрика по доменам, логика скоринга и формулировки рекомендаций — дословно.',
        meta_k1_l: 'Клиент', meta_k1_v: '[REDACTED]', meta_k1_n: 'SaaS-подписка, средний сегмент, юго-восток США',
        meta_k2_l: 'Тип engagement', meta_k2_v: '14-дневная карта утечек', meta_k2_n: 'Только read-only доступ; никаких collection-действий',
        meta_k3_l: 'Подготовлено', meta_k3_v: 'VitaCoreX LLC', meta_k3_n: 'Руководитель: [REDACTED], директор',
        meta_k4_l: 'Рассылка', meta_k4_v: 'CFO · контроллер · руководитель сборов', meta_k4_n: 'Распространение вне списка только с письменного согласия',
        toc_1: 'Краткое резюме',
        toc_2: 'Методология',
        toc_3: 'Находки по семи доменам',
        toc_4: 'Диапазон утечки — низкий и восстановимый',
        toc_5: 'Дорожная карта на 90 дней',
        toc_6: 'Вне scope',
        s1_e: 'Раздел 1', s1_h: 'Краткое резюме.',
        s1_p: 'Пять наблюдений, каждое привязано к долларовой величине, понятной финансовой команде. В этом разделе нет рекомендаций — они в разделе 5, после того как находки установлены.',
        s1_li1: 'Общий AR под проверкой — $[REDACTED]M по [REDACTED] клиентским сегментам; [REDACTED]% — за 90+ дней.',
        s1_li2: 'Средний балл качества пакета — [REDACTED]/12. Порог 9.0, с которого советник принимает передачу без дополнительного исследования, не достигнут.',
        s1_li3: 'Пороги эскалации дрейфуют между [REDACTED] и [REDACTED] дней в зависимости от владельца аккаунта.',
        s1_li4: 'Реестр споров — [REDACTED] открытых позиций; медианный возраст [REDACTED] дней — это тихо удлиняет окно возврата.',
        s1_li5: 'Тренд списаний +[REDACTED]% год к году — корневая причина сроки документирования, а не кредитоспособность клиента.',
        s2_e: 'Раздел 2', s2_h: 'Методология.',
        s2_p: '14 дней в трёх фазах: сбор данных (дни 1–5), скоринг доменов (дни 6–10), синтез и ридаут (дни 11–14). Доступ только на чтение.',
        s2_li1: 'Выгрузки AR aging, согласованные с закрытием операциониста — недельные снимки за 180 дней.',
        s2_li2: 'Статистически выбранный аудит пакетов — [REDACTED] позиций по aging-корзинам, сегментам, суммам; каждая по 12-пунктовой рубрике.',
        s2_li3: 'Интервью по практике эскалации — по одному с каждой owning-ролью (CSM, billing lead, collections lead).',
        s2_li4: 'Аудит реестра споров — медианный возраст, rate закрытия, root-cause mix.',
        s2_li5: 'Проверка counsel-готовности — какие поля counsel потребовал бы заполнить перед действием.',
        s3_e: 'Раздел 3', s3_h: 'Находки по семи доменам.',
        s3_p: 'Каждая находка: Наблюдение → Влияние → Корневая причина → Рекомендация.',
        s3_f1_t: 'Находка 3.1 — видимость aging',
        s3_f1_b: 'Наблюдение: aging виден по сегментам, но не согласован с трендом списаний. Влияние: финансы не различают задержку сборов и принятие bad-debt. Корневая причина: пайплайн отчёта останавливается на корзине 90 дней. Рекомендация: aging до 365 дней с overlay списаний.',
        s3_f2_t: 'Находка 3.2 — качество пакета',
        s3_f2_b: 'Наблюдение: [REDACTED]% балансов 90+ дней не имеют single-source-of-truth инвойса, сопоставленного с исполненной контрактной линией. Влияние: каждый клиентский вызов требует цикла исследования медиа [REDACTED] дней. Корневая причина: пакет генерируется при биллинге, не перегенерируется при эскалации. Рекомендация: свежий пакет при каждом пороге эскалации.',
        s3_f3_t: 'Находка 3.3 — дисциплина эскалации',
        s3_f3_b: 'Наблюдение: пороги дрейфуют [REDACTED]–[REDACTED] дней по владельцу. Влияние: идентичные балансы имеют материально разные таймлайны — риск справедливости и compliance. Корневая причина: нет письменной политики. Рекомендация: единые пороги 45 / 75 / 120 с документированными override.',
        s3_f4_t: 'Находка 3.4 — гигиена реестра споров',
        s3_f4_b: 'Наблюдение: [REDACTED] открытых споров, медиана [REDACTED] дней. Влияние: тихо удлиняет окно возврата. Корневая причина: нет SLA закрытия спора и дефолтного владельца. Рекомендация: SLA 10 дней с именным владельцем и еженедельным stand-up по over-SLA tail.',
        s3_f5_t: 'Находка 3.5 — counsel-готовность',
        s3_f5_b: 'Наблюдение: готовность в среднем [REDACTED]% против 90%, требуемых counsel. Влияние: counsel либо задерживает действие, либо бьёт дополнительные часы исследования. Корневая причина: нет единого шаблона handoff. Рекомендация: кодифицировать шаблон; измерять readiness как постоянный KPI.',
        s4_e: 'Раздел 4', s4_h: 'Диапазон утечки — низ и восстановимый.',
        s4_p: 'Диапазон, а не одна точка. Нижний край — частичное принятие; верхний — полное принятие с дисциплиной обновления пакета.',
        s4_k1_l: 'Низкий диапазон 6 мес.', s4_k1_v: '$[REDACTED]M', s4_k1_n: 'Частичное принятие, refresh каждые 60 дней',
        s4_k2_l: 'Высокий диапазон 6 мес.', s4_k2_v: '$[REDACTED]M', s4_k2_n: 'Полное принятие, еженедельный refresh, пороги удерживаются',
        s4_k3_l: 'Оценка сжатия DSO', s4_k3_v: '[REDACTED] дней', s4_k3_n: 'Средневзвешенное на 6-месячной отметке',
        s4_k4_l: 'Траектория списаний', s4_k4_v: 'Снижение', s4_k4_n: 'Направление, не величина — измерение при закрытии engagement',
        s4_note_t: 'Допущения, лежащие в основе диапазона',
        s4_note_b: 'Нет переговоров с плательщиками. Нет нового collection-вендора. Нет привлечения counsel, если баланс не пересёк 120-дневный порог. Провал любого допущения сдвигает диапазон к низу.',
        s5_e: 'Раздел 5', s5_h: 'Дорожная карта на 90 дней.',
        s5_p: 'Рекомендуемая диагностикой последовательность. Это не коммерческое предложение — scope и цена обсуждаются отдельно.',
        s5_m1_l: 'Дни 1–30', s5_m1_t: 'Единый aging, шаблон пакета, пилотный сегмент',
        s5_m1_b: 'Расширить aging до 365 дней с overlay списаний. Опубликовать шаблон пакета. Выбрать [REDACTED] пилотных сегментов по объёму и aging-профилю. Без сетевого роллаута в этом окне.',
        s5_m2_l: 'Дни 31–60', s5_m2_t: 'SLA споров, политика порогов, каденс refresh',
        s5_m2_b: 'Развернуть SLA споров 10 дней. Опубликовать единую политику порогов с override. Запустить еженедельный refresh пакетов на over-60 дней tail.',
        s5_m3_l: 'Дни 61–90', s5_m3_t: 'Шаблон handoff counsel, передача оператору',
        s5_m3_b: 'Опубликовать шаблон handoff с KPI readiness. Начать передачу каденса мониторинга команде оператора; VitaCoreX в роли наблюдателя до закрытия.',
        s6_e: 'Раздел 6', s6_h: 'Вне scope.',
        s6_p: 'Scope умышленно узок. Всё, что перечислено, либо на стороне оператора, либо на стороне counsel, либо отдельный engagement.',
        s6_li1: 'Никакого юридического представительства или юридических советов. Любые юридические вопросы остаются за counsel оператора.',
        s6_li2: 'Никакой collection-деятельности. Ни один баланс не контактируется, не передаётся и не направляется VitaCoreX во время engagement.',
        s6_li3: 'Никакого клиентского контакта любого рода. Все клиент-фейсинг-действия остаются за оператором.',
        s6_li4: 'Никакого пересмотра контрактов. Контракты читаются только на неоднозначность.',
        s6_li5: 'Никакой обработки PHI, PCI или регулируемых данных на инфраструктуре VitaCoreX — все workflow внутри среды оператора.',
        s6_li6: 'Никакой гарантии конкретного результата возврата. Диапазон в разделе 4 — модель, не гарантия.',
        cta_h: 'Нужна неотредактированная версия под NDA?',
        cta_p: 'Неотредактированный AR Leakage Map gated. Квалифицированные команды procurement получат живую версию под взаимным NDA после короткой квалификации (компания + роль + рабочая почта + сегмент AR портфеля).',
        cta_primary: 'Запросить неотредактированную версию',
        cta_secondary: 'Security & procurement',
        disclaimer: 'VitaCoreX LLC не является юридической фирмой и не оказывает юридическое представительство. Этот пример — отредактированная копия деливерабла, созданного в рамках прошлого engagement. Это не оферта, не юридический совет, не рекомендация по конкретному делу и не гарантия результата. Любой engagement регулируется отдельным письменным Statement of Work. Юридическая стратегия остаётся ответственностью лицензированного советника.'
      },
      es: {
        eyebrow: 'Muestra redactada · B2B · con formulario',
        h1: 'AR Leakage Map — los siete puntos donde las cuentas por cobrar pierden valor.',
        lead: 'Esta replica redactada muestra como VitaCoreX mapea cada etapa donde un dolar de AR pierde probabilidad de recuperacion. La version no redactada se entrega bajo NDA; los valores especificos estan reemplazados por [REDACTED].',
        side_t: 'Estandar de redaccion',
        side_p: 'Nombre legal del cliente, montos exactos, conteos de sitios, nombres de personal y fechas dentro de 90 dias se reemplazan con [REDACTED]. Metodologia, rubrica por dominio, logica de puntuacion y formulacion de recomendaciones se publican verbatim.',
        meta_k1_l: 'Cliente', meta_k1_v: '[REDACTED]', meta_k1_n: 'SaaS por suscripcion, mid-market, sureste EE.UU.',
        meta_k2_l: 'Tipo de engagement', meta_k2_v: 'Mapa de fugas 14 dias', meta_k2_n: 'Acceso solo-lectura; sin actividad de cobranza',
        meta_k3_l: 'Preparado por', meta_k3_v: 'VitaCoreX LLC', meta_k3_n: 'Lider: [REDACTED], Director',
        meta_k4_l: 'Distribucion', meta_k4_v: 'CFO · Controller · Lider de cobranza', meta_k4_n: 'Sin distribucion fuera de la lista sin consentimiento escrito',
        toc_1: 'Resumen ejecutivo',
        toc_2: 'Metodologia',
        toc_3: 'Hallazgos en siete dominios',
        toc_4: 'Banda de fuga — baja y recuperable',
        toc_5: 'Hoja de ruta 90 dias',
        toc_6: 'Fuera de alcance',
        s1_e: 'Seccion 1', s1_h: 'Resumen ejecutivo.',
        s1_p: 'Cinco observaciones atadas a magnitud en dolares que el equipo financiero reconoce. Sin recomendaciones en esta seccion — las recomendaciones estan en la seccion 5.',
        s1_li1: 'AR total bajo revision: $[REDACTED]M en [REDACTED] segmentos de cliente; [REDACTED]% mas alla de 90 dias.',
        s1_li2: 'Puntaje medio de calidad de paquete: [REDACTED]/12. No se cumple el umbral de 9.0 donde el asesor acepta la entrega sin investigacion adicional.',
        s1_li3: 'Umbrales de escalamiento derivan entre [REDACTED] y [REDACTED] dias segun propietario de cuenta.',
        s1_li4: 'Registro de disputas: [REDACTED] items abiertos; edad mediana [REDACTED] dias — extiende silenciosamente la ventana de recuperacion.',
        s1_li5: 'Tendencia de write-off +[REDACTED]% interanual — la causa raiz son los tiempos de documentacion, no la solvencia del cliente.',
        s2_e: 'Seccion 2', s2_h: 'Metodologia.',
        s2_p: '14 dias en tres fases: ingesta (dias 1–5), puntuacion por dominio (dias 6–10), sintesis y readout (dias 11–14). Acceso solo-lectura.',
        s2_li1: 'Extracciones de aging reconciliadas al cierre del operador — snapshots semanales en 180 dias.',
        s2_li2: 'Auditoria estadisticamente muestreada de paquetes — [REDACTED] items en buckets, segmentos, montos; rubrica de 12 puntos.',
        s2_li3: 'Entrevistas de practica de escalamiento — una por rol propietario (CSM, billing lead, collections lead).',
        s2_li4: 'Auditoria de registro de disputas — edad mediana, tasa de resolucion, mezcla de causa raiz.',
        s2_li5: 'Chequeo de counsel-readiness — que campos exigiria el asesor si el balance fuera hoy.',
        s3_e: 'Seccion 3', s3_h: 'Hallazgos en siete dominios.',
        s3_p: 'Cada hallazgo: Observacion → Impacto → Causa raiz → Recomendacion.',
        s3_f1_t: 'Hallazgo 3.1 — visibilidad de aging',
        s3_f1_b: 'Observacion: aging visible por segmento pero no reconciliado con tendencia de write-off. Impacto: finanzas no distingue demora de cobro de aceptacion de incobrables. Causa raiz: el pipeline del reporte termina en el bucket 90 dias. Recomendacion: extender aging a 365 dias con overlay de write-off.',
        s3_f2_t: 'Hallazgo 3.2 — calidad de paquete',
        s3_f2_b: 'Observacion: [REDACTED]% de balances 90+ dias no tienen factura unica de verdad atada a una linea contractual ejecutada. Impacto: cada objecion del cliente requiere ciclo de investigacion promedio [REDACTED] dias. Causa raiz: paquete generado al facturar, no regenerado al escalar. Recomendacion: regenerar paquete fresco en cada umbral de escalamiento.',
        s3_f3_t: 'Hallazgo 3.3 — disciplina de escalamiento',
        s3_f3_b: 'Observacion: umbrales derivan [REDACTED]–[REDACTED] dias por propietario. Impacto: balances identicos experimentan cronogramas materialmente distintos — exposicion de equidad y compliance. Causa raiz: sin politica escrita. Recomendacion: umbrales unificados 45 / 75 / 120 con overrides documentados.',
        s3_f4_t: 'Hallazgo 3.4 — higiene de registro de disputas',
        s3_f4_b: 'Observacion: [REDACTED] disputas abiertas, mediana [REDACTED] dias. Impacto: extiende silenciosamente la ventana de recuperacion. Causa raiz: sin SLA de cierre ni propietario por defecto. Recomendacion: SLA 10 dias con propietario nominal; stand-up semanal sobre over-SLA tail.',
        s3_f5_t: 'Hallazgo 3.5 — counsel-readiness',
        s3_f5_b: 'Observacion: readiness promedio [REDACTED]% contra 90% que exige el asesor. Impacto: el asesor demora o cobra horas adicionales de investigacion — ambos reducen margen. Causa raiz: sin plantilla unica de handoff. Recomendacion: codificar plantilla; medir readiness como KPI permanente.',
        s4_e: 'Seccion 4', s4_h: 'Banda de fuga — baja vs. recuperable.',
        s4_p: 'Rango, no punto unico. Extremo bajo asume adopcion parcial; extremo alto asume adopcion total con disciplina de refresh.',
        s4_k1_l: 'Banda baja 6 meses', s4_k1_v: '$[REDACTED]M', s4_k1_n: 'Adopcion parcial, refresh cada 60 dias',
        s4_k2_l: 'Banda alta 6 meses', s4_k2_v: '$[REDACTED]M', s4_k2_n: 'Adopcion total, refresh semanal, umbrales sostenidos',
        s4_k3_l: 'Compresion de DSO estimada', s4_k3_v: '[REDACTED] dias', s4_k3_n: 'Media ponderada a 6 meses',
        s4_k4_l: 'Trayectoria de write-off', s4_k4_v: 'Descendente', s4_k4_n: 'Direccion, no magnitud — medicion al cierre',
        s4_note_t: 'Supuestos detras de la banda',
        s4_note_b: 'Sin renegociacion con pagadores. Sin nuevo vendor de cobranza. Sin asesor externo a menos que un balance cruce los 120 dias. Cada fallo de supuesto estrecha la banda hacia el extremo bajo.',
        s5_e: 'Seccion 5', s5_h: 'Hoja de ruta 90 dias.',
        s5_p: 'Secuencia recomendada. No es una cotizacion — alcance y precio se negocian por separado.',
        s5_m1_l: 'Dias 1–30', s5_m1_t: 'Aging unificado, plantilla de paquete, segmento piloto',
        s5_m1_b: 'Extender aging a 365 dias con overlay de write-off. Publicar plantilla de paquete. Seleccionar [REDACTED] segmentos piloto por volumen y perfil de aging.',
        s5_m2_l: 'Dias 31–60', s5_m2_t: 'SLA de disputa, politica de umbrales, cadencia de refresh',
        s5_m2_b: 'Desplegar SLA de disputa 10 dias. Publicar politica unificada de umbrales con rubrica de override. Lanzar cadencia semanal de refresh de paquete en tail over-60.',
        s5_m3_l: 'Dias 61–90', s5_m3_t: 'Plantilla counsel-handoff, traspaso al operador',
        s5_m3_b: 'Publicar plantilla de handoff con KPI de readiness. Iniciar traspaso de cadencia de monitoreo al equipo del operador con VitaCoreX en rol observador.',
        s6_e: 'Seccion 6', s6_h: 'Fuera de alcance.',
        s6_p: 'Alcance deliberadamente estrecho. Los items listados estan en lado operador, lado counsel, o son engagement separado.',
        s6_li1: 'Sin representacion legal ni asesoria juridica. Cualquier asunto legal permanece con el counsel del operador.',
        s6_li2: 'Sin actividad de cobranza. Ningun balance se contacta, asigna o refiere por VitaCoreX durante el engagement.',
        s6_li3: 'Sin contacto con cliente de ningun tipo. Toda ejecucion cara a cliente queda en el operador.',
        s6_li4: 'Sin renegociacion de contratos. Los contratos se leen solo para ambiguedad.',
        s6_li5: 'Sin manejo de PHI, PCI o datos regulados sobre infraestructura VitaCoreX — todo el workflow corre dentro del entorno del operador.',
        s6_li6: 'Sin garantia de resultado especifico de recuperacion. La banda de la seccion 4 es un rango modelado, no una garantia.',
        cta_h: 'Quiere la version no-redactada bajo NDA?',
        cta_p: 'La version no-redactada es gated. Equipos de procurement calificados reciben la copia bajo NDA mutuo tras calificacion corta (empresa + rol + email corporativo + banda de portafolio AR).',
        cta_primary: 'Solicitar la version no-redactada',
        cta_secondary: 'Seguridad y procurement',
        disclaimer: 'VitaCoreX LLC no es un bufete juridico y no presta representacion legal. Esta muestra es replica redactada de un entregable producido bajo engagement previo. No es oferta de servicio, no es asesoria juridica, no es recomendacion sobre ningun asunto especifico y no es garantia de resultado. Cualquier engagement se rige por un Statement of Work escrito separado. La estrategia legal sigue siendo responsabilidad del counsel licenciado.'
      }
    }
  },

  /* ========================================================================
   * 2. Counsel-Ready Packet Index (B2B, gated)
   * ====================================================================== */
  {
    slug: 'counsel-ready-packet',
    audience: 'b2b',
    gating: 'gated',
    title: {
      en: 'Counsel-Ready Packet Index — Sample Deliverable | VitaCoreX LLC',
      ru: 'Counsel-Ready Packet Index — пример deliverable | VitaCoreX LLC',
      es: 'Counsel-Ready Packet Index — muestra de entregable | VitaCoreX LLC'
    },
    description: {
      en: 'Redacted sample of the packet index VitaCoreX produces before a balance moves to counsel — 12-item rubric, scoring, readiness gates.',
      ru: 'Отредактированный пример индекса пакета VitaCoreX до передачи баланса советнику — 12-пунктовая рубрика, скоринг, гейты готовности.',
      es: 'Muestra redactada del indice de paquete que VitaCoreX produce antes de enviar un balance a asesor — rubrica de 12 items, puntaje, compuertas de readiness.'
    },
    content: _packet_ru_es_en()
  },

  /* ========================================================================
   * 3. Contract Risk Flag Memo (B2C, ungated)
   * ====================================================================== */
  {
    slug: 'contract-risk-memo',
    audience: 'b2c',
    gating: 'ungated',
    title: {
      en: 'Contract Risk Flag Memo — Sample Deliverable | VitaCoreX LLC',
      ru: 'Contract Risk Flag Memo — пример deliverable | VitaCoreX LLC',
      es: 'Contract Risk Flag Memo — muestra de entregable | VitaCoreX LLC'
    },
    description: {
      en: 'Redacted sample of the $149 contract review deliverable: 10-point risk rubric applied to a retail services agreement with marked redactions.',
      ru: 'Отредактированный пример деливерабла contract review за $149: 10-пунктовая рубрика рисков, применённая к retail-service соглашению.',
      es: 'Muestra redactada del entregable de revision de contrato $149: rubrica de riesgo de 10 puntos aplicada a un acuerdo de servicios.'
    },
    content: _contract_memo()
  },

  /* ========================================================================
   * 4. Small Claims Chronology (shared B2C+B2B, ungated)
   * ====================================================================== */
  {
    slug: 'small-claims-chronology',
    audience: 'shared',
    gating: 'ungated',
    title: {
      en: 'Small Claims Chronology — Sample Deliverable | VitaCoreX LLC',
      ru: 'Small Claims Chronology — пример deliverable | VitaCoreX LLC',
      es: 'Small Claims Chronology — muestra de entregable | VitaCoreX LLC'
    },
    description: {
      en: 'Redacted sample chronology: date-by-date timeline of a Florida small-claims matter with attached document inventory and evidence-index pointers.',
      ru: 'Отредактированный пример хронологии: детальный таймлайн дела по Florida small claims с инвентаризацией документов и indexом доказательств.',
      es: 'Muestra redactada de cronologia: linea de tiempo dia-a-dia de un caso de small claims en Florida con inventario documental e indice de evidencia.'
    },
    content: _small_claims()
  },

  /* ========================================================================
   * 5. Immigration Evidence Index (B2C, ungated)
   * ====================================================================== */
  {
    slug: 'immigration-evidence-index',
    audience: 'b2c',
    gating: 'ungated',
    title: {
      en: 'Immigration Evidence Index — Sample Deliverable | VitaCoreX LLC',
      ru: 'Immigration Evidence Index — пример deliverable | VitaCoreX LLC',
      es: 'Immigration Evidence Index — muestra de entregable | VitaCoreX LLC'
    },
    description: {
      en: 'Redacted sample of the immigration packet evidence index: exhibit list, page map, categorization against the form\u2019s required-evidence schedule.',
      ru: 'Отредактированный пример индекса доказательств иммиграционного пакета: список приложений, карта страниц, категоризация по required-evidence schedule.',
      es: 'Muestra redactada del indice de evidencia del paquete de inmigracion: lista de exhibits, mapa de paginas, categorizacion contra el schedule de evidencia requerida.'
    },
    content: _immigration_index()
  },

  /* ========================================================================
   * 6. Auto Deal Cost Breakdown (B2C, ungated)
   * ====================================================================== */
  {
    slug: 'auto-deal-cost-breakdown',
    audience: 'b2c',
    gating: 'ungated',
    title: {
      en: 'Auto Deal Cost Breakdown — Sample Deliverable | VitaCoreX LLC',
      ru: 'Auto Deal Cost Breakdown — пример deliverable | VitaCoreX LLC',
      es: 'Auto Deal Cost Breakdown — muestra de entregable | VitaCoreX LLC'
    },
    description: {
      en: 'Redacted sample of the $149 auto deal review deliverable: line-by-line cost breakdown with flagged add-ons and negotiation pointers.',
      ru: 'Отредактированный пример деливерабла auto deal review за $149: построчная разбивка расходов с флагами add-on и пойнтерами для переговоров.',
      es: 'Muestra redactada del entregable de revision de auto deal $149: desglose linea por linea con add-ons marcados y puntos de negociacion.'
    },
    content: _auto_deal()
  },
  /* ========================================================================
   * 7. Diagnostic Report (B2B, ungated) — replica of /sample-deliverable.html
   *    Template-aligned port of the existing 30-day diagnostic page.
   *    Original URL stays as library hub (P03 Step 3.3). This sample is the
   *    individual-page embodiment living under /samples/.
   * ====================================================================== */
  {
    slug: 'diagnostic-report',
    audience: 'b2b',
    gating: 'ungated',
    title: {
      en: '30-Day Diagnostic Report — Sample Deliverable | VitaCoreX LLC',
      ru: '30-дневный диагностический отчет — пример deliverable | VitaCoreX LLC',
      es: 'Informe diagnostico de 30 dias — muestra de entregable | VitaCoreX LLC'
    },
    description: {
      en: 'Redacted replica of the 30-day diagnostic VitaCoreX produces at engagement start: executive summary, methodology, findings by domain, recovery band, 90-day roadmap, and out-of-scope boundary.',
      ru: 'Отредактированная копия 30-дневной диагностики VitaCoreX на старте engagement: executive summary, методология, находки по доменам, recovery band, 90-дневная дорожная карта и out-of-scope.',
      es: 'Replica redactada del diagnostico de 30 dias que VitaCoreX produce al inicio: resumen ejecutivo, metodologia, hallazgos por dominio, banda de recuperacion, hoja de ruta 90 dias y fuera de alcance.'
    },
    content: _diagnostic_report()
  }
];

/* ── Compact content helpers for the remaining 5 samples.                  */
/* These return {en, ru, es} content blocks that follow the same schema.   */
/* Content is compressed per ADR-008 Step 3.2 execution note — structure   */
/* complete, representative-not-exhaustive body.                           */

/* Diagnostic Report — template-aligned port of /sample-deliverable.html.
 * The existing hub page stays at its original URL (library-hub role,
 * Step 3.3). This helper rebuilds the same content under the canonical
 * sample template so the individual-page form lives at
 * /samples/diagnostic-report.html with watermark + banner + print CSS. */
function _diagnostic_report() {
  return _tri_content({
    en: {
      eyebrow: 'Sample deliverable · Redacted · B2B · Healthcare network',
      h1: '30-day diagnostic, as it arrives on the executive desk.',
      lead: 'Redacted replica of the 30-day diagnostic VitaCoreX produces at engagement start. Client identity, exact figures, and personnel are replaced with marked redactions; structure, methodology, and tone are unchanged.',
      engagement: '30-day diagnostic',
      client_note: 'Multi-site healthcare network, US Southeast',
      distribution: 'CFO · COO · Audit cmte',
      side_t: 'Redaction standard',
      side_p: 'Every item marked [REDACTED] was a specific value in the live deliverable — client name, clinic site names, exact balance figures, staff, and near-dates. Section headings, methodology, diagnostic logic, and recommendation framing are published verbatim.',
      toc: ['Executive summary', 'Methodology', 'Findings by domain', 'Recovery opportunity band', '90-day prioritized roadmap', 'Out of scope'],
      sec1_title: 'Executive summary.',
      sec1_lead: 'Written for the CFO and COO audience — five observations, each tied to dollar magnitude. Recommendations sit in Section 5 after findings are established.',
      sec1_bullets: [
        'Recoverable AR across the network totals $[REDACTED]M — concentrated in balances aged 60–180 days with mixed packet quality.',
        '[REDACTED]% of balances over 90 days lack documentation required to respond to a patient or payer challenge without additional research.',
        'Escalation thresholds vary across [REDACTED] sites — some escalate at 60 days, others past 120 — producing unequal treatment and DSO drift.',
        'Patient-facing payment paths are inconsistent: [REDACTED] sites offer a modern portal, [REDACTED] sites rely on paper statements only.',
        'Bad-debt write-offs trended up [REDACTED]% YoY in trailing 12 months — driver is documentation timing, not patient creditworthiness.'
      ],
      sec2_title: 'Methodology.',
      sec2_lead: 'Three phases: data collection (days 1–10), sampling and audit (days 11–22), synthesis and executive review (days 23–30). Read-only access; no system writes, no patient contact.',
      sec2_bullets: [
        'Aging report pulls per site — weekly snapshots across trailing 90 days, reconciled to the operator close.',
        'Statistically sampled packet audit — 120 balances across sites, aging buckets, service types; each scored against a 12-item rubric.',
        'Escalation-threshold audit — one interview per site with the billing manager, focused on observed practice rather than written policy.',
        'Patient-path walkthrough — shadow exercise from statement receipt to portal login, on each site\u2019s production configuration.',
        'Contract and payer-mix review — read for ambiguity only; no renegotiation within diagnostic scope.'
      ],
      sec3_title: 'Findings by domain.',
      sec3_lead: 'Each finding follows Observation → Impact → Root cause → Recommendation. Same template the live deliverable uses so every finding can be evaluated independently.',
      findings: [
        { t: 'Finding 3.1 — Documentation timing', b: 'Observation: [REDACTED]% of 90+-day balances lack an itemized statement matched to service date. Impact: every challenge requires a research cycle averaging [REDACTED] days before response. Root cause: documentation generated at billing, not re-generated at escalation. Recommendation: regenerate fresh packet at each escalation threshold.' },
        { t: 'Finding 3.2 — Escalation variance', b: 'Observation: across [REDACTED] sites, escalation occurs between day 60 and day 130 by billing-manager preference. Impact: identical-profile balances experience materially different timelines — fairness and compliance exposure. Root cause: no network-wide written policy. Recommendation: unified thresholds at 45 / 75 / 120 days with documented override criteria.' },
        { t: 'Finding 3.3 — Payment-path inconsistency', b: 'Observation: [REDACTED] of [REDACTED] sites send paper-only statements with no digital fallback. Impact: patients who prefer digital get friction at the exact moment the network needs cooperation. Root cause: portal rollout paused during [REDACTED] transition. Recommendation: extend portal option to all sites; paper retained as fallback.' },
        { t: 'Finding 3.4 — EHR-to-practice reconciliation gap', b: 'Observation: [REDACTED] sites show unreconciled balance delta between EHR and practice-management system, ranging $[REDACTED]K–$[REDACTED]K. Impact: finance reporting understates AR by aggregated $[REDACTED]K. Root cause: reconciliation cadence lapsed post-acquisition. Recommendation: weekly reconciliation restored network-wide with variance tolerance published.' },
        { t: 'Finding 3.5 — Counsel-handoff readiness', b: 'Observation: at enforcement point, packet readiness averages [REDACTED]% against 90% counsel requires. Impact: counsel delays action or bills additional preparation hours. Root cause: no single handoff-packet template. Recommendation: codify handoff template; measure readiness as standing KPI.' }
      ],
      sec4_title: 'Recovery opportunity band.',
      sec4_lead: 'Range-framed, not single-point. Low end assumes partial adoption; high end assumes full workflow adoption with documentation refresh discipline held.',
      band: [
        { l: 'Low band · 6-month recovery', v: '$[REDACTED]M', n: 'Partial adoption, documentation refresh every 60 days' },
        { l: 'High band · 6-month recovery', v: '$[REDACTED]M', n: 'Full adoption, weekly packet refresh, threshold discipline held' },
        { l: 'DSO compression estimate', v: '[REDACTED] days', n: 'Weighted-average movement across sites at 6-month mark' },
        { l: 'Bad-debt write-off trajectory', v: 'Declining', n: 'Direction, not magnitude — pending engagement close' }
      ],
      band_note_t: 'Assumptions underlying the band',
      band_note_b: 'No payer renegotiations. No new financing facility. Operator retains all patient-contact execution. No outside counsel engaged during the six-month window unless balance crosses 120-day threshold. Every assumption failure narrows the band toward the low end.',
      sec5_title: '90-day prioritized roadmap.',
      sec5_lead: 'Sequencing the diagnostic recommends. Not a quote — scope and price negotiated separately. Published so the operator can evaluate fit before commercial terms.',
      milestones: [
        { l: 'Days 1–30', t: 'Unified aging view, pilot sites, packet template', b: 'Build cross-site aging dashboard. Select [REDACTED] pilot sites covering volume and specialty mix. Publish patient-balance packet template. No network-wide rollout in this window — containment until the pilot validates.' },
        { l: 'Days 31–60', t: 'Payment-path cleanup, network rollout, exception queue', b: 'Extend portal to all sites with paper retained as fallback. Launch weekly exception queue with single cadence day across the network. Standardize message template with compliance sign-off.' },
        { l: 'Days 61–90', t: 'Unified thresholds, counsel template, operator handback', b: 'Set thresholds at 45 / 75 / 120 days. Publish counsel-handoff packet template. Begin handback of reporting cadence to the operator team with VCX in observer role for the final two weeks.' }
      ],
      sec6_title: 'Out of scope for this diagnostic.',
      sec6_lead: 'The diagnostic scope is deliberately narrow. Anything listed here is counsel-side, operator-side, or a separate commercial engagement.',
      sec6_bullets: [
        'No legal representation or legal advice. Counsel-side work remains with the operator\u2019s counsel; this diagnostic flags items for counsel, it does not resolve them.',
        'No debt-collection activity. No balance is contacted, assigned, or referred by VitaCoreX inside the diagnostic window.',
        'No HIPAA policy design. Compliance artifacts (NPP, BAA templates, breach-response policies) remain the operator\u2019s responsibility.',
        'No payer contract renegotiation. Contracts read for ambiguity only; renegotiation is a separate engagement.',
        'No PHI processing on VitaCoreX-owned infrastructure. All workflow tooling runs inside the operator\u2019s controlled environment.',
        'No warranty of specific recovery outcome. The Section 4 band is a modeled range, not a guarantee.'
      ],
      cta_h: 'Want the un-redacted version under NDA?',
      cta_p: 'A specific prior client, with explicit written consent, has agreed to share the full un-redacted diagnostic with qualified procurement teams under mutual NDA. If your evaluation needs page-for-page review of a live deliverable, that is the path — not an additional marketing asset.',
      cta_primary: 'Request the un-redacted version',
      cta_secondary: 'Review security & compliance'
    },
    ru: {
      eyebrow: 'Пример deliverable · отредактирован · B2B · сеть здравоохранения',
      h1: '30-дневная диагностика, как она приходит на стол руководителю.',
      lead: 'Отредактированная копия 30-дневного диагностического отчёта VitaCoreX на старте engagement. Идентичность клиента, точные цифры и персоналии заменены маркированными редакциями; структура, методология и тон — без изменений.',
      engagement: '30-дневная диагностика',
      client_note: 'Мультисайтовая сеть здравоохранения, юго-восток США',
      distribution: 'CFO · COO · Audit-комитет',
      side_t: 'Стандарт редакции',
      side_p: 'Каждый [REDACTED] — конкретное значение в живом deliverable: имя клиента, названия площадок, точные суммы, сотрудники, даты в пределах 90 дней. Заголовки разделов, методология, диагностическая логика и формулировки рекомендаций — дословно.',
      toc: ['Executive summary', 'Методология', 'Находки по доменам', 'Recovery opportunity band', '90-дневная дорожная карта', 'Out of scope'],
      sec1_title: 'Executive summary.',
      sec1_lead: 'Для CFO и COO — пять наблюдений, каждое связано с dollar-magnitude, который узнаёт финансовая команда. Рекомендации — в Секции 5 после установленных находок.',
      sec1_bullets: [
        'Восстанавливаемая AR по сети суммарно $[REDACTED]M — концентрация в балансах 60–180 дней со смешанным качеством packet.',
        '[REDACTED]% балансов старше 90 дней не имеют документации для ответа на вызов пациента или плательщика без дополнительного ресёрча.',
        'Пороги эскалации разные по [REDACTED] площадкам — одни эскалируют на 60 дне, другие после 120 — неравное обращение и дрейф DSO.',
        'Платёжные пути пациента несогласованы: [REDACTED] площадок имеют современный портал, [REDACTED] — только бумажные statements.',
        'Bad-debt write-offs выросли на [REDACTED]% YoY за trailing 12 месяцев — причина в тайминге документации, не в кредитоспособности пациентов.'
      ],
      sec2_title: 'Методология.',
      sec2_lead: 'Три фазы: сбор данных (дни 1–10), сэмплирование и аудит (дни 11–22), синтез и executive review (дни 23–30). Read-only доступ; без системных записей, без контакта с пациентами.',
      sec2_bullets: [
        'Aging-отчёты по каждой площадке — еженедельные snapshots trailing 90 дней, согласованы с операторским close.',
        'Статистически выбранный packet audit — 120 балансов по площадкам, aging-корзинам, типам услуг; каждый оценён по 12-пунктовой рубрике.',
        'Escalation-threshold аудит — одно интервью на площадку с billing-менеджером, фокус на наблюдаемой практике, не на политике на бумаге.',
        'Walkthrough пациентского пути — shadow-упражнение от получения statement до логина в портал, на production-конфигурации каждой площадки.',
        'Обзор контрактов и payer-mix — только чтение на предмет ambiguity; renegotiation вне scope диагностики.'
      ],
      sec3_title: 'Находки по доменам.',
      sec3_lead: 'Каждая находка: Observation → Impact → Root cause → Recommendation. Тот же шаблон, что в живом deliverable — находки можно оценивать независимо.',
      findings: [
        { t: 'Находка 3.1 — Тайминг документации', b: 'Observation: [REDACTED]% балансов 90+ дней не имеют itemized statement, привязанного к дате услуги. Impact: каждый вызов требует цикла ресёрча в среднем [REDACTED] дней до ответа. Root cause: документация генерируется при billing, не регенерируется при эскалации. Recommendation: регенерировать свежий packet на каждом пороге эскалации.' },
        { t: 'Находка 3.2 — Разброс эскалации', b: 'Observation: по [REDACTED] площадкам эскалация происходит между 60 и 130 днём по предпочтениям billing-менеджера. Impact: идентичные балансы получают материально разные тайминги — риск fairness и compliance. Root cause: нет сетевой письменной политики. Recommendation: единые пороги 45 / 75 / 120 дней с документированным override.' },
        { t: 'Находка 3.3 — Несогласованность платёжных путей', b: 'Observation: [REDACTED] из [REDACTED] площадок отправляют только бумажные statements без digital-fallback. Impact: пациенты, предпочитающие digital, получают trение в момент, когда сеть нуждается в кооперации. Root cause: раскатка портала приостановлена во время [REDACTED] перехода. Recommendation: расширить портал на все площадки; бумагу оставить fallback.' },
        { t: 'Находка 3.4 — Разрыв сверки EHR-to-practice', b: 'Observation: [REDACTED] площадок показывают несверённую дельту баланса между EHR и practice-management системами, $[REDACTED]K–$[REDACTED]K на площадку. Impact: финансовая отчётность занижает AR на агрегированные $[REDACTED]K. Root cause: каденс сверки упал после acquisition. Recommendation: еженедельная сверка восстановлена по сети с опубликованным допуском отклонения.' },
        { t: 'Находка 3.5 — Готовность передачи counsel', b: 'Observation: в точке enforcement готовность packet в среднем [REDACTED]% против 90%, которые требует counsel. Impact: counsel или откладывает действие, или биллит дополнительные часы подготовки. Root cause: нет единого шаблона handoff-packet. Recommendation: закодифицировать шаблон; измерять готовность как standing KPI.' }
      ],
      sec4_title: 'Recovery opportunity band.',
      sec4_lead: 'Диапазон, не одно значение. Нижняя граница — частичное внедрение; верхняя — полное внедрение workflow с дисциплиной refresh документации.',
      band: [
        { l: 'Low band · 6-месячное восстановление', v: '$[REDACTED]M', n: 'Частичное внедрение, refresh документации каждые 60 дней' },
        { l: 'High band · 6-месячное восстановление', v: '$[REDACTED]M', n: 'Полное внедрение, еженедельный packet refresh, дисциплина порогов удержана' },
        { l: 'Оценка компрессии DSO', v: '[REDACTED] дней', n: 'Weighted-average по площадкам на отметке 6 месяцев' },
        { l: 'Траектория bad-debt write-off', v: 'Снижается', n: 'Направление, не магнитуда — до закрытия engagement' }
      ],
      band_note_t: 'Предпосылки под band',
      band_note_b: 'Без renegotiation с плательщиками. Без нового финансового facility. Оператор сохраняет всё исполнение контакта с пациентами. Без внешнего counsel в шестимесячном окне, если баланс не пересекает 120-дневный порог. Отказ любой предпосылки сужает band к нижней границе.',
      sec5_title: '90-дневная приоритизированная дорожная карта.',
      sec5_lead: 'Последовательность, рекомендованная диагностикой. Не котировка — scope и цена согласуются отдельно. Публикуется для оценки fit до обсуждения коммерческих условий.',
      milestones: [
        { l: 'Дни 1–30', t: 'Единый aging-вид, пилотные площадки, шаблон packet', b: 'Собрать cross-site aging dashboard. Выбрать [REDACTED] пилотных площадок с охватом объёма и специализации. Опубликовать шаблон patient-balance packet. Без сетевого rollout в этом окне — containment до валидации пилота.' },
        { l: 'Дни 31–60', t: 'Очистка платёжных путей, сетевой rollout, exception queue', b: 'Расширить портал на все площадки с бумагой как fallback. Запустить weekly exception queue с единым cadence-днём по сети. Стандартизировать шаблон сообщения с compliance-подписью.' },
        { l: 'Дни 61–90', t: 'Единые пороги, шаблон counsel, handback оператору', b: 'Установить пороги 45 / 75 / 120 дней. Опубликовать шаблон counsel-handoff packet. Начать handback каденса отчётности команде оператора с VCX в роли наблюдателя на финальные две недели.' }
      ],
      sec6_title: 'Out of scope для этой диагностики.',
      sec6_lead: 'Scope диагностики намеренно узкий. Всё перечисленное — counsel-side, оператор-side или отдельный коммерческий engagement.',
      sec6_bullets: [
        'Без юридического представительства или юридических консультаций. Counsel-side остаётся у counsel оператора; диагностика флагирует пункты, не решает их.',
        'Без debt-collection. Ни один баланс не контактируется, не назначается и не передаётся VitaCoreX в окне диагностики.',
        'Без HIPAA policy design. Compliance-артефакты (NPP, BAA-шаблоны, breach-response политики) — ответственность оператора.',
        'Без renegotiation контрактов с плательщиками. Контракты читаются только на ambiguity; renegotiation — отдельный engagement.',
        'Без обработки PHI на инфраструктуре VitaCoreX. Workflow-инструменты работают внутри контролируемой среды оператора.',
        'Без гарантии конкретного recovery-исхода. Band в Секции 4 — моделируемый диапазон, не гарантия.'
      ],
      cta_h: 'Нужна не-отредактированная версия под NDA?',
      cta_p: 'Конкретный предыдущий клиент с письменным согласием разрешил делиться полной не-отредактированной диагностикой с квалифицированными procurement-командами под взаимным NDA. Если ваша оценка требует page-for-page review живого deliverable, это путь — не дополнительный marketing asset.',
      cta_primary: 'Запросить не-отредактированную версию',
      cta_secondary: 'Безопасность и compliance'
    },
    es: {
      eyebrow: 'Muestra de entregable · Redactada · B2B · Red de salud',
      h1: 'Diagnostico de 30 dias, como llega al escritorio ejecutivo.',
      lead: 'Replica redactada del diagnostico de 30 dias que VitaCoreX produce al inicio del engagement. Identidad del cliente, cifras exactas y personal reemplazados con redacciones marcadas; estructura, metodologia y tono sin cambios.',
      engagement: 'Diagnostico de 30 dias',
      client_note: 'Red de salud multi-sitio, sureste de EE.UU.',
      distribution: 'CFO · COO · Comite de auditoria',
      side_t: 'Estandar de redaccion',
      side_p: 'Cada [REDACTED] fue un valor especifico en el entregable en vivo — nombre del cliente, sitios, cifras exactas, personal y fechas dentro de 90 dias. Encabezados, metodologia, logica diagnostica y enmarcado de recomendaciones — literales.',
      toc: ['Resumen ejecutivo', 'Metodologia', 'Hallazgos por dominio', 'Banda de recuperacion', 'Hoja de ruta 90 dias', 'Fuera de alcance'],
      sec1_title: 'Resumen ejecutivo.',
      sec1_lead: 'Para audiencia CFO y COO — cinco observaciones, cada una ligada a magnitud en dolares reconocible por finanzas. Recomendaciones en Seccion 5 tras establecer hallazgos.',
      sec1_bullets: [
        'AR recuperable en la red totaliza $[REDACTED]M — concentrado en saldos 60–180 dias con calidad de packet mixta.',
        '[REDACTED]% de saldos 90+ dias carecen de documentacion para responder a disputa sin ciclo adicional de investigacion.',
        'Umbrales de escalamiento varian en [REDACTED] sitios — unos escalan a 60 dias, otros pasados 120 — trato desigual y deriva de DSO.',
        'Rutas de pago de paciente inconsistentes: [REDACTED] sitios ofrecen portal moderno, [REDACTED] dependen de statements en papel.',
        'Write-offs de mala deuda subieron [REDACTED]% YoY en 12 meses — causa es tiempo de documentacion, no solvencia del paciente.'
      ],
      sec2_title: 'Metodologia.',
      sec2_lead: 'Tres fases: coleccion de datos (dias 1–10), muestreo y auditoria (dias 11–22), sintesis y revision ejecutiva (dias 23–30). Acceso solo-lectura; sin escrituras al sistema, sin contacto con paciente.',
      sec2_bullets: [
        'Extraccion de aging por sitio — snapshots semanales trailing 90 dias, conciliados al cierre del operador.',
        'Auditoria de packet muestreada estadisticamente — 120 saldos por sitios, edades y tipos de servicio; cada uno puntuado contra rubrica de 12 items.',
        'Auditoria de umbrales de escalamiento — una entrevista por sitio con el gerente de facturacion, enfocada en practica observada.',
        'Recorrido de ruta del paciente — ejercicio shadow desde recepcion de statement hasta login en portal, en configuracion productiva de cada sitio.',
        'Revision de contratos y payer-mix — lectura para ambiguedad solamente; sin renegociacion dentro del alcance del diagnostico.'
      ],
      sec3_title: 'Hallazgos por dominio.',
      sec3_lead: 'Cada hallazgo sigue Observacion → Impacto → Causa raiz → Recomendacion. Mismo formato que usa el entregable en vivo.',
      findings: [
        { t: 'Hallazgo 3.1 — Tiempo de documentacion', b: 'Observacion: [REDACTED]% de saldos 90+ dias carecen de statement itemizado vinculado a fecha de servicio. Impacto: cada disputa requiere ciclo de investigacion de [REDACTED] dias. Causa raiz: documentacion generada en facturacion, no regenerada en escalamiento. Recomendacion: regenerar packet fresco en cada umbral.' },
        { t: 'Hallazgo 3.2 — Variabilidad de escalamiento', b: 'Observacion: en [REDACTED] sitios, escalamiento ocurre entre dia 60 y dia 130 segun preferencia del gerente. Impacto: saldos de perfil identico experimentan tiempos materialmente distintos. Causa raiz: sin politica escrita a nivel red. Recomendacion: umbrales unificados 45 / 75 / 120 dias con criterios de override documentados.' },
        { t: 'Hallazgo 3.3 — Inconsistencia de rutas de pago', b: 'Observacion: [REDACTED] de [REDACTED] sitios envian solo statements en papel sin fallback digital. Impacto: pacientes que prefieren digital reciben friccion justo cuando la red necesita cooperacion. Causa raiz: despliegue de portal pausado durante transicion [REDACTED]. Recomendacion: extender portal a todos los sitios; papel como fallback.' },
        { t: 'Hallazgo 3.4 — Brecha de conciliacion EHR-practice', b: 'Observacion: [REDACTED] sitios muestran delta de saldo sin conciliar entre EHR y sistema de practica, $[REDACTED]K–$[REDACTED]K por sitio. Impacto: reportes financieros subestiman AR en $[REDACTED]K agregados. Causa raiz: cadencia de conciliacion decayo post-adquisicion. Recomendacion: conciliacion semanal restaurada en toda la red.' },
        { t: 'Hallazgo 3.5 — Disposicion para handoff a counsel', b: 'Observacion: en punto de enforcement, disposicion del packet promedia [REDACTED]% contra 90% que requiere counsel. Impacto: counsel retrasa accion o factura horas adicionales. Causa raiz: sin plantilla unica de handoff. Recomendacion: codificar plantilla; medir disposicion como KPI permanente.' }
      ],
      sec4_title: 'Banda de oportunidad de recuperacion.',
      sec4_lead: 'Rango, no valor unico. Limite inferior asume adopcion parcial; limite superior asume adopcion completa con disciplina de refresh.',
      band: [
        { l: 'Banda baja · recuperacion 6 meses', v: '$[REDACTED]M', n: 'Adopcion parcial, refresh de documentacion cada 60 dias' },
        { l: 'Banda alta · recuperacion 6 meses', v: '$[REDACTED]M', n: 'Adopcion completa, refresh semanal, disciplina de umbrales mantenida' },
        { l: 'Estimacion de compresion de DSO', v: '[REDACTED] dias', n: 'Movimiento promedio ponderado a 6 meses' },
        { l: 'Trayectoria de write-off', v: 'Declinando', n: 'Direccion, no magnitud — pendiente cierre de engagement' }
      ],
      band_note_t: 'Supuestos bajo la banda',
      band_note_b: 'Sin renegociacion con pagadores. Sin nueva facilidad de financiamiento. Operador retiene todo contacto con paciente. Sin counsel externo en ventana de seis meses a menos que saldo cruce el umbral 120 dias. Cada falla de supuesto estrecha la banda hacia el limite inferior.',
      sec5_title: 'Hoja de ruta priorizada 90 dias.',
      sec5_lead: 'Secuencia recomendada por el diagnostico. No es cotizacion — alcance y precio se negocian aparte. Publicado para evaluacion de fit antes de terminos comerciales.',
      milestones: [
        { l: 'Dias 1–30', t: 'Vista unificada de aging, sitios piloto, plantilla de packet', b: 'Construir dashboard cross-site de aging. Seleccionar [REDACTED] sitios piloto cubriendo volumen y mix. Publicar plantilla patient-balance packet. Sin despliegue en red en esta ventana — contencion hasta validar piloto.' },
        { l: 'Dias 31–60', t: 'Limpieza de ruta de pago, despliegue de red, cola de excepciones', b: 'Extender portal a todos los sitios con papel como fallback. Lanzar cola semanal de excepciones con un dia de cadencia unico. Estandarizar plantilla de mensaje con firma de cumplimiento.' },
        { l: 'Dias 61–90', t: 'Umbrales unificados, plantilla de counsel, handback al operador', b: 'Fijar umbrales 45 / 75 / 120 dias. Publicar plantilla counsel-handoff. Iniciar handback de cadencia de reporte al equipo operador con VCX en rol observador por las ultimas dos semanas.' }
      ],
      sec6_title: 'Fuera de alcance para este diagnostico.',
      sec6_lead: 'Alcance del diagnostico es deliberadamente estrecho. Lo listado es counsel-side, operator-side, o engagement comercial separado.',
      sec6_bullets: [
        'Sin representacion ni asesoria juridica. Trabajo counsel-side permanece con el counsel del operador; diagnostico flagea items, no los resuelve.',
        'Sin actividad de cobro de deudas. Ningun saldo es contactado, asignado o referido por VitaCoreX dentro de la ventana.',
        'Sin diseno de politica HIPAA. Artefactos de cumplimiento (NPP, plantillas BAA, politicas de respuesta a brechas) permanecen con el operador.',
        'Sin renegociacion de contratos con pagadores. Contratos leidos para ambiguedad; renegociacion es engagement separado.',
        'Sin procesamiento de PHI en infraestructura VitaCoreX. Herramientas de workflow corren dentro del entorno controlado del operador.',
        'Sin garantia de resultado especifico de recuperacion. La banda de la Seccion 4 es un rango modelado, no una garantia.'
      ],
      cta_h: 'Quieres la version no redactada bajo NDA?',
      cta_p: 'Un cliente previo especifico, con consentimiento escrito, acepto compartir el diagnostico completo no redactado con equipos de procurement calificados bajo NDA mutuo. Si tu evaluacion necesita revision pagina-por-pagina de un entregable en vivo, esa es la via — no un asset de marketing adicional.',
      cta_primary: 'Solicitar version no redactada',
      cta_secondary: 'Revisar seguridad y cumplimiento'
    }
  });
}

function _packet_ru_es_en() {
  return {
    en: _mkContent({
      eyebrow: 'Sample deliverable · Redacted · B2B · Gated',
      h1: 'Counsel-Ready Packet Index — the 12 items counsel needs before acting.',
      lead: 'Before a balance moves to counsel, every live engagement produces a packet index scored against a 12-item rubric. This redacted replica shows the rubric, scoring logic, and readiness gate in full.',
      engagement: '14-day packet index readiness review',
      client_note: 'Multi-site healthcare network, US Southeast',
      distribution: 'General counsel · CFO · Collections lead',
      toc: ['Readiness at a glance', 'Rubric — 12 items', 'Item-by-item findings', 'Gate threshold', 'Remediation sequence', 'Out of scope'],
      sec1_title: 'Readiness at a glance.',
      sec1_lead: 'Five observations. Each one maps to a rubric item in Section 3.',
      sec1_bullets: [
        'Overall readiness score: [REDACTED]/12 against the 9.0 threshold counsel requires.',
        'Three items below 0.5: itemized statement hygiene, signed-contract attachment, escalation-notice trail.',
        'Four items above 0.8: entity identification, payment history, dispute log, prior correspondence.',
        '[REDACTED] balances in the sample; [REDACTED]% pass the 9.0 threshold without remediation.',
        'Remediation time to 9.0 averages [REDACTED] days per balance in the sample.'
      ],
      sec2_title: 'Rubric — 12 items.',
      sec2_lead: 'Each item scored 0–1. Counsel-acceptance threshold is total 9.0/12. Items are weighted equally; no single item can be waived.',
      sec2_bullets: [
        '1. Entity identification — legal names match on all documents.',
        '2. Signed contract — executed agreement attached, not a template.',
        '3. Itemized statement — single source-of-truth invoice reconciled to the ledger.',
        '4. Payment history — complete record with method, date, amount.',
        '5. Aging context — how the balance reached its current bucket.',
        '6. Dispute log — open or resolved items with timestamps and owners.',
        '7. Prior correspondence — full exchange in date order.',
        '8. Escalation notice trail — notices sent at 30/60/90, with delivery confirmation.',
        '9. Payer mix — if multi-party, allocation across payers documented.',
        '10. Compliance artifacts — any regulated disclosures attached (HIPAA NPP where applicable).',
        '11. Jurisdiction context — state, venue, relevant statute notes.',
        '12. Statute-of-limitations check — internal timestamp of SOL tail.'
      ],
      sec3_title: 'Item-by-item findings.',
      sec3_lead: 'Sample of the live finding format: each item scored, observation, remediation, expected lift.',
      findings: [
        { t: 'Finding 3.1 — Itemized statement', b: 'Score [REDACTED]/1. Observation: [REDACTED]% of statements are batched, not itemized per service date. Remediation: regenerate itemized per escalation threshold. Expected lift: +[REDACTED] points across the portfolio.' },
        { t: 'Finding 3.2 — Signed contract', b: 'Score [REDACTED]/1. Observation: signed contract missing on [REDACTED]% of balances because the operator uses click-through + e-signature across sites but records differ. Remediation: pull e-signature audit trail as attachment. Expected lift: +[REDACTED] points.' },
        { t: 'Finding 3.3 — Escalation notice trail', b: 'Score [REDACTED]/1. Observation: notices exist but delivery confirmations not archived. Remediation: route notices through a provider with confirmation artifact. Expected lift: +[REDACTED] points.' },
        { t: 'Finding 3.4 — Statute-of-limitations check', b: 'Score [REDACTED]/1. Observation: SOL check done manually per balance, not baked into the packet. Remediation: embed SOL field with automatic flag at 60 / 30 / 14 days to tail. Expected lift: compliance, not points.' }
      ],
      sec4_title: 'Gate threshold.',
      sec4_lead: 'The 9.0/12 gate is fixed by counsel acceptance practice. Balances below the gate either remediate or stay in-house.',
      band: [
        { l: 'Balances at gate today', v: '[REDACTED]%', n: 'Ready to hand off without remediation' },
        { l: 'Balances within one week', v: '[REDACTED]%', n: 'Remediable under the existing workflow' },
        { l: 'Balances beyond one week', v: '[REDACTED]%', n: 'Structural remediation needed before next cycle' },
        { l: 'Expected portfolio gate rate after 90 days', v: '[REDACTED]%', n: 'With the remediation sequence in Section 5' }
      ],
      band_note_t: 'Gate discipline',
      band_note_b: 'Counsel does not negotiate the gate. Gate rate compounds across cycles — each cycle either raises or erodes the portfolio average.',
      sec5_title: 'Remediation sequence.',
      sec5_lead: 'The sequencing that most often lifts portfolio gate rate from the starting point to target within 90 days.',
      milestones: [
        { l: 'Days 1–15', t: 'Itemized statement regeneration + signed contract audit', b: 'Highest-leverage items; two-week deploy with audit trail.' },
        { l: 'Days 16–45', t: 'Escalation-notice trail + delivery confirmation', b: 'Route through a provider. Archive confirmations as structured artifact.' },
        { l: 'Days 46–90', t: 'SOL automation + monthly portfolio gate report', b: 'Embed SOL field. Stand up a recurring gate-rate scorecard for leadership.' }
      ],
      sec6_title: 'Out of scope.',
      sec6_lead: 'Narrow by design.',
      sec6_bullets: [
        'No legal representation or legal advice.',
        'No debt-collection activity or customer contact.',
        'No modification of the underlying contract language.',
        'No warranty that any specific balance succeeds in enforcement.',
        'No guarantees of any particular gate rate or collection recovery.',
        'No handling of regulated data on VitaCoreX-owned infrastructure.'
      ],
      cta_h: 'Want the un-redacted rubric?',
      cta_p: 'The full 12-item rubric with live scoring is gated. Qualified procurement teams receive the un-redacted version under mutual NDA.',
      cta_primary: 'Request the un-redacted rubric',
      cta_secondary: 'Security & procurement'
    }),
    ru: _mkContent({
      eyebrow: 'Пример deliverable · отредактирован · B2B · с формой',
      h1: 'Counsel-Ready Packet Index — 12 пунктов, которые нужны советнику до действия.',
      lead: 'До того как баланс уходит советнику, каждый engagement производит индекс пакета, оцениваемый по 12-пунктовой рубрике. Эта отредактированная копия показывает рубрику, логику скоринга и гейт готовности целиком.',
      engagement: '14-дневный обзор готовности индекса пакета',
      client_note: 'Сеть медицинских клиник, юго-восток США',
      distribution: 'General counsel · CFO · руководитель сборов',
      toc: ['Готовность на обзор', 'Рубрика — 12 пунктов', 'Находки по пунктам', 'Порог гейта', 'Последовательность remediation', 'Вне scope'],
      sec1_title: 'Готовность на обзор.',
      sec1_lead: 'Пять наблюдений. Каждое привязано к пункту рубрики в разделе 3.',
      sec1_bullets: [
        'Общий балл готовности: [REDACTED]/12 против порога 9.0, требуемого советником.',
        'Три пункта ниже 0.5: гигиена itemized-выписки, signed-contract вложение, след escalation-уведомлений.',
        'Четыре пункта выше 0.8: идентификация сущности, история платежей, лог споров, переписка.',
        '[REDACTED] балансов в выборке; [REDACTED]% проходят 9.0 без remediation.',
        'Время remediation до 9.0 в среднем [REDACTED] дней на баланс.'
      ],
      sec2_title: 'Рубрика — 12 пунктов.',
      sec2_lead: 'Каждый пункт 0–1. Порог принятия советником — суммарно 9.0/12. Все пункты равновесны; ни один нельзя снять.',
      sec2_bullets: [
        '1. Идентификация сущности — юр. имена совпадают во всех документах.',
        '2. Подписанный договор — исполненное соглашение, не шаблон.',
        '3. Itemized-выписка — единая правда-инвойс, сверенная с главной книгой.',
        '4. История платежей — полный реестр с методом, датой, суммой.',
        '5. Контекст aging — как баланс попал в текущую корзину.',
        '6. Лог споров — открытые или закрытые с отметками и владельцами.',
        '7. Предшествующая переписка — полный обмен по датам.',
        '8. След escalation-уведомлений — отправки на 30/60/90 с подтверждением доставки.',
        '9. Payer mix — при мульти-сторонности, распределение по плательщикам документировано.',
        '10. Compliance-артефакты — регулируемые раскрытия (HIPAA NPP, где применимо).',
        '11. Контекст юрисдикции — штат, venue, релевантные нормы.',
        '12. Проверка срока исковой давности — внутренняя отметка о tail SOL.'
      ],
      sec3_title: 'Находки по пунктам.',
      sec3_lead: 'Образец формата live-находки: балл, наблюдение, remediation, ожидаемый лифт.',
      findings: [
        { t: 'Находка 3.1 — Itemized-выписка', b: 'Балл [REDACTED]/1. Наблюдение: [REDACTED]% выписок батчевые, не itemized по дате услуги. Remediation: регенерация itemized при каждом пороге. Ожидаемый лифт: +[REDACTED] пунктов по портфелю.' },
        { t: 'Находка 3.2 — Подписанный договор', b: 'Балл [REDACTED]/1. Наблюдение: подписанный договор отсутствует на [REDACTED]% балансов из-за click-through + e-signature, но записи разнятся. Remediation: выгружать audit-trail e-signature как вложение. Ожидаемый лифт: +[REDACTED] пунктов.' },
        { t: 'Находка 3.3 — След уведомлений эскалации', b: 'Балл [REDACTED]/1. Наблюдение: уведомления есть, но подтверждения доставки не архивированы. Remediation: маршрутизировать через провайдера с артефактом подтверждения. Ожидаемый лифт: +[REDACTED] пунктов.' },
        { t: 'Находка 3.4 — Проверка срока давности', b: 'Балл [REDACTED]/1. Наблюдение: проверка SOL выполняется вручную, не запечена в пакет. Remediation: встроить поле SOL с авто-флагом при 60 / 30 / 14 днях до tail. Ожидаемый лифт: compliance, не баллы.' }
      ],
      sec4_title: 'Порог гейта.',
      sec4_lead: 'Гейт 9.0/12 фиксирован практикой принятия советником. Балансы ниже — либо remediation, либо остаются in-house.',
      band: [
        { l: 'На гейте сегодня', v: '[REDACTED]%', n: 'Готовы к handoff без remediation' },
        { l: 'В пределах недели', v: '[REDACTED]%', n: 'Remediable в существующем workflow' },
        { l: 'За пределами недели', v: '[REDACTED]%', n: 'Нужен структурный remediation до следующего цикла' },
        { l: 'Ожидаемый gate-rate после 90 дней', v: '[REDACTED]%', n: 'С последовательностью remediation в разделе 5' }
      ],
      band_note_t: 'Дисциплина гейта',
      band_note_b: 'Советник не торгуется о гейте. Gate rate композит по циклам — каждый цикл либо повышает, либо размывает среднее.',
      sec5_title: 'Последовательность remediation.',
      sec5_lead: 'Последовательность, которая чаще всего поднимает gate rate портфеля с начала до цели за 90 дней.',
      milestones: [
        { l: 'Дни 1–15', t: 'Регенерация itemized + аудит подписанного договора', b: 'Самые рычажные пункты; двухнедельный деплой с audit-trail.' },
        { l: 'Дни 16–45', t: 'След escalation-уведомлений + подтверждение доставки', b: 'Маршрутизация через провайдера. Архивация подтверждений как структурированный артефакт.' },
        { l: 'Дни 46–90', t: 'Автоматизация SOL + месячный gate-отчёт', b: 'Встроить поле SOL. Поставить recurring gate-scorecard для руководства.' }
      ],
      sec6_title: 'Вне scope.',
      sec6_lead: 'Узко по дизайну.',
      sec6_bullets: [
        'Никакого юридического представительства или советов.',
        'Никакой collection-деятельности и клиентского контакта.',
        'Никакой модификации контрактного языка.',
        'Никакой гарантии по конкретному enforcement любого баланса.',
        'Никаких гарантий конкретного gate rate или collection recovery.',
        'Никакой обработки регулируемых данных на инфраструктуре VitaCoreX.'
      ],
      cta_h: 'Нужна неотредактированная рубрика?',
      cta_p: 'Полная 12-пунктовая рубрика с live-скорингом gated. Квалифицированные procurement-команды получают её под взаимным NDA.',
      cta_primary: 'Запросить неотредактированную рубрику',
      cta_secondary: 'Security & procurement'
    }),
    es: _mkContent({
      eyebrow: 'Muestra redactada · B2B · con formulario',
      h1: 'Counsel-Ready Packet Index — los 12 items que el asesor exige antes de actuar.',
      lead: 'Antes de enviar un balance al asesor, cada engagement vivo produce un indice de paquete evaluado contra una rubrica de 12 items. Esta replica redactada muestra la rubrica, la logica de puntaje y la compuerta de readiness completa.',
      engagement: 'Revision de readiness del indice de paquete en 14 dias',
      client_note: 'Red de clinicas medicas, sureste EE.UU.',
      distribution: 'Asesor general · CFO · Lider de cobranza',
      toc: ['Readiness de un vistazo', 'Rubrica — 12 items', 'Hallazgos item a item', 'Umbral de compuerta', 'Secuencia de remediacion', 'Fuera de alcance'],
      sec1_title: 'Readiness de un vistazo.',
      sec1_lead: 'Cinco observaciones. Cada una se ancla a un item de la seccion 3.',
      sec1_bullets: [
        'Puntaje total de readiness: [REDACTED]/12 contra el umbral 9.0 que exige el asesor.',
        'Tres items bajo 0.5: higiene de estado itemizado, adjunto de contrato firmado, traza de notificaciones de escalamiento.',
        'Cuatro items sobre 0.8: identificacion de entidad, historial de pagos, log de disputas, correspondencia previa.',
        '[REDACTED] balances en la muestra; [REDACTED]% pasan 9.0 sin remediacion.',
        'Tiempo de remediacion a 9.0 promedia [REDACTED] dias por balance.'
      ],
      sec2_title: 'Rubrica — 12 items.',
      sec2_lead: 'Cada item 0–1. El umbral de aceptacion del asesor es total 9.0/12. Todos los items pesan igual; ninguno se puede renunciar.',
      sec2_bullets: [
        '1. Identificacion de entidad — nombres legales coinciden en todos los documentos.',
        '2. Contrato firmado — acuerdo ejecutado adjunto, no plantilla.',
        '3. Estado itemizado — factura unica-fuente-de-verdad reconciliada al libro mayor.',
        '4. Historial de pagos — registro completo con metodo, fecha, monto.',
        '5. Contexto de aging — como el balance llego a su bucket actual.',
        '6. Log de disputas — items abiertos o resueltos con timestamps y duenos.',
        '7. Correspondencia previa — intercambio completo en orden de fecha.',
        '8. Traza de notificaciones de escalamiento — envios en 30/60/90 con confirmacion de entrega.',
        '9. Mezcla de pagador — si multi-parte, asignacion entre pagadores documentada.',
        '10. Artefactos de compliance — divulgaciones reguladas adjuntas (HIPAA NPP donde aplica).',
        '11. Contexto de jurisdiccion — estado, venue, notas de norma relevantes.',
        '12. Chequeo de prescripcion — timestamp interno del tail SOL.'
      ],
      sec3_title: 'Hallazgos item a item.',
      sec3_lead: 'Ejemplo del formato de hallazgo vivo: item puntuado, observacion, remediacion, lift esperado.',
      findings: [
        { t: 'Hallazgo 3.1 — Estado itemizado', b: 'Puntaje [REDACTED]/1. Observacion: [REDACTED]% de estados batched, no itemizados por fecha de servicio. Remediacion: regenerar itemizado por cada umbral de escalamiento. Lift esperado: +[REDACTED] puntos en el portafolio.' },
        { t: 'Hallazgo 3.2 — Contrato firmado', b: 'Puntaje [REDACTED]/1. Observacion: contrato firmado ausente en [REDACTED]% porque el operador usa click-through + e-signature por sitios pero registros difieren. Remediacion: adjuntar audit-trail de e-signature. Lift esperado: +[REDACTED] puntos.' },
        { t: 'Hallazgo 3.3 — Traza de notificaciones de escalamiento', b: 'Puntaje [REDACTED]/1. Observacion: notificaciones existen pero confirmaciones de entrega no archivadas. Remediacion: enrutar via proveedor con artefacto de confirmacion. Lift esperado: +[REDACTED] puntos.' },
        { t: 'Hallazgo 3.4 — Chequeo de prescripcion', b: 'Puntaje [REDACTED]/1. Observacion: chequeo SOL manual, no integrado al paquete. Remediacion: integrar campo SOL con flag automatico a 60 / 30 / 14 dias del tail. Lift esperado: compliance, no puntos.' }
      ],
      sec4_title: 'Umbral de compuerta.',
      sec4_lead: 'La compuerta 9.0/12 la fija la practica de aceptacion del asesor. Balances bajo la compuerta: remediacion o quedan in-house.',
      band: [
        { l: 'Balances en compuerta hoy', v: '[REDACTED]%', n: 'Listos para handoff sin remediacion' },
        { l: 'Balances dentro de una semana', v: '[REDACTED]%', n: 'Remediables en el workflow existente' },
        { l: 'Balances mas alla de una semana', v: '[REDACTED]%', n: 'Remediacion estructural antes del proximo ciclo' },
        { l: 'Tasa de compuerta esperada a 90 dias', v: '[REDACTED]%', n: 'Con la secuencia de remediacion de la seccion 5' }
      ],
      band_note_t: 'Disciplina de compuerta',
      band_note_b: 'El asesor no negocia la compuerta. La tasa compone por ciclos — cada ciclo sube o erosiona el promedio.',
      sec5_title: 'Secuencia de remediacion.',
      sec5_lead: 'La secuencia que mas a menudo eleva la tasa de compuerta del portafolio del punto de partida al objetivo en 90 dias.',
      milestones: [
        { l: 'Dias 1–15', t: 'Regeneracion de itemizado + auditoria de contrato firmado', b: 'Items de mayor palanca; despliegue de dos semanas con audit-trail.' },
        { l: 'Dias 16–45', t: 'Traza de notificacion de escalamiento + confirmacion de entrega', b: 'Enrutar via proveedor. Archivar confirmaciones como artefacto estructurado.' },
        { l: 'Dias 46–90', t: 'Automatizacion SOL + reporte mensual de compuerta', b: 'Integrar campo SOL. Levantar scorecard recurrente de compuerta para liderazgo.' }
      ],
      sec6_title: 'Fuera de alcance.',
      sec6_lead: 'Estrecho por diseno.',
      sec6_bullets: [
        'Sin representacion legal ni asesoria juridica.',
        'Sin actividad de cobranza ni contacto con cliente.',
        'Sin modificacion del lenguaje contractual subyacente.',
        'Sin garantia de exito de enforcement en balance especifico.',
        'Sin garantias de tasa de compuerta o recuperacion particular.',
        'Sin manejo de datos regulados sobre infraestructura VitaCoreX.'
      ],
      cta_h: 'Quiere la rubrica no-redactada?',
      cta_p: 'La rubrica completa de 12 items con puntaje vivo es gated. Equipos de procurement calificados la reciben bajo NDA mutuo.',
      cta_primary: 'Solicitar la rubrica no-redactada',
      cta_secondary: 'Seguridad y procurement'
    })
  };
}

function _contract_memo() {
  const shared = {
    engagement: { en: '$149 Contract Review — 48-hour turnaround', ru: '$149 Contract Review — 48-часовая очередь', es: '$149 Contract Review — turnaround 48 horas' },
    client_note: { en: 'Private client, retail services agreement', ru: 'Частный клиент, retail-service соглашение', es: 'Cliente privado, acuerdo de servicios retail' },
    distribution: { en: 'Client (direct) · No counterparty copy', ru: 'Клиент (прямо) · без копии контрагенту', es: 'Cliente (directo) · Sin copia a contraparte' }
  };
  const bullets_en = [
    '1. Parties — legal names and roles match the trading entity.',
    '2. Term — start, end, and renewal behavior are defined.',
    '3. Fees — all line items named; no bundled "other".',
    '4. Scope — deliverables described, not just "services".',
    '5. Termination — for-cause and for-convenience both addressed.',
    '6. Late-fee discipline — FL statutory caps respected where applicable.',
    '7. Liability cap — present, mutual, not open-ended.',
    '8. Indemnification — mutual or unilateral flagged.',
    '9. Forum — venue + governing law named.',
    '10. Arbitration / class waiver — presence and implications disclosed.'
  ];
  const findings_en = [
    { t: 'Flag 3.1 — Renewal language', b: 'Observation: automatic renewal with 30-day notice window falls mid-holiday. Impact: client risks silent renewal at elevated rate. Recommendation: extend notice window to 60 days or calendar alert; do not sign as-is.' },
    { t: 'Flag 3.2 — Fee escalator', b: 'Observation: escalator pegged to CPI-U with [REDACTED]% floor. Impact: real increase can outrun inflation. Recommendation: negotiate floor cap or swap to a fixed-schedule increase.' },
    { t: 'Flag 3.3 — Termination asymmetry', b: 'Observation: counterparty may terminate for convenience with 15 days; client must give 60 days + pay liquidated damages. Impact: exit cost borne disproportionately. Recommendation: parity on notice and damages, or accept + negotiate price.' }
  ];
  return {
    en: _mkContent({
      eyebrow: 'Sample deliverable · Redacted · Private client · Ungated',
      h1: 'Contract Risk Flag Memo — the 10 items we read before you sign.',
      lead: 'This redacted replica shows how VitaCoreX flags risk on a standard services agreement for a private client. Scope, rubric, and flag format are identical to the live $149 deliverable.',
      engagement: shared.engagement.en, client_note: shared.client_note.en, distribution: shared.distribution.en,
      toc: ['Top-line read', 'Ten-point rubric', 'Flagged items', 'Risk band', 'Suggested sequence', 'Out of scope'],
      sec1_title: 'Top-line read.',
      sec1_lead: 'Three observations a private client can act on today.',
      sec1_bullets: [
        'Three high-risk flags identified; none are deal-breakers on their own, but one is a sign-or-walk.',
        'Most fees are itemized; one bundled "administrative" line needs itemization before signing.',
        'The termination clause is asymmetric — negotiate or price it in.'
      ],
      sec2_title: 'Ten-point rubric.',
      sec2_lead: 'Every contract review runs against the same 10 items. Flags below trigger a call-out; passes are not listed in the live memo.',
      sec2_bullets: bullets_en,
      sec3_title: 'Flagged items.',
      sec3_lead: 'Each flag: Observation → Impact → Recommendation. The live memo also includes redline suggestions per flag — excluded from the sample for brevity.',
      findings: findings_en,
      sec4_title: 'Risk band.',
      sec4_lead: 'Range, not single-point. Low end assumes flags addressed; high end assumes signed as-is.',
      band: [
        { l: 'Low-risk outcome (flags addressed)', v: 'Acceptable', n: 'Signing with the three flags negotiated' },
        { l: 'High-risk outcome (signed as-is)', v: 'Avoid', n: 'Auto-renewal + asymmetric termination + unbounded escalator' },
        { l: 'Cost of negotiating all flags', v: '[REDACTED] hrs', n: 'Client time; counterparty response varies' },
        { l: 'Cost of signing as-is', v: '[REDACTED] over term', n: 'Modeled, not guaranteed — assumes average inflation and full term' }
      ],
      band_note_t: 'Assumptions underlying the band',
      band_note_b: 'Modeled on current CPI trajectory and the counterparty\u2019s historical fee-schedule behavior where visible. Every assumption failure narrows the band toward the high-risk end.',
      sec5_title: 'Suggested sequence.',
      sec5_lead: 'Recommended order of operation for the private client.',
      milestones: [
        { l: 'Day 1', t: 'Request redline on the three flags', b: 'Send the recommended edits via email with track changes. No phone call yet.' },
        { l: 'Day 2–3', t: 'Counterparty response review', b: 'Compare counterparty redline against the recommendation. If substantive pushback on Flag 3.3, pause.' },
        { l: 'Day 4–7', t: 'Sign or walk decision', b: 'If all three flags acceptably resolved, sign. If Flag 3.3 is not resolved, walk or re-price.' }
      ],
      sec6_title: 'Out of scope.',
      sec6_lead: 'A contract review is narrow by design. These are not covered.',
      sec6_bullets: [
        'This is not legal advice. Specific legal strategy requires a licensed attorney.',
        'No representation or negotiation on the client\u2019s behalf — the client handles communication.',
        'No review of attached exhibits unless named as Tier 3 add-on.',
        'No tax or accounting analysis.',
        'No warranty that counterparty accepts any recommended redline.'
      ],
      cta_h: 'Ready to have your own contract reviewed?',
      cta_p: 'Standard $149 contract review returns in 48 hours. Complex or multi-party agreements step up to Tier 2 ($219) or Tier 3 advisory (from $349).',
      cta_primary: 'Order a contract review',
      cta_secondary: 'See tiers + pricing'
    }),
    ru: _mkContent({
      eyebrow: 'Пример deliverable · отредактирован · частный клиент · без формы',
      h1: 'Contract Risk Flag Memo — 10 пунктов, которые мы читаем до подписи.',
      lead: 'Эта отредактированная копия показывает, как VitaCoreX маркирует риск на стандартном service-соглашении частного клиента. Scope, рубрика и формат флагов идентичны живому деливераблу за $149.',
      engagement: '$149 Contract Review — 48-часовая очередь',
      client_note: 'Частный клиент, retail-service соглашение',
      distribution: 'Клиент (прямо) · без копии контрагенту',
      toc: ['Верхний уровень', '10-пунктовая рубрика', 'Отмеченные пункты', 'Диапазон риска', 'Рекомендуемая последовательность', 'Вне scope'],
      sec1_title: 'Верхний уровень.',
      sec1_lead: 'Три наблюдения, по которым клиент может действовать уже сегодня.',
      sec1_bullets: [
        'Три high-risk флага; по отдельности не deal-breaker, но один — sign-or-walk.',
        'Большинство сборов itemized; одна bundled "administrative" строка требует разбивки до подписи.',
        'Terminating-клауза асимметрична — договариваться или заложить в цену.'
      ],
      sec2_title: '10-пунктовая рубрика.',
      sec2_lead: 'Каждый review проходит по одним и тем же 10 пунктам. В live-меморандуме отмечаются только флаги; passes не перечисляются.',
      sec2_bullets: [
        '1. Стороны — юр. имена и роли совпадают с trading entity.',
        '2. Срок — старт, финал, поведение renewal определены.',
        '3. Сборы — все строки поименованы; никакого bundled "other".',
        '4. Scope — описаны deliverables, не просто "services".',
        '5. Termination — и for-cause, и for-convenience адресованы.',
        '6. Late-fee дисциплина — при применимости соблюдены FL statutory caps.',
        '7. Cap ответственности — присутствует, взаимный, не open-ended.',
        '8. Indemnification — взаимный или односторонний отмечен.',
        '9. Forum — venue + governing law поименованы.',
        '10. Arbitration / class waiver — присутствие и последствия раскрыты.'
      ],
      sec3_title: 'Отмеченные пункты.',
      sec3_lead: 'Каждый флаг: Наблюдение → Влияние → Рекомендация.',
      findings: [
        { t: 'Флаг 3.1 — Язык renewal', b: 'Наблюдение: автоматический renewal с 30-дневным окном уведомления попадает в середину праздников. Влияние: риск тихого продления по повышенной ставке. Рекомендация: увеличить окно до 60 дней или календарь-алерт; не подписывать as-is.' },
        { t: 'Флаг 3.2 — Эскалятор сборов', b: 'Наблюдение: эскалятор привязан к CPI-U с [REDACTED]% floor. Влияние: реальный рост может обогнать инфляцию. Рекомендация: договориться о cap или перейти на фикс.' },
        { t: 'Флаг 3.3 — Асимметрия termination', b: 'Наблюдение: контрагент может прекратить for convenience с 15 днями; клиент должен дать 60 дней + liquidated damages. Влияние: стоимость выхода непропорциональна. Рекомендация: паритет по notice и damages, либо принять + заложить в цену.' }
      ],
      sec4_title: 'Диапазон риска.',
      sec4_lead: 'Диапазон, не точка. Низ — флаги адресованы; верх — подпись as-is.',
      band: [
        { l: 'Низкорисковый исход (флаги решены)', v: 'Приемлемо', n: 'Подпись с тремя решёнными флагами' },
        { l: 'Высокорисковый исход (as-is)', v: 'Избегать', n: 'Auto-renewal + асимметрия + неограниченный эскалятор' },
        { l: 'Затраты на переговоры', v: '[REDACTED] ч', n: 'Время клиента; ответ контрагента варьируется' },
        { l: 'Стоимость подписи as-is', v: '[REDACTED] за срок', n: 'Модельно, без гарантии — средняя инфляция и полный срок' }
      ],
      band_note_t: 'Допущения',
      band_note_b: 'Модель построена на текущем CPI и исторической практике контрагента, где видно. Провал любого допущения сдвигает диапазон к high-risk.',
      sec5_title: 'Рекомендуемая последовательность.',
      sec5_lead: 'Рекомендуемый порядок действий для частного клиента.',
      milestones: [
        { l: 'День 1', t: 'Запросить redline по трём флагам', b: 'Отправить рекомендованные правки по email с track changes. Звонка пока нет.' },
        { l: 'День 2–3', t: 'Ревью ответа контрагента', b: 'Сравнить redline контрагента с рекомендацией. Существенный пушбек по Флагу 3.3 — пауза.' },
        { l: 'День 4–7', t: 'Решение «подписать или уйти»', b: 'Все три флага приемлемо решены — подпись. Флаг 3.3 не решён — уйти или переторговать цену.' }
      ],
      sec6_title: 'Вне scope.',
      sec6_lead: 'Contract review узок по дизайну.',
      sec6_bullets: [
        'Это не юридический совет. Конкретная стратегия требует лицензированного адвоката.',
        'Никакого представительства или переговоров от имени клиента — коммуникацию ведёт клиент.',
        'Без ревью приложений, если не оформлено как Tier 3 add-on.',
        'Без налогового или бухгалтерского анализа.',
        'Без гарантии, что контрагент примет любой рекомендованный redline.'
      ],
      cta_h: 'Нужен ваш собственный contract review?',
      cta_p: 'Стандартный $149 возвращается за 48 часов. Сложные или мультисторонние соглашения — Tier 2 ($219) или Tier 3 advisory (от $349).',
      cta_primary: 'Заказать contract review',
      cta_secondary: 'Тарифы и условия'
    }),
    es: _mkContent({
      eyebrow: 'Muestra redactada · cliente privado · sin formulario',
      h1: 'Contract Risk Flag Memo — los 10 items que leemos antes de firmar.',
      lead: 'Esta replica redactada muestra como VitaCoreX marca riesgo en un acuerdo de servicios estandar para un cliente privado. Alcance, rubrica y formato de flags son identicos al entregable vivo de $149.',
      engagement: '$149 Contract Review — turnaround 48 horas',
      client_note: 'Cliente privado, acuerdo de servicios retail',
      distribution: 'Cliente (directo) · Sin copia a contraparte',
      toc: ['Lectura top-line', 'Rubrica de 10 puntos', 'Items marcados', 'Banda de riesgo', 'Secuencia sugerida', 'Fuera de alcance'],
      sec1_title: 'Lectura top-line.',
      sec1_lead: 'Tres observaciones accionables hoy.',
      sec1_bullets: [
        'Tres flags de alto riesgo; ninguno es deal-breaker por si solo, pero uno es firmar-o-retirarse.',
        'La mayoria de fees estan itemizados; una linea bundled "administrative" requiere desglose antes de firmar.',
        'La clausula de terminacion es asimetrica — negociar o ponerle precio.'
      ],
      sec2_title: 'Rubrica de 10 puntos.',
      sec2_lead: 'Cada contract review corre contra los mismos 10 items. Los flags marcan call-out; los passes no aparecen en el memo vivo.',
      sec2_bullets: [
        '1. Partes — nombres legales y roles coinciden con la entidad operativa.',
        '2. Plazo — inicio, fin y renovacion definidos.',
        '3. Fees — todas las lineas nombradas; nada bundled "other".',
        '4. Alcance — entregables descritos, no solo "services".',
        '5. Terminacion — for-cause y for-convenience abordadas.',
        '6. Disciplina de late-fee — respeta caps statutorios de FL donde aplica.',
        '7. Cap de responsabilidad — presente, mutuo, no abierto.',
        '8. Indemnizacion — mutua o unilateral, marcada.',
        '9. Foro — venue y ley aplicable nombrados.',
        '10. Arbitraje / class waiver — presencia e implicaciones divulgadas.'
      ],
      sec3_title: 'Items marcados.',
      sec3_lead: 'Cada flag: Observacion → Impacto → Recomendacion.',
      findings: [
        { t: 'Flag 3.1 — Lenguaje de renovacion', b: 'Observacion: renovacion automatica con ventana de 30 dias cae en medio del periodo festivo. Impacto: riesgo de renovacion silenciosa a tarifa elevada. Recomendacion: extender ventana a 60 dias o calendar alert; no firmar as-is.' },
        { t: 'Flag 3.2 — Escalador de fees', b: 'Observacion: escalador atado a CPI-U con floor [REDACTED]%. Impacto: aumento real puede superar inflacion. Recomendacion: negociar cap o pasar a escalador fijo.' },
        { t: 'Flag 3.3 — Asimetria en terminacion', b: 'Observacion: la contraparte puede terminar por conveniencia con 15 dias; el cliente debe dar 60 dias + pagar danos liquidados. Impacto: costo de salida desproporcionado. Recomendacion: paridad en notice y danos, o aceptar y poner precio.' }
      ],
      sec4_title: 'Banda de riesgo.',
      sec4_lead: 'Rango, no punto. Bajo asume flags resueltos; alto asume firma as-is.',
      band: [
        { l: 'Bajo riesgo (flags resueltos)', v: 'Aceptable', n: 'Firma con los tres flags negociados' },
        { l: 'Alto riesgo (firma as-is)', v: 'Evitar', n: 'Auto-renovacion + terminacion asimetrica + escalador sin tope' },
        { l: 'Costo de negociar', v: '[REDACTED] hrs', n: 'Tiempo del cliente; respuesta de contraparte varia' },
        { l: 'Costo de firmar as-is', v: '[REDACTED] en el plazo', n: 'Modelado, no garantizado — asume inflacion media y plazo completo' }
      ],
      band_note_t: 'Supuestos',
      band_note_b: 'Modelo basado en CPI actual y comportamiento historico visible de la contraparte. Cada fallo de supuesto estrecha la banda al extremo alto.',
      sec5_title: 'Secuencia sugerida.',
      sec5_lead: 'Orden recomendado para el cliente privado.',
      milestones: [
        { l: 'Dia 1', t: 'Pedir redline sobre los tres flags', b: 'Enviar ediciones recomendadas por email con track changes. Aun sin llamada.' },
        { l: 'Dia 2–3', t: 'Revision de respuesta de contraparte', b: 'Comparar redline de contraparte contra la recomendacion. Pushback sustantivo en Flag 3.3 → pausa.' },
        { l: 'Dia 4–7', t: 'Decision firmar o retirarse', b: 'Si los tres flags quedan resueltos aceptablemente, firmar. Si Flag 3.3 no se resuelve, retirarse o reprecaliar.' }
      ],
      sec6_title: 'Fuera de alcance.',
      sec6_lead: 'Un contract review es estrecho por diseno.',
      sec6_bullets: [
        'Esto no es asesoria juridica. Estrategia legal especifica requiere abogado licenciado.',
        'Sin representacion ni negociacion en nombre del cliente — el cliente maneja la comunicacion.',
        'Sin revision de anexos salvo que se contrate como Tier 3 add-on.',
        'Sin analisis fiscal o contable.',
        'Sin garantia de que la contraparte acepte ningun redline recomendado.'
      ],
      cta_h: 'Listo para revisar tu propio contrato?',
      cta_p: 'Contract review estandar $149 devuelve en 48 horas. Acuerdos complejos o multi-parte pasan a Tier 2 ($219) o advisory Tier 3 (desde $349).',
      cta_primary: 'Ordenar contract review',
      cta_secondary: 'Ver tarifas y niveles'
    })
  };
}

function _small_claims() {
  return _tri_content({
    en: {
      eyebrow: 'Sample deliverable · Redacted · Shared · Ungated',
      h1: 'Small Claims Chronology — a clean day-by-day timeline for a Florida matter.',
      lead: 'This redacted chronology shows how VitaCoreX organizes a small-claims matter in a document a clerk, magistrate, or outside counsel can read end-to-end without research. Dates, amounts, and party names are replaced with marked redactions.',
      engagement: 'Small Claims Documentation — Florida',
      client_note: 'Commercial services dispute, Hillsborough County',
      distribution: 'Client · Outside counsel copy on request',
      toc: ['Case summary', 'Documentation rubric', 'Day-by-day chronology', 'Evidence index', 'Suggested filings + timing', 'Out of scope'],
      sec1_title: 'Case summary.',
      sec1_lead: 'Four observations frame the chronology that follows.',
      sec1_bullets: [
        'Matter: non-payment on a completed services engagement; amount claimed $[REDACTED] + FL statutory interest.',
        'Venue: Hillsborough County Small Claims ($[REDACTED] threshold respected).',
        'Core issue: counterparty acknowledges the work but contests timing of the late-fee trigger.',
        'Procedural posture: pre-filing; demand letter delivered on day [REDACTED]; client retained VitaCoreX for chronology + evidence index on day [REDACTED].'
      ],
      sec2_title: 'Documentation rubric.',
      sec2_lead: 'Every small-claims chronology VitaCoreX produces follows these rules so counsel can pick it up without rework.',
      sec2_bullets: [
        'One event per row — no compound "A and then B" entries.',
        'Date in ISO format, time zone marked.',
        'Actor named (party or third party), not "they".',
        'Document attached or pointer to exhibit list.',
        'Contested facts marked [CONTESTED] with counterparty\u2019s stated position.',
        'Legal characterization excluded — this is a fact chronology, not argument.'
      ],
      sec3_title: 'Day-by-day chronology.',
      sec3_lead: 'Representative window (redacted). Live version includes every date end-to-end.',
      findings: [
        { t: '[REDACTED-01] — Engagement letter signed', b: 'Actor: both parties. Document: Exhibit A. Amount: $[REDACTED]. Delivery terms defined.' },
        { t: '[REDACTED-02] — Milestone 1 delivered', b: 'Actor: VitaCoreX\u2019s client (provider). Document: Exhibit B. Accepted in writing by counterparty same day — Exhibit B-1.' },
        { t: '[REDACTED-03] — Invoice issued', b: 'Actor: provider. Document: Exhibit C. Net-30 terms per contract.' },
        { t: '[REDACTED-04] — Follow-up email', b: 'Actor: provider. Document: Exhibit D. No response from counterparty.' },
        { t: '[REDACTED-05] — Late-fee trigger', b: 'Actor: provider. Document: Exhibit E. [CONTESTED]: counterparty claims trigger date was [REDACTED], not [REDACTED].' },
        { t: '[REDACTED-06] — Formal demand letter', b: 'Actor: provider counsel. Document: Exhibit F with delivery confirmation Exhibit F-1.' }
      ],
      sec4_title: 'Evidence index.',
      sec4_lead: 'Packaged alongside the chronology. Each exhibit numbered, dated, source-attributed.',
      band: [
        { l: 'Exhibits total', v: '[REDACTED]', n: 'Each cross-referenced in the chronology' },
        { l: 'Pages total', v: '[REDACTED]', n: 'Sequentially numbered, bates-style' },
        { l: 'Authentication method', v: 'Source-attested', n: 'Each exhibit sourced to email, filing, or signed document' },
        { l: 'Contested items', v: '[REDACTED]', n: 'Counterparty position captured alongside' }
      ],
      band_note_t: 'How the packet is used',
      band_note_b: 'Counsel or the client takes this packet directly into filing preparation. It does not substitute for filing, service, or argument — it de-risks those steps by providing the factual spine.',
      sec5_title: 'Suggested filings + timing.',
      sec5_lead: 'Sequencing assumes demand period has expired.',
      milestones: [
        { l: 'Days 1–5', t: 'Packet review + filing decision', b: 'Client or counsel reviews chronology. Decision: file Statement of Claim or withdraw. Packet supports either path.' },
        { l: 'Days 6–20', t: 'Filing + service', b: 'If filing proceeds: Statement of Claim + exhibits; service per FL rule. Chronology and evidence index attach.' },
        { l: 'Days 21–70', t: 'Pretrial conference window', b: 'FL small-claims schedules pretrial quickly. Chronology prepares the client for the pretrial without a lawyer if they choose.' }
      ],
      sec6_title: 'Out of scope.',
      sec6_lead: 'Documentation is a shape, not a verdict.',
      sec6_bullets: [
        'Not legal representation or legal advice. The client files, serves, and argues; VitaCoreX does not.',
        'No judgment on merits — chronologies are factual, not argumentative.',
        'No service of process by VitaCoreX. Any service follows FL rules of civil procedure.',
        'No warranty of any outcome. Small-claims outcomes depend on judge, evidence, and counterparty conduct.',
        'No counseling on settlement ranges. If settlement discussions arise, client consults their own attorney.',
        'No collection activity. If a judgment is obtained, enforcement is a separate step with its own rules.'
      ],
      cta_h: 'Need a chronology for your own matter?',
      cta_p: 'Florida small-claims documentation is our fixed-fee product. B2B clients use the same format for commercial demands at $110/hr + 2-hr minimum for hearing attendance.',
      cta_primary: 'See Florida Small Claims Help',
      cta_secondary: 'B2B Small Claims & Civil Packet Desk'
    },
    ru: {
      eyebrow: 'Пример deliverable · отредактирован · shared · без формы',
      h1: 'Small Claims Chronology — чистая хронология дня за днём по делу во Флориде.',
      lead: 'Эта отредактированная хронология показывает, как VitaCoreX организует small-claims дело в документ, который клерк, magistrate или внешний адвокат может прочитать end-to-end без ресёрча.',
      engagement: 'Small Claims Documentation — Флорида',
      client_note: 'Коммерческий сервисный спор, Hillsborough County',
      distribution: 'Клиент · Копия внешнему адвокату по запросу',
      toc: ['Саммари дела', 'Рубрика документации', 'Хронология день за днём', 'Index доказательств', 'Предлагаемые filings + тайминг', 'Вне scope'],
      sec1_title: 'Саммари дела.',
      sec1_lead: 'Четыре наблюдения оформляют хронологию ниже.',
      sec1_bullets: [
        'Дело: неплатёж по завершённому service-engagement; заявлено $[REDACTED] + FL statutory interest.',
        'Venue: Hillsborough County Small Claims (порог $[REDACTED] соблюдён).',
        'Ключевой вопрос: контрагент признаёт работу, но оспаривает дату триггера late-fee.',
        'Процессуальная посадка: pre-filing; demand letter доставлен в день [REDACTED]; клиент нанял VitaCoreX на chronology + index в день [REDACTED].'
      ],
      sec2_title: 'Рубрика документации.',
      sec2_lead: 'Каждая small-claims хронология следует этим правилам, чтобы адвокат мог подхватить без переделки.',
      sec2_bullets: [
        'Одно событие на строку — никаких compound "A и затем B".',
        'Дата в ISO, таймзона помечена.',
        'Актор назван (сторона или третье лицо), не "они".',
        'Документ приложен или указан указатель на список exhibits.',
        'Оспариваемые факты помечены [CONTESTED] с заявленной позицией контрагента.',
        'Правовая характеристика исключена — это фактическая хронология, не аргумент.'
      ],
      sec3_title: 'Хронология день за днём.',
      sec3_lead: 'Представительное окно (отредактировано). Live-версия содержит все даты end-to-end.',
      findings: [
        { t: '[REDACTED-01] — engagement letter подписан', b: 'Актор: обе стороны. Документ: Exhibit A. Сумма: $[REDACTED]. Условия доставки определены.' },
        { t: '[REDACTED-02] — Milestone 1 доставлен', b: 'Актор: клиент VitaCoreX (provider). Документ: Exhibit B. Принято письменно контрагентом в тот же день — Exhibit B-1.' },
        { t: '[REDACTED-03] — Инвойс выставлен', b: 'Актор: provider. Документ: Exhibit C. Net-30 по контракту.' },
        { t: '[REDACTED-04] — Follow-up email', b: 'Актор: provider. Документ: Exhibit D. Ответа от контрагента нет.' },
        { t: '[REDACTED-05] — Late-fee триггер', b: 'Актор: provider. Документ: Exhibit E. [CONTESTED]: контрагент утверждает, что дата триггера [REDACTED], а не [REDACTED].' },
        { t: '[REDACTED-06] — Формальный demand letter', b: 'Актор: provider counsel. Документ: Exhibit F с подтверждением доставки Exhibit F-1.' }
      ],
      sec4_title: 'Index доказательств.',
      sec4_lead: 'Упаковывается вместе с хронологией. Каждый exhibit пронумерован, датирован, атрибутирован по источнику.',
      band: [
        { l: 'Всего exhibits', v: '[REDACTED]', n: 'Каждый cross-referenced в хронологии' },
        { l: 'Всего страниц', v: '[REDACTED]', n: 'Последовательно пронумеровано, bates-style' },
        { l: 'Метод аутентификации', v: 'Source-attested', n: 'Каждый exhibit привязан к email, filing или подписанному документу' },
        { l: 'Оспариваемые пункты', v: '[REDACTED]', n: 'Позиция контрагента captured рядом' }
      ],
      band_note_t: 'Как используется пакет',
      band_note_b: 'Адвокат или клиент берёт пакет напрямую в подготовку filing. Он не заменяет filing, service или аргумент — он де-рискует эти шаги, предоставляя фактический позвоночник.',
      sec5_title: 'Предлагаемые filings + тайминг.',
      sec5_lead: 'Последовательность предполагает истечение demand-периода.',
      milestones: [
        { l: 'Дни 1–5', t: 'Обзор пакета + решение о filing', b: 'Клиент или адвокат обзревает хронологию. Решение: подавать Statement of Claim или отозвать. Пакет поддерживает оба пути.' },
        { l: 'Дни 6–20', t: 'Filing + service', b: 'Если filing идёт: Statement of Claim + exhibits; service по FL rule. Хронология и index прилагаются.' },
        { l: 'Дни 21–70', t: 'Окно pretrial conference', b: 'FL small-claims быстро ставит pretrial. Хронология готовит клиента к pretrial без адвоката, если он так решит.' }
      ],
      sec6_title: 'Вне scope.',
      sec6_lead: 'Документация — форма, не вердикт.',
      sec6_bullets: [
        'Не юридическое представительство и не юридический совет. Клиент подаёт, обслуживает, аргументирует; VitaCoreX — нет.',
        'Без суждения о merits — хронологии фактические, не аргументативные.',
        'Без service of process со стороны VitaCoreX. Любой service по FL правилам civil procedure.',
        'Без гарантии результата. Результат small-claims зависит от судьи, доказательств и поведения контрагента.',
        'Без consulting по settlement-диапазонам. Settlement-обсуждения — с своим адвокатом.',
        'Без collection-деятельности. Если получено решение, enforcement — отдельный шаг со своими правилами.'
      ],
      cta_h: 'Нужна хронология для вашего дела?',
      cta_p: 'Florida small-claims documentation — наш фикс-прайс продукт. B2B-клиенты используют тот же формат для коммерческих demand по $110/час + 2-часовой минимум за hearing attendance.',
      cta_primary: 'Florida Small Claims Help',
      cta_secondary: 'B2B Small Claims & Civil Packet Desk'
    },
    es: {
      eyebrow: 'Muestra redactada · compartida · sin formulario',
      h1: 'Small Claims Chronology — linea de tiempo dia-a-dia para un caso en Florida.',
      lead: 'Esta cronologia redactada muestra como VitaCoreX organiza un caso de small claims en un documento que un secretario, magistrado o asesor externo puede leer de cabo a rabo sin investigar.',
      engagement: 'Small Claims Documentation — Florida',
      client_note: 'Disputa de servicios comerciales, Hillsborough County',
      distribution: 'Cliente · Copia a asesor externo bajo pedido',
      toc: ['Resumen del caso', 'Rubrica documental', 'Cronologia dia-a-dia', 'Indice de evidencia', 'Presentaciones sugeridas + timing', 'Fuera de alcance'],
      sec1_title: 'Resumen del caso.',
      sec1_lead: 'Cuatro observaciones enmarcan la cronologia.',
      sec1_bullets: [
        'Asunto: no-pago por engagement de servicios completado; monto reclamado $[REDACTED] + interes estatutario FL.',
        'Venue: Hillsborough County Small Claims (umbral $[REDACTED] respetado).',
        'Punto central: la contraparte reconoce el trabajo pero discute la fecha de gatillo del late-fee.',
        'Postura procesal: pre-filing; demand letter entregada en dia [REDACTED]; el cliente contrato a VitaCoreX para cronologia e indice en dia [REDACTED].'
      ],
      sec2_title: 'Rubrica documental.',
      sec2_lead: 'Cada cronologia de small claims sigue estas reglas para que el asesor pueda retomarla sin rehacer.',
      sec2_bullets: [
        'Un evento por fila — sin entradas compuestas "A y luego B".',
        'Fecha en ISO, zona horaria marcada.',
        'Actor nombrado (parte o tercero), no "ellos".',
        'Documento adjunto o puntero a la lista de exhibits.',
        'Hechos controvertidos marcados [CONTESTED] con la posicion declarada por la contraparte.',
        'Caracterizacion legal excluida — esto es cronologia factica, no argumento.'
      ],
      sec3_title: 'Cronologia dia-a-dia.',
      sec3_lead: 'Ventana representativa (redactada). La version viva incluye todas las fechas.',
      findings: [
        { t: '[REDACTED-01] — engagement letter firmada', b: 'Actor: ambas partes. Documento: Exhibit A. Monto: $[REDACTED]. Terminos de entrega definidos.' },
        { t: '[REDACTED-02] — Milestone 1 entregado', b: 'Actor: cliente de VitaCoreX (prestador). Documento: Exhibit B. Aceptado por escrito por contraparte ese mismo dia — Exhibit B-1.' },
        { t: '[REDACTED-03] — Factura emitida', b: 'Actor: prestador. Documento: Exhibit C. Terminos Net-30 por contrato.' },
        { t: '[REDACTED-04] — Correo de seguimiento', b: 'Actor: prestador. Documento: Exhibit D. Sin respuesta de contraparte.' },
        { t: '[REDACTED-05] — Gatillo de late-fee', b: 'Actor: prestador. Documento: Exhibit E. [CONTESTED]: contraparte afirma que la fecha de gatillo fue [REDACTED], no [REDACTED].' },
        { t: '[REDACTED-06] — Demand letter formal', b: 'Actor: asesor del prestador. Documento: Exhibit F con confirmacion de entrega Exhibit F-1.' }
      ],
      sec4_title: 'Indice de evidencia.',
      sec4_lead: 'Empaquetado junto con la cronologia. Cada exhibit numerado, fechado, atribuido a fuente.',
      band: [
        { l: 'Exhibits totales', v: '[REDACTED]', n: 'Cada uno cross-referenciado en la cronologia' },
        { l: 'Paginas totales', v: '[REDACTED]', n: 'Numeradas secuencialmente estilo bates' },
        { l: 'Metodo de autenticacion', v: 'Source-attested', n: 'Cada exhibit asignado a email, filing o documento firmado' },
        { l: 'Items controvertidos', v: '[REDACTED]', n: 'Posicion de contraparte capturada al lado' }
      ],
      band_note_t: 'Como se usa el paquete',
      band_note_b: 'Asesor o cliente toma el paquete directo a preparacion de filing. No sustituye filing, service ni argumento — reduce riesgo de esos pasos entregando el espinazo factico.',
      sec5_title: 'Presentaciones sugeridas + timing.',
      sec5_lead: 'Secuencia asume que el periodo de demand expiro.',
      milestones: [
        { l: 'Dias 1–5', t: 'Revision de paquete + decision de filing', b: 'Cliente o asesor revisa la cronologia. Decision: presentar Statement of Claim o retirarse. El paquete apoya cualquiera.' },
        { l: 'Dias 6–20', t: 'Filing + service', b: 'Si el filing avanza: Statement of Claim + exhibits; service por la regla FL. Cronologia e indice se adjuntan.' },
        { l: 'Dias 21–70', t: 'Ventana de conferencia pretrial', b: 'FL small-claims agenda pretrial rapido. La cronologia prepara al cliente para el pretrial sin abogado si asi elige.' }
      ],
      sec6_title: 'Fuera de alcance.',
      sec6_lead: 'La documentacion es forma, no veredicto.',
      sec6_bullets: [
        'No es representacion legal ni asesoria juridica. El cliente presenta, sirve y argumenta; VitaCoreX no.',
        'Sin juicio sobre meritos — las cronologias son facticas, no argumentativas.',
        'Sin service of process por VitaCoreX. Cualquier service sigue las reglas FL de procedimiento civil.',
        'Sin garantia de resultado. Los resultados dependen de juez, evidencia y conducta de contraparte.',
        'Sin asesoria sobre rangos de acuerdo. Discusiones de settlement las ve el abogado propio.',
        'Sin actividad de cobranza. Si se obtiene sentencia, el enforcement es un paso separado con sus reglas.'
      ],
      cta_h: 'Necesita una cronologia para su caso?',
      cta_p: 'Florida small-claims documentation es nuestro producto de tarifa fija. Clientes B2B usan el mismo formato para demandas comerciales a $110/hr + minimo de 2 hrs por asistencia a audiencia.',
      cta_primary: 'Ver Florida Small Claims Help',
      cta_secondary: 'B2B Small Claims & Civil Packet Desk'
    }
  });
}

function _immigration_index() {
  return _tri_content({
    en: {
      eyebrow: 'Sample deliverable · Redacted · B2C · Ungated',
      h1: 'Immigration Evidence Index — how a packet is organized for a clean filing.',
      lead: 'This redacted replica shows the evidence index that accompanies an immigration packet. Exhibit list, page map, categorization against the form\u2019s required-evidence schedule. This is not legal advice and not form selection — it is documentation structure.',
      engagement: 'Immigration Packet Review — Tier 2 ($219)',
      client_note: 'Private client, I-130 family-based matter',
      distribution: 'Client (direct) · Attorney copy if client names one',
      toc: ['What an index does', 'Required-evidence schedule', 'Exhibit list + page map', 'Categorization coverage', 'Handoff readiness', 'Out of scope'],
      sec1_title: 'What an index does.',
      sec1_lead: 'Four observations about why an evidence index is the first thing an attorney or adjudicator wants to see.',
      sec1_bullets: [
        'An index lets the reader locate any required item in under 15 seconds instead of flipping through a stack.',
        'It forces the packet preparer to notice gaps before submission — the categorization step surfaces missing evidence categories.',
        'It gives attorneys a clean starting point if the client chooses representation after the packet is assembled.',
        'It does not constitute legal advice or form selection — that stays with the client or their attorney.'
      ],
      sec2_title: 'Required-evidence schedule.',
      sec2_lead: 'Every form type publishes a required-evidence schedule. The index mirrors that schedule so categorization is explicit.',
      sec2_bullets: [
        '1. Petitioner identity + status evidence.',
        '2. Beneficiary identity + civil-status evidence.',
        '3. Relationship evidence (bona fide).',
        '4. Prior filings and outcomes (if any).',
        '5. Employment and address history (as required by form type).',
        '6. Translations — certified, per 8 CFR 103.2(b)(3) standard of accuracy.',
        '7. Payment receipts (fees + biometrics where applicable).',
        '8. Supporting declarations with signature dates.'
      ],
      sec3_title: 'Exhibit list + page map.',
      sec3_lead: 'Representative window. Live version lists every exhibit sequentially.',
      findings: [
        { t: 'Exhibit A — Petitioner birth certificate', b: 'Source: state-issued, certified. Pages: [REDACTED]–[REDACTED]. Translation: not required (English-language state).' },
        { t: 'Exhibit B — Beneficiary passport + identity page', b: 'Source: national government issued. Pages: [REDACTED]–[REDACTED]. Translation: included at Exhibit B-T, certified.' },
        { t: 'Exhibit C — Marriage certificate', b: 'Source: jurisdiction-issued. Pages: [REDACTED]. Translation: included at Exhibit C-T. Apostille: attached at Exhibit C-A.' },
        { t: 'Exhibit D — Joint financial records', b: 'Source: bank. Pages: [REDACTED]–[REDACTED]. Coverage: [REDACTED] months trailing.' },
        { t: 'Exhibit E — Joint lease + utility records', b: 'Source: lessor + utility. Pages: [REDACTED]. Coverage: current + prior lease term.' },
        { t: 'Exhibit F — Photographs with event context', b: 'Source: client. Pages: [REDACTED]. Labels: date + location + participants stated.' }
      ],
      sec4_title: 'Categorization coverage.',
      sec4_lead: 'Range-framed view of how complete the packet is against the required-evidence schedule.',
      band: [
        { l: 'Required categories covered', v: '[REDACTED]/8', n: 'Against the form-type schedule' },
        { l: 'Gaps flagged for client action', v: '[REDACTED]', n: 'Each gap ties to a schedule item' },
        { l: 'Translations certified', v: 'Yes', n: 'Per 8 CFR 103.2(b)(3)' },
        { l: 'Originals retained by client', v: 'Yes', n: 'Copies submitted; originals not mailed' }
      ],
      band_note_t: 'What "coverage" does and does not mean',
      band_note_b: 'Full coverage of the schedule does not mean the matter succeeds. Adjudication decisions depend on legal factors VitaCoreX does not evaluate. Coverage means the packet is complete against the published schedule.',
      sec5_title: 'Handoff readiness.',
      sec5_lead: 'What the client receives so an attorney can pick up the matter without reassembly.',
      milestones: [
        { l: 'Immediate', t: 'Packet + index digital + printed', b: 'Indexed digital PDF with bookmarks + printed ring-bound copy. Client holds originals.' },
        { l: 'Within 48 hours', t: 'Gap checklist', b: 'If any schedule item is flagged, the client receives a short checklist with what to obtain and where.' },
        { l: 'On request', t: 'Attorney handoff letter', b: 'If the client names an attorney, a short handoff letter summarizing packet status is sent on request.' }
      ],
      sec6_title: 'Out of scope.',
      sec6_lead: 'Narrow by design.',
      sec6_bullets: [
        'Not legal advice, not form selection, not eligibility analysis.',
        'No representation before USCIS or any adjudicating body.',
        'No warranty of approval. Approval depends on legal factors VitaCoreX does not evaluate.',
        'No filing on the client\u2019s behalf. The client or their attorney submits.',
        'No counseling on strategy, timing, or choice of form.',
        'No handling of originals outside the review window.'
      ],
      cta_h: 'Ready to have your packet reviewed?',
      cta_p: 'Standard $149 covers single-form matters; Tier 2 ($219) covers matters requiring categorization across multiple exhibits; Tier 3 (from $649) covers complex or multi-form matters with RFE responses.',
      cta_primary: 'Order a packet review',
      cta_secondary: 'See tiers + pricing'
    },
    ru: {
      eyebrow: 'Пример deliverable · отредактирован · частный клиент · без формы',
      h1: 'Immigration Evidence Index — как организуется пакет для чистой подачи.',
      lead: 'Эта отредактированная копия показывает index доказательств, сопровождающий immigration-пакет. Список exhibits, карта страниц, категоризация по required-evidence schedule. Это не юридический совет и не form selection — это структура документации.',
      engagement: 'Immigration Packet Review — Tier 2 ($219)',
      client_note: 'Частный клиент, family-based I-130',
      distribution: 'Клиент (прямо) · копия адвокату, если клиент его указал',
      toc: ['Что делает index', 'Required-evidence schedule', 'Список exhibits + карта страниц', 'Coverage категоризации', 'Готовность к передаче', 'Вне scope'],
      sec1_title: 'Что делает index.',
      sec1_lead: 'Четыре наблюдения о том, почему evidence index — первое, что хочет видеть адвокат или adjudicator.',
      sec1_bullets: [
        'Index позволяет читающему найти любой требуемый пункт за <15 секунд вместо листания стопки.',
        'Он заставляет составителя пакета заметить пробелы до подачи — шаг категоризации выявляет отсутствующие категории доказательств.',
        'Он даёт адвокатам чистую отправную точку, если клиент выбирает представительство после сборки пакета.',
        'Он не является юридическим советом или form selection — это остаётся с клиентом или его адвокатом.'
      ],
      sec2_title: 'Required-evidence schedule.',
      sec2_lead: 'Каждый тип формы публикует required-evidence schedule. Index зеркалит этот schedule, чтобы категоризация была явной.',
      sec2_bullets: [
        '1. Доказательства идентичности и статуса petitioner.',
        '2. Доказательства идентичности и гражданского статуса beneficiary.',
        '3. Доказательства отношений (bona fide).',
        '4. Предыдущие filings и результаты (если есть).',
        '5. История занятости и адресов (по требованию типа формы).',
        '6. Переводы — certified, по 8 CFR 103.2(b)(3).',
        '7. Квитанции об оплате (fees + biometrics, где применимо).',
        '8. Поддерживающие декларации с датами подписи.'
      ],
      sec3_title: 'Список exhibits + карта страниц.',
      sec3_lead: 'Представительное окно. Live-версия перечисляет все exhibits последовательно.',
      findings: [
        { t: 'Exhibit A — Свидетельство о рождении petitioner', b: 'Источник: state-issued, certified. Страницы: [REDACTED]–[REDACTED]. Перевод: не требуется.' },
        { t: 'Exhibit B — Паспорт beneficiary + identity page', b: 'Источник: national government. Страницы: [REDACTED]–[REDACTED]. Перевод: Exhibit B-T, certified.' },
        { t: 'Exhibit C — Свидетельство о браке', b: 'Источник: jurisdiction-issued. Страницы: [REDACTED]. Перевод: Exhibit C-T. Apostille: Exhibit C-A.' },
        { t: 'Exhibit D — Совместные финансовые записи', b: 'Источник: банк. Страницы: [REDACTED]–[REDACTED]. Покрытие: [REDACTED] месяцев.' },
        { t: 'Exhibit E — Совместная аренда + коммунальные', b: 'Источник: арендодатель + utility. Страницы: [REDACTED]. Покрытие: текущий + предыдущий lease term.' },
        { t: 'Exhibit F — Фотографии с event-контекстом', b: 'Источник: клиент. Страницы: [REDACTED]. Подписи: дата + место + участники.' }
      ],
      sec4_title: 'Coverage категоризации.',
      sec4_lead: 'Диапазонный взгляд на то, насколько полон пакет относительно required-evidence schedule.',
      band: [
        { l: 'Покрыто категорий', v: '[REDACTED]/8', n: 'По schedule типа формы' },
        { l: 'Пробелы к действию клиента', v: '[REDACTED]', n: 'Каждый пробел привязан к пункту schedule' },
        { l: 'Переводы certified', v: 'Да', n: 'По 8 CFR 103.2(b)(3)' },
        { l: 'Оригиналы у клиента', v: 'Да', n: 'Сданы копии; оригиналы не высланы' }
      ],
      band_note_t: 'Что значит "coverage" и что не значит',
      band_note_b: 'Полное coverage schedule не означает, что дело увенчается успехом. Решения adjudication зависят от юридических факторов, которые VitaCoreX не оценивает. Coverage означает, что пакет полон относительно опубликованного schedule.',
      sec5_title: 'Готовность к передаче.',
      sec5_lead: 'Что получает клиент, чтобы адвокат мог подхватить без пересборки.',
      milestones: [
        { l: 'Немедленно', t: 'Пакет + index цифровой + печатный', b: 'Индексированный цифровой PDF с закладками + печатная копия. Оригиналы у клиента.' },
        { l: 'В течение 48 часов', t: 'Checklist пробелов', b: 'Если какие-то пункты schedule флагнуты, клиент получает короткий checklist, что получить и где.' },
        { l: 'По запросу', t: 'Письмо о передаче адвокату', b: 'Если клиент называет адвоката, короткое письмо с резюме статуса пакета отправляется по запросу.' }
      ],
      sec6_title: 'Вне scope.',
      sec6_lead: 'Узко по дизайну.',
      sec6_bullets: [
        'Не юридический совет, не form selection, не анализ eligibility.',
        'Никакого представительства перед USCIS или любым adjudicating body.',
        'Никакой гарантии approval. Approval зависит от юридических факторов, которые VitaCoreX не оценивает.',
        'Никаких filings от имени клиента. Подаёт клиент или его адвокат.',
        'Никаких консультаций по стратегии, срокам или выбору формы.',
        'Никакой работы с оригиналами вне окна ревью.'
      ],
      cta_h: 'Нужен обзор вашего пакета?',
      cta_p: 'Стандарт $149 покрывает single-form дела; Tier 2 ($219) — категоризацию по нескольким exhibits; Tier 3 (от $649) — сложные или multi-form дела с RFE-ответами.',
      cta_primary: 'Заказать packet review',
      cta_secondary: 'Тарифы'
    },
    es: {
      eyebrow: 'Muestra redactada · cliente privado · sin formulario',
      h1: 'Immigration Evidence Index — como se organiza un paquete para una presentacion limpia.',
      lead: 'Esta replica redactada muestra el indice de evidencia que acompana un paquete de inmigracion. Lista de exhibits, mapa de paginas, categorizacion contra el schedule de evidencia requerida.',
      engagement: 'Immigration Packet Review — Tier 2 ($219)',
      client_note: 'Cliente privado, asunto I-130 familiar',
      distribution: 'Cliente (directo) · Copia a abogado si el cliente lo designa',
      toc: ['Que hace un indice', 'Schedule de evidencia requerida', 'Lista de exhibits + mapa de paginas', 'Cobertura de categorizacion', 'Readiness de handoff', 'Fuera de alcance'],
      sec1_title: 'Que hace un indice.',
      sec1_lead: 'Cuatro observaciones sobre por que un indice de evidencia es lo primero que un abogado o adjudicador quiere ver.',
      sec1_bullets: [
        'Un indice permite al lector ubicar cualquier item requerido en menos de 15 segundos en vez de hojear una pila.',
        'Obliga al preparador a notar brechas antes de enviar — la categorizacion revela categorias faltantes.',
        'Da a los abogados un punto de partida limpio si el cliente elige representacion despues del armado.',
        'No constituye asesoria juridica ni eleccion de formulario — eso queda con el cliente o su abogado.'
      ],
      sec2_title: 'Schedule de evidencia requerida.',
      sec2_lead: 'Cada tipo de formulario publica un schedule. El indice lo refleja para que la categorizacion sea explicita.',
      sec2_bullets: [
        '1. Evidencia de identidad y estatus del peticionario.',
        '2. Evidencia de identidad y estatus civil del beneficiario.',
        '3. Evidencia de relacion (bona fide).',
        '4. Presentaciones previas y resultados (si los hay).',
        '5. Historial de empleo y domicilio (segun tipo de formulario).',
        '6. Traducciones — certificadas, por 8 CFR 103.2(b)(3).',
        '7. Recibos de pago (fees + biometrics donde aplica).',
        '8. Declaraciones de apoyo con fechas de firma.'
      ],
      sec3_title: 'Lista de exhibits + mapa de paginas.',
      sec3_lead: 'Ventana representativa. La version viva lista cada exhibit secuencialmente.',
      findings: [
        { t: 'Exhibit A — Acta de nacimiento del peticionario', b: 'Fuente: state-issued certificada. Paginas: [REDACTED]–[REDACTED]. Traduccion: no requerida.' },
        { t: 'Exhibit B — Pasaporte del beneficiario + hoja de identidad', b: 'Fuente: gobierno nacional. Paginas: [REDACTED]–[REDACTED]. Traduccion: Exhibit B-T certificada.' },
        { t: 'Exhibit C — Acta de matrimonio', b: 'Fuente: jurisdiccion emisora. Paginas: [REDACTED]. Traduccion: Exhibit C-T. Apostilla: Exhibit C-A.' },
        { t: 'Exhibit D — Registros financieros conjuntos', b: 'Fuente: banco. Paginas: [REDACTED]–[REDACTED]. Cobertura: [REDACTED] meses.' },
        { t: 'Exhibit E — Lease conjunto + utilities', b: 'Fuente: arrendador + utility. Paginas: [REDACTED]. Cobertura: plazo actual + anterior.' },
        { t: 'Exhibit F — Fotografias con contexto de evento', b: 'Fuente: cliente. Paginas: [REDACTED]. Etiquetas: fecha + lugar + participantes.' }
      ],
      sec4_title: 'Cobertura de categorizacion.',
      sec4_lead: 'Vista por rango de cuan completo esta el paquete contra el schedule.',
      band: [
        { l: 'Categorias cubiertas', v: '[REDACTED]/8', n: 'Contra el schedule del tipo de formulario' },
        { l: 'Brechas para accion del cliente', v: '[REDACTED]', n: 'Cada brecha se ata a un item del schedule' },
        { l: 'Traducciones certificadas', v: 'Si', n: 'Por 8 CFR 103.2(b)(3)' },
        { l: 'Originales retenidos por el cliente', v: 'Si', n: 'Copias enviadas; originales no se envian' }
      ],
      band_note_t: 'Que significa "cobertura" y que no',
      band_note_b: 'Cobertura total del schedule no significa que el asunto tenga exito. Las decisiones de adjudicacion dependen de factores legales que VitaCoreX no evalua. Cobertura significa que el paquete esta completo contra el schedule publicado.',
      sec5_title: 'Readiness de handoff.',
      sec5_lead: 'Que recibe el cliente para que un abogado pueda retomar sin rearmar.',
      milestones: [
        { l: 'Inmediato', t: 'Paquete + indice digital e impreso', b: 'PDF indexado con marcadores + copia impresa encuadernada. Originales quedan con el cliente.' },
        { l: 'En 48 horas', t: 'Checklist de brechas', b: 'Si algun item esta marcado, el cliente recibe un checklist corto con que obtener y donde.' },
        { l: 'Bajo pedido', t: 'Carta de handoff a abogado', b: 'Si el cliente nombra un abogado, se envia bajo pedido carta de resumen de estatus del paquete.' }
      ],
      sec6_title: 'Fuera de alcance.',
      sec6_lead: 'Estrecho por diseno.',
      sec6_bullets: [
        'No es asesoria juridica, no es eleccion de formulario, no es analisis de elegibilidad.',
        'Sin representacion ante USCIS ni ningun cuerpo adjudicador.',
        'Sin garantia de aprobacion. La aprobacion depende de factores legales que VitaCoreX no evalua.',
        'Sin presentacion en nombre del cliente. Presenta el cliente o su abogado.',
        'Sin asesoria sobre estrategia, timing o eleccion de formulario.',
        'Sin manejo de originales fuera de la ventana de revision.'
      ],
      cta_h: 'Listo para revisar tu paquete?',
      cta_p: 'Estandar $149 cubre asuntos de formulario unico; Tier 2 ($219) cubre asuntos con multiples exhibits; Tier 3 (desde $649) cubre asuntos complejos o multi-formulario con respuestas RFE.',
      cta_primary: 'Ordenar packet review',
      cta_secondary: 'Ver tarifas'
    }
  });
}

function _auto_deal() {
  return _tri_content({
    en: {
      eyebrow: 'Sample deliverable · Redacted · B2C · Ungated',
      h1: 'Auto Deal Cost Breakdown — what each line on the dealer sheet means.',
      lead: 'This redacted replica shows how VitaCoreX breaks down a dealer\u2019s out-the-door price so a private buyer sees what\u2019s negotiable, what\u2019s statutory, and what\u2019s an add-on dressed up as a fee.',
      engagement: '$149 Auto Deal Review — 48-hour turnaround',
      client_note: 'Private client, new-vehicle Florida purchase',
      distribution: 'Client (direct) · No copy to dealer',
      toc: ['Top-line read', 'Six-domain rubric', 'Line-by-line flags', 'Negotiable band', 'Suggested script', 'Out of scope'],
      sec1_title: 'Top-line read.',
      sec1_lead: 'Three observations on the out-the-door price.',
      sec1_bullets: [
        'Base + destination + tax + title are standard. Everything else is negotiable, optional, or both.',
        'Three add-ons flagged: extended warranty (negotiable), nitrogen tires (remove), dealer prep (often non-statutory).',
        'APR on proposed financing is [REDACTED]% above comparable credit-union rate — shop financing separately.'
      ],
      sec2_title: 'Six-domain rubric.',
      sec2_lead: 'Every review runs against the same six domains.',
      sec2_bullets: [
        '1. Statutory charges (tax, title, registration) — not negotiable, but must be accurate.',
        '2. Destination charge — manufacturer-set, not a dealer markup, but confirm it matches the sticker.',
        '3. Trade-in valuation — against market reference at time of deal.',
        '4. Financing terms — APR vs. comparable credit-union quote + term length.',
        '5. Add-ons — extended warranty, nitrogen tires, dealer prep, paint protection, etc.',
        '6. Out-the-door total — reconciled against base + each itemized line.'
      ],
      sec3_title: 'Line-by-line flags.',
      sec3_lead: 'Each flagged item: Observation → Impact → Recommendation.',
      findings: [
        { t: 'Flag 3.1 — Extended warranty', b: 'Observation: $[REDACTED] for [REDACTED] months/miles. Impact: similar coverage available directly from the manufacturer at $[REDACTED]. Recommendation: negotiate to parity or decline and buy direct later.' },
        { t: 'Flag 3.2 — Nitrogen tires', b: 'Observation: $[REDACTED] for nitrogen fill. Impact: marginal benefit vs. regular air. Recommendation: decline.' },
        { t: 'Flag 3.3 — Dealer prep', b: 'Observation: $[REDACTED] for "dealer prep". Impact: often not a FL-statutory charge; sometimes already covered by the manufacturer. Recommendation: ask for itemization and negotiate or decline.' },
        { t: 'Flag 3.4 — APR vs. comparable', b: 'Observation: proposed APR [REDACTED]% vs. credit-union quote [REDACTED]%. Impact: $[REDACTED] over term of loan. Recommendation: pre-approve financing with a credit union; use as leverage.' }
      ],
      sec4_title: 'Negotiable band.',
      sec4_lead: 'Range-framed view of what the deal could look like negotiated.',
      band: [
        { l: 'Dealer\u2019s out-the-door', v: '$[REDACTED]', n: 'As proposed' },
        { l: 'Negotiated low-band (all flags addressed)', v: '$[REDACTED]', n: 'Declines + financing shopped' },
        { l: 'Negotiated high-band (conservative)', v: '$[REDACTED]', n: 'Keeps some add-ons, ignores financing flag' },
        { l: 'Non-negotiable total', v: '$[REDACTED]', n: 'Statutory + manufacturer destination only' }
      ],
      band_note_t: 'What changes the band',
      band_note_b: 'Dealer response, end-of-month incentive timing, and whether the buyer walks in pre-approved are the three biggest movers. Add-on decline is the lowest-friction move.',
      sec5_title: 'Suggested script.',
      sec5_lead: 'Order of operations at the dealership.',
      milestones: [
        { l: 'Before the visit', t: 'Pre-approve financing', b: 'Get a written quote from a credit union at a comparable rate. Bring it.' },
        { l: 'At the dealer', t: 'Request itemization', b: 'Ask for a written breakdown of the out-the-door price. If anything is non-itemized, ask for itemization.' },
        { l: 'Negotiation', t: 'Decline add-ons first', b: 'Start by declining nitrogen and dealer prep. Then negotiate warranty or decline. Then address APR using the pre-approval.' }
      ],
      sec6_title: 'Out of scope.',
      sec6_lead: 'A review is a cost-clarity exercise, not a negotiation service.',
      sec6_bullets: [
        'VitaCoreX does not represent the buyer at the dealer or negotiate on their behalf.',
        'This is not legal advice. State-specific statutory questions remain with the client or counsel.',
        'No warranty that the dealer accepts any recommendation.',
        'No financing advice beyond APR comparison. Loan decisions belong to the client.',
        'No recommendation on which vehicle to buy — only on the terms of the one the client chose.',
        'No handling of the vehicle purchase itself.'
      ],
      cta_h: 'Ready to have your own deal reviewed?',
      cta_p: 'Standard $149 auto deal review returns in 48 hours. Same-day rush is $49. Tier 2 ($219) covers complex or multi-vehicle transactions.',
      cta_primary: 'Order an auto deal review',
      cta_secondary: 'See tiers + rush'
    },
    ru: {
      eyebrow: 'Пример deliverable · отредактирован · частный клиент · без формы',
      h1: 'Auto Deal Cost Breakdown — что значит каждая строка в предложении дилера.',
      lead: 'Эта отредактированная копия показывает, как VitaCoreX разбирает out-the-door цену дилера, чтобы частный покупатель видел, что договорно, что statutory, а что add-on, переодетый в fee.',
      engagement: '$149 Auto Deal Review — 48 часов',
      client_note: 'Частный клиент, покупка нового авто во Флориде',
      distribution: 'Клиент (прямо) · без копии дилеру',
      toc: ['Верхний уровень', 'Шесть доменов рубрики', 'Построчные флаги', 'Диапазон торга', 'Предлагаемый сценарий', 'Вне scope'],
      sec1_title: 'Верхний уровень.',
      sec1_lead: 'Три наблюдения по out-the-door цене.',
      sec1_bullets: [
        'База + destination + налог + title — стандарт. Остальное договорно, опционально или и то и другое.',
        'Три add-on флагнуто: extended warranty (договор), nitrogen tires (снять), dealer prep (часто не statutory).',
        'APR на предложенном финансировании выше comparable credit-union rate на [REDACTED]% — shop финансирование отдельно.'
      ],
      sec2_title: 'Шесть доменов рубрики.',
      sec2_lead: 'Каждый обзор проходит по одним и тем же шести доменам.',
      sec2_bullets: [
        '1. Statutory сборы (налог, title, регистрация) — не договорны, но должны быть точны.',
        '2. Destination — от производителя, не дилерская наценка, но сверить со стикером.',
        '3. Trade-in оценка — против market reference на момент сделки.',
        '4. Условия финансирования — APR vs. comparable credit-union + срок.',
        '5. Add-on — extended warranty, nitrogen tires, dealer prep, paint protection и т. д.',
        '6. Out-the-door тотал — согласован с базой + каждая itemized строка.'
      ],
      sec3_title: 'Построчные флаги.',
      sec3_lead: 'Каждый флаг: Наблюдение → Влияние → Рекомендация.',
      findings: [
        { t: 'Флаг 3.1 — Extended warranty', b: 'Наблюдение: $[REDACTED] за [REDACTED] месяцев/миль. Влияние: сходное покрытие доступно напрямую от производителя за $[REDACTED]. Рекомендация: договор или отказ + покупка напрямую позже.' },
        { t: 'Флаг 3.2 — Nitrogen tires', b: 'Наблюдение: $[REDACTED] за nitrogen. Влияние: предельная выгода vs. обычный воздух. Рекомендация: отказ.' },
        { t: 'Флаг 3.3 — Dealer prep', b: 'Наблюдение: $[REDACTED] за dealer prep. Влияние: часто не FL-statutory; иногда уже покрыто производителем. Рекомендация: itemization + договор или отказ.' },
        { t: 'Флаг 3.4 — APR vs. comparable', b: 'Наблюдение: предложенный APR [REDACTED]% vs. credit-union [REDACTED]%. Влияние: $[REDACTED] за срок кредита. Рекомендация: pre-approve в credit union; использовать как leverage.' }
      ],
      sec4_title: 'Диапазон торга.',
      sec4_lead: 'Диапазонный взгляд на возможную договорную сделку.',
      band: [
        { l: 'Out-the-door дилера', v: '$[REDACTED]', n: 'Как предложено' },
        { l: 'Низ диапазона (флаги решены)', v: '$[REDACTED]', n: 'Отказы + шоп финансирования' },
        { l: 'Верх диапазона (консервативный)', v: '$[REDACTED]', n: 'Часть add-on оставлены, флаг финансирования игнорирован' },
        { l: 'Неторгуемый тотал', v: '$[REDACTED]', n: 'Только statutory + destination' }
      ],
      band_note_t: 'Что двигает диапазон',
      band_note_b: 'Ответ дилера, end-of-month incentive и вошёл ли покупатель уже pre-approved — три самых больших рычага. Отказ от add-on — самый low-friction шаг.',
      sec5_title: 'Предлагаемый сценарий.',
      sec5_lead: 'Порядок действий в дилерском центре.',
      milestones: [
        { l: 'Перед визитом', t: 'Pre-approve финансирование', b: 'Получить письменную котировку в credit union по comparable ставке. Взять с собой.' },
        { l: 'У дилера', t: 'Запросить itemization', b: 'Спросить письменную разбивку out-the-door. Если что-то не itemized — itemization.' },
        { l: 'Переговоры', t: 'Начать с отказов от add-on', b: 'Сначала отказ от nitrogen и dealer prep. Потом warranty — договор или отказ. Потом APR через pre-approval.' }
      ],
      sec6_title: 'Вне scope.',
      sec6_lead: 'Обзор — упражнение по прозрачности цены, не сервис переговоров.',
      sec6_bullets: [
        'VitaCoreX не представляет покупателя у дилера и не ведёт переговоры от его имени.',
        'Это не юридический совет. State-specific statutory вопросы остаются с клиентом или counsel.',
        'Никакой гарантии, что дилер примет любую рекомендацию.',
        'Никаких финансовых советов кроме сравнения APR.',
        'Никаких рекомендаций по выбору авто — только по условиям выбранного.',
        'Никакого handling самой покупки.'
      ],
      cta_h: 'Нужен обзор вашей сделки?',
      cta_p: 'Стандартный $149 Auto Deal Review возвращается за 48 часов. Same-day rush — $49. Tier 2 ($219) — сложные или multi-vehicle.',
      cta_primary: 'Заказать auto deal review',
      cta_secondary: 'Тарифы + rush'
    },
    es: {
      eyebrow: 'Muestra redactada · cliente privado · sin formulario',
      h1: 'Auto Deal Cost Breakdown — que significa cada linea en la hoja del concesionario.',
      lead: 'Esta replica redactada muestra como VitaCoreX desglosa el precio out-the-door del concesionario para que un comprador privado vea que es negociable, que es statutorio y que es un add-on disfrazado de fee.',
      engagement: '$149 Auto Deal Review — turnaround 48 horas',
      client_note: 'Cliente privado, compra de vehiculo nuevo en Florida',
      distribution: 'Cliente (directo) · Sin copia al concesionario',
      toc: ['Lectura top-line', 'Rubrica de seis dominios', 'Flags linea a linea', 'Banda negociable', 'Guion sugerido', 'Fuera de alcance'],
      sec1_title: 'Lectura top-line.',
      sec1_lead: 'Tres observaciones sobre el precio out-the-door.',
      sec1_bullets: [
        'Base + destination + impuesto + title son estandar. Todo lo demas es negociable, opcional o ambas.',
        'Tres add-ons marcados: garantia extendida (negociable), llantas con nitrogeno (quitar), dealer prep (a menudo no statutorio).',
        'APR en el financiamiento propuesto es [REDACTED]% mas alto que tasa comparable de credit union — compara financiamiento por separado.'
      ],
      sec2_title: 'Rubrica de seis dominios.',
      sec2_lead: 'Cada revision corre contra los mismos seis dominios.',
      sec2_bullets: [
        '1. Cargos statutorios (impuesto, title, registro) — no negociables pero deben ser exactos.',
        '2. Destination — fijado por fabricante, no es markup del concesionario; confirma que coincide con el sticker.',
        '3. Valoracion de trade-in — contra referencia de mercado al momento.',
        '4. Terminos de financiamiento — APR vs. cotizacion comparable de credit union + plazo.',
        '5. Add-ons — garantia extendida, nitrogeno, dealer prep, proteccion de pintura, etc.',
        '6. Total out-the-door — reconciliado contra base + cada linea itemizada.'
      ],
      sec3_title: 'Flags linea a linea.',
      sec3_lead: 'Cada flag: Observacion → Impacto → Recomendacion.',
      findings: [
        { t: 'Flag 3.1 — Garantia extendida', b: 'Observacion: $[REDACTED] por [REDACTED] meses/millas. Impacto: cobertura similar disponible directo del fabricante por $[REDACTED]. Recomendacion: negociar a paridad o declinar y comprar directo despues.' },
        { t: 'Flag 3.2 — Llantas con nitrogeno', b: 'Observacion: $[REDACTED] por nitrogeno. Impacto: beneficio marginal vs. aire regular. Recomendacion: declinar.' },
        { t: 'Flag 3.3 — Dealer prep', b: 'Observacion: $[REDACTED] por "dealer prep". Impacto: a menudo no statutorio FL; a veces ya cubierto por fabricante. Recomendacion: pedir itemizacion y negociar o declinar.' },
        { t: 'Flag 3.4 — APR vs. comparable', b: 'Observacion: APR propuesto [REDACTED]% vs. credit union [REDACTED]%. Impacto: $[REDACTED] en el plazo del prestamo. Recomendacion: pre-aprueba financiamiento con credit union; usa como palanca.' }
      ],
      sec4_title: 'Banda negociable.',
      sec4_lead: 'Vista por rango de como podria quedar el trato negociado.',
      band: [
        { l: 'Out-the-door del concesionario', v: '$[REDACTED]', n: 'Como propuesto' },
        { l: 'Banda baja negociada (flags resueltos)', v: '$[REDACTED]', n: 'Declinaciones + financiamiento comparado' },
        { l: 'Banda alta negociada (conservadora)', v: '$[REDACTED]', n: 'Algunos add-ons se quedan, flag de financiamiento ignorado' },
        { l: 'Total no negociable', v: '$[REDACTED]', n: 'Solo statutorio + destination' }
      ],
      band_note_t: 'Que mueve la banda',
      band_note_b: 'Respuesta del concesionario, timing de incentivo fin-de-mes y si el comprador entra pre-aprobado son los tres mayores movedores. Declinar add-ons es el movimiento de menor friccion.',
      sec5_title: 'Guion sugerido.',
      sec5_lead: 'Orden de operaciones en el concesionario.',
      milestones: [
        { l: 'Antes de la visita', t: 'Pre-aprueba financiamiento', b: 'Consigue cotizacion escrita de credit union a tasa comparable. Llevala.' },
        { l: 'En el concesionario', t: 'Pide itemizacion', b: 'Pide desglose escrito del out-the-door. Si algo no esta itemizado, pide itemizacion.' },
        { l: 'Negociacion', t: 'Declina add-ons primero', b: 'Empieza declinando nitrogeno y dealer prep. Luego negocia o declina la garantia. Luego aborda APR usando la pre-aprobacion.' }
      ],
      sec6_title: 'Fuera de alcance.',
      sec6_lead: 'Una revision es ejercicio de claridad de costo, no servicio de negociacion.',
      sec6_bullets: [
        'VitaCoreX no representa al comprador en el concesionario ni negocia en su nombre.',
        'Esto no es asesoria juridica. Cuestiones statutorias estatales quedan con el cliente o counsel.',
        'Sin garantia de que el concesionario acepte ninguna recomendacion.',
        'Sin asesoria financiera mas alla de la comparacion de APR.',
        'Sin recomendacion sobre que vehiculo comprar — solo sobre los terminos del elegido.',
        'Sin manejo de la compra del vehiculo en si.'
      ],
      cta_h: 'Listo para revisar tu propio trato?',
      cta_p: 'Auto deal review estandar $149 devuelve en 48 horas. Rush mismo-dia $49. Tier 2 ($219) cubre transacciones complejas o multi-vehiculo.',
      cta_primary: 'Ordenar auto deal review',
      cta_secondary: 'Ver tarifas + rush'
    }
  });
}

/* Canonical content-maker (returns the full content object structure). */
function _mkContent(v) {
  return {
    eyebrow: v.eyebrow,
    h1: v.h1,
    lead: v.lead,
    side_t: v.side_t || 'Redaction standard',
    side_p: v.side_p || 'Client legal name, exact dollar amounts, site counts, personnel names, and dates within 90 days are replaced with [REDACTED]. Methodology, rubric, and recommendation framing are published verbatim.',
    meta_k1_l: 'Engagement', meta_k1_v: v.engagement || '[REDACTED]', meta_k1_n: v.client_note || '',
    meta_k2_l: 'Prepared by', meta_k2_v: 'VitaCoreX LLC', meta_k2_n: 'Lead: [REDACTED], Director',
    meta_k3_l: 'Distribution', meta_k3_v: v.distribution || 'Client (direct)', meta_k3_n: '',
    meta_k4_l: 'Version', meta_k4_v: '2026-04-19 · 1.0', meta_k4_n: 'Redacted replica — Not for operational use',
    toc_1: v.toc[0], toc_2: v.toc[1], toc_3: v.toc[2], toc_4: v.toc[3], toc_5: v.toc[4], toc_6: v.toc[5],
    s1_e: 'Section 1', s1_h: v.sec1_title, s1_p: v.sec1_lead,
    s1_li1: v.sec1_bullets[0] || '', s1_li2: v.sec1_bullets[1] || '', s1_li3: v.sec1_bullets[2] || '',
    s1_li4: v.sec1_bullets[3] || '', s1_li5: v.sec1_bullets[4] || '',
    s2_e: 'Section 2', s2_h: v.sec2_title, s2_p: v.sec2_lead,
    s2_list: v.sec2_bullets,
    s3_e: 'Section 3', s3_h: v.sec3_title, s3_p: v.sec3_lead,
    findings: v.findings,
    s4_e: 'Section 4', s4_h: v.sec4_title, s4_p: v.sec4_lead,
    band: v.band,
    band_note_t: v.band_note_t, band_note_b: v.band_note_b,
    s5_e: 'Section 5', s5_h: v.sec5_title, s5_p: v.sec5_lead,
    milestones: v.milestones,
    s6_e: 'Section 6', s6_h: v.sec6_title, s6_p: v.sec6_lead,
    s6_list: v.sec6_bullets,
    cta_h: v.cta_h, cta_p: v.cta_p,
    cta_primary: v.cta_primary, cta_secondary: v.cta_secondary,
    disclaimer: v.disclaimer || 'VitaCoreX LLC is not a law firm and does not provide legal representation. This sample is a redacted replica of a deliverable produced under a prior engagement. It is not an offer of service, not legal advice, not a recommendation about any specific matter, and not a warranty of any particular outcome. Any engagement is governed by a separate written Statement of Work. Legal strategy remains the responsibility of licensed counsel.'
  };
}

function _tri_content(obj) {
  return {
    en: _mkContent(obj.en),
    ru: _mkContent(obj.ru),
    es: _mkContent(obj.es)
  };
}

/* ── HTML template ──────────────────────────────────────────────────────── */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Normalize a single-lang content block: if it uses flat keys (s2_li1..N,
 * s3_f*_t/b, s4_k*_l/v/n, s5_m*_l/t/b, s6_li1..N), build the canonical
 * array shape expected by the template. Idempotent — if arrays already
 * present, leave them alone. */
function _normalize(x) {
  const out = Object.assign({}, x);
  if (!Array.isArray(out.findings)) {
    const arr = [];
    for (let i = 1; i <= 6; i++) {
      const t = out['s3_f' + i + '_t'], b = out['s3_f' + i + '_b'];
      if (t || b) arr.push({ t: t || '', b: b || '' });
    }
    out.findings = arr;
  }
  if (!Array.isArray(out.band)) {
    const arr = [];
    for (let i = 1; i <= 6; i++) {
      const l = out['s4_k' + i + '_l'], v = out['s4_k' + i + '_v'], n = out['s4_k' + i + '_n'];
      if (l || v || n) arr.push({ l: l || '', v: v || '', n: n || '' });
    }
    out.band = arr;
    if (out.s4_note_t && !out.band_note_t) { out.band_note_t = out.s4_note_t; out.band_note_b = out.s4_note_b || ''; }
  }
  if (!Array.isArray(out.milestones)) {
    const arr = [];
    for (let i = 1; i <= 6; i++) {
      const l = out['s5_m' + i + '_l'], t = out['s5_m' + i + '_t'], b = out['s5_m' + i + '_b'];
      if (l || t || b) arr.push({ l: l || '', t: t || '', b: b || '' });
    }
    out.milestones = arr;
  }
  if (!Array.isArray(out.s2_list)) {
    const arr = [];
    for (let i = 1; i <= 10; i++) if (out['s2_li' + i]) arr.push(out['s2_li' + i]);
    out.s2_list = arr;
  }
  if (!Array.isArray(out.s6_list)) {
    const arr = [];
    for (let i = 1; i <= 10; i++) if (out['s6_li' + i]) arr.push(out['s6_li' + i]);
    out.s6_list = arr;
  }
  return out;
}

function renderHTML(sample) {
  const en = _normalize(sample.content.en);
  const ru = _normalize(sample.content.ru);
  const es = _normalize(sample.content.es);
  const url = `https://vitacorexllc.com/samples/${sample.slug}.html`;
  const ogImage = 'https://vitacorexllc.com/assets/img/og-cover.png';
  const isAccessibleForFree = sample.gating === 'ungated';

  const creativeWork = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url + "#sample",
    "name": sample.title.en.replace(/\s*\|\s*VitaCoreX LLC\s*$/, ''),
    "description": sample.description.en,
    "creator": { "@type": "Organization", "@id": "https://vitacorexllc.com/#org", "name": "VitaCoreX LLC" },
    "publisher": { "@type": "Organization", "@id": "https://vitacorexllc.com/#org", "name": "VitaCoreX LLC" },
    "url": url,
    "inLanguage": ["en", "ru", "es"],
    "isAccessibleForFree": isAccessibleForFree,
    "educationalUse": "procurement-evaluation",
    "genre": "redacted-sample",
    "license": "https://vitacorexllc.com/terms-of-use.html",
    "dateCreated": "2026-04-19",
    "dateModified": "2026-04-19",
    "version": "1.0",
    "keywords": ["sample deliverable", "redacted", sample.slug, "procurement review"]
  });

  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vitacorexllc.com/" },
      { "@type": "ListItem", "position": 2, "name": "Samples", "item": "https://vitacorexllc.com/sample-deliverable.html" },
      { "@type": "ListItem", "position": 3, "name": sample.title.en.replace(/\s*—.*$/, '').replace(/\s*\|\s*VitaCoreX LLC\s*$/, ''), "item": url }
    ]
  });

  const findingsHTML = (lang, f) => f.map((row, i) =>
    `<div class="vcx-sample-finding"><h3 data-smp="s3_f${i+1}_t">${esc(row.t)}</h3><p data-smp="s3_f${i+1}_b">${esc(row.b)}</p></div>`
  ).join('\n        ');

  const bulletsHTML = (list, prefix) => list.map((b, i) =>
    `<li data-smp="${prefix}${i+1}">${esc(b)}</li>`
  ).join('\n          ');

  const bandHTML = (band) => band.map((row, i) =>
    `<dl class="vcx-sample-band__k"><dt data-smp="s4_k${i+1}_l">${esc(row.l)}</dt><dd data-smp="s4_k${i+1}_v">${esc(row.v)}<small data-smp="s4_k${i+1}_n">${esc(row.n)}</small></dd></dl>`
  ).join('\n          ');

  const milesHTML = (miles) => miles.map((m, i) =>
    `<div class="vcx-sample-mile"><h3 data-smp="s5_m${i+1}_l">${esc(m.l)}</h3><h4 data-smp="s5_m${i+1}_t">${esc(m.t)}</h4><p data-smp="s5_m${i+1}_b">${esc(m.b)}</p></div>`
  ).join('\n        ');

  const pageData = {
    en: _flattenContent(en),
    ru: _flattenContent(ru),
    es: _flattenContent(es)
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-title" content="VitaCoreX"/>
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link rel="preconnect" href="https://vcx-api.onrender.com" crossorigin/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta http-equiv="Content-Language" content="en"/>
<title>${esc(sample.title.en)}</title>
<meta name="description" content="${esc(sample.description.en)}"/>
<meta name="keywords" content="sample deliverable, redacted, ${sample.slug}, procurement review, VitaCoreX"/>
<link rel="canonical" href="${url}"/>
<link rel="alternate" hreflang="en" href="${url}"/>
<link rel="alternate" hreflang="ru" href="${url}"/>
<link rel="alternate" hreflang="es" href="${url}"/>
<link rel="alternate" hreflang="x-default" href="${url}"/>
<meta property="og:title" content="${esc(sample.title.en)}"/>
<meta property="og:description" content="${esc(sample.description.en)}"/>
<meta property="og:type" content="article"/>
<meta property="og:image" content="${ogImage}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:locale" content="en_US"/>
<meta property="og:locale:alternate" content="ru_RU"/>
<meta property="og:locale:alternate" content="es_ES"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(sample.title.en)}"/>
<meta name="twitter:description" content="${esc(sample.description.en)}"/>
<meta name="twitter:image" content="${ogImage}"/>
<meta name="theme-color" content="#0e2036"/>
<meta name="color-scheme" content="light"/>
<meta name="author" content="VitaCoreX LLC"/>
<meta name="geo.region" content="US-FL"/>
<meta name="geo.placename" content="Tampa"/>
<link rel="stylesheet" href="/assets/css/vcx-tokens.css">
<link rel="stylesheet" href="/assets/css/vcx-base.css">
<link rel="stylesheet" href="/assets/css/vcx-layout.css">
<link rel="stylesheet" href="/assets/css/vcx-components.css">
<link rel="stylesheet" href="/assets/css/vcx-sample.css?v=1">
<script type="application/ld+json">
${creativeWork}
</script>
<script type="application/ld+json">
${breadcrumb}
</script>
<script>
window.PAGE_DATA = ${JSON.stringify(pageData)};
</script>
</head>
<body class="vcx-sample-body vcx-preload" data-audience="${sample.audience}">
<main class="vcx-sample-doc" role="main">
  <header class="vcx-sample-cover">
    <span class="vcx-sample-cover__eyebrow" data-smp="eyebrow">${esc(en.eyebrow)}</span>
    <h1 data-smp="h1">${esc(en.h1)}</h1>
    <p class="vcx-sample-cover__lead" data-smp="lead">${esc(en.lead)}</p>
    <aside class="vcx-sample-cover__side">
      <h3 data-smp="side_t">${esc(en.side_t)}</h3>
      <p data-smp="side_p">${esc(en.side_p)}</p>
    </aside>
  </header>

  <section class="vcx-sample-meta" aria-label="Document metadata">
    <h2>Document metadata</h2>
    <div class="vcx-sample-meta__grid">
      <dl class="vcx-sample-meta__k"><dt data-smp="meta_k1_l">${esc(en.meta_k1_l)}</dt><dd data-smp="meta_k1_v">${esc(en.meta_k1_v)}<small data-smp="meta_k1_n">${esc(en.meta_k1_n)}</small></dd></dl>
      <dl class="vcx-sample-meta__k"><dt data-smp="meta_k2_l">${esc(en.meta_k2_l)}</dt><dd data-smp="meta_k2_v">${esc(en.meta_k2_v)}<small data-smp="meta_k2_n">${esc(en.meta_k2_n)}</small></dd></dl>
      <dl class="vcx-sample-meta__k"><dt data-smp="meta_k3_l">${esc(en.meta_k3_l)}</dt><dd data-smp="meta_k3_v">${esc(en.meta_k3_v)}<small data-smp="meta_k3_n">${esc(en.meta_k3_n)}</small></dd></dl>
      <dl class="vcx-sample-meta__k"><dt data-smp="meta_k4_l">${esc(en.meta_k4_l)}</dt><dd data-smp="meta_k4_v">${esc(en.meta_k4_v)}<small data-smp="meta_k4_n">${esc(en.meta_k4_n)}</small></dd></dl>
    </div>
  </section>

  <nav class="vcx-sample-toc" aria-label="Table of contents">
    <h2>Table of contents</h2>
    <ol>
      <li><a href="#sec-1" data-smp="toc_1">${esc(en.toc_1)}</a></li>
      <li><a href="#sec-2" data-smp="toc_2">${esc(en.toc_2)}</a></li>
      <li><a href="#sec-3" data-smp="toc_3">${esc(en.toc_3)}</a></li>
      <li><a href="#sec-4" data-smp="toc_4">${esc(en.toc_4)}</a></li>
      <li><a href="#sec-5" data-smp="toc_5">${esc(en.toc_5)}</a></li>
      <li><a href="#sec-6" data-smp="toc_6">${esc(en.toc_6)}</a></li>
    </ol>
  </nav>

  <section class="vcx-sample-section" id="sec-1">
    <span class="eyebrow" data-smp="s1_e">${esc(en.s1_e)}</span>
    <h2 data-smp="s1_h">${esc(en.s1_h)}</h2>
    <p data-smp="s1_p">${esc(en.s1_p)}</p>
    <ul>
      <li data-smp="s1_li1">${esc(en.s1_li1)}</li>
      <li data-smp="s1_li2">${esc(en.s1_li2)}</li>
      <li data-smp="s1_li3">${esc(en.s1_li3)}</li>
      ${en.s1_li4 ? '<li data-smp="s1_li4">' + esc(en.s1_li4) + '</li>' : ''}
      ${en.s1_li5 ? '<li data-smp="s1_li5">' + esc(en.s1_li5) + '</li>' : ''}
    </ul>
  </section>

  <section class="vcx-sample-section" id="sec-2">
    <span class="eyebrow" data-smp="s2_e">${esc(en.s2_e)}</span>
    <h2 data-smp="s2_h">${esc(en.s2_h)}</h2>
    <p data-smp="s2_p">${esc(en.s2_p)}</p>
    <ul>
      ${bulletsHTML(en.s2_list, 's2_li')}
    </ul>
  </section>

  <section class="vcx-sample-section" id="sec-3">
    <span class="eyebrow" data-smp="s3_e">${esc(en.s3_e)}</span>
    <h2 data-smp="s3_h">${esc(en.s3_h)}</h2>
    <p data-smp="s3_p">${esc(en.s3_p)}</p>
    ${findingsHTML('en', en.findings)}
  </section>

  <section class="vcx-sample-section" id="sec-4">
    <span class="eyebrow" data-smp="s4_e">${esc(en.s4_e)}</span>
    <h2 data-smp="s4_h">${esc(en.s4_h)}</h2>
    <p data-smp="s4_p">${esc(en.s4_p)}</p>
    <div class="vcx-sample-band">
      ${bandHTML(en.band)}
    </div>
    <aside class="vcx-sample-cover__side">
      <h3 data-smp="band_note_t">${esc(en.band_note_t)}</h3>
      <p data-smp="band_note_b">${esc(en.band_note_b)}</p>
    </aside>
  </section>

  <section class="vcx-sample-section" id="sec-5">
    <span class="eyebrow" data-smp="s5_e">${esc(en.s5_e)}</span>
    <h2 data-smp="s5_h">${esc(en.s5_h)}</h2>
    <p data-smp="s5_p">${esc(en.s5_p)}</p>
    ${milesHTML(en.milestones)}
  </section>

  <section class="vcx-sample-section" id="sec-6">
    <span class="eyebrow" data-smp="s6_e">${esc(en.s6_e)}</span>
    <h2 data-smp="s6_h">${esc(en.s6_h)}</h2>
    <p data-smp="s6_p">${esc(en.s6_p)}</p>
    <ul>
      ${bulletsHTML(en.s6_list, 's6_li')}
    </ul>
  </section>

  <aside class="vcx-sample-cta" role="complementary">
    <h2 data-smp="cta_h">${esc(en.cta_h)}</h2>
    <p data-smp="cta_p">${esc(en.cta_p)}</p>
    <div class="vcx-sample-cta__row">
      <a class="primary" href="/sample-deliverable.html" data-smp="cta_primary">${esc(en.cta_primary)}</a>
      <a class="secondary" href="/security-and-compliance.html" data-smp="cta_secondary">${esc(en.cta_secondary)}</a>
    </div>
  </aside>

  <footer class="vcx-sample-disclaimer">
    <p data-smp="disclaimer"><strong>Disclaimer.</strong> ${esc(en.disclaimer)}</p>
  </footer>
</main>

<script src="/assets/js/vcx-translations.js?v=19" defer></script>
<script src="/assets/js/vcx-i18n.js?v=2" defer></script>
<script src="/assets/js/vcx-nav.js?v=1" defer></script>
<script src="/assets/js/vcx-footer.js?v=1" defer></script>
<script src="/assets/js/vcx-sample.js?v=1" defer></script>
</body>
</html>
`;
}

function _flattenContent(c) {
  const out = {};
  for (const k of Object.keys(c)) {
    const v = c[k];
    if (k === 'findings') {
      for (let i = 0; i < v.length; i++) { out['s3_f' + (i+1) + '_t'] = v[i].t; out['s3_f' + (i+1) + '_b'] = v[i].b; }
    } else if (k === 'band') {
      for (let i = 0; i < v.length; i++) { out['s4_k' + (i+1) + '_l'] = v[i].l; out['s4_k' + (i+1) + '_v'] = v[i].v; out['s4_k' + (i+1) + '_n'] = v[i].n; }
    } else if (k === 'milestones') {
      for (let i = 0; i < v.length; i++) { out['s5_m' + (i+1) + '_l'] = v[i].l; out['s5_m' + (i+1) + '_t'] = v[i].t; out['s5_m' + (i+1) + '_b'] = v[i].b; }
    } else if (k === 's2_list') {
      for (let i = 0; i < v.length; i++) out['s2_li' + (i+1)] = v[i];
    } else if (k === 's6_list') {
      for (let i = 0; i < v.length; i++) out['s6_li' + (i+1)] = v[i];
    } else {
      out[k] = v;
    }
  }
  return out;
}

/* ── Main ───────────────────────────────────────────────────────────────── */

let built = 0;
for (const s of SAMPLES) {
  const html = renderHTML(s);
  const outPath = path.join(OUT_DIR, s.slug + '.html');
  fs.writeFileSync(outPath, html, 'utf8');
  built++;
  console.log('  built: samples/' + s.slug + '.html (' + s.audience + ', ' + s.gating + ', ' + html.length + ' bytes)');
}
console.log('\nBuilt: ' + built + ' sample pages.');
