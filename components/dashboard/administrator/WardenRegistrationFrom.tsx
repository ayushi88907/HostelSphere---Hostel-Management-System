"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRegisterSchema, studentRegisterSchema } from "@/common/types";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import axios from "axios";
import { IdCardIcon, InfoIcon, LockIcon, MailIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormInput from "@/components/ui/FormInput";
import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cookies } from "next/headers";


type AdminFromValues = zod.infer<typeof AdminRegisterSchema>;


export default function WardenRegistrationFrom({ onClose, showModal, setRequests }: any) {
  const [showStudentRegistrationFrom, setShowStudentRegistrationFrom] = useState<boolean>(showModal);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const {
      register,
      formState: { errors },
      handleSubmit,
      getValues,
      setValue,
      resetField,
      setError,
    } = useForm<AdminFromValues>({
      resolver: zodResolver(AdminRegisterSchema),
      defaultValues: {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        staffId: "",
        department: "",
        reasonForAccess: "",
      },
    });


    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      studentId: "",
      courseName: "",
      otherCourseName: "",
      isVerified:"Approved",
      role:"Student"
    });

  const toggleModal = () => {
    setShowStudentRegistrationFrom(!showStudentRegistrationFrom);
    onClose();
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.dismiss();
    const toastId = toast.loading("Creating account...");

    setIsSubmitting(true);

    console.log(formData);

    try {
      console.log(formData)
      
      const result = await axios.post("/api/administrator", {userData:formData});
      
      if (result.data.success) {
        toast.success(result.data.message, {
          id: toastId,
        });

        onClose();
        setRequests((prev:any) => [...prev, result.data.data ])
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong", {
          id: toastId,
        });
      } else {
        toast.error("Something went wrong", {
          id: toastId,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitRegistration = (data:any) => {
    console.log(data)
  }

  return (
    <Modal isOpen={showStudentRegistrationFrom} onClose={toggleModal}>
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle>Staff Account Registration</CardTitle>
              <CardDescription>
                Request a new staff account (requires verification)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(submitRegistration)}
                className="space-y-4"
              >

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    id="firstName"
                    label="First Name"
                    type="text"
                    {...register("firstName")}
                    error={errors.firstName?.message}
                    required
                  />

                  <FormInput
                    id="lastName"
                    label="Last Name"
                    type="text"
                    {...register("lastName")}
                    error={errors.lastName?.message}
                    required
                  />
                </div>

                <FormInput
                  id="email"
                  label="Email"
                  type="email"
                  icon={<MailIcon size={18} />}
                  error={errors.email?.message}
                  {...register("email")}
                  required
                />

                <FormInput
                  id="staffId"
                  label="Staff Id"
                  type="text"
                  autoComplete="name"
                  {...register("staffId")}
                  error={errors.staffId?.message}
                  icon={<IdCardIcon size={18} />}
                  required
                />

                <FormInput
                  id="department"
                  label="Department"
                  type="text"
                  autoComplete="name"
                  {...register("department")}
                  error={errors.department?.message}
                  icon={<IdCardIcon size={18} />}
                  required
                />

                <div className="space-y-2">
                    <Select
                      onValueChange={(value: any) =>
                        handleChangeRole("assignHostel", value)
                      }
                      
                    >
                      <SelectTrigger id="assignHostel">
                        <SelectValue placeholder="Select hostel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boys-hostel-a">
                          Boys Hostel A
                        </SelectItem>
                        <SelectItem value="boys-hostel-b">
                          Boys Hostel B
                        </SelectItem>
                        <SelectItem value="girls-hostel-a">
                          Girls Hostel A
                        </SelectItem>
                        <SelectItem value="girls-hostel-b">
                          Girls Hostel B
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {!hostel && (
                      <p className="text-red-500 text-xs">
                        Please select a hostel.
                      </p>
                    )}
                  </div>

                <FormInput
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  icon={<LockIcon size={18} />}
                  error={errors.password?.message}
                  {...register("password")}
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Access</Label>
                  <Textarea
                    id="reason"
                    placeholder="Briefly explain why you need access to the system"
                    rows={3}
                    {...register("reasonForAccess")}
                    required
                  />
                  {errors.reasonForAccess && (
                    <p className="text-red-500 text-xs">
                      {errors.reasonForAccess.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm that all provided information is accurate
                  </label>
                </div>

                <Alert className="bg-amber-50 border-amber-200">
                  <InfoIcon className="h-4 w-4 text-amber-500 dark:text-amber-900" />
                  <AlertTitle className="text-amber-800">
                    Account Verification Required
                  </AlertTitle>
                  <AlertDescription className="text-amber-700 text-sm">
                    Staff accounts require verification by system
                    administrators. You'll receive an email notification once
                    your account is approved.
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full mt-6"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Submitting request..." : "Submit for Approval"}
                </Button>
                
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
    </Modal>
  );
}
