const PROCESS_COLORS = [
  "#4F8EF7", "#F7664F", "#4FD18B", "#F7C84F",
  "#B44FF7", "#4FF0F7", "#F74F9E", "#F7994F"
];
const IDLE_COLOR   = "#CBD5E1";
const PX_PER_UNIT  = 50;
const BLOCK_HEIGHT = 50;
 
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
 

function renderGanttChart(containerId, gantt) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
 

  gantt = insertIdleBlocks(gantt);
 
  const totalTime = Math.max(...gantt.map(b => b.end));
 

  const processIds = [...new Set(gantt.map(b => b.pid).filter(id => id !== "IDLE"))];
  const colorMap = {};
  processIds.forEach((id, i) => colorMap[id] = PROCESS_COLORS[i % PROCESS_COLORS.length]);


  const chartWidth = totalTime * PX_PER_UNIT;
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "overflow-x:auto; padding-bottom:8px;";
 

  const track = document.createElement("div");
  track.style.cssText = `position:relative; height:${BLOCK_HEIGHT}px; width:${chartWidth}px; background:#f1f5f9; border-radius:6px;`;
 

  gantt.forEach(block => {
    const div    = document.createElement("div");
    const w      = (block.end - block.start) * PX_PER_UNIT - 2;
    const left   = block.start * PX_PER_UNIT;
    const isIdle = block.pid === "IDLE";
    const bg     = isIdle ? IDLE_COLOR : colorMap[block.pid];
 
    div.style.cssText = `
      position: absolute;
      left: ${left}px;
      width: ${w}px;
      top: 4px;
      height: ${BLOCK_HEIGHT - 8}px;
      background: ${bg};
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: monospace;
      font-size: 13px;
      font-weight: bold;
      color: ${isIdle ? "#888" : "#fff"};
      box-sizing: border-box;
    `;
 

    div.title       = `${block.pid} | t=${block.start} → ${block.end}`;
    div.textContent = isIdle ? "—" : block.pid;
    track.appendChild(div);
  });
 

  const timeline = document.createElement("div");
  timeline.style.cssText = `position:relative; height:24px; width:${chartWidth}px; margin-top:4px;`;
 
  for (let t = 0; t <= totalTime; t++) {
    const tick = document.createElement("div");
    tick.style.cssText = `
      position: absolute;
      left: ${t * PX_PER_UNIT}px;
      transform: translateX(-50%);
      font-family: monospace;
      font-size: 11px;
      color: #64748b;
    `;
    tick.textContent = t;
    timeline.appendChild(tick);
  }
 
  wrapper.appendChild(track);
  wrapper.appendChild(timeline);
  container.appendChild(wrapper);
}
