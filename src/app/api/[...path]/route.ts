import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text || "Error del servidor" };
  }
}

const baseHeaders = (token: string) => ({
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": `Bearer ${token}`,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

  const { path } = await params;
  const url = `${process.env.API_URL}/${path.join("/")}`;

  try {
    const response = await fetch(url, { method: "GET", headers: baseHeaders(token.value) });
    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: `Error de conexión: ${error}` }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

  const { path } = await params;
  const url = `${process.env.API_URL}/${path.join("/")}`;
  const body = await request.json();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: baseHeaders(token.value),
      body: JSON.stringify(body),
    });
    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: `Error de conexión: ${error}` }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

  const { path } = await params;
  const url = `${process.env.API_URL}/${path.join("/")}`;
  const body = await request.json();

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: baseHeaders(token.value),
      body: JSON.stringify(body),
    });
    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: `Error de conexión: ${error}` }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

  const { path } = await params;
  const url = `${process.env.API_URL}/${path.join("/")}`;

  try {
    const response = await fetch(url, { method: "DELETE", headers: baseHeaders(token.value) });
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: `Error de conexión: ${error}` }, { status: 500 });
  }
}