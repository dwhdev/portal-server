import express, { Application } from 'express';
import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
// import { Server as HTTPServer } from 'https';
// import fs from 'fs';
// import path from 'path';

import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieParsers from 'cookie-parser';


export class PortalServer {

    private static serverInstance: PortalServer;

    private readonly port: number;
    private readonly app: Application;
    private readonly httpServer: HTTPServer;
    private readonly ioServer: SocketServer;

    private constructor() {
        // const key = fs.readFileSync(path.join(__dirname, '../../cert/localhost.key'), 'utf-8');
        // const cert = fs.readFileSync(path.join(__dirname, '../../cert/localhost.crt'), 'utf-8');
        this.port = Number(process.env.PORT) || 3069;
        this.app = express();
        // this.httpServer = new HTTPServer({ key, cert }, this.app);
        this.httpServer = new HTTPServer(this.app);
        this.ioServer = new SocketServer(this.httpServer);
        this.setupMiddlewares();
        this.setupIO();
        this.setupRouters();
    }

    /**
     * Devuelve la instancia del servicio del portal.
     */
    public static get instance(): PortalServer {
        return PortalServer.serverInstance || (PortalServer.serverInstance = new PortalServer());
    }

    /**
     * Inicializa los middlewares para express.
     */
    private setupMiddlewares(): void {
        this.app.use(urlencoded({ extended: true }));
        this.app.use(json());
        this.app.use(cors({ origin: true, credentials: true }));
        this.app.use(cookieParsers(process.env.COOKIE_SECRET));
        this.app.use(morgan('tiny'));
    }

    private setupIO(): void {
        this.ioServer.on('connection', (client: Socket) => {
            console.log('[socket.io] client connected');

            client.on('disconnect', () => console.log('[socket.io] client disconnected'));

        });
    }

    /**
     * Configura las rutas del API del servidor.
     */
    private setupRouters(): void {
        this.app.use('/api/auth', require('../routes/auth-route'));
    }


    /**
     * inicia el servidor del portal.
     * @param callback indica el puerto donde inicio el servidor.
     */
    public start(callback: (port: number) => void): void {

        this.httpServer.listen(this.port, () => {
            return callback(this.port);
        });
    }
}