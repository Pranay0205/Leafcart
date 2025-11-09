"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface ScoreDonutChartProps {
  score: number;
  size?: number;
}

export default function ScoreDonutChart({ score, size = 200 }: ScoreDonutChartProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Smooth animation using requestAnimationFrame
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startScore = 0;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(startScore + (score - startScore) * easeProgress);

      setAnimatedScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const data = [
    { name: "Score", value: animatedScore },
    { name: "Remaining", value: 100 - animatedScore },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981"; // emerald-500
    if (score >= 65) return "#eab308"; // yellow-500
    if (score >= 45) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 65) return "Good";
    if (score >= 45) return "Fair";
    return "Needs Work";
  };

  const scoreColor = getScoreColor(animatedScore);
  const scoreLabel = getScoreLabel(animatedScore);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            animationDuration={1500}
            animationBegin={0}
          >
            <Cell key="score" fill={scoreColor} />
            <Cell key="remaining" fill="#27272a" opacity={0.3} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold transition-all duration-300" style={{ color: scoreColor }}>
          {animatedScore}
        </div>
        <div className="text-xs text-zinc-500 font-medium mt-1">out of 100</div>
        <div className="text-sm font-semibold mt-2 transition-colors duration-300" style={{ color: scoreColor }}>
          {scoreLabel}
        </div>
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-20 transition-all duration-300"
        style={{ backgroundColor: scoreColor }}
      />
    </div>
  );
}
