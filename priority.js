function runPriority(processes) {
 
    const n             = processes.length;
    const burstTimes    = processes.map(p => p.burst);
    const arrivalTimes  = processes.map(p => p.arrival);
    const priorityList  = processes.map(p => p.priority);
    const ids           = processes.map(p => p.id);
 
    let remaining   = [...burstTimes];
    let WaitingTime = new Array(n).fill(0);
    let TATList     = new Array(n).fill(0);
    let RTList      = new Array(n).fill(-1);
    let FinishTimes = new Array(n).fill(null);
    let ganttRaw    = [];
 
    let Trace     = 0;
    let completed = 0;
 
    while (completed < n) {
        let best = -1;
        for (let i = 0; i < n; i++) {
            if (arrivalTimes[i] <= Trace && remaining[i] > 0) {
                if (best === -1 || priorityList[i] < priorityList[best]) {
                    best = i;
                }
            }
        }
 
        if (best === -1) { Trace++; continue; }
 

        if (RTList[best] === -1) {
            RTList[best] = Trace - arrivalTimes[best];
        }
 

        ganttRaw.push({ pid: ids[best], start: Trace, end: Trace + 1 });
        remaining[best]--;
        Trace++;
 
        if (remaining[best] === 0) {
            completed++;
            FinishTimes[best] = Trace;
            TATList[best]     = Trace - arrivalTimes[best];
            WaitingTime[best] = TATList[best] - burstTimes[best];
        }
    }
 

    let gantt = [];
    for (let i = 0; i < ganttRaw.length; i++) {
        let last = gantt[gantt.length - 1];
        if (last && last.pid === ganttRaw[i].pid && last.end === ganttRaw[i].start) {
            last.end = ganttRaw[i].end;
        } else {
            // FIX 2: copy pid not id
            gantt.push({ pid: ganttRaw[i].pid, start: ganttRaw[i].start, end: ganttRaw[i].end });
        }
    }
 

    const procs = processes.map((p, i) => ({
        id:           p.id,
        arrival:      p.arrival,
        burst:        p.burst,
        priority:     p.priority,
        finishTime:   FinishTimes[i],
        firstRunTime: Trace - TATList[i] + RTList[i] + arrivalTimes[i],  // reconstruct from RTList
    }));
 
    return { gantt, procs };
}
 
