import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function proxy(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
        return NextResponse.json(
            { message: "No autenticado" },
            { status: 401 }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/dashboard",
};