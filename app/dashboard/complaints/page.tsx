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
import { getAllComplaints } from "./action";

export default async function ComplaintsPage() {
  const session = await serverSession();

  if (!session) return null;

  const allComplaints = await getAllComplaints();

  console.log(allComplaints)


  return (
    <div className="">
      <div className="space-y-6 relative">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">
            { session.role === "Student" ? "View and raise new complaints." : "View and manage students complaints."}
          </p>
        </div>

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
                  <div className="text-2xl font-bold">12</div>
                </div>
                <div className="rounded-lg border p-3 bg-primary-foreground">
                  <div className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </div>
                  <div className="text-2xl font-bold">5</div>
                </div>
                <div className="rounded-lg border p-3 bg-primary-foreground">
                  <div className="text-sm font-medium text-muted-foreground">
                    Closed
                  </div>
                  <div className="text-2xl font-bold">27</div>
                </div>
                <div className="rounded-lg border p-3 bg-primary-foreground">
                  <div className="text-sm font-medium text-muted-foreground">
                    Avg. Resolution
                  </div>
                  <div className="text-2xl font-bold">3.2d</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ComplaintsList complaintsDataList={allComplaints.data}/>

      </div>

      {session.role === "Student" && (
        <ComplaintForm/>
      )}
    </div>
  );
}
