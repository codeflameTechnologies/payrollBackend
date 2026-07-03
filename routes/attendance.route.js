import express from "express";
import { 
  recordAttendance, 
  updateAttendance, 
  deleteAttendance,  
  getCompanyAttendanceByDate,
  getMonthlyRegisterReport 
} from "../controller/attendance.controller.js";

const router = express.Router();

// --- 1. WRITE OPERATIONS (CREATE / UPDATE / DELETE) ---

// Base route: POST /api/attendance/ -> Naya attendance record save karne ke liye (CL, WO, HD, PRESENT sab yahan se)
router.post("/", recordAttendance);

// PUT /api/attendance/:id -> Kisi specific day ke attendance record ko update karne ke liye
router.put("/:id", updateAttendance);

// DELETE /api/attendance/:id -> Kisi galat entry ko database se delete karne ke liye
router.delete("/:id", deleteAttendance);


// --- 2. READ OPERATIONS / REPORTS (GET) ---

// GET /api/attendance/register-report -> REGISTER MATRIX VIEW (Jo aapne register image bheji thi)
// Postman Query Example: /api/attendance/register-report?compId=123&year=2026&month=3
router.get("/register-report", getMonthlyRegisterReport);

// GET /api/attendance/company/:compId -> Ek specific date par puri company ka data dekhne ke liye
// Postman Query Example: /api/attendance/company/65b2d1?date=2026-03-15
router.get("/company/:compId", getCompanyAttendanceByDate);

// GET /api/attendance/employee/:empId -> Ek employee ka personal calendar report
// Postman Query Example: /api/attendance/employee/65b2d2?year=2026&month=3
//router.get("/employee/:empId", getEmployeeMonthlyReport);


export default router;