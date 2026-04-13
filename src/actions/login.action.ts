"use server";

import { loginSchema } from "@/schemas/loginSchema";
import { cookies } from "next/headers";

export async function loginAction(values: { email: string; password: string }) {
  try {
    const validatedFields = await loginSchema.validate(values, { abortEarly: false });

    const response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(validatedFields),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Credenciales incorrectas",
      };
    }
    
    const cookieStore = await cookies();
    cookieStore.set("auth_token", data.token || data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    if (error instanceof Error && "inner" in error) {
      const errors: Record<string, string[]> = {};
      (error as { inner: Array<{ path?: string; message: string }> }).inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = [err.message];
        }
      });
      return {
        success: false,
        errors,
      };
    }
    return {
      success: false,
      message: "Error de conexión",
    };
  }
}