import Sidebar from "@/components/Sidebar";
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}