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

  // Sample complaints data
  const complaints = [
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

const ComplaintsList = () => {

  return (
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
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">
                      {complaint.id}
                    </TableCell>
                    <TableCell>{complaint.subject}</TableCell>
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
                    <TableCell>{complaint.date}</TableCell>
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
                        {complaint.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
  )
}

export default ComplaintsList