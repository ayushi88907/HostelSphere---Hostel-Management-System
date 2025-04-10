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
import { serverSession } from "@/lib/serverSession";
import LeaveApplicationFrom from "@/components/dashboard/leaveApplication/LeaveApplicationFrom";

export default async function LeaveFormPage() {
  const session = await serverSession();

  if (!session) return null;

  // Sample leave applications
  const leaveApplications = [
    {
      id: "LEAVE-001",
      from: "2023-09-10",
      to: "2023-09-12",
      reason: "Family function",
      status: "Approved",
    },
    {
      id: "LEAVE-002",
      from: "2023-09-15",
      to: "2023-09-16",
      reason: "Medical appointment",
      status: "Pending",
    },
    {
      id: "LEAVE-003",
      from: "2023-09-20",
      to: "2023-09-22",
      reason: "Personal reasons",
      status: "Rejected",
    },
  ];

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Leave Application
          </h1>
          <p className="text-muted-foreground">
            { session.role === "Student" ? "Submit and manage your leave applications." : "View and manage students leave applications."}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave Application History</CardTitle>
            <CardDescription>
              Your recent leave applications and their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.id}
                    </TableCell>
                    <TableCell>{application.from}</TableCell>
                    <TableCell>{application.to}</TableCell>
                    <TableCell>{application.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          application.status === "Approved"
                            ? "success"
                            : application.status === "Rejected"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="bg-">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {session.role === "Student" && <LeaveApplicationFrom />}
    </div>
  );
}
