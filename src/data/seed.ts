import type { Entry, MigrationItem } from '../types/entry'

export const SEED_ENTRIES: Entry[] = [
  // Daily — today
  { id: 'd1',  view: 'daily',   type: 'task',  text: 'Reply to Mariana about the lease renewal',    ago: 47,   status: 'active' },
  { id: 'd2',  view: 'daily',   type: 'event', text: 'Dentist',                                      ago: 110,  status: 'active', when: '16:00' },
  { id: 'd3',  view: 'daily',   type: 'task',  text: 'Pick up dry cleaning on Bryanston',            ago: 145,  status: 'done',   completedAt: 12 },
  { id: 'd4',  view: 'daily',   type: 'task',  text: 'Draft Q3 planning doc — at least the outline', ago: 190,  status: 'active', originalText: 'Draft Q3 doc' },
  { id: 'd6',  view: 'daily',   type: 'task',  text: 'Call Mum',                                     ago: 260,  status: 'active', when: '19:00' },
  { id: 'd7',  view: 'daily',   type: 'task',  text: 'Buy birthday card for Joel',                   ago: 305,  status: 'migrated', migratedTo: 'tomorrow' },
  { id: 'd8',  view: 'daily',   type: 'task',  text: 'Stretch — 10 min, real ones',                  ago: 340,  status: 'done',   completedAt: 280, when: '07:30' },
  { id: 'd9',  view: 'daily',   type: 'event', text: 'Standup w/ the team',                          ago: 365,  status: 'active', when: '09:30' },

  // Weekly
  { id: 'w1',  view: 'weekly',  type: 'event', text: 'Team offsite, Shoreditch',                     ago: 1440, status: 'active', when: '2026-05-26' },
  { id: 'w2',  view: 'weekly',  type: 'task',  text: 'Finish chapter 4 of Annie Duke',               ago: 1620, status: 'active' },
  { id: 'w3',  view: 'weekly',  type: 'task',  text: 'Q3 planning doc — first pass to Sam',          ago: 2160, status: 'migrated', migratedTo: 'next week' },
  { id: 'w5',  view: 'weekly',  type: 'task',  text: 'Send the lease counter-signature back',        ago: 3000, status: 'active', when: '2026-05-29' },
  { id: 'w6',  view: 'weekly',  type: 'task',  text: 'Book haircut',                                 ago: 3600, status: 'done',   completedAt: 2500 },

  // Monthly
  { id: 'm1',  view: 'monthly', type: 'event', text: "Joel's birthday",                              ago: 8640, status: 'active', when: '2026-05-17' },
  { id: 'm2',  view: 'monthly', type: 'task',  text: 'Submit expenses',                              ago: 9000, status: 'active', when: '2026-05-28' },
  { id: 'm3',  view: 'monthly', type: 'task',  text: 'Renew gym membership',                         ago: 11000, status: 'active' },
  { id: 'm5',  view: 'monthly', type: 'event', text: 'Quarterly review w/ Sam',                      ago: 13000, status: 'active', when: '2026-05-23' },

  // Backlog / Future Log
  { id: 'b1',  view: 'backlog', type: 'task',  text: 'Build a small shelf for the entryway',         ago: 20000, status: 'active' },
  { id: 'b2',  view: 'backlog', type: 'task',  text: 'Plan trip to Lisbon — flights, the hotel near Alfama', ago: 21000, status: 'active' },
  { id: 'b3',  view: 'backlog', type: 'task',  text: 'Find a new GP closer to home',                 ago: 22000, status: 'active' },
  { id: 'b4',  view: 'backlog', type: 'task',  text: 'Re-read "How To Take Smart Notes"',            ago: 26000, status: 'done',  completedAt: 18000 },
  { id: 'b6',  view: 'backlog', type: 'task',  text: 'Fix the wobbly drawer in the kitchen',         ago: 30000, status: 'active' },
  { id: 'b7',  view: 'backlog', type: 'task',  text: 'Sort the photo library — finally',             ago: 32000, status: 'active' },
  { id: 'b8',  view: 'backlog', type: 'task',  text: 'Buy a proper raincoat before October',         ago: 33500, status: 'active', when: '2026-09-30' },
  { id: 'b10', view: 'backlog', type: 'task',  text: 'Try pottery class with Asha',                  ago: 36000, status: 'active' },
  { id: 'b11', view: 'backlog', type: 'task',  text: 'Get the bike serviced before spring',          ago: 38000, status: 'done',  completedAt: 24000 },
  { id: 'b12', view: 'backlog', type: 'task',  text: 'Learn to make proper sourdough — not the bad kind', ago: 40000, status: 'active' },
]

export const MIGRATION_QUEUE: MigrationItem[] = [
  { id: 'mq1',  text: 'File the building-insurance receipt' },
  { id: 'mq2',  text: 'Cancel the second streaming service' },
  { id: 'mq3',  text: 'Email Asha re: school dropoff swap' },
  { id: 'mq4',  text: 'Book the dentist follow-up for September' },
  { id: 'mq5',  text: 'Refund Joel for the conference ticket' },
  { id: 'mq6',  text: 'Reply to Linnea about the Friday plans' },
  { id: 'mq7',  text: 'Read chapter 5 of Annie Duke' },
  { id: 'mq8',  text: 'Reorder the cat food and the slow-release flea drops' },
  { id: 'mq9',  text: 'Pay the council tax — direct debit failed last month' },
  { id: 'mq10', text: 'Final sweep on the Q3 deck before Monday' },
]
