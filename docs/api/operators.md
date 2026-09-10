# Catálogo Completo de 23 Operadores 📊

Tabla exhaustiva de los operadores SQL soportados nativamente por el procesador (`Warrior\ApiQueryBuilder\Enums\Operator`).

---

| Operador | Nombre Enum | Significado | Ejemplo HTTP | Cláusula SQL Generada |
|---|---|---|---|---|
| `eq` | `EQUALS` | Igualdad | `?filter[status]=active` | `WHERE status = 'active'` |
| `neq` | `NOT_EQUALS` | Desigualdad | `?filter[status][neq]=archived` | `WHERE status != 'archived'` |
| `gt` | `GREATER_THAN` | Mayor estricto | `?filter[score][gt]=80` | `WHERE score > 80` |
| `gte` | `GREATER_THAN_OR_EQUAL` | Mayor o igual | `?filter[score][gte]=80` | `WHERE score >= 80` |
| `lt` | `LESS_THAN` | Menor estricto | `?filter[price][lt]=100` | `WHERE price < 100` |
| `lte` | `LESS_THAN_OR_EQUAL` | Menor o igual | `?filter[stock][lte]=5` | `WHERE stock <= 5` |
| `in` | `IN` | Pertenencia a lista | `?filter[status][in]=active,pending` | `WHERE status IN ('active', 'pending')` |
| `not_in` | `NOT_IN` | Exclusión de lista | `?filter[role][not_in]=banned` | `WHERE role NOT IN ('banned')` |
| `between` | `BETWEEN` | Rango cerrado | `?filter[score][between]=10,50` | `WHERE score BETWEEN 10 AND 50` |
| `not_between` | `NOT_BETWEEN` | Fuera de rango | `?filter[age][not_between]=18,65` | `WHERE age NOT BETWEEN 18 AND 65` |
| `contains` | `CONTAINS` | Contiene texto | `?filter[name][contains]=mar` | `WHERE name LIKE '%mar%'` |
| `not_contains`| `NOT_CONTAINS` | No contiene texto | `?filter[email][not_contains]=spam` | `WHERE email NOT LIKE '%spam%'` |
| `starts_with` | `STARTS_WITH` | Prefijo de texto | `?filter[code][starts_with]=CLI` | `WHERE code LIKE 'CLI%'` |
| `not_starts_with` | `NOT_STARTS_WITH` | No comienza con | `?filter[code][not_starts_with]=TEMP`| `WHERE code NOT LIKE 'TEMP%'` |
| `ends_with` | `ENDS_WITH` | Sufijo de texto | `?filter[email][ends_with]=@org.com` | `WHERE email LIKE '%@org.com'` |
| `not_ends_with` | `NOT_ENDS_WITH` | No termina con | `?filter[file][not_ends_with]=.pdf` | `WHERE file NOT LIKE '%.pdf'` |
| `is_null` | `IS_NULL` | Es nulo | `?filter[deleted_at][is_null]=true` | `WHERE deleted_at IS NULL` |
| `is_not_null` | `IS_NOT_NULL` | No es nulo | `?filter[verified_at][is_not_null]=1` | `WHERE verified_at IS NOT NULL` |
| `is_empty` | `IS_EMPTY` | Cadena vacía | `?filter[bio][is_empty]=true` | `WHERE bio = ''` |
| `is_not_empty`| `IS_NOT_EMPTY` | Cadena no vacía | `?filter[bio][is_not_empty]=true` | `WHERE bio != ''` |
| `date_eq` | `DATE_EQUALS` | Fecha exacta | `?filter[created_at][date_eq]=2026-05-01` | `WHERE DATE(created_at) = '2026-05-01'` |
| `date_between`| `DATE_BETWEEN` | Rango de fechas | `?filter[created_at][date_between]=2026-01-01,2026-01-31` | `WHERE DATE(created_at) >= '2026-01-01' AND DATE(created_at) <= '2026-01-31'` |
| `year` | `YEAR` | Año calendario | `?filter[created_at][year]=2026` | `WHERE YEAR(created_at) = 2026` |

::: tip Tolerancia de Formatos en Listas
Todos los operadores que esperan listas (`in`, `not_in`, `between`, `not_between`, `date_between`) aceptan tanto strings separados por comas como arrays indexados de PHP/HTTP.
:::
