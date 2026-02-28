import { Link } from 'react-router';

interface TopNavProps {
  showAuth?: boolean;
}

export function TopNav({ showAuth = true }: TopNavProps) {
  return (
    <nav className="bg-white border-b border-[#E6E8EC] px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4C7DFF] flex items-center justify-center">
            <span className="text-white font-semibold">AI</span>
          </div>
          <span className="text-[#111318] font-semibold text-lg">AI Whisperer</span>
        </Link>
        
        {showAuth && (
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-[#6B7280] hover:text-[#111318] transition-colors">
              How it works
            </a>
            <Link 
              to="/dashboard" 
              className="text-[#6B7280] hover:text-[#111318] transition-colors"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
