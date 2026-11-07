import { NextResponse } from "next/server";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { prismaError } from "@/lib/http";

// GET /api/stats -> estadisticas generales para el dashboard y los filtros
export async function GET() {
  await connection(); // dato dinamico: nunca se prerenderiza en el build
  try {
    const [totalAuthors, totalBooks, pagesAgg, years, byGenre, byAuthor] = await Promise.all([
      prisma.author.count(),
      prisma.book.count(),
      prisma.book.aggregate({ _avg: { pages: true }, _sum: { pages: true } }),
      prisma.book.aggregate({ _min: { publishedYear: true }, _max: { publishedYear: true } }),
      prisma.book.groupBy({ by: ["genre"], _count: { _all: true }, where: { genre: { not: null } }, orderBy: { genre: "asc" } }),
      prisma.author.findMany({
        select: { id: true, name: true, _count: { select: { books: true } } },
        orderBy: { books: { _count: "desc" } },
        take: 1,
      }),
    ]);
    const top = byAuthor[0];
    return NextResponse.json({
      totalAuthors,
      totalBooks,
      totalPages: pagesAgg._sum.pages ?? 0,
      averagePages: Math.round(pagesAgg._avg.pages ?? 0),
      firstYear: years._min.publishedYear,
      lastYear: years._max.publishedYear,
      genres: byGenre.map((g) => ({ genre: g.genre as string, count: g._count._all })),
      topAuthor: top && top._count.books > 0 ? { id: top.id, name: top.name, books: top._count.books } : null,
    });
  } catch (e) {
    return prismaError(e, "Error al obtener estadisticas generales");
  }
}
