import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, prismaError } from "@/lib/http";

// GET /api/books?genre=Novela
export async function GET(request: NextRequest) {
  try {
    const genre = request.nextUrl.searchParams.get("genre");
    const books = await prisma.book.findMany({
      where: genre ? { genre } : undefined,
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(books);
  } catch (e) {
    return prismaError(e, "Error al obtener libros");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, isbn, publishedYear, genre, pages, authorId } =
      await request.json();
    if (!title || !authorId) return fail("title y authorId son obligatorios", 400);
    const book = await prisma.book.create({
      data: { title, description, isbn, publishedYear, genre, pages, authorId },
      include: { author: { select: { id: true, name: true } } },
    });
    return NextResponse.json(book, { status: 201 });
  } catch (e) {
    return prismaError(e, "Error al crear libro");
  }
}
