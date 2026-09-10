import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/api-query-builder-docs/',
  title: 'Laravel ApiQueryBuilder',
  description: 'Constructor declarativo y seguro de consultas API para Laravel Eloquent',
  lang: 'es-ES',
  lastUpdated: true,
  cleanUrls: true,
  vite: {
    server: {
      allowedHosts: true
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ApiQueryBuilder',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Buscar en la documentación...',
                buttonAriaLabel: 'Buscar'
              },
              modal: {
                noResultsText: 'No se encontraron resultados para',
                resetButtonTitle: 'Limpiar búsqueda',
                footer: {
                  selectText: 'para seleccionar',
                  navigateText: 'para navegar',
                  closeText: 'para cerrar'
                }
              }
            }
          }
        }
      }
    },

    nav: [
      { text: 'Guía', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'Frontend', link: '/frontend/overview', activeMatch: '/frontend/' },
      { text: 'Referencia API', link: '/api/processor', activeMatch: '/api/' },
      { text: 'Operadores', link: '/api/operators' },
      {
        text: 'v1.0.0',
        items: [
          { text: 'Repositorio GitHub', link: 'https://github.com/AlexanderBV/api-query-builder' },
          { text: 'Issues & Soporte', link: 'https://github.com/AlexanderBV/api-query-builder/issues' },
          { text: 'Packagist', link: 'https://packagist.org/packages/warrior/api-query-builder' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Primeros Pasos',
        items: [
          { text: 'Introducción & Quickstart', link: '/guide/getting-started' },
          { text: 'Configuración Global', link: '/guide/configuration' }
        ]
      },
      {
        text: 'Motor de Filtrado',
        items: [
          { text: 'Filtros Básicos y Comparación', link: '/guide/basic-filtering' },
          { text: 'Listas y Rangos (CSV & Arrays)', link: '/guide/lists-and-ranges' },
          { text: 'Texto, Nulos y Fechas', link: '/guide/text-and-dates' },
          { text: 'Relaciones y Campos JSON', link: '/guide/relations-and-json' },
          { text: 'Comodines de Productividad', link: '/guide/wildcards' },
          { text: 'Scopes Locales y Filtros Custom', link: '/guide/scopes-and-custom' },
          { text: 'Filtros por Defecto (defaultFilters)', link: '/guide/default-filters' },
          { text: 'Búsqueda Global Concurrente', link: '/guide/search' },
          { text: 'Grupos Lógicos AND / OR', link: '/guide/logical-groups' }
        ]
      },
      {
        text: 'Resultados y Rendimiento',
        items: [
          { text: 'Ordenamiento Seguro y Desempate', link: '/guide/sorting' },
          { text: 'Eager Loading y Conteos (Anti N+1)', link: '/guide/includes-and-counts' },
          { text: 'Paginación y Modo all=true', link: '/guide/pagination-and-all' }
        ]
      },
      {
        text: 'Integración Frontend',
        items: [
          { text: 'Protocolo HTTP y Serialización', link: '/frontend/overview' },
          { text: 'Recetas con React & TanStack', link: '/frontend/react' },
          { text: 'Recetas con Vue 3 & Inertia.js', link: '/frontend/vue-inertia' },
          { text: 'Manejo de Errores (HTTP 422)', link: '/frontend/error-handling' }
        ]
      },
      {
        text: 'Referencia Técnica',
        items: [
          { text: 'Clase ApiQueryBuilder', link: '/api/processor' },
          { text: 'Catálogo de 23 Operadores', link: '/api/operators' },
          { text: 'Enums y Constantes', link: '/api/enums-and-constants' },
          { text: 'Eloquent Macros', link: '/api/eloquent-macros' }
        ]
      }
    ],

    footer: {
      message: 'Liberado bajo la Licencia MIT.',
      copyright: 'Copyright © 2026 Warrior. Diseñado para la comunidad de Laravel.'
    },

    docFooter: {
      prev: 'Página anterior',
      next: 'Siguiente página'
    }
  }
})
