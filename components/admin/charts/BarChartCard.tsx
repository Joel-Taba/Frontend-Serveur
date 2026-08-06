interface BarDatum {
  label: string;
  value: number;
}

function roundedTopRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.min(r, w / 2, h);
  return `M${x},${y + h} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h} Z`;
}

export default function BarChartCard({ data, color = "var(--accent)" }: { data: BarDatum[]; color?: string }) {
  const width = 640;
  const height = 200;
  const padding = { top: 24, right: 16, bottom: 28, left: 16 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(...data.map((d) => d.value), 1);
  const gap = 28;
  const barWidth = Math.min(24, (innerW - gap * Math.max(data.length - 1, 0)) / Math.max(data.length, 1));
  const totalWidth = barWidth * data.length + gap * Math.max(data.length - 1, 0);
  const startX = padding.left + (innerW - totalWidth) / 2;
  const baseY = padding.top + innerH;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Documents par catégorie">
      <line x1={padding.left} x2={width - padding.right} y1={baseY} y2={baseY} className="chart-baseline" />
      {data.map((d, i) => {
        const x = startX + i * (barWidth + gap);
        const barHeight = Math.max((d.value / max) * innerH, 2);
        const y = baseY - barHeight;
        return (
          <g key={d.label}>
            <path d={roundedTopRectPath(x, y, barWidth, barHeight, 4)} fill={color} />
            <text x={x + barWidth / 2} y={Math.max(y - 8, 12)} textAnchor="middle" className="chart-value-label">
              {d.value}
            </text>
            <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" className="chart-axis-label">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
