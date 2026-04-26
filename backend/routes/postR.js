import express from "express";
import { getInventory, getMember, getParty, getPost, getThisParty, leaveParty, 
    postBounty, searchParty, signupParty, submitResult } from "../controller/post.js";

const router = express.Router();

//router.post("/pic",getPic);
router.post("/getPost",getPost);
router.post("/getParty",getParty);
router.post("/postBounty",postBounty);
router.get("/getMember/:postid",getMember);
router.get("/getThisParty/:postid",getThisParty);
router.post("/signupParty/:postid",signupParty);
router.post("/leaveParty/:postid",leaveParty);
router.post("/searchParty",searchParty);
router.post("/submitResult",submitResult);
router.get("/getInventory",getInventory);
//extra for small componet 

export default router;