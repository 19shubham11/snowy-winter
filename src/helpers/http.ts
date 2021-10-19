import { FastifyReply } from 'fastify'

export function httpErrorBadRequest(res: FastifyReply, status?: string) {
    res.status(400).send(status || 'Bad Request')
}

export function httpErrorNotFound(res: FastifyReply) {
    res.status(404).send('Not Found')
}

export function httpInternalServerError(res: FastifyReply) {
    res.status(500).send('Internal Server Error')
}
