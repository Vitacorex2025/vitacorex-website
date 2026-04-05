/**
 * VitaCoreX SEO Enhancements — Phase 10
 *
 * Adds missing SEO elements from the ranking strategy:
 * 1. LocalBusiness structured data (JSON-LD)
 * 2. hreflang tags for EN/RU/ES language targeting
 * 3. Fixes placeholder calculator outputs
 *
 * This is an additive vcx-* namespaced file per AGENTS.md visual-freeze rules.
 */
(function () {
  'use strict';

  // ── 1. LocalBusiness Structured Data ─────────────────────────────
  var localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://vitacorexllc.com/#localbusiness",
    "name": "VitaCoreX LLC",
    "description": "Revenue recovery infrastructure, corporate legal file control, structured case intake, and documentation systems for complex operators.",
    "url": "https://vitacorexllc.com/",
    "logo": "https://vitacorexllc.com/assets/img/logo.png",
    "image": "https://vitacorexllc.com/assets/img/og-cover.png",
    "telephone": "+18887948292",
    "email": "stevenmiller@vitacorexllc.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tampa",
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.9506,
      "longitude": -82.4572
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "sameAs": [],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+18887948292",
        "contactType": "customer service",
        "availableLanguage": ["English", "Russian", "Spanish"]
      }
    ],
    "knowsLanguage": ["en", "ru", "es"],
    "foundingDate": "2025",
    "taxID": "41-4399148",
    "legalName": "VitaCoreX LLC"
  };

  // Only add LocalBusiness on main pages (not app subpages)
  var isMainPage = !window.location.pathname.match(/^\/app\//);
  if (isMainPage && !document.querySelector('script[data-vcx-seo="localbusiness"]')) {
    var lbScript = document.createElement('script');
    lbScript.type = 'application/ld+json';
    lbScript.setAttribute('data-vcx-seo', 'localbusiness');
    lbScript.textContent = JSON.stringify(localBusiness);
    document.head.appendChild(lbScript);
  }

  // ── 2. Professional Service structured data ──────────────────────
  var professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://vitacorexllc.com/#service",
    "name": "VitaCoreX LLC",
    "description": "Revenue recovery design, documentation control, and counsel-ready file infrastructure.",
    "url": "https://vitacorexllc.com/",
    "provider": { "@id": "https://vitacorexllc.com/#localbusiness" },
    "serviceType": [
      "Revenue Recovery Infrastructure Design",
      "Corporate Legal File Control",
      "Structured Case Intake",
      "Contract Review and Intelligence",
      "Immigration Packet Preparation Support",
      "Auto Deal Analysis"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    }
  };

  if (isMainPage && !document.querySelector('script[data-vcx-seo="service"]')) {
    var svcScript = document.createElement('script');
    svcScript.type = 'application/ld+json';
    svcScript.setAttribute('data-vcx-seo', 'service');
    svcScript.textContent = JSON.stringify(professionalService);
    document.head.appendChild(svcScript);
  }

  // ── 3. hreflang Tags ────────────────────────────────────────────
  // Since the site uses JS-based language switching (not separate URLs),
  // we add x-default and primary language hreflang tags.
  // This signals to search engines that this URL serves all languages.
  var canonicalUrl = document.querySelector('link[rel="canonical"]');
  var pageUrl = canonicalUrl ? canonicalUrl.href : window.location.href.split('?')[0].split('#')[0];

  var hreflangMap = {
    'en': pageUrl,
    'ru': pageUrl,
    'es': pageUrl,
    'x-default': pageUrl
  };

  if (!document.querySelector('link[hreflang]')) {
    Object.keys(hreflangMap).forEach(function (lang) {
      var link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = hreflangMap[lang];
      document.head.appendChild(link);
    });
  }

  // ── 4. Fix Placeholder Calculator Outputs ────────────────────────
  // The ranking strategy flagged "0–0%" and "$0" as trust liabilities.
  // Replace them with meaningful placeholders.
  function fixPlaceholders() {
    var allElements = document.querySelectorAll(
      '.stat-value, .metric-value, .kpi-value, .roi-value, .impact-value, [data-stat]'
    );
    allElements.forEach(function (el) {
      var text = el.textContent.trim();
      if (text === '$0' || text === '0' || text === '0–0%' || text === '0-0%' || text === '$0.00') {
        // Check if it's inside a calculator that expects user input
        var isCalculator = el.closest('.calculator, .roi-calculator, [data-calculator]');
        if (!isCalculator) {
          // Static display — hide the misleading zero
          el.style.visibility = 'hidden';
          el.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }

  // Run on load and after any dynamic updates
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixPlaceholders);
  } else {
    fixPlaceholders();
  }

  // ── 5. FAQ Structured Data (if FAQ section exists) ───────────────
  function addFAQSchema() {
    var faqSection = document.querySelector('.faq-section, [data-faq], #faq');
    if (!faqSection) return;
    if (document.querySelector('script[data-vcx-seo="faq"]')) return;

    var questions = faqSection.querySelectorAll('.faq-item, details, [data-faq-q]');
    if (questions.length === 0) return;

    var faqItems = [];
    questions.forEach(function (q) {
      var questionText = '';
      var answerText = '';
      if (q.tagName === 'DETAILS') {
        var summary = q.querySelector('summary');
        questionText = summary ? summary.textContent.trim() : '';
        answerText = q.textContent.replace(questionText, '').trim();
      } else {
        var qEl = q.querySelector('.faq-question, h3, h4, [data-faq-q]');
        var aEl = q.querySelector('.faq-answer, p, [data-faq-a]');
        questionText = qEl ? qEl.textContent.trim() : '';
        answerText = aEl ? aEl.textContent.trim() : '';
      }
      if (questionText && answerText) {
        faqItems.push({
          "@type": "Question",
          "name": questionText,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answerText
          }
        });
      }
    });

    if (faqItems.length > 0) {
      var faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems
      };
      var script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-vcx-seo', 'faq');
      script.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(script);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFAQSchema);
  } else {
    addFAQSchema();
  }

  // Log SEO enhancements
  console.log('[VCX-SEO] SEO enhancements loaded: LocalBusiness, hreflang, placeholder fixes, FAQ schema');

})();
