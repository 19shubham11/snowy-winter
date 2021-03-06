type Hash = string

interface ShortenURLRequest {
    url: string
}

interface ShortenURLResponse {
    shortenedURL: string
}

interface URLStatsResponse {
    url: string
    hits: number
}

export { Hash, ShortenURLRequest, ShortenURLResponse, URLStatsResponse }
