
function renderComparison(rrMetrics, prMetrics) {
  renderComparisonTable(rrMetrics.averages, prMetrics.averages);
  renderRecommendation(rrMetrics.averages, prMetrics.averages);
}


function renderComparisonTable(rrAvg, prAvg) {
  const container = document.getElementById("comparison-table-container");
  container.innerHTML = "";

  const rows = [
    {
      metric: "Average Waiting Time (WT)",
      rr: rrAvg.wt, pr: prAvg.wt,
      numeric: true, lowerBetter: true,
    },
    {
      metric: "Average Turnaround Time (TAT)",
      rr: rrAvg.tat, pr: prAvg.tat,
      numeric: true, lowerBetter: true,
    },
    {
      metric: "Average Response Time (RT)",
      rr: rrAvg.rt, pr: prAvg.rt,
      numeric: true, lowerBetter: true,
    },
    {
      metric: "Fairness",
      rr: "High — equal time slices",
      pr: "Low — high-priority favored",
      numeric: false,
    },
    {
      metric: "Urgency / Priority Support",
      rr: "None — ignores priority",
      pr: "Full — immediate preemption",
      numeric: false,
    },
    {
      metric: "Starvation Risk",
      rr: "None",
      pr: "Yes — low-priority may starve",
      numeric: false,
    },
    {
      metric: "Service Differentiation",
      rr: "No — all equal",
      pr: "Yes — by priority level",
      numeric: false,
    },
    {
      metric: "Preemption Trigger",
      rr: "Quantum expiry",
      pr: "Higher-priority arrival",
      numeric: false,
    },
    {
      metric: "Predictable Response",
      rr: "Yes — bounded by quantum × n",
      pr: "No — depends on priority",
      numeric: false,
    },
  ];

  const table = document.createElement("table");
  table.className = "comparison-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Metric</th>
        <th style="color:var(--accent-rr)">🟢 Round Robin</th>
        <th style="color:var(--accent-pr)">🟡 Priority (Preemptive)</th>
        <th>Winner</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  rows.forEach(row => {
    const tr = document.createElement("tr");
    let winner = "—";
    let cls    = "winner-tie";

    if (row.numeric) {
      const diff = Math.abs(row.rr - row.pr);
      if (diff < 0.01) {
        winner = "Tie";
      } else if (row.lowerBetter && row.rr < row.pr) {
        winner = "🟢 RR";   cls = "winner-rr";
      } else if (row.lowerBetter && row.pr < row.rr) {
        winner = "🟡 Priority"; cls = "winner-pr";
      }
    }

    tr.innerHTML = `
      <td>${row.metric}</td>
      <td style="color:var(--accent-rr)">${row.rr}</td>
      <td style="color:var(--accent-pr)">${row.pr}</td>
      <td class="${cls}">${winner}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}


function renderRecommendation(rrAvg, prAvg) {
  const box = document.getElementById("recommendation-box");

  const wtDiff  = Math.abs(rrAvg.wt  - prAvg.wt).toFixed(2);
  const tatDiff = Math.abs(rrAvg.tat - prAvg.tat).toFixed(2);
  const prWins  = prAvg.wt < rrAvg.wt;

  const text = `
📊 ANALYSIS SUMMARY

${prWins
  ? `Preemptive Priority achieves lower average waiting time than Round Robin by ${wtDiff} units on this workload. This is because high-priority processes are immediately served when they arrive, reducing their individual wait at the cost of delaying lower-priority processes.`
  : `Round Robin achieves competitive or better average waiting time (${wtDiff} units difference). This can occur when processes have similar priorities or when the quantum is well-tuned relative to burst times.`
}

FAIRNESS vs URGENCY TRADE-OFF:
  Round Robin treats every process equally — every process gets CPU access within (quantum × n) time units. This fairness is ideal for interactive systems, user desktops, or time-sharing environments where no single process should monopolize the CPU.

  Preemptive Priority gives urgent processes immediate access. This is critical in real-time systems, network packet routing, or OS kernel tasks where some jobs are genuinely more important. However, low-priority processes can suffer severe delays or even starve if high-priority jobs continuously arrive.

STARVATION RISK:
  Under Priority scheduling, a process with low priority (e.g., priority 3) may wait indefinitely if priority-1 and priority-2 processes keep arriving. A real OS addresses this with AGING — gradually increasing a process's priority the longer it waits. Your implementation does not include aging — this should be stated as a limitation in your report.

EFFECT OF QUANTUM ON ROUND ROBIN:
  A small quantum (e.g., 1-2) gives very fast response time for all processes but increases context-switching overhead. A large quantum (e.g., 10+) makes RR behave like FCFS — first-come, first-served — losing the fairness benefit. The ideal quantum is typically slightly larger than the average burst interaction (around 80% of burst times in practice).

🔵 RECOMMENDATION:
  • Use Round Robin for: time-sharing OS, interactive systems, user applications — anywhere all users deserve equal treatment.
  • Use Preemptive Priority for: real-time systems, embedded systems, network routing, OS scheduling of kernel vs user tasks — anywhere urgency matters more than fairness.
  • In practice, most modern OS schedulers combine both: a multi-level feedback queue uses Round Robin within each priority level, giving fairness among equals while still respecting urgency.
`.trim();

  box.textContent = text;
}

