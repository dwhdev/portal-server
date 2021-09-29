import { CookieOptions, Request, Response } from 'express';

import { authenticate } from '../helpers/ldap-auth';
import { generateJWT } from '../helpers/jwt-helper';

const expireCookies = 60 * 60 * 1000;

const cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: expireCookies,
    sameSite: 'strict',
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ ok: false, message: 'Credenciales invalidas.' });
    }

    try {
        const auth = await authenticate(username, password);

        if (!auth) {
            return res.status(401).json({ ok: false, message: 'Credenciales invalidas.' });
        }

        //TODO: Revisar información del usuario en la base de datos.

        const { token, expiresIn, message } = generateJWT(username);
        if (!token || !expiresIn) {
            return res.status(500).json({ ok: false, message });
        }

        // setTokenOnCookies(res, token);
        res.status(200).cookie('X-TOKEN', token, cookieOptions).json({ ok: true, expiresIn });
    } catch (ex) {
        console.warn(ex);
        res.status(500).json({ ok: false, message: 'Internal error.' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('X-TOKEN').status(200).json({ ok: true });
};

/**
 * Renueva el token para mantener la autenticación vigente.
 * @param req Información de la petición.
 * @param res Información de la respuesta.
 */
export const renewToken = (req: Request, res: Response) => {
    const { authUser: username } = req.context;

    const { token, expiresIn, message } = generateJWT(username);
    if (!token || !expiresIn) {
        return res.status(500).json({ ok: false, message });
    }

    res.status(200).cookie('X-TOKEN', token, cookieOptions).json({ ok: true, expiresIn });
};

/**
 * Verifica si el token es válido y que esté vigente.
 * @param req Información de la petición.
 * @param res Información de la respuesta.
 */
export const verifyToken = (req: Request, res: Response) => {
    return res.status(200).json({ ok: true, expiresIn: req.context.expiresIn });
};
