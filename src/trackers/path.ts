import { getPayload } from "../core/payload";
import { enqueue } from "../core/buffer";
import { getSessionId } from "../core/session";
import { cleanup, registerCleanup } from "../core/cleanup";

export function initPathTracker(websiteId: string, apiUrl: string) {
    sendPageview(websiteId, apiUrl)

    const originalPushState = history.pushState

    history.pushState = function (...args) {
        originalPushState.apply(this, args)
        cleanup() // ← diğer tracker'ları temizle
        sendPageview(websiteId, apiUrl)
    }

    const popstateHandler = () => {
        cleanup() // ← diğer tracker'ları temizle
        sendPageview(websiteId, apiUrl)
    }

    window.addEventListener('popstate', popstateHandler)

    registerCleanup(() => {
        window.removeEventListener('popstate', popstateHandler)
        history.pushState = originalPushState // ← orijinaline geri döndür
    })
}

function sendPageview(websiteId: string, apiUrl: string) {
    const sessionId = getSessionId();
    const payload = getPayload(websiteId, sessionId);
    enqueue(apiUrl, payload)
}