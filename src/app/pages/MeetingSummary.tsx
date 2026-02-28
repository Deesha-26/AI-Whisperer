import { useNavigate, useParams } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Sidebar } from '../components/Sidebar';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, MessageSquare, Clock, ChevronRight } from 'lucide-react';

export function MeetingSummary() {
  const navigate = useNavigate();
  const { id } = useParams();

  const talkTimeData = [
    { name: 'You', value: 52, color: '#4C7DFF' },
    { name: 'Sarah', value: 20, color: '#22C55E' },
    { name: 'Daniel', value: 18, color: '#F59E0B' },
    { name: 'Priya', value: 10, color: '#8B5CF6' },
  ];

  const insights = [
    { label: 'Engagement Score', value: 74, icon: TrendingUp },
    { label: 'Speaking Pace', value: 81, icon: MessageSquare },
    { label: 'Participation Balance', value: 61, icon: Clock },
  ];

  const tips = [
    {
      title: 'Invite More Participation',
      description: 'You spoke for 52% of the meeting. Try asking open-ended questions to encourage team input.'
    },
    {
      title: 'Great Clarity',
      description: 'Your explanations were clear and well-paced. Team engagement increased during your segments.'
    },
    {
      title: 'Consider Shorter Segments',
      description: 'Breaking long explanations into 60-90 second chunks with pauses can boost retention.'
    },
  ];

  return (
    <div className="flex h-screen bg-[#F6F8FB]">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Centered Page Container */}
          <div className="max-w-[1200px] mx-auto bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
              <button 
                onClick={() => navigate('/meetings')}
                className="hover:text-[#4C7DFF] transition-colors"
              >
                Meetings
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#111318]">Product Standup</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[36px] font-semibold mb-2 text-[#111318]">Meeting Summary</h1>
              <p className="text-[#6B7280] text-lg">Product Standup • 15 minutes • 4 participants</p>
            </div>

            {/* Talk Time Distribution */}
            <Card className="p-8 mb-12">
              <h3 className="text-[22px] font-semibold mb-8 text-[#111318]">Talk Time Distribution</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={talkTimeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {talkTimeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      verticalAlign="middle" 
                      align="right"
                      layout="vertical"
                      formatter={(value, entry: any) => `${value}: ${entry.payload.value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {insights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <Card key={insight.label} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#4C7DFF]/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#4C7DFF]" />
                      </div>
                    </div>
                    <div className="text-[#6B7280] text-sm mb-2">{insight.label}</div>
                    <div className="text-[36px] font-bold text-[#111318]">{insight.value}</div>
                  </Card>
                );
              })}
            </div>

            {/* Next Meeting Tips */}
            <div className="mb-10">
              <h3 className="text-[22px] font-semibold mb-8 text-[#111318]">Next Meeting Tips</h3>
              <div className="space-y-6">
                {tips.map((tip, index) => (
                  <Card key={index} className="p-6">
                    <h4 className="text-lg font-semibold mb-3">{tip.title}</h4>
                    <p className="text-[#6B7280] leading-relaxed">
                      {tip.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="secondary"
                className="h-12 px-8"
              >
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/insights')}
                className="h-12 px-8"
              >
                View personal progress
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}