# Manejo de Errores de Validación (HTTP 422) ⚠️

Cuando una petición viola una regla de la lista blanca (un campo no autorizado, un operador incompatible, un término de búsqueda excesivo o un flag `all=true` que supera el límite), **Laravel ApiQueryBuilder** lanza una excepción de tipo `ProcessorValidationException`.

Dado que esta clase hereda directamente de `Illuminate\Validation\ValidationException`, Laravel la convierte automáticamente en una respuesta HTTP **422 Unprocessable Entity** con el formato universal de errores de Laravel.

---

## 📋 Estructura de Respuesta HTTP 422

```json
{
  "message": "El campo 'created_at' no está autorizado para ordenamiento.",
  "errors": {
    "sort": [
      "El campo 'created_at' no está autorizado para ordenamiento."
    ]
  }
}
```

Otro ejemplo para un operador inválido o no soportado:
```json
{
  "message": "El operador 'regex' no es compatible o no está soportado.",
  "errors": {
    "filter.name.regex": [
      "El operador 'regex' no es compatible o no está soportado."
    ]
  }
}
```

---

## 🛡️ Captura en el Frontend con Interceptores de Axios

Puedes centralizar el manejo de estos errores en tu cliente HTTP para mostrar notificaciones tipo Toast o alertar al usuario:

```typescript
import axios from 'axios';

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 422) {
      const { errors, message } = error.response.data;

      // Obtener el primer mensaje de error disponible
      const firstErrorKey = Object.keys(errors)[0];
      const errorMessage = errors[firstErrorKey]?.[0] || message;

      console.warn('Error de validación en consulta REST:', errorMessage);
      
      // Ejemplo con tu librería de notificaciones (Sonner, Toastify, etc.):
      // toast.error(`Filtro no válido: ${errorMessage}`);
    }

    return Promise.reject(error);
  }
);
```

---

## 🔒 Beneficios para la Seguridad

- **Sin fugas de trazas internas:** Jamás se expone el stack trace de PHP ni sentencias SQL fallidas.
- **Transparencia total:** Los desarrolladores de frontend reciben exactamente el nombre del campo o parámetro que causó el conflicto para corregir el formulario de inmediato.
