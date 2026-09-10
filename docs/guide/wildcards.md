# Comodines de Productividad (`*`) ⚡

En etapas iniciales de desarrollo o en tablas con 20 o 30 columnas, tener que escribir cada nombre en `allowedFilters` puede restar agilidad.

Para ofrecer la mejor experiencia al desarrollador, **ApiQueryBuilder** soporta tres tipos de comodines (*wildcards*):

---

## 🐣 1. El Ejemplo Más Rápido: Comodín Global (`*`)

Autoriza **todas las columnas directas** de la tabla base con un solo carácter:

```php
// En tu controlador:
return User::apiQuery()
    ->allowedFilters(['*']) // [!code focus]
    ->response();
```

### Peticiones Permitidas de Inmediato:
El cliente puede filtrar por cualquier columna de la tabla `users`:
```http
GET /api/users?filter[name]=Carlos
GET /api/users?filter[email]=carlos@mail.com
GET /api/users?filter[status]=active
GET /api/users?filter[city]=Madrid
```

::: warning Seguridad: No Expone Relaciones
El comodín `*` **solo autoriza columnas directas** (sin punto). Si un cliente intenta solicitar `?filter[roles.name]=Admin`, el procesador lo rechazará con **HTTP 422** porque las relaciones requieren autorización explícita para evitar consultas no deseadas.
:::

---

## 🔗 2. Comodín de Relación (`roles.*`)

Si tienes una relación y quieres permitir que el frontend filtre por cualquier campo de esa tabla sin listarlos uno a uno:

```php
return User::apiQuery()
    ->allowedFilters([
        'status',
        'roles.*', // Autoriza cualquier columna de la relación roles // [!code focus]
    ])
    ->response();
```

### Peticiones Permitidas:
```http
GET /api/users?filter[roles.name]=Admin
GET /api/users?filter[roles.code]=ADM
GET /api/users?filter[roles.is_active]=true
```

---

## 📄 3. Comodín de Columna JSON (`metadata.*`)

Para columnas JSON con estructuras dinámicas y cambiantes:

```php
return Customer::apiQuery()
    ->allowedFilters([
        'name',
        'metadata.*', // Autoriza cualquier propiedad dentro de metadata // [!code focus]
    ])
    ->response();
```

### Peticiones Permitidas:
```http
GET /api/customers?filter[metadata.preferences.theme]=dark
GET /api/customers?filter[metadata.billing.tax_id]=12345
```
