import { Request, Response } from 'express'

function checkHealth(_: Request, res: Response) {
    res.send("OK")
}

export { checkHealth }
