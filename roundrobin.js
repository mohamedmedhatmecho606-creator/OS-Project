function runRoundRobin(processes, quantum) {
 

    const originalBurst   = processes.map(p => p.burst);
    const arrivalTimes    = processes.map(p => p.arrival);
    const ids             = processes.map(p => p.id);
 
    let finalPoint = originalBurst.reduce((a, b) => a + b, 0);
    let Trace      = 0;
 

    let workingBurst  = [...originalBurst];
    let workingIndex  = originalBurst.map((_, i) => i); 
    let FinishTimes      = new Array(processes.length).fill(null);
    let firstRunTracker  = new Array(processes.length).fill(null);
    let WaitingTime      = new Array(processes.length).fill(0);
    let TATList          = new Array(processes.length).fill(0);
 
    let ganttRaw = [];
 
    while (Trace != finalPoint) {
        for (let i = 0; i < workingBurst.length; i++) {
            let pBurstTime = workingBurst[i];
            let origIdx    = workingIndex[i];
 

            if (firstRunTracker[origIdx] === null) {
                firstRunTracker[origIdx] = Trace;
            }
 
            if (pBurstTime > quantum) {

                ganttRaw.push({ pid: ids[origIdx], start: Trace, end: Trace + quantum });
                Trace            += quantum;
                workingBurst[i]  -= quantum;
            } else {

                ganttRaw.push({ pid: ids[origIdx], start: Trace, end: Trace + pBurstTime });
                Trace += pBurstTime;
 
        
                FinishTimes[origIdx] = Trace;
                TATList[origIdx]     = Trace - arrivalTimes[origIdx];
                WaitingTime[origIdx] = TATList[origIdx] - originalBurst[origIdx];
 
                workingBurst.splice(i, 1);
                workingIndex.splice(i, 1);
                i--;
            }
        }
    }
 

    const procs = processes.map((p, i) => ({
        id:           p.id,
        arrival:      p.arrival,
        burst:        p.burst,
        priority:     p.priority,
        finishTime:   FinishTimes[i],
        firstRunTime: firstRunTracker[i],
    }));
 
    return { gantt: ganttRaw, procs };
}
