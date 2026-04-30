export async function send(apiUrl: string, payload: object, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(apiUrl + '/api/topla', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            });

            if (res.ok) return; // başarılı, çık

        } catch (err) {
            const sonDeneme = i === retries - 1;

            if (sonDeneme) {
                console.warn('[Analytics] Gönderilemedi, veri kaybedildi:', payload);
            } else {
                await new Promise(r => setTimeout(r, 1000 * (i + 1))); // 1sn, 2sn, 3sn
            }
        }
    }
}