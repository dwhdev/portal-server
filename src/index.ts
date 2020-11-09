require('dotenv').config();
import { PortalServer } from './classes/portal-server';

const server = PortalServer.instance;

server.start((port) => {
    console.log('Portal Server running on port', port);
});