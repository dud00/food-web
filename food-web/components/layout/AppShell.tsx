import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNav />
      <div className="flex-1 min-w-0">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

