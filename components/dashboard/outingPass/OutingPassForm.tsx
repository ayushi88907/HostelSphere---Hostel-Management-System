"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import { createOutingRequest } from "@/app/dashboard/gate-pass/action";

export default function OutingPassForm({setOutingPasses}:any) {

  const [loading, setLoading] = useState(false);
  const [showOutingPass, setShowOutingPass] = useState(false);

  const { handleSubmit, register, reset } = useForm<any>();


  

  const handleRequestForOuting = async (data: any) => {
    toast.dismiss();
    let toastId = toast.loading("Submiting...");
    setLoading(true);
    try {
      console.log(data);


      let result = await createOutingRequest(data);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
      }

      if (result.success) {
        setOutingPasses((prev: any) => [...prev, result.data]);

        setShowOutingPass(false);

        toast.success(result.message, { id: toastId });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error((error as Error).message, { id: toastId });
    }finally{
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setShowOutingPass(!showOutingPass);

    if (!showOutingPass) {
      reset();
    }
  };

  // show only button...
  if (!showOutingPass) {
    return (
      <Button
        className="w-fit absolute top-20 right-6 z-20"
        onClick={toggleModal}
      >
        <PlusIcon /> Get Pass Request
      </Button>
    );
  }

  return (
    <Modal isOpen={showOutingPass} onClose={toggleModal}>
      <Card>
        <CardHeader>
          <CardTitle>Request Gate Pass</CardTitle>
          <CardDescription>
            Fill out the form to request a new gate pass.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(handleRequestForOuting)}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outingDate">Leaving Date</Label>
                <Input
                  {...register("outingDate")}
                  id="outingDate"
                  type="date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leavingTime">Leaving Time</Label>
                <Input
                  id="leavingTime"
                  type="time"
                  {...register("leavingTime")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date</Label>
                <Input
                  {...register("returnDate")}
                  id="returnDate"
                  type="date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Return Time</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  {...register("checkOutTime")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentsEmail">Parents Email</Label>
              <Input
                id="parentsEmail"
                type="email"
                placeholder="Parents email id"
                {...register("parentsEmail")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentsContact">Parents Contact</Label>
              <Input
                id="parentsContact"
                type="text"
                placeholder="Parents contact nubmber"
                {...register("parentsContact")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Reason for gate pass"
                {...register("outingPurpose")}
                className="min-h-[120px]"
              />
            </div>

            <Button type="submit" disabled={loading}>
              Submit Gate Pass Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
}
