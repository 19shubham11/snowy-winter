import { FastifyReply } from 'fastify'

function httpErrorBadRequest(res: FastifyReply, status?: string) {
    res.status(400).send(status || 'Bad Request')
}

function httpErrorNotFound(res: FastifyReply) {
    res.status(404).send('Not Found')
}

function httpInternalServerError(res: FastifyReply) {
    res.status(500).send('Internal Server Error')
}

export { httpErrorBadRequest, httpErrorNotFound, httpInternalServerError }
