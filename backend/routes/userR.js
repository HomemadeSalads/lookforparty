import express from "express";
import { addGold, buyItem, changeClass, changeProfile, deductGold, 
    getBank, getUser, getUserGear, getUsername } from "../controller/user.js";

const router = express.Router();

router.get("/getUser/:profileid", getUser);
router.post("/changeClass", changeClass);
router.post("/changePicId", changeProfile);
router.post("/getBank",getBank);
router.post("/addGold",addGold);
router.post("/deductGold",deductGold)
router.post("/getGear",getUserGear)
router.post("/buyItem",buyItem)

// small component
router.post("/getUsername", getUsername);

export default router;