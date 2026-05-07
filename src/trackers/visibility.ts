import { getSessionId } from '../core/session'
import { registerCleanup } from '../core/cleanup'

export function initVisibilityTracker(websiteId: string, apiUrl: string) {
    let activeTime = 0
    let startTime = Date.now()
    let isVisible = !document.hidden

    const visibilityHandler = () => {
        if (document.hidden) {
            activeTime += Date.now() - startTime
            isVisible = false

            // Sekme gizlenince gönder
            const duration = Math.round(activeTime / 1000)
            if (duration > 0) {
                const sessionId = getSessionId()
                const payload = JSON.stringify({
                    website_id: websiteId,
                    session_id: sessionId,
                    event_name: 'time_on_page',
                    url_path: window.location.pathname,
                    event_data: { duration }
                })
                navigator.sendBeacon(apiUrl + '/api/topla', payload)
            }
        } else {
            startTime = Date.now()
            isVisible = true
        }
    }

    const beforeUnloadHandler = () => {
        if (isVisible) {
            activeTime += Date.now() - startTime
        }

        const duration = Math.round(activeTime / 1000)
        if (duration === 0) return

        const sessionId = getSessionId()

        const payload = JSON.stringify({
            website_id: websiteId,
            session_id: sessionId,
            event_name: 'time_on_page',
            url_path: window.location.pathname,
            event_data: { duration }
        })

        const blob = new Blob([payload], { type: 'application/json' })
        navigator.sendBeacon(apiUrl + '/api/topla', blob)
    }

    document.addEventListener('visibilitychange', visibilityHandler)
    window.addEventListener('beforeunload', beforeUnloadHandler)

    registerCleanup(() => {
        document.removeEventListener('visibilitychange', visibilityHandler)
        window.removeEventListener('beforeunload', beforeUnloadHandler)
    })
}