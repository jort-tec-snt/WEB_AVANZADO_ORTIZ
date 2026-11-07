import { NextRequest, NextResponse, connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, prismaError } from "@/lib/http";

// GET /api/authors -> lista autores con el conteo de libros
export async function GET() {
  await connection(); // dato dinamico: nunca se prerenderiza en el build
  try {
    const authors = await prisma.author.findMany({
      include: { _count: { select: { books: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(authors);
  } catch (e) {
    return prismaError(e, "Error al obtener autores");
  }
}

// POST /api/authors -> crea autor (campos explicitos: sin mass assignment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, bio, nationality, birthYear, imageUrl } = body;
    if (!name || !email) return fail("name y email son obligatorios", 400);
    const author = await prisma.author.create({
      data: { name, email, bio, nationality, birthYear, imageUrl },
    });
    return NextResponse.json(author, { status: 201 });
  } catch (e) {
    return prismaError(e, "Error al crear autor");
  }
}
