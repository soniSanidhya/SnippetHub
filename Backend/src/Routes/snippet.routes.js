import { Router } from 'express'
import { addSnippet, addView, deleteSnippet, deleteVersion, editSnippet, getRecommendedSnippets, getSnippetDetails, getSnippets, getSnippetVersions } from '../Controllers/snippet.controllers.js';
import { verifyJWT } from '../Middleware/auth.middleware.js';
import codeExecution from '../Controllers/codeEexecution.js';

const router = Router() 

router.route('/').get(getSnippets);

router.route('/snippet-details/:snippetId').get(getSnippetDetails);

router.route('/recommended-snippets').get(getRecommendedSnippets);

router.route('/').post(verifyJWT, addSnippet);

router.route('/:snippetId').put(verifyJWT, editSnippet);

router.route('/v/:snippetId').get(getSnippetVersions);

router.route('/:snippetId').delete(verifyJWT , deleteSnippet );

router.route('/v/:versionId').delete(verifyJWT , deleteVersion );

router.route('/view/:snippetId').post(addView);

router.route('/code-execution').post(codeExecution)


export default router

