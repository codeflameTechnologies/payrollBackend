import Attendance from "../model/attendance.js";

/**
 * 1. CREATE: Record Attendance (All data from Frontend)
 * @route   POST /api/attendance/record
 */
export const recordAttendance = async (req, res) => {
  try {
    const { empId, compId, name, checkInTime, checkOutTime, status, workingHours, date } = req.body;

    // Validation
    if (!empId || !compId || !name || !checkInTime || !checkOutTime || !status || !workingHours || !date) {
      return res.status(400).json({ success: false, message: "Bhai, saari fields aani zaroori hain!" });
    }

    // Normalize date to midnight to prevent duplicate records on the same day
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const existingRecord = await Attendance.findOne({ empId, date: attendanceDate });
    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: `Bhai, ${name} ka attendance is date (${date}) ke liye pehle se hi recorded hai!`
      });
    }

    const newAttendance = new Attendance({
      empId,
      compId,
      name,
      checkInTime: new Date(checkInTime),
      checkOutTime: new Date(checkOutTime),
      status,
      workingHours,
      date: attendanceDate
    });

    await newAttendance.save();
    return res.status(201).json({ success: true, message: "Attendance successfully recorded!", data: newAttendance });

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
    const attendanceRecords = await Attendance.find({});
    console.log(attendanceRecords)
    const employeeMap = {};

    attendanceRecords.forEach((record) => {
      const empIdStr = record.empId.toString();
      const dayOfMonth = new Date(record.date).getDate();

      if (!employeeMap[empIdStr]) {
        employeeMap[empIdStr] = {
          empId: record.empId,
          name: record.name,
          days: {},
          // Dynamic Summary Block - saare status tracks ke liye
          summary: {
            PRESENT: 0,
            LATE: 0,
            ABSENT: 0,
            CL: 0,  // Casual Leave
            WO: 0,  // Weekly Off
            HD: 0,  // Half Day
            PL: 0,  // Privilege Leave
            SL: 0,  // Sick Leave
            TOTAL_DUTY: 0
          }
        };
      }

      // Day record inject karna
      employeeMap[empIdStr].days[dayOfMonth] = {
        checkIn: record.checkInTime,
        checkOut: record.checkOutTime,
        status: record.status.toUpperCase(), // Eg: "CL", "WO", "PRESENT"
        workingHours: record.workingHours
      };

      // --- DYNAMIC SUMMARY LOGIC ---
      const currentStatus = record.status.toUpperCase();

      // Agar status map ke predefined categories mein aata hai toh use increment karo
      if (employeeMap[empIdStr].summary[currentStatus] !== undefined) {
        employeeMap[empIdStr].summary[currentStatus]++;
      }

      // Total Duty count calculation (Jo payslip generation mein kaam aayega)
      // Present, Late, ya Half-Day ko duty day mana jata hai (Aap apni policies ke hisab se modify kar sakte ho)
      if (["PRESENT", "LATE", "HD", "WO"].includes(currentStatus)) {
        employeeMap[empIdStr].summary.TOTAL_DUTY++;
      }
    });
   console.log(employeeMap) 
    // Final layout formatting
    const finalReport = Object.values(employeeMap).map((emp) => {
      const monthlyGrid = [];

      for (let day = 1; day <= totalDaysInMonth; day++) {
        if (emp.days[day]) {
          monthlyGrid.push({
            day: day,
            hasRecord: true,
            ...emp.days[day]
          });
        } else {
          // Agar us din database mein koi record hi nahi dala admin ne, toh automatic ABSENT
          monthlyGrid.push({
            day: day,
            hasRecord: false,
            status: "ABSENT",
            workingHours: "00:00"
          });
          emp.summary.ABSENT++;
        }
      }

      return {
        empId: emp.empId,
        employeeName: emp.name,
        attendanceGrid: monthlyGrid,
        summary: emp.summary // Ab ye frontend par pura calculated box dega
      };
    });

    return res.status(200).json({
      success: true,
      meta: { companyId: compId, year: parseInt(year), month: parseInt(month), totalDaysInMonth },
      data: finalReport
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

    if (!date) {
      return res.status(400).json({ success: false, message: "Date query param me bhejna zaroori hai!" });
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    const records = await Attendance.find({
      compId,
      date: searchDate
    }).populate("empId", "name email department"); // Agar employee model se aur data chahiye to populate use karein

    return res.status(200).json({ success: true, count: records.length, data: records });

  } catch (error) {
    console.error("Error in getCompanyAttendanceByDate:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};