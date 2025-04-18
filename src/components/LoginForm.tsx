"use client";

import { z } from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Router } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { googleSignIn, signInWithCredentials } from "@/actions/auth.action";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormProps = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormProps) => {
    setIsLoading(true);
    try {
      const validatedData = loginSchema.parse(data);

      // const result = await signIn("credentials", {
      //   email: validatedData.email,
      //   password: validatedData.password,
      //   redirect: false,
      // });

      const result = await signInWithCredentials(
        validatedData.email,
        validatedData.password
      )

      if (result?.error) {
        console.error("Login failed", result.error);
        toast.error("Login failed. Please check your credentials.");
      }
      else{
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard"); // Redirect to the dashboard or any other page
      }

    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    try {
      googleSignIn();
      toast.success("Login successful! Redirecting...");
    } catch (error) {
      console.error("Google login failed", error);
      toast.error("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm !bg-background/20 !border-primary/20 p-5 shadow-md">
      <CardHeader className="">
        <CardTitle className="text-xl font-bold">Login</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="!px-0">
        <Button
          variant="outline"
          className="w-full !bg-background !border-primary/20 hover:!bg-secondary/30 cursor-pointer"
          type="button"
          onClick={() => handleGoogleLogin()}
        >
          <Image
            src="/googleicon.svg"
            height={16}
            width={16}
            alt="google-icon"
            className="h-4 w-4"
          />
          <span className="ml-2">Sign in with Google</span>
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
                  Logging in...
                </>
              ) : (
                "Login to your account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
