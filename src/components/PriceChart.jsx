import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PLATFORM_COLORS = {
  Steam: "#3b82f6",
  "Epic Games": "#8b5cf6",
};

const FALLBACK_COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#a78bfa",
];

const DEFAULT_USD_TO_KRW = 1350;

function getPlatformColor(name, fallbackIdx) {
  return (
    PLATFORM_COLORS[name] ??
    FALLBACK_COLORS[fallbackIdx % FALLBACK_COLORS.length]
  );
}

function formatXDate(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function formatKRW(amount) {
  if (amount === 0) return "무료";
  return `₩${Number(amount).toLocaleString("ko-KR")}`;
}

function convertToKRW(amount, currency, usdToKrw) {
  if (currency === "USD") return Math.round(amount * usdToKrw);
  if (currency === "EUR") return Math.round(amount * usdToKrw * 1.08);
  return amount;
}

function getEntryCurrency(entry) {
  return entry.deal?.price?.currency ?? entry.currency ?? "KRW";
}

function formatOriginalPrice(rawAmount, currency) {
  if (currency === "USD") return `USD $${rawAmount.toFixed(2)}`;
  if (currency === "EUR") return `EUR €${rawAmount.toFixed(2)}`;
  return null;
}

export default function PriceChart({ prices }) {
  const [usdToKrw, setUsdToKrw] = useState(DEFAULT_USD_TO_KRW);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((r) => r.json())
      .then((data) => {
        const rate = data?.rates?.KRW;
        if (rate && typeof rate === "number") setUsdToKrw(rate);
      })
      .catch(() => {});
  }, []);

  if (!prices || prices.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gaming-muted">
        가격 이력 데이터가 없습니다.
      </div>
    );
  }

  // 플랫폼별로 그룹핑 + 환율 변환
  const platformMap = {};
  prices.forEach((entry) => {
    const name = entry.shop?.name ?? "Unknown";
    if (!platformMap[name]) platformMap[name] = [];
    const rawAmount = entry.deal?.price?.amount ?? null;
    const currency = getEntryCurrency(entry);
    const amount =
      rawAmount != null ? convertToKRW(rawAmount, currency, usdToKrw) : null;
    platformMap[name].push({
      dateLabel: formatXDate(entry.timestamp),
      amount,
      rawAmount,
      currency,
      cut: entry.deal?.cut ?? 0,
    });
  });

  // 각 플랫폼 날짜 오름차순 정렬
  Object.values(platformMap).forEach((arr) =>
    arr.sort((a, b) => a.dateLabel.localeCompare(b.dateLabel))
  );

  // 전체 고유 날짜 레이블 (오름차순)
  const allLabels = [
    ...new Set(Object.values(platformMap).flat().map((e) => e.dateLabel)),
  ].sort();

  const platformNames = Object.keys(platformMap);
  const isMultiPlatform = platformNames.length > 1;

  const datasets = platformNames.map((name, idx) => {
    const color = getPlatformColor(name, idx);
    const byDate = new Map(platformMap[name].map((e) => [e.dateLabel, e]));
    return {
      label: name,
      data: allLabels.map((d) => byDate.get(d)?.amount ?? null),
      // 툴팁용 메타 (Chart.js가 무시하는 커스텀 필드)
      entryMeta: allLabels.map((d) => byDate.get(d) ?? null),
      borderColor: color,
      backgroundColor: isMultiPlatform ? `${color}12` : `${color}18`,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointBorderColor: "#1a2234",
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.3,
      fill: !isMultiPlatform,
      spanGaps: true,
    };
  });

  const chartData = { labels: allLabels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#94a3b8",
          font: { size: 12 },
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        borderColor: "#1f2937",
        borderWidth: 1,
        titleColor: "#94a3b8",
        bodyColor: "#e2e8f0",
        padding: 10,
        callbacks: {
          title: (items) => items[0]?.label ?? "",
          label: (ctx) => {
            if (ctx.parsed.y == null) return null;
            const meta = ctx.dataset.entryMeta?.[ctx.dataIndex];
            const cut = meta?.cut;
            let line = `  ${ctx.dataset.label}: ${formatKRW(ctx.parsed.y)}`;
            if (cut > 0) line += `  (-${cut}%)`;
            if (
              meta?.currency &&
              meta.currency !== "KRW" &&
              meta.rawAmount != null
            ) {
              const orig = formatOriginalPrice(meta.rawAmount, meta.currency);
              if (orig) line += ` (${orig})`;
            }
            return line;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(31, 41, 55, 0.6)" },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          maxTicksLimit: 8,
          maxRotation: 0,
        },
        border: { color: "#1f2937" },
      },
      y: {
        min: 0,
        grid: { color: "rgba(31, 41, 55, 0.6)" },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (v) => (v === 0 ? "무료" : formatKRW(v)),
        },
        border: { color: "#1f2937" },
      },
    },
  };

  return (
    <div className="h-64 sm:h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}
