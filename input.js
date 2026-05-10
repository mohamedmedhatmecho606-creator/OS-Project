let processes = [
  { id: "P1", arrival: 0, burst: 6, priority: 2 },
  { id: "P2", arrival: 1, burst: 4, priority: 1 },
  { id: "P3", arrival: 2, burst: 8, priority: 3 },
  { id: "P4", arrival: 3, burst: 3, priority: 1 },
];

const tbody        = document.getElementById("process-tbody");
const errorBox     = document.getElementById("error-box");
const quantumInput = document.getElementById("quantum-input");


function renderTable() {
  tbody.innerHTML = "";

  processes.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text"   class="pid-input"      data-i="${i}" value="${p.id}"       placeholder="P${i+1}" /></td>
      <td><input type="number" class="arrival-input"   data-i="${i}" value="${p.arrival}"  placeholder="0"  min="0" /></td>
      <td><input type="number" class="burst-input"     data-i="${i}" value="${p.burst}"    placeholder="1"  min="1" /></td>
      <td><input type="number" class="priority-input"  data-i="${i}" value="${p.priority}" placeholder="1"  min="1" /></td>
      <td><button class="btn-delete" data-i="${i}" title="Remove row">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".pid-input").forEach(el =>
    el.addEventListener("input", e => { processes[e.target.dataset.i].id = e.target.value.trim(); }));
  tbody.querySelectorAll(".arrival-input").forEach(el =>
    el.addEventListener("input", e => { processes[e.target.dataset.i].arrival = Number(e.target.value); }));
  tbody.querySelectorAll(".burst-input").forEach(el =>
    el.addEventListener("input", e => { processes[e.target.dataset.i].burst = Number(e.target.value); }));
  tbody.querySelectorAll(".priority-input").forEach(el =>
    el.addEventListener("input", e => { processes[e.target.dataset.i].priority = Number(e.target.value); }));

  tbody.querySelectorAll(".btn-delete").forEach(btn =>
    btn.addEventListener("click", e => {
      processes.splice(Number(e.target.dataset.i), 1);
      renderTable();
    }));
}

document.getElementById("btn-add-row").addEventListener("click", () => {
  const n = processes.length + 1;
  processes.push({ id: `P${n}`, arrival: 0, burst: 1, priority: 1 });
  renderTable();
});

document.getElementById("btn-reset").addEventListener("click", () => {
  processes = [
    { id: "P1", arrival: 0, burst: 6, priority: 2 },
    { id: "P2", arrival: 1, burst: 4, priority: 1 },
    { id: "P3", arrival: 2, burst: 8, priority: 3 },
    { id: "P4", arrival: 3, burst: 3, priority: 1 },
  ];
  quantumInput.value = 2;
  renderTable();
  showError("");
  hideResults();
  document.getElementById("test-description").textContent = "";
});


function validate() {
  const errors = [];

  if (processes.length < 2) errors.push("⚠ At least 2 processes are required.");

  const ids = [];
  processes.forEach((p, i) => {
    const row = i + 1;

    if (!p.id || p.id.trim() === "")
      errors.push(`⚠ Row ${row}: Process ID cannot be empty.`);

    if (ids.includes(p.id.trim()))
      errors.push(`⚠ Row ${row}: Duplicate Process ID "${p.id}".`);
    else ids.push(p.id.trim());

    if (isNaN(p.arrival) || p.arrival < 0)
      errors.push(`⚠ Row ${row}: Arrival time must be ≥ 0.`);

    if (isNaN(p.burst) || p.burst < 1)
      errors.push(`⚠ Row ${row}: Burst time must be ≥ 1.`);

    if (isNaN(p.priority) || p.priority < 1 || !Number.isInteger(p.priority))
      errors.push(`⚠ Row ${row}: Priority must be a whole number ≥ 1.`);
  });

  const q = Number(quantumInput.value);
  if (isNaN(q) || q < 1 || !Number.isInteger(q))
    errors.push("⚠ Time Quantum must be a whole number ≥ 1.");

  return errors;
}

function showError(msg) {
  if (!msg) { errorBox.classList.add("hidden"); errorBox.innerHTML = ""; }
  else       { errorBox.classList.remove("hidden"); errorBox.innerHTML = msg; }
}

function hideResults() {
  ["section-gantt", "section-metrics", "section-comparison"].forEach(id =>
    document.getElementById(id).classList.add("hidden"));
}


function syncFromTable() {
  tbody.querySelectorAll("tr").forEach((tr, i) => {
    if (!processes[i]) return;
    processes[i].id       = tr.querySelector(".pid-input").value.trim();
    processes[i].arrival  = Number(tr.querySelector(".arrival-input").value);
    processes[i].burst    = Number(tr.querySelector(".burst-input").value);
    processes[i].priority = Number(tr.querySelector(".priority-input").value);
  });
}


document.getElementById("btn-run").addEventListener("click", () => {
  syncFromTable();

  const errors = validate();
  if (errors.length > 0) { showError(errors.join("<br>")); return; }
  showError("");

  const quantum = Number(quantumInput.value);

  // Update Gantt title to include quantum
  document.getElementById("gantt-rr-title").textContent =
    `Round Robin  |  Quantum = ${quantum}`;


  const rrResult = runRoundRobin(processes.map(p => ({...p})), quantum);
  const prResult = runPriority(processes.map(p => ({...p})));

  renderGanttChart("gantt-rr", rrResult.gantt);
  renderGanttChart("gantt-pr", prResult.gantt);

  const rrMetrics = calculateMetrics(rrResult.procs);
  const prMetrics = calculateMetrics(prResult.procs);
  renderMetricsTable("metrics-rr", rrMetrics);
  renderMetricsTable("metrics-pr", prMetrics);

  renderComparison(rrMetrics, prMetrics);

  // Show sections
  ["section-gantt","section-metrics","section-comparison"].forEach(id =>
    document.getElementById(id).classList.remove("hidden"));

  document.getElementById("section-gantt").scrollIntoView({ behavior: "smooth" });
});

function loadTestScenario(num) {
  const desc = document.getElementById("test-description");
  hideResults();
  showError("");

  if (num === 1) {
    processes = [
      { id: "P1", arrival: 0, burst: 6, priority: 2 },
      { id: "P2", arrival: 1, burst: 4, priority: 1 },
      { id: "P3", arrival: 2, burst: 8, priority: 3 },
      { id: "P4", arrival: 3, burst: 3, priority: 1 },
    ];
    quantumInput.value = 2;
    desc.textContent =
      "TEST 1 — Normal Case\n" +
      "Four processes with different arrivals, bursts, and priorities.\n" +
      "Quantum = 2\n" +
      "Expected: Both algorithms complete all processes.\n" +
      "Priority will favor P2 and P4 (priority 1) over P1 and P3.";

  } else if (num === 2) {
    processes = [
      { id: "P1", arrival: 0, burst: 10, priority: 3 },
      { id: "P2", arrival: 1, burst: 2,  priority: 1 },
      { id: "P3", arrival: 2, burst: 3,  priority: 1 },
      { id: "P4", arrival: 3, burst: 8,  priority: 2 },
    ];
    quantumInput.value = 3;
    desc.textContent =
      "TEST 2 — Urgency Reveal\n" +
      "P1 is long but LOW priority. P2 and P3 are high priority (1).\n" +
      "Quantum = 3\n" +
      "Expected: Priority scheduling immediately preempts P1 when P2 arrives.\n" +
      "P2 and P3 finish very quickly under Priority. Under RR, P1 still gets equal turns.\n" +
      "This reveals the urgency advantage of Priority and fairness advantage of RR.\n" +
      "Also shows P1 risk of starvation under Priority if many high-priority jobs keep arriving.";

  } else if (num === 3) {
    processes = [
      { id: "P1", arrival: -2,  burst: 5,  priority: 1 },
      { id: "P1", arrival: 0,   burst: 0,  priority: 0 },
      { id: "",   arrival: 1,   burst: 3,  priority: 2 },
    ];
    quantumInput.value = 0;
    desc.textContent =
      "TEST 3 — Invalid Input Validation\n" +
      "Contains: negative arrival time, duplicate ID (P1), empty ID,\n" +
      "burst = 0, priority = 0, quantum = 0.\n" +
      "Expected: App shows clear error messages for EVERY violation\n" +
      "and does NOT run the simulation.";
  }

  renderTable();
  document.getElementById("section-input").scrollIntoView({ behavior: "smooth" });
}

renderTable();
