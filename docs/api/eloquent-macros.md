# Macros de Eloquent 🪄

Para ofrecer la máxima ergonomía y una experiencia de desarrollo (*Developer Experience*) ultraligera, el paquete registra dos Macros nativas sobre Laravel Eloquent: `apiQuery()` (y su alias `apiQueryBuilder()`).

---

## 🐣 1. Macro sobre `Builder` (`apiQuery`)

Permite invocar el procesador directamente desde cualquier modelo o consulta Eloquent sin necesidad de importar la clase `ApiQueryBuilder`.

### El Ejemplo Más Simple Posible (1 línea):
```php
// En tu controlador:
return User::apiQuery()->response();
```

### Con Filtros y Resource:
```php
return User::apiQuery()
    ->allowedFilters(['name', 'status'])
    ->response(UserResource::class);
```

### Compatible con Restricciones de Tenencia (Multi-Tenant):
```php
return User::where('company_id', auth()->user()->company_id)
    ->apiQuery()
    ->allowedFilters(['name', 'role'])
    ->response();
```

---

## 🔗 2. Macro sobre `Relation` (`apiQuery`)

Permite invocar el procesador directamente sobre el método de una relación sin salir del flujo de la relación:

```php
// Listar los posts del usuario autenticado:
return auth()->user()
    ->posts()
    ->apiQuery()
    ->allowedFilters(['title', 'is_published'])
    ->allowedSorts(['created_at'])
    ->defaultSort('-created_at')
    ->response(PostResource::class);
```

### Sobre Relaciones Many-to-Many:
```php
return $team->members()
    ->apiQuery()
    ->allowedFilters(['name', 'email'])
    ->response();
```
