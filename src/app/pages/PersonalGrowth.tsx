import { Card } from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award } from 'lucide-react';

export function PersonalGrowth() {
  const progressData = [
    { week: 'Week 1', score: 62 },
    { week: 'Week 2', score: 68 },
    { week: 'Week 3', score: 71 },
    { week: 'Week 4', score: 75 },
    { week: 'Week 5', score: 78 },
    { week: 'Week 6', score: 81 },
  ];

  const improvements = [
    { metric: 'Talk Balance', improvement: '+18%', description: 'Better distribution of speaking time' },
    { metric: 'Engagement', improvement: '+12%', description: 'More interactive meetings' },
    { metric: 'Speaking Conciseness', improvement: '+21%', description: 'Clearer, more focused communication' },
  ];

  const milestones = [
    { title: 'First Coached Meeting', date: '6 weeks ago', icon: '🎯' },
    { title: '10 Meetings Completed', date: '3 weeks ago', icon: '🏆' },
    { title: 'Engagement Expert', date: '1 week ago', icon: '⭐' },
    { title: 'Talk Balance Master', date: 'Yesterday', icon: '🎖️' },
  ];

  return (
    <div className="p-8">
      {/* Centered Page Container */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[36px] font-semibold mb-2 text-[#111318]">Your Communication Growth</h1>
          <p className="text-[#6B7280] text-lg">Track your progress and see how your skills improve over time</p>
        </div>

        {/* Progress Chart */}
        <Card className="p-8 mb-12">
          <h3 className="text-[22px] font-semibold mb-8 text-[#111318]">Overall Communication Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EC" />
              <XAxis 
                dataKey="week" 
                stroke="#6B7280"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '14px' }}
                domain={[50, 90]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E6E8EC',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#4C7DFF" 
                strokeWidth={3}
                dot={{ fill: '#4C7DFF', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center mt-6">
            <p className="text-[#6B7280] text-lg">
              <span className="text-[#22C55E] text-xl font-bold">+19 points</span> improvement since you started
            </p>
          </div>
        </Card>

        {/* Progress Cards */}
        <div className="mb-12">
          <h3 className="text-[22px] font-semibold mb-8 text-[#111318]">Key Improvements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {improvements.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-[#22C55E] text-2xl font-bold">{item.improvement}</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">{item.metric}</h4>
                <p className="text-[#6B7280]">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-12">
          <h3 className="text-[22px] font-semibold mb-8 text-[#111318]">Milestones</h3>
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#F7F8FA] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {milestone.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{milestone.title}</h4>
                    <p className="text-[#6B7280]">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Encouragement Card */}
        <Card className="p-10 bg-gradient-to-br from-[#4C7DFF]/5 to-[#4C7DFF]/10 border-[#4C7DFF]/20 text-center">
          <div className="flex flex-col items-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#4C7DFF]/20 rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-[#4C7DFF]" />
            </div>
            <h2 className="text-[24px] font-semibold mb-4">You're becoming a more confident communicator.</h2>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Over the past 6 weeks, you've consistently improved across all key metrics. 
              Your meetings are more engaging, your communication is clearer, and your team 
              participation has become more balanced. Keep up the excellent work!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}