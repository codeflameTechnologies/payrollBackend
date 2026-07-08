import express from "express"
import { createEmployee, getAllEmployeesByCompany, updateEmployee } from "../controller/employee.controller.js";

const router = express.Router();



router.post("/",createEmployee)
router.get("/:company_id",getAllEmployeesByCompany)


router.put("/:id",updateEmployee)
router.delete("/",(req,res)=>{
    res.json({
        "message":"Employee delete route"
    })
})




export default router;