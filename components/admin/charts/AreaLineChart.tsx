interface Point {
  label: string;
  value: number;
}

function niceMax(value: number): number {
  if (value <= 0) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}

function formatDayLabel(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

export default function AreaLineChart({ data, color = "var(--accent)" }: { data: Point[]; color?: string }) {
  const width = 640;
  const height = 220;
  const padding = { top: 16, right: 12, bottom: 26, left: 12 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + innerH - (d.value / max) * innerH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const baseY = padding.top + innerH;
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1].x.toFixed(1)},${baseY} L${points[0].x.toFixed(1)},${baseY} Z`
      : "";

  const last = points[points.length - 1];
  const labelIndexes =
    data.length <= 1 ? [0] : Array.from(new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Évolution des visites">
      {[0, 0.25, 0.5, 0.75, 1].map((g) => {
        const y = padding.top + innerH * g;
        return <line key={g} x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="chart-grid" />;
      })}
      {areaPath && <path d={areaPath} fill={color} opacity="0.1" stroke="none" />}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {last && (
        <>
          <circle cx={last.x} cy={last.y} r="4" fill={color} stroke="var(--surface)" strokeWidth="2" />
          <text x={last.x} y={Math.max(last.y - 12, 12)} textAnchor="end" className="chart-value-label">
            {last.value}
          </text>
        </>
      )}
      {labelIndexes.map((i) => {
        const p = points[i];
        if (!p) return null;
        const anchor = i === 0 ? "start" : i === data.length - 1 ? "end" : "middle";
        return (
          <text key={i} x={p.x} y={height - 6} textAnchor={anchor} className="chart-axis-label">
            {formatDayLabel(p.label)}
          </text>
        );
      })}
    </svg>
  );
}
