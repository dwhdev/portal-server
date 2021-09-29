import { sign, verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const SECRET: string = process.env.JWT_SECRET || '';

interface IToken {
    iat: number;
    exp: number;
    sub: string;
}

/**
 * Genera un JWT para la autenticación de la aplicación.
 * @param username nombre de usuario.
 */
export const generateJWT = (
    username: string
): { token?: string | null; expiresIn?: number; message?: string } => {
    try {
        const token = sign({}, SECRET, { expiresIn: '1h', subject: username });
        const { exp } = verify(token, SECRET) as IToken;
        return { token, expiresIn: exp };
    } catch (ex: any) {
        console.warn('Error al generar token:\n', ex);
        switch (ex.constructor) {
            case JsonWebTokenError:
            case TokenExpiredError:
                return { message: ex.message };
            default:
                return { message: 'Internal error.' };
        }
    }
};

/**
 * Verifica que el token sea válido.
 * @param token token de autenticación.
 */
export const verifyToken = (token: string) => {
    try {
        const { sub: authUser, exp: expiresIn } = verify(token, SECRET) as IToken;
        if (!authUser) {
            return { tokenError: { ok: false, message: 'Token invalido.' } };
        }
        return { authUser, expiresIn };
    } catch (ex: any) {
        switch (ex.constructor) {
            case JsonWebTokenError:
                return { tokenError: { ok: false, message: 'Token invalido.' } };
            case TokenExpiredError:
                return { tokenError: { ok: false, message: 'Token expirado.' } };
        }
        return { tokenError: { ok: false, message: ex.message } };
    }
};
