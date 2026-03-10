document.addEventListener("DOMContentLoaded", function () {
  if (!document.body) return;

  const tickerHTML = `
<section class="vcx-ticker-wrap">
  <div class="vcx-ticker">
    <div class="vcx-ticker-track">
      <span>RECOVERY INDEX +12%</span>
      <span>ACTIVE MATTERS 18</span>
      <span>PACKET READINESS 84</span>
      <span>AVG RESPONSE 3.2 DAYS</span>
      <span>CONTROL SIGNAL 71</span>
      <span>RECOVERY INDEX +12%</span>
      <span>ACTIVE MATTERS 18</span>
      <span>PACKET READINESS 84</span>
      <span>AVG RESPONSE 3.2 DAYS</span>
      <span>CONTROL SIGNAL 71</span>
    </div>
  </div>
</section>`;

  const cardsHTML = `
<section class="vcx-command-center">
  <div class="vcx-cards-grid">
    <div class="vcx-card">
      <div class="vcx-card-label">Recovery Potential</div>
      <div class="vcx-card-value" data-count="420">0</div>
    </div>
    <div class="vcx-card">
      <div class="vcx-card-label">Packet Readiness</div>
      <div class="vcx-card-value" data-count="84">0</div>
    </div>
    <div class="vcx-card">
      <div class="vcx-card-label">Matter Velocity</div>
      <div class="vcx-card-value" data-count="32">0</div>
    </div>
    <div class="vcx-card">
      <div class="vcx-card-label">Control Signal</div>
      <div class="vcx-card-value" data-count="71">0</div>
    </div>
  </div>
</section>`;

  const activityHTML = `
<section class="vcx-activity">
  <h3>Live Activity</h3>
  <div>Intake received — Florida</div>
  <div>Document packet reviewed</div>
  <div>Demand path selected</div>
</section>`;

  const calculatorHTML = `
<section class="vcx-calculator">
  <h3>Recovery Potential Estimator</h3>
  <input id="calcAmount" placeholder="Monthly unpaid amount">
  <input id="calcDays" placeholder="Delay days">
  <button id="calcBtn" type="button">Estimate</button>
  <div id="calcResult">Result will appear here</div>
</section>`;

  document.body.insertAdjacentHTML("afterbegin", tickerHTML);
  document.body.insertAdjacentHTML("beforeend", cardsHTML);
  document.body.insertAdjacentHTML("beforeend", activityHTML);
  document.body.insertAdjacentHTML("beforeend", calculatorHTML);

  document.querySelectorAll(".vcx-card-value").forEach((el) => {
    const target = Number(el.dataset.count || 0);
    let count = 0;

    const interval = setInterval(() => {
      count += Math.ceil(target / 30);

      if (count >= target) {
        count = target;
        clearInterval(interval);
      }

      el.textContent = count;
    }, 30);
  });

  const btn = document.getElementById("calcBtn");

  if (btn) {
    btn.addEventListener("click", function () {
      const amount = Number(document.getElementById("calcAmount").value || 0);
      const annual = amount * 12 * 0.3;

      document.getElementById("calcResult").textContent =
        "Estimated recoverable: $" + annual.toLocaleString();
    });
  }
});
