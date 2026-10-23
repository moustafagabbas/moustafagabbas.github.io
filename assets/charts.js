// Small hand-made charts, no libraries.

// Unit grid: one square per Phase 1 unit, grouped by price vs policy.
// Sold counts per group come from the analysis notebook (80 units each).
function drawUnitGrid(el) {
  const groups = [
    { label: "At policy price", sold: 59 },
    { label: "~5% above", sold: 43 },
    { label: "~9% above", sold: 29 },
    { label: "~15% above", sold: 13, low: true },
  ];
  el.innerHTML = groups.map(g => {
    let cells = "";
    for (let i = 0; i < 80; i++) cells += i < g.sold ? `<i class="on${g.low ? " low" : ""}"></i>` : "<i></i>";
    const pct = Math.round(g.sold / 80 * 100);
    return `<div class="ublock"><div class="cells">${cells}</div>
      <div class="cap"><span>${g.label}</span><b class="${g.low ? "c-red" : "c-cyan"}">${pct}%</b></div></div>`;
  }).join("");
}

// Neon area chart: cumulative Phase 1 units sold (May 2024 – Dec 2025).
function drawMonthlySales(el) {
  const months = ["2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02",
    "2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12"];
  const units = [3,16,25,32,39,52,63,73,78,84,92,98,104,112,117,122,127,129,140,144];
  const W = 600, H = 200, pad = { l: 30, r: 8, t: 12, b: 24 }, max = 160;
  const x = i => pad.l + i * (W - pad.l - pad.r) / (units.length - 1);
  const y = v => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  // smooth curve through the points
  let d = `M${x(0)},${y(units[0])}`;
  for (let i = 1; i < units.length; i++) {
    const cx = (x(i - 1) + x(i)) / 2;
    d += ` C${cx},${y(units[i - 1])} ${cx},${y(units[i])} ${x(i)},${y(units[i])}`;
  }
  const area = `${d} L${x(units.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const grid = [0, 40, 80, 120, 160].map(v =>
    `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(140,130,255,.12)"/>
     <text class="axis" x="${pad.l - 6}" y="${y(v) + 3}" text-anchor="end">${v}</text>`).join("");
  const ticks = [0, 7, 12, 19].map(i =>
    `<text class="axis" x="${x(i)}" y="${H - 6}" text-anchor="${i === 19 ? "end" : i === 0 ? "start" : "middle"}">${months[i]}</text>`).join("");
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Cumulative units sold, rising to 144 by December 2025">
    <defs>
      <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38d3f5" stop-opacity=".45"/><stop offset="1" stop-color="#38d3f5" stop-opacity="0"/></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    ${grid}${ticks}
    <path d="${area}" fill="url(#ag)"/>
    <path d="${d}" fill="none" stroke="#38d3f5" stroke-width="2.5" filter="url(#glow)" vector-effect="non-scaling-stroke"/>
  </svg>`;
}

document.querySelectorAll("[data-chart=units]").forEach(drawUnitGrid);
document.querySelectorAll("[data-chart=monthly]").forEach(drawMonthlySales);
