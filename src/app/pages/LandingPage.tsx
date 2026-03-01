import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Play } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <TopNav />
      
      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-8 pt-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left Side */}
          <div className="max-w-[480px]">
            <h1 className="text-[44px] leading-[110%] font-semibold mb-5 max-w-[380px]">
              Your real-time meeting coach
            </h1>
            <p className="text-[#6B7280] text-lg mb-7 leading-relaxed">
              Get subtle, private AI feedback during meetings so you can speak clearly, 
              engage your team, and lead with confidence.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="h-[52px] px-7 flex items-center"
              >
                Start a coached meeting
              </Button>
              <Button 
                variant="secondary" 
                className="h-[52px] px-7 flex items-center gap-2"
                onClick={() => navigate('/meeting/live/demo')}
              >
                <Play className="w-4 h-4" />
                Watch demo
              </Button>
            </div>
          </div>

          {/* Right Side - Product Preview */}
          <div className="flex justify-end">
            <Card className="p-10 w-[560px]">
              <div className="bg-gradient-to-b from-[#1A2332] to-[#1F2937] rounded-lg p-8 mb-6 relative">
                {/* Mock meeting UI */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {['You', 'Sarah', 'Daniel', 'Priya'].map((name, i) => (
                    <div key={name} className="aspect-video bg-gray-700 rounded-lg relative">
                      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-xs">
                        {name}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Mock metrics */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: 'Talk Balance', value: '65%' },
                    { label: 'Engagement', value: '72' },
                    { label: 'Clarity', value: '81' }
                  ].map((metric) => (
                    <div key={metric.label} className="bg-gray-700/50 rounded p-2">
                      <div className="text-gray-400 text-[10px]">{metric.label}</div>
                      <div className="text-white text-sm font-semibold">{metric.value}</div>
                    </div>
                  ))}
                </div>
                
                {/* Whisper notification with glow */}
                <div className="relative">
                  {/* Blue glow behind whisper */}
                  <div className="absolute inset-0 bg-[#4C7DFF]/20 blur-xl rounded-lg"></div>
                  
                  <div className="relative bg-white/15 backdrop-blur-sm border-l-[5px] border-[#4C7DFF] rounded-lg p-6 shadow-[0_0_30px_rgba(76,125,255,0.3)]">
                    <p className="text-white leading-relaxed font-medium">
                      You've been speaking for 90 seconds. Consider pausing for questions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-[#6B7280] text-sm">
                  Real-time AI coaching during your meetings
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-[32px] font-semibold text-center mb-16">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Join Your Meeting',
              description: 'Connect AI Whisperer to any video call platform and start your coached session.'
            },
            {
              title: 'Get Live Feedback',
              description: 'Receive subtle, private suggestions in real-time to improve your communication.'
            },
            {
              title: 'Track Your Growth',
              description: 'Review insights after each meeting and watch your skills improve over time.'
            }
          ].map((feature, i) => (
            <Card key={i} className="p-8 text-center">
              <div className="w-12 h-12 bg-[#4C7DFF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-[#4C7DFF] text-xl font-semibold">{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-[#6B7280] leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}