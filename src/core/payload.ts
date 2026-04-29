import { normalizeUrl } from '../utils/normalize'

export function getPayload(websiteId: string, sessionId: string) {
    return {
        website_id: websiteId,
        session_id: sessionId,
        event_name: 'pageview',
        url_path: normalizeUrl(window.location.pathname), // ← değişti
        referrer: document.referrer || null,
        language: navigator.language,
        screen: window.screen.width + 'x' + window.screen.height,
        user_agent: navigator.userAgent
    }
}