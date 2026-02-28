import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ToggleSwitch } from '../components/ToggleSwitch';

export function Settings() {
  // Coaching Preferences
  const [realtimeCoaching, setRealtimeCoaching] = useState(true);
  const [subtleWhispers, setSubtleWhispers] = useState(true);
  const [vibrationNotifications, setVibrationNotifications] = useState(false);
  const [coachingIntensity, setCoachingIntensity] = useState('Medium');

  // Meeting Defaults
  const [coachingForAll, setCoachingForAll] = useState(true);
  const [startMuted, setStartMuted] = useState(false);
  const [autoSummaries, setAutoSummaries] = useState(true);

  // Privacy & Data
  const [storeAnalytics, setStoreAnalytics] = useState(true);
  const [anonymousBenchmarking, setAnonymousBenchmarking] = useState(false);

  return (
    <div className="p-8">
      {/* Centered Page Container */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-12">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-[36px] font-semibold mb-2 text-[#111318]">Settings</h1>
          <p className="text-[#6B7280]">Customize your AI Whisperer experience</p>
        </div>

        {/* Section 1 - Coaching Preferences */}
        <div className="mb-12">
          <Card className="p-6">
            <h3 className="text-[22px] font-semibold mb-6 text-[#111318]">Coaching Preferences</h3>
            
            <div className="space-y-4">
              {/* Enable real-time coaching */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Enable real-time coaching</div>
                  <div className="text-sm text-[#6B7280]">Get AI feedback during your meetings</div>
                </div>
                <ToggleSwitch 
                  checked={realtimeCoaching} 
                  onCheckedChange={setRealtimeCoaching}
                />
              </div>

              {/* Show subtle whispers only */}
              <div className="flex items-center justify-between py-3 border-t border-[#E6E8EC]">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Show subtle whispers only</div>
                  <div className="text-sm text-[#6B7280]">Reduce notification frequency</div>
                </div>
                <ToggleSwitch 
                  checked={subtleWhispers} 
                  onCheckedChange={setSubtleWhispers}
                />
              </div>

              {/* Allow vibration notifications */}
              <div className="flex items-center justify-between py-3 border-t border-[#E6E8EC]">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Allow vibration notifications</div>
                  <div className="text-sm text-[#6B7280]">Feel gentle alerts during coaching</div>
                </div>
                <ToggleSwitch 
                  checked={vibrationNotifications} 
                  onCheckedChange={setVibrationNotifications}
                />
              </div>

              {/* Coaching intensity */}
              <div className="flex items-center justify-between py-3 border-t border-[#E6E8EC]">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Coaching intensity</div>
                  <div className="text-sm text-[#6B7280]">Adjust how often you receive feedback</div>
                </div>
                <select
                  value={coachingIntensity}
                  onChange={(e) => setCoachingIntensity(e.target.value)}
                  className="px-4 py-2 bg-white border-2 border-[#E6E8EC] rounded-lg text-[#111318] font-medium hover:border-[#4C7DFF] focus:border-[#4C7DFF] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Section 2 - Meeting Defaults */}
        <div className="mb-12">
          <Card className="p-6">
            <h3 className="text-[22px] font-semibold mb-6 text-[#111318]">Meeting Defaults</h3>
            
            <div className="space-y-4">
              {/* Enable coaching for all meetings */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Enable coaching for all meetings</div>
                  <div className="text-sm text-[#6B7280]">Automatically turn on coaching when joining</div>
                </div>
                <ToggleSwitch 
                  checked={coachingForAll} 
                  onCheckedChange={setCoachingForAll}
                />
              </div>

              {/* Start meetings muted */}
              <div className="flex items-center justify-between py-3 border-t border-[#E6E8EC]">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Start meetings muted</div>
                  <div className="text-sm text-[#6B7280]">Join with microphone off by default</div>
                </div>
                <ToggleSwitch 
                  checked={startMuted} 
                  onCheckedChange={setStartMuted}
                />
              </div>

              {/* Auto-generate meeting summaries */}
              <div className="flex items-center justify-between py-3 border-t border-[#E6E8EC]">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Auto-generate meeting summaries</div>
                  <div className="text-sm text-[#6B7280]">Create summaries automatically after meetings end</div>
                </div>
                <ToggleSwitch 
                  checked={autoSummaries} 
                  onCheckedChange={setAutoSummaries}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Section 3 - Privacy & Data */}
        <div className="mb-12">
          <Card className="p-6">
            <h3 className="text-[22px] font-semibold mb-6 text-[#111318]">Privacy & Data</h3>
            
            <div className="space-y-4">
              {/* Store meeting analytics */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Store meeting analytics</div>
                  <div className="text-sm text-[#6B7280]">Save data to track your progress over time</div>
                </div>
                <ToggleSwitch 
                  checked={storeAnalytics} 
                  onCheckedChange={setStoreAnalytics}
                />
              </div>

              {/* Anonymous benchmarking */}
              <div className="flex items-center justify-between py-3 border-t border-[#E6E8EC]">
                <div>
                  <div className="text-[#111318] font-medium mb-1">Anonymous benchmarking</div>
                  <div className="text-sm text-[#6B7280]">Compare your metrics with other users anonymously</div>
                </div>
                <ToggleSwitch 
                  checked={anonymousBenchmarking} 
                  onCheckedChange={setAnonymousBenchmarking}
                />
              </div>

              {/* Delete data button */}
              <div className="pt-4 border-t border-[#E6E8EC]">
                <Button 
                  variant="danger" 
                  className="text-sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete all your meeting data? This action cannot be undone.')) {
                      // Handle deletion
                      alert('Meeting data deleted');
                    }
                  }}
                >
                  Delete my meeting data
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Section 4 - Account */}
        <div>
          <Card className="p-6">
            <h3 className="text-[22px] font-semibold mb-6 text-[#111318]">Account</h3>
            
            <div className="space-y-4">
              {/* Email */}
              <div className="py-3">
                <div className="text-sm text-[#6B7280] mb-1">Email</div>
                <div className="text-[#111318] font-medium">user@email.com</div>
              </div>

              {/* Change password */}
              <div className="py-3 border-t border-[#E6E8EC]">
                <button 
                  className="text-[#4C7DFF] font-medium hover:text-[#3D6EEE] transition-colors"
                  onClick={() => alert('Password change functionality would open here')}
                >
                  Change password
                </button>
              </div>

              {/* Log out button */}
              <div className="pt-4 border-t border-[#E6E8EC]">
                <Button 
                  variant="secondary" 
                  className="text-sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to log out?')) {
                      // Handle logout
                      alert('Logged out');
                    }
                  }}
                >
                  Log out
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}