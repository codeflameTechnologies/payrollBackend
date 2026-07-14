import express from "express"
import { adminVerify } from "../middleware/adminVerify";
import { jwtVerify } from "../middleware/jwtVerify";

const router = express.Router();

router.use(jwtVerify)
router.use(adminVerify)


router.get("/",(req,res)=>{
    res.json({
        message:"get all payroll route"
    })
})

router.get("/:id",(req,res)=>{
    res.json({
        message:"get single payroll route"
    })
})

router.post("/",(req,res)=>{
    res.json({
        message:"Payroll registeration route"
    })
})

router.put("/",(req,res)=>{
    res.json({
        message:"Payroll update route"
    })
})

router.delete("/",(req,res)=>{
    res.json({
        message:"Payroll delete route"
    })
})


export default router;