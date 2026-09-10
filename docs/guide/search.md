# Búsqueda Global Concurrente 🔍

La mayoría de tablas en aplicaciones web tienen un campo de texto único para buscar rápidamente sobre múltiples columnas al mismo tiempo ("Quick Search").

---

## 🐣 1. El Ejemplo Más Simple

Solo define qué columnas pueden ser buscadas con `allowedSearch`:

```php
// En tu controlador:
return User::apiQuery()
    ->allowedSearch(['name']) // [!code focus]
    ->response();
```

### Petición HTTP desde el Cliente:
```http
GET /api/users?search=Carlos
```

**SQL generado automáticamente:**
```sql
SELECT * FROM users WHERE (name LIKE '%Carlos%') ORDER BY id desc LIMIT 15;
```

---

## 🚀 2. Búsqueda Concurrente sobre Múltiples Columnas

Para buscar simultáneamente en el nombre, el correo o los roles de usuario:

```php
return User::apiQuery()
    ->allowedSearch([
        'name',
        'email',
        'roles.name', // También busca a través de relaciones
    ])
    ->response();
```

### Petición HTTP:
```http
GET /api/users?search=Carlos
```

### SQL Generado (Agrupación con Paréntesis `WHERE`):
```sql
SELECT * FROM users
WHERE (
    name LIKE '%Carlos%'
    OR email LIKE '%Carlos%'
    OR EXISTS (
        SELECT 1 FROM roles
        INNER JOIN role_user ON roles.id = role_user.role_id
        WHERE role_user.user_id = users.id
          AND roles.name LIKE '%Carlos%'
    )
);
```

::: tip Preservación de Seguridad y Multi-Tenant
Todas las alternativas `OR` se encapsulan estrictamente dentro de un único grupo paréntesis `WHERE (A OR B OR C)`. Jamás corrompen filtros previos ni restricciones de seguridad de tu modelo (como `company_id = 5`).
:::

---

## ⚡ 3. Detección Inteligente del Motor de BD

- En **PostgreSQL**, el procesador utiliza automáticamente `ILIKE` para garantizar búsquedas insensibles a mayúsculas/minúsculas sin importar la configuración de la columna.
- En **MySQL** y **SQLite**, utiliza `LIKE`.

---

## 🛡️ 4. Mitigación de Ataques DoS

Para proteger tu base de datos contra peticiones abusivas con cadenas de búsqueda gigantescas:
- El término de búsqueda tiene una longitud máxima permitida de **200 caracteres** (`SearchPipe::MAX_TERM_LENGTH`).
- Si un cliente envía un texto de mayor longitud, el procesador aborta con **HTTP 422**.
- Si el cliente envía `?search=algo` a un endpoint que no configuró `allowedSearch`, se responde con **HTTP 422**.
