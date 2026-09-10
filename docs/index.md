---
layout: home

hero:
  name: "Laravel ApiQueryBuilder"
  text: "Consultas API Declarativas para Eloquent"
  tagline: "Di adiós a los 50 ifs y wheres manuales en cada controlador. Construye APIs seguras, ultra optimizadas y listas para componentes de filtrado en React, Vue e Inertia en minutos."
  image:
    src: /logo.svg
    alt: Laravel ApiQueryBuilder
  actions:
    - theme: brand
      text: Comienza en 2 Minutos 🚀
      link: /guide/getting-started
    - theme: alt
      text: Catálogo de 23 Operadores ⚡
      link: /api/operators
    - theme: alt
      text: Ver en GitHub 📦
      link: https://github.com/AlexanderBV/api-query-builder

features:
  - icon: 🚀
    title: De 60 líneas de código a una sola
    details: Comienza con una implementación básica de 1 línea y escala agregando filtros, relaciones o búsqueda con una sintaxis fluida y elegante.
  - icon: 🛡️
    title: Seguridad Total por Lista Blanca
    details: Control estricto con allowedFilters, allowedSorts y allowedIncludes. Solo los campos expresamente autorizados pueden ser consultados.
  - icon: ⚡
    title: Cero Consultas N+1
    details: Carga anticipada inteligente (with) y conteos relacionales (withCount) bajo demanda, totalmente desacoplados de los filtros.
  - icon: 📊
    title: Modo all=true en Array Plano
    details: Devuelve arrays planos ([{...}]) para comboboxes o exportaciones, protegido con un conteo preventivo anti-OOM que cuida tu memoria RAM.
  - icon: 🔍
    title: 23 Operadores & Búsqueda Global
    details: Rangos (between), listas CSV tolerantes, comodines (*, roles.*), atributos JSON anidados y búsqueda multi-columna ILIKE/LIKE.
  - icon: 🧩
    title: Diseñado para tu Frontend
    details: Tus componentes en React, Vue, Svelte o Angular pueden serializar filtros complejos directamente con la librería estándar qs.
---

<div class="tip custom-block" style="margin-top: 2rem;">
  <p class="custom-block-title">DESARROLLAR APIS NUNCA FUE TAN RÁPIDO NI TAN LIMPIO</p>
  <p>
    ¿Cansado de llenar tus controladores con <code>if ($request->filled(...))</code>, <code>when()</code> interminables y subconsultas que vuelven lento tu sistema?
    Mira cómo evoluciona tu código con <b>ApiQueryBuilder</b>:
  </p>
</div>

::: code-group

```php [1. Implementación Básica (1 sola línea)]
// En tu controlador de Laravel:
public function index()
{
    // ¡Listo! Pagina 15 registros por defecto, ordena por id desc y retorna JSON:
    return User::apiQuery()->response();
}
```

```php [2. ¿Quieres filtros? Define qué permites]
public function index()
{
    // Tu frontend ya puede enviar ?filter[status]=active o ?filter[name][contains]=carlos:
    return User::apiQuery()
        ->allowedFilters(['name', 'status'])
        ->response();
}
```

```php [3. ¿Usas API Resources? Cero fricción]
public function index()
{
    // Transforma la salida limpiamente con tu Resource de Laravel:
    return User::apiQuery()
        ->allowedFilters(['name', 'status'])
        ->response(UserResource::class);
}
```

```php [4. CRUD de Producción Completo]
public function index()
{
    return ApiQueryBuilder::for(User::class)
        ->allowedFilters(['name', 'status', 'roles.name', 'extra_data.*'])
        ->defaultFilters(['status' => 'active'])
        ->allowedIncludes(['roles', 'department'])
        ->allowedCounts(['comments'])
        ->allowedSearch(['name', 'email'])
        ->allowedSorts(['name', 'created_at'])
        ->defaultSort('-created_at')
        ->allowAll(maxLimitOrUnlimited: 5000)
        ->response(UserResource::class);
}
```

:::
