# Filtros Básicos y Comparación 🎯

El filtrado en **Laravel ApiQueryBuilder** sigue el principio de **máxima simplicidad primero**: puedes comenzar autorizando un solo campo y entender cómo funciona en 30 segundos.

---

## 🐣 1. El Ejemplo Más Simple

Para permitir que el frontend filtre por una columna (por ejemplo, el estado de un usuario), solo necesitas pasar el nombre del campo a `allowedFilters`:

```php
// En tu controlador:
return User::apiQuery()
    ->allowedFilters(['status'])
    ->response();
```

### Petición HTTP desde el Cliente:
```http
GET /api/users?filter[status]=active
```

**SQL generado automáticamente:**
```sql
SELECT * FROM users WHERE (status = 'active') ORDER BY id desc LIMIT 15;
```

¡Eso es todo! No necesitas escribir `where`, ni validar si el parámetro vino en la petición.

---

## 🛡️ 2. Seguridad: Lista Blanca Estricta

Por motivos de seguridad, **ningún campo que no esté explícitamente en `allowedFilters` puede ser filtrado**:

```php
return User::apiQuery()
    ->allowedFilters(['name', 'status', 'email'])
    ->response();
```

Si un cliente intenta consultar una columna confidencial o no autorizada:
```http
GET /api/users?filter[password_hash]=secret
```

El procesador detiene la petición de inmediato con un error estándar **HTTP 422 (Unprocessable Entity)**:
```json
{
  "message": "El filtro 'password_hash' no está autorizado para este recurso.",
  "errors": {
    "filter.password_hash": [
      "El filtro 'password_hash' no está autorizado para este recurso."
    ]
  }
}
```

---

## ⚡ 3. Operadores de Igualdad y Desigualdad

El cliente puede consultar valores exactos o excluirlos:

### Igualdad Implícita (o Explícita con `eq`)
Ambas peticiones producen el mismo resultado:
```http
GET /api/users?filter[status]=active
GET /api/users?filter[status][eq]=active
```
**SQL:** `WHERE status = 'active'`

### Desigualdad (`neq`)
Para excluir un valor:
```http
GET /api/users?filter[status][neq]=archived
```
**SQL:** `WHERE status != 'archived'`

---

## 🔢 4. Operadores Numéricos y de Comparación

Para campos cuantitativos (precios, edades, cantidades, puntuaciones), el procesador incluye 4 operadores directos:

| Operador | Significado | Ejemplo HTTP | Cláusula SQL |
|---|---|---|---|
| `gt` | Mayor que (`>`) | `?filter[age][gt]=18` | `WHERE age > 18` |
| `gte` | Mayor o igual (`>=`) | `?filter[score][gte]=80` | `WHERE score >= 80` |
| `lt` | Menor que (`<`) | `?filter[price][lt]=100` | `WHERE price < 100` |
| `lte` | Menor o igual (`<=`) | `?filter[stock][lte]=5` | `WHERE stock <= 5` |

---

## 🎚️ 5. Combinando Múltiples Operadores en el Mismo Campo

Un caso habitual en formularios de búsqueda es cuando el usuario filtra por un rango numérico mínimo y máximo:

```http
GET /api/products?filter[price][gte]=10&filter[price][lte]=50
```

**SQL generado:**
```sql
SELECT * FROM products WHERE (price >= 10 AND price <= 50);
```

::: tip Flexibilidad para la UI
Si el usuario en la interfaz solo define "Desde $10" y deja el precio máximo en blanco, el frontend simplemente envía `?filter[price][gte]=10`. Funciona como un rango semi-abierto perfecto sin fallar.
:::

---

## 🧹 6. Descarte Automático de Cadenas Vacías

En las interfaces web, cuando un usuario deselecciona una opción en un `<select>` o limpia un `<input>`, el navegador suele enviar cadenas vacías:
```http
GET /api/users?filter[status]=&filter[name]=
```

El procesador detecta automáticamente los valores vacíos (`''` o `null`) y **los descarta limpiamente**, evitando que se ejecute un `WHERE status = ''` involuntario.
