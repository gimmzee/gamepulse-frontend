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
import { formatPrice } from "../utils/formatters";

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

export default function PriceChart({ prices }) {
  if (!prices || prices.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gaming-muted">
        가격 이력 데이터가 없습니다.
      </div>
    );
  }

  const sorted = [...prices].sort(
    (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
  );

  const labels = sorted.map((p) =>
    new Date(p.recordedAt).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: "가격",
        data: sorted.map((p) => p.price),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#1a2234",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        borderColor: "#1f2937",
        borderWidth: 1,
        titleColor: "#94a3b8",
        bodyColor: "#e2e8f0",
        callbacks: {
          label: (ctx) => `  ${formatPrice(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(31, 41, 55, 0.6)" },
        ticks: { color: "#94a3b8", font: { size: 11 } },
        border: { color: "#1f2937" },
      },
      y: {
        grid: { color: "rgba(31, 41, 55, 0.6)" },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (v) => formatPrice(v),
        },
        border: { color: "#1f2937" },
      },
    },
  };

  return (
    <div className="h-64 sm:h-80">
      <Line data={data} options={options} />
    </div>
  );
}
