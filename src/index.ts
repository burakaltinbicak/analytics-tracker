import { getPayload } from './core/payload'
import { send } from './core/send'
import { getSessionId } from './core/session'
import { isDNTEnabled } from './utils/dnt'
import { initPathTracker } from './trackers/path'
import { initClickTracker } from './trackers/clicks'
import { initScrollTracker } from './trackers/scroll'
import { initFormTracker } from './trackers/forms'
import { initVisibilityTracker } from './trackers/visibility'

(function () {
    if (isDNTEnabled()) return

    const script = document.currentScript as HTMLScriptElement
    const websiteId = script?.getAttribute('data-website-id')
    const apiUrl = script?.getAttribute('data-api-url')

    if (!websiteId || !apiUrl) return

    const sessionId = getSessionId()
    const payload = getPayload(websiteId, sessionId)
    send(apiUrl, payload)

    initPathTracker(websiteId, apiUrl)
    initClickTracker(websiteId, apiUrl)
    initScrollTracker(websiteId, apiUrl)
    initFormTracker(websiteId, apiUrl)
    initVisibilityTracker(websiteId, apiUrl)
})()