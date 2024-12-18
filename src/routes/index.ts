import { Router } from "express";
import controllers from '../controllers';

const router = Router();

router.get('/search', controllers.products.get);

export default router;