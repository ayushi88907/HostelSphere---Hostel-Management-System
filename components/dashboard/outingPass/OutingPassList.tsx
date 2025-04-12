"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import OutingPassForm from "./OutingPassForm";
import { useState } from "react";
import { useClientSession } from "@/hooks/useClientSession";
import {
  ArrowUpNarrowWide,
  CheckIcon,
  EyeIcon,
  Loader2,
  MailIcon,
  ShieldIcon,
  Trash2,
  UserIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { handleOutingStatus } from "@/app/dashboard/gate-pass/action";

export default function OutingPassList({ gatePasses }: any) {
  const [outingPasses, setOutingPasses] = useState(gatePasses);
  const [selectedGatepass, setSelectedGatepass] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const session = useClientSession();
  if (!session) return;

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

  const handleUpdateStatus = async (id: string) => {
    toast.dismiss();
    let toastId = toast.loading("Updating...");

    try {
      let result = await handleOutingStatus(id, selectedGatepass.approvalStatus);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
      }

      if (result.success) {
        setOutingPasses((prev:any) => prev.map((pass:any) => pass.id === id ? result.data : pass ));
        setDialogOpen(false);

        toast.success(result.message, { id: toastId });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error((error as Error).message, { id: toastId });
    }
  };


  return (
    <>
      {session.role === "Student" && (
        <OutingPassForm setOutingPasses={setOutingPasses} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Gate Pass History</CardTitle>
          <CardDescription>
            Your recent gate pass requests and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pass ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outingPasses.map((pass: any, index: number) => (
                <TableRow key={pass.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{formatDate(pass.outingDate)}</TableCell>
                  <TableCell>{formatTime(pass.leavingTime)}</TableCell>
                  <TableCell>{pass.outingPurpose}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pass.approvalStatus === "Approved"
                          ? "success"
                          : pass.approvalStatus === "Rejected"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {pass.approvalStatus}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Dialog
                      open={dialogOpen && selectedGatepass?.id === pass.id}
                      onOpenChange={(open) => {
                        if (!open) setSelectedGatepass(null);
                        setDialogOpen(open);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedGatepass(pass)}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      {selectedGatepass && (
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Student Raised Complaint</DialogTitle>
                            <DialogDescription>
                              This passes is issue to{" "}
                              <span className="font-bold capitalize">
                                {pass.user.firstName + " " + pass.user.lastName}
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

                              <div className="flex flex-wrap gap-2">
                                {session.role === "Warden" && (
                                  <div className="w-fit">
                                    <Select
                                      defaultValue={
                                        selectedGatepass.approvalStatus
                                      }
                                      onValueChange={(value) => {
                                        setSelectedGatepass({
                                          ...selectedGatepass,
                                          approvalStatus: value,
                                        });
                                      }}
                                    >
                                      <SelectTrigger id="status">
                                        <SelectValue
                                          placeholder={"Select Status"}
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="Approved">
                                          Approved
                                        </SelectItem>
                                        <SelectItem value="Rejected">
                                        Rejected
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
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

                              {session.role === "Warden" &&
                                selectedGatepass.approvalStatus !== "Approved" && (
                                  <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
                                    <div className="font-medium flex items-center">
                                      <ShieldIcon className="h-4 w-4 mr-1 text-amber-500" />
                                      Action Required
                                    </div>
                                    <p className="text-amber-700 mt-1">
                                      Please review this Gate Pass before
                                      marking it as approved.
                                    </p>
                                  </div>
                                )}

                              {session.role === "Warden" &&
                                 selectedGatepass.approvalStatus === "Approved" && (
                                  <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">
                                    <div className="font-medium flex items-center">
                                      <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                                      Approved
                                    </div>
                                    <p className="text-green-700 mt-1">
                                      This Gate Pass has been approved by{" "}
                                      <span className="font-bold capitalize">{session.name}</span>.
                                    </p>
                                  </div>
                                )}
                            </div>
                          )}

                          <DialogFooter className="sm:justify-between">
                            {selectedGatepass.studentId === session.id && (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => setDialogOpen(false)}
                                >
                                  Close
                                </Button>
                              </>
                            )}

                            {session.role === "Warden" && (
                              <>
                                <Button
                                  onClick={() =>
                                    selectedGatepass &&
                                    handleUpdateStatus(selectedGatepass.id)
                                  }
                                >
                                  Update
                                </Button>

                                <Button
                                  variant="outline"
                                  onClick={() => setDialogOpen(false)}
                                >
                                  Close
                                </Button>
                              </>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {outingPasses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No complaints found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
