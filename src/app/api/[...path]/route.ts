import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 }
    );
  }

  const { path } = await params;
  const url = `${process.env.API_URL}/${path}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Error de conexión" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 }
    );
  }

  const { path } = await params;
  const url = `${process.env.API_URL}/${path}`;
  const body = await request.json();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Error de conexión" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 }
    );
  }

  const { path } = await params;
  const url = `${process.env.API_URL}/${path}`;
  const body = await request.json();

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Error de conexión" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 }
    );
  }

  const { path } = await params;
  const url = `${process.env.API_URL}/${path}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Error de conexión" },
      { status: 500 }
    );
  }
}