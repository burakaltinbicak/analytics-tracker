export function send(apiUrl: string, payload: object) {
    fetch(apiUrl + '/api/topla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
    }).catch(() => { })
}