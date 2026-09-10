# Paginación y Modo all=true 📄

La gestión de paginación en **Laravel ApiQueryBuilder** ofrece flexibilidad total: desde paginación automática sin escribir nada, pasando por paginación rápida para grandes volúmenes, hasta la recuperación total sin paginar (`all=true`) entregada en un **array plano**.

---

## 🐣 1. Paginación por Defecto (Cero Configuración)

No necesitas configurar nada para que la paginación funcione:

```php
return User::apiQuery()->response();
```

Por defecto, el procesador pagina **15 elementos por página** utilizando el paginador estándar de Laravel (`LengthAwarePaginator`).

### El cliente puede navegar enviando:
```http
GET /api/users?page=2
GET /api/users?page=3&per_page=50
```

### Respuesta JSON Típica de Laravel:
```json
{
  "data": [
    { "id": 16, "name": "..." },
    { "id": 17, "name": "..." }
  ],
  "current_page": 2,
  "first_page_url": "http://api.test/api/users?page=1",
  "from": 16,
  "last_page": 10,
  "per_page": 15,
  "to": 30,
  "total": 150
}
```

---

## 🚀 2. Modos Alternativos de Paginación (`?pagination=`)

El cliente puede seleccionar la estrategia de paginación enviando el parámetro `pagination`:

### A. Paginación Simple (`?pagination=simple`)
Ideal para tablas con *scroll* infinito o apps móviles que no necesitan saber cuántas páginas existen en total, ahorrando el costo de la consulta `COUNT(*)`:

```http
GET /api/users?pagination=simple&page=2
```
*Utiliza `simplePaginate()` internamente.*

### B. Paginación por Cursor (`?pagination=cursor`)
Ideal para feeds de alto tráfico con millones de filas, evitando duplicados si entran registros nuevos mientras el usuario hace scroll:

```http
GET /api/users?pagination=cursor&per_page=20
```
*Utiliza `cursorPaginate()` internamente.*

---

## 📦 3. Recuperación Total sin Paginar (`?all=true`)

En selectores desplegables (*combobox* / *dropdowns*), exportaciones o listados completos, el frontend necesita recibir **todos los registros de una vez**.

### Paso 1: Habilitar en el Endpoint
Por motivos de seguridad y estabilidad, `all=true` está apagado por defecto. Debes autorizarlo explícitamente:

```php
return Department::apiQuery()
    ->allowAll(maxLimitOrUnlimited: 2000) // Límite máximo de seguridad // [!code focus]
    ->response();
```

### Paso 2: Petición desde el Frontend
```http
GET /api/departments?all=true
```

### Respuesta: Array Plano Directo
A diferencia de la paginación, cuando se solicita `all=true` el procesador devuelve un **array plano de objetos**, sin envoltorios ni metadatos:

```json
[
  { "id": 1, "name": "Recursos Humanos" },
  { "id": 2, "name": "Ingeniería" },
  { "id": 3, "name": "Ventas" }
]
```

Si utilizas un API Resource (`->response(DepartmentResource::class)`), la respuesta mantiene el array plano formateado por el Resource:

```json
[
  { "id": 1, "department_name": "Recursos Humanos" },
  { "id": 2, "department_name": "Ingeniería" }
]
```

---

## 🛡️ 4. Salvaguarda de Memoria Anti-OOM (Out Of Memory)

Si un endpoint tiene `->allowAll(5000)` pero la tabla contiene 15,000 registros:
- El procesador ejecuta primero un `COUNT(*)` ligero.
- Si el conteo supera el límite de seguridad, aborta inmediatamente con **HTTP 422**:
```json
{
  "message": "El total de registros (15000) excede el límite máximo permitido para all=true (5000).",
  "errors": {
    "all": [
      "El total de registros (15000) excede el límite máximo permitido para all=true (5000)."
    ]
  }
}
```
¡Tu servidor jamás sufrirá una caída por desbordamiento de memoria RAM!
