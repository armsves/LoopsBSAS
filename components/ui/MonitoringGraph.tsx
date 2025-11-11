"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function MonitoringGraph() {
  // Generate sample data points for the graph
  const dataPoints = [
    { x: 0, y: 20 },
    { x: 20, y: 35 },
    { x: 40, y: 50 },
    { x: 60, y: 65 },
    { x: 80, y: 80 },
    { x: 100, y: 99.7 },
  ];

  const maxY = 100;
  const maxX = 100;

  // Create SVG path for the line
  const pathData = dataPoints
    .map((point, index) => {
      const x = (point.x / maxX) * 100;
      const y = 100 - (point.y / maxY) * 100; // Invert Y for SVG coordinates
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl p-6"
      style={{
        backgroundColor: "#1F1F23",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold">Life Monitoring</h3>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" style={{ color: "#22c55e" }} />
          <span className="text-sm font-semibold" style={{ color: "#22c55e" }}>99.7%</span>
        </div>
      </div>

      <div className="relative" style={{ height: "200px" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0"
        >
          {/* Y-axis labels */}
          {[0, 20, 40, 60, 80, 100].map((value) => (
            <text
              key={value}
              x="5"
              y={100 - value + 3}
              fontSize="7"
              fill="var(--secondary)"
              textAnchor="start"
              style={{ fontFamily: "monospace" }}
            >
              {value}
            </text>
          ))}

          {/* Grid lines */}
          {[0, 20, 40, 60, 80, 100].map((value) => (
            <line
              key={value}
              x1="12"
              y1={100 - value}
              x2="100"
              y2={100 - value}
              stroke="var(--border)"
              strokeWidth="0.3"
              opacity="0.2"
            />
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FF6A00" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF6A00" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Graph line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Data point dot */}
          <motion.circle
            cx="100"
            cy="0.3"
            r="3"
            fill="#FF6A00"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

