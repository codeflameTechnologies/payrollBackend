import Employee from "../model/employee.js"; // Adjust the path to your actual model file

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Private
 */
export const createEmployee = async (req, res) => {
    try {
        const { empId, email, aadhaarNo, PanNo } = req.body;

        // 1. Check if employee with unique fields already exists
        const existingEmployee = await Employee.findOne({
            $or: [{ empId }, { email }]
        });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: "Employee with this empId or email already exists."
            });
        }

        // 2. Create the new employee
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: savedEmployee
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: Failed to create employee",
            error: error.message
        });
    }
};

/**
 * @desc    Get all employees (with basic pagination & company filtering)
 * @route   GET /api/employees
 * @access  Private
 */
export const getAllEmployees = async (req, res) => {
    try {
        const { company_id, page = 1, limit = 10 } = req.query;
        
        // Build a dynamic filter object
        const filter = {};
        if (company_id) filter.company_id = company_id;

        // Pagination calculations
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const employees = await Employee.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }); // Assumes timestamps, otherwise fallback to _id

        const totalEmployees = await Employee.countDocuments(filter);

        return res.status(200).json({
            success: true,
            count: employees.length,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: parseInt(page),
            data: employees
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: Failed to fetch employees",
            error: error.message
        });
    }
};

/**
 * @desc    Get a single employee by MongoDB ID or custom empId
 * @route   GET /api/employees/:id
 * @access  Private
 */
export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        // Handle lookup by either MongoDB ObjectId or the custom string `empId`
        const employee = id.match(/^[0-9a-fA-F]{24}$/) 
            ? await Employee.findById(id).populate("company_id")
            : await Employee.findOne({ empId: id }).populate("company_id");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: Failed to fetch employee",
            error: error.message
        });
    }
};

/**
 * @desc    Update employee details
 * @route   PUT /api/employees/:id
 * @access  Private
 */
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent modification of unique identifiers via update if needed, 
        // or let Mongoose handle validation via `runValidators`
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true } // returns the updated doc & fires schema validations
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee details updated successfully",
            data: updatedEmployee
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: Failed to update employee",
            error: error.message
        });
    }
};

/**
 * @desc    Delete an employee
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee profile deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: Failed to delete employee",
            error: error.message
        });
    }
};