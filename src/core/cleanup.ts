const cleanupFns: Array<() => void> = []

export function registerCleanup(fn: () => void) {
    cleanupFns.push(fn)
}

export function cleanup() {
    cleanupFns.forEach(fn => fn())
    cleanupFns.length = 0
}