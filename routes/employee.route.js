import express from "express"
import { createEmployee, getAllEmployeesByCompany, updateEmployee,deleteEmployee } from "../controller/employee.controller.js";
import { jwtVerify } from "../middleware/jwtVerify.js";
import { adminVerify } from "../middleware/adminVerify.js";

const router = express.Router();
router.use(jwtVerify)
router.use(adminVerify)


router.post("/",createEmployee)
router.get("/:company_id",getAllEmployeesByCompany)


router.put("/:id",updateEmployee)
router.delete("/:id",deleteEmployee)




export default router;