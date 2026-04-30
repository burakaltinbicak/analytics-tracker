// src/core/config.ts
interface TrackerConfig {
    websiteId: string
    apiUrl: string
    debug: boolean
    sampleRate: number
}

export function validateConfig(script: HTMLScriptElement): TrackerConfig | null {
    const websiteId = script.getAttribute('data-website-id')
    const apiUrl = script.getAttribute('data-api-url')

    if (!websiteId || !apiUrl) {
        console.error('[Tracker] data-website-id ve data-api-url zorunlu!')
        return null
    }

    try {
        new URL(apiUrl)
    } catch {
        console.error('[Tracker] Geçersiz api-url:', apiUrl)
        return null
    }

    return {
        websiteId,
        apiUrl: apiUrl.replace(/\/$/, ''),
        debug: script.getAttribute('data-debug') === 'true',
        sampleRate: Number(script.getAttribute('data-sample-rate')) || 100
    }
}