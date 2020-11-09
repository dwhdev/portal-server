import { Router } from 'express';

import { login, renewToken, verifyToken } from '../controllers/auth-controller';
import { checkAuthenticateJWT } from '../middlewares/jwt-checker';

const router = Router();

router.post('/login', login);

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