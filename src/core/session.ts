const SESSION_KEY = 'tracker_session_id'
const SESSION_TIME_KEY = 'tracker_session_time'
const SESSION_DURATION = 0//10 saniye //30 * 60 * 1000 // 30 dakika

function generateUUID(): string {
    // 1. Modern ve güvenli yöntem (Tarayıcı destekliyorsa)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }

    // 2. Eski tarayıcılar için senin yazdığın fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export function getSessionId(): string {
    // SSR Kontrolü: Tarayıcı ortamında değilsek geçici bir ID dön
    if (typeof window === 'undefined') {
        return generateUUID()
    }

    try {
        const now = Date.now()
        const savedId = localStorage.getItem(SESSION_KEY)
        const savedTime = localStorage.getItem(SESSION_TIME_KEY)

        if (savedId && savedTime && (now - Number(savedTime)) < SESSION_DURATION) {
            localStorage.setItem(SESSION_TIME_KEY, String(now))
            return savedId
        }

        const newId = generateUUID()
        localStorage.setItem(SESSION_KEY, newId)
        localStorage.setItem(SESSION_TIME_KEY, String(now))
        return newId

    } catch (error) {
        // Kullanıcı depolamayı engellediyse uygulama çökmesin, hafızada (memory) ID üretilsin
        console.warn('localStorage erişilemiyor, geçici oturum ID si kullaniliyor.')
        return generateUUID()
    }
}