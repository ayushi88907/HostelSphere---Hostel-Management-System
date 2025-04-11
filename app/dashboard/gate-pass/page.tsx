"use server";

import OutingPassList from "@/components/dashboard/outingPass/OutingPassList";
import { getAllGetPasses } from "./action";

// // Sample gate pass data
// const gatePasses = [
//   { id: "GP-001", date: "2023-09-05", time: "14:00", reason: "Doctor's appointment", status: "Approved" },
//   { id: "GP-002", date: "2023-09-07", time: "18:00", reason: "Family dinner", status: "Pending" },
//   { id: "GP-003", date: "2023-09-10", time: "10:00", reason: "Shopping", status: "Rejected" },
// ]

export default async function GatePassPage() {

  const gatePasses = await getAllGetPasses();

  console.log(gatePasses)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gate Pass</h1>
        <p className="text-muted-foreground">Request and manage your gate passes.</p>
      </div>

      <OutingPassList gatePasses={gatePasses.data}/>
    </div>
  )
}

