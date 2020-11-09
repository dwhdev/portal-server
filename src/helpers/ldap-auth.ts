import { Client } from 'ldapts';

const url = `ldap://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`;
const client = new Client({ url });

/**
 * Verifica si las credenciales son válidas o no.
 * @param username nombre del usuario de red.
 * @param password contraseña de red del usuario.
 */
export const authenticate = async (username: string, password: string): Promise<boolean> => {

    // Note: En modo de desarrollo no hace la petición al servidor LDAP de la empresa.
    return !mockUsers.find(x => x.username === username && x.password === password) ? false : true;


    const email = username.includes('@tigo.com.hn') ? username : `${username}@tigo.com.hn`;
    try {
        await client.bind(email, password);
        return true;
    } catch (ex) {
        console.warn(ex);
        return false;
    } finally {
        client.unbind();
    }
};

// Usuarios de pruebas
const mockUsers: { username: string, password: string; }[] = [
    { username: 'jcpalma', password: '123456' },
    { username: 'pepito', password: '123456' },
    { username: 'admin', password: '123456' },
    { username: 'juan', password: '123456' }
];