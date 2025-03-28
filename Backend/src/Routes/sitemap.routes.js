import { Router } from "express";
import { generateSitemap } from "../Controllers/sitemap.controller.js";

const router = Router();

router.get("/sitemap.xml", generateSitemap);

export default router;
