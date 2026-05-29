import { expect, test, type Page } from '@playwright/test'

type EntryView = 'daily' | 'weekly' | 'monthly' | 'backlog'
type EntryStatus = 'active' | 'done' | 'migrated'
type EntryType = 'task' | 'event'

interface TestEntry {
  id: string
  view: EntryView
  type: EntryType
  text: string
  ago: number
  status: EntryStatus
  createdAt: number
  migratedTo?: string
}

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const startOfThisWeek = () => {
  const d = new Date()
  const dayOfWeek = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - dayOfWeek)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const startOfThisMonth = () => {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

async function seedEntries(page: Page, entries: TestEntry[]) {
  await page.addInitScript((payload) => {
    window.localStorage.setItem('bj-entries', JSON.stringify(payload.entries))
    window.localStorage.setItem('bj-last-open', String(Date.now()))
  }, { entries })
}

test.describe('Story 2.4 - Period scoped entry display', () => {
  test('Daily view shows only entries from today', async ({ page }) => {
    const todayBoundary = startOfToday()
    const entries: TestEntry[] = [
      {
        id: 'daily-current-active',
        view: 'daily',
        type: 'task',
        text: 'daily current active',
        ago: 10,
        status: 'active',
        createdAt: todayBoundary + 10_000,
      },
      {
        id: 'daily-current-done',
        view: 'daily',
        type: 'task',
        text: 'daily current done',
        ago: 20,
        status: 'done',
        createdAt: todayBoundary + 20_000,
      },
      {
        id: 'daily-prev-done',
        view: 'daily',
        type: 'task',
        text: 'daily prev done',
        ago: 30,
        status: 'done',
        createdAt: todayBoundary - 2,
      },
      {
        id: 'daily-prev-migrated',
        view: 'daily',
        type: 'task',
        text: 'daily prev migrated',
        ago: 40,
        status: 'migrated',
        migratedTo: 'tomorrow',
        createdAt: todayBoundary - 3,
      },
      {
        id: 'weekly-control',
        view: 'weekly',
        type: 'task',
        text: 'weekly control',
        ago: 5,
        status: 'active',
        createdAt: todayBoundary + 5_000,
      },
    ]

    await seedEntries(page, entries)
    await page.goto('/')

    await expect(page.getByText('daily current active')).toBeVisible()
    await expect(page.getByText('daily current done')).toBeVisible()

    await expect(page.getByText('daily prev done')).not.toBeVisible()
    await expect(page.getByText('daily prev migrated')).not.toBeVisible()
    await expect(page.getByText('weekly control')).not.toBeVisible()
  })

  test('Weekly and Monthly views apply the correct period boundaries', async ({ page }) => {
    const weekBoundary = startOfThisWeek()
    const monthBoundary = startOfThisMonth()
    const entries: TestEntry[] = [
      {
        id: 'weekly-current',
        view: 'weekly',
        type: 'task',
        text: 'weekly current',
        ago: 10,
        status: 'active',
        createdAt: weekBoundary + 10_000,
      },
      {
        id: 'weekly-prev',
        view: 'weekly',
        type: 'task',
        text: 'weekly prev',
        ago: 20,
        status: 'active',
        createdAt: weekBoundary - 1,
      },
      {
        id: 'monthly-current',
        view: 'monthly',
        type: 'task',
        text: 'monthly current',
        ago: 30,
        status: 'active',
        createdAt: monthBoundary + 10_000,
      },
      {
        id: 'monthly-prev',
        view: 'monthly',
        type: 'task',
        text: 'monthly prev',
        ago: 40,
        status: 'migrated',
        migratedTo: 'this month',
        createdAt: monthBoundary - 1,
      },
    ]

    await seedEntries(page, entries)
    await page.goto('/')

    await page.getByRole('tab', { name: /weekly/i }).click()
    await expect(page.getByText('weekly current')).toBeVisible()
    await expect(page.getByText('weekly prev')).not.toBeVisible()

    await page.getByRole('tab', { name: /monthly/i }).click()
    await expect(page.getByText('monthly current')).toBeVisible()
    await expect(page.getByText('monthly prev')).not.toBeVisible()
  })

  test('Backlog view remains unfiltered by period boundary', async ({ page }) => {
    const monthBoundary = startOfThisMonth()
    const entries: TestEntry[] = [
      {
        id: 'backlog-recent',
        view: 'backlog',
        type: 'task',
        text: 'backlog recent',
        ago: 10,
        status: 'active',
        createdAt: monthBoundary + 10_000,
      },
      {
        id: 'backlog-old',
        view: 'backlog',
        type: 'task',
        text: 'backlog old',
        ago: 20,
        status: 'done',
        createdAt: monthBoundary - 31 * 24 * 60 * 60 * 1000,
      },
    ]

    await seedEntries(page, entries)
    await page.goto('/')

    await page.getByRole('tab', { name: /future log/i }).click()
    await expect(page.getByText('backlog recent')).toBeVisible()
    await expect(page.getByText('backlog old')).toBeVisible()
  })
})
