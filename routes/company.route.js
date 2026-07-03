import express from "express";
import {
  registerCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
} from "../controller/company.controller.js";

const router = express.Router();

// Get all companies
router.get("/", getAllCompanies);

// Create company
router.post("/", registerCompany);

// Update company
router.put("/:companyId", updateCompany);

// Delete company
router.delete("/:companyId", deleteCompany);

export default router;