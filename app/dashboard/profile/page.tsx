"use server";

import { AdminUser, getUser, StudentUser, updateUserProfileData, UserData } from "@/app/action";
import { Suspense } from "react";
import Loading from "../loading";
import Profile from "@/components/dashboard/profile/Profile";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { serverSession } from "@/lib/serverSession";


export default async function ProfilePage() {
  const user: UserData = await getUser();

  if (!user || !Object.keys(user).length) return;

  const session = await serverSession();
  if(!session ) return;

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <div>
          <div className="w-full flex justify-between gap-6 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <Badge variant="default" className="px-3 py-1 text-nowrap">
            <User className="h-4 w-4 mr-1" />
            <span>{session.role}</span>
          </Badge>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Profile user={user} onUpdateProfile={updateUserProfileData}/>
      </div>
    </Suspense>
  );
}
