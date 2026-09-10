# Texto, Nulos y Fechas 📝

El procesador incluye operadores especializados para búsquedas de texto parcial, comprobación de nulos y consultas sobre campos temporales.

---

## 1. Operadores Textuales (Búsqueda Parcial)

El procesador detecta automáticamente el motor de base de datos en ejecución:
- En **PostgreSQL**, utiliza `ILIKE` para garantizar coincidencias insensibles a mayúsculas/minúsculas sin importar la configuración de la columna.
- En **MySQL** y **SQLite**, utiliza `LIKE`.

| Operador | Descripción | Ejemplo HTTP | Patrón SQL |
|---|---|---|---|
| `contains` | Contiene la subcadena | `?filter[name][contains]=carlos` | `LIKE '%carlos%'` |
| `not_contains` | No contiene la subcadena | `?filter[email][not_contains]=test` | `NOT LIKE '%test%'` |
| `starts_with` | Comienza con el prefijo | `?filter[sku][starts_with]=PROD-` | `LIKE 'PROD-%'` |
| `not_starts_with` | No comienza con el prefijo | `?filter[code][not_starts_with]=TEMP` | `NOT LIKE 'TEMP%'` |
| `ends_with` | Termina con el sufijo | `?filter[email][ends_with]=@gmail.com` | `LIKE '%@gmail.com'` |
| `not_ends_with` | No termina con el sufijo | `?filter[file][not_ends_with]=.pdf` | `NOT LIKE '%.pdf'` |

### Ejemplo en Acción
```http
GET /api/users?filter[email][ends_with]=@company.com&filter[name][contains]=garcia
```

**SQL generado:**
```sql
SELECT * FROM users 
WHERE (email LIKE '%@company.com' AND name LIKE '%garcia%');
```

---

## 2. Comprobación de Nulos y Vacíos

En muchas ocasiones se requiere verificar si un campo relacional o de auditoría ha sido llenado:

### `is_null` e `is_not_null`
```http
-- Usuarios que aún no han verificado su email:
GET /api/users?filter[email_verified_at][is_null]=true

-- Usuarios con verificación completada:
GET /api/users?filter[email_verified_at][is_not_null]=true
```

**SQL generado:**
```sql
SELECT * FROM users WHERE email_verified_at IS NULL;
SELECT * FROM users WHERE email_verified_at IS NOT NULL;
```

### `is_empty` e `is_not_empty`
Verifica cadenas de longitud cero (`''`):
```http
GET /api/profiles?filter[bio][is_empty]=true
GET /api/profiles?filter[bio][is_not_empty]=true
```

**SQL generado:**
```sql
SELECT * FROM profiles WHERE bio = '';
SELECT * FROM profiles WHERE bio != '';
```

---

## 3. Fechas y Calendario

Trabajar con fechas en SQL suele requerir funciones específicas del motor (`DATE()`, `YEAR()`). El procesador abstrae esto de forma estandarizada:

### Coincidencia Exacta de Fecha (`date_eq`)
Compara únicamente la parte de fecha (año, mes y día), ignorando la hora en columnas `DATETIME` o `TIMESTAMP`:

```http
GET /api/orders?filter[created_at][date_eq]=2026-05-15
```

**SQL generado (vía `whereDate` de Eloquent):**
```sql
SELECT * FROM orders WHERE DATE(created_at) = '2026-05-15';
```

### Rango de Fechas (`date_between`)
Soporta delimitar un periodo de tiempo completo con dos fechas:

```http
GET /api/invoices?filter[issue_date][date_between]=2026-01-01,2026-01-31
```

**SQL generado:**
```sql
SELECT * FROM invoices 
WHERE (DATE(issue_date) >= '2026-01-01' AND DATE(issue_date) <= '2026-01-31');
```

### Filtrado por Año (`year`)
```http
GET /api/contracts?filter[signed_at][year]=2026
```

**SQL generado (vía `whereYear` de Eloquent):**
```sql
SELECT * FROM contracts WHERE YEAR(signed_at) = 2026;
```
