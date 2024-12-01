import Router from 'express';
import { getAllCategory } from '../Controllers/category.controllers.js';

const router = Router();

router.route('/').get(getAllCategory);


export default router;