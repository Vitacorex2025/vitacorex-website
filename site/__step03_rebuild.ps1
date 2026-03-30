$ErrorActionPreference = 'Stop'

$root = 'C:\Users\sergz\vitacorex_step03_work'

$pages = @(
  @{ File = 'index.html'; Active = 'home'; Type = 'home' }
  @{ File = 'corporate-legal-file-control.html'; Active = 'companies'; Type = 'company' }
  @{ File = 'revenue-recovery-workflow.html'; Active = 'recovery'; Type = 'company' }
  @{ File = 'resources.html'; Active = 'brief'; Type = 'resources' }
  @{ File = 'additional-services.html'; Active = 'individuals'; Type = 'individual' }
  @{ File = 'structured-case-intake.html'; Active = 'individuals'; Type = 'intake' }
  @{ File = 'contact.html'; Active = 'confidential'; Type = 'contact' }
  @{ File = 'careers.html'; Active = 'none'; Type = 'careers' }
  @{ File = 'thank-you.html'; Active = 'confidential'; Type = 'thanks' }
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$singleline = [System.Text.RegularExpressions.RegexOptions]::Singleline

function Join-Classes {
  param([string[]]$Classes)
  return ($Classes | Where-Object { $_ -and $_.Trim() } | ForEach-Object { $_.Trim() }) -join ' '
}

function ClassAttr {
  param([string[]]$Classes)
  $joined = Join-Classes $Classes
  if ([string]::IsNullOrWhiteSpace($joined)) {
    return ''
  }
  return ' class="' + $joined + '"'
}

function Get-DesktopNav {
  param([string]$Active)
  $homeClass = ClassAttr @($(if ($Active -eq 'home') { 'active' }))
  $companiesClass = ClassAttr @('is-long', 'vcx-nav-company', $(if ($Active -eq 'companies') { 'active' }))
  $recoveryClass = ClassAttr @('is-long', $(if ($Active -eq 'recovery') { 'active' }))
  $briefClass = ClassAttr @('is-long', $(if ($Active -eq 'brief') { 'active' }))
  $individualsClass = ClassAttr @('is-long', 'vcx-nav-individual', $(if ($Active -eq 'individuals') { 'active' }))
  $confidentialClass = ClassAttr @('is-long', 'vcx-nav-action', $(if ($Active -eq 'confidential') { 'active' }))
  return @"
<nav class="vcx-main-nav"><a$homeClass data-common="home" href="index.html">Home</a><a$companiesClass data-tx="nav_companies" href="corporate-legal-file-control.html">For Companies</a><a$recoveryClass data-tx="nav_recovery" href="revenue-recovery-workflow.html">Revenue Recovery</a><a$briefClass data-tx="nav_brief" href="resources.html">Executive Brief</a><a$individualsClass data-tx="nav_individuals" href="additional-services.html">For Individuals</a><a$confidentialClass data-tx="nav_confidential" href="contact.html?audience=company">Confidential Review</a></nav>
"@
}

function Get-MobileNav {
  param([string]$Active)
  $homeClass = ClassAttr @($(if ($Active -eq 'home') { 'active' }))
  $companiesClass = ClassAttr @('is-long', 'vcx-nav-company', $(if ($Active -eq 'companies') { 'active' }))
  $recoveryClass = ClassAttr @('is-long', $(if ($Active -eq 'recovery') { 'active' }))
  $briefClass = ClassAttr @('is-long', $(if ($Active -eq 'brief') { 'active' }))
  $individualsClass = ClassAttr @('is-long', 'vcx-nav-individual', $(if ($Active -eq 'individuals') { 'active' }))
  $confidentialClass = ClassAttr @('is-long', 'vcx-nav-action', $(if ($Active -eq 'confidential') { 'active' }))
  return @"
<nav class="vcx-mobile-nav" hidden="" id="vcxMobileNav"><a$homeClass data-common="home" href="index.html">Home</a><a$companiesClass data-tx="nav_companies" href="corporate-legal-file-control.html">For Companies</a><a$recoveryClass data-tx="nav_recovery" href="revenue-recovery-workflow.html">Revenue Recovery</a><a$briefClass data-tx="nav_brief" href="resources.html">Executive Brief</a><a$individualsClass data-tx="nav_individuals" href="additional-services.html">For Individuals</a><a$confidentialClass data-tx="nav_confidential" href="contact.html?audience=company">Confidential Review</a></nav>
"@
}

function Get-Footer {
  return @"
<footer class="footer">
  <div class="wrap footer-grid">
    <div class="footer-group footer-company">
      <h3>VitaCoreX LLC</h3>
      <div class="footer-meta">
        <p class="small-note" data-common="footer_est">Established 2025</p>
        <p class="small-note" data-common="footer_ein">EIN: 41-4399148</p>
        <p class="small-note" data-common="footer_phone">Phone (call/text): (813) 919-4242</p>
        <p class="small-note" data-common="footer_disc">VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. It is not a law firm and does not provide legal representation. Legal strategy and legal advice remain the responsibility of licensed counsel.</p>
        <p class="small-note" data-common="footer_copy">© 2026 VitaCoreX LLC. All rights reserved.</p>
        <p class="small-note footer-follow"><a href="https://www.instagram.com/vitacorex_llc" rel="noopener" target="_blank">Instagram</a> · <a href="https://www.facebook.com/share/1DNdW5Bnt8/?mibextid=wwXIfr" rel="noopener" target="_blank">Facebook</a></p>
      </div>
    </div>
    <div class="footer-group">
      <h3 data-tx="footer_companies_title">For Companies</h3>
      <nav aria-label="For companies" class="footer-links">
        <a data-tx="nav_companies" href="corporate-legal-file-control.html">For Companies</a>
        <a data-tx="nav_recovery" href="revenue-recovery-workflow.html">Revenue Recovery</a>
        <a data-tx="nav_brief" href="resources.html">Executive Brief</a>
        <a data-tx="cta_confidential_review" href="contact.html?audience=company">Request confidential review</a>
        <a data-tx="cta_strategy_call" href="https://calendly.com/vitacorex2025/30min" rel="noopener" target="_blank">Schedule strategy call</a>
      </nav>
    </div>
    <div class="footer-group">
      <h3 data-tx="footer_individuals_title">For Individuals</h3>
      <nav aria-label="For individuals" class="footer-links">
        <a data-tx="nav_individuals" href="additional-services.html">For Individuals</a>
        <a data-tx="cta_request_service" href="additional-services.html">Request service</a>
        <a data-tx="cta_start_intake" href="structured-case-intake.html?audience=individual">Start structured intake</a>
        <a data-tx="footer_careers_link" href="careers.html">Careers</a>
        <a data-common="cta_contact" href="mailto:VitaCoreXllc@gmail.com">Contact the director</a>
      </nav>
    </div>
  </div>
</footer>
"@
}

function Get-Dock {
  return @"
<div aria-label="Quick access dock" class="vcx-dock">
<div class="vcx-dock-shell">
<div class="vcx-dock-desktop">
<a aria-label="Confidential Review" class="vcx-dock-pilot" data-tx="cta_confidential_review" href="contact.html?audience=company">Request confidential review</a>
<a aria-label="Home" class="vcx-dock-icon is-home" href="index.html"><span class="vcx-dock-iconbox"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3.9 10.3 12 4l8.1 6.3"></path><path d="M5.6 9.8V19a1 1 0 0 0 1 1h3.75v-5.35h3.3V20h3.75a1 1 0 0 0 1-1V9.8"></path></svg></span><span class="vcx-dock-text" data-common="home">Home</span></a>
<a aria-label="Executive Brief" class="vcx-dock-icon is-brief" href="resources.html"><span class="vcx-dock-iconbox"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 4.8h7l3.2 3.2V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.8a1 1 0 0 1 1-1z"></path><path d="M14 4.8v3.4h3.2"></path><path d="M8.7 12.1h6.6"></path><path d="M8.7 15.4h6.6"></path></svg></span><span class="vcx-dock-text" data-tx="dock_brief">Executive Brief</span></a>
<a aria-label="Schedule Strategy Call" class="vcx-dock-icon is-book" href="https://calendly.com/vitacorex2025/30min" rel="noopener" target="_blank"><span class="vcx-dock-iconbox"><svg aria-hidden="true" viewBox="0 0 24 24"><rect height="15" rx="3" width="16" x="4" y="5"></rect><path d="M8 3.8v3.4M16 3.8v3.4M4 9.2h16"></path></svg></span><span class="vcx-dock-text" data-tx="dock_strategy">Strategy Call</span></a>
<a aria-label="For Companies" class="vcx-dock-chip is-companies" href="corporate-legal-file-control.html"><span class="vcx-dock-chipicon"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5.5 19.2V7.4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11.8"></path><path d="M9 19.2V15h6v4.2"></path><path d="M8.2 10.1h1.8"></path><path d="M14 10.1h1.8"></path><path d="M8.2 13.1h1.8"></path><path d="M14 13.1h1.8"></path></svg></span><span class="vcx-dock-text" data-tx="nav_companies">For Companies</span></a>
<a aria-label="For Individuals" class="vcx-dock-chip is-individuals" href="additional-services.html"><span class="vcx-dock-chipicon"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="7.9" r="3.2"></circle><path d="M5.8 18.2c.9-2.55 3.35-4.2 6.2-4.2s5.3 1.65 6.2 4.2"></path><path d="M9.15 6.95c.55-.78 1.55-1.3 2.85-1.3s2.3.52 2.85 1.3"></path></svg></span><span class="vcx-dock-text" data-tx="nav_individuals">For Individuals</span></a>
</div>
<div class="vcx-dock-mobile">
<div class="vcx-dock-mobile-row vcx-dock-mobile-row-pilot">
<a aria-label="Confidential Review" class="vcx-dock-pilot" data-tx="cta_confidential_review" href="contact.html?audience=company">Request confidential review</a>
</div>
<div class="vcx-dock-mobile-row vcx-dock-mobile-row-icons">
<a aria-label="Home" class="vcx-dock-icon is-home" href="index.html"><span class="vcx-dock-iconbox"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3.9 10.3 12 4l8.1 6.3"></path><path d="M5.6 9.8V19a1 1 0 0 0 1 1h3.75v-5.35h3.3V20h3.75a1 1 0 0 0 1-1V9.8"></path></svg></span><span class="vcx-dock-text" data-common="home">Home</span></a>
<a aria-label="Executive Brief" class="vcx-dock-icon is-brief" href="resources.html"><span class="vcx-dock-iconbox"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 4.8h7l3.2 3.2V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.8a1 1 0 0 1 1-1z"></path><path d="M14 4.8v3.4h3.2"></path><path d="M8.7 12.1h6.6"></path><path d="M8.7 15.4h6.6"></path></svg></span><span class="vcx-dock-text" data-tx="dock_brief">Executive Brief</span></a>
<a aria-label="Schedule Strategy Call" class="vcx-dock-icon is-book" href="https://calendly.com/vitacorex2025/30min" rel="noopener" target="_blank"><span class="vcx-dock-iconbox"><svg aria-hidden="true" viewBox="0 0 24 24"><rect height="15" rx="3" width="16" x="4" y="5"></rect><path d="M8 3.8v3.4M16 3.8v3.4M4 9.2h16"></path></svg></span><span class="vcx-dock-text" data-tx="dock_strategy">Strategy Call</span></a>
</div>
<div class="vcx-dock-mobile-row vcx-dock-mobile-row-services">
<a aria-label="For Companies" class="vcx-dock-chip is-companies" href="corporate-legal-file-control.html"><span class="vcx-dock-chipicon"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5.5 19.2V7.4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11.8"></path><path d="M9 19.2V15h6v4.2"></path><path d="M8.2 10.1h1.8"></path><path d="M14 10.1h1.8"></path><path d="M8.2 13.1h1.8"></path><path d="M14 13.1h1.8"></path></svg></span><span class="vcx-dock-text" data-tx="nav_companies">For Companies</span></a>
<a aria-label="For Individuals" class="vcx-dock-chip is-individuals" href="additional-services.html"><span class="vcx-dock-chipicon"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="7.9" r="3.2"></circle><path d="M5.8 18.2c.9-2.55 3.35-4.2 6.2-4.2s5.3 1.65 6.2 4.2"></path><path d="M9.15 6.95c.55-.78 1.55-1.3 2.85-1.3s2.3.52 2.85 1.3"></path></svg></span><span class="vcx-dock-text" data-tx="nav_individuals">For Individuals</span></a>
</div>
</div>
</div>
</div>
"@
}

function Get-CompanyBand {
  return @"
<section class="section vcx-next-band">
  <div class="wrap">
    <div class="card reveal vcx-next-panel">
      <span class="pill" data-tx="next_companies_eyebrow">For Companies</span>
      <h2 data-tx="next_companies_title">Move from internal review to a confidential operating decision.</h2>
      <p class="section-intro" data-tx="next_companies_intro">Use the confidential review to confirm scope, review current documentation, and decide whether the next step is diagnosis, pilot design, or file-control cleanup.</p>
      <div class="cta-row">
        <a class="btn btn-primary" data-tx="cta_confidential_review" href="contact.html?audience=company">Request confidential review</a>
        <a class="btn btn-secondary" data-tx="cta_review_brief" href="resources.html">Review executive brief</a>
      </div>
    </div>
  </div>
</section>
"@
}

function Get-IndividualBand {
  return @"
<section class="section vcx-next-band vcx-next-band-individual">
  <div class="wrap">
    <div class="card reveal vcx-next-panel">
      <span class="pill" data-tx="next_individuals_eyebrow">For Individuals</span>
      <h2 data-tx="next_individuals_title">Use the structured path for selected private-client matters.</h2>
      <p class="section-intro" data-tx="next_individuals_intro">Private-client work remains available on a controlled basis. Start with the service path or move directly into structured intake.</p>
      <div class="cta-row">
        <a class="btn btn-primary" data-tx="cta_request_service" href="additional-services.html">Request service</a>
        <a class="btn btn-secondary" data-tx="cta_start_intake" href="structured-case-intake.html?audience=individual">Start structured intake</a>
      </div>
    </div>
  </div>
</section>
"@
}

foreach ($page in $pages) {
  $path = Join-Path $root $page.File
  $html = [System.IO.File]::ReadAllText($path)

  $html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    '<nav class="vcx-main-nav">.*?</nav>',
    [System.Text.RegularExpressions.MatchEvaluator]{ param($m) Get-DesktopNav $page.Active },
    $singleline
  )

  $html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    '<nav class="vcx-mobile-nav" hidden="" id="vcxMobileNav">.*?</nav>',
    [System.Text.RegularExpressions.MatchEvaluator]{ param($m) Get-MobileNav $page.Active },
    $singleline
  )

  if ($html -match '<footer class="footer">') {
    $html = [System.Text.RegularExpressions.Regex]::Replace(
      $html,
      '<footer class="footer">.*?</footer>',
      [System.Text.RegularExpressions.MatchEvaluator]{ param($m) Get-Footer },
      $singleline
    )
  }

  $html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    '<div aria-label="Quick access dock" class="vcx-dock">.*?</div>\s*(?=<script)',
    [System.Text.RegularExpressions.MatchEvaluator]{ param($m) (Get-Dock).TrimEnd() + "`r`n" },
    $singleline
  )

  switch ($page.Type) {
    'company' {
      if ($html -notmatch 'vcx-next-band') {
        $html = $html -replace '<footer class="footer">', ((Get-CompanyBand).TrimEnd() + "`r`n<footer class=`"footer`">")
      }
    }
    'resources' {
      $html = [System.Text.RegularExpressions.Regex]::Replace(
        $html,
        '<section class="section"><div class="wrap"><div class="card reveal confidentiality-card">.*?</section>',
        [System.Text.RegularExpressions.MatchEvaluator]{ param($m) Get-CompanyBand },
        $singleline
      )
    }
    'individual' {
      if ($html -notmatch 'vcx-next-band') {
        $html = $html -replace '<footer class="footer">', ((Get-IndividualBand).TrimEnd() + "`r`n<footer class=`"footer`">")
      }
    }
  }

  [System.IO.File]::WriteAllText($path, $html, $utf8NoBom)
}
