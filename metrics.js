// ════════════════════════════════════════════════════════
//  metrics.js  —  PERSON 5: Metrics Calculator & Table
//
//  FORMULAS (same for both algorithms):
//    TAT = Finish Time − Arrival Time
//    WT  = TAT − Burst Time
//    RT  = First Run Time − Arrival Time
//
//  NEW vs RR-SRTF project:
//    - Priority column displayed in table for reference
//    - Starvation warning: if WT is unusually high under
//      Priority scheduling, flag it as a starvation risk
// ════════════════════════════════════════════════════════

function calculateMetrics(procs) {
  const results = procs.map(p => {
    const tat = p.finishTime   - p.arrival;
    const wt  = tat            - p.burst;
    const rt  = p.firstRunTime - p.arrival;

    const warnings = [];
    if (wt  < 0)  warnings.push(`WT is negative (${wt}) — check algorithm`);
    if (rt  < 0)  warnings.push(`RT is negative (${rt}) — check firstRunTime`);
    if (tat < 0)  warnings.push(`TAT is negative — finishTime may be wrong`);

    return {
      id:         p.id,
      arrival:    p.arrival,
      burst:      p.burst,
      priority:   p.priority,
      finishTime: p.finishTime,
      firstRun:   p.firstRunTime,
      tat, wt, rt,
      warnings,
    };
  });

  const count  = results.length;
  const avgTat = results.reduce((s, r) => s + r.tat, 0) / count;
  const avgWt  = results.reduce((s, r) => s + r.wt,  0) / count;
  const avgRt  = results.reduce((s, r) => s + r.rt,  0) / count;

  // Detect potential starvation: any process with WT > 3× average burst
  const avgBurst = procs.reduce((s,p) => s + p.burst, 0) / count;
  results.forEach(r => {
    if (r.wt > 3 * avgBurst) {
      r.warnings.push(`⚠ High WT (${r.wt}) — possible starvation due to low priority`);
    }
  });

  return {
    rows: results,
    averages: {
      tat: +avgTat.toFixed(2),
      wt:  +avgWt.toFixed(2),
      rt:  +avgRt.toFixed(2),
    }
  };
}

function renderMetricsTable(containerId, metricsResult) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const { rows, averages } = metricsResult;

  const table = document.createElement("table");
  table.className = "metrics-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Process</th>
        <th>Priority</th>
        <th>Arrival</th>
        <th>Burst</th>
        <th>Finish</th>
        <th>RT</th>
        <th>WT</th>
        <th>TAT</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  rows.forEach(r => {
    const tr = document.createElement("tr");
    const hasWarning = r.warnings.length > 0;

    if (hasWarning) {
      tr.style.background = "rgba(248,113,113,0.05)";
    }

    // Color-code priority cell
    const prioColor = r.priority === 1
      ? "var(--accent-rr)"
      : r.priority === 2
        ? "var(--accent-pr)"
        : "var(--text-muted)";

    tr.innerHTML = `
      <td>${r.id}</td>
      <td style="color:${prioColor};font-weight:600">${r.priority}</td>
      <td>${r.arrival}</td>
      <td>${r.burst}</td>
      <td>${r.finishTime}</td>
      <td>${r.rt}</td>
      <td>${r.wt}</td>
      <td>${r.tat}</td>
    `;
    tbody.appendChild(tr);

    if (hasWarning) {
      const warnTr = document.createElement("tr");
      warnTr.innerHTML = `
        <td colspan="8" style="color:var(--accent-err);font-size:0.76rem;padding:3px 12px 6px;">
          ${r.warnings.join(" | ")}
        </td>`;
      tbody.appendChild(warnTr);
    }
  });

  // Averages row
  const avgTr = document.createElement("tr");
  avgTr.className = "avg-row";
  avgTr.innerHTML = `
    <td colspan="5">Average</td>
    <td>${averages.rt}</td>
    <td>${averages.wt}</td>
    <td>${averages.tat}</td>
  `;
  tbody.appendChild(avgTr);

  table.appendChild(tbody);
  container.appendChild(table);

  // Summary bar
  const summary = document.createElement("div");
  summary.className = "metrics-summary";
  summary.innerHTML = `
    <span>Avg WT: <strong>${averages.wt}</strong></span>
    <span>Avg TAT: <strong>${averages.tat}</strong></span>
    <span>Avg RT: <strong>${averages.rt}</strong></span>
  `;
  container.appendChild(summary);
}

// ════════════════════════════════════════════════════════
//  PERSON 5 — FORMULA REFERENCE
//
//  Turnaround Time (TAT) = Finish Time - Arrival Time
//    How long from arrival to completion?
//
//  Waiting Time (WT) = TAT - Burst Time
//    How long was process waiting (not running)?
//
//  Response Time (RT) = First Run Time - Arrival Time
//    How long before process got CPU for the first time?
//
//  Under Priority Scheduling:
//    Low-priority processes may have very HIGH WT and RT.
//    This is the starvation problem — flag it in warnings!
//
//  Under Round Robin:
//    All processes get equal turns → WT is more evenly spread.
// ════════════════════════════════════════════════════════
