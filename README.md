# Sistema de Control de Inventario y Finanzas - Moda & Varios

Una aplicación web moderna y premium diseñada para el control diario de productos, stock, ingresos y egresos de una tienda de ropa y artículos varios.

Esta aplicación ha sido creada para superar las limitaciones de una hoja de cálculo tradicional de Excel, ofreciendo automatizaciones de stock, gráficos interactivos de rentabilidad, alertas visuales y persistencia de datos segura en tu propio navegador.

## 🚀 Características Principales

1. **Panel de Control (Resumen)**:
   - Visualización instantánea del **Saldo Actual en Caja**, **Total de Ingresos**, **Total de Egresos** y **Valor Total de tu Inventario** (calculado al costo).
   - Indicador visual del estado de salud de la caja.
   - **Alertas de Stock Bajo**: Lista de productos que están cerca de agotarse o agotados, con botón para reabastecer rápidamente.
   - Historial de los últimos 5 movimientos financieros realizados.
   - Gráfico de flujo financiero mensual para evaluar ingresos vs gastos rápidamente.

2. **Control de Inventario**:
   - Registro detallado de productos con categorías, precio de costo, precio de venta, margen de ganancia calculado automáticamente y stock mínimo.
   - Buscador rápido en tiempo real por nombre del producto.
   - Filtros avanzados por categorías y nivel de stock (Stock bajo, Sin stock, Saludable).
   - Acciones rápidas en la tabla: **Registrar Venta** (descuenta stock e ingresa dinero a caja) y **Reabastecer** (aumenta stock y genera un gasto en caja).

3. **Caja y Movimientos (Ingresos / Egresos)**:
   - Registro de transacciones con fecha, descripción, categoría y valor.
   - Buscador por descripción y filtros por tipo (Ingreso/Gasto) y mes.
   - **Exportación directa a formato CSV (Excel)** compatible con Windows, manteniendo acentos y tildes correctamente.

4. **Informes y Reportes Avanzados**:
   - Filtro de tiempo por período: **Semanal** (últimos 7 días), **Mensual** (mes actual) y **Anual** (año actual).
   - Indicadores de Margen de Ganancia Promedio del local, Ganancia Neta Real y Producto Más Vendido.
   - Gráfico interactivo lineal de rendimiento histórico de ingresos vs egresos.
   - Gráfico de torta (doughnut) de distribución de gastos por categorías para identificar dónde se va el dinero.
   - Gráfico de barras horizontal de ventas generadas por categoría de productos.
   - Tabla resumen mes a mes con ingresos, gastos, utilidades y estado (Superávit/Déficit).

5. **Copias de Seguridad (Backup)**:
   - **Exportar datos**: Guarda toda tu información (inventario y finanzas) en un archivo `.json` local.
   - **Importar datos**: Restaura una copia de seguridad en cualquier momento.
   - **Cargar datos demo**: Llenado instantáneo de la aplicación con datos iniciales (basados en tu plantilla original) para ver el funcionamiento.
   - **Borrado completo**: Limpia la base de datos para comenzar desde cero.

---

## 🛠️ Cómo Utilizar la Aplicación Localmente

La aplicación es completamente autónoma. **No necesitas instalar bases de datos complejas, Node.js ni servidores web**. 

Para abrirla y empezar a usarla:

1. Dirígete a la carpeta del proyecto en tu computadora.
2. Haz **doble clic en el archivo `index.html`** para abrirlo en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. ¡Listo! La primera vez se cargarán automáticamente los datos de demostración para que puedas explorar las pantallas.

---

## 🌓 Alternar Temas (Claro y Oscuro)

La aplicación cuenta con soporte nativo de doble tema visual:
- **Modo Oscuro (Activado por defecto)**: Un diseño premium y moderno en tonos azul oscuro y gris pizarra con efectos de vidrio templado (*glassmorphism*) que reduce la fatiga visual.
- **Modo Claro**: Un diseño limpio, luminoso y corporativo de alta legibilidad para ambientes de oficina.
- Puedes cambiar entre ellos utilizando el interruptor ubicado en la parte inferior izquierda de la barra de navegación lateral. Tu preferencia se guardará automáticamente en el navegador.

---

## 📦 Copias de Seguridad y Seguridad de Datos

Todos tus datos se guardan de forma local y segura en el almacenamiento de tu propio navegador web (`localStorage`). **Ninguna información se envía a internet**, garantizando total privacidad.

> [!WARNING]  
> Borrar las cookies o el historial del navegador podría llegar a eliminar el almacenamiento local. **Se recomienda encarecidamente utilizar el botón de "Exportar Respaldo (.JSON)"** en la pestaña de **Datos y Respaldo** cada semana o mes para guardar una copia física de tus datos en tu computadora.
