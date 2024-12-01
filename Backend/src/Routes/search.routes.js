import { Router } from "express";
import  SnippetSearchController  from "../Controllers/search.controller.js";

const router = Router();

router.route("/").get(SnippetSearchController.searchSnippets); 
router.route("/autocomplete").get(SnippetSearchController.autocompleteSearch);

export default router;