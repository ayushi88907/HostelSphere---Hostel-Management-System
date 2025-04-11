"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { serverSession } from "@/lib/serverSession";
import ComplaintForm from "@/components/dashboard/complaints/ComplaintSubmissionForm";
import ComplaintsList from "@/components/dashboard/complaints/ComplaintsList";
import { getAllComplaints, raiseNewComplaint } from "./action";
import { differenceInDays } from "date-fns";

export default async function ComplaintsPage() {
  const session = await serverSession();

  if (!session) return null;

  const allComplaints = await getAllComplaints();

  console.log(allComplaints);

  return (
    <div className="">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">
            {session.role === "Student"
              ? "View and raise new complaints."
              : "View and manage students complaints."}
          </p>
        </div>

        <ComplaintsList complaintsDataList={allComplaints.data} />
      </div>
    
    </div>
  );
}
