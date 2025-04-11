"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckIcon,
  XIcon,
  UserIcon,
  EyeIcon,
  MailIcon,
  ClockIcon,
  ShieldIcon,
  PlusIcon,
  Trash,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudentRegistrationFrom from "@/components/dashboard/administrator/StudentRegestrationFrom";
import WardenRegistrationFrom from "@/components/dashboard/administrator/WardenRegistrationFrom";
import { useClientSession } from "@/hooks/useClientSession";
import { Loader } from "@/components/ui/Loader";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for staff approval requests
const mockRequests = [
  {
    id: "req-001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "warden",
    department: "Student Affairs",
    staffId: "WDN-2023-001",
    hostel: "Boys Hostel A",
    requestDate: "2023-05-12T10:30:00",
    status: "pending",
  },
  {
    id: "req-002",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "admin",
    department: "IT Department",
    staffId: "ADM-2023-014",
    requestDate: "2023-05-11T14:45:00",
    status: "pending",
  },
  {
    id: "req-003",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    role: "warden",
    department: "Student Affairs",
    staffId: "WDN-2023-002",
    hostel: "Girls Hostel A",
    requestDate: "2023-05-10T09:15:00",
    status: "approved",
  },
  {
    id: "req-004",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "admin",
    department: "Administration",
    staffId: "ADM-2023-015",
    requestDate: "2023-05-09T11:20:00",
    status: "rejected",
  },
];

export default function ApprovalManagement({
  fetchData,
  approvedUserRequest,
  rejectUserRequest,
  deleteAccount,
}: any) {
  const [requests, setRequests] = useState<any>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("Student");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Pending");

  const session = useClientSession();

  const handleUpdateStatus = async (id: string, status: string) => {
    toast.dismiss();
    let toastId = toast.loading("Updating...");
    try {
      const data = requests.find((req: any) => req.id === id);

      let result;
      if (status === "Approved")
        result = await approvedUserRequest(session?.role, data);
      else result = await rejectUserRequest(session?.role, data);

      if (!result.data) {
        toast.error(result.message, { id: toastId });
      }

      if (result.data) {
        setRequests((prev: any) =>
          prev.map((req: any) => (req.id === id ? result.data : req))
        );
        setDialogOpen(false);

        toast.success(result.message, { id: toastId });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error((error as Error).message, { id: toastId });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    toast.dismiss();
    let toastId = toast.loading("Deleting...");
    try {
      const data = requests.find((req: any) => req.id === id);

      let result = await deleteAccount(data?.role, data.id);

      if (!result.data) {
        toast.error(result.message, { id: toastId });
      }

      if (result.data) {
        setRequests((prev: any) => prev.filter((req: any) => req.id !== id));

        setDialogOpen(false);

        toast.success(result.message, { id: toastId });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error((error as Error).message, { id: toastId });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const pendingRequests = requests.filter(
    (req: any) => req.isVerified === "Pending"
  );
  const approvedRequests = requests.filter(
    (req: any) => req.isVerified === "Approved"
  );
  const rejectedRequests = requests.filter(
    (req: any) => req.isVerified === "Rejected"
  );

  useEffect(() => {
    if (!session) return;
    toast.dismiss();

    (async () => {
      try {
        setLoading(true);
        const result = await fetchData(roleFilter);

        if (!result.data) {
          toast.error(result.message);
        }

        if (result.data) {
          setRequests(result.data);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        toast.error((error as Error).message);
      } finally {
        setLoading(false); // stop loading
      }
    })();

    if (roleFilter === "Student") {
      setSelectedTab("Pending");
    } else {
      setSelectedTab("Approved");
    }

  }, [roleFilter, session]);

  if (!session) return <Loader />;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {" "}
            {roleFilter === "Student" ? "Student" : "Staff"} Account Approvals
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage {roleFilter === "Student" ? "Student" : "Staff"}{" "}
            registration requests
          </p>
        </div>

        <div className="flex  justify-center gap-3 flex-wrap lg:flex-nowrap">
          <Button
            className="py-0 text-xs h-8"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon />
            Add New
          </Button>

          <div className="">
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Warden">Warden</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-nowrap">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{pendingRequests.length} Pending</span>
          </Badge>
        </div>
      </div>
      {roleFilter === "Student" ? (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="Pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="Approved">
              Approved ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="Rejected">
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          {["Pending", "Approved", "Rejected"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {status.charAt(0).toUpperCase() + status.slice(1)} Requests
                  </CardTitle>
                  <CardDescription>
                    {status === "Pending"
                      ? `Review and take action on these  ${
                          roleFilter === "Student" ? "Student" : "Staff"
                        } registration requests`
                      : status === "Approved"
                      ? `Previously approved ${
                          roleFilter === "Student" ? "Student" : "Staff"
                        }  accounts`
                      : `Previously rejected ${
                          roleFilter === "Student" ? "Student" : "Staff"
                        }  account requests`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {roleFilter === "Student" ? "Student" : "Staff"} ID
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                              {[...Array(6)].map((_, i) => (
                                <TableCell key={i}>
                                  <Skeleton className="h-4 w-full" />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        : requests
                            .filter((req: any) => req.isVerified === status)
                            .map((request: any) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">
                                  {request.studentId}
                                </TableCell>
                                <TableCell>
                                  {request.firstName + request.lastName}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {request.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {request.courseName ||
                                    request.otherCourseName}
                                </TableCell>
                                <TableCell>
                                  {formatDate(request.registrationDate)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Dialog
                                    open={
                                      dialogOpen &&
                                      selectedRequest?.id === request.id
                                    }
                                    onOpenChange={(open) => {
                                      if (!open) setSelectedRequest(null);
                                      setDialogOpen(open);
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setSelectedRequest(request)
                                        }
                                      >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        Details
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Student Account Request
                                        </DialogTitle>
                                        <DialogDescription>
                                          Review details for{" "}
                                          {request.firstName + request.lastName}
                                          's request
                                        </DialogDescription>
                                      </DialogHeader>

                                      {selectedRequest && (
                                        <div className="space-y-4 py-4">
                                          <div className="flex items-center space-x-4">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                              <UserIcon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                              <h4 className="font-semibold">
                                                {selectedRequest.firstName +
                                                  selectedRequest.lastName}
                                              </h4>
                                              <div className="flex items-center text-sm text-muted-foreground">
                                                <MailIcon className="h-3 w-3 mr-1" />
                                                {selectedRequest.email}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-3 text-sm border rounded-lg p-4">
                                            <div>
                                              <p className="text-muted-foreground">
                                                Role
                                              </p>
                                              <p className="font-medium capitalize">
                                                {selectedRequest.role}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground">
                                                Student ID
                                              </p>
                                              <p className="font-medium">
                                                {selectedRequest.studentId}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground">
                                                Department
                                              </p>
                                              <p className="font-medium">
                                                {selectedRequest.courseName ||
                                                  selectedRequest.otherCourseName}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground">
                                                Request Date
                                              </p>
                                              <p className="font-medium">
                                                {formatDate(
                                                  selectedRequest.registrationDate
                                                )}
                                              </p>
                                            </div>
                                            {/* {selectedRequest.hostel && (
                                            <div className="col-span-2">
                                              <p className="text-muted-foreground">
                                                Assigned Hostel
                                              </p>
                                              <p className="font-medium">
                                                {selectedRequest.hostel}
                                              </p>
                                            </div>
                                          )} */}
                                          </div>

                                          {status === "Pending" && (
                                            <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
                                              <div className="font-medium flex items-center">
                                                <ShieldIcon className="h-4 w-4 mr-1 text-amber-500" />
                                                Action Required
                                              </div>
                                              <p className="text-amber-700 mt-1">
                                                Please review this request
                                                carefully before approving or
                                                rejecting.
                                              </p>
                                            </div>
                                          )}

                                          {status === "Approved" && (
                                            <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">
                                              <div className="font-medium flex items-center">
                                                <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                                                Approved
                                              </div>
                                              <p className="text-green-700 mt-1">
                                                This request was approved and
                                                the account was created.
                                              </p>
                                            </div>
                                          )}

                                          {status === "Rejected" && (
                                            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                                              <div className="font-medium flex items-center">
                                                <XIcon className="h-4 w-4 mr-1 text-red-500" />
                                                Rejected
                                              </div>
                                              <p className="text-red-700 mt-1">
                                                This request was rejected and no
                                                account was created.
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      <DialogFooter className="sm:justify-between">
                                        {status === "Pending" && (
                                          <>
                                            <Button
                                              variant="destructive"
                                              onClick={() =>
                                                selectedRequest &&
                                                handleUpdateStatus(
                                                  selectedRequest.id,
                                                  "Rejected"
                                                )
                                              }
                                            >
                                              <XIcon className="h-4 w-4 mr-1" />
                                              Reject
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                selectedRequest &&
                                                handleUpdateStatus(
                                                  selectedRequest.id,
                                                  "Approved"
                                                )
                                              }
                                            >
                                              <CheckIcon className="h-4 w-4 mr-1" />
                                              Approve & Create Account
                                            </Button>
                                          </>
                                        )}

                                        {status === "Approved" && (
                                          <>
                                            <Button
                                              variant="destructive"
                                              onClick={() =>
                                                selectedRequest &&
                                                handleUpdateStatus(
                                                  selectedRequest.id,
                                                  "Rejected"
                                                )
                                              }
                                            >
                                              <XIcon className="h-4 w-4 mr-1" />
                                              Reject
                                            </Button>
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setDialogOpen(false)
                                              }
                                            >
                                              Close
                                            </Button>
                                            <Button
                                              variant="destructive"
                                              onClick={() =>
                                                selectedRequest &&
                                                handleDeleteAccount(
                                                  selectedRequest.id
                                                )
                                              }
                                            >
                                              Delete Account
                                            </Button>
                                          </>
                                        )}

                                        {status === "Rejected" && (
                                          <>
                                            <Button
                                              onClick={() =>
                                                selectedRequest &&
                                                handleUpdateStatus(
                                                  selectedRequest.id,
                                                  "Approved"
                                                )
                                              }
                                            >
                                              <CheckIcon className="h-4 w-4 mr-1" />
                                              Approve & Create Account
                                            </Button>

                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setDialogOpen(false)
                                              }
                                            >
                                              Close
                                            </Button>
                                          </>
                                        )}
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}

                      {!loading &&
                        (requests.length === 0 ||
                          requests.filter(
                            (req: any) => req.isVerified === status
                          ).length === 0) && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-6 text-muted-foreground"
                            >
                              No {status} requests found
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} defaultValue="Approved" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 w-fit">
            <TabsTrigger value="Approved">
              Approved ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="Rejected">
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>
          {["Approved", "Rejected"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{status} Requests</CardTitle>
                  <CardDescription>
                    {status === "Approved"
                      ? `Previously approved Staff accounts`
                      : `Previously rejected Staff account requests`}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                              {[...Array(6)].map((_, i) => (
                                <TableCell key={i}>
                                  <Skeleton className="h-4 w-full" />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        : requests
                            .filter((req: any) => req.isVerified === status)
                            .map((request: any) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">
                                  {request.staffId}
                                </TableCell>
                                <TableCell>{request.firstName + request.lastName}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {request.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>{request.department}</TableCell>
                                <TableCell>
                                  {formatDate(request.registrationDate)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Dialog
                                    open={
                                      dialogOpen &&
                                      selectedRequest?.id === request.id
                                    }
                                    onOpenChange={(open) => {
                                      if (!open) setSelectedRequest(null);
                                      setDialogOpen(open);
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setSelectedRequest(request)
                                        }
                                      >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        Details
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Staff Account Request
                                        </DialogTitle>
                                        <DialogDescription>
                                          Review details for {request.firstName}'s
                                          request
                                        </DialogDescription>
                                      </DialogHeader>

                                      {selectedRequest && (
                                        <div className="space-y-4 py-4">
                                          <div className="flex items-center space-x-4">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                              <UserIcon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                              <h4 className="font-semibold">
                                                {selectedRequest.firstName + selectedRequest.lastName}
                                              </h4>
                                              <div className="flex items-center text-sm text-muted-foreground">
                                                <MailIcon className="h-3 w-3 mr-1" />
                                                {selectedRequest.email}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-3 text-sm border rounded-lg p-4">
                                            <div>
                                              <p className="text-muted-foreground">
                                                Role
                                              </p>
                                              <p className="font-medium capitalize">
                                                {selectedRequest.role}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground">
                                                Staff ID
                                              </p>
                                              <p className="font-medium">
                                                {selectedRequest.staffId}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground">
                                                Department
                                              </p>
                                              <p className="font-medium">
                                                {selectedRequest.department}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground">
                                                Request Date
                                              </p>
                                              <p className="font-medium">
                                                {formatDate(
                                                  selectedRequest.registrationDate
                                                )}
                                              </p>
                                            </div>
                                            {selectedRequest.hostel && (
                                              <div className="col-span-2">
                                                <p className="text-muted-foreground">
                                                  Assigned Hostel
                                                </p>
                                                <p className="font-medium">
                                                  {selectedRequest.hostel.map( (hostel:any) => hostel.hostelName).join(", ") }
                                                </p>
                                              </div>
                                            )}
                                          </div>

                                          {status === "Approved" && (
                                            <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">
                                              <div className="font-medium flex items-center">
                                                <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                                                Approved
                                              </div>
                                              <p className="text-green-700 mt-1">
                                                This request was approved and
                                                the account was created.
                                              </p>
                                            </div>
                                          )}

                                          {status === "Rejected" && (
                                            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                                              <div className="font-medium flex items-center">
                                                <XIcon className="h-4 w-4 mr-1 text-red-500" />
                                                Rejected
                                              </div>
                                              <p className="text-red-700 mt-1">
                                                This request was rejected and no
                                                account was created.
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      <DialogFooter className="sm:justify-between">
                                        {status === "Approved" && (
                                          <>
                                            <Button
                                              variant="destructive"
                                              onClick={() =>
                                                selectedRequest &&
                                                handleUpdateStatus(
                                                  selectedRequest.id,
                                                  "Rejected"
                                                )
                                              }
                                            >
                                              <XIcon className="h-4 w-4 mr-1" />
                                              Reject
                                            </Button>
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setDialogOpen(false)
                                              }
                                            >
                                              Close
                                            </Button>
                                          </>
                                        )}

                                        {status === "Rejected" && (
                                          <div className="flex gap-3 flex-wrap items-center justify-between">
                                            <Button
                                              onClick={() =>
                                                selectedRequest &&
                                                handleUpdateStatus(
                                                  selectedRequest.id,
                                                  "Approved"
                                                )
                                              }
                                            >
                                              <CheckIcon className="h-4 w-4 mr-1" />
                                              Approve & Create Account
                                            </Button>

                                            <Button variant="destructive"
                                              onClick={() =>
                                                selectedRequest &&
                                                handleDeleteAccount(
                                                  selectedRequest.id)
                                              }
                                            >
                                              <Trash className="h-4 w-4 mr-1" />
                                              Delete Account
                                            </Button>

                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setDialogOpen(false)
                                              }
                                            >
                                              Close
                                            </Button>
                                          </div>
                                        )}
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                      {!loading &&
                        requests.filter((req: any) => req.isVerified === status)
                          .length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-6 text-muted-foreground"
                            >
                              No {status} requests found
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {roleFilter === "Student" && showModal && (
        <StudentRegistrationFrom
          setRequests={setRequests}
          showModal={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {roleFilter === "Warden" && showModal && (
        <WardenRegistrationFrom
          setRequests={setRequests}
          showModal={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
