import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../helpers/jwt-helper';

export const checkAuthenticateJWT = (req: Request, res: Response, next: NextFunction) => {

    const token: string = req.cookies.SESSIONID || null;

    if (!token) {
        return res.status(401).json({ ok: false, message: 'El token es requerido.' });
    }

    const { authUser, expiresIn, tokenError } = verifyToken(token);
    if (tokenError || !authUser || !expiresIn) {
        return res.status(401).json(tokenError);
    }

    //TODO: Revisar información del usuario en la base de datos.


    req.authUser = authUser;
    req.expiresIn = expiresIn;
    next();
};

