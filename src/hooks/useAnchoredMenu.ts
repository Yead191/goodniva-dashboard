import { useEffect, useLayoutEffect, useRef, useState } from 'react'

interface MenuCoords {
  top: number
  left: number
}

/**
 * Drives a dropdown menu that is rendered through a portal and positioned with
 * `position: fixed`. The menu is anchored to a trigger element but flips above
 * the trigger when there isn't enough room below, and is clamped inside the
 * viewport horizontally — so it stays fully visible on any screen size,
 * including rows near the bottom of the page on small laptops.
 *
 * Render the trigger inside `triggerRef` and the portal menu with `menuRef`,
 * applying `coords` via inline `style`.
 */
export const useAnchoredMenu = (menuWidth: number, estimatedHeight = 240) => {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<MenuCoords>({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const computeCoords = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const height = menuRef.current?.offsetHeight || estimatedHeight
    const spaceBelow = window.innerHeight - rect.bottom
    const top =
      spaceBelow < height + 8 && rect.top > spaceBelow
        ? Math.max(8, rect.top - height - 4)
        : rect.bottom + 4
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8))
    setCoords({ top, left })
  }

  const toggle = () => {
    if (!open) computeCoords()
    setOpen((o) => !o)
  }

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  // Refine position once the menu mounts (real height) and keep it anchored
  // while scrolling/resizing.
  useLayoutEffect(() => {
    if (!open) return
    computeCoords()
    const onChange = () => computeCoords()
    window.addEventListener('resize', onChange)
    window.addEventListener('scroll', onChange, true)
    return () => {
      window.removeEventListener('resize', onChange)
      window.removeEventListener('scroll', onChange, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return { open, setOpen, triggerRef, menuRef, coords, toggle }
}
