import express from "express";


const router = express.Router();

router.get("/login", (req, res) => {
    res.json({
        "message": "Login route"
    })
})

router.post("/signup",(req,res)=>{
    res.json({
        "message":"Signup route"
    })
})



export default router;