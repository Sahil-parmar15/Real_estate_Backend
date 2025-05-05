const express = require('express');
const router = express.Router();
const { getAllOrganizations,
        updateCompanyStatus,
        deleteCompany
 } = require("../controllers/superadmin.controller");

router.get('/companies', getAllOrganizations);
router.patch('/companies/:id/status', updateCompanyStatus)
router.delete('/companies/:id', deleteCompany)

module.exports = router;