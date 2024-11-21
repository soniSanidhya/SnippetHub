import { Router } from 'express'
import { addSnippet, editSnippet, getSnippets, getSnippetVersions } from '../Controllers/snippet.controllers.js';
import { verifyJWT } from '../Middleware/auth.middleware.js';

const router = Router() 

router.route('/').get(getSnippets);

router.route('/').post(verifyJWT, addSnippet);

router.route('/:snippetId').put(verifyJWT, editSnippet);

router.route('/version/:snippetId').get(getSnippetVersions);

router.route('/:snippetId').delete(verifyJWT );

export default router

