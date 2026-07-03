import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    website:{
        type:String 
    },
    earning:[],
    deduction:[],
    leavePolicies:[]
})

export default mongoose.model("Company",companySchema)