# Laravel ApiQueryBuilder — Documentación Oficial 📚

Este repositorio contiene el código fuente de la documentación oficial de [**Laravel ApiQueryBuilder**](https://github.com/AlexanderBV/api-query-builder), construida con [VitePress](https://vitepress.dev/).

🌐 **Sitio web en vivo:** [https://alexanderbv.github.io/api-query-builder-docs/](https://alexanderbv.github.io/api-query-builder-docs/)

---

## 🚀 Desarrollo Local

Para correr la documentación localmente en tu máquina:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo con Hot Reload
npm run docs:dev
```

El sitio estará disponible en `http://localhost:5173/api-query-builder-docs/` (o el puerto que indique Vite).

---

## 🛠️ Comandos Disponibles

- `npm run docs:dev`: Inicia el servidor de desarrollo local.
- `npm run docs:build`: Compila el sitio estático optimizado para producción en `docs/.vitepress/dist`.
- `npm run docs:preview`: Previsualiza localmente el build de producción.

---

## 🚀 Despliegue

El despliegue está completamente automatizado mediante **GitHub Actions** (`.github/workflows/deploy.yml`). Cada `push` a la rama `main` compila y publica automáticamente la última versión en **GitHub Pages**.

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](https://opensource.org/licenses/MIT).
