# Eager Loading y Conteos (Anti N+1) ⚡

El problema de las consultas $N+1$ ocurre cuando el backend ejecuta una consulta para obtener 15 usuarios y luego 15 consultas adicionales para obtener los roles de cada usuario.

**Laravel ApiQueryBuilder** separa de forma estricta el filtrado (`whereHas`) de la carga de datos (`with`), permitiendo que el frontend pida relaciones bajo demanda sin riesgo de $N+1$.

---

## 🐣 1. El Ejemplo Más Simple con `allowedIncludes`

Autoriza qué relaciones puede solicitar el cliente:

```php
// En tu controlador:
return User::apiQuery()
    ->allowedIncludes(['roles']) // [!code focus]
    ->response();
```

### Petición HTTP desde el Cliente:
```http
GET /api/users?include=roles
```

### Consultas SQL Ejecutadas:
```sql
-- 1. Obtiene los usuarios:
SELECT * FROM users ORDER BY id desc LIMIT 15;

-- 2. Obtiene los roles en UNA sola consulta adicional sin importar cuántos usuarios haya:
SELECT * FROM roles WHERE id IN (1, 2, 3);
```
¡$N+1$ erradicado de raíz!

---

## 🔗 2. Múltiples Relaciones y Relaciones Anidadas

Puedes autorizar varias relaciones directas o anidadas con notación de punto:

```php
return User::apiQuery()
    ->allowedIncludes([
        'roles',
        'department',
        'roles.permissions', // Relación anidada
    ])
    ->response();
```

### Petición HTTP:
```http
GET /api/users?include=roles,department
```

::: warning Seguridad
Si un cliente intenta incluir una relación no autorizada (por ejemplo, `?include=bankAccounts`), el procesador responderá con un error **HTTP 422**.
:::

---

## 🔢 3. Conteos Agregados con `allowedCounts`

Muchas veces en la interfaz solo necesitas mostrar un número (por ejemplo, cuántos posts o comentarios tiene un usuario), sin necesidad de descargar todos los registros a memoria.

Eloquent ofrece el método optimizado `withCount()` para esto.

### Configuración en el Controlador:
```php
return User::apiQuery()
    ->allowedCounts(['posts', 'comments']) // [!code focus]
    ->response();
```

### Petición HTTP:
```http
GET /api/users?count=posts,comments
```

### SQL Generado (Inyección de Subconsultas Virtuales):
```sql
SELECT users.*,
    (SELECT COUNT(*) FROM posts WHERE posts.user_id = users.id) AS posts_count,
    (SELECT COUNT(*) FROM comments WHERE comments.user_id = users.id) AS comments_count
FROM users LIMIT 15;
```

### Respuesta JSON:
```json
{
  "id": 1,
  "name": "Carlos",
  "posts_count": 14,
  "comments_count": 52
}
```

---

## 🎯 4. Combinando Inclusiones y Conteos

Puedes combinar libremente ambos parámetros en una sola petición:

```http
GET /api/users?include=roles&count=posts
```
*Hidrata la relación `roles` y calcula el atributo virtual `posts_count` en una única llamada.*
