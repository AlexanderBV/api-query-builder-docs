# Recetas con Vue 3 & Inertia.js 💚

La combinación de **Laravel**, **Inertia.js** y **Vue 3** es una de las más populares del ecosistema moderno.

Veamos cómo implementar un componente de filtrado reactivo con preservación de estado en la URL.

---

## 🎯 Composable Reutilizable en Vue 3 (`useRestFilter`)

Este composable se sincroniza con el enrutador de Inertia o Axios:

```typescript
// composables/useRestFilter.ts
import { router } from '@inertiajs/vue3';
import { reactive, watch } from 'vue';
import debounce from 'lodash/debounce';

export function useRestFilter(baseUrl: string, initialFilters: Record<string, any> = {}) {
  const form = reactive({
    filter: { ...initialFilters },
    search: '',
    sort: '-created_at',
    page: 1,
    per_page: 15,
  });

  // Ejecutar búsqueda con debounce para no saturar la API al tipear
  const applyFilters = debounce(() => {
    router.get(baseUrl, form, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, 300);

  watch(
    () => form.filter,
    () => {
      form.page = 1;
      applyFilters();
    },
    { deep: true }
  );

  watch(
    () => form.search,
    () => {
      form.page = 1;
      applyFilters();
    }
  );

  return {
    form,
    applyFilters,
    setSort(column: string) {
      form.sort = form.sort === column ? `-${column}` : column;
      applyFilters();
    }
  };
}
```

---

## 💻 Componente Vue 3 (Single File Component)

```vue
<script setup lang="ts">
import { useRestFilter } from '@/composables/useRestFilter';

const props = defineProps<{
  users: {
    data: Array<any>;
    total: number;
    current_page: number;
    last_page: number;
  };
}>();

const { form, setSort } = useRestFilter('/users', {
  status: 'active'
});
</script>

<template>
  <div class="crud-container">
    <!-- Panel de Filtros -->
    <div class="filters-grid">
      <!-- Búsqueda Global -->
      <input
        v-model="form.search"
        type="text"
        placeholder="Buscar usuarios..."
        class="input-search"
      />

      <!-- Filtro por Estado -->
      <select v-model="form.filter.status">
        <option value="">Todos los Estados</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>

      <!-- Filtro por Rango de Edad -->
      <div class="range-inputs">
        <input
          v-model="form.filter.age.gte"
          type="number"
          placeholder="Edad mín."
        />
        <input
          v-model="form.filter.age.lte"
          type="number"
          placeholder="Edad máx."
        />
      </div>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          <th @click="setSort('id')">ID</th>
          <th @click="setSort('name')">Nombre</th>
          <th @click="setSort('created_at')">Fecha Registro</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users.data" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.created_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```
