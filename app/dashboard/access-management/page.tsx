"use server";

import { Loader } from "@/components/ui/Loader";
import { ApprovedRequest, DeleteAccount, getDetails, RejectRequest } from "./action";
import ApprovalManagement from "@/components/dashboard/administrator/ApprovalManagement";

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

export default async function StaffApproval() {
  return (
    <ApprovalManagement
      fetchData={getDetails}
      approvedUserRequest={ApprovedRequest}
      rejectUserRequest={RejectRequest}
      deleteAccount={DeleteAccount}
    />
  );
}
