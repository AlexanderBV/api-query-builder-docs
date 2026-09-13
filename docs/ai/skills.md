---
title: Agentes de IA & Skills (Cursor, Claude, Gemini, Antigravity)
description: Suite oficial de skills, reglas e instrucciones para Agentes de IA (Cursor, Claude Code, Gemini CLI, Antigravity, Windsurf) para Laravel ApiQueryBuilder.
---

# 🤖 Agentes de IA & Skills Oficiales

Construye endpoints de API de alto rendimiento en Laravel asistido por Inteligencia Artificial sin errores de sintaxis, consultas $N+1$ accidentales o brechas de seguridad en parámetros de consulta.

El paquete oficial [**`api-query-builder-skills`**](https://github.com/AlexanderBV/api-query-builder-skills) proporciona instrucciones formales, contratos de evaluación, directivas para prompts y ejemplos del mundo real para que tu asistente de IA (Cursor, Claude Code, Gemini CLI, Google Antigravity, Windsurf) aproveche al 100% las capacidades de [**`warrior/api-query-builder`**](https://github.com/AlexanderBV/api-query-builder).

---

## 📦 Repositorio Oficial

El código fuente de las skills, suites de evaluación y reglas de contexto está disponible públicamente en GitHub:

👉 [**GitHub: AlexanderBV/api-query-builder-skills**](https://github.com/AlexanderBV/api-query-builder-skills)

```text
rest-procesor-skills/
├── skills/
│   └── api-query-builder/
│       ├── SKILL.md                  # Skill principal con frontmatter YAML
│       ├── references/
│       │   ├── operators.md          # Catálogo detallado de los 23 operadores SQL
│       │   ├── frontend-guide.md     # Guía de serialización frontend con qs, React y Vue
│       │   └── architecture.md       # Arquitectura interna de Pipes y Ciclo de Vida
│       └── examples/
│           ├── UserController.php    # Ejemplo completo de controlador CRUD empresarial
│           └── OrderController.php   # Ejemplo con JSON, rangos, fechas y grupos OR
├── rules/
│   ├── AGENTS.md                     # Estándar universal para agentes autónomos
│   ├── CLAUDE.md                     # Instrucciones específicas para Claude Code
│   └── .cursorrules                  # Reglas para Cursor IDE y Windsurf
├── scripts/
│   └── run-tests.sh                  # Runner de pruebas automatizadas
└── tests/
    ├── validate_skill.php            # Validador automatizado de sintaxis y consistencia
    └── evals/                        # Suite de evaluación con prompts y casos de prueba
```

---

## 🚀 Guía de Instalación Rápida

### 1. Google Gemini CLI / Google Antigravity

Si utilizas el ecosistema de agentes de Google (Gemini Code Assist, Antigravity CLI o extensiones de terminal):

::: code-group
```bash [Global (Recomendado)]
# Clona e instala la skill globalmente en tu máquina:
git clone https://github.com/AlexanderBV/api-query-builder-skills.git /tmp/api-query-builder-skills
mkdir -p ~/.gemini/config/skills
cp -r /tmp/api-query-builder-skills/skills/api-query-builder ~/.gemini/config/skills/
```

```bash [Por Proyecto]
# O instálalo en el directorio .agents de tu proyecto Laravel:
mkdir -p .agents/skills
git clone https://github.com/AlexanderBV/api-query-builder-skills.git .agents/skills/api-query-builder-skills
```
:::

Una vez instalada, el agente activará automáticamente la skill en cuanto le pidas crear o refactorizar controladores con filtros, búsqueda, ordenamiento, eager loading o paginación en Laravel.

---

### 2. Cursor IDE & Windsurf

Para que Cursor o Windsurf generen controladores impecables sin consultas manuales redundantes:

1. Clona o descarga el archivo [`.cursorrules`](https://github.com/AlexanderBV/api-query-builder-skills/blob/main/rules/.cursorrules).
2. Cópialo en la raíz de tu proyecto Laravel:

```bash
curl -o .cursorrules https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/rules/.cursorrules
```

O anéxalo a tu archivo `.cursorrules` existente.

---

### 3. Claude Code / Anthropic CLI

Para desarrolladores que utilizan Claude Code en la consola:

1. Descarga el archivo [`CLAUDE.md`](https://github.com/AlexanderBV/api-query-builder-skills/blob/main/rules/CLAUDE.md) en la raíz del proyecto:

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/rules/CLAUDE.md
```

Claude Code comprenderá de inmediato:
- El uso del macro `Model::apiQuery($request)`.
- El uso imperativo de `defaultFilters()` en vez de mutar el query base con `User::where(...)`.
- La prohibición de ordenar por columnas de relación para evitar colapsar la paginación de SQL.
- El manejo automático de errores con `ProcessorValidationException` (HTTP 422).

---

### 4. GitHub Copilot & Agentes Universales (`AGENTS.md`)

El archivo [`AGENTS.md`](https://github.com/AlexanderBV/api-query-builder-skills/blob/main/rules/AGENTS.md) provee instrucciones estandarizadas para cualquier LLM:

```bash
curl -o AGENTS.md https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/rules/AGENTS.md
```

---

## 🎯 ¿Qué Aprende el Agente de IA con esta Skill?

| Sin la Skill ❌ | Con ApiQueryBuilder Skill ✅ |
| :--- | :--- |
| Escribe decenas de bloques `if ($request->filled('...'))` | Escribe una sola cadena fluida declarativa con `allowedFilters([...])` |
| Hace `with('relacion')` indiscriminado causando problemas de rendimiento | Utiliza `allowedIncludes([...])` y `allowedCounts([...])` bajo demanda |
| Muta la consulta base con `$query = User::where('status', 'active')` | Usa `defaultFilters(['status' => 'active'])` preservando la inmutabilidad |
| Intenta ordenar por tablas foráneas (`roles.name`) rompiendo `limit`/`offset` | Restringe ordenamientos a columnas base con desempate determinista de PK |
| Intenta escribir SQL manual para búsquedas multi-columna | Usa `allowedSearch(['name', 'email', 'sku'])` seguro y optimizado |

---

## 💡 Ejemplos de Prompts Listos para Usar

### Ejemplo 1: Controlador de Productos con Filtros y Conteos
> *"Crea un método index() en ProductController con ApiQueryBuilder que permita filtrar por status, categoría (relation: category.slug), rango de precio, búsqueda en name y sku, y conteo de reviews bajo demanda."*

### Ejemplo 2: Endpoint Empresarial con Filtros por Defecto
> *"Configura un OrderController en Laravel donde por defecto sólo se listen órdenes con status 'pending', pero si el cliente envía un filtro explícito de status, se respete su selección. Limita la paginación a 25 registros o permite ?all=true hasta 1000 registros."*

### Ejemplo 3: Serialización Frontend con Vue 3
> *"Escribe una función de consulta con Axios y qs en Vue 3 que serialice filtros con operador 'between' de fechas y un orden descendente por created_at para ApiQueryBuilder."*

---

## 🧪 Pruebas de Consistencia Automatizadas

El repositorio incluye una suite automatizada para validar la integridad de la documentación, ejemplos de código y contratos:

```bash
bash scripts/run-tests.sh
```

Salida esperada:
```text
=== Running ApiQueryBuilder Skill Verification Suite ===

✅ PASS: SKILL.md exists
✅ PASS: SKILL.md has valid name in frontmatter
✅ PASS: SKILL.md has description block in frontmatter
✅ PASS: SKILL.md does NOT contain deprecated term 'RestProcessor'
✅ PASS: SKILL.md does NOT contain deprecated term 'processRest'
✅ PASS: SKILL.md does NOT contain deprecated term 'rest-processor'
✅ PASS: Referenced file 'references/operators.md' exists
✅ PASS: Referenced file 'references/frontend-guide.md' exists
✅ PASS: Referenced file 'references/architecture.md' exists
✅ PASS: Referenced file 'examples/UserController.php' exists
✅ PASS: Referenced file 'examples/OrderController.php' exists
✅ PASS: PHP syntax check passes for UserController.php
✅ PASS: PHP syntax check passes for OrderController.php
✅ PASS: Rule / Eval file 'AGENTS.md' exists
✅ PASS: Rule / Eval file 'CLAUDE.md' exists
✅ PASS: Rule / Eval file '.cursorrules' exists
✅ PASS: Rule / Eval file 'test_cases.json' exists

--------------------------------------------------
Results: 17 assertions passed.
🎉 ALL CHECKS PASSED SUCCESSFULLY!
```
