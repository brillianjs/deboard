import TrafficNow from "./TrafficNow";
import TrafficChart from "./TrafficChart";
import MemoryChart from "./MemoryChart";

export default function Home(): React.JSX.Element {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Overview
        </h1>
      </div>

      {/* Traffic Stats */}
      <div>
        <TrafficNow />
      </div>

      {/* Traffic Chart */}
      <div>
        <TrafficChart />
      </div>

      {/* Memory Chart */}
      <div>
        <MemoryChart />
      </div>
    </div>
  );
}
