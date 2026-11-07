import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, prismaError } from "@/lib/http";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const author = await prisma.author.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });
    if (!author) return fail("Autor no encontrado", 404);
    return NextResponse.json(author);
  } catch (e) {
    return prismaError(e, "Error al obtener autor");
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { name, email, bio, nationality, birthYear, imageUrl } = await request.json();
    const author = await prisma.author.update({
      where: { id },
      data: { name, email, bio, nationality, birthYear, imageUrl },
    });
    return NextResponse.json(author);
  } catch (e) {
    return prismaError(e, "Error al actualizar autor");
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.author.delete({ where: { id } }); // borra sus libros (Cascade)
    return NextResponse.json({ message: "Autor eliminado" });
  } catch (e) {
    return prismaError(e, "Error al eliminar autor");
  }
}
