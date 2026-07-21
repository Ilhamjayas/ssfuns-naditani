"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the map component with no SSR
const DaiMap = dynamic(() => import("./DaiMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-border shadow-sm bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  ),
});

export default DaiMap;
