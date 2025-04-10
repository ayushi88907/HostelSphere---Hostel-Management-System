"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Modal from "@/components/Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PlusIcon } from "lucide-react";

type LeaveFormData = {
  from: Date;
  to: Date;
  reason: string;
};

const LeaveApplicationFrom = () => {
  const [showComplaintForm, setShowComplaintForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { register, handleSubmit, setValue, reset } = useForm<LeaveFormData>();

  const toggleModal = () => {
    setShowComplaintForm(!showComplaintForm);

    // if (!showComplaintForm) {
    //   reset();
    //   setSelectedImages([]);
    // }
  };

  const handleLeaveApplications = async (data:LeaveFormData) => {
    console.log(data);
  }
  

  if (!showComplaintForm) {
    return (
      <Button
        className="w-fit absolute top-20 right-6 z-20"
        onClick={toggleModal}
      >
        <PlusIcon /> Apply for leave
      </Button>
    );
  }

  return (
    <Modal isOpen={showComplaintForm} onClose={toggleModal}>
      <Card>
        <CardHeader>
          <CardTitle>New Leave Application</CardTitle>
          <CardDescription>
            Fill out the form to submit a new leave application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(handleLeaveApplications)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-date">From Date</Label>
                <Input {...register("from")} id="from-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-date">To Date</Label>
                <Input {...register("to")} id="to-date" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                {...register("reason")}
                placeholder="Provide details about your leave request"
              />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submiting leave application..."
                : "Submit Leave Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default LeaveApplicationFrom;
