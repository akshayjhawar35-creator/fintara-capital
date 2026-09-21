"use client";

import { Coffee } from "lucide-react";
import { format } from "date-fns";

export default function MyDayPage() {
  const currentDate = new Date();
  const dateStr = format(currentDate, "d MMM yyyy");
  
  // Basic greeting logic
  const hour = currentDate.getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  const name = "Akshay"; // Mock name

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-newsreader font-semibold text-[#101A3D]">
          {greeting}, {name}.
        </h1>
        <p className="text-sm text-slate-500 mt-1">{dateStr}</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Coffee className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">All caught up</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Nothing needs your attention right now. Time for a cup of chai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-[#101A3D] mb-4 border-b border-slate-100 pb-2">Overdue</h2>
          <div className="text-sm text-slate-500 py-4 text-center">No overdue items</div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-[#101A3D] mb-4 border-b border-slate-100 pb-2">Due Today</h2>
          <div className="text-sm text-slate-500 py-4 text-center">No tasks due today</div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-[#101A3D] mb-4 border-b border-slate-100 pb-2">This Week</h2>
          <div className="text-sm text-slate-500 py-4 text-center">No upcoming tasks</div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-[#101A3D] mb-4 border-b border-slate-100 pb-2">Stuck Cases</h2>
          <div className="text-sm text-slate-500 py-4 text-center">No stuck cases</div>
        </section>
        
        <section className="bg-white rounded-xl border border-slate-200 p-5 md:col-span-2">
          <h2 className="text-base font-semibold text-[#101A3D] mb-4 border-b border-slate-100 pb-2">Expected Disbursals</h2>
          <div className="text-sm text-slate-500 py-4 text-center">No disbursals expected soon</div>
        </section>
      </div>
    </div>
  );
}
