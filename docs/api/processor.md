# Referencia: Clase `ApiQueryBuilder` 🏛️

Clase principal que actúa como Fluent Builder para orquestar la cadena de procesamiento de consultas REST en Laravel.

Namespace: `Warrior\ApiQueryBuilder\ApiQueryBuilder`

---

## 🏗️ Métodos de Inicialización

### `ApiQueryBuilder::for($subject, ?Request $request = null): self`
Punto de entrada principal para crear una nueva instancia del constructor.
- **Parámetros:**
  - `$subject`: Puede ser un `class-string<Model>` (ej: `User::class`), una instancia de `Builder` (ej: `User::where('active', true)`), o una instancia de `Relation` (ej: `$user->posts()`).
  - `$request`: Objeto `Illuminate\Http\Request` opcional. Si se omite, se resuelve automáticamente con el helper `request()`.
- **Retorno:** Instancia de `ApiQueryBuilder`.

---

## 🔧 Métodos de Configuración (Encadenables)

### `allowedFilters(array $filters): self`
Define la lista blanca de filtros autorizados para la petición.
- Acepta nombres de columnas directas (`'name'`), relaciones (`'roles.name'`), comodines (`'*'`, `'roles.*'`), campos JSON (`'extra_data.client.code'`), nombres de Local Scopes (`'active'`) o instancias de `CustomFilter` creadas con `Filter::custom()`.

### `defaultFilters(array $defaults): self`
Define valores por defecto a nivel de petición HTTP si el cliente omite el parámetro.
- Mantiene la consulta base inmutable y permite que el cliente sobrescriba el valor.

### `allowedIncludes(array $includes): self`
Define las relaciones de Eloquent autorizadas para carga anticipada (*Eager Loading*) mediante `with()`. Previene el problema de $N+1$ queries.

### `allowedCounts(array $counts): self`
Define las relaciones autorizadas para conteos agregados virtuales mediante `withCount()`.

### `allowedSearch(array $columns): self`
Define el listado de columnas de texto (directas o relacionales) sobre las cuales actuará el parámetro global `?search=`.

### `allowedSorts(array $sorts): self`
Define las columnas de la tabla base autorizadas para ser ordenadas mediante `?sort=`.

### `defaultSort(string $column, string $direction = 'asc'): self`
Sobrescribe la columna y dirección de ordenamiento por defecto cuando el cliente no especifica el parámetro `sort`.
- Si la columna se pasa con prefijo `-` (ej: `'-created_at'`), se infiere automáticamente orden descendente.

### `allowAll(int|bool $maxLimitOrUnlimited = 5000): self`
Habilita explícitamente el flag `?all=true` para recuperar todos los registros sin paginar en formato de array plano.
- `$maxLimitOrUnlimited`: Límite máximo de registros permitidos (entero) o `true` para ilimitado.

---

## 🏁 Métodos Terminales (Resolución)

### `response(?string $resourceClass = null): JsonResponse`
Ejecuta la pipeline completa y retorna una respuesta JSON (`Illuminate\Http\JsonResponse`) lista para retornar en el controlador:
- Si se solicitó `?all=true`, devuelve directamente un **array plano** `[ {...}, {...} ]`.
- Si se pasó `$resourceClass` (ej: `UserResource::class`), envuelve los datos con la colección del Resource.
- Si es paginación normal sin resource, devuelve el objeto paginador estándar de Laravel.

### `get(): LengthAwarePaginator|Paginator|CursorPaginator|Collection`
Ejecuta la pipeline completa y retorna el resultado nativo de Laravel (`Collection` si vino `all=true`, o la instancia de `Paginator` correspondiente).

### `paginate(?int $perPage = null): LengthAwarePaginator|Paginator|CursorPaginator|Collection`
Alias semántico de `get()` enfocado en paginación estándar, permitiendo sobrescribir `$perPage` de forma directa en el código.
