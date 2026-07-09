import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    
      empId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
      },
      compId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
      },

      name:{
        type:String,
        required:true
      },
      checkInTime:{
        type:String,
        required:true
      },
      checkOutTime:{
        type:String,
        required:true
      },
      status:{
        type:String,
        required:true
      },
      workingHours:{
        type:String,
        required:true
      },
      date:{
          type:Date,
          required:true

      }



})


export default mongoose.model("attendance",attendanceSchema)