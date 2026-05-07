import { getPayload } from "../core/payload";
import { enqueue } from "../core/buffer";
import { getSessionId } from "../core/session";
import { cleanup, registerCleanup } from "../core/cleanup";
import { initClickTracker } from "./clicks";
import { initScrollTracker } from "./scroll";
import { initFormTracker } from "./forms";
import { initVisibilityTracker } from "./visibility";

export function initPathTracker(websiteId: string, apiUrl: string) {
    sendPageview(websiteId, apiUrl)

    const originalPushState = history.pushState

    history.pushState = function (...args) {
        originalPushState.apply(this, args)
        cleanup()
        sendPageview(websiteId, apiUrl)
        initTrackers(websiteId, apiUrl)
    }

    const popstateHandler = () => {
        cleanup()
        sendPageview(websiteId, apiUrl)
        initTrackers(websiteId, apiUrl)
    }

    window.addEventListener('popstate', popstateHandler)

    registerCleanup(() => {
        window.removeEventListener('popstate', popstateHandler)
        history.pushState = originalPushState
    })
}

function initTrackers(websiteId: string, apiUrl: string) {
    initClickTracker(websiteId, apiUrl)
    initScrollTracker(websiteId, apiUrl)
    initFormTracker(websiteId, apiUrl)
    initVisibilityTracker(websiteId, apiUrl)
}

function sendPageview(websiteId: string, apiUrl: string) {
    const sessionId = getSessionId();
    const payload = getPayload(websiteId, sessionId);
    enqueue(apiUrl, payload)
}