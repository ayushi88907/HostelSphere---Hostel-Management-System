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
import { useState } from "react";
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
  ArrowUpNarrowWide,
  CheckIcon,
  EyeIcon,
  Loader2,
  MailIcon,
  ShieldIcon,
  Trash2,
  UserIcon,
} from "lucide-react";
import { useClientSession } from "@/hooks/useClientSession";
import toast from "react-hot-toast";
import {
  deleteComplaint,
  updateComplaint,
  upvoteComplaint,
} from "@/app/dashboard/complaints/action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ComplaintForm from "./ComplaintSubmissionForm";
import { differenceInDays } from "date-fns";

// Sample complaints data
const complaintsDone = [
  {
    id: "COMP-1234",
    subject: "Product Defect",
    status: "Open",
    date: "2023-04-15",
    priority: "High",
  },
  {
    id: "COMP-1235",
    subject: "Billing Issue",
    status: "In Progress",
    date: "2023-04-12",
    priority: "Medium",
  },
  {
    id: "COMP-1236",
    subject: "Delivery Delay",
    status: "Closed",
    date: "2023-04-10",
    priority: "Low",
  },
  {
    id: "COMP-1237",
    subject: "Customer Service",
    status: "Open",
    date: "2023-04-08",
    priority: "High",
  },
  {
    id: "COMP-1238",
    subject: "Website Error",
    status: "Closed",
    date: "2023-04-05",
    priority: "Medium",
  },
];

const ComplaintsList = ({ complaintsDataList }: any) => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<any>(complaintsDataList);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const session = useClientSession();
  if (!session) return;

  console.log(complaints);

    const currentStudentComplaints =
    complaints?.filter(
        (complaint:any) => complaint.resolvedById === session.id
      )|| [];

      console.log("all my complaints:", currentStudentComplaints)

      const openCount =
    session.role === "Student"
      ? currentStudentComplaints.filter((c:any) => c.status === "PENDING").length
      : complaints?.filter((c:any) => c.status === "PENDING").length || 0;
  
  const inProgressCount =
    session.role === "Student"
      ? currentStudentComplaints.filter((c:any) => c.status === "IN_PROGRESS").length
      : complaints.filter((c:any) => c.status === "IN_PROGRESS").length || 0;
  
  const resolvedCount =
    session.role === "Student"
      ? currentStudentComplaints.filter((c:any) => c.status === "RESOLVED").length
      : complaints.filter((c:any) => c.status === "RESOLVED").length || 0;
  
  // Avg. resolution time (only for RESOLVED)
  let avgResolutionDays = 0;
  if (session.role === "Student") {
    const resolved = currentStudentComplaints.filter(
      (c:any) => c.status === "RESOLVED" && c.updatedAt && c.createdAt
    );
  
    const totalDays = resolved.reduce((sum:any, c:any) => {
      const days = differenceInDays(new Date(c.updatedAt), new Date(c.createdAt));
      return sum + days;
    }, 0);
  
    avgResolutionDays = resolved.length > 0 ? Math.round(totalDays / resolved.length) : 0;
  }else{
    const resolved = complaints.filter(
      (c:any) => c.status === "RESOLVED" && c.updatedAt && c.createdAt
    );
  
    const totalDays = resolved?.reduce((sum:any, c:any) => {
      const days = differenceInDays(new Date(c.updatedAt), new Date(c.createdAt));
      return sum + days;
    }, 0);
  
    avgResolutionDays = resolved && resolved.length > 0 ? Math.round(totalDays / resolved.length) : 0;
  }

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleUpdateStatus = async (id: string) => {
    toast.dismiss();
    let toastId = toast.loading("Upvoting...");
    try {
      let result = await updateComplaint(id, selectedComplaint.status, selectedComplaint.resolvedMessage);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
      }

      if (result.success) {
        setComplaints((prev:any) =>[...prev, result.data]);
        setDialogOpen(false);

        toast.success(result.message, { id: toastId });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error((error as Error).message, { id: toastId });
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    toast.dismiss();
    let toastId = toast.loading("Deleting...");
    try {
      let result = await deleteComplaint(id);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
      }

      if (result.success) {
        setComplaints((prev: any) => prev.filter((req: any) => req.id !== id));

        setDialogOpen(false);

        toast.success(result.message, { id: toastId });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error((error as Error).message, { id: toastId });
    }
  };

  const handleUpvote = async (id: string) => {
    toast.dismiss();
    let toastId = toast.loading("Upvoting...");
    try {
      let result = await upvoteComplaint(id);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
      }

      if (result.success) {
        setComplaints(result.data);

        setDialogOpen(false);

        toast.success(result.message, { id: toastId });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error((error as Error).message, { id: toastId });
    }
  };

  console.log(selectedComplaint)

  // const handleUpdateStatus = async (id: string, status: string) => {
  //   toast.dismiss();
  //   let toastId = toast.loading("Updating...");
  //   try {
  //     const data = requests.find((req: any) => req.id === id);

  //     let result;
  //     if (status === "Approved")
  //       result = await approvedUserRequest(session?.role, data);
  //     else result = await rejectUserRequest(session?.role, data);

  //     if (!result.data) {
  //       toast.error(result.message, { id: toastId });
  //     }

  //     if (result.data) {
  //       setRequests((prev: any) =>
  //         prev.map((req: any) => (req.id === id ? result.data : req))
  //       );
  //       setDialogOpen(false);

  //       toast.success(result.message, { id: toastId });
  //     }
  //   } catch (error) {
  //     console.log("Error fetching data:", error);
  //     toast.error((error as Error).message, { id: toastId });
  //   }
  // };

  // const handleDeleteAccount = async (id: string) => {
  //   toast.dismiss();
  //   let toastId = toast.loading("Deleting...");
  //   try {
  //     const data = requests.find((req: any) => req.id === id);

  //     let result = await deleteAccount(data?.role, data.id);

  //     if (!result.data) {
  //       toast.error(result.message, { id: toastId });
  //     }

  //     if (result.data) {
  //       setRequests((prev: any) => prev.filter((req: any) => req.id !== id));

  //       setDialogOpen(false);

  //       toast.success(result.message, { id: toastId });
  //     }
  //   } catch (error) {
  //     console.log("Error fetching data:", error);
  //     toast.error((error as Error).message, { id: toastId });
  //   }
  // };

  return (
    <>
     <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Statistics</CardTitle>
              <CardDescription>
                Overview of complaint status and resolution times.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="rounded-lg border p-3 bg-primary-foreground">
                  <div className="text-sm font-medium text-muted-foreground">
                    Open
                  </div>
                  <div className="text-2xl font-bold">
                    {openCount}
                  </div>
                </div>
                <div className="rounded-lg border p-3 bg-primary-foreground">
                  <div className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </div>
                  <div className="text-2xl font-bold">
                    {inProgressCount}
                  </div>
                </div>
                <div className="rounded-lg border p-3 bg-primary-foreground">
                  <div className="text-sm font-medium text-muted-foreground">
                    Closed
                  </div>
                  <div className="text-2xl font-bold">
                    {resolvedCount}
                  </div>
                </div>

                  <div className="rounded-lg border p-3 bg-primary-foreground">
                    <div className="text-sm font-medium text-muted-foreground">
                      Avg. Resolution
                    </div>
                    <div className="text-2xl font-bold">
                      {avgResolutionDays}d
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
          <CardDescription>
            View and manage your recent complaints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint: any, index: number) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{complaint.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        complaint.status === "Open"
                          ? "default"
                          : complaint.status === "In Progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={
                        complaint.priority === "High"
                          ? "border-red-500 text-red-500"
                          : complaint.priority === "Medium"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-green-500 text-green-500"
                      }
                    >
                      {complaint.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Dialog
                      open={
                        dialogOpen && selectedComplaint?.id === complaint.id
                      }
                      onOpenChange={(open) => {
                        if (!open) setSelectedComplaint(null);
                        setDialogOpen(open);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      {
                        selectedComplaint &&
                     
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Student Raised Complaint</DialogTitle>
                          <DialogDescription>
                            This complaint was raised by{" "}
                            {complaint.raisedBy.firstName +
                              " " +
                              complaint.raisedBy.lastName}
                            .
                          </DialogDescription>
                        </DialogHeader>
                        {selectedComplaint && (
                          <div className="space-y-4 py-4">
                            <div className="flex items-center space-x-4">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <UserIcon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold">
                                  {selectedComplaint.raisedBy.firstName +
                                    " " +
                                    selectedComplaint.raisedBy.lastName}
                                </h4>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MailIcon className="h-3 w-3 mr-1" />
                                  {selectedComplaint.raisedBy.email}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                🗂️ Type: {selectedComplaint.type}
                              </span>
                              
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                                👍 Upvotes:{" "}
                                {selectedComplaint.upvotes?.length ?? 0}
                              </span>

                              {session.role === "Student" ? (
                                <span
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                    selectedComplaint.status === "RESOLVED"
                                      ? "bg-green-100 text-green-800"
                                      : selectedComplaint.status ===
                                        "IN_PROGRESS"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  🚦 Status:{" "}
                                  {selectedComplaint.status.replace("_", " ")}
                                </span>
                              ) : (

                                  <div  className="w-fit">

                                <Select
                                  defaultValue={selectedComplaint.status}
                                  onValueChange={(value) => {
                                    setSelectedComplaint({...selectedComplaint, status: value})
                                  }}
                                >
                                  <SelectTrigger id="status">
                                    <SelectValue
                                      placeholder={"Select Status"}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="IN_PROGRESS">
                                      In-progress
                                    </SelectItem>
                                    <SelectItem value="RESOLVED">
                                      Resolved
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                </div>
                              )}

                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm border rounded-lg p-4">
                              <div>
                                <p className="text-muted-foreground">Title</p>
                                <p className="font-medium">
                                  {selectedComplaint.title}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Created At
                                </p>
                                <p className="font-medium">
                                  {formatDate(selectedComplaint.createdAt)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Updated At
                                </p>
                                <p className="font-medium">
                                  {formatDate(selectedComplaint.updatedAt)}
                                </p>
                              </div>
                              {selectedComplaint.resolvedBy && (
                                <div className="col-span-2 ">
                                  <p className="text-muted-foreground font-bold mb-2">
                                    Resolved By
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                      <UserIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">
                                        {selectedComplaint.resolvedBy
                                          .firstName +
                                          " " +
                                          selectedComplaint.resolvedBy.lastName}
                                      </h4>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <MailIcon className="h-3 w-3 mr-1" />
                                        {selectedComplaint.resolvedBy.email}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="border rounded-md p-4 bg-secondary text-sm">
                              <p className="text-muted-foreground font-medium mb-1">
                                Description:
                              </p>
                              <p className="text-foreground">
                                {selectedComplaint.description}
                              </p>
                            </div>

                            {session.role !== "Student" &&
                              selectedComplaint.status !== "RESOLVED" && (
                                <div className="space-y-2">
                                  <Label htmlFor="reasonForAccess">
                                    Complaint resolve message
                                  </Label>
                                  <Textarea
                                    id="reasonForAccess"
                                    value={selectedComplaint.resolvedMessage}
                                    onChange={(e) => setSelectedComplaint({...selectedComplaint, resolvedMessage : e.target.value })}
                                    placeholder="Briefly explain how the complaint resolved?"
                                    rows={3}
                                  />
                                </div>
                              )}

                            {session.role !== "Student" && selectedComplaint.status === "PENDING" && (
                              <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
                                <div className="font-medium flex items-center">
                                  <ShieldIcon className="h-4 w-4 mr-1 text-amber-500" />
                                  Action Required
                                </div>
                                <p className="text-amber-700 mt-1">
                                  Please review this complaint before marking it
                                  as resolved.
                                </p>
                              </div>
                            )}

                            {session.role !== "Student" && selectedComplaint.status === "IN_PROGRESS" && (
                              <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
                                <div className="font-medium flex items-center">
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin text-blue-500" />
                                  In Progress
                                </div>
                                <p className="text-blue-700 mt-1">
                                  This complaint is currently being addressed.
                                </p>
                              </div>
                            )}

                            {session.role !== "Student" && selectedComplaint.status === "RESOLVED" && (
                              <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">
                                <div className="font-medium flex items-center">
                                  <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                                  Resolved
                                </div>
                                <p className="text-green-700 mt-1">
                                  This complaint has been resolved.
                                </p>
                                {selectedComplaint.resolvedMessage && (
                                  <p className="text-green-600 mt-2">
                                    <span className="font-medium">
                                      Resolution Message:
                                    </span>{" "}
                                    {selectedComplaint.resolvedMessage}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <DialogFooter className="sm:justify-between">
                          {selectedComplaint.raisedById === session.id && (
                            <>
                              <Button
                                onClick={() =>
                                  selectedComplaint &&
                                  handleDeleteComplaint(selectedComplaint.id)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>

                              <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                              >
                                Close
                              </Button>
                            </>
                          )}

                          {selectedComplaint.raisedById !== session.id &&
                            session.role === "Student" && (
                              <>
                                <Button
                                  onClick={() =>
                                    selectedComplaint &&
                                    handleUpvote(selectedComplaint.id)
                                  }
                                >
                                  <ArrowUpNarrowWide className="h-4 w-4 mr-1" />
                                  Upvote
                                </Button>

                                <Button
                                  variant="outline"
                                  onClick={() => setDialogOpen(false)}
                                >
                                  Close
                                </Button>
                              </>
                            )}

                          {session.role !== "Student" && (
                            <>
                              <Button
                                onClick={() =>
                                  selectedComplaint &&
                                  handleUpdateStatus(selectedComplaint.id)
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
                       }
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}

              {!loading ||
                (complaints.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No complaints found
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {session.role === "Student" && <ComplaintForm allComplaints={setComplaints}/>}
     
    </>
  );
};

export default ComplaintsList;
