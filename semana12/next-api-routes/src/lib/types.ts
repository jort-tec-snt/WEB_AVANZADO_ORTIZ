export type Author = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  nationality: string | null;
  birthYear: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { books: number };
};

export type Book = {
  id: string;
  title: string;
  description: string | null;
  isbn: string | null;
  publishedYear: number | null;
  genre: string | null;
  pages: number | null;
  authorId: string;
  author?: { id: string; name: string };
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type GeneralStats = {
  totalAuthors: number;
  totalBooks: number;
  totalPages: number;
  averagePages: number;
  firstYear: number | null;
  lastYear: number | null;
  genres: { genre: string; count: number }[];
  topAuthor: { id: string; name: string; books: number } | null;
};

export type AuthorStats = {
  authorId: string;
  authorName: string;
  totalBooks: number;
  firstBook: { title: string; year: number } | null;
  latestBook: { title: string; year: number } | null;
  averagePages: number;
  genres: string[];
  longestBook: { title: string; pages: number } | null;
  shortestBook: { title: string; pages: number } | null;
};
