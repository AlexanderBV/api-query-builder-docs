# Scopes Locales y Filtros Custom 🧩

No todos los filtros corresponden a columnas físicas directas. A menudo necesitas aplicar **lógica de negocio reutilizable**:
- "Usuarios activos"
- "Registros eliminados lógicamente (Soft Deletes)"
- "Facturas vencidas"

---

## 🐣 1. El Ejemplo Más Simple: Local Scopes por Convención

Si tu modelo Eloquent ya tiene un método de scope (por ejemplo `scopeActive`):

```php
// En tu Modelo User.php:
public function scopeActive($query): void
{
    $query->where('status', 'active')->whereNotNull('email_verified_at');
}
```

¡Solo agrega el nombre a `allowedFilters`!

```php
// En tu controlador:
return User::apiQuery()
    ->allowedFilters(['active']) // [!code focus]
    ->response();
```

### Petición HTTP:
```http
GET /api/users?filter[active]=true
```

El procesador detecta la existencia de `scopeActive()` e invoca el método automáticamente.

---

## 🗑️ 2. Manejo de Soft Deletes (`scopeTrashed`)

Para permitir que los administradores puedan ver registros eliminados lógicamente en un CRUD:

```php
// En tu Modelo:
public function scopeTrashed($query, bool $trashed = true): void
{
    if ($trashed) {
        $query->withTrashed();
    }
}
```

```php
// En tu Controlador:
return User::apiQuery()
    ->allowedFilters(['name', 'trashed'])
    ->response();
```

### Petición HTTP:
```http
GET /api/users?filter[trashed]=true
```

::: tip Normalización Booleana
El procesador convierte automáticamente valores como `'true'`, `'1'`, `'false'` o `'0'` en booleanos nativos de PHP antes de llamar a tu scope.
:::

---

## ⚡ 3. Filtros Personalizados Ad-Hoc (`Filter::custom`)

Si necesitas un filtro complejo exclusivo para una sola pantalla y no quieres contaminar tu modelo Eloquent con scopes efímeros:

```php
use Warrior\ApiQueryBuilder\Filters\Filter;

return User::apiQuery()
    ->allowedFilters([
        'name',
        
        // Filtro personalizado registrado con un Closure:
        Filter::custom('has_active_subscription', function ($query, $value) {
            if ($value) {
                $query->whereHas('subscriptions', fn($q) => $q->where('ends_at', '>', now()));
            }
        }),
    ])
    ->response();
```

### Petición HTTP:
```http
GET /api/users?filter[has_active_subscription]=true
```
El closure recibe el Query Builder y el valor enviado por el cliente, dándote control total de la consulta SQL.
