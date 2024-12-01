import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import {
  addSnippetToCollection,
  createCollection,
  deleteCollection,
  getCollectionDetails,
  getCollections,
  removeSnippetFromCollection,
} from "../Controllers/collection.cotrollers.js";
const router = Router();

router.use(verifyJWT);

router.route("/:username").get(getCollections);

router.route("/c/:collectionId").get(getCollectionDetails);



router.route("/").post(createCollection);

router.route("/:username");

router
  .route("/:collectionId/:snippetId")
  .post(addSnippetToCollection)
  .delete(removeSnippetFromCollection);

router.route("/:collectionId").delete(deleteCollection);

export default router;
