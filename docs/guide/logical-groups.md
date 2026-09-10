# Grupos Lógicos AND / OR 🌳

Cuando construyes constructores de filtros avanzados en el frontend (donde los usuarios pueden añadir filas dinámicas diciendo: *"Buscar usuarios que sean Administradores O que tengan más de 100 puntos"*), necesitas soportar árboles booleanos arbitrarios.

**Laravel ApiQueryBuilder** implementa soporte nativo para anidación jerárquica con las claves `and` y `or`.

---

## 🐣 1. El Ejemplo Más Simple: Cláusula Disyuntiva (`or`)

Para traer usuarios cuyo estado sea `active` **O** cuya puntuación sea mayor o igual a `90`:

### Petición HTTP desde el Cliente:
```http
GET /api/users?filter[or][0][status]=active&filter[or][1][score][gte]=90
```

### SQL Generado:
```sql
SELECT * FROM users
WHERE (
    (status = 'active') 
    OR (score >= 90)
);
```

---

## 🚀 2. Anidamiento Complejo (`AND` dentro de `OR`)

Supongamos la siguiente condición:
> *"Traer usuarios que sean Administradores con score > 80, O usuarios en prueba (trial) registrados en 2026."*

### Petición HTTP:
```http
GET /api/users?filter[or][0][and][0][role]=Admin&filter[or][0][and][1][score][gte]=80&filter[or][1][and][0][status]=trial&filter[or][1][and][1][created_at][year]=2026
```

### SQL Generado (Precedencia de Paréntesis Exacta):
```sql
SELECT * FROM users
WHERE (
    (
        (role = 'Admin' AND score >= 80)
    )
    OR
    (
        (status = 'trial' AND YEAR(created_at) = 2026)
    )
);
```

---

## 🛡️ 3. Seguridad en Nodos Anidados

Todos los campos dentro de un grupo `and` u `or` continúan pasando por la **verificación estricta de `allowedFilters`**.

Si un usuario malintencionado intenta ocultar un campo no autorizado dentro de un nodo anidado:
```http
GET /api/users?filter[or][0][password_hash]=secret
```
El procesador detectará que `password_hash` no está en la lista blanca y abortará de inmediato con **HTTP 422**.
