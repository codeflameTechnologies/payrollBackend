import express from "express"
import { createEmployee, getAllEmployeesByCompany, updateEmployee } from "../controller/employee.controller.js";
import { jwtVerify } from "../middleware/jwtVerify.js";
import { adminVerify } from "../middleware/adminVerify.js";

const router = express.Router();
router.use(jwtVerify)
router.use(adminVerify)


router.post("/",createEmployee)
router.get("/:company_id",getAllEmployeesByCompany)


router.put("/:id",updateEmployee)
router.delete("/",(req,res)=>{
    res.json({
        "message":"Employee delete route"
    })
})




export default router;