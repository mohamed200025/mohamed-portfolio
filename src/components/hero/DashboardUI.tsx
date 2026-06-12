"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Total Students", value: "2,847", change: "+12.5%", color: "text-cyan-400" },
  { label: "Active Courses", value: "48", change: "+3", color: "text-violet-400" },
  { label: "Revenue", value: "$84.2K", change: "+8.2%", color: "text-emerald-400" },
  { label: "Completion", value: "94%", change: "+2.1%", color: "text-amber-400" },
];

const courses = [
  { name: "Web Development", students: 342, progress: 78 },
  { name: "Data Science", students: 256, progress: 65 },
  { name: "UI/UX Design", students: 189, progress: 92 },
];

export function DashboardUI() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#0d1117] text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-violet-600">
            <span className="text-[8px] font-bold">E</span>
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Eduvera</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-white/10" />
          <div className="h-5 w-16 rounded-md bg-white/5" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex w-10 flex-col items-center gap-3 border-r border-white/5 py-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-5 w-5 rounded-md ${i === 0 ? "bg-cyan-500/30" : "bg-white/5"}`}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden p-3">
          <p className="mb-2 text-[9px] font-medium text-white/40">Dashboard Overview</p>

          {/* Stats grid */}
          <div className="mb-3 grid grid-cols-4 gap-1.5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <p className="text-[7px] text-white/40">{stat.label}</p>
                <p className="text-[11px] font-bold">{stat.value}</p>
                <p className={`text-[7px] ${stat.color}`}>{stat.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Chart */}
            <div className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
              <p className="mb-2 text-[8px] font-medium text-white/50">Enrollments Overview</p>
              <div className="flex h-16 items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500/60 to-cyan-400/20"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1 + i * 0.05, duration: 0.5 }}
                  />
                ))}
              </div>
            </div>

            {/* Donut chart */}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
              <p className="mb-1 text-[8px] font-medium text-white/50">Traffic Source</p>
              <div className="relative mx-auto h-14 w-14">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#22d3ee" strokeWidth="4" strokeDasharray="35 65" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-35" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="-60" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold">68%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top courses */}
          <div className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
            <p className="mb-1.5 text-[8px] font-medium text-white/50">Top Courses</p>
            {courses.map((course) => (
              <div key={course.name} className="mb-1.5 flex items-center gap-2 last:mb-0">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-[7px] text-white/70">{course.name}</span>
                    <span className="text-[7px] text-white/40">{course.students}</span>
                  </div>
                  <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
