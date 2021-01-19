import { Request, Response } from 'express';
import {InpRequest, OutRequest} from '../models'
import * as hash from '../helpers/hash'


function checkHealth(_: Request, res: Response) {
    res.send("Ok")
}

export {checkHealth}
