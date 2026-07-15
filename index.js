import express from "express";
import { config } from "dotenv";
import { dbConnect } from "./config/db.js";
import companyRoute from "./routes/company.route.js";
import attedanceRoute from "./routes/attendance.route.js";
import employeeRoute from "./routes/employee.route.js";
import authRoute from "./routes/auth.route.js";
import accessRoute from "./routes/access.route.js";
import cors from "cors";
import { jwtVerify } from "./middleware/jwtVerify.js";

config();

dbConnect();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 8000;


// check login
app.get("/codeflame/payroll",jwtVerify,(req,res)=>{
  return res.json(req.user);
})

app.use("/codeflame/payroll/api/auth", authRoute);
app.use("/codeflame/payroll/api/access", accessRoute);
app.use("/codeflame/payroll/api/company", companyRoute);
app.use("/codeflame/payroll/api/attendance", attedanceRoute);
app.use("/codeflame/payroll/api/employee", employeeRoute);






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});