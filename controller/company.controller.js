import express from "express"
import companyModal from "../model/company.js"
import attendanceModel from "../model/attendance.js"
import employeeModel from "../model/employee.js"


export const registerCompany = async (req,res)=>{
    console.log(req.body)
    const { companyName,email,mobile,address,website,earning,deduction,leavePolicies } = req.body;

    try {
       if(!companyName || !email || !mobile) {
        return res.status(400).json({
            "message":"Please fill all required fields"
        })
       }  

       const existingCompany = await companyModal.findOne({ email });
       if(existingCompany) {
        return res.status(400).json({
            "message":"Company already exists"
        })
       }
       
       const newCompany = new companyModal({
            name: companyName,
            email,
            mobile,
            website,
            address,
            earning,
            deduction,
            leavePolicies
       })
       
       await newCompany.save();
       return res.status(201).json({
        "message":"Company registered successfully"
       })

    } catch (error) {
      return res.status(500).json({
        "message":error.message
      })  
    }
}

export const getAllCompanies = async (req,res)=>{
    try {
        const companies = await companyModal.find();
        return res.status(200).json({
            "message":"Companies fetched successfully",
            "data":companies
        })
    } catch (error) {
        return res.status(500).json({
            "message":error.message
        })
    }
}



export const updateCompany = async (req,res)=>{
    const { companyId } = req.params;
    const { companyName,email,mobile,website,addresss,earning,deduction,leavePolicies } = req.body;
    console.log(req.body)
    
    try {
        const company = await companyModal.findById(companyId);
        if(!company) {
            return res.status(404).json({
                "message":"Company not found"
            })
        }

        company.name = companyName || company.name;
        company.email = email || company.email;
        company.mobile = mobile || company.mobile;
        company.website = website || company.website;
        company.address = addresss || company.address;
        company.earning = earning || company.earning;
        company.deduction = deduction || company.deduction;
        company.leavePolicies = leavePolicies || company.leavePolicies;

        await company.save();
        return res.status(200).json({
            "message":"Company updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            "message":error.message
        })
    }
}

export const deleteCompany = async (req,res)=>{
    const { companyId } = req.params;
    try {
        const company = await companyModal.findById(companyId);
        if(!company) {
            return res.status(404).json({
                "message":"Company not found"
            })
        }
    
        await companyModal.findByIdAndDelete(companyId);
        await attendanceModel.deleteMany({compId:companyId})
        await employeeModel.deleteMany({company_id:companyId})
        return res.status(200).json({
            "message":"Company deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            "message":error.message
        })
    }
}
