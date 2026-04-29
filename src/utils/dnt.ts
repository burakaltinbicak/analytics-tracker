export function isDNTEnabled(): boolean {
    return navigator.doNotTrack === '1'
}