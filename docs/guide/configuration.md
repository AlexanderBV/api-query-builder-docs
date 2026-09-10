# Configuración Global ⚙️

El archivo de configuración `config/api-query-builder.php` te permite gobernar los nombres de parámetros HTTP, las políticas de ordenamiento por defecto, los límites de paginación y las salvaguardas de memoria en toda tu aplicación.

---

## 📄 Archivo `config/api-query-builder.php`

Tras ejecutar `php artisan vendor:publish --tag="api-query-builder-config"`, encontrarás el siguiente archivo:

```php
<?php

declare(strict_types=1);

use Warrior\ApiQueryBuilder\Constants\QueryParameter;
use Warrior\ApiQueryBuilder\Enums\SortDirection;

return [

    /*
    |--------------------------------------------------------------------------
    | Nombres de Parámetros HTTP
    |--------------------------------------------------------------------------
    |
    | Define las claves de query string que el procesador escucha en las
    | peticiones entrantes. Puedes adaptarlas a las convenciones de tu empresa.
    |
    */
    'parameters' => [
        'filter'     => 'filter',     // ?filter[status]=active
        'search'     => 'search',     // ?search=termino
        'sort'       => 'sort',       // ?sort=-created_at,name
        'include'    => 'include',    // ?include=roles,department
        'count'      => 'count',      // ?count=comments,orders
        'all'        => 'all',        // ?all=true
        'page'       => 'page',       // ?page=2
        'per_page'   => 'per_page',   // ?per_page=50
        'cursor'     => 'cursor',     // ?cursor=eyJpZCI6MTB9
        'pagination' => 'pagination', // ?pagination=simple
    ],

    /*
    |--------------------------------------------------------------------------
    | Ordenamiento por Defecto y Desempate
    |--------------------------------------------------------------------------
    |
    | Cuando el cliente no envía el parámetro 'sort', el procesador aplicará
    | este orden base. La clave primaria siempre se aplica como desempate final.
    |
    */
    'sort' => [
        'default_column'    => 'id',
        'default_direction' => SortDirection::DESC->value, // 'desc' o 'asc'
    ],

    /*
    |--------------------------------------------------------------------------
    | Paginación
    |--------------------------------------------------------------------------
    |
    | Límites aplicables a la paginación estándar de Laravel.
    |
    */
    'pagination' => [
        'default_size' => 15,
        'max_size'     => 100, // Máximo permitido por ?per_page
    ],

    /*
    |--------------------------------------------------------------------------
    | Recuperación Total (all=true) y Salvaguarda de Memoria
    |--------------------------------------------------------------------------
    |
    | Para evitar desbordamientos de memoria (Out Of Memory / DoS), la
    | recuperación completa requiere autorización explícita (->allowAll())
    | y está acotada por 'max_limit'.
    |
    */
    'all' => [
        'enabled_by_default' => false,
        'max_limit'          => 5000,
    ],

];
```

---

## 🔒 Salvaguarda Anti-OOM (Out Of Memory)

Una de las características más críticas de la librería es la protección contra ataques de Denegación de Servicio (DoS) o errores de memoria por descuidos en el frontend:

1. **Desactivado por defecto:** Si un cliente envía `?all=true` a un endpoint que no invocó explícitamente `->allowAll()`, la librería responde inmediatamente con **HTTP 422**:
   ```json
   {
     "message": "La recuperación total de registros (all=true) no está permitida para este recurso.",
     "errors": {
       "all": [
         "La recuperación total de registros (all=true) no está permitida para este recurso."
       ]
     }
   }
   ```
2. **Conteo Preventivo:** Cuando `->allowAll()` está habilitado, el procesador ejecuta primero un `COUNT(*)` optimizado. Si la tabla contiene más registros que `maxAllLimit` (por ejemplo, 10,000 filas frente a un límite de 5,000), el procesador aborta con **HTTP 422** antes de que PHP intente hidratar 10,000 modelos en la memoria RAM.

---

## 🎯 Sobrescritura Local en Controladores

Toda la configuración global puede ser sobrescrita en un endpoint específico según las necesidades del negocio:

```php
ApiQueryBuilder::for(Product::class)
    // Sobrescribir orden por defecto:
    ->defaultSort('sku', 'asc')

    // Permitir all=true con un límite estricto de 500 registros:
    ->allowAll(maxLimitOrUnlimited: 500)

    // O permitir all=true sin límite (precaución):
    ->allowAll(maxLimitOrUnlimited: true)
    
    ->response();
```
