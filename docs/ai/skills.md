---
title: Agentes de IA & Skills (Codex, Cursor, Claude, Gemini, Antigravity)
description: Suite oficial de skills, reglas e instrucciones para Agentes de IA (OpenAI Codex, Cursor, Claude Code, Gemini CLI, Antigravity, Windsurf) para Laravel ApiQueryBuilder.
---

# 🤖 Agentes de IA & Skills Oficiales

Construye endpoints de API de alto rendimiento en Laravel asistido por Inteligencia Artificial sin errores de sintaxis, consultas $N+1$ accidentales o brechas de seguridad en parámetros de consulta.

El paquete oficial [**`api-query-builder-skills`**](https://github.com/AlexanderBV/api-query-builder-skills) proporciona instrucciones formales, contratos de evaluación, directivas para prompts y ejemplos del mundo real para que tu asistente de IA (OpenAI Codex, Cursor, Claude Code, Gemini CLI, Google Antigravity, Windsurf) aproveche al 100% las capacidades de [**`warrior/api-query-builder`**](https://github.com/AlexanderBV/api-query-builder).

---

## 📥 Opciones de Descarga e Integración

Elige el método que mejor se adapte a tu entorno de trabajo:

### Opción 1: Descarga Manual Directa (.ZIP)
Si prefieres no usar Git ni la terminal para instalar las skills, puedes descargar el archivo comprimido directamente:

👉 [**📦 Descargar api-query-builder-skills.zip (Última versión)**](https://github.com/AlexanderBV/api-query-builder-skills/archive/refs/heads/main.zip)

Descomprime el archivo y copia los archivos según el agente que utilices (revisa las secciones de abajo).

---

### Opción 2: Descarga Rápida con cURL (1 Solo Comando, sin clonar Git)

Descarga directamente el archivo de configuración que necesitas en la raíz de tu proyecto Laravel:

::: code-group
```bash [OpenAI Codex (.codex)]
mkdir -p .codex/api-query-builder
curl -sSL https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/skills/api-query-builder/SKILL.md -o .codex/api-query-builder/SKILL.md
```

```bash [Cursor & Windsurf (.cursorrules)]
curl -sSL https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/rules/.cursorrules -o .cursorrules
```

```bash [Claude Code (CLAUDE.md)]
curl -sSL https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/rules/CLAUDE.md -o CLAUDE.md
```

```bash [Estándar Universal (AGENTS.md)]
curl -sSL https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/rules/AGENTS.md -o AGENTS.md
```
:::

---

### Opción 3: Clonar el Repositorio de Skills

```bash
git clone https://github.com/AlexanderBV/api-query-builder-skills.git
```

---

## 🛠️ Guía de Integración por Herramienta de IA

### 1. OpenAI Codex (`.codex/`)

Si tu proyecto o flujo de trabajo utiliza la CLI de OpenAI Codex o la convención de carpeta `.codex/`:

1. Crea la carpeta de la skill dentro de tu proyecto Laravel:
   ```bash
   mkdir -p .codex/api-query-builder
   ```
2. Descarga o copia `SKILL.md` dentro de ella:
   ```bash
   curl -sSL https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/skills/api-query-builder/SKILL.md -o .codex/api-query-builder/SKILL.md
   ```
3. O si descargaste el ZIP, simplemente arrastra la carpeta `skills/api-query-builder/` a `.codex/api-query-builder/`.

Codex indexará automáticamente la skill y generará controladores que aplican listas blancas estrictas y consultas sin $N+1$.

---

### 2. Google Gemini CLI / Google Antigravity

Si utilizas el ecosistema de agentes de Google (Gemini Code Assist, Antigravity CLI o extensiones de terminal):

::: code-group
```bash [Global (Recomendado)]
# Clona e instala la skill globalmente en tu máquina:
mkdir -p ~/.gemini/config/skills
git clone https://github.com/AlexanderBV/api-query-builder-skills.git /tmp/aqb-skills
cp -r /tmp/aqb-skills/skills/api-query-builder ~/.gemini/config/skills/
rm -rf /tmp/aqb-skills
```

```bash [Por Proyecto]
# O instálalo en el directorio .agents de tu proyecto Laravel:
mkdir -p .agents/skills
git clone https://github.com/AlexanderBV/api-query-builder-skills.git .agents/skills/api-query-builder-skills
```
:::

Una vez instalada, el agente activará automáticamente la skill en cuanto le pidas crear o refactorizar controladores con filtros, búsqueda, ordenamiento, eager loading o paginación en Laravel.

---

### 3. Cursor IDE & Windsurf

Para que Cursor o Windsurf generen controladores impecables sin consultas manuales redundantes:

1. Clona o descarga el archivo [`.cursorrules`](https://github.com/AlexanderBV/api-query-builder-skills/blob/main/rules/.cursorrules).
2. Cópialo en la raíz de tu proyecto Laravel:

```bash
curl -o .cursorrules https://raw.githubusercontent.com/AlexanderBV/api-query-builder-skills/main/rules/.cursorrules
```

O anéxalo a tu archivo `.cursorrules` existente.

---

### 4. Claude Code / Anthropic CLI

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

### 5. Integración Manual: Copiar y Pegar Prompt del Sistema

Si utilizas la interfaz web de **ChatGPT**, **Claude.ai**, **GitHub Copilot Chat** o las Instrucciones Personalizadas (Custom Instructions) de tu IDE, copia y pega el siguiente bloque de directivas maestras:

::: details 📋 Haz clic aquí para copiar el Prompt de Instrucciones Personalizadas
```text
Eres un ingeniero experto en Laravel especializado en la librería oficial "warrior/api-query-builder".
Sigue siempre las siguientes reglas de arquitectura y diseño:

1. PATRÓN DE ENTRADA:
   - Prefiere el macro de Eloquent: Model::apiQuery($request) o $user->posts()->apiQuery($request).
   - O usa la clase directamente: ApiQueryBuilder::for(Model::class, $request).
   - Termina la cadena con ->response(OptionalResource::class) o con ->get() / ->paginate().

2. LISTAS BLANCAS Y FILTRADO:
   - Todo campo filtrable DEBE registrarse en ->allowedFilters([...]).
   - Relaciones usan dot notation: 'roles.name' (genera subconsultas whereHas automáticas y seguras; NUNCA uses joins manuales).
   - Campos JSON usan dot notation: 'metadata.code' (traduce a metadata->code).
   - Comodines: '*' para columnas base, 'roles.*' para relaciones, 'metadata.*' para JSON.
   - Scopes locales: si el modelo tiene scopeActive, autoriza 'active'.

3. INMUTABILIDAD DE FILTROS POR DEFECTO:
   - NUNCA hagas $query = User::where('status', 'active'); return $query->apiQuery()...
   - SIEMPRE usa ->defaultFilters(['status' => 'active']). Esto mantiene la consulta base inmutable para que el cliente pueda sobrescribir filtros.

4. ORDENAMIENTOS SEGUROS:
   - Solo autoriza columnas de la tabla base en ->allowedSorts([...]).
   - NUNCA ordenes por columnas de relaciones ('roles.name' está prohibido para no romper la paginación de SQL).
   - Establece orden por defecto con ->defaultSort('-created_at'). Se inyecta la clave primaria como desempate determinista.

5. RENDIMIENTO ANTI-N+1:
   - Usa ->allowedIncludes([...]) para eager loading bajo demanda.
   - Usa ->allowedCounts([...]) para withCount() relacional.
   - Para exportaciones sin paginar usa ->allowAll(maxLimitOrUnlimited: 2000).

6. VALIDACIÓN:
   - Parámetros no autorizados u operadores inválidos disparan ProcessorValidationException, respondiendo automáticamente HTTP 422 en formato estándar de Laravel.
```
:::

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
