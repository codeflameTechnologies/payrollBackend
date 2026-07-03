import express from "express";
import {config} from "dotenv";
import { dbConnect}  from "./config/db.js";
import companyRoute from "./routes/company.route.js";
import attedanceRoute from "./routes/attendance.route.js"
import employeeRoute from "./routes/employee.route.js"
import cors from "cors";

config();

dbConnect();

const app = express();

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 8000;


app.use("/codeflame/payroll/api/company",companyRoute)
app.use("/codeflame/payroll/api/attendance",attedanceRoute)
app.use("/codeflame/payroll/api/employee", employeeRoute)






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});