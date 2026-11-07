import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, prismaError } from "@/lib/http";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    });
    if (!book) return fail("Libro no encontrado", 404);
    return NextResponse.json(book);
  } catch (e) {
    return prismaError(e, "Error al obtener libro");
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { title, description, isbn, publishedYear, genre, pages, authorId } =
      await request.json();
    const book = await prisma.book.update({
      where: { id },
      data: { title, description, isbn, publishedYear, genre, pages, authorId },
    });
    return NextResponse.json(book);
  } catch (e) {
    return prismaError(e, "Error al actualizar libro");
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ message: "Libro eliminado" });
  } catch (e) {
    return prismaError(e, "Error al eliminar libro");
  }
}
