import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TrendingUp, TrendingDown, Plus, ArrowRight, MessageSquare } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="p-8">
      {/* Centered Page Container */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[36px] font-semibold mb-2 text-[#111318]">Dashboard</h1>
          <p className="text-[#6B7280]">Your personal communication performance overview</p>
        </div>

        {/* Today at a Glance */}
        <div className="mb-12">
          <h3 className="text-[22px] font-semibold mb-6 text-[#111318]">Today at a Glance</h3>
          
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Next Meeting */}
              <div 
                className="flex items-start gap-4 cursor-pointer hover:bg-[#F6F8FB] p-3 -m-3 rounded-lg transition-colors"
                onClick={() => navigate('/meetings')}
              >
                <div className="w-10 h-10 rounded-lg bg-[#4C7DFF]/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#4C7DFF]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#6B7280] mb-1">Next Meeting</div>
                  <div className="text-[#111318] font-semibold mb-1">Product Standup</div>
                  <div className="text-sm text-[#6B7280]">Today at 2:00 PM</div>
                </div>
              </div>

              {/* Coaching Status */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#6B7280] mb-1">Coaching Status</div>
                  <div className="text-[#111318] font-semibold mb-1">All Active</div>
                  <div className="text-sm text-[#6B7280]">3 modules enabled</div>
                </div>
              </div>

              {/* Quick Start */}
              <div className="flex items-center justify-center md:justify-end">
                <Button 
                  onClick={() => navigate('/meeting/live/instant')}
                  className="h-12 w-full md:w-auto gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Start instant meeting
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Your Current Performance */}
        <div className="mb-12">
          <h3 className="text-[22px] font-semibold mb-6 text-[#111318]">Your Current Performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Talk Balance */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-[#6B7280]">Talk Balance</div>
                <div className="flex items-center gap-1 text-[#22C55E] text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +5%
                </div>
              </div>
              <div className="text-[36px] font-bold text-[#111318] mb-1">42%</div>
              <div className="text-sm text-[#6B7280] mb-4">You vs Others</div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#E6E8EC] rounded-full overflow-hidden">
                <div className="h-full bg-[#4C7DFF] rounded-full" style={{ width: '42%' }}></div>
              </div>
            </Card>

            {/* Engagement */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-[#6B7280]">Engagement</div>
                <div className="flex items-center gap-1 text-[#22C55E] text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </div>
              </div>
              <div className="text-[36px] font-bold text-[#111318] mb-1">8.4</div>
              <div className="text-sm text-[#6B7280] mb-4">Avg Score</div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#E6E8EC] rounded-full overflow-hidden">
                <div className="h-full bg-[#4C7DFF] rounded-full" style={{ width: '84%' }}></div>
              </div>
            </Card>

            {/* Clarity */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-[#6B7280]">Clarity</div>
                <div className="flex items-center gap-1 text-[#EF4444] text-sm font-semibold">
                  <TrendingDown className="w-4 h-4" />
                  -3%
                </div>
              </div>
              <div className="text-[36px] font-bold text-[#111318] mb-1">7.2</div>
              <div className="text-sm text-[#6B7280] mb-4">Avg Score</div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#E6E8EC] rounded-full overflow-hidden">
                <div className="h-full bg-[#4C7DFF] rounded-full" style={{ width: '72%' }}></div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Meeting Summary */}
        <div>
          <h3 className="text-[22px] font-semibold mb-6 text-[#111318]">Recent Meeting Summary</h3>
          
          <Card className="p-6 cursor-pointer hover:border-[#4C7DFF] transition-all" 
          onClick={() => navigate('/meeting/summary/last')} >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h4 className="text-[#111318] font-semibold text-lg mb-1">Product Standup</h4>
                <p className="text-[#6B7280] text-sm">Yesterday at 2:00 PM • 15 minutes</p>
              </div>
              <div className="text-right">
                <div className="text-[#6B7280] text-sm mb-1">Overall Score</div>
                <div className="text-[#111318] text-2xl font-semibold">8.2</div>
              </div>
            </div>

            <div className="bg-[#F6F8FB] rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4C7DFF]/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-[#4C7DFF]" />
                </div>
                <div className="flex-1">
                  <div className="text-[#111318] font-semibold text-sm mb-1">Key AI Insight</div>
                  <p className="text-[#6B7280] text-sm">
                    You demonstrated strong active listening with 3 clarifying questions. 
                    Consider allowing more pauses for others to contribute—your talk time 
                    was 52% when optimal balance is around 40-45%.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/meeting/summary/last')}
              variant="secondary"
              className="w-full justify-center"
            >
              View full summary
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}