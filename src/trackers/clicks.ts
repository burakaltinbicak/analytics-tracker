import { send } from '../core/send'
import { getSessionId } from '../core/session'

export function initClickTracker(websiteId: string, apiUrl: string) {
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        const link = target.closest('a')
        const sessionId = getSessionId()

        send(apiUrl, {
            website_id: websiteId,
            session_id: sessionId,
            event_name: 'click',
            url_path: window.location.pathname,
            event_data: {
                tag: target.tagName.toLowerCase(),
                id: target.id || null,
                class: target.className || null,
                href: link?.href || null,
                text: target.innerText?.slice(0, 100) || null,
                x: event.clientX,
                y: event.clientY,
                xPercent: Math.round((event.clientX / window.innerWidth) * 100),
                yPercent: Math.round((event.clientY / window.innerHeight) * 100),
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight
            }
        })
    })
}