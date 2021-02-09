import { Response } from 'express'

function httpErrorBadRequest(res: Response, status?: string) {
    res.status(400).send(status || 'Bad Request')
}

function httpErrorNotFound(res: Response) {
    res.status(404).send('Not Found')
}

function httpInternalServerError(res: Response) {
    res.status(500).send('Internal Server Error')
}

export { httpErrorBadRequest, httpErrorNotFound, httpInternalServerError }
