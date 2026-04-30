import { enqueue } from '../core/buffer'
import { getSessionId } from '../core/session'
import { normalizeUrl } from '../utils/normalize'
import { registerCleanup } from '../core/cleanup'

let clickBuffer: MouseEvent[] = []
const CLICK_BUFFER_TIME = 1000

export function initClickTracker(websiteId: string, apiUrl: string) {
    const handler = (event: MouseEvent) => {
        const target = event.target as HTMLElement

        // Sadece anlamlı elementler
        const clickable = target.closest('a, button, [role="button"], input[type="submit"]')
        if (!clickable) return

        // Debounce - 1 saniyede bir click
        if (clickBuffer.length > 0 && Date.now() - clickBuffer[clickBuffer.length - 1].timeStamp < CLICK_BUFFER_TIME) {
            return
        }

        clickBuffer.push(event)
        if (clickBuffer.length > 10) clickBuffer.shift()

        const link = target.closest('a')
        const sessionId = getSessionId()

        enqueue(apiUrl, {
            website_id: websiteId,
            session_id: sessionId,
            event_name: 'click',
            url_path: normalizeUrl(window.location.pathname),
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
    }

    document.addEventListener('click', handler)

    registerCleanup(() => {
        document.removeEventListener('click', handler)
        clickBuffer = []
    })
}