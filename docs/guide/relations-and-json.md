# Relaciones y Campos JSON 🔗

En aplicaciones modernas construidas sobre Eloquent, filtrar a través de modelos relacionados o propiedades dentro de columnas JSON es imprescindible.

---

## 🐣 1. El Ejemplo Más Simple: Filtro Relacional

Para filtrar registros principales basándote en una relación, utiliza la **notación de punto** (`relacion.columna`):

```php
// En tu controlador:
return User::apiQuery()
    ->allowedFilters(['roles.name']) // [!code focus]
    ->response();
```

### Petición HTTP desde el Cliente:
```http
GET /api/users?filter[roles.name]=Admin
```

### SQL Generado (Aislamiento con `whereHas`):
El procesador detecta automáticamente la relación `roles` en el modelo `User` y genera una subconsulta segura:

```sql
SELECT * FROM users
WHERE EXISTS (
    SELECT 1 FROM roles
    INNER JOIN role_user ON roles.id = role_user.role_id
    WHERE role_user.user_id = users.id
      AND roles.name = 'Admin'
);
```

::: tip ¿Por qué `whereHas` en vez de `JOIN`?
Un `JOIN` multiplicaría las filas del usuario (un usuario con 3 roles saldría 3 veces), destrozando el conteo de la paginación. La subconsulta `whereHas` garantiza que cada usuario aparezca una sola vez y preserva la integridad del paginador.
:::

---

## 🚀 2. Filtros sobre Columnas JSON (`->`)

Laravel Eloquent permite consultar atributos dentro de columnas `JSON` con la sintaxis de flecha (ej: `extra_data->settings->theme`).

En URLs HTTP, es mucho más limpio y estándar usar notación de punto (`extra_data.settings.theme`).

**ApiQueryBuilder traduce automáticamente los puntos a sintaxis de flecha JSON:**

### Configuración en el Controlador:
```php
return User::apiQuery()
    ->allowedFilters([
        'settings.theme',        // Columna JSON settings -> propiedad theme
        'metadata.client.code',  // Columna JSON metadata -> client -> code
    ])
    ->response();
```

### Peticiones HTTP:
```http
GET /api/users?filter[settings.theme]=dark
GET /api/users?filter[metadata.client.code]=VIP-001
```

### SQL Generado:
```sql
SELECT * FROM users WHERE settings->'theme' = 'dark';
SELECT * FROM users WHERE metadata->'client'->'code' = 'VIP-001';
```

---

## ⚡ 3. Operadores Avanzados en Relaciones y JSON

Los filtros relacionales y JSON admiten **exactamente los mismos 23 operadores** que las columnas normales:

```http
-- Usuarios con rol que comience por "Super":
GET /api/users?filter[roles.name][starts_with]=Super

-- Documentos con total en JSON entre 100 y 500:
GET /api/documents?filter[payload.totals.amount][between]=100,500
```
