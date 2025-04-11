"use client";

import { useState } from "react";
import { IdCardIcon, LockIcon, MailIcon, PlusIcon, Trash2Icon, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { complaint, studentRegisterSchema } from "@/common/types";
import Modal from "@/components/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/ui/ShowOneToastOnly";
import { raiseNewComplaint } from "@/app/dashboard/complaints/action";
import toast from "react-hot-toast";
import axios from "axios";

type ComplaintData = Zod.infer<typeof complaint> & { images: File[] };

export default function StudentRegistrationFrom({ onClose, showModal, setRequests }: any) {
  const [showStudentRegistrationFrom, setShowStudentRegistrationFrom] = useState<boolean>(showModal);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<any>({});
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target ? e.target : e;

    if (name === "courseName" && value !== "other") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        otherCourseName: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev:any) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (toastId: string): boolean => {
    const newErrors: any = {};
    let isValid = true;

    const parseData = studentRegisterSchema.safeParse(formData);

    console.log(parseData);

    if (!parseData.success) {
      parseData.error.issues.map((issue) => {
        // @ts-ignore
        newErrors[issue.path[0]] = issue.message;
        isValid = false;
      });
    }

    const lastErrorMessage = Object.values(newErrors).slice(-1)[0];

    if (lastErrorMessage) {
      toast.dismiss();
      //@ts-ignore
      toast.error(lastErrorMessage, { id: toastId });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.dismiss();
    const toastId = toast.loading("Creating account...");

    if (!validateForm(toastId)) return;

    setIsSubmitting(true);


    try {
      
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

  return (
    <Modal isOpen={showStudentRegistrationFrom} onClose={toggleModal}>
      <Card>
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>
            Create a new student account to access HostelSphere
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="firstName"
                name="firstName"
                label="Fist Name"
                type="text"
                autoComplete="name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />

              <FormInput
                id="lastName"
                name="lastName"
                label="Last Name"
                type="text"
                autoComplete="name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>

            <FormInput
              id="email"
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<MailIcon size={18} />}
              required
            />

            <FormInput
              id="studentId"
              name="studentId"
              label="Student Id"
              type="text"
              autoComplete="name"
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
              icon={<IdCardIcon size={18} />}
              required
            />

            <div className="space-y-2">
              <Label htmlFor="course">Course/Program</Label>
              <Select
                onValueChange={(value) =>
                  handleChange({ name: "courseName", value })
                }
              >
                <SelectTrigger id="courseName">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">Computer Science</SelectItem>
                  <SelectItem value="ece">Electronics Engineering</SelectItem>
                  <SelectItem value="mech">Mechanical Engineering</SelectItem>
                  <SelectItem value="civil">Civil Engineering</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.courseName === "other" && (
                <FormInput
                  id="otherCourseName"
                  name="otherCourseName"
                  label="Other Course/Program"
                  type="text"
                  autoComplete="name"
                  value={formData.otherCourseName}
                  onChange={handleChange}
                  error={errors.otherCourseName}
                  required
                />
              )}
            </div>

            <FormInput
              id="password"
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              icon={<LockIcon size={18} />}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button
              className="w-full mt-6"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create student account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
}
