import { TodayCard } from "@/app/(app)/dashboard/TodayCard";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TodayCard />
    </div>
  );
}
