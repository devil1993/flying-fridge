import { isExpired, isOnBoard, daysLeft, NOTICE_TTL_DAYS } from './noticeLogic'

const DAY = 86_400_000
const NOW = 1_000_000_000_000

describe('notice expiry', () => {
  it('never expires permanent notices', () => {
    expect(isExpired({ permanent: true, createdAt: 0 }, NOW)).toBe(false)
    expect(daysLeft({ permanent: true, createdAt: 0 }, NOW)).toBeNull()
  })

  it('expires non-permanent notices after the TTL', () => {
    const justCreated = { permanent: false, createdAt: NOW }
    const almost = { permanent: false, createdAt: NOW - (NOTICE_TTL_DAYS - 1) * DAY }
    const past = { permanent: false, createdAt: NOW - (NOTICE_TTL_DAYS + 1) * DAY }
    expect(isExpired(justCreated, NOW)).toBe(false)
    expect(isExpired(almost, NOW)).toBe(false)
    expect(isExpired(past, NOW)).toBe(true)
  })

  it('reports days left, flooring at zero', () => {
    expect(daysLeft({ permanent: false, createdAt: NOW }, NOW)).toBe(NOTICE_TTL_DAYS)
    expect(
      daysLeft({ permanent: false, createdAt: NOW - (NOTICE_TTL_DAYS + 5) * DAY }, NOW),
    ).toBe(0)
  })

  it('is on the board only when up and not expired', () => {
    expect(isOnBoard({ status: 'up', permanent: false, createdAt: NOW }, NOW)).toBe(true)
    expect(isOnBoard({ status: 'down', permanent: false, createdAt: NOW }, NOW)).toBe(false)
    expect(
      isOnBoard({ status: 'up', permanent: false, createdAt: NOW - (NOTICE_TTL_DAYS + 1) * DAY }, NOW),
    ).toBe(false)
    expect(
      isOnBoard({ status: 'up', permanent: true, createdAt: NOW - 10 * NOTICE_TTL_DAYS * DAY }, NOW),
    ).toBe(true)
  })
})
