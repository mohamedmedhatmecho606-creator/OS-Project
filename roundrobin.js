// ════════════════════════════════════════════════════════
//  roundrobin.js  —  PERSON 2: Round Robin Algorithm
//
//  NOTE: Priority column EXISTS in the process objects but
//        Round Robin IGNORES priority — it treats every
//        process equally, cycling through in order.
//        This is the key trade-off vs Priority Scheduling.
//
//  INPUT:
//    processes → [ { id, arrival, burst, priority }, ... ]
//    quantum   → number (time slice per turn)
//
//  OUTPUT:
//    {
//      gantt: [ { pid, start, end }, ... ],
//      procs: [ { id, arrival, burst, priority,
//                 finishTime, firstRunTime, remaining }, ... ]
//    }
//
//  RULES:
//    - Processes enter ready queue sorted by arrival time
//    - Tie on arrival → sort by ID alphabetically
//    - Processes arriving DURING a running slice join at END of queue
//    - Finished process is removed; unfinished re-queued at back
//    - CPU idle if queue empty → jump to next arrival
// ════════════════════════════════════════════════════════

function runRoundRobin(processes, quantum) {

  const procs = processes.map(p => ({
    ...p,
    remaining:    p.burst,
    finishTime:   null,
    firstRunTime: null,
  }));

  let time  = 0;
  let done  = 0;
  const n   = procs.length;
  const gantt  = [];
  const queue  = [];          // indices into procs[]
  const inQueue   = new Array(n).fill(false);
  const finished  = new Array(n).fill(false);

  // ── Enqueue all arrivals up to 'upToTime' ──
  function enqueueArrivals(upToTime) {
    procs
      .map((p, i) => ({ p, i }))
      .filter(({ p, i }) => p.arrival <= upToTime && !inQueue[i] && !finished[i])
      .sort((a, b) => a.p.arrival - b.p.arrival || a.p.id.localeCompare(b.p.id))
      .forEach(({ i }) => { inQueue[i] = true; queue.push(i); });
  }

  // Seed initial queue
  enqueueArrivals(0);
  if (queue.length === 0) {
    time = Math.min(...procs.map(p => p.arrival));
    enqueueArrivals(time);
  }

  while (done < n) {
    // Handle idle CPU
    if (queue.length === 0) {
      const remaining = procs.filter((p, i) => !finished[i] && !inQueue[i]);
      if (remaining.length === 0) break;
      time = Math.min(...remaining.map(p => p.arrival));
      enqueueArrivals(time);
      continue;
    }

    const idx = queue.shift();
    const p   = procs[idx];

    if (p.firstRunTime === null) p.firstRunTime = time;

    const runTime = Math.min(p.remaining, quantum);
    const start   = time;
    const end     = time + runTime;

    gantt.push({ pid: p.id, start, end });
    time        += runTime;
    p.remaining -= runTime;

    // Enqueue processes that arrived during this slice
    procs
      .map((q, i) => ({ q, i }))
      .filter(({ q, i }) => q.arrival > start && q.arrival <= end && !inQueue[i] && !finished[i])
      .sort((a, b) => a.q.arrival - b.q.arrival || a.q.id.localeCompare(b.q.id))
      .forEach(({ i }) => { inQueue[i] = true; queue.push(i); });

    if (p.remaining === 0) {
      p.finishTime  = time;
      finished[idx] = true;
      inQueue[idx]  = false;
      done++;
    } else {
      queue.push(idx);  // back of queue
    }
  }

  return { gantt, procs };
}

// ════════════════════════════════════════════════════════
//  PERSON 2 — QUICK TEST (paste in browser console):
//
//  const t = [
//    { id:"P1", arrival:0, burst:6, priority:2 },
//    { id:"P2", arrival:1, burst:4, priority:1 },
//    { id:"P3", arrival:2, burst:8, priority:3 },
//  ];
//  console.log(runRoundRobin(t, 2));
//
//  Expected Gantt: P1(0-2), P2(2-4), P3(4-6), P1(6-8),
//                  P2(8-9), P3(9-11), P1(11-12), P3(12-14)
//  Priority is IGNORED — every process gets equal time slices.
// ════════════════════════════════════════════════════════
