import { send } from '../core/send'
import { getSessionId } from '../core/session'

export function initScrollTracker(websiteId: string, apiUrl: string) {
    const reached = new Set<number>()
    const thresholds = [25, 50, 75, 100]
    const MIN_DWELL_TIME = 2000 // 2 saniye o bölgede kalmalı
    const dwellTimers = new Map<number, ReturnType<typeof setTimeout>>()

    function getScrollPercent(): number {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        if (docHeight === 0) return 100
        return Math.round((scrollTop / docHeight) * 100)
    }

    function onScroll() {
        const percent = getScrollPercent()

        thresholds.forEach(threshold => {
            if (reached.has(threshold)) return

            if (percent >= threshold) {
                // Daha önce timer yoksa başlat
                if (!dwellTimers.has(threshold)) {
                    const timer = setTimeout(() => {
                        // 2 saniye sonra hâlâ o bölgedeyse gönder
                        if (getScrollPercent() >= threshold) {
                            reached.add(threshold)
                            const sessionId = getSessionId()
                            send(apiUrl, {
                                website_id: websiteId,
                                session_id: sessionId,
                                event_name: 'scroll',
                                url_path: window.location.pathname,
                                event_data: {
                                    depth: threshold,
                                    percent: percent
                                }
                            })
                        }
                        dwellTimers.delete(threshold)
                    }, MIN_DWELL_TIME)
                    dwellTimers.set(threshold, timer)
                }
            } else {
                // O bölgeden çıktıysa timer'ı iptal et
                if (dwellTimers.has(threshold)) {
                    clearTimeout(dwellTimers.get(threshold)!)
                    dwellTimers.delete(threshold)
                }
            }
        })
    }

    let throttleTimer: ReturnType<typeof setTimeout> | null = null

    window.addEventListener('scroll', () => {
        if (throttleTimer) return
        throttleTimer = setTimeout(() => {
            onScroll()
            throttleTimer = null
        }, 200)
    })
}