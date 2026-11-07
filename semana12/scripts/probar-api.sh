#!/usr/bin/env bash
# Pruebas de las API Routes del laboratorio 12 (equivalente a las pruebas de Postman de la guia).
# Datos de prueba: autores peruanos reales. Uso, con `pnpm dev` corriendo en otra terminal:
#   bash scripts/probar-api.sh
BASE="${BASE:-http://localhost:3000}"
J='Content-Type: application/json'
paso() { printf '\n\033[1;36m### %s\033[0m\n' "$*"; }
req()  { printf '\033[2m$ curl -X %s %s\033[0m\n' "$1" "$2"; }

paso "1. POST /api/authors  (crear autor)"
req POST "$BASE/api/authors"
AUTOR=$(curl -s -X POST "$BASE/api/authors" -H "$J" -d '{
  "name":"Mario Vargas Llosa","email":"mvargasllosa@example.com","nationality":"Perú",
  "birthYear":1936,"bio":"Premio Nobel de Literatura 2010"}')
echo "$AUTOR" | jq .
ID=$(echo "$AUTOR" | jq -r '.id')
[ "$ID" = "null" ] && { echo "No se pudo crear (¿email ya existe?). Se reutiliza el autor existente."; \
  ID=$(curl -s "$BASE/api/authors" | jq -r '.[] | select(.email=="mvargasllosa@example.com") | .id'); }

# Segundo autor, para probar filtros por autor
curl -s -X POST "$BASE/api/authors" -H "$J" -d '{
  "name":"Julio Ramón Ribeyro","email":"jrribeyro@example.com","nationality":"Perú",
  "birthYear":1929,"bio":"Maestro del cuento peruano"}' >/dev/null
ID2=$(curl -s "$BASE/api/authors" | jq -r '.[] | select(.email=="jrribeyro@example.com") | .id')

paso "2. GET /api/authors  (todos los autores)"
req GET "$BASE/api/authors"; curl -s "$BASE/api/authors" | jq .

paso "3. GET /api/authors/$ID  (autor por ID)"
req GET "$BASE/api/authors/$ID"; curl -s "$BASE/api/authors/$ID" | jq .

paso "4. PUT /api/authors/$ID  (actualizar autor)"
req PUT "$BASE/api/authors/$ID"
curl -s -X PUT "$BASE/api/authors/$ID" -H "$J" -d '{
  "name":"Mario Vargas Llosa","bio":"Autor de La ciudad y los perros"}' | jq .

paso "5. POST /api/books  (crear libros)"
req POST "$BASE/api/books"
curl -s -X POST "$BASE/api/books" -H "$J" -d "{
  \"title\":\"La ciudad y los perros\",\"description\":\"Novela ambientada en el Colegio Militar Leoncio Prado\",
  \"isbn\":\"978-8420471839\",\"publishedYear\":1963,\"genre\":\"Novela\",\"pages\":408,\"authorId\":\"$ID\"}" | jq .
for b in \
 "$ID|La casa verde|1966|Novela|464" \
 "$ID|Conversación en La Catedral|1969|Novela|608" \
 "$ID|Pantaleón y las visitadoras|1973|Novela|304" \
 "$ID|La fiesta del Chivo|2000|Novela|520" \
 "$ID|Los cachorros|1967|Cuento|96" \
 "$ID2|Los gallinazos sin plumas|1955|Cuento|112" \
 "$ID2|La palabra del mudo|1972|Cuento|288"; do
  IFS='|' read -r a t y g p <<<"$b"
  curl -s -X POST "$BASE/api/books" -H "$J" -d "{\"title\":\"$t\",\"publishedYear\":$y,\"genre\":\"$g\",\"pages\":$p,\"authorId\":\"$a\"}" >/dev/null
done
echo "(+7 libros adicionales creados para probar busqueda y estadisticas)"

paso "6. GET /api/books  (todos los libros)"
req GET "$BASE/api/books"; curl -s "$BASE/api/books" | jq '[.[] | {id,title,genre,publishedYear,author:.author.name}]'

paso "7. GET /api/books?genre=Novela  (filtro por género)"
req GET "$BASE/api/books?genre=Novela"; curl -s "$BASE/api/books?genre=Novela" | jq '[.[] | {title,genre}]'

BID=$(curl -s "$BASE/api/books?genre=Cuento" | jq -r '[.[]|select(.title=="Los cachorros")][0].id')
paso "8. GET /api/books/$BID  (libro por ID)"
req GET "$BASE/api/books/$BID"; curl -s "$BASE/api/books/$BID" | jq .

paso "9. GET /api/authors/$ID/books  (libros de un autor)"
req GET "$BASE/api/authors/$ID/books"; curl -s "$BASE/api/authors/$ID/books" | jq '[.[] | {title,publishedYear}]'

paso "10. DELETE /api/books/$BID  (eliminar libro)"
req DELETE "$BASE/api/books/$BID"; curl -s -X DELETE "$BASE/api/books/$BID" | jq .
echo "Verificacion (debe dar 404):"; curl -s -o /dev/null -w 'HTTP %{http_code}\n' "$BASE/api/books/$BID"

paso "TAREA 1. GET /api/books/search  (busqueda + filtros + paginacion)"
U="$BASE/api/books/search?search=casa&genre=Novela&page=1&limit=10&sortBy=publishedYear&order=desc"
req GET "$U"; curl -s "$U" | jq '{data:[.data[]|{title,genre,publishedYear,author:.author.name}], pagination}'
U="$BASE/api/books/search?authorName=VARGAS&limit=2&page=2&sortBy=title&order=asc"
req GET "$U"; curl -s "$U" | jq '{data:[.data[]|{title}], pagination}'
echo "limit=999 se limita a 50:"; curl -s "$BASE/api/books/search?limit=999" | jq '.pagination'

paso "TAREA 2. GET /api/authors/$ID/stats  (estadisticas del autor)"
req GET "$BASE/api/authors/$ID/stats"; curl -s "$BASE/api/authors/$ID/stats" | jq .

paso "Errores controlados"
echo "Autor inexistente:"; curl -s -w '  -> HTTP %{http_code}\n' "$BASE/api/authors/no-existe"
echo "POST sin email:";    curl -s -w '  -> HTTP %{http_code}\n' -X POST "$BASE/api/authors" -H "$J" -d '{"name":"X"}'
echo "Email duplicado:";   curl -s -w '  -> HTTP %{http_code}\n' -X POST "$BASE/api/authors" -H "$J" -d '{"name":"X","email":"mvargasllosa@example.com"}'
