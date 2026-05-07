type QueuedEvent = {
    payload: object
    retries: number
    timestamp: number
}

const queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

const FLUSH_INTERVAL = 2000
const MAX_BATCH_SIZE = 10000
const MAX_RETRIES = 3

export function enqueue(apiUrl: string, payload: object) {
    queue.push({ payload, retries: 0, timestamp: Date.now() })

    if (queue.length >= MAX_BATCH_SIZE) {
        // Manuel tetiklemede var olan sayacı temizle (Çift flush'ı engeller)
        if (flushTimer) {
            clearTimeout(flushTimer)
            flushTimer = null
        }
        flush(apiUrl)
    } else if (!flushTimer) {
        flushTimer = setTimeout(() => flush(apiUrl), FLUSH_INTERVAL)
    }
}

async function flush(apiUrl: string) {
    // ÇOK KRİTİK: Sayacı fetch beklemeden ÖNCE sıfırlıyoruz.
    // Böylece istek sürerken gelen yeni tıklamalar kuyrukta kalmayıp yeni sayacını başlatabilir.
    flushTimer = null

    if (queue.length === 0) return

    const batch = queue.splice(0, MAX_BATCH_SIZE)

    try {
        const response = await fetch(apiUrl + '/api/topla/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: batch.map(b => b.payload) }),
            keepalive: true
        })

        // HTTP Hatalarını yakala ki retry mekanizması (catch bloğu) düzgün çalışsın
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
        }
    } catch (error) {
        // Başarısız olanları tekrar kuyruğa al
        const failed = batch
            .filter(b => b.retries < MAX_RETRIES)
            .map(b => ({ ...b, retries: b.retries + 1 }))

        queue.unshift(...failed)

        // Tekrar kuyruğa eleman eklediğimiz için sistemi durdurmamak adına yeni timer başlat
        if (queue.length > 0 && !flushTimer) {
            flushTimer = setTimeout(() => flush(apiUrl), FLUSH_INTERVAL)
        }
    }
}