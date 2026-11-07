import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, prismaError } from "@/lib/http";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const author = await prisma.author.findUnique({ where: { id }, select: { id: true } });
    if (!author) return fail("Autor no encontrado", 404);
    const books = await prisma.book.findMany({
      where: { authorId: id },
      orderBy: { publishedYear: "asc" },
    });
    return NextResponse.json(books);
  } catch (e) {
    return prismaError(e, "Error al obtener libros del autor");
  }
}
