import { Router } from 'express';

import { login, logout, renewToken, verifyToken } from '../controllers/auth-controller';
import { checkAuthenticateJWT } from '../middlewares/jwt-checker';

const router = Router();

router.post('/login', login);

router.post('/logout', logout);

router.get('/check',
    [
        checkAuthenticateJWT
    ],
    verifyToken
);

router.get('/renew',
    [
        checkAuthenticateJWT
    ],
    renewToken
);

export = router;