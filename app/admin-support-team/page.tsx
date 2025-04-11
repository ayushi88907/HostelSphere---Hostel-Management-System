"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdminRegisterModal from "./AdminRegister";


export default function AdminRegistrationSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Admin Registration</h1>
        <p className="text-muted-foreground mt-2">
          Create a new staff account for system access. This request will be reviewed and requires approval.
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setShowModal(true)}>Register New Admin</Button>
      </div>

      <AdminRegisterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(newAdmin) => {
          console.log("Registered admin:", newAdmin);
        }}
      />
    </div>
  );
}
