

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {  CheckCircle, MailIcon, UserIcon, XCircle } from 'lucide-react';
import { redirect, useParams, useRouter } from 'next/navigation';
import { DialogDescription } from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { handleOutingParentsApproval } from '@/app/dashboard/gate-pass/action';


export default function ParentOutingApprovalPage({outing}:any) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedGatepass, setSelectedGatepass] = useState<any>(null)
  const router = useRouter();


  const handleConfirm = async (id:any, status:any) => {
    setLoading(true);
    toast.dismiss();
    let toastId = toast.loading("Updating...");
    

    try {
      const result = await handleOutingParentsApproval(selectedGatepass.id, status, outing.token)
      console.log(result)

      if (!result.success) {
        toast.error(result.message, { id: toastId });
      }

      if (result.success) {
        setSelectedGatepass(result.data);
        setShowDialog(false);
        toast.success(result.message, { id: toastId });
        router.push("/")
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  function formatDate(date: Date | string | null): string {
    if (!date) return "-";
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) return "-";

    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(validDate);
  }

  function formatTime(date: Date | string | null): string {
    if (!date) return "-";
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) return "-";

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(validDate);
  }

  useEffect(() => {
    if(!outing) return;

    setSelectedGatepass(outing.outing);
    setShowDialog(true)

  }, [selectedGatepass])

if(!selectedGatepass) return;

console.log(selectedGatepass)

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-lg space-y-6 text-center">
        {!submitted ? (
          <>
            <h1 className="text-2xl font-bold">Review Outing Request</h1>
            <p className="text-muted-foreground">Your child has requested an outing. Please choose an action.</p>
            <div className="flex justify-center gap-4 pt-4">
              <Button variant="default" onClick={() => { setAction('approve'); setShowDialog(true); }}>
                Approve
              </Button>
              <Button variant="destructive" onClick={() => { setAction('reject'); setShowDialog(true); }}>
                Reject
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">Thank you!</h2>
            <p className="text-muted-foreground">Your response has been recorded.</p>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
         <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Student Raised Complaint</DialogTitle>
                            <DialogDescription>
                              This passes is issue to{" "}
                              <span className="font-bold capitalize">
                                {selectedGatepass.user.firstName + " " + selectedGatepass.user.lastName}
                                .
                              </span>
                            </DialogDescription>
                          </DialogHeader>

                          {selectedGatepass && (
                            <div className="space-y-4 py-4">
                              <div className="flex items-center space-x-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <UserIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">
                                    {selectedGatepass.user.firstName +
                                      " " +
                                      selectedGatepass.user.lastName}
                                  </h4>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MailIcon className="h-3 w-3 mr-1" />
                                    {selectedGatepass.user.email}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-[repeat(2,_auto)] gap-x-4 gap-y-3 text-sm border rounded-lg p-4">
                                <div>
                                  <p className="text-muted-foreground">
                                    Parent email:
                                  </p>
                                  <p className="font-medium">
                                    {selectedGatepass.parentsEmail}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Parent Contact:
                                  </p>
                                  <p className="font-medium">
                                    {selectedGatepass.parentsContact}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">
                                    Requested Date:
                                  </p>
                                  <p className="font-medium">
                                    {formatDate(selectedGatepass.createdAt)}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">
                                    Updated At
                                  </p>
                                  <p className="font-medium">
                                    {formatDate(selectedGatepass.updatedAt)}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">
                                    🗂️ Warden Approval:
                                  </p>
                                  <Badge variant={
                                      selectedGatepass.approvedByParents ===
                                      "Approved"
                                        ? "success"
                                        : selectedGatepass.approvedByParents ===
                                          "Rejected"
                                        ? "destructive"
                                        : "default"
                                    }>
                                    {selectedGatepass.approvalStatus}
                                  </Badge>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">
                                    👍 Parent Approval:
                                  </p>
                                  <Badge
                                    variant={
                                      selectedGatepass.approvedByParents ===
                                      "Approved"
                                        ? "success"
                                        : selectedGatepass.approvedByParents ===
                                          "Rejected"
                                        ? "destructive"
                                        : "default"
                                    }
                                  >
                                    {selectedGatepass.approvedByParents}
                                  </Badge>
                                </div>

                                {selectedGatepass.approverById && (
                                  <div className="col-span-2 ">
                                    <p className="text-muted-foreground font-bold mb-2">
                                      Approved By
                                    </p>
                                    <div className="flex items-center space-x-4">
                                      <div className="bg-primary/10 p-2 rounded-full">
                                        <UserIcon className="h-6 w-6 text-primary" />
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">
                                          {selectedGatepass.Admin.firstName +
                                            " " +
                                            selectedGatepass.Admin.lastName}
                                        </h4>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <MailIcon className="h-3 w-3 mr-1" />
                                          {selectedGatepass.Admin.email}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                              </div>

                              <div className="border rounded-md p-4 bg-secondary text-sm">
                                <p className="text-muted-foreground font-medium mb-1">
                                  Reason:
                                </p>
                                <p className="text-foreground">
                                  {selectedGatepass.outingPurpose}
                                </p>
                              </div>
                            </div>
                          )}

                          <DialogFooter className="sm:justify-between">
                              <>
                                <Button variant={"default"}
                                  onClick={() =>
                                    selectedGatepass &&
                                    handleConfirm(selectedGatepass.id, "Approved")
                                  }
                                  disabled={loading}
                                >
                                  Approved
                                </Button>

                                <Button variant={"destructive"}
                                  onClick={() =>
                                    selectedGatepass &&
                                    handleConfirm(selectedGatepass.id, "Rejected")
                                  }
                                  disabled={loading}
                                >
                                  Rejected
                                </Button>
                                
                              </>
                          </DialogFooter>
                        </DialogContent>
      </Dialog>
    </main>
  );
}
