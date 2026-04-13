"use server";

import { loginSchema } from "@/schemas/loginSchema";

export async function loginAction(values: { email: string; password: string }) {
  try {
    const validatedFields = await loginSchema.validate(values, { abortEarly: false });

    const response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Error al iniciar sesión",
      };
    }

    const data = await response.json();
    
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