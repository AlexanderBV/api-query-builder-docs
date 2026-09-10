# Listas y Rangos (CSV & Arrays) 📋

Uno de los mayores dolores de cabeza al integrar frontends y backends es la discordancia en la serialización de listas y rangos.

Diferentes librerías de frontend serializan listas de maneras distintas:
- Algunas envían parámetros repetidos o indexados: `filter[status][in][]=active&filter[status][in][]=draft`
- Otras envían cadenas delimitadas por comas (CSV): `filter[status][in]=active,draft`

**Laravel ApiQueryBuilder resuelve esto de raíz: tolera ambas representaciones de forma 100% transparente.**

---

## 1. Pertenencia a Conjunto (`in`)

Filtra registros cuyo valor coincida con cualquiera de los elementos proporcionados.

### Formato CSV (Recomendado por su brevedad en URL)
```http
GET /api/orders?filter[status][in]=paid,shipped,delivered
```

### Formato Array Indexado
```http
GET /api/orders?filter[status][in][]=paid&filter[status][in][]=shipped&filter[status][in][]=delivered
```

**SQL generado en ambos casos:**
```sql
SELECT * FROM orders WHERE status IN ('paid', 'shipped', 'delivered');
```

---

## 2. Exclusión de Conjunto (`not_in`)

Filtra registros cuyo valor **no** se encuentre en la lista especificada.

### Ejemplo HTTP
```http
GET /api/users?filter[role][not_in]=banned,suspended
```

**SQL generado:**
```sql
SELECT * FROM users WHERE role NOT IN ('banned', 'suspended');
```

---

## 3. Rango Cerrado Inclusivo (`between`)

Para consultas donde se requiere exactamente un límite inferior y un límite superior:

### Formato CSV
```http
GET /api/products?filter[price][between]=10,50
```

### Formato Array
```http
GET /api/products?filter[price][between][0]=10&filter[price][between][1]=50
```

**SQL generado:**
```sql
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
```

::: warning Validación de 2 Elementos
El operador `between` valida estrictamente que se reciban al menos 2 valores. Si el cliente envía solo un valor (`?filter[price][between]=10`), el procesador responderá con **HTTP 422** indicando que el operador requiere dos valores.
:::

---

## 4. Fuera de Rango (`not_between`)

Filtra registros que se encuentren fuera del intervalo dado:

```http
GET /api/events?filter[capacity][not_between]=100,500
```

**SQL generado:**
```sql
SELECT * FROM events WHERE capacity NOT BETWEEN 100 AND 500;
```
