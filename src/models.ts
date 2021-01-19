type Hash = string

interface InpRequest {
    url : URL
}

interface OutRequest {
    shortenedUrl: URL
}

export { Hash, InpRequest, OutRequest }
