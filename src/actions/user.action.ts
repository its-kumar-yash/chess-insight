"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { newUserSchema } from "@/lib/schema";
import passwordHash from "password-hash";

export async function syncUser() {
  try {
    const session = await auth();

    if (!session?.user) {
      console.error("No user in session.");
      return;
    }

    const user = session.user;

    // Ensure we have a unique identifier – use email if user.id is not provided.
    if (!user.email) {
      console.error("User email is undefined.");
      return;
    }

    let existingUser;

    if (user.id) {
      existingUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
    } else {
      // Fallback: Query by email if id is undefined.
      existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
    }

    if (existingUser) {
      return existingUser;
    }

    // Create a new user in the database.
    const dbUser = await prisma.user.create({
      data: {
        // Only include id if it's provided; otherwise, let Prisma generate one.
        ...(user.id ? { id: user.id } : {}),
        name: user.name || null,
        email: user.email,
        image: user.image || null,
        // createdAt and updatedAt will be handled by Prisma defaults.
      },
    });

    return dbUser;
  } catch (e) {
    console.error("Error syncing user: ", e);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (e) {
    console.error("Error fetching user from DB: ", e);
  }
}

export async function createNewUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedData = await newUserSchema.parseAsync({
      name,
      email,
      password,
    });

    const existingUser = await getUserByEmail(validatedData.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = passwordHash.generate(validatedData.password);

    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return {
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}
