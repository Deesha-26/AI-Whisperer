import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MeetingsDashboard } from './pages/MeetingsDashboard';
import { LiveMeeting } from './pages/LiveMeeting';
import { LiveWhisper } from './pages/LiveWhisper';
import { MeetingSummary } from './pages/MeetingSummary';
import { PersonalGrowth } from './pages/PersonalGrowth';
import { Settings } from './pages/Settings';
import { DashboardLayout } from './layouts/DashboardLayout';

/**
 * AI Whisperer Prototype Navigation Flow:
 * 
 * Landing → Dashboard (via "Start a coached meeting" button)
 * Landing → Live Meeting Demo (via "Watch demo" button)
 * 
 * Dashboard → Live Meeting (via "Start instant meeting" button)
 * Meetings → Live Meeting (via "Start instant meeting" button)
 * 
 * Live Meeting → Live Whisper (auto-transition for demo, manual button for others)
 * Live Meeting → Meeting Summary (via "End Meeting" button)
 * 
 * Live Whisper → Meeting Summary (via "End Meeting" button)
 * Live Whisper → Live Meeting (via "Hide Whispers" button)
 * 
 * Meeting Summary → Dashboard (via "Back to Dashboard" button)
 * Meeting Summary → Personal Growth/Insights (via "View personal progress" button)
 */

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
    ],
  },
  {
    path: '/meetings',
    Component: DashboardLayout,
    children: [
      { index: true, Component: MeetingsDashboard },
    ],
  },
  {
    path: '/insights',
    Component: DashboardLayout,
    children: [
      { index: true, Component: PersonalGrowth },
    ],
  },
  {
    path: '/settings',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Settings },
    ],
  },
  {
    path: '/meeting/live/:id',
    Component: LiveMeeting,
  },
  {
    path: '/meeting/whisper/:id',
    Component: LiveWhisper,
  },
  {
    path: '/meeting/summary/:id',
    Component: MeetingSummary,
  },
]);