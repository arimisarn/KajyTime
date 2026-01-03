import { TodayCard } from "@/app/(app)/dashboard/TodayCard";
import { LanguageChart } from "@/app/(app)/dashboard/LanguageChart";
import { ProjectChart } from "@/app/(app)/dashboard/ProjectChart";
import { WeeklyChart } from "./WeeklyChart";
import { WeeklyGoalCard } from "./WeeklyGoalCard";

export default function DashboardPage() {
  return (
    <div
      className="
        grid gap-4
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
      "
    >
      {/* Top stats */}
      <TodayCard />
      <WeeklyGoalCard />

      {/* Charts */}
      <LanguageChart />
      <ProjectChart />

      {/* Full width weekly chart */}
      <WeeklyChart />
    </div>
  );
}
