const express = require("express");
const router = express.Router();
const { getOrgProfile,
        updateOrgProfile,
        updateOrgDomainController,
        getOrgUsersController,
        inviteUserController,
        deleteUser,
        changeUserRole
 } = require("../controllers/organization.controller");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer");

router.get("/profile", verifyAccessToken, getOrgProfile);
router.put("/profile", verifyAccessToken,
    upload.fields([
        {name: 'logo', maxCount: 1},
        {name: 'image', maxCount: 1},
    ]),
    updateOrgProfile);
router.post("/domain", verifyAccessToken, updateOrgDomainController);
router.get("/users", verifyAccessToken, getOrgUsersController);
router.post("/users", verifyAccessToken, inviteUserController); 
router.delete("/users/:id", verifyAccessToken, deleteUser);
router.patch("/users/:id/role", verifyAccessToken, changeUserRole);

module.exports = router;
