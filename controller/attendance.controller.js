import Attendance from "../model/attendance.js";
import Employee from "../model/employee.js";

/**
 * 1. CREATE: Record Attendance (All data from Frontend)
 * @route   POST /api/attendance/record
 */
export const recordAttendance = async (req, res) => {
  try {
    const {date} = req.query;
    const {attendanceInfo} = req.body;
    console.log(attendanceInfo)
    const updatedAttendanceRecord = attendanceInfo.map((att)=>{
      const selecteddate = new Date(date);
    

      return {
        empId:att.empErpId,
        compId:att.companyId,
        name:att.name,
        checkInTime: new Date(`${date}T${att.checkIn}:00`) || null,
        checkOutTime: new Date(`${date}T${att.checkOut}:00`) || null,
        status:att.status,
        workingHours:att.workingHours,
        date:selecteddate.setHours(0, 0, 0, 0)
        
      }
    
    })

   

    // Normalize date to midnight to prevent duplicate records on the same day
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

   
    const newAttendances = await Attendance.insertMany(updatedAttendanceRecord);
   

 
    return res.status(201).json({ success: true, message: "Attendance successfully recorded!", data: newAttendances });

  } catch (error) {
    console.error("Error in recordAttendance:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * 2. UPDATE: Update Existing Attendance (Data from Frontend)
 * @route   PUT /api/attendance/update/:id
 */
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params; // Attendance Document ID
    const { checkInTime, checkOutTime, status, workingHours, date } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record nahi mila!" });
    }

    // Jo jo frontend se badal kar aaya hai, use update kar do
    if (checkInTime) attendance.checkInTime = new Date(checkInTime);
    if (checkOutTime) attendance.checkOutTime = new Date(checkOutTime);
    if (status) attendance.status = status;
    if (workingHours) attendance.workingHours = workingHours;
    
    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      attendance.date = attendanceDate;
    }

    await attendance.save();
    return res.status(200).json({ success: true, message: "Attendance updated successfully!", data: attendance });

  } catch (error) {
    console.error("Error in updateAttendance:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * 3. DELETE: Delete Attendance Record
 * @route   DELETE /api/attendance/delete/:id
 */
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record nahi mila!" });
    }

    return res.status(200).json({ success: true, message: "Attendance record deleted successfully!" });

  } catch (error) {
    console.error("Error in deleteAttendance:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * 4. GET SINGLE EMPLOYEE MONTHLY REPORT: Ek employee ka poore mahine ka data
 * @route   GET /api/attendance/employee/:empId
 */
/**
 * 6. GET MATRIX REGISTER REPORT: Dynamic Status Summary ke sath (CL, WO, HD, P, A)
 * @route   GET /api/attendance/register-report
 */
export const getMonthlyRegisterReport = async (req, res) => {
  try {
    const { compId, year, month } = req.query;

    if (!compId || !year || !month) {
      return res.status(400).json({ 
        success: false, 
        message: "Bhai, compId, year aur month query params mein zaroori hain!" 
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    // Database se data nikalna
    const attendanceRecords = await Attendance.find({}).populate("empId");
  
    

   

    return res.status(200).json({
      success: true,
      meta: { companyId: attendanceRecords[0].compId, year: parseInt(year), month: parseInt(month), totalDaysInMonth },
      data: attendanceRecords
    });

  } catch (error) {
    console.error("Error in getMonthlyRegisterReport:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * 5. GET COMPANY ALL EMPLOYEES BY DATE: Kisi specific din poori company ka attendance dekhna
 * @route   GET /api/attendance/company/:compId
 */
export const getCompanyAttendanceByDate = async (req, res) => {
  try {
    const { compId } = req.params;
    const { date } = req.query; // Query param: ?date=2026-03-15
    console.log(date)
    
    if (!date) {
      return res.status(400).json({ success: false, message: "Date query param me bhejna zaroori hai!" });
    }

    const searchDate = new Date(date);
   
   
    const records = await Attendance.find({
      compId,
      date: searchDate
    }).populate("empId compId"); // Agar employee model se aur data chahiye to populate use karein
    if(records.length === 0){
      console.log(compId)
      console.log('attendance not found')
        const emptyEmployeeAttendanceRecord = await Employee.find({company_id:compId}).populate("company_id")
        console.log(emptyEmployeeAttendanceRecord)
        return res.json({
          success:true,
          count:emptyEmployeeAttendanceRecord.length,
          data:emptyEmployeeAttendanceRecord.map((emp)=>{
            return {
              empId:emp,
              date:"",
              compId:emp.company_id,
              name:`${emp.firstName} ${emp.lastName}`,
              status:"",
              checkInTime:"",
              checkOutTime:"",
              workingHours:"00:00"

            }
          })
        })
    }

    return res.status(200).json({ success: true, count: records.length, data: records });

  } catch (error) {
    console.error("Error in getCompanyAttendanceByDate:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};