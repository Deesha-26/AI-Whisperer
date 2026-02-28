import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Video, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/meetings', label: 'Meetings', icon: Video },
  { path: '/insights', label: 'Insights', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  // Helper function to determine if a nav item should be active
  const isItemActive = (path: string) => {
    // Exact match for the current path
    if (location.pathname === path) {
      return true;
    }

    // Don't highlight parent items for sub-pages (like /meeting/summary, /meeting/live, etc)
    // Sub-pages should not highlight any sidebar item
    const subPages = ['/meeting/summary', '/meeting/live', '/meeting/whisper'];
    const isOnSubPage = subPages.some(subPage => location.pathname.startsWith(subPage));
    
    if (isOnSubPage) {
      return false;
    }

    return false;
  };

  return (
    <aside className="w-64 bg-[#F1F4F9] border-r border-[#E6E8EC] h-full flex flex-col">
      <div className="p-6 border-b border-[#E6E8EC]">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4C7DFF] flex items-center justify-center">
            <span className="text-white font-semibold">AI</span>
          </div>
          <span className="text-[#111318] font-semibold">AI Whisperer</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 pt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-[#E3E9F3] text-[#4C7DFF]'
                  : 'text-[#6B7280] hover:bg-white hover:text-[#111318]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}