import { NextRequest, NextResponse, connection } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { prismaError } from "@/lib/http";

const SORT_FIELDS = ["title", "publishedYear", "createdAt"] as const;
type SortField = (typeof SORT_FIELDS)[number];

// Entero dentro de [min, max]; si no es valido devuelve el valor por defecto
function toInt(value: string | null, def: number, min: number, max: number) {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isNaN(n) ? def : Math.min(Math.max(n, min), max);
}

export async function GET(request: NextRequest) {
  await connection(); // dato dinamico: nunca se prerenderiza en el build
  try {
    const sp = request.nextUrl.searchParams;
    const search = sp.get("search")?.trim();
    const genre = sp.get("genre")?.trim();
    const authorName = sp.get("authorName")?.trim();
    const authorId = sp.get("authorId")?.trim();

    const page = toInt(sp.get("page"), 1, 1, Number.MAX_SAFE_INTEGER);
    const limit = toInt(sp.get("limit"), 10, 1, 50);
    const sortParam = sp.get("sortBy") as SortField;
    const sortBy: SortField = SORT_FIELDS.includes(sortParam) ? sortParam : "createdAt";
    const order: "asc" | "desc" = sp.get("order") === "asc" ? "asc" : "desc";

    const where: Prisma.BookWhereInput = {
      ...(search && { title: { contains: search, mode: "insensitive" } }),
      ...(genre && { genre }),
      ...(authorId && { authorId }),
      ...(authorName && { author: { name: { contains: authorName, mode: "insensitive" } } }),
    };

    const [total, data] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: { author: { select: { id: true, name: true } } },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (e) {
    return prismaError(e, "Error al buscar libros");
  }
}
