// ════════════════════════════════════════════════════════
//  priority.js  —  PERSON 3: Preemptive Priority Scheduling
//
//  PRIORITY RULE (state this clearly in your report):
//    → Lower number = Higher urgency
//    → Priority 1 runs before Priority 2, etc.
//    → When a higher-priority process arrives, it IMMEDIATELY
//      preempts the currently running process (preemptive).
//
//  INPUT:
//    processes → [ { id, arrival, burst, priority }, ... ]
//
//  OUTPUT:
//    {
//      gantt: [ { pid, start, end }, ... ],   ← merged blocks
//      procs: [ { id, arrival, burst, priority,
//                 finishTime, firstRunTime }, ... ]
//    }
//
//  TIE-BREAKING (when two processes have equal priority):
//    1. Earlier arrival time wins
//    2. If still tied → alphabetical process ID
//
//  STARVATION NOTE:
//    Low-priority processes may never run if high-priority
//    processes keep arriving. This is a known limitation.
//    Discuss this in your report!
// ════════════════════════════════════════════════════════

function runPriority(processes) {

  const procs = processes.map(p => ({
    ...p,
    remaining:    p.burst,
    finishTime:   null,
    firstRunTime: null,
  }));

  const n       = procs.length;
  let time      = Math.min(...procs.map(p => p.arrival));
  let done      = 0;
  const ganttRaw = [];

  while (done < n) {

    // All processes that have arrived and still have work
    const available = procs.filter(p => p.arrival <= time && p.remaining > 0);

    if (available.length === 0) {
      // CPU idle — jump to next arrival
      const upcoming = procs.filter(p => p.remaining > 0 && p.arrival > time);
      if (upcoming.length === 0) break;
      time = Math.min(...upcoming.map(p => p.arrival));
      continue;
    }

    // ── Pick highest priority (lowest number) ──
    // Tie-break 1: earliest arrival
    // Tie-break 2: alphabetical ID
    available.sort((a, b) =>
      a.priority - b.priority ||
      a.arrival  - b.arrival  ||
      a.id.localeCompare(b.id)
    );

    const current = available[0];

    // Record first CPU access
    if (current.firstRunTime === null) {
      current.firstRunTime = time;
    }

    // ── Run until: process finishes OR higher-priority arrives ──
    const nextArrivals = procs
      .filter(p => p.arrival > time && p.remaining > 0)
      .map(p => p.arrival);

    const nextEvent   = nextArrivals.length > 0 ? Math.min(...nextArrivals) : Infinity;
    const canRunUntil = time + current.remaining;
    const runUntil    = Math.min(canRunUntil, nextEvent);
    const duration    = runUntil - time;

    ganttRaw.push({ pid: current.id, start: time, end: runUntil });

    current.remaining -= duration;
    time               = runUntil;

    if (current.remaining <= 0) {
      current.finishTime = time;
      done++;
    }
    // If a new arrival triggered the stop, the loop re-evaluates
    // and may preempt current process with the new higher-priority one
  }

  return { gantt: mergeGantt(ganttRaw), procs };
}

// ── Merge consecutive same-process blocks ────────────────
function mergeGantt(raw) {
  if (raw.length === 0) return [];
  const merged = [{ ...raw[0] }];
  for (let i = 1; i < raw.length; i++) {
    const last = merged[merged.length - 1];
    if (raw[i].pid === last.pid && raw[i].start === last.end) {
      last.end = raw[i].end;
    } else {
      merged.push({ ...raw[i] });
    }
  }
  return merged;
}

// ════════════════════════════════════════════════════════
//  PERSON 3 — QUICK TEST (paste in browser console):
//
//  const t = [
//    { id:"P1", arrival:0, burst:10, priority:3 },
//    { id:"P2", arrival:1, burst:2,  priority:1 },
//    { id:"P3", arrival:2, burst:3,  priority:1 },
//    { id:"P4", arrival:3, burst:8,  priority:2 },
//  ];
//  console.log(runPriority(t));
//
//  Expected: P1 runs 0-1, then P2 PREEMPTS at t=1 (priority 1 > priority 3).
//  P2 finishes at t=3. P3 runs next (same priority, earlier arrival).
//  P3 finishes at t=6. P4 runs (priority 2). P1 resumes last.
//  P1 was starved for a long time due to low priority!
// ════════════════════════════════════════════════════════
