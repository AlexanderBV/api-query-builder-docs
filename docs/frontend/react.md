# Recetas con React & TanStack Table ⚛️

En este tutorial aprenderás a conectar un componente de tabla o catálogo en **React** con **TanStack Query** (React Query) y **TanStack Table**, delegando todo el filtrado, paginación y ordenamiento a **Laravel ApiQueryBuilder**.

---

## 🛠️ Hook Personalizado: `useRestQuery`

Un hook reutilizable para consumir endpoints gobernados por el procesador:

```tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import qs from 'qs';
import { useState } from 'react';

interface RestParams {
  filter?: Record<string, any>;
  search?: string;
  sort?: string;
  include?: string;
  page?: number;
  per_page?: number;
  all?: boolean;
}

export function useRestQuery<T>(endpoint: string, initialParams: RestParams = {}) {
  const [params, setParams] = useState<RestParams>({
    page: 1,
    per_page: 15,
    ...initialParams
  });

  const query = useQuery({
    queryKey: [endpoint, params],
    queryFn: async () => {
      const response = await axios.get(endpoint, {
        params,
        paramsSerializer: (p) => qs.stringify(p, {
          arrayFormat: 'indices',
          encodeValuesOnly: true,
          skipNulls: true
        })
      });
      return response.data;
    }
  });

  return {
    ...query,
    params,
    setParams,
    setFilter: (field: string, value: any) => {
      setParams((prev) => ({
        ...prev,
        page: 1, // Reiniciar a página 1 al filtrar
        filter: { ...prev.filter, [field]: value }
      }));
    },
    setSearch: (term: string) => {
      setParams((prev) => ({ ...prev, page: 1, search: term }));
    },
    setSort: (column: string, isDesc: boolean) => {
      setParams((prev) => ({
        ...prev,
        sort: isDesc ? `-${column}` : column
      }));
    }
  };
}
```

---

## 💻 Componente de Tabla con Filtros en React

```tsx
import React from 'react';
import { useRestQuery } from './useRestQuery';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  roles?: Array<{ id: number; name: string }>;
}

export function UserListTable() {
  const {
    data,
    isLoading,
    isError,
    error,
    params,
    setFilter,
    setSearch,
    setSort,
    setParams
  } = useRestQuery<{ data: User[]; total: number }>('/api/users', {
    include: 'roles',
    sort: '-created_at'
  });

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (isError) return <div>Error al cargar: {(error as any).message}</div>;

  return (
    <div className="table-container">
      {/* Barra de Filtros */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilter('status', e.target.value)}>
          <option value="">Todos los Estados</option>
          <option value="active">Activos</option>
          <option value="pending">Pendientes</option>
          <option value="suspended">Suspendidos</option>
        </select>

        <select onChange={(e) => setFilter('roles.name', e.target.value)}>
          <option value="">Todos los Roles</option>
          <option value="Admin">Administradores</option>
          <option value="Editor">Editores</option>
        </select>
      </div>

      {/* Tabla */}
      <table>
        <thead>
          <tr>
            <th onClick={() => setSort('id', params.sort === 'id')}>ID</th>
            <th onClick={() => setSort('name', params.sort === 'name')}>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className={`badge ${user.status}`}>{user.status}</span></td>
              <td>{user.roles?.map((r) => r.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginador */}
      <div className="pagination">
        <button
          disabled={params.page === 1}
          onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) - 1 }))}
        >
          Anterior
        </button>
        <span>Página {params.page}</span>
        <button
          onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
```
