import { sign, verify } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'U2T48DExkXoHrknlR5LBlFTfIcpIiLC0HECo';

interface IToken {
    iat: number;
    exp: number;
    sub: string;
}

/**
 * Genera un JWT para la autenticación de la aplicación.
 * @param username nombre de usuario.
 */
export const generateJWT = (username: string): { token?: string | null, expiresIn?: number, message?: string; } => {
    try {
        const token = sign({}, SECRET, { expiresIn: '1h', subject: username });
        const { exp } = verify(token, SECRET) as IToken;
        return { token, expiresIn: exp };
    } catch (ex) {
        console.warn('Error al generar token:\n', ex);
        return { message: ex.message };
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
    } catch (ex) {
        switch (ex.name) {
            case 'JsonWebTokenError':
                return { tokenError: { ok: false, message: 'Token invalido.' } };
            case 'TokenExpiredError':
                return { tokenError: { ok: false, message: 'Token expirado.' } };
        }
        return { tokenError: { ok: false, message: ex.message } };
    }
};