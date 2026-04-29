import { getPayload } from "../core/payload";
import { send } from "../core/send";
import { getSessionId } from "../core/session";

export function initPathTracker(websiteId: string, apiUrl: string) {
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args)
        sendPageview(websiteId, apiUrl)
    }
    window.addEventListener("popstate", () => {
        sendPageview(websiteId, apiUrl)
    })
}

function sendPageview(websiteId: string, apiUrl: string) {
    const sessionId = getSessionId();
    const payload = getPayload(websiteId, sessionId);
    send(apiUrl, payload)
}