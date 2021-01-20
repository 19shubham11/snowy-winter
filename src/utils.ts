function isValidURL(inp: string): boolean {
    try {
        const url = new URL(inp)
        return true
    } catch(_) {
        return false
    }
}

export { isValidURL }
