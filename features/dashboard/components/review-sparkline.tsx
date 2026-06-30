"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ReviewSparklineProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function ReviewSparkline({ data }: ReviewSparklineProps) {
  return (
    <div className="mt-4 h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
          <defs>
            <linearGradient id="reviewSparklineFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--admin-lemon)" stopOpacity={0.34} />
              <stop offset="100%" stopColor="var(--admin-lemon)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" hide />
          <YAxis hide domain={[0, "dataMax + 1"]} />
          <Tooltip
            cursor={{ stroke: "rgba(217,249,157,0.22)", strokeWidth: 1 }}
            contentStyle={{
              background: "rgba(2,44,34,0.96)",
              border: "1px solid rgba(217,249,157,0.16)",
              borderRadius: 8,
              color: "white",
              boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
            }}
            labelStyle={{ color: "var(--admin-lemon)" }}
            itemStyle={{ color: "white" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--admin-lemon)"
            strokeWidth={1.75}
            fill="url(#reviewSparklineFill)"
            dot={false}
            activeDot={{ r: 3, fill: "var(--admin-lemon)", stroke: "var(--admin-primary-strong)" }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
