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
import { memoryManager } from "@/api/memory";
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

export default function MemoryChart() {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    memory: [] as number[],
  });
  const [currentMemory, setCurrentMemory] = useState({
    inuse: 0,
    oslimit: 0,
  });

  useEffect(() => {
    // Fetch initial data
    const memory = memoryManager.fetchData();

    // Convert timestamps to time strings
    const labels = memory.labels.map((timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    });

    setChartData({
      labels,
      memory: memory.memory,
    });

    // Subscribe to updates
    const unsubscribe = memoryManager.subscribe((data) => {
      setCurrentMemory(data);
      const memory = memoryManager.fetchData();
      const labels = memory.labels.map((timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      });

      setChartData({
        labels,
        memory: [...memory.memory],
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
        label: "Memory Usage",
        data: chartData.memory,
        borderColor: "rgb(168, 85, 247)", // purple-500
        backgroundColor: "rgba(168, 85, 247, 0.2)",
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
              label += formatBytes(context.parsed.y);
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
            return formatBytes(value as number);
          },
          color: "rgb(148, 163, 184)", // slate-400
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const usagePercentage =
    currentMemory.oslimit > 0
      ? ((currentMemory.inuse / currentMemory.oslimit) * 100).toFixed(1)
      : "0";

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Memory Usage</CardTitle>
          <div className="text-sm text-muted-foreground">
            {formatBytes(currentMemory.inuse)} /{" "}
            {formatBytes(currentMemory.oslimit)}
            <span className="ml-2 text-primary">({usagePercentage}%)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
