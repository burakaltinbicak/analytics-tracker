import { isDNTEnabled } from './utils/dnt'
import { validateConfig } from './core/config'
import { initPathTracker } from './trackers/path'
import { initClickTracker } from './trackers/clicks'
import { initScrollTracker } from './trackers/scroll'
import { initFormTracker } from './trackers/forms'
import { initVisibilityTracker } from './trackers/visibility'

(function () {
    if (isDNTEnabled()) return

    const script = document.currentScript as HTMLScriptElement
    const config = validateConfig(script)
    if (!config) return

    initPathTracker(config.websiteId, config.apiUrl)
    initClickTracker(config.websiteId, config.apiUrl)
    initScrollTracker(config.websiteId, config.apiUrl)
    initFormTracker(config.websiteId, config.apiUrl)
    initVisibilityTracker(config.websiteId, config.apiUrl)
})()