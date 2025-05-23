"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import FormInput from "@/components/ui/FormInput";
import { useRouter } from "next/navigation";
import { loginValidation } from "@/common/types";
import { signIn } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RedirectStatusCode } from "next/dist/client/components/redirect-status-code";
import { strict } from "assert";
import { string } from "zod";

type SigninFormData = Zod.infer<typeof loginValidation>;

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [formData, setFormData] = useState<SigninFormData>({
    email: "",
    password: "",
    role: "Student",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const router = useRouter();

  const signInUser = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    toast.dismiss();
    const id = toast.loading("Loggin...");

    const parseData = loginValidation.safeParse(formData);

    if (!parseData.success) {
      console.log(parseData);
      toast.error(
        parseData.error.issues.slice(-1)[0].message || "Invalid Credentials",
        {
          id: id,
        }
      );

      setIsSubmitting(false);

      return;
    }

    try {
      let result = await signIn("credentials", {
        redirect: false,
        email: parseData.data.email,
        password: parseData.data.password,
        role: parseData.data.role,
      });

      if (result?.error) {
        throw new Error(result?.error);
      }

      if (result?.ok) {
        toast.success("Logged in Successfully", {
          id: id,
        });

        router.push("/dashboard");
      }
    } catch (error:any) {
      console.log(error);

      let errMsg = "Something went wrong.";
      let statusCode = 500;

      


      // const errMsg = (error as Error).message || "something went wrong.";
      // const statusCode = error?.status || 500;
    
      try {
        const parsed = JSON.parse(error.message); // try parsing error.message
        errMsg = parsed.message || errMsg;
        statusCode = parsed.statusCode || statusCode;
       
      } catch (e) {
        // Not a JSON error message, fallback
        errMsg = error.message || errMsg;
       
      }

      toast.error(errMsg, {
        id: id,
      });
      
  if (statusCode === 403) {
    setIsVerified(true);
  } else {
    setIsVerified(false);
  }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target ? e.target : e;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
            <div className="mx-auto w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white dark:text-black mb-4">
              <LockIcon className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-display font-bold">
              Log in to HostelSphere
            </h1>
            <p className="text-muted-foreground mt-2">
              Access your account to manage hostel operations
            </p>
          </div>

          <Tabs
            defaultValue="Student"
            onChange={handleChange}
            onValueChange={(value) => handleChange({ name: "role", value })}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="Student">Student</TabsTrigger>
              <TabsTrigger value="Warden">Warden</TabsTrigger>
              <TabsTrigger value="Admin">Admin</TabsTrigger>
            </TabsList>

            {["Student", "Warden", "Admin"].map((role) => (
              <TabsContent key={role} value={role}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {role.charAt(0).toUpperCase() + role.slice(1)} Login
                    </CardTitle>
                    <CardDescription>
                      {role === "Student"
                        ? "Enter your credentials to access your student account"
                        : `Enter your credentials to access your ${role} account`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={signInUser} className="space-y-4">
                      <FormInput
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        icon={<MailIcon size={18} />}
                        required
                        className=""
                      />

                      <div className="space-y-2">
                        <FormInput
                          id={`password`}
                          label="Password"
                          type="password"
                          name="password"
                          autoComplete="current-password"
                          icon={<LockIcon size={18} />}
                          value={formData.password}
                          onChange={handleChange}
                          error={errors.password}
                          required
                        />

                        <Link
                          href="/auth/forgot-password"
                          className="text-xs text-right w-full inline-block text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        className="w-full mt-6"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    {role === "Student" ? (
                      <>
                        
                        {isVerified ? (
                          <Alert className="bg-amber-50 border-amber-200">
                            <InfoIcon className="h-4 w-4 text-amber-500 dark:text-amber-900" />
                            <AlertTitle className="text-amber-800">
                              Account Verification Pending
                            </AlertTitle>
                            <AlertDescription className="text-amber-700 text-sm">
                              Your account is pending approval by the system
                              administrator. You'll receive an email
                              notification once your student account has been
                              verified.
                            </AlertDescription>
                          </Alert>
                        )
                        : <p className="text-sm text-muted-foreground">
                          Don't have an account?{" "}
                          <Link
                            href="/auth/signup"
                            className="text-primary hover:underline"
                          >
                            Sign up
                          </Link>
                        </p>
                      }
                      </>
                    ) : (
                      <p className="py-2.5"></p>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
