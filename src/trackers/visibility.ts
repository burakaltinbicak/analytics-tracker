import { send } from '../core/send'
import { getSessionId } from '../core/session'

export function initVisibilityTracker(websiteId: string, apiUrl: string) {
    let activeTime = 0
    let startTime = Date.now()
    let isVisible = !document.hidden

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Sekme gizlendi, o ana kadar geçen süreyi ekle
            activeTime += Date.now() - startTime
            isVisible = false
        } else {
            // Sekme tekrar görünür oldu, sayacı yeniden başlat
            startTime = Date.now()
            isVisible = true
        }
    })

    window.addEventListener('beforeunload', () => {
        // Sayfa kapanıyor, eğer hala görünürse son süreyi de ekle
        if (isVisible) {
            activeTime += Date.now() - startTime
        }

        const duration = Math.round(activeTime / 1000) // saniyeye çevir

        if (duration === 0) return

        const sessionId = getSessionId()
        send(apiUrl, {
            website_id: websiteId,
            session_id: sessionId,
            event_name: 'time_on_page',
            url_path: window.location.pathname,
            event_data: { duration }
        })
    })
}