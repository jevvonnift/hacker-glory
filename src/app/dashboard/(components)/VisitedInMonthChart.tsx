import type { HTMLAttributes } from "react";
import type { RouterOutputs } from "~/trpc/shared";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props extends HTMLAttributes<HTMLDivElement> {
  visitedData: RouterOutputs["statistic"]["getVisitedInMonth"];
  disableTooltip?: boolean;
}

const VisitedInMonthChart = ({
  visitedData,
  disableTooltip = false,
  className,
  ...props
}: Props) => {
  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height={400} className="mt-2">
        <LineChart
          width={500}
          height={300}
          data={visitedData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          {disableTooltip ? null : <Tooltip />}
          <Legend />
          <Line
            type="monotone"
            dataKey="visited"
            name="Kunjungan"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitedInMonthChart;
