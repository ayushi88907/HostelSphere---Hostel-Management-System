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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import FormInput from "@/components/ui/FormInput";
import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminRegisterSchema } from "@/common/types";
import { Checkbox } from "@radix-ui/react-checkbox";

type AdminFromValues = zod.infer<typeof AdminRegisterSchema>;

interface AdminRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

const hostelOptions = [
  { label: "Boys Hostel A", value: "boys-hostel-a" },
  { label: "Boys Hostel B", value: "boys-hostel-b" },
  { label: "Girls Hostel A", value: "girls-hostel-a" },
  { label: "Girls Hostel B", value: "girls-hostel-b" },
];

export default function AdminRegisterModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminRegisterModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
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
      role: "Admin",
      hostel: [{ hostelName: [] }],
    },
  });

  const toggleValue = (value: string) => {
    setSelected((prev: string[]) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

    const hostel = [{ hostelName: [] }];
    //@ts-ignore
    hostel[0].hostelName = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    
    setValue("hostel", hostel);
  };

  const handleChange = (name: keyof AdminFromValues, value: string) => {
    const hostel = [{ hostelName: [] }];
    //@ts-ignore
    hostel[0].hostelName.push(value);

    setValue(name, hostel);
  };

  const submitRegistration = async (data: AdminFromValues) => {
    toast.dismiss();
    const toastId = toast.loading(`Creating ${data.role}...`);
    setIsSubmitting(true);

    try {
      const result = await axios.post("/api/administrator", { userData: data });

      if (result.data.success) {
        toast.success(result.data.message, { id: toastId });
        reset(); // reset form after success
        onClose(); // close modal
        onSuccess?.(result.data.data); // callback to parent
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong", {
          id: toastId,
        });
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
                {...register("email")}
                error={errors.email?.message}
                required
              />

              <FormInput
                id="staffId"
                label="Admin ID"
                type="text"
                icon={<IdCardIcon size={18} />}
                {...register("staffId")}
                error={errors.staffId?.message}
                required
              />

              <FormInput
                id="department"
                label="College name"
                type="text"
                icon={<IdCardIcon size={18} />}
                {...register("department")}
                error={errors.department?.message}
                required
              />

              <div className="space-y-2">
                {/* <Select 
                  onValueChange={(value) => handleChange("hostel", value)}
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
                </Select> */}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between overflow-x-auto overflow-y-hidden"
                    >
                      {selected.length > 0
                        ? selected.join(", ")
                        : "Select Hostels"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 space-y-2">
                    {hostelOptions.map((item) => (
                      <div
                        key={item.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={item.value}
                          checked={selected.includes(item.value)}
                          onCheckedChange={() => toggleValue(item.value)}
                        />
                        <label htmlFor={item.value} className="text-sm">
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>

                {errors.hostel && (
                  <p className="text-destructive text-xs">
                    Hostel selection is required
                  </p>
                )}
              </div>

              <FormInput
                id="password"
                label="Password"
                type="password"
                icon={<LockIcon size={18} />}
                {...register("password")}
                error={errors.password?.message}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="reasonForAccess">Reason for Access</Label>
                <Textarea
                  id="reasonForAccess"
                  placeholder="Briefly explain why you need access"
                  rows={3}
                  {...register("reasonForAccess")}
                  required
                />
                {errors.reasonForAccess && (
                  <p className="text-destructive text-xs">
                    {errors.reasonForAccess.message}
                  </p>
                )}
              </div>

              <Button
                className="w-full mt-4"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Modal>
  );
}
