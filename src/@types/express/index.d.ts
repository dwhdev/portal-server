import { Request, Response } from 'express';
import { Context } from '../../classes/context';

declare global {
    namespace Express {
        interface Request {
            context: Context;
        }

        interface Response {}
    }
}
