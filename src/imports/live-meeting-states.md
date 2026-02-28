Refactor the Live Meeting screen into multiple meeting states to simulate real-time AI behavior.

Do not redesign the UI. Duplicate the frame and modify content per state.

Create the following 4 frames:

State 1 — Meeting Started (No Coaching Yet)

Frame name: Live Meeting – Start

Whispers panel:
Empty state message:

“No coaching yet. We’ll quietly help when needed.”

Engagement score: 72
Clarity score: 78

State 2 — Over-Talking Detected

Duplicate previous frame.

Frame name: Live Meeting – Over Talking

Add first whisper card:

“You’ve been speaking for 90 seconds. Consider pausing for questions.”

Timestamp: Just now

Increase engagement score slightly to 75.

State 3 — Interruption Detected

Duplicate previous frame.

Frame name: Live Meeting – Interruption

Add new whisper at top:

“You were interrupted. Try slowing your pace and pausing.”

Timestamp: Just now

Keep previous whisper below it.

State 4 — Positive Coaching

Duplicate previous frame.

Frame name: Live Meeting – Positive Flow

Add new green whisper at top:

“Nice pace and clear explanation.”

Timestamp: Just now

Update scores:
Engagement: 82
Clarity: 85

Goal

Simulate real-time AI coaching by switching between meeting states during the prototype.

Do not change layout or styling. Only update whisper content and scores per state.