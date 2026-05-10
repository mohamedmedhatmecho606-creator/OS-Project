function calculateMetrics(procs) {
 
    const results = procs.map(p => {
 

        const tat = p.finishTime   - p.arrival;
        const wt  = tat            - p.burst;
        const rt  = p.firstRunTime - p.arrival;
 
        const warnings = [];
        if (wt  < 0) warnings.push(`WT is negative (${wt}) — check algorithm`);
        if (rt  < 0) warnings.push(`RT is negative (${rt}) — check firstRunTime`);
        if (tat < 0) warnings.push(`TAT is negative — finishTime may be wrong`);
 

        const avgBurst = procs.reduce((s, q) => s + q.burst, 0) / procs.length;
        if (wt > 3 * avgBurst) {
            warnings.push(`High WT (${wt}) — possible starvation due to low priority`);
        }
 
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
 

    let html = `
        <table class="metrics-table">
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
            <tbody>
    `;
 

    rows.forEach(r => {
        const hasWarning = r.warnings.length > 0;
        const rowStyle   = hasWarning ? 'style="background:rgba(248,113,113,0.05)"' : '';
 
  
        const prioColor = r.priority === 1
            ? 'var(--accent-rr)'
            : r.priority === 2
                ? 'var(--accent-pr)'
                : 'var(--text-muted)';
 
        html += `<tr ${rowStyle}>`;
        html += `<td>${r.id}</td>`;
        html += `<td style="color:${prioColor};font-weight:600">${r.priority}</td>`;
        html += `<td>${r.arrival}</td>`;
        html += `<td>${r.burst}</td>`;
        html += `<td>${r.finishTime}</td>`;
        html += `<td>${r.rt}</td>`;
        html += `<td>${r.wt}</td>`;
        html += `<td>${r.tat}</td>`;
        html += `</tr>`;
 
        // Warning row if any issues detected
        if (hasWarning) {
            html += `
                <tr>
                    <td colspan="8" style="color:var(--accent-err);font-size:0.76rem;padding:3px 12px 6px;">
                        ${r.warnings.join(" | ")}
                    </td>
                </tr>`;
        }
    });
 

    html += `
        <tr class="avg-row" style="font-weight:bold; background:#fffde7; color:#333">
            <td colspan="5">Average</td>
            <td>${averages.rt}</td>
            <td>${averages.wt}</td>
            <td>${averages.tat}</td>
        </tr>`;
 
    html += `</tbody></table>`;
 

    html += `
        <div class="metrics-summary">
            <span>Avg WT: <strong>${averages.wt}</strong></span>
            <span>Avg TAT: <strong>${averages.tat}</strong></span>
            <span>Avg RT: <strong>${averages.rt}</strong></span>
        </div>`;
 
    container.innerHTML = html;
}
