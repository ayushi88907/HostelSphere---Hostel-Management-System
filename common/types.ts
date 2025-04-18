import { z } from "zod";
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,20}$/;

export const studentRegisterSchema = z.object({
    id: z.string().optional(),
    role: z.enum(["Student"]),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Email is not valid." }),
    studentId: z.string().min(1, { message: "Student ID is required" }),
    courseName: z.string().min(1, { message: "Course name is required" }),
    otherCourseName: z.string().optional(),
    isVerified: z.enum(["Approved", "Pending","Rejected"]).default("Pending"),
    password: z
      .string()
      .min(5, { message: "Password length cannot be less than 5 characters" })
      .max(20, { message: "Password length cannot exceed 20 characters" })
      .regex(passwordRegex, {
        message:
          "Password must include at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
      }),
      acceptTerms: z.boolean().optional()
  })
  .superRefine((data, ctx) => {
    if (data.courseName === "other" && !data.otherCourseName) {
      ctx.addIssue({
        path: ["otherCourseName"],
        message: "Other course name is required",
        code: "custom"
      });
    }
  });

export const AdminRegisterSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["Warden", "Admin"]),
  firstName: z.string({ message: "first name is required" }),
  lastName: z.string({ message: "First name is required" }),
  email: z.string().email({ message: "email is not valid." }),
  staffId: z.string({ message: "Staff ID can't be empty" }),
  department: z.string({ message: "Department can't be empty" }),
  hostel: z.array(z.object({
    hostelName:z.array(z.string())
  })).optional(),
  password: z
    .string()
    .min(5, { message: "password Length can not be less than 5 char" })
    .max(20, { message: "password Length can not be less than 5 char" })
    .regex(passwordRegex, {
      message:
        "password must include 1 uppercase, 1 lowercase, any digit, any special symbol.",
    }),
    reasonForAccess: z.string({
      message: "Please describe reason for access shortly",
    })
    // assignHostel : z.enum(["boys-hostel-a", "boys-hostel-b", "girls-hostel-b", "girls-hostel-b"]).optional()
})
// .superRefine((data, ctx) => {
//   if (data.role === "Warden" && !data.assignHostel) {
//     ctx.addIssue({
//       path: ["assignHostel"],
//       message: "Please select hostel",
//       code: "custom"
//     });
//   }
// });

export const loginValidation = z.object({
  role: z.enum(["Student", "Admin", "Warden"]),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string(),
});


export const profile = z.object({
  id: z.string().optional(),
  contact: z.string().regex(/^\d{10}$/, "Invalid phone number").optional(),
  roomNo: z.string().optional(),
  hostelName: z.string().optional(),
  departement: z.string().optional(),
  profilePicture: z.string().optional(),
  parentsEmail :   z.string().optional(),
  parentsContact :  z.string().optional()
});

export const complaint = z.object({
  type: z.enum(["low", "medium", "high"]).default("low"),
  title: z.string(),
  status: z.enum(["pending", "resolved", "inProgress"]).default("pending"),
  description: z.string().max(300),
  images: z.array(z.any()).optional(),
  isSuccessfullyResolved : z.boolean().default(false)
  // user: z.string(), // add from session
});

export const hostel = z.object({
  hostelName: z.string(),
  roomCount: z.number(),
  admin: z.string(),
  managedBy: z.string().optional(),
});

export const outing = z.object({
  studentId: z.string(),
  outingDate: z.date(),
  returnDate: z.date(),
  outingPurpose: z.string().max(300),
});
