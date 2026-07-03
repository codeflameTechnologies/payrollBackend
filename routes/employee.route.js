import express from "express"
import { createEmployee } from "../controller/employee.controller.js";

const router = express.Router();

router.get("/",(req,res)=>{
    res.json({
        "message":"get all employee route"
    })
})

router.get("/:id",(req,res)=>{
    res.json({
        "message":"get single employee route"
    })
})

router.post("/",createEmployee)

router.put("/:id",(req,res)=>{
    res.json({
        "message":"Employee update route"
    })
})
router.delete("/",(req,res)=>{
    res.json({
        "message":"Employee delete route"
    })
})




export default router;