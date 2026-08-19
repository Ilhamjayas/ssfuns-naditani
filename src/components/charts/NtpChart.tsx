"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { NTPData, NTPProjection } from "@/lib/types";

interface NtpChartProps {
  historicalData: NTPData[];
  projectionData?: NTPProjection[];
  height?: number;
}

// Custom tooltip to show detailed values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-800 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-primary-700">
            <span className="inline-block w-3 h-3 bg-primary-600 rounded-full mr-2"></span>
            NTP Nasional: <span className="font-medium">{data.ntp?.toFixed(2) || data.nilai_proyeksi?.toFixed(2)}</span>
          </p>
          {data.ntup && (
            <p className="text-sm text-gold-dark">
              <span className="inline-block w-3 h-3 bg-gold rounded-full mr-2"></span>
              NTUP: <span className="font-medium">{data.ntup.toFixed(2)}</span>
            </p>
          )}
          {data.isProjection && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-medium text-warning flex items-center">
                <span className="inline-block w-2 h-2 bg-warning rounded-full mr-2"></span>
                Data Proyeksi (Simulasi)
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function NtpChart({ historicalData, projectionData = [], height = 400 }: NtpChartProps) {
  // Combine historical and projection data for the chart
  const combinedData = [...historicalData, ...(projectionData as unknown[] || [])].map((item: unknown) => {
    const dataItem = item as Record<string, unknown>;
    return {
      ...dataItem,
      // Provide a unified date key for XAxis
      displayDate: new Date((dataItem.month || dataItem.periode) as string).toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
      // Differentiate actual vs predicted for styling
      isProjection: "isProjection" in dataItem ? dataItem.isProjection : false,
    };
  });

  // Find the index where projection starts for the ReferenceArea
  const projectionStartIndex = combinedData.findIndex((item) => item.isProjection);


  return (
    <div className={height === 400 ? 'h-[300px] w-full sm:h-[400px]' : 'w-full'} style={height === 400 ? undefined : { height }}>
      <ResponsiveContainer>
        <LineChart
          data={combinedData}
          margin={{ top: 16, right: 10, left: 0, bottom: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickMargin={10}
            minTickGap={30}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />

          {/* Highlight projection area */}
          {projectionStartIndex !== -1 && (
            <ReferenceArea
              x1={combinedData[projectionStartIndex].displayDate}
              x2={combinedData[combinedData.length - 1].displayDate}
              fill="#fef3c7"
              fillOpacity={0.3}
            />
          )}

          <Line
            type="monotone"
            name="NTP Nasional"
            dataKey={(d) => d.ntp}
            stroke="#059669" // primary-500
            strokeWidth={3}
            dot={{ r: 4, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />

          <Line
            type="monotone"
            name="NTUP"
            dataKey="ntup"
            stroke="#D8A528" // gold
            strokeWidth={2}
            dot={false}
            connectNulls
          />

          {/* Optional: Add bounds for projection if needed, though it clutters the chart slightly */}
          {projectionData.length > 0 && (
             <Line
               type="monotone"
               name="Batas Atas"
               dataKey="batas_atas"
               stroke="#cbd5e1"
               strokeWidth={1}
               strokeDasharray="5 5"
               dot={false}
               connectNulls
               legendType="none"
             />
          )}
          {projectionData.length > 0 && (
             <Line
               type="monotone"
               name="Batas Bawah"
               dataKey="batas_bawah"
               stroke="#cbd5e1"
               strokeWidth={1}
               strokeDasharray="5 5"
               dot={false}
               connectNulls
               legendType="none"
             />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
