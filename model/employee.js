import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({

    empId:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,  
    },
    fatherName:{
        type:String,
        required:true
    },
    email:{
        type:String,
       
    },
    mobile:{
        type:String,
        
    },
    gender:{
        type:String,
        enum:["male","female","other",""]
    },
    aadhaarNo:{
        type:String,
        required:true
    },
    PFNo:{
        type:String,
        required:true
    },
    ESINo:{
        type:String,
        required:true
    },
    PanNo:{
        type:String,
        required:true
    },
    BankAccountNo:{
        type:String,   
        required:true
    },
    BankName:{
        type:String,
        required:true
    },
    BankIFSC:{
        type:String,
        required:true
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    company_name:{
        type:String,
        required:true
    },
    designation:{
       type:String,
       required:true
    },
    department_name:{
        type:String,
        required:true
    },
    DOJ:{
        type:Date,
        required:true
    },
    workingHour:{
        type:Number,
        required:true
    },
    earning:{},
    deduction:{},


})


export default mongoose.model("Employee", employeeSchema);