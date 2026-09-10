# Protocolo HTTP y Serialización en el Frontend 🌐

Una de las grandes ventajas de **Laravel ApiQueryBuilder** es que se diseñó pensando en la integración con interfaces web modernas (React, Vue, Angular, Svelte).

Para evitar tener que construir cadenas de URL a mano, la librería se alinea al 100% con la librería estándar de serialización de URLs en JavaScript: **`qs`**.

---

## 📦 Instalación de `qs` y `axios`

En tu proyecto de frontend (React, Vue, Next.js, Vite, etc.):

::: code-group

```bash [npm]
npm install qs axios
npm install -D @types/qs
```

```bash [pnpm]
pnpm add qs axios
pnpm add -D @types/qs
```

```bash [yarn]
yarn add qs axios
yarn add -D @types/qs
```

:::

---

## ⚙️ Configuración Óptima de `qs`

Para que la serialización de arrays y objetos coincida exactamente con la manera en que PHP/Laravel analiza los parámetros `$_GET`, debes configurar la opción `arrayFormat: 'indices'`:

```typescript
import qs from 'qs';

// Objeto de estado de tus filtros en el frontend:
const filterState = {
  filter: {
    status: 'active',
    score: { gte: 75 },
    'roles.name': 'Admin',
    or: [
      { status: 'trial' },
      { score: { gte: 95 } }
    ]
  },
  search: 'Carlos',
  sort: '-created_at',
  include: 'roles,department',
  page: 1,
  per_page: 25
};

// Serializar a query string:
const queryString = qs.stringify(filterState, {
  arrayFormat: 'indices',   // Vital para grupos or[0], or[1]
  encodeValuesOnly: true,   // Mantiene la URL limpia y legible
  skipNulls: true           // Omite valores nulos automáticamente
});

console.log(queryString);
// Resultado:
// filter[status]=active&filter[score][gte]=75&filter[roles.name]=Admin&filter[or][0][status]=trial&filter[or][1][score][gte]=95&search=Carlos&sort=-created_at&include=roles,department&page=1&per_page=25
```

---

## 🚀 Integración con Cliente Axios Global

Puedes configurar Axios para que utilice `qs` de forma transparente en todas tus llamadas API:

```typescript
import axios from 'axios';
import qs from 'qs';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      arrayFormat: 'indices',
      encodeValuesOnly: true,
      skipNulls: true
    });
  }
});
```

Ahora, en cualquier componente o servicio, simplemente pasas el objeto directamente:

```typescript
// En tu componente:
const fetchUsers = async (filters: Record<string, any>) => {
  const response = await apiClient.get('/users', {
    params: {
      filter: filters,
      search: searchQuery,
      sort: currentSort,
      page: currentPage
    }
  });

  return response.data;
};
```
