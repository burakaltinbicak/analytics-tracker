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

        navigator.sendBeacon(apiUrl + '/api/topla', payload)
    }

    document.addEventListener('visibilitychange', visibilityHandler)
    window.addEventListener('beforeunload', beforeUnloadHandler)

    registerCleanup(() => {
        document.removeEventListener('visibilitychange', visibilityHandler)
        window.removeEventListener('beforeunload', beforeUnloadHandler)
        activeTime = 0
        startTime = Date.now()
        isVisible = !document.hidden
    })
}