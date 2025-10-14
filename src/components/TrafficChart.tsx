import { useRef, useState, useEffect } from "react";
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
import type { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trafficManager } from "@/api/traffic";
import { formatBytes } from "@/lib/format";

// Register ChartJS components
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

export default function TrafficChart() {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    up: [] as number[],
    down: [] as number[],
  });

  useEffect(() => {
    // Fetch initial data
    const traffic = trafficManager.fetchData();

    // Convert timestamps to time strings
    const labels = traffic.labels.map((timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    });

    setChartData({
      labels,
      up: traffic.up,
      down: traffic.down,
    });

    // Subscribe to updates
    const unsubscribe = trafficManager.subscribe(() => {
      const traffic = trafficManager.fetchData();
      const labels = traffic.labels.map((timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      });

      setChartData({
        labels,
        up: [...traffic.up],
        down: [...traffic.down],
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Upload",
        data: chartData.up,
        borderColor: "rgb(94, 234, 212)", // teal-300
        backgroundColor: "rgba(94, 234, 212, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Download",
        data: chartData.down,
        borderColor: "rgb(251, 113, 133)", // rose-400
        backgroundColor: "rgba(251, 113, 133, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: window.innerWidth < 768 ? 1.5 : 3,
    animation: {
      duration: 0, // Disable animation for smooth real-time updates
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
          color: "rgb(226, 232, 240)", // slate-200 for dark mode
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatBytes(context.parsed.y) + "/s";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
        type: "category" as const,
      },
      y: {
        type: "linear" as const,
        display: true,
        grid: {
          color: "rgba(148, 163, 184, 0.2)", // slate-500 with opacity
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return formatBytes(value as number) + "/s";
          },
          color: "rgb(148, 163, 184)", // slate-400
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
