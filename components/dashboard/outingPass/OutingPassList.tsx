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

export default function OutingPassList({ gatePasses }: any) {
  const [outingPasses, setOutingPasses] = useState(gatePasses);

  const session = useClientSession();
  if (!session) return;

  function mergeDateAndTime(date: string, time: string): Date | null {
    if (!date || !time) return null;
    const merged = new Date(`${date}T${time}:00`);
    return isNaN(merged.getTime()) ? null : merged;
  }

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
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
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
