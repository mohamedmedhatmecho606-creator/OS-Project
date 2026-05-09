// ════════════════════════════════════════════════════════
//  gantt.js  —  PERSON 4: Gantt Chart Renderer
//
//  USAGE (called from input.js):
//    renderGanttChart("gantt-rr", rrResult.gantt);
//    renderGanttChart("gantt-pr", prResult.gantt);
//
//  INPUT:
//    containerId → string ID of the <div> to render into
//    gantt       → [ { pid, start, end }, ... ]
//
//  KEY FEATURE:
//    Same process ID always gets the same color in BOTH charts.
//    This makes it easy to visually compare where each process ran.
// ════════════════════════════════════════════════════════

// ── Color palette — 10 distinct colors ──────────────────
const COLORS = [
  "#4ade80",  // green
  "#fbbf24",  // amber
  "#60a5fa",  // blue
  "#f472b6",  // pink
  "#a78bfa",  // purple
  "#34d399",  // teal
  "#fb923c",  // orange
  "#e879f9",  // fuchsia
  "#f87171",  // red
  "#94a3b8",  // slate
];

// Shared color map across both charts
const pidColorMap = {};
let colorIdx = 0;

function getPidColor(pid) {
  if (pid === "IDLE") return null;
  if (!pidColorMap[pid]) {
    pidColorMap[pid] = COLORS[colorIdx % COLORS.length];
    colorIdx++;
  }
  return pidColorMap[pid];
}

// ── Is this color light enough to need dark text? ───────
function isLight(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.55;
}

// ── Main render function ─────────────────────────────────
function renderGanttChart(containerId, gantt) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!gantt || gantt.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.82rem">No data to display.</p>`;
    return;
  }

  // Insert IDLE blocks for gaps in timeline
  const withIdle = insertIdleBlocks(gantt);

  const totalTime = withIdle[withIdle.length - 1].end - withIdle[0].start;
  const minPxPerUnit = 36;
  const chartWidth = Math.max(600, totalTime * minPxPerUnit);

  const wrapper = document.createElement("div");
  wrapper.className  = "gantt-chart";
  wrapper.style.width = chartWidth + "px";

  // ── Bar row ──
  const barRow = document.createElement("div");
  barRow.className = "gantt-bar-row";

  // ── Time labels row ──
  const labelRow = document.createElement("div");
  labelRow.className = "gantt-labels-row";
  labelRow.style.width = "100%";

  const startTime = withIdle[0].start;
  const timePoints = new Set();

  withIdle.forEach(block => {
    const duration  = block.end - block.start;
    const widthPct  = (duration / totalTime) * 100;
    const color     = getPidColor(block.pid);
    const isIdle    = block.pid === "IDLE";

    const div = document.createElement("div");
    div.className = "gantt-block" + (isIdle ? " idle" : "");
    div.style.width    = widthPct + "%";
    div.style.flexShrink = "0";
    div.title = `${block.pid} | ${block.start} → ${block.end} (${duration} unit${duration !== 1 ? "s" : ""})`;

    if (color) {
      div.style.background = color;
      div.style.color = isLight(color) ? "#0a0c10" : "#0a0c10";
    }

    // Show label if block is wide enough (> 2% of total)
    if (widthPct > 2) div.textContent = block.pid;

    barRow.appendChild(div);

    timePoints.add(block.start);
    timePoints.add(block.end);
  });

  // Draw time labels
  [...timePoints].sort((a,b) => a-b).forEach(t => {
    const span = document.createElement("span");
    span.className   = "gantt-label";
    span.textContent = t;
    span.style.left  = ((t - startTime) / totalTime * 100) + "%";
    labelRow.appendChild(span);
  });

  wrapper.appendChild(barRow);
  wrapper.appendChild(labelRow);
  container.appendChild(wrapper);

  // ── Legend ──
  container.appendChild(buildLegend(withIdle));
}

// ── Insert IDLE blocks for CPU gaps ─────────────────────
function insertIdleBlocks(gantt) {
  const result = [];
  for (let i = 0; i < gantt.length; i++) {
    if (i > 0 && gantt[i].start > result[result.length - 1].end) {
      result.push({
        pid:   "IDLE",
        start: result[result.length - 1].end,
        end:   gantt[i].start,
      });
    }
    result.push({ ...gantt[i] });
  }
  return result;
}

// ── Build color legend ───────────────────────────────────
function buildLegend(gantt) {
  const seen = new Set();
  const div  = document.createElement("div");
  div.className = "gantt-legend";

  gantt.forEach(b => {
    if (seen.has(b.pid)) return;
    seen.add(b.pid);

    const item = document.createElement("div");
    item.className = "legend-item";

    const swatch = document.createElement("div");
    swatch.className = "legend-swatch";
    const color = getPidColor(b.pid);
    swatch.style.background = color || "var(--surface2)";
    swatch.style.border     = color ? "none" : "1px solid var(--border)";

    item.appendChild(swatch);
    item.appendChild(document.createTextNode(
      b.pid === "IDLE" ? "IDLE (CPU idle)" : b.pid
    ));
    div.appendChild(item);
  });

  return div;
}

// ════════════════════════════════════════════════════════
//  PERSON 4 — NOTES
//
//  - Colors are SHARED between RR and Priority charts.
//    pidColorMap is a global object — same PID = same color.
//    This is intentional so viewers can easily compare.
//
//  - IDLE blocks (grey) appear automatically when there is
//    a gap between blocks in the gantt array.
//
//  - Block widths are PROPORTIONAL to their duration.
//    Long processes appear wider than short ones.
//
//  - The chart scrolls horizontally if it's too wide.
//    CSS in style.css handles this via overflow-x: auto.
//
//  - Hover over any block to see its exact timing in a tooltip.
// ════════════════════════════════════════════════════════
