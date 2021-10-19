export function isValidURL(inp: string): boolean {
    try {
        new URL(inp)
        return true
    } catch (_) {
        return false
    }
}
