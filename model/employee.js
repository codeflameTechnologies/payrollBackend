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
      
    },
    PFNo:{
        type:String,
       
    },
    ESINo:{
        type:String,
       
    },
    PanNo:{
        type:String,
        required:true
    },
    BankAccountNo:{
        type:String,   
       
    },
    BankName:{
        type:String,
       
    },
    BankIFSC:{
        type:String,
       
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
       
    },
    company_name:{
        type:String,
        required:true
    },
    designation:{
       type:String,
     
    },
    department_name:{
        type:String,
       
    },
    DOJ:{
        type:Date,
       
    },
    workingHour:{
        type:Number,
       
    },
    earning:{},
    deduction:{},


})


export default mongoose.model("Employee", employeeSchema);