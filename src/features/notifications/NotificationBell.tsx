import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/authContext'
import { useFamily } from '../family/familyContext'
import { useAppNav } from '../app/appNav'
import { track } from '../../lib/firebase'
import { useNotifications } from './useNotifications'
import type { AppNotification } from './types'
import './notifications.css'

function timeAgoKey(createdAt: number, now: number): [string, number] {
  const mins = Math.max(0, Math.floor((now - createdAt) / 60000))
  if (mins < 1) return ['notifications.time.justNow', 0]
  if (mins < 60) return ['notifications.time.minutes', mins]
  const hours = Math.floor(mins / 60)
  if (hours < 24) return ['notifications.time.hours', hours]
  return ['notifications.time.days', Math.floor(hours / 24)]
}

/**
 * The family notification bell: a live unread badge plus a dropdown feed. Real
 * time in-app while open (via the notifications subscription); when the tab is
 * unfocused and OS permission is granted it also raises a system notification —
 * the closest a page-alive PWA gets to background alerts. True closed-app push
 * needs FCM + a server sender (see docs/design/pwa-and-notifications.md).
 */
export default function NotificationBell() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { familyId } = useFamily()
  const { setActive } = useAppNav()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const describe = useCallback(
    (n: AppNotification) =>
      t('notifications.line', {
        name: n.actorName,
        module: t(`${n.module}.title`),
      }),
    [t],
  )

  const onIncoming = useCallback(
    (n: AppNotification) => {
      if (
        typeof Notification !== 'undefined' &&
        Notification.permission === 'granted' &&
        typeof document !== 'undefined' &&
        document.hidden
      ) {
        try {
          new Notification(t('notifications.osTitle'), {
            body: `${describe(n)} — ${n.excerpt}`,
            tag: n.id,
          })
        } catch {
          /* some browsers only allow SW-shown notifications; ignore */
        }
      }
    },
    [t, describe],
  )

  const meId = user?.id ?? ''
  const { items, unreadCount, lastSeen, markAllRead } = useNotifications(
    familyId,
    meId,
    onIncoming,
  )

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const toggle = () => {
    setOpen((v) => {
      const next = !v
      if (next) {
        void track('notifications_open', { unread: unreadCount })
        markAllRead()
      }
      return next
    })
  }

  const openItem = (n: AppNotification) => {
    setActive(n.module)
    setOpen(false)
    void track('notification_click', { module: n.module })
  }

  const canAskPermission =
    typeof Notification !== 'undefined' && Notification.permission === 'default'
  const askPermission = () => void Notification.requestPermission()

  const now = Date.now()

  return (
    <div className="notif" ref={rootRef}>
      <button
        type="button"
        className="notif-bell"
        aria-label={
          unreadCount > 0
            ? t('notifications.bellUnread', { count: unreadCount })
            : t('notifications.bell')
        }
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={toggle}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notif-badge" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-panel" role="menu" aria-label={t('notifications.title')}>
          <div className="notif-head">
            <span className="notif-title">{t('notifications.title')}</span>
          </div>

          {canAskPermission && (
            <button type="button" className="notif-enable" onClick={askPermission}>
              {t('notifications.enable')}
            </button>
          )}

          {items.length === 0 ? (
            <p className="notif-empty">{t('notifications.empty')}</p>
          ) : (
            <ul className="notif-list">
              {items.map((n) => {
                const unread = n.actorId !== meId && n.createdAt > lastSeen
                const [key, count] = timeAgoKey(n.createdAt, now)
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      role="menuitem"
                      className={unread ? 'notif-item is-unread' : 'notif-item'}
                      onClick={() => openItem(n)}
                    >
                      <span className="notif-line">{describe(n)}</span>
                      <span className="notif-excerpt">{n.excerpt}</span>
                      <span className="notif-time">{t(key, { count })}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
