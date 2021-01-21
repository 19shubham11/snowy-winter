type Hash = string

interface ShortenURLRequest {
    url : string
}

interface ShortenURLResponse {
    shortenedUrl: string
}

interface URLStatsResponse {
    url: string,
    hits: string
}

export { Hash, ShortenURLRequest, ShortenURLResponse, URLStatsResponse }

