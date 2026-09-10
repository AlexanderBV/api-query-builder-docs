# Ordenamiento Seguro y Desempate ↕️

El ordenamiento de registros en APIs públicas es fundamental para tablas interactivas en el frontend. **Laravel ApiQueryBuilder** ofrece ordenamiento seguro y páginas 100% deterministas.

---

## 🐣 1. Comportamiento por Defecto (Cero Configuración)

Si no configuras nada de ordenamiento:

```php
return User::apiQuery()->response();
```

El procesador aplica automáticamente **`id desc`** por defecto.
- Los registros más recientes aparecen primero.
- El orden es estable y consistente entre peticiones.

---

## 🛡️ 2. Autorizar Columnas para Ordenar (`allowedSorts`)

Para permitir que el usuario en el frontend haga clic en los encabezados de una tabla para ordenar:

```php
return User::apiQuery()
    ->allowedSorts(['name', 'created_at']) // [!code focus]
    ->response();
```

---

## 🌐 3. Peticiones desde el Frontend (Prefijo `-`)

Siguiendo la convención REST universal, la dirección se determina por la presencia del signo menos (`-`):

| Petición HTTP | Dirección | Cláusula SQL |
|---|---|---|
| `?sort=name` | Ascendente (A-Z, 0-9) | `ORDER BY name asc` |
| `?sort=-name` | Descendente (Z-A, 9-0) | `ORDER BY name desc` |

### Ordenamiento Múltiple
El cliente puede enviar múltiples columnas separadas por coma:

```http
GET /api/users?sort=-created_at,name
```

**SQL generado:**
```sql
SELECT * FROM users ORDER BY created_at desc, name asc;
```

---

## ⚙️ 4. Cambiar el Orden por Defecto (`defaultSort`)

Si quieres que este endpoint ordene por otra columna cuando el cliente no especifique `?sort`:

```php
return User::apiQuery()
    ->allowedSorts(['name', 'created_at'])
    ->defaultSort('-created_at') // [!code focus]
    ->response();
```

También puedes especificar la dirección como segundo argumento:
```php
->defaultSort('created_at', 'desc')
```

---

## 🎯 5. Desempate Determinista Automático (Primary Key Tie-Breaker)

¿Alguna vez te ha pasado que al paginar registros ordenados por `created_at`, un usuario aparece en la página 1 y vuelve a salir en la página 2?

Esto ocurre en motores SQL (MySQL, PostgreSQL) cuando varias filas tienen exactamente la misma fecha: el motor no garantiza el orden relativo de los registros idénticos entre una página y la siguiente.

### Cómo lo soluciona el procesador:
El procesador detecta automáticamente la clave primaria de tu modelo (`id`, `uuid`, etc.) y, si no fue incluida en la petición, **la añade automáticamente como último criterio de desempate**:

```sql
-- Petición del cliente: ?sort=status
SELECT * FROM users ORDER BY status asc, id desc;
```
¡Esto garantiza que cada fila tenga una posición fija e inmutable en todas las páginas!

---

## 🚫 6. Protección de V1: Rechazo de Notación de Punto en Sort

En V1, el procesador **rechaza expresamente intentos de ordenar por relaciones** (`?sort=roles.name`).

**¿Por qué?** Ordenar por relaciones exige aplicar `LEFT JOIN` que multiplican las filas del modelo principal, rompiendo los cálculos matemáticos del paginador de Laravel. Para preservar la integridad de la paginación, el ordenamiento es exclusivo sobre la tabla base.
