interface HBarDatum {
  label: string;
  value: number;
  color: string;
}

export default function HorizontalBars({ data }: { data: HBarDatum[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="hbar-list">
      {data.map((d) => (
        <div className="hbar-row" key={d.label}>
          <span className="hbar-label">
            <span className="hbar-dot" style={{ background: d.color }} />
            {d.label}
          </span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${(d.value / max) * 100}%`, background: d.color }} />
          </div>
          <span className="hbar-value">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
