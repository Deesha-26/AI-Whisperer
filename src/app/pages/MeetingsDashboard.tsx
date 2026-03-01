import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { Plus, Video, Users, Briefcase } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  coaching: boolean;
  participants?: number;
  scheduled?: string;
}

export function MeetingsDashboard() {
  const navigate = useNavigate();
  
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: '1', title: 'Product Standup', coaching: true, participants: 4, scheduled: 'Today, 10:00 AM' },
    { id: '2', title: 'Client Presentation', coaching: true, participants: 6, scheduled: 'Today, 2:00 PM' },
    { id: '3', title: 'Weekly Sync', coaching: false, participants: 8, scheduled: 'Tomorrow, 11:00 AM' },
  ]);

  const quickStartTemplates = [
    { icon: Users, title: 'Standup', description: '15 min team sync' },
    { icon: Briefcase, title: 'Client Call', description: '30 min presentation' },
    { icon: Video, title: 'Interview', description: '45 min interview' },
  ];

  const toggleCoaching = (id: string) => {
    setMeetings(meetings.map(m => 
      m.id === id ? { ...m, coaching: !m.coaching } : m
    ));
  };

  return (
    <div className="p-8">
      {/* Centered Page Container */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[36px] font-semibold mb-2 text-[#111318]">Your Meetings</h1>
              <p className="text-[#6B7280]">Manage and schedule your coached meetings</p>
            </div>
            <Button 
              onClick={() => navigate('/meeting/live/instant')}
              className="h-12 gap-2"
            >
              <Plus className="w-5 h-5" />
              Start instant meeting
            </Button>
          </div>
        </div>

        {/* Quick Start Templates */}
        <div className="mb-12">
          <h3 className="text-[22px] font-semibold mb-8 text-[#111318]">Quick Start</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStartTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card 
                  key={template.title}
                  className="p-6 cursor-pointer hover:border-[#4C7DFF] hover:shadow-lg transition-all"
                  onClick={() => navigate('/meeting/live/instant')}
                >
                  <Icon className="w-8 h-8 text-[#4C7DFF] mb-3" />
                  <h4 className="text-lg font-semibold mb-1">{template.title}</h4>
                  <p className="text-[#6B7280] text-sm">{template.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Scheduled Meetings */}
        <div>
          <h3 className="text-[22px] font-semibold mb-8 text-[#111318]">Scheduled Meetings</h3>
          <div className="space-y-6">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{meeting.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        meeting.coaching 
                          ? 'bg-[#22C55E]/10 text-[#22C55E]' 
                          : 'bg-[#E6E8EC] text-[#6B7280]'
                      }`}>
                        Coaching {meeting.coaching ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {meeting.participants} participants
                      </span>
                      <span>{meeting.scheduled}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] font-medium">Coaching</span>
                      <ToggleSwitch
                        checked={meeting.coaching}
                        onCheckedChange={() => toggleCoaching(meeting.id)}
                      />
                    </div>
                    <Button 
                      variant="primary"
                      onClick={() => navigate(`/meeting/live/${meeting.id}`)}
                      className="h-12 px-8"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}