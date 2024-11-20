import { Router } from 'express'
import { addSnippet, editSnippet, getSnippets } from '../Controllers/snippet.controllers.js';
import { verifyJWT } from '../Middleware/auth.middleware.js';

const router = Router() 

router.route('/').get(getSnippets);

router.route('/').post(verifyJWT, addSnippet);

router.route('/:snippetId').put(verifyJWT, editSnippet);

export default router