export interface ShortenURLRequest {
    url: string
}

export interface ShortenURLResponse {
    shortenedURL: string
}

export interface URLStatsResponse {
    url: string
    hits: number
}
