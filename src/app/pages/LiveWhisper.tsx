import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/Button';
import { VideoTile } from '../components/VideoTile';
import { MetricCard } from '../components/MetricCard';
import { WhisperCard } from '../components/WhisperCard';
import { Clock } from 'lucide-react';

export function LiveWhisper() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [duration, setDuration] = useState(137); // Start at 2:17 to simulate time passed

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const participants = [
    { name: 'You', isSelf: true, isActive: true },
    { name: 'Sarah', isSelf: false, isActive: false },
    { name: 'Daniel', isSelf: false, isActive: false },
    { name: 'Priya', isSelf: false, isActive: false },
  ];

  const whispers = [
    {
      message: "You've been speaking for 90 seconds. Consider pausing for questions.",
      type: 'info' as const,
      timestamp: '2 min ago'
    },
    {
      message: "Try inviting someone else to share.",
      type: 'info' as const,
      timestamp: '1 min ago'
    },
    {
      message: "Nice pace and clear explanation.",
      type: 'success' as const,
      timestamp: 'Just now'
    },
  ];

  return (
    <div className="h-screen bg-[#111318] flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-white text-lg font-semibold">Product Standup</h3>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(`/meeting/live/${id}`)}
            className="text-sm py-2"
          >
            Hide Whispers
          </Button>
          <Button
            variant="danger"
            onClick={() => navigate(`/meeting/summary/${id}`)}
          >
            End Meeting
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-8 bg-white">
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {participants.map((participant) => (
              <VideoTile
                key={participant.name}
                name={participant.name}
                isSelf={participant.isSelf}
                isActive={participant.isActive}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Live Coaching */}
        <div className="w-96 bg-[#F7F8FA] border-l border-[#E6E8EC] p-6 overflow-y-auto">
          <h3 className="text-[22px] font-semibold mb-8">Live Coaching</h3>

          {/* Metrics - Slightly Updated */}
          <div className="space-y-5 mb-10">
            <MetricCard
              title="Talk Balance"
              value="You 68%"
              showProgress
              progressValue={68}
            />
            <MetricCard
              title="Engagement Score"
              value="75/100"
              showProgress
              progressValue={75}
            />
            <MetricCard
              title="Clarity Score"
              value="83/100"
              showProgress
              progressValue={83}
            />
          </div>

          {/* Whispers Section */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Whispers</h4>
            <div className="space-y-4">
              {whispers.map((whisper, index) => (
                <WhisperCard
                  key={index}
                  message={whisper.message}
                  type={whisper.type}
                  timestamp={whisper.timestamp}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}