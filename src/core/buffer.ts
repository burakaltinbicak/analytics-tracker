type QueuedEvent = {
    payload: object
    retries: number
    timestamp: number
}

const queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

const FLUSH_INTERVAL = 5000
const MAX_BATCH_SIZE = 50
const MAX_RETRIES = 3

export function enqueue(apiUrl: string, payload: object) {
    queue.push({ payload, retries: 0, timestamp: Date.now() })

    if (queue.length >= MAX_BATCH_SIZE) {
        flush(apiUrl)
    } else if (!flushTimer) {
        flushTimer = setTimeout(() => flush(apiUrl), FLUSH_INTERVAL)
    }
}

async function flush(apiUrl: string) {
    if (queue.length === 0) return

    const batch = queue.splice(0, MAX_BATCH_SIZE)

    try {
        await fetch(apiUrl + '/api/topla/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: batch.map(b => b.payload) }),
            keepalive: true
        })
    } catch {
        // Başarısız olanları tekrar kuyruğa al
        const failed = batch
            .filter(b => b.retries < MAX_RETRIES)
            .map(b => ({ ...b, retries: b.retries + 1 }))

        queue.unshift(...failed)
    }

    flushTimer = null
}