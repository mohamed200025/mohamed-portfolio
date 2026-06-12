"use client";

export function MuhlentechnikMobileUI() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="h-4 w-4 rounded bg-blue-600" />
        <div className="flex flex-col gap-0.5">
          <div className="h-0.5 w-4 rounded bg-gray-400" />
          <div className="h-0.5 w-4 rounded bg-gray-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-3 py-4">
        <p className="text-[6px] font-medium uppercase text-cyan-400">Agriculture</p>
        <h2 className="mt-1 text-[9px] font-bold leading-tight text-white">
          Innovative Technology
        </h2>
        <div className="mt-2 h-12 rounded bg-slate-700/50" />
      </div>

      <div className="space-y-2 p-3">
        {["Silos", "Conveyors"].map((item) => (
          <div key={item} className="flex gap-2 rounded-lg border border-gray-100 p-2">
            <div className="h-8 w-8 shrink-0 rounded bg-blue-100" />
            <div>
              <p className="text-[7px] font-semibold text-gray-800">{item}</p>
              <p className="text-[6px] text-gray-400">View details</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
