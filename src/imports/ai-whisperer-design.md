Design a clean, modern SaaS web application called AI Whisperer — Your real-time meeting coach.

The product provides subtle live AI feedback during meetings to help users communicate clearly and confidently while they speak.

The UI should feel professional, minimal, and product-ready — inspired by Linear, Notion, and modern productivity tools. Avoid playful or cartoon styling. This should look like a real startup SaaS product.

🎨 Design System

Color palette:

Primary accent: #4C7DFF (AI Blue)

Background: #F7F8FA

Surface/cards: #FFFFFF

Borders/dividers: #E6E8EC

Primary text: #111318

Secondary text: #6B7280

Success: #22C55E

Warning: #F59E0B

Typography:
Use Inter font.

H1: 32px SemiBold

H2: 24px SemiBold

H3: 18px Medium

Body: 16px Regular

Small text: 14px

Use an 8px spacing grid and rounded corners (10–14px radius).

🧩 Core Reusable Components

Create reusable components:

Top navigation bar with logo “AI Whisperer”

Left sidebar navigation

Primary and secondary buttons

Toggle switch

Card component (white, subtle shadow)

Video tile component (rounded rectangle with name label)

Metric card with progress bar

Whisper notification card with a left colored accent border

🖥️ Screen 1 — Landing Page

Top navigation:
Logo text: “AI Whisperer”
Links: “How it works” and “Sign in”

Hero section (split layout):

Left side:
Headline: Your real-time meeting coach
Paragraph:
“Get subtle, private AI feedback during meetings so you can speak clearly, engage your team, and lead with confidence.”
Primary button: “Start a coached meeting”
Secondary button: “Watch demo”

Right side:
Large product preview card showing a meeting UI with a whisper notification:
“You’ve been speaking for 90 seconds. Consider pausing for questions.”

📅 Screen 2 — Meeting Setup Dashboard

Layout:
Left sidebar with items:
Dashboard, Meetings (active), Insights, Settings.

Main area title: “Your Meetings”

Show 3 meeting cards:

Product Standup — Coaching ON

Client Presentation — Coaching ON

Weekly Sync — Coaching OFF

Add top-right primary button: “Start instant meeting”.

Add quick-start session cards:
Standup, Client Call, Interview.

🎥 Screen 3 — Live Meeting Screen

Top meeting bar:
“Product Standup” + meeting timer + red “End Meeting” button.

Main layout:
Left: 2x2 video grid with participants:
You, Sarah, Daniel, Priya.
Highlight “You” as active speaker.

Right panel titled:
“Live Coaching”

Include metric cards:

Talk Balance: You 65%

Engagement Score: 72/100

Clarity Score: 81/100

Below metrics, add section titled:
“Whispers”
(Empty state initially)

💬 Screen 4 — Live Whisper State

Duplicate meeting screen and populate the whisper feed:

“You’ve been speaking for 90 seconds. Consider pausing for questions.”

“Try inviting someone else to share.”

“Nice pace and clear explanation.”

Update metric values slightly to simulate real-time changes.

📊 Screen 5 — Meeting Summary Dashboard

Title: “Meeting Summary”

Include:
Donut chart titled “Talk Time Distribution”
(User spoke 52%)

Insight cards:

Engagement Score 74

Speaking Pace 81

Participation Balance 61

Section:
“Next Meeting Tips” with 3 suggestion cards.

Primary button:
“View personal progress”

📈 Screen 6 — Personal Growth Dashboard

Title: “Your Communication Growth”

Add line chart showing improvement from 62 → 81 across weeks.

Progress cards:

Talk Balance improved 18%

Engagement improved 12%

Speaking Conciseness improved 21%

Milestone badges section.

Large final card:
“You’re becoming a more confident communicator.”

Create all screens as desktop web app frames.
Keep visual consistency and a polished SaaS aesthetic.