"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { DeleteAccount } from "../access-management/action";
import { useClientSession } from "@/hooks/useClientSession";

export default function DeleteAccountSetting() {

    const [loading, setIsLoading] = useState(false)
    const session = useClientSession();

  const handleDeleteAccount = async () => {
    toast.dismiss();
    let toastId = toast.loading("Deleting account...");
    setIsLoading(true);
    try {
        if(!session) return;
      let result = await DeleteAccount(session.role, session.id);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
      }

      if (result.success) {
        toast.success(result.message, { id: toastId });

        signOut({
          callbackUrl: "/",
        });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error((error as Error).message, { id: toastId });
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>Manage your privacy settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="activity-tracking">Activity Tracking</Label>
            <p className="text-sm text-muted-foreground">
              Allow us to track your activity for a better experience.
            </p>
          </div>
          <Switch id="activity-tracking" defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="data-sharing">Data Sharing</Label>
            <p className="text-sm text-muted-foreground">
              Share your usage data to help us improve our services.
            </p>
          </div>
          <Switch id="data-sharing" defaultChecked />
        </div>
        <div className="mt-6">
          <Button disabled={loading} onClick={handleDeleteAccount} variant="destructive">
            {
                loading
                ? "Deleting account..."
                : "Delete Account" 
            } 
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
