# Introducción & Quickstart 🚀

**Laravel ApiQueryBuilder** (`warrior/api-query-builder`) es una librería de alto rendimiento para **Laravel Eloquent ORM** diseñada para procesar consultas REST (filtros multidimensionales, búsquedas, ordenamientos, relaciones y paginación) de forma declarativa, tipada y segura.

### ¿Por qué se creó?
Nació para resolver un dolor cotidiano en el desarrollo de APIs: **el código repetitivo y desordenado en los controladores CRUD**. En lugar de escribir decenas de `if ($request->filled(...))`, parsear rangos a mano, pelear con consultas $N+1$ o inventar parámetros caóticos que el frontend no puede estandarizar, esta librería te da un protocolo predecible y una API fluida en **una sola instrucción**.

---

### ❌ Antes: Controlador tradicional en Laravel
```php
public function index(Request $request)
{
    $query = User::query();

    // Filtros manuales propensos a errores
    if ($request->filled('status')) $query->where('status', $request->status);
    if ($request->filled('min_score')) $query->where('score', '>=', (float) $request->min_score);
    if ($request->filled('role')) $query->whereHas('roles', fn($q) => $q->where('name', $request->role));

    // Búsqueda global a mano (con riesgo de romper la lógica de paréntesis en SQL)
    if ($request->filled('search')) {
        $term = $request->search;
        $query->where(fn($q) => $q->where('name', 'like', "%{$term}%")->orWhere('email', 'like', "%{$term}%"));
    }

    // Ordenamiento manual con whitelist artesanal
    $sortBy = in_array($request->sort, ['name', 'created_at']) ? $request->sort : 'created_at';
    $query->orderBy($sortBy, $request->get('direction', 'desc'));

    // Eager loading condicional
    if ($request->boolean('with_roles')) $query->with('roles');

    return UserResource::collection($query->paginate($request->get('per_page', 15)));
}
```

**Petición HTTP resultante (Inconsistente y caótica en cada endpoint):**
```http
GET /api/users?status=active&min_score=80&search=Carlos&sort=created_at&direction=desc&with_roles=1
```

---

### ✅ Ahora: Con Laravel ApiQueryBuilder
```php
public function index(Request $request)
{
    return User::apiQuery($request)
        ->allowedFilters(['status', 'score', 'roles.name'])
        ->allowedSearch(['name', 'email'])
        ->allowedSorts(['name', 'created_at'])
        ->defaultSort('-created_at')
        ->allowedIncludes(['roles'])
        ->response(UserResource::class);
}
```

**Petición HTTP resultante (Estándar REST limpio, modular y universal):**
```http
GET /api/users?filter[status]=active&filter[score][gte]=80&filter[roles.name]=Admin&search=Carlos&sort=-created_at&include=roles
```

> **Impacto:** De 35+ líneas repetitivas por CRUD a **8 líneas declarativas**, 100% blindadas contra inyecciones y con cero consultas $N+1$.

---

## 📋 Requisitos del Sistema

- **PHP:** 8.2 o superior (compatible con PHP 8.2, 8.3, 8.4 y 8.5)
- **Laravel:** 10.x, 11.x o 12.x
- **Bases de Datos Soportadas:** MySQL 8+, PostgreSQL 12+, SQLite 3.35+, SQL Server

---

## 📦 Instalación en 10 Segundos

Agrega el paquete a tu proyecto mediante Composer:

::: code-group

```bash [Composer]
composer require warrior/api-query-builder
```

:::

¡Y ya está! Gracias al sistema de descubrimiento automático de paquetes de Laravel, no tienes que registrar Providers manualmente ni agregar traits a tus modelos. La librería está lista para usarse de inmediato.

Si en algún momento deseas personalizar nombres de parámetros o límites globales, puedes publicar el archivo de configuración opcional:

```bash
php artisan vendor:publish --tag="api-query-builder-config"
```

---

## 🚀 Comencemos con una Implementación Básica (1 Sola Línea)

Imagina que tienes un modelo `User` y necesitas un endpoint para listarlo en tu frontend. ¿Cuánto código escribirías habitualmente? Paginación, ordenamiento, formato...

Con **ApiQueryBuilder**, tu controlador se reduce a esto:

::: code-group

```php [Opción A: Con Macro de Eloquent (Ultraligera)]
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return User::apiQuery()->response();
    }
}
```

```php [Opción B: Con Fluent Builder]
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Warrior\ApiQueryBuilder\ApiQueryBuilder;

class UserController extends Controller
{
    public function index()
    {
        return ApiQueryBuilder::for(User::class)->response();
    }
}
```

:::

### ¡Y listo! Con solo esa línea, tu API ya tiene superpoderes:
1. **Paginación automática:** Pagina 15 elementos por página de inmediato, respetando si el cliente solicita `?page=2` o `?per_page=30`.
2. **Orden determinista seguro:** Aplica orden por `id desc` de forma automática, garantizando que los registros no salten de página de manera impredecible.
3. **Respuesta JSON estructurada:** Devuelve directamente el JSON formateado de Laravel con toda su metadata de paginación lista para pintar en la interfaz.

---

## 🎯 ¿Quieres que el frontend filtre? Simplemente define qué campos autorizas

Ahora supongamos que tu tabla en el frontend tiene un selector de estado o un buscador de usuarios por nombre. 

¿Tienes que empezar a escribir `when()`, `if()` o subconsultas a mano? **Para nada.** Simplemente dile a la librería qué campos de tu tabla tienen permiso para ser consultados:

```php
public function index()
{
    return User::apiQuery()
        ->allowedFilters(['name', 'status']) // [!code focus]
        ->response();
}
```

### Desde este momento, tu frontend ya puede hacer magia de forma automática:
- **Filtrar por estado exacto:** `GET /api/users?filter[status]=active`
- **Buscar coincidencias parciales de texto:** `GET /api/users?filter[name][contains]=carlos`
- **Excluir registros:** `GET /api/users?filter[status][neq]=archived`
- **Filtrar por listas:** `GET /api/users?filter[status][in]=active,pending`

::: tip Tu Base de Datos queda 100% Blindada
Si un usuario malintencionado intenta consultar un campo confidencial (por ejemplo, `?filter[password_hash]=secret`), la librería lo detecta, frena la consulta antes de tocar la base de datos y responde automáticamente con un **HTTP 422**.
:::

---

## 💎 ¿Necesitas transformar los datos con API Resources? Cero fricción

En aplicaciones profesionales nunca expones los modelos de base de datos en crudo; siempre los transformas con un [API Resource de Laravel](https://laravel.com/docs/eloquent-resources).

Si ya tienes tu Resource creado (por ejemplo, `UserResource`), integrarlo toma literalmente **una sola palabra**:

```php
use App\Http\Resources\UserResource;

public function index()
{
    return User::apiQuery()
        ->allowedFilters(['name', 'status'])
        ->response(UserResource::class); // [!code focus]
}
```

El procesador se encarga de envolver el paginador de forma nativa con `UserResource::collection($paginator)` y retornar la respuesta JSON perfectamente estructurada.

---

## ⚡ ¿Y qué pasa con las relaciones y el temido problema de N+1?

¿Tu tabla necesita mostrar los roles del usuario o su departamento? Olvídate de consultas lentas o de cargar relaciones pesadas que la pantalla quizás no necesita. 

Dale a tu frontend el control de **cargar relaciones bajo demanda** y agregar **conteos virtuales**, completamente libre de consultas $N+1$:

```php
public function index()
{
    return User::apiQuery()
        ->allowedFilters(['name', 'status', 'roles.name']) // Filtra por el rol del usuario // [!code focus]
        ->allowedIncludes(['roles', 'department'])         // Eager Loading bajo demanda // [!code focus]
        ->allowedCounts(['comments', 'orders'])            // withCount() sin hidratar modelos // [!code focus]
        ->response(UserResource::class);
}
```

### La petición del frontend:
```http
GET /api/users?include=roles&count=comments&filter[roles.name]=Admin
```

### El resultado en SQL:
- Filtra usando una subconsulta segura `whereHas` (sin duplicar filas con JOINs).
- Carga la relación `roles` con `with()` en una sola consulta extra (¡$N+1$ eliminado!).
- Agrega el atributo virtual `comments_count` directamente en el SELECT.

---

## ↕️ Permite reordenar columnas y exportar todo sin paginar

¿Quieres que el usuario pueda hacer clic en los encabezados de tu tabla para ordenar por nombre o fecha? ¿O que pueda descargar todos los registros a Excel? 

Mira qué fácil es habilitarlo:

```php
public function index()
{
    return User::apiQuery()
        ->allowedFilters(['name', 'status'])
        ->allowedSorts(['name', 'created_at']) // Columnas que el usuario puede ordenar // [!code focus]
        ->defaultSort('-created_at')           // Por defecto, los más recientes primero // [!code focus]
        ->allowAll(maxLimitOrUnlimited: 5000)  // Permite ?all=true para exportaciones // [!code focus]
        ->response(UserResource::class);
}
```

### Lo que gana tu aplicación:
- **Ordenamiento flexible en la URL:** El cliente puede enviar `?sort=name` (ascendente) o `?sort=-created_at` (descendente con el prefijo `-`).
- **Exportación con `?all=true`:** Devuelve directamente un **array plano** `[ {...}, {...} ]` sin la estructura del paginador.
- **Paz mental con salvaguarda anti-OOM:** Si la tabla tiene 50,000 filas pero tu límite es 5,000, la librería ejecuta un conteo preventivo y aborta con HTTP 422 antes de saturar la memoria RAM del servidor.

---

## 🏆 El Resultado: Un CRUD de Producción Completo en 10 Líneas

Reuniendo todas las piezas, así luce un endpoint completo de nivel empresarial:

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Warrior\ApiQueryBuilder\ApiQueryBuilder;

class UserController extends Controller
{
    public function index(Request $request)
    {
        return ApiQueryBuilder::for(User::class, $request)
            // 1. Filtros autorizados (columnas, relaciones y comodines JSON):
            ->allowedFilters(['name', 'status', 'roles.name', 'metadata.*'])
            
            // 2. Filtro de respaldo si el frontend no especifica nada:
            ->defaultFilters(['status' => 'active'])
            
            // 3. Eager Loading seguro sin N+1 y conteos agregados:
            ->allowedIncludes(['roles', 'department'])
            ->allowedCounts(['comments'])
            
            // 4. Búsqueda global multi-columna (?search=Carlos):
            ->allowedSearch(['name', 'email'])
            
            // 5. Ordenamiento seguro con desempate por clave primaria:
            ->allowedSorts(['name', 'created_at'])
            ->defaultSort('-created_at')
            
            // 6. Permitir obtener todos los datos para exportaciones:
            ->allowAll(maxLimitOrUnlimited: 5000)
            
            // 7. Formato final con Resource:
            ->response(UserResource::class);
    }
}
```

---

## 🛠️ ¿Y si prefieres manipular el objeto puro en PHP?

Si antes de enviar la respuesta necesitas ejecutar lógica adicional en tu backend (como auditar la consulta o añadir metadatos custom), no estás obligado a usar `->response()`:

```php
// Devuelve la instancia pura de LengthAwarePaginator o Collection de Laravel:
$users = User::apiQuery()
    ->allowedFilters(['status'])
    ->get(); // [!code focus]

// O si quieres paginación manual explícita:
$users = User::apiQuery()
    ->allowedFilters(['status'])
    ->paginate(25); // [!code focus]
```

---

## 🧭 ¿Qué sigue?

Explora las siguientes secciones de la guía para dominar cada una de las capacidades en profundidad:
- [Filtros Básicos y Comparación](./basic-filtering.md)
- [Listas y Rangos (CSV & Arrays)](./lists-and-ranges.md)
- [Búsqueda Global Concurrente](./search.md)
- [Eager Loading y Conteos](./includes-and-counts.md)
- [Integración con Frontend (qs & Axios)](../frontend/overview.md)
