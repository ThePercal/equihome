# Activar la recepción de solicitudes

## Estado entregado

`contactEndpoint: null` mantiene el formulario en modo local. La descarga no transmite datos. No hay buzón, CRM ni base de datos conectados.

## Contrato de integración

Configura una ruta del mismo origen, por ejemplo `/api/solicitudes`, únicamente después de implementar y verificar el servicio. El frontend hará un `POST` JSON con:

```json
{
  "name": "Nombre de la persona",
  "email": "correo@example.com",
  "phone": "",
  "model": "equi-60",
  "budget": "50.000–75.000 €",
  "location": "Municipio y provincia",
  "message": "Descripción del proyecto",
  "privacy": "on",
  "configuration": {
    "model": "equi-60",
    "area": "60",
    "finish": "natural",
    "equipment": "essential",
    "extras": []
  }
}
```

`configuration` puede ser `null`. El servidor debe volver a validar todo: campos, longitudes, consentimiento, identificadores permitidos, superficie y precios. Nunca debe confiar en un importe calculado por el navegador.

Solo después de guardar realmente la solicitud debe responder con estado 2xx y `{"ok":true}`. Los errores deben devolver un estado distinto de 2xx; una respuesta HTML o un JSON sin `ok:true` no se interpreta como envío confirmado. El frontend conserva los datos ante fallos y aplica un tiempo límite de 15 segundos.

## Trabajo requerido en el servicio

- Persistencia duradera y gestión de duplicados para reintentos.
- Validación en servidor, límites de tamaño, control de origen y limitación de peticiones/antispam.
- Protección de datos en tránsito y reposo, acceso restringido y registros sin datos personales innecesarios.
- Política de conservación y eliminación, gestión de derechos y encargado de tratamiento.
- Notificación al equipo o integración CRM, con credenciales solo en variables de entorno del servidor.
- Confirmación real de recepción; la respuesta `ok` no debe depender de una simulación.

No pongas claves, credenciales o secretos en `catalog.json`, `public/` ni JavaScript del cliente.

## Cambios de contenido necesarios al activar

Completa y valida identidad jurídica, NIF/CIF, domicilio, contacto, condiciones comerciales y política de privacidad. Actualiza el aviso de contacto lateral, la descripción SEO de contacto, los textos legales y el consentimiento para reflejar el tratamiento real. El formulario oculta automáticamente el aviso de descarga local al existir endpoint, pero el resto de contenido informativo requiere revisión consciente.

El alojamiento actual es estático: la ruta de API requiere un backend adicional o migrar el despliegue a un runtime de servidor. Si se usa otro origen, deberán revisarse CSP, CORS y privacidad; se recomienda mantener la API en el mismo origen.
