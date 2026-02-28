import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Button } from '../components/Button';
import { VideoTile } from '../components/VideoTile';
import { MetricCard } from '../components/MetricCard';
import { WhisperCard } from '../components/WhisperCard';
import { Clock } from 'lucide-react';

type MeetingState = 'start' | 'over-talking' | 'interruption' | 'positive';

export function LiveMeeting() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const state = (searchParams.get('state') as MeetingState) || 'start';
  
  const [duration, setDuration] = useState(0);
  const [showTransitionHint, setShowTransitionHint] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-transition through states for demo
  useEffect(() => {
    if (id === 'demo' && state === 'start') {
      // Show hint after 2 seconds
      const hintTimer = setTimeout(() => {
        setShowTransitionHint(true);
      }, 2000);

      // Auto-navigate to over-talking state after 5 seconds
      const autoTimer = setTimeout(() => {
        navigate(`/meeting/live/demo?state=over-talking`);
      }, 5000);

      return () => {
        clearTimeout(hintTimer);
        clearTimeout(autoTimer);
      };
    }
  }, [id, state, navigate]);

  // Continue auto-transitions through other states
  useEffect(() => {
    if (id === 'demo') {
      let nextState: MeetingState | null = null;
      let delay = 4000;

      if (state === 'over-talking') {
        nextState = 'interruption';
      } else if (state === 'interruption') {
        nextState = 'positive';
      } else if (state === 'positive') {
        // Transition to whisper view after positive state
        setTimeout(() => {
          navigate(`/meeting/whisper/demo`);
        }, delay);
        return;
      }

      if (nextState) {
        const timer = setTimeout(() => {
          navigate(`/meeting/live/demo?state=${nextState}`);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [id, state, navigate]);

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

  // Define metrics and whispers based on state
  const getStateData = () => {
    switch (state) {
      case 'start':
        return {
          engagement: 72,
          clarity: 78,
          whispers: [],
          emptyMessage: "No coaching yet. We'll quietly help when needed."
        };
      case 'over-talking':
        return {
          engagement: 75,
          clarity: 78,
          whispers: [
            {
              message: "You've been speaking for 90 seconds. Consider pausing for questions.",
              type: 'info' as const,
              timestamp: 'Just now'
            }
          ],
          emptyMessage: null
        };
      case 'interruption':
        return {
          engagement: 75,
          clarity: 78,
          whispers: [
            {
              message: "You were interrupted. Try slowing your pace and pausing.",
              type: 'info' as const,
              timestamp: 'Just now'
            },
            {
              message: "You've been speaking for 90 seconds. Consider pausing for questions.",
              type: 'info' as const,
              timestamp: '1 min ago'
            }
          ],
          emptyMessage: null
        };
      case 'positive':
        return {
          engagement: 82,
          clarity: 85,
          whispers: [
            {
              message: "Nice pace and clear explanation.",
              type: 'success' as const,
              timestamp: 'Just now'
            },
            {
              message: "You were interrupted. Try slowing your pace and pausing.",
              type: 'info' as const,
              timestamp: '2 min ago'
            },
            {
              message: "You've been speaking for 90 seconds. Consider pausing for questions.",
              type: 'info' as const,
              timestamp: '3 min ago'
            }
          ],
          emptyMessage: null
        };
      default:
        return {
          engagement: 72,
          clarity: 78,
          whispers: [],
          emptyMessage: "No coaching yet. We'll quietly help when needed."
        };
    }
  };

  const stateData = getStateData();

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
            onClick={() => navigate(`/meeting/whisper/${id}`)}
            className="text-sm py-2"
          >
            View with Whispers
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
      <div className="flex-1 flex overflow-hidden relative">
        {/* Auto-transition notification for demo */}
        {showTransitionHint && id === 'demo' && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
            <div className="bg-[#4C7DFF] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI whispers incoming...</span>
            </div>
          </div>
        )}

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

          {/* Metrics */}
          <div className="space-y-5 mb-10">
            <MetricCard
              title="Talk Balance"
              value="You 65%"
              showProgress
              progressValue={65}
            />
            <MetricCard
              title="Engagement Score"
              value={`${stateData.engagement}/100`}
              showProgress
              progressValue={stateData.engagement}
            />
            <MetricCard
              title="Clarity Score"
              value={`${stateData.clarity}/100`}
              showProgress
              progressValue={stateData.clarity}
            />
          </div>

          {/* Whispers Section */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Whispers</h4>
            {stateData.whispers.length > 0 ? (
              <div className="space-y-3">
                {stateData.whispers.map((whisper, index) => (
                  <WhisperCard
                    key={index}
                    message={whisper.message}
                    type={whisper.type}
                    timestamp={whisper.timestamp}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[14px] border border-[#E6E8EC] p-8 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-[#E6E8EC] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#6B7280] text-xl">💬</span>
                </div>
                <p className="text-[#6B7280] text-sm">
                  {stateData.emptyMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}