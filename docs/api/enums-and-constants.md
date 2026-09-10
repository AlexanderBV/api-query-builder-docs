# Enums y Constantes 💎

El paquete utiliza tipos de primera clase para evitar cadenas mágicas en el código de tu aplicación.

---

## 1. `Operator` (Enum Respaldado en String)

Namespace: `Warrior\ApiQueryBuilder\Enums\Operator`

```php
enum Operator: string
{
    case EQUALS = 'eq';
    case NOT_EQUALS = 'neq';
    case GREATER_THAN = 'gt';
    case GREATER_THAN_OR_EQUAL = 'gte';
    case LESS_THAN = 'lt';
    case LESS_THAN_OR_EQUAL = 'lte';
    case IN = 'in';
    case NOT_IN = 'not_in';
    case BETWEEN = 'between';
    case NOT_BETWEEN = 'not_between';
    case CONTAINS = 'contains';
    case NOT_CONTAINS = 'not_contains';
    case STARTS_WITH = 'starts_with';
    case NOT_STARTS_WITH = 'not_starts_with';
    case ENDS_WITH = 'ends_with';
    case NOT_ENDS_WITH = 'not_ends_with';
    case IS_NULL = 'is_null';
    case IS_NOT_NULL = 'is_not_null';
    case IS_EMPTY = 'is_empty';
    case IS_NOT_EMPTY = 'is_not_empty';
    case DATE_EQUALS = 'date_eq';
    case DATE_BETWEEN = 'date_between';
    case YEAR = 'year';

    public static function tryFromString(string $operator): ?self;
}
```

---

## 2. `SortDirection` (Enum Respaldado en String)

Namespace: `Warrior\ApiQueryBuilder\Enums\SortDirection`

```php
enum SortDirection: string
{
    case ASC = 'asc';
    case DESC = 'desc';

    public static function fromString(?string $value, self $default = self::ASC): self;
}
```

---

## 3. `PaginationMode` (Enum Respaldado en String)

Namespace: `Warrior\ApiQueryBuilder\Enums\PaginationMode`

```php
enum PaginationMode: string
{
    case PAGE = 'page';     // LengthAwarePaginator (con COUNT)
    case SIMPLE = 'simple'; // SimplePaginator (sin COUNT)
    case CURSOR = 'cursor'; // CursorPaginator (feeds continuos)

    public static function fromString(?string $mode): self;
}
```

---

## 4. `QueryParameter` (Constantes de Clase)

Namespace: `Warrior\ApiQueryBuilder\Constants\QueryParameter`

```php
final class QueryParameter
{
    public const FILTER = 'filter';
    public const SEARCH = 'search';
    public const SORT = 'sort';
    public const INCLUDE = 'include';
    public const COUNT = 'count';
    public const ALL = 'all';
    public const PAGE = 'page';
    public const PER_PAGE = 'per_page';
    public const CURSOR = 'cursor';
    public const PAGINATION = 'pagination';

    public static function defaults(): array;
}
```

---

## 5. `LogicalOperator` (Constantes de Clase)

Namespace: `Warrior\ApiQueryBuilder\Constants\LogicalOperator`

```php
final class LogicalOperator
{
    public const AND = 'and';
    public const OR = 'or';

    public static function isLogical(string $key): bool;
}
```
