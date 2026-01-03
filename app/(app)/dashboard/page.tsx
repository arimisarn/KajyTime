import { TodayCard } from "@/app/(app)/dashboard/TodayCard";
import { LanguageChart } from "@/app/(app)/dashboard/LanguageChart";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      
      <TodayCard />
      <LanguageChart />
    </div>
  );
}
