type Hash = string

interface ShortenURLRequest {
    url : string
}

interface ShortenURLResponse {
    shortenedUrl: string
}

export { Hash, ShortenURLRequest, ShortenURLResponse }
