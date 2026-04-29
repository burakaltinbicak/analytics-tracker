const PARAMS_TO_REMOVE = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'gclid', 'msclkid'
]

export function normalizeUrl(path: string): string {
    const url = new URL(path, window.location.origin)

    PARAMS_TO_REMOVE.forEach(param => url.searchParams.delete(param))

    return url.pathname + (url.search ? url.search : '')
}