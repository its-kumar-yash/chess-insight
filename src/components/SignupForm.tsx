"use client";

import { z } from "zod";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { googleSignIn } from "@/actions/auth.action";
import { redirect, useRouter } from "next/navigation";
import { createNewUser } from "@/actions/user.action";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof formSchema>;

export default function SignupForm() {
  const router = useRouter();
  // const cookieStore = await cookies()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await createNewUser(formData);

      if (result.error) {
        form.setError("email", { message: result.error });
        toast.error(result.error);
      }
      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error creating account", error);
      toast.error("Error creating account");
      form.setError("root", { message: "Signup failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    try {
      googleSignIn();
      // toast.success("Google sign-in successful! Redirecting...");
    } catch (error) {
      console.error("Google login failed", error);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm !bg-background/20 !border-primary/20 p-5 shadow-md">
      <CardHeader className="">
        <CardTitle className="text-xl font-bold">Sign Up</CardTitle>
        <CardDescription className="text-muted-foreground">
          Create an account to save and track your game analyses
        </CardDescription>
      </CardHeader>
      <CardContent className="!px-0">
        <Button
          variant="outline"
          className="w-full !bg-background !border-primary/20 hover:!bg-secondary/30 cursor-pointer"
          type="button"
          onClick={() => handleGoogleSignIn()}
        >
          <Image
            src="/googleicon.svg"
            height={16}
            width={16}
            alt="google-icon"
            className="h-4 w-4"
          />
          <span className="ml-2">Sign up with Google</span>
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="!border-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="!border-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="!border-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-center text-sm text-muted-foreground">
          {" "}
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
function preventDefault() {
  throw new Error("Function not implemented.");
}
