# Filtros por Defecto (`defaultFilters`) 🔄

Un patrón de diseño esencial en el desarrollo de APIs es proporcionar **valores por defecto para la interfaz de usuario**, pero permitiendo que el cliente pueda sobrescribirlos o relajarlos libremente.

---

## 🛑 El Problema de modificar el Builder base

Muchos desarrolladores cometen el error de aplicar filtros fijos en la consulta base:

```php
// ❌ PROBLEMA: La consulta base queda permanentemente mutada
$query = User::where('status', 'active');

return ApiQueryBuilder::for($query)
    ->allowedFilters(['status'])
    ->response();
```

**Consecuencia:** Si el frontend envía `?filter[status]=inactive`, el SQL resultante será:
```sql
WHERE status = 'active' AND status = 'inactive'
```
¡La consulta devolverá 0 resultados! El usuario jamás podrá ver registros inactivos aunque tenga el selector en la UI.

---

## ✅ La Solución: `defaultFilters`

`defaultFilters` define valores de respaldo a nivel de la petición HTTP. Se inyectan **únicamente si el cliente omite el parámetro**:

```php
ApiQueryBuilder::for(User::class)
    ->allowedFilters(['name', 'status', 'role'])
    ->defaultFilters([
        'status' => 'active', // Si el cliente no manda status, asumimos active
    ])
    ->response();
```

### Comportamiento Dinámico:

#### Caso 1: El cliente entra por primera vez a la pantalla (sin parámetros)
```http
GET /api/users
```
**SQL generado:**
```sql
SELECT * FROM users WHERE (status = 'active');
```

#### Caso 2: El cliente selecciona en el filtro de la UI "Inactivos"
```http
GET /api/users?filter[status]=inactive
```
**SQL generado:**
```sql
SELECT * FROM users WHERE (status = 'inactive');
```
*El valor enviado por el cliente sobrescribe limpiamente el default.*

#### Caso 3: El cliente selecciona "Ver Todos" (desmarcando el filtro)
```http
GET /api/users?filter[status]=
```
*El procesador descarta el valor vacío y omite la cláusula, listando todos los estados.*
