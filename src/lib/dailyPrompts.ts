export const DAILY_PROMPTS = [
  "What's one thing that surprised you today?",
  "Describe your current mood as a weather pattern.",
  "What's something you wish someone understood about you right now?",
  "What would your future self thank you for doing today?",
  "What's been living rent-free in your head lately?",
  "If today had a soundtrack, what would it sound like?",
  "What's one small thing you did today that you're proud of?",
  "What would you tell yourself from one year ago?",
  "What are you pretending not to worry about?",
  "What made you feel most like yourself today?",
  "What's a boundary you wish you'd held today?",
  "What are you looking forward to that you haven't admitted yet?",
  "What's one belief you hold that you've never questioned?",
  "Who do you want to become in the next 6 months?",
  "What emotion are you avoiding right now?",
  "What conversation do you keep putting off?",
  "What does rest actually feel like for you?",
  "What's something you've been learning without realising it?",
  "Where in your body do you hold your stress today?",
  "What would you do if you weren't afraid of failing?",
  "What's the most honest thing you could say right now?",
  "What moment from today deserves to be remembered?",
  "What would a braver version of you have done today?",
  "What are you grateful for that you usually take for granted?",
  "What's a story you keep telling yourself that might not be true?",
  "What do you need to hear right now?",
  "What's one thing you want to let go of before the week ends?",
  "If your energy was a colour today, what would it be?",
  "What did today teach you about yourself?",
  "What's something you started recently that excites you?",
  "How have you changed in the last 90 days?",
  "What would make tomorrow better than today?",
  "What's one relationship you want to invest more in?",
  "What fear is disguising itself as procrastination for you right now?",
  "What are you secretly proud of that you haven't told anyone?",
  "What would you do with one completely free, judgment-free day?",
  "What's something small that's been making you happy lately?",
  "What does success actually look like to you — not to others?",
  "What part of your routine is draining you right now?",
  "What's one kind thing you could do for yourself tomorrow?"
]

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash
}

export function getTodaysPrompt(): string {
  const today = new Date().toDateString()
  const index = Math.abs(hashCode(today)) % DAILY_PROMPTS.length
  return DAILY_PROMPTS[index]
}
