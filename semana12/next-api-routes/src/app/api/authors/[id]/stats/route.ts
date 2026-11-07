import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, prismaError } from "@/lib/http";

// GET /api/authors/[id]/stats -> estadisticas del autor
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const author = await prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!author) return fail("Autor no encontrado", 404);

    const books = author.books;
    const withYear = books.filter((b) => b.publishedYear != null);
    const withPages = books.filter((b) => b.pages != null);
    const byYear = [...withYear].sort((a, b) => a.publishedYear! - b.publishedYear!);
    const byPages = [...withPages].sort((a, b) => a.pages! - b.pages!);
    const first = byYear[0];
    const last = byYear[byYear.length - 1];
    const shortest = byPages[0];
    const longest = byPages[byPages.length - 1];

    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks: books.length,
      firstBook: first ? { title: first.title, year: first.publishedYear } : null,
      latestBook: last ? { title: last.title, year: last.publishedYear } : null,
      averagePages: withPages.length
        ? Math.round(withPages.reduce((s, b) => s + b.pages!, 0) / withPages.length)
        : 0,
      genres: [...new Set(books.map((b) => b.genre).filter((g): g is string => !!g))],
      longestBook: longest ? { title: longest.title, pages: longest.pages } : null,
      shortestBook: shortest ? { title: shortest.title, pages: shortest.pages } : null,
    });
  } catch (e) {
    return prismaError(e, "Error al obtener estadisticas");
  }
}
