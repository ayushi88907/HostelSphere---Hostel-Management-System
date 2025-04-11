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
import { AdminRegisterSchema } from "@/common/types";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import axios from "axios";
import { IdCardIcon, LockIcon, MailIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";

type AdminFromValues = zod.infer<typeof AdminRegisterSchema>;

export default function WardenRegistrationFrom({
  onClose,
  showModal,
  setRequests,
}: any) {
  const [showStudentRegistrationFrom, setShowStudentRegistrationFrom] =
    useState<boolean>(showModal);
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
      role: "Warden",
      hostel: [
        {
          hostelName: [],
        },
      ],
    },
  });

  const toggleModal = () => {
    setShowStudentRegistrationFrom(!showStudentRegistrationFrom);
    onClose();
  };

  const handleChange = (name: any, value: any) => {
    const hostel = {
      hostelName: [value],
    };
    setValue(name, [hostel]);
  };

  const submitRegistration = async (data: AdminFromValues) => {
    toast.dismiss();
    const toastId = toast.loading("Creating Warden...");
    
    setIsSubmitting(true);

    try {

      const result = await axios.post("/api/administrator", { userData: data });

      if (result.data.success) {
        toast.success(result.data.message, {
          id: toastId,
        });

        onClose();
        setRequests((prev: any) => [...prev, result.data.data]);
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

  console.log(errors)

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
                {
                  errors.firstName && (
                    <p className="text-destructive text-xs">{errors.firstName.message}</p>
                  )}

                <FormInput
                  id="lastName"
                  label="Last Name"
                  type="text"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                  required
                />
                  {
                  errors.lastName && (
                    <p className="text-destructive text-xs">{errors.lastName.message}</p>
                  )}
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
                {
                  errors.email && (
                    <p className="text-destructive text-xs">{errors.email.message}</p>
                  )}

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
               {
                  errors.staffId && (
                    <p className="text-destructive text-xs">{errors.staffId.message}</p>
                  )}
              

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
                {
                  errors.department && (
                    <p className="text-destructive text-xs">{errors.department.message}</p>
                  )}
              

              <div className="space-y-2">
                <Select defaultValue="boys-hostel-a"
                  onValueChange={(value: any) => handleChange("hostel", value)}
                >
                  <SelectTrigger id="assignHostel">
                    <SelectValue placeholder="Select hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys-hostel-a">Boys Hostel A</SelectItem>
                    <SelectItem value="boys-hostel-b">Boys Hostel B</SelectItem>
                    <SelectItem value="girls-hostel-a">
                      Girls Hostel A
                    </SelectItem>
                    <SelectItem value="girls-hostel-b">
                      Girls Hostel B
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {
                  errors.hostel && errors.hostel[0]?.hostelName?.length == 0 && (
                    <p className="text-destructive text-xs">{errors.hostel[0].message}</p>
                  )}
              
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
               {
                  errors.password && (
                    <p className="text-destructive text-xs">{errors.password.message}</p>
                  )}
              

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

              {
                  errors.reasonForAccess && (
                    <p className="text-destructive text-xs">{errors.reasonForAccess.message}</p>
                  )}
              

              <Button
                className="w-full mt-6"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting request..." : "Submit for Approval"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Modal>
  );
}
