import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#F6F8FB]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}