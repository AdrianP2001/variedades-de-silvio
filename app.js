// ==========================================================================
// CONTROL DE INVENTARIO Y FINANZAS - LÓGICA DE APLICACIÓN (app.js)
// ==========================================================================

// --- ESTRUCTURA DE DATOS INICIALES DE DEMOSTRACIÓN ---
const DEMO_PRODUCTS = [
    { id: "prod-1", name: "Jeans Slim Fit Masculino", category: "Ropa Masculina", costPrice: 20.00, sellingPrice: 45.00, stock: 18, minStock: 5 },
    { id: "prod-2", name: "Camiseta Básica de Algodón", category: "Ropa Masculina", costPrice: 8.00, sellingPrice: 18.00, stock: 35, minStock: 10 },
    { id: "prod-3", name: "Vestido Elegante de Gala Femenino", category: "Ropa Femenina", costPrice: 45.00, sellingPrice: 95.00, stock: 4, minStock: 2 },
    { id: "prod-4", name: "Blusa Floral Primavera", category: "Ropa Femenina", costPrice: 12.00, sellingPrice: 28.00, stock: 3, minStock: 5 }, // Alerta de stock
    { id: "prod-5", name: "Chaqueta Térmica Impermeable", category: "Ropa Masculina", costPrice: 35.00, sellingPrice: 75.00, stock: 8, minStock: 3 },
    { id: "prod-6", name: "Zapatos Casuales de Cuero", category: "Calzado", costPrice: 30.00, sellingPrice: 65.00, stock: 12, minStock: 4 },
    { id: "prod-7", name: "Cartera de Mano Cuero Sintético", category: "Accesorios", costPrice: 15.00, sellingPrice: 35.00, stock: 2, minStock: 3 }, // Alerta de stock
    { id: "prod-8", name: "Pack Medias Deportivas (x3)", category: "Varios", costPrice: 3.50, sellingPrice: 9.00, stock: 50, minStock: 15 },
    { id: "prod-9", name: "Bufanda Tejida Lana", category: "Accesorios", costPrice: 6.00, sellingPrice: 15.00, stock: 0, minStock: 3 }, // Sin stock
    { id: "prod-10", name: "Pantalón Corto Deportivo", category: "Ropa Masculina", costPrice: 10.00, sellingPrice: 22.00, stock: 22, minStock: 6 }
];

// Basado exactamente en el Excel de referencia del usuario (1/1/2023 al 9/3/2023)
const DEMO_TRANSACTIONS = [
    // Ingresos Enero 2023
    { id: "tx-i1", date: "2023-01-01", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 1000.00 },
    { id: "tx-i2", date: "2023-01-02", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 2000.00 },
    { id: "tx-i3", date: "2023-01-03", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 4000.00 },
    // Gastos Enero 2023
    { id: "tx-g1", date: "2023-01-01", type: "egreso", description: "PAGO DE INTERNET", category: "Pago de Internet", value: 40.00 },
    { id: "tx-g2", date: "2023-01-01", type: "egreso", description: "PAGO INSUMOS", category: "Pago Insumos", value: 20.00 },
    { id: "tx-g3", date: "2023-01-02", type: "egreso", description: "PAGO MATERIALES", category: "Pago Materiales", value: 15.00 },
    { id: "tx-g4", date: "2023-01-03", type: "egreso", description: "PAGO PAPELERIA", category: "Pago Papelería", value: 45.00 },

    // Ingresos Febrero 2023
    { id: "tx-i4", date: "2023-02-04", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 100.00 },
    { id: "tx-i5", date: "2023-02-05", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 200.00 },
    { id: "tx-i6", date: "2023-02-06", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 300.00 },
    // Gastos Febrero 2023
    { id: "tx-g5", date: "2023-02-04", type: "egreso", description: "PAGO ALMUERZO", category: "Pago Almuerzo", value: 64.00 },
    { id: "tx-g6", date: "2023-02-05", type: "egreso", description: "PAGO ARRIENDO", category: "Pago Arriendo", value: 67.00 },
    { id: "tx-g7", date: "2023-02-06", type: "egreso", description: "PAGO INSUMOS", category: "Pago Insumos", value: 45.00 },

    // Ingresos Marzo 2023
    { id: "tx-i7", date: "2023-03-07", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 400.00 },
    { id: "tx-i8", date: "2023-03-08", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 500.00 },
    { id: "tx-i9", date: "2023-03-09", type: "ingreso", description: "VENTA DE MERCANCIA", category: "Venta de Mercancía", value: 600.00 },
    // Gastos Marzo 2023
    { id: "tx-g8", date: "2023-03-07", type: "egreso", description: "OTROS GASTOS", category: "Otros Gastos", value: 10.00 },
    { id: "tx-g9", date: "2023-03-08", type: "egreso", description: "OTROS GASTOS", category: "Otros Gastos", value: 56.00 },
    { id: "tx-g10", date: "2023-03-09", type: "egreso", description: "OTROS GASTOS", category: "Otros Gastos", value: 34.00 }
];

// --- ESTADO DE LA APLICACIÓN ---
let appState = {
    products: [],
    transactions: [],
    loans: []
};

// Instancias de los gráficos globales para poder destruirlas y recrearlas
let dashboardChartInstance = null;
let reportsFlowChartInstance = null;
let reportsExpensesChartInstance = null;
let reportsProductsChartInstance = null;

// Categorías del sistema
const PRODUCT_CATEGORIES = ["Ropa Masculina", "Ropa Femenina", "Ropa Infantil", "Calzado", "Accesorios", "Varios"];
const EXPENSE_CATEGORIES = ["Compra de Mercancía", "Pago Insumos", "Pago Materiales", "Pago Papelería", "Pago Almuerzo", "Pago Arriendo", "Pago de Internet", "Servicios Públicos", "Otros Gastos"];
const INCOME_CATEGORIES = ["Venta de Mercancía", "Servicios", "Otros Ingresos"];

// --- CREDENCIALES DE ACCESO (modificá aquí el usuario y contraseña) ---
const APP_USER = "silvio";
const APP_PASS = "1234";

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    // 0. Comprobar sesión o mostrar login
    setupLogin();
});

function setupLogin() {
    const loginScreen = document.getElementById("login-screen");
    const appContainer = document.querySelector(".app-container");

    // Si ya hay sesión activa (pestaña no cerrada), ir directo a la app
    if (sessionStorage.getItem("vs_auth") === "true") {
        loginScreen.style.display = "none";
        initApp();
        return;
    }

    // Mostrar login, ocultar app
    appContainer.style.visibility = "hidden";

    const btnLogin     = document.getElementById("btn-login");
    const btnTogglePass = document.getElementById("btn-toggle-pass");
    const inputUser    = document.getElementById("login-username");
    const inputPass    = document.getElementById("login-password");
    const loginError   = document.getElementById("login-error");

    // Toggle mostrar/ocultar contraseña
    btnTogglePass.addEventListener("click", () => {
        const isText = inputPass.type === "text";
        inputPass.type = isText ? "password" : "text";
        btnTogglePass.innerHTML = isText
            ? '<i data-lucide="eye"></i>'
            : '<i data-lucide="eye-off"></i>';
        lucide.createIcons();
    });

    // Intentar login al presionar Enter
    [inputUser, inputPass].forEach(el => {
        el.addEventListener("keydown", e => { if (e.key === "Enter") btnLogin.click(); });
    });

    btnLogin.addEventListener("click", () => {
        const user = inputUser.value.trim().toLowerCase();
        const pass = inputPass.value;

        if (user === APP_USER && pass === APP_PASS) {
            // Credenciales correctas
            sessionStorage.setItem("vs_auth", "true");
            loginScreen.style.animation = "loginCardOut 0.35s ease forwards";
            loginScreen.style.transition = "opacity 0.35s ease";
            loginScreen.style.opacity = "0";
            setTimeout(() => {
                loginScreen.style.display = "none";
                appContainer.style.visibility = "visible";
                initApp();
            }, 350);
        } else {
            // Error
            loginError.classList.add("visible");
            inputPass.value = "";
            inputPass.focus();
            setTimeout(() => loginError.classList.remove("visible"), 3500);
        }
    });

    lucide.createIcons();
}

function logout() {
    sessionStorage.removeItem("vs_auth");
    location.reload();
}

function initApp() {
    // 1. Cargar Datos
    loadState();
    
    // 2. Traducir/Establecer fecha de cabecera
    updateHeaderDate();

    // 3. Registrar eventos de navegación
    setupNavigation();

    // 4. Registrar controladores de formularios y botones
    setupFormHandlers();
    setupLoanHandlers();
    setupQuickActionModals();
    setupThemeToggle();

    // 5. Botón cerrar sesión
    document.getElementById("btn-logout").addEventListener("click", async () => {
        if (await showConfirm("Cerrar Sesión", "¿Estás seguro que querés cerrar la sesión? Tendrás que ingresar tu contraseña nuevamente.", "Sí, cerrar sesión", "Cancelar")) {
            logout();
        }
    });

    setupExportHandlers();

    // 6. Renderizar vista inicial (Resumen/Dashboard)
    switchView("dashboard");

    // Inicializar Lucide Icons
    lucide.createIcons();
}

// --- SISTEMA DE ALMACENAMIENTO (LOCALSTORAGE) ---
function loadState() {
    const savedData = localStorage.getItem("moda_varios_db");
    if (savedData) {
        try {
            appState = JSON.parse(savedData);
            // Asegurar que existan los arreglos
            if (!appState.products) appState.products = [];
            if (!appState.transactions) appState.transactions = [];
            if (!appState.loans) appState.loans = [];
        } catch (e) {
            console.error("Error cargando base de datos guardada, inicializando vacía.", e);
            loadDemoData(false);
        }
    } else {
        // Cargar por primera vez con datos de demostración
        loadDemoData(false);
    }
}

function saveState() {
    localStorage.setItem("moda_varios_db", JSON.stringify(appState));
}

function loadDemoData(notify = true) {
    appState.products = JSON.parse(JSON.stringify(DEMO_PRODUCTS));
    appState.transactions = JSON.parse(JSON.stringify(DEMO_TRANSACTIONS));
    saveState();
    if (notify) {
        showToast("Datos de demostración cargados exitosamente.", "success");
        refreshActiveView();
    }
}

async function clearDatabase() {
    if (!await requirePassword("borrar todos los datos del sistema")) return;
    if (await showConfirm("Borrar Base de Datos", "¿Estás absolutamente seguro de borrar todos los datos? Esto borrará el inventario y todo el historial financiero.", "Borrar Todo", "Cancelar")) {
        appState.products = [];
        appState.transactions = [];
        appState.loans = [];
        saveState();
        refreshActiveView();
        showToast("Base de datos vaciada.", "info");
    }
}

// --- UTILIDADES ---
function updateHeaderDate() {
    const dateEl = document.getElementById("header-date");
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('es-ES', options);
    }
    
    // Poner fecha de hoy por defecto en inputs de modales
    const todayStr = new Date().toISOString().substring(0, 10);
    document.getElementById("sale-date").value = todayStr;
    document.getElementById("expense-date").value = todayStr;
    document.getElementById("restock-date").value = todayStr;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value).replace("US$", "$");
}

function getMonthNameSpanish(dateString) {
    const date = new Date(dateString + 'T00:00:00'); // Evitar problemas de huso horario
    return date.toLocaleDateString('es-ES', { month: 'long' });
}

function getYearOfDate(dateString) {
    return new Date(dateString + 'T00:00:00').getFullYear();
}

function generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// --- SISTEMA DE NAVEGACIÓN ---
function setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetView = btn.getAttribute("data-view");
            switchView(targetView);
        });
    });

    // Enlace del Dashboard "Ver todos"
    const seeAllBtn = document.getElementById("btn-see-all-transactions");
    if (seeAllBtn) {
        seeAllBtn.addEventListener("click", () => {
            const txNavBtn = document.getElementById("btn-nav-transactions");
            if (txNavBtn) txNavBtn.click();
        });
    }
}

function switchView(viewName) {
    // Ocultar todas las vistas
    const views = document.querySelectorAll(".app-view");
    views.forEach(v => v.classList.remove("active"));

    // Mostrar la seleccionada
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add("active");

    // Actualizar títulos
    const titleEl = document.getElementById("view-title");
    const subtitleEl = document.getElementById("view-subtitle");

    switch(viewName) {
        case "dashboard":
            titleEl.textContent = "Resumen Financiero";
            subtitleEl.textContent = "Estado actual de tu negocio el día de hoy.";
            renderDashboard();
            break;
        case "inventory":
            titleEl.textContent = "Control de Inventario";
            subtitleEl.textContent = "Administra tus productos, precios y niveles de stock actualizados.";
            renderInventory();
            break;
        case "transactions":
            titleEl.textContent = "Caja y Movimientos";
            subtitleEl.textContent = "Registro diario detallado de ingresos (ventas) y egresos (gastos).";
            renderTransactions();
            break;
        case "reports":
            titleEl.textContent = "Informes y Reportes";
            subtitleEl.textContent = "Determina si el negocio tiene buenos ingresos, egresos y rentabilidad.";
            renderReports();
            break;
        case "backup":
            titleEl.textContent = "Datos e Importación";
            subtitleEl.textContent = "Realiza copias de seguridad de tus datos o reinicia el sistema.";
            renderBackup();
            break;
        case "loans":
            titleEl.textContent = "Préstamos y Cobros";
            subtitleEl.textContent = "Gestión de microcréditos y registro de cuotas diarias.";
            renderLoans();
            break;
    }
    
    // Volver a renderizar iconos de Lucide cargados dinámicamente
    lucide.createIcons();
}

function refreshActiveView() {
    const activeNavBtn = document.querySelector(".nav-btn.active");
    if (activeNavBtn) {
        switchView(activeNavBtn.getAttribute("data-view"));
    }
}

// --- MODO OSCURO / MODO CLARO ---
function setupThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    
    // Cargar preferencia anterior si existe
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        toggle.checked = false;
    } else {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
        toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            document.body.classList.add("dark-theme");
            document.body.classList.remove("light-theme");
            localStorage.setItem("app-theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            document.body.classList.add("light-theme");
            localStorage.setItem("app-theme", "light");
        }
        
        // Re-dibujar gráficos para adaptar colores
        refreshActiveView();
    });
}

// --- CONTROLADORES DE MODALES ---
function setupQuickActionModals() {
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".modal-close");
    
    // Botones de Abrir
    document.getElementById("btn-quick-sale").addEventListener("click", () => openModal("sale"));
    document.getElementById("btn-quick-expense").addEventListener("click", () => openModal("expense"));

    // Botones de Cerrar
    closeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const openModalEl = document.querySelector(".modal.active");
            if (openModalEl) closeModal(openModalEl.id.replace("modal-", ""));
        });
    });

    // Cerrar haciendo clic fuera
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            closeModal(e.target.id.replace("modal-", ""));
        }
    });
}

function openModal(modalName) {
    const modal = document.getElementById(`modal-${modalName}`);
    if (modal) {
        modal.classList.add("active");
        
        // Inicializar datos específicos del modal al abrir
        if (modalName === "sale") {
            populateSaleProductDropdown();
            // Resetea campos
            document.getElementById("form-sale").reset();
            document.getElementById("sale-date").value = new Date().toISOString().substring(0, 10);
            document.getElementById("group-sale-qty").style.display = "none";
        } else if (modalName === "expense") {
            document.getElementById("form-expense").reset();
            document.getElementById("expense-date").value = new Date().toISOString().substring(0, 10);
        } else if (modalName === "product") {
            // El formulario del producto se maneja directo en setupFormHandlers para diferenciar NEW vs EDIT
        }
        
        lucide.createIcons();
    }
}

function closeModal(modalName) {
    const modal = document.getElementById(`modal-${modalName}`);
    if (modal) modal.classList.remove("active");
}

// --- FORMULARIOS Y ACCIONES FINANCIERAS ---
function setupFormHandlers() {
    // 1. FORMULARIO VENTA
    const formSale = document.getElementById("form-sale");
    const selectSaleProduct = document.getElementById("sale-product");
    const inputSaleQty = document.getElementById("sale-qty");
    const inputSaleVal = document.getElementById("sale-value");
    const inputSaleDesc = document.getElementById("sale-description");

    selectSaleProduct.addEventListener("change", () => {
        const prodId = selectSaleProduct.value;
        const qtyGroup = document.getElementById("group-sale-qty");
        
        if (prodId) {
            const product = appState.products.find(p => p.id === prodId);
            qtyGroup.style.display = "block";
            inputSaleQty.max = product.stock;
            inputSaleQty.value = 1;
            
            // Actualizar precio de venta por defecto e info de stock
            document.getElementById("sale-stock-info").textContent = `Stock disponible: ${product.stock}`;
            inputSaleVal.value = product.sellingPrice;
            inputSaleDesc.value = `VENTA: ${product.name}`;
        } else {
            qtyGroup.style.display = "none";
            inputSaleVal.value = "";
            inputSaleDesc.value = "VENTA DE MERCANCIA";
        }
    });

    inputSaleQty.addEventListener("input", () => {
        const prodId = selectSaleProduct.value;
        if (prodId) {
            const product = appState.products.find(p => p.id === prodId);
            const qty = parseInt(inputSaleQty.value) || 1;
            inputSaleVal.value = (product.sellingPrice * qty).toFixed(2);
        }
    });

    formSale.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("sale-date").value;
        const prodId = selectSaleProduct.value;
        const qty = parseInt(inputSaleQty.value) || 1;
        const desc = inputSaleDesc.value;
        const val = parseFloat(inputSaleVal.value);
        const cat = document.getElementById("sale-category").value;

        if (prodId) {
            // Venta vinculada a producto del inventario
            const product = appState.products.find(p => p.id === prodId);
            if (product.stock < qty) {
                showToast(`Stock insuficiente. Solo quedan ${product.stock} unidades.`, "error");
                return;
            }
            product.stock -= qty; // Descontar stock
        }

        // Registrar transacción
        const newTx = {
            id: generateId("tx"),
            date: date,
            type: "ingreso",
            description: desc,
            category: cat,
            value: val,
            productId: prodId || null,
            qty: prodId ? qty : null
        };
        
        appState.transactions.push(newTx);
        saveState();
        closeModal("sale");
        refreshActiveView();
        showToast("Venta registrada correctamente.", "success");
    });

    // 2. FORMULARIO GASTO
    const formExpense = document.getElementById("form-expense");
    formExpense.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("expense-date").value;
        const desc = document.getElementById("expense-description").value;
        const val = parseFloat(document.getElementById("expense-value").value);
        const cat = document.getElementById("expense-category").value;

        const newTx = {
            id: generateId("tx"),
            date: date,
            type: "egreso",
            description: desc,
            category: cat,
            value: val
        };

        appState.transactions.push(newTx);
        saveState();
        closeModal("expense");
        refreshActiveView();
        showToast("Gasto registrado correctamente.", "success");
    });

    // 3. FORMULARIO NUEVO/EDITAR PRODUCTO
    const formProduct = document.getElementById("form-product");
    formProduct.addEventListener("submit", (e) => {
        e.preventDefault();
        const prodId = document.getElementById("product-id").value;
        const name = document.getElementById("product-name").value;
        const category = document.getElementById("product-category").value;
        const costPrice = parseFloat(document.getElementById("product-cost-price").value);
        const sellingPrice = parseFloat(document.getElementById("product-selling-price").value);
        const stock = parseInt(document.getElementById("product-stock").value);
        const minStock = parseInt(document.getElementById("product-min-stock").value);

        if (prodId) {
            // Edición
            const product = appState.products.find(p => p.id === prodId);
            product.name = name;
            product.category = category;
            product.costPrice = costPrice;
            product.sellingPrice = sellingPrice;
            product.stock = stock;
            product.minStock = minStock;
            showToast("Producto actualizado correctamente.", "success");
        } else {
            // Nuevo Producto
            const newProduct = {
                id: generateId("prod"),
                name,
                category,
                costPrice,
                sellingPrice,
                stock,
                minStock
            };
            appState.products.push(newProduct);
            showToast("Producto añadido al inventario.", "success");
        }

        saveState();
        closeModal("product");
        refreshActiveView();
    });

    // Abrir modal de añadir producto
    document.getElementById("btn-add-product").addEventListener("click", () => {
        document.getElementById("form-product").reset();
        document.getElementById("product-id").value = "";
        document.getElementById("product-modal-title").innerHTML = `<i data-lucide="package-plus"></i> Añadir Nuevo Producto`;
        document.getElementById("btn-save-product").textContent = "Guardar Producto";
        
        // Habilitar la edición de stock inicial al crear
        document.getElementById("product-stock").disabled = false;
        
        openModal("product");
    });

    // 4. FORMULARIO REABASTECIMIENTO
    const formRestock = document.getElementById("form-restock");
    formRestock.addEventListener("submit", async (e) => {
        e.preventDefault();
        const prodId = document.getElementById("restock-product-id").value;
        const qty = parseInt(document.getElementById("restock-qty").value);
        const costPrice = parseFloat(document.getElementById("restock-cost").value);
        const date = document.getElementById("restock-date").value;

        const product = appState.products.find(p => p.id === prodId);
        if (product) {
            const totalCost = costPrice * qty;
            
            // Mostrar modal de confirmación personalizado para decidir el gasto
            const choice = await showRestockConfirm(product.name, qty, totalCost);
            
            if (choice === "cancel") {
                // Cancelar la operación de reabastecimiento por completo
                return;
            }
            
            product.stock += qty; // Aumentar stock en inventario
            
            if (choice === "expense") {
                // Registrar egreso por compra de mercancía
                const newTx = {
                    id: generateId("tx"),
                    date: date,
                    type: "egreso",
                    description: `REABASTECIMIENTO: ${product.name} (x${qty})`,
                    category: "Compra de Mercancía",
                    value: totalCost,
                    productId: prodId,
                    qty: qty
                };
                appState.transactions.push(newTx);
            }
            
            saveState();
            closeModal("restock");
            refreshActiveView();
            
            if (choice === "expense") {
                showToast("Stock reabastecido y gasto registrado.", "success");
            } else {
                showToast("Stock reabastecido correctamente (sin registrar gasto).", "success");
            }
        }
    });

    // 5. AJUSTES (Backup y restaurar)
    document.getElementById("btn-load-demo").addEventListener("click", () => loadDemoData(true));
    document.getElementById("btn-clear-database").addEventListener("click", clearDatabase);

    async function saveFileNativeOrWeb(filename, content, isBase64 = false) {
        if (window.pywebview && window.pywebview.api) {
            let b64 = isBase64 ? content : btoa(unescape(encodeURIComponent(content)));
            return await window.pywebview.api.save_file_native(filename, b64);
        } else {
            const dataStr = isBase64 
                ? `data:application/octet-stream;base64,${content}`
                : `data:text/json;charset=utf-8,${encodeURIComponent(content)}`;
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", filename);
            dlAnchorElem.click();
            return true;
        }
    }

    // Exportar Backup
    document.getElementById("btn-export-backup").addEventListener("click", async () => {
        const saved = await saveFileNativeOrWeb("moda_varios_respaldo.json", JSON.stringify(appState, null, 2));
        if (saved) showToast("Respaldo guardado correctamente", "success");
        else showToast("Respaldo cancelado", "info");
    });
    // Cierre de Día (Backup Rápido)
    const btnDailyClose = document.getElementById("btn-daily-close");
    if (btnDailyClose) {
        btnDailyClose.addEventListener("click", async () => {
            const dateStr = new Date().toISOString().substring(0, 10);
            
            // 1. Descargar Backup JSON
            const jsonSaved = await saveFileNativeOrWeb(`Respaldo_Silvio_${dateStr}.json`, JSON.stringify(appState, null, 2));
            
            if (!jsonSaved) {
                showToast("Respaldo cancelado", "info");
                return;
            }

            // 2. Descargar Excel
            if (typeof exportToExcel === 'function') {
                await exportToExcel();
            }

            showToast("Respaldo de emergencia finalizado.", "success");
        });
    }


    // Importar Backup
    const fileInput = document.getElementById("input-import-backup");
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function(evt) {
            try {
                const importedData = JSON.parse(evt.target.result);
                if (importedData.products && importedData.transactions) {
                    if (await showConfirm("Restaurar Copia de Seguridad", "Esta acción reemplazará completamente tus datos actuales con los del archivo. ¿Deseas continuar?", "Restaurar", "Cancelar")) {
                        appState = importedData;
                        saveState();
                        refreshActiveView();
                        showToast("Datos restaurados correctamente.", "success");
                    }
                } else {
                    showToast("El archivo no tiene el formato de copia de seguridad válido.", "error");
                }
            } catch (err) {
                showToast("Error al leer el archivo JSON: " + err.message, "error");
            }
        };
        reader.readAsText(file);
        fileInput.value = ""; // reset
    });

    // Exportar CSV de Movimientos de Caja
    document.getElementById("btn-export-csv").addEventListener("click", () => {
        exportTransactionsToCSV();
    });
}

function populateSaleProductDropdown() {
    const dropdown = document.getElementById("sale-product");
    dropdown.innerHTML = '<option value="">-- No vincular a producto (Venta libre/Servicio) --</option>';
    
    // Filtrar productos con stock > 0
    appState.products.forEach(p => {
        const disabledAttr = p.stock <= 0 ? 'disabled' : '';
        const suffix = p.stock <= 0 ? ' (SIN STOCK)' : ` (Stock: ${p.stock})`;
        dropdown.innerHTML += `<option value="${p.id}" ${disabledAttr}>${p.name}${suffix}</option>`;
    });
}

// --- VISTA 1: DASHBOARD (RENDERING) ---
function renderDashboard() {
    // 1. Cálculos de caja
    let totalIncome = 0;
    let totalExpense = 0;

    appState.transactions.forEach(t => {
        if (t.type === "ingreso") {
            totalIncome += t.value;
        } else {
            totalExpense += t.value;
        }
    });

    const currentBalance = totalIncome - totalExpense;

    // 2. Valor de inventario (Stock * precio de costo)
    let totalInventoryVal = 0;
    let totalItemsStock = 0;
    appState.products.forEach(p => {
        totalInventoryVal += (p.costPrice * p.stock);
        totalItemsStock += p.stock;
    });

    // 3. Pintar en pantalla
    document.getElementById("kpi-balance").textContent = formatCurrency(currentBalance);
    document.getElementById("kpi-income").textContent = formatCurrency(totalIncome);
    document.getElementById("kpi-expense").textContent = formatCurrency(totalExpense);
    document.getElementById("kpi-inventory").textContent = formatCurrency(totalInventoryVal);
    document.getElementById("kpi-inventory-sub").innerHTML = `<i data-lucide="package-search"></i> ${totalItemsStock} unidades en almacén`;

    // Cambiar la tendencia del saldo de color
    const balanceTrend = document.getElementById("kpi-balance-trend");
    if (currentBalance < 0) {
        balanceTrend.className = "kpi-trend text-danger";
        balanceTrend.innerHTML = `<i data-lucide="alert-triangle"></i> Caja en saldo negativo`;
    } else {
        balanceTrend.className = "kpi-trend text-warning";
        balanceTrend.innerHTML = `<i data-lucide="activity"></i> Saldo en efectivo y cuentas`;
    }

    // 4. Alertas de bajo stock
    renderDashboardStockAlerts();

    // 5. Últimos movimientos (5)
    renderDashboardRecentActivity();

    // 6. Cargar gráfico mensual
    renderDashboardChart();
}

function renderDashboardStockAlerts() {
    const alertsList = document.getElementById("dashboard-alerts-list");
    const alertCountEl = document.getElementById("alert-count");
    
    // Filtrar productos con stock menor o igual al minStock
    const alertProducts = appState.products.filter(p => p.stock <= p.minStock);
    alertCountEl.textContent = `${alertProducts.length} Alertas`;
    
    if (alertProducts.length === 0) {
        alertsList.innerHTML = `
            <li class="alert-empty-state">
                <i data-lucide="check-circle-2"></i>
                <p>Todo el inventario tiene buen nivel de stock.</p>
            </li>
        `;
        alertCountEl.className = "badge badge-success";
    } else {
        alertCountEl.className = "badge badge-warning";
        alertsList.innerHTML = "";
        
        alertProducts.forEach(p => {
            const isZero = p.stock === 0;
            const itemHtml = `
                <li>
                    <div class="alert-item-info">
                        <span class="alert-item-title text-white">${p.name}</span>
                        <span class="alert-item-stock ${isZero ? 'text-danger' : 'text-warning'}">
                            ${isZero ? '¡SIN STOCK!' : `Stock bajo: ${p.stock} unidades`} (Min: ${p.minStock})
                        </span>
                    </div>
                    <button class="btn btn-sm-icon btn-restock" onclick="handleQuickRestock('${p.id}')" title="Reabastecer stock">
                        <i data-lucide="plus"></i>
                    </button>
                </li>
            `;
            alertsList.innerHTML += itemHtml;
        });
    }
}

function renderDashboardRecentActivity() {
    const tbody = document.getElementById("recent-transactions-tbody");
    tbody.innerHTML = "";

    // Tomar las últimas 5 transacciones ordenadas por fecha descendente
    const sortedTx = [...appState.transactions]
        .sort((a, b) => new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00'))
        .slice(0, 5);

    if (sortedTx.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">No hay movimientos financieros registrados.</td>
            </tr>
        `;
        return;
    }

    sortedTx.forEach(t => {
        const isIncome = t.type === "ingreso";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Fecha">${t.date.split('-').reverse().join('/')}</td>
            <td data-label="Tipo">
                <span class="row-type-badge ${isIncome ? 'row-type-ingreso' : 'row-type-egreso'}">
                    <i data-lucide="${isIncome ? 'arrow-up-right' : 'arrow-down-left'}"></i>
                    ${isIncome ? 'Ingreso' : 'Gasto'}
                </span>
            </td>
            <td class="product-cell" style="font-weight: 500;">${t.description}</td>
            <td data-label="Categoría">${t.category}</td>
            <td class="text-right font-semibold ${isIncome ? 'text-success' : 'text-danger'}" data-label="Monto">
                ${isIncome ? '+' : '-'}${formatCurrency(t.value)}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderDashboardChart() {
    const ctx = document.getElementById("chart-dashboard").getContext("2d");
    
    // Obtener los últimos 6 meses que tienen datos
    const monthlyData = {};
    
    // Llenar por defecto con los meses del Excel para que no se vea vacío
    const defaultMonths = ["2023-01", "2023-02", "2023-03"];
    defaultMonths.forEach(m => {
        monthlyData[m] = { ingresos: 0, gastos: 0 };
    });

    appState.transactions.forEach(t => {
        const monthKey = t.date.substring(0, 7); // "YYYY-MM"
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { ingresos: 0, gastos: 0 };
        }
        if (t.type === "ingreso") {
            monthlyData[monthKey].ingresos += t.value;
        } else {
            monthlyData[monthKey].gastos += t.value;
        }
    });

    // Ordenar los meses
    const sortedMonths = Object.keys(monthlyData).sort().slice(-6); // Máximo últimos 6 meses

    const labels = sortedMonths.map(m => {
        const parts = m.split('-');
        const dateObj = new Date(parts[0], parts[1] - 1, 1);
        return dateObj.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    });
    
    const ingresos = sortedMonths.map(m => monthlyData[m].ingresos);
    const gastos = sortedMonths.map(m => monthlyData[m].gastos);

    if (dashboardChartInstance) {
        dashboardChartInstance.destroy();
    }

    // Detectar tema para colores de etiquetas
    const isDark = document.body.classList.contains("dark-theme");
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    dashboardChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: ingresos,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Gastos',
                    data: gastos,
                    backgroundColor: 'rgba(249, 115, 22, 0.7)',
                    borderColor: '#f97316',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { family: 'Inter' } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { 
                        color: textColor, 
                        font: { family: 'Inter' },
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// --- VISTA 2: INVENTARIO (RENDERING) ---
function renderInventory() {
    const tbody = document.getElementById("inventory-tbody");
    tbody.innerHTML = "";

    const searchVal = document.getElementById("inventory-search").value.toLowerCase();
    const catVal = document.getElementById("inventory-filter-category").value;
    const stockVal = document.getElementById("inventory-filter-stock").value;

    const filteredProducts = appState.products.filter(p => {
        // Filtro por búsqueda
        const matchesSearch = p.name.toLowerCase().includes(searchVal) || p.id.toLowerCase().includes(searchVal);
        
        // Filtro por categoría
        const matchesCategory = catVal === "all" || p.category === catVal;

        // Filtro por Stock
        let matchesStock = true;
        if (stockVal === "low") {
            matchesStock = p.stock <= p.minStock && p.stock > 0;
        } else if (stockVal === "empty") {
            matchesStock = p.stock === 0;
        } else if (stockVal === "ok") {
            matchesStock = p.stock > p.minStock;
        }

        return matchesSearch && matchesCategory && matchesStock;
    });

    if (filteredProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-muted">No se encontraron productos en el inventario.</td>
            </tr>
        `;
        return;
    }

    filteredProducts.forEach(p => {
        const markupPercent = p.costPrice > 0 ? ((p.sellingPrice - p.costPrice) / p.costPrice * 100).toFixed(0) : '0';
        
        let stockClass = "stock-healthy";
        let stockLabel = "Saludable";
        
        if (p.stock === 0) {
            stockClass = "stock-empty";
            stockLabel = "Sin Stock";
        } else if (p.stock <= p.minStock) {
            stockClass = "stock-low";
            stockLabel = "Stock Bajo";
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="product-cell">
                <div style="font-weight: 600; color: #fff;" class="product-title-td">${p.name}</div>
                <div style="font-size: 0.75rem;" class="text-muted">${p.id}</div>
            </td>
            <td data-label="Categoría">${p.category}</td>
            <td class="text-right font-medium" data-label="P. Costo">${formatCurrency(p.costPrice)}</td>
            <td class="text-right font-medium text-success" data-label="P. Venta">${formatCurrency(p.sellingPrice)}</td>
            <td class="text-right text-muted" data-label="Margen">${markupPercent}% Margen</td>
            <td class="text-center font-bold" data-label="Stock">${p.stock}</td>
            <td class="text-center text-muted" data-label="Mínimo">${p.minStock}</td>
            <td class="text-center" data-label="Estado">
                <span class="stock-pill ${stockClass}">${stockLabel}</span>
            </td>
            <td class="table-actions-cell">
                <button class="btn-sm-icon btn-sell" onclick="handleQuickSale('${p.id}')" title="Registrar venta de este producto" ${p.stock <= 0 ? 'disabled' : ''}>
                    <i data-lucide="shopping-cart"></i>
                </button>
                <button class="btn-sm-icon btn-restock" onclick="handleQuickRestock('${p.id}')" title="Reabastecer stock de este producto">
                    <i data-lucide="plus"></i>
                </button>
                <button class="btn-sm-icon" onclick="handleEditProduct('${p.id}')" title="Editar producto">
                    <i data-lucide="edit-3"></i>
                </button>
                <button class="btn-sm-icon text-danger" onclick="handleDeleteProduct('${p.id}')" title="Eliminar producto">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Registrar los eventos en vivo de los inputs de búsqueda/filtro
    setupInventorySearchListeners();
}

function setupInventorySearchListeners() {
    const search = document.getElementById("inventory-search");
    const cat = document.getElementById("inventory-filter-category");
    const stock = document.getElementById("inventory-filter-stock");
    
    // Evitar acumulamiento quitando primero
    search.removeEventListener("input", renderInventory);
    cat.removeEventListener("change", renderInventory);
    stock.removeEventListener("change", renderInventory);

    search.addEventListener("input", renderInventory);
    cat.addEventListener("change", renderInventory);
    stock.addEventListener("change", renderInventory);
}

// Acciones sobre productos
function handleQuickSale(productId) {
    openModal("sale");
    
    // Seleccionar automáticamente el producto en el dropdown
    const select = document.getElementById("sale-product");
    select.value = productId;
    
    // Forzar el cambio del dropdown para rellenar campos
    const event = new Event('change');
    select.dispatchEvent(event);
}

function handleQuickRestock(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    openModal("restock");

    document.getElementById("restock-product-id").value = productId;
    document.getElementById("restock-product-name").textContent = product.name;
    document.getElementById("restock-cost").value = product.costPrice;
    document.getElementById("restock-qty").value = 10;
    
    lucide.createIcons();
}

function handleEditProduct(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    openModal("product");

    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-cost-price").value = product.costPrice;
    document.getElementById("product-selling-price").value = product.sellingPrice;
    document.getElementById("product-stock").value = product.stock;
    document.getElementById("product-min-stock").value = product.minStock;

    // Deshabilitar la edición manual directa de stock al editar (el stock debe subirse con reabastecimiento o bajarse con venta para que se registren los gastos/ingresos)
    // Pero si quieren hacer un ajuste rápido, dejamos que el administrador edite, advirtiendo.
    document.getElementById("product-stock").disabled = true;

    document.getElementById("product-modal-title").innerHTML = `<i data-lucide="edit-3"></i> Editar Producto`;
    document.getElementById("btn-save-product").textContent = "Guardar Cambios";
    
    lucide.createIcons();
}

async function handleDeleteProduct(productId) {
    const productIndex = appState.products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;

    const product = appState.products[productIndex];
    if (!await requirePassword(`eliminar el producto "${product.name}"`)) return;
    if (await showConfirm("Eliminar Producto", `¿Estás seguro de eliminar el producto "${product.name}" del inventario?`, "Eliminar", "Cancelar")) {
        appState.products.splice(productIndex, 1);
        saveState();
        renderInventory();
        showToast("Producto eliminado.", "info");
    }
}

// --- VISTA 3: CAJA Y TRANSACCIONES (RENDERING) ---
function renderTransactions() {
    const tbody = document.getElementById("transactions-tbody");
    tbody.innerHTML = "";

    const searchVal = document.getElementById("transaction-search").value.toLowerCase();
    const typeVal = document.getElementById("transaction-filter-type").value;
    const monthVal = document.getElementById("transaction-filter-month").value;

    // Poblar dinámicamente el dropdown de meses
    populateTransactionMonthsDropdown(monthVal);

    // Filtrar y ordenar
    const filteredTx = appState.transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchVal) || t.category.toLowerCase().includes(searchVal);
        const matchesType = typeVal === "all" || t.type === typeVal;
        
        const monthKey = t.date.substring(0, 7); // "YYYY-MM"
        const matchesMonth = monthVal === "all" || monthKey === monthVal;

        return matchesSearch && matchesType && matchesMonth;
    }).sort((a, b) => new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00')); // Recientes primero

    if (filteredTx.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">No se encontraron movimientos financieros con los filtros aplicados.</td>
            </tr>
        `;
        return;
    }

    filteredTx.forEach(t => {
        const isIncome = t.type === "ingreso";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Fecha">${t.date.split('-').reverse().join('/')}</td>
            <td style="text-transform: capitalize;" data-label="Mes">${getMonthNameSpanish(t.date)}</td>
            <td data-label="Tipo">
                <span class="row-type-badge ${isIncome ? 'row-type-ingreso' : 'row-type-egreso'}">
                    <i data-lucide="${isIncome ? 'arrow-up-right' : 'arrow-down-left'}"></i>
                    ${isIncome ? 'Ingreso' : 'Gasto'}
                </span>
            </td>
            <td class="product-cell" style="font-weight: 500;">${t.description}</td>
            <td data-label="Categoría">${t.category}</td>
            <td class="text-right font-semibold ${isIncome ? 'text-success' : 'text-danger'}" data-label="Monto">
                ${isIncome ? '+' : '-'}${formatCurrency(t.value)}
            </td>
            <td class="table-actions-cell">
                <button class="btn-sm-icon text-danger" onclick="handleDeleteTransaction('${t.id}')" title="Eliminar movimiento">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    setupTransactionSearchListeners();
}

function populateTransactionMonthsDropdown(selectedValue) {
    const dropdown = document.getElementById("transaction-filter-month");
    
    // Obtener meses únicos con datos
    const months = new Set();
    // Forzar meses del excel en las opciones
    months.add("2023-01");
    months.add("2023-02");
    months.add("2023-03");

    appState.transactions.forEach(t => {
        months.add(t.date.substring(0, 7));
    });

    // Ordenar descendente
    const sortedMonths = Array.from(months).sort().reverse();
    
    // Mantener la opción 'all'
    dropdown.innerHTML = '<option value="all">Todos los Meses</option>';
    
    sortedMonths.forEach(m => {
        const parts = m.split('-');
        const dateObj = new Date(parts[0], parts[1] - 1, 1);
        const name = dateObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        
        const isSelected = m === selectedValue ? 'selected' : '';
        dropdown.innerHTML += `<option value="${m}" ${isSelected} style="text-transform: capitalize;">${name}</option>`;
    });
}

function setupTransactionSearchListeners() {
    const search = document.getElementById("transaction-search");
    const type = document.getElementById("transaction-filter-type");
    const month = document.getElementById("transaction-filter-month");

    search.removeEventListener("input", renderTransactions);
    type.removeEventListener("change", renderTransactions);
    month.removeEventListener("change", renderTransactions);

    search.addEventListener("input", renderTransactions);
    type.addEventListener("change", renderTransactions);
    month.addEventListener("change", renderTransactions);
}

async function handleDeleteTransaction(txId) {
    const txIndex = appState.transactions.findIndex(t => t.id === txId);
    if (txIndex === -1) return;

    const tx = appState.transactions[txIndex];
    if (!await requirePassword(`eliminar el movimiento "${tx.description}"`)) return;
    if (await showConfirm("Eliminar Movimiento", `¿Estás seguro de eliminar el registro de "${tx.description}" por valor de ${formatCurrency(tx.value)}?`, "Eliminar", "Cancelar")) {
        
        // Si el registro de venta o reabastecimiento estaba vinculado a un producto, podemos reestablecer el stock?
        // Es más seguro advertir que no se recalculará automáticamente el stock para evitar inconsistencias históricas
        if (tx.productId) {
            const product = appState.products.find(p => p.id === tx.productId);
            if (product) {
                if (tx.type === "ingreso") {
                    // Era una venta. Cancelarla debería DEVOLVER el stock
                    if (await showConfirm("Devolver Stock", `Este movimiento proviene de una venta del producto "${product.name}". ¿Deseas devolver las ${tx.qty} unidades al inventario?`, "Devolver Stock", "No Devolver")) {
                        product.stock += tx.qty;
                    }
                } else if (tx.type === "egreso" && tx.description.includes("REABASTECIMIENTO")) {
                    // Era un reabastecimiento. Cancelarlo debería QUITAR el stock
                    if (await showConfirm("Ajustar Stock", `Este movimiento proviene de un reabastecimiento del producto "${product.name}". ¿Deseas restar las ${tx.qty} unidades de su stock?`, "Restar Stock", "No Restar")) {
                        product.stock = Math.max(0, product.stock - tx.qty);
                    }
                }
            }
        }

        appState.transactions.splice(txIndex, 1);
        saveState();
        renderTransactions();
        showToast("Movimiento financiero eliminado.", "info");
    }
}

// --- VISTA 4: INFORME Y REPORTES (RENDERING Y GRÁFICOS) ---
function renderReports() {
    // 1. Obtener Periodo Activo
    const activePeriodBtn = document.querySelector(".period-selectors .btn.active");
    const period = activePeriodBtn ? activePeriodBtn.getAttribute("data-period") : "anual";

    // Filtrar transacciones del periodo
    let filteredTx = [];
    const now = new Date();
    
    // Texto de información
    const infoPeriodEl = document.getElementById("report-period-info");

    if (period === "diario") {
        // Solo el día de hoy
        const todayStr = now.toISOString().substring(0, 10); // "YYYY-MM-DD"
        filteredTx = appState.transactions.filter(t => t.date === todayStr);
        const todayFormatted = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        infoPeriodEl.textContent = `Visualizando movimientos de hoy: ${todayFormatted}.`;
        if (filteredTx.length === 0) {
            infoPeriodEl.textContent += " (Sin movimientos registrados hoy.)";
        }
    } else if (period === "semanal") {
        // Últimos 7 días
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        filteredTx = appState.transactions.filter(t => new Date(t.date + 'T00:00:00') >= sevenDaysAgo);
        infoPeriodEl.textContent = `Visualizando balance dinámico semanal (Últimos 7 días).`;
    } else if (period === "mensual") {
        // Mes actual
        const currentYearMonth = now.toISOString().substring(0, 7); // "YYYY-MM"
        filteredTx = appState.transactions.filter(t => t.date.substring(0, 7) === currentYearMonth);
        infoPeriodEl.textContent = `Visualizando balance del mes actual: ${getMonthNameSpanish(now.toISOString().substring(0, 10))}.`;
    } else {
        // Anual consolidado
        const currentYear = now.getFullYear();
        filteredTx = appState.transactions.filter(t => new Date(t.date + 'T00:00:00').getFullYear() === currentYear);
        // Si no hay transacciones en el año actual 2026, mostramos por defecto todo el historial (ej: 2023)
        if (filteredTx.length === 0) {
            filteredTx = [...appState.transactions];
            infoPeriodEl.textContent = `Visualizando balance consolidado total (Historial Completo).`;
        } else {
            infoPeriodEl.textContent = `Visualizando balance consolidado del año actual (${currentYear}).`;
        }
    }

    // 2. Calcular KPIs de Reporte
    let periodIncome = 0;
    let periodExpense = 0;
    const productSalesCount = {}; // {productId: qty}

    filteredTx.forEach(t => {
        if (t.type === "ingreso") {
            periodIncome += t.value;
            if (t.productId && t.qty) {
                productSalesCount[t.productId] = (productSalesCount[t.productId] || 0) + t.qty;
            }
        } else {
            periodExpense += t.value;
        }
    });

    const netProfit = periodIncome - periodExpense;

    // Encontrar producto más vendido
    let topProductId = null;
    let topProductQty = 0;
    for (const pid in productSalesCount) {
        if (productSalesCount[pid] > topProductQty) {
            topProductQty = productSalesCount[pid];
            topProductId = pid;
        }
    }

    let topProductName = "-";
    if (topProductId) {
        const pObj = appState.products.find(p => p.id === topProductId);
        if (pObj) topProductName = pObj.name;
    }

    // Calcular margen de ganancia promedio del inventario actual
    let avgMarginPct = 0;
    let validProducts = 0;
    appState.products.forEach(p => {
        if (p.costPrice > 0) {
            avgMarginPct += ((p.sellingPrice - p.costPrice) / p.sellingPrice * 100);
            validProducts++;
        }
    });
    const finalAvgMargin = validProducts > 0 ? (avgMarginPct / validProducts).toFixed(1) : "0.0";

    // Pintar KPIs en pantalla
    document.getElementById("report-margin-pct").textContent = `${finalAvgMargin}%`;
    
    const profitEl = document.getElementById("report-net-profit");
    profitEl.textContent = formatCurrency(netProfit);
    if (netProfit < 0) {
        profitEl.className = "text-danger";
    } else {
        profitEl.className = "text-success";
    }

    document.getElementById("report-top-product").textContent = topProductName;
    document.getElementById("report-top-product-qty").textContent = topProductId ? `${topProductQty} unidades vendidas` : '0 unidades';

    // 3. Renderizar Tabla de Resumen Mensual (Última sección de reportes)
    renderReportsSummaryTable();

    // 4. Renderizar Gráficos de Reportes
    renderReportsCharts(filteredTx);

    // Registrar escuchadores de periodo
    setupPeriodSelectors();
}

function setupPeriodSelectors() {
    const buttons = document.querySelectorAll(".period-selectors .btn");
    buttons.forEach(btn => {
        btn.removeEventListener("click", handlePeriodChange);
        btn.addEventListener("click", handlePeriodChange);
    });
}

function handlePeriodChange(e) {
    const buttons = document.querySelectorAll(".period-selectors .btn");
    buttons.forEach(b => b.classList.remove("active"));
    
    e.currentTarget.classList.add("active");
    renderReports();
}

function renderReportsSummaryTable() {
    const tbody = document.getElementById("monthly-summary-tbody");
    tbody.innerHTML = "";

    const monthlyData = {};
    
    // Obtener meses desde transacciones
    appState.transactions.forEach(t => {
        const mKey = t.date.substring(0, 7); // "YYYY-MM"
        if (!monthlyData[mKey]) {
            monthlyData[mKey] = { ingresos: 0, gastos: 0 };
        }
        if (t.type === "ingreso") {
            monthlyData[mKey].ingresos += t.value;
        } else {
            monthlyData[mKey].gastos += t.value;
        }
    });

    const sortedMonths = Object.keys(monthlyData).sort().reverse(); // Recientes primero

    if (sortedMonths.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Sin datos suficientes.</td></tr>`;
        return;
    }

    sortedMonths.forEach(m => {
        const data = monthlyData[m];
        const res = data.ingresos - data.gastos;
        const isProfit = res >= 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-transform: capitalize; font-weight: 600;" class="product-cell">${getMonthNameSpanish(m + '-01')}</td>
            <td class="text-right text-success" data-label="Ingresos">${formatCurrency(data.ingresos)}</td>
            <td class="text-right text-danger" data-label="Gastos">${formatCurrency(data.gastos)}</td>
            <td class="text-right font-semibold ${isProfit ? 'text-success' : 'text-danger'}" data-label="Resultado">${formatCurrency(res)}</td>
            <td class="text-center" data-label="Estado">
                <span class="badge ${isProfit ? 'badge-success' : 'badge-danger'}">
                    ${isProfit ? 'Superávit' : 'Déficit'}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderReportsCharts(filteredTransactions) {
    const isDark = document.body.classList.contains("dark-theme");
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // --- GRÁFICO 1: FLUJO FINANCIERO HISTORICO ---
    const ctxFlow = document.getElementById("chart-reports-flow").getContext("2d");
    
    // Agrupar por mes
    const monthlyGroups = {};
    filteredTransactions.forEach(t => {
        const mKey = t.date.substring(0, 7);
        if (!monthlyGroups[mKey]) monthlyGroups[mKey] = { ingresos: 0, gastos: 0 };
        if (t.type === "ingreso") monthlyGroups[mKey].ingresos += t.value;
        else monthlyGroups[mKey].gastos += t.value;
    });

    const sortedMonths = Object.keys(monthlyGroups).sort();
    const labels = sortedMonths.map(m => {
        const parts = m.split('-');
        return new Date(parts[0], parts[1]-1, 1).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    });
    const datasetInc = sortedMonths.map(m => monthlyGroups[m].ingresos);
    const datasetExp = sortedMonths.map(m => monthlyGroups[m].gastos);

    if (reportsFlowChartInstance) reportsFlowChartInstance.destroy();
    
    reportsFlowChartInstance = new Chart(ctxFlow, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: datasetInc,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Gastos',
                    data: datasetExp,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor, font: { family: 'Inter' } } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: textColor } },
                y: { 
                    grid: { color: gridColor }, 
                    ticks: { 
                        color: textColor,
                        callback: value => formatCurrency(value)
                    } 
                }
            }
        }
    });

    // --- GRÁFICO 2: DISTRIBUCIÓN DE GASTOS (PIE) ---
    const ctxPie = document.getElementById("chart-reports-expenses-pie").getContext("2d");
    
    const categoryExpenses = {};
    // Llenar con todas las categorías de gasto conocidas con 0
    EXPENSE_CATEGORIES.forEach(c => categoryExpenses[c] = 0);

    filteredTransactions.forEach(t => {
        if (t.type === "egreso") {
            categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.value;
        }
    });

    // Filtrar categorías con valor > 0
    const pieLabels = [];
    const pieData = [];
    for (const cat in categoryExpenses) {
        if (categoryExpenses[cat] > 0) {
            pieLabels.push(cat);
            pieData.push(categoryExpenses[cat]);
        }
    }

    if (reportsExpensesChartInstance) reportsExpensesChartInstance.destroy();

    // Colores atractivos HSL
    const colorPalette = [
        '#ef4444', // Red
        '#f97316', // Orange
        '#f59e0b', // Amber
        '#eab308', // Yellow
        '#84cc16', // Lime
        '#06b6d4', // Cyan
        '#3b82f6', // Blue
        '#6366f1', // Indigo
        '#8b5cf6', // Violet
        '#d946ef'  // Fuchsia
    ];

    if (pieData.length === 0) {
        // Dibujar un estado vacío
        reportsExpensesChartInstance = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Sin Gastos'],
                datasets: [{
                    data: [1],
                    backgroundColor: [isDark ? '#1e293b' : '#e2e8f0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor } },
                    tooltip: { enabled: false }
                }
            }
        });
    } else {
        reportsExpensesChartInstance = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: pieLabels,
                datasets: [{
                    data: pieData,
                    backgroundColor: colorPalette.slice(0, pieLabels.length),
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { 
                            color: textColor,
                            font: { family: 'Inter', size: 11 },
                            boxWidth: 12
                        } 
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- GRÁFICO 3: RENDIMIENTO POR CATEGORÍA DE PRODUCTOS ---
    const ctxBar = document.getElementById("chart-reports-products-bar").getContext("2d");
    
    const categorySales = {};
    PRODUCT_CATEGORIES.forEach(c => categorySales[c] = 0);

    filteredTransactions.forEach(t => {
        if (t.type === "ingreso" && t.productId) {
            const prod = appState.products.find(p => p.id === t.productId);
            if (prod) {
                categorySales[prod.category] = (categorySales[prod.category] || 0) + t.value;
            }
        }
    });

    const barLabels = Object.keys(categorySales);
    const barData = Object.values(categorySales);

    if (reportsProductsChartInstance) reportsProductsChartInstance.destroy();

    reportsProductsChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: barLabels,
            datasets: [{
                label: 'Ventas ($)',
                data: barData,
                backgroundColor: 'rgba(99, 102, 241, 0.75)',
                borderColor: '#6366f1',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y', // Convertir en barra horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { 
                    grid: { color: gridColor }, 
                    ticks: { 
                        color: textColor,
                        callback: value => formatCurrency(value)
                    } 
                },
                y: { grid: { display: false }, ticks: { color: textColor } }
            }
        }
    });
}

// --- VISTA 5: RESPALDO (RENDERING NO REQUIERE LÓGICA COMPLEJA) ---
function renderBackup() {
    // Los botones de backup se configuran estáticamente al iniciar el DOM, no requieren refresco dinámico
}

// --- EXPORTAR A CSV (COMPATIBLE CON EXCEL) ---
async function exportTransactionsToCSV() {
    // Encabezados en español
    let csvContent = "\uFEFF"; // BOM para soportar tildes en Excel de Windows
    csvContent += "Fecha,Mes,Tipo,Descripcion,Categoria,Valor\r\n";

    // Ordenar de más antiguas a más recientes para análisis secuencial
    const sortedTx = [...appState.transactions]
        .sort((a, b) => new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00'));

    sortedTx.forEach(t => {
        const row = [
            t.date.split('-').reverse().join('/'),
            getMonthNameSpanish(t.date),
            t.type.toUpperCase(),
            `"${t.description.replace(/"/g, '""')}"`,
            `"${t.category}"`,
            t.value.toFixed(2)
        ];
        csvContent += row.join(",") + "\r\n";
    });

    if (window.pywebview && window.pywebview.api) {
        const b64 = btoa(unescape(encodeURIComponent(csvContent)));
        const saved = await window.pywebview.api.save_file_native('control_finanzas_movimientos.csv', b64);
        if (saved) showToast("CSV guardado correctamente", "success");
        else showToast("Exportación CSV cancelada", "info");
    } else {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "control_finanzas_movimientos.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// --- NOTIFICACIONES Y ALERTAS PERSONALIZADAS ---
function showToast(message, type = 'success') {
    const container = document.getElementById("toast-container");
    if (!container) return;

    // Crear elemento toast
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    // Obtener icono de Lucide correspondiente
    let iconName = "check-circle";
    if (type === "error") iconName = "x-circle";
    else if (type === "warning") iconName = "alert-triangle";
    else if (type === "info") iconName = "info";

    toast.innerHTML = `
        <div class="toast-icon">
            <i data-lucide="${iconName}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);
    
    // Crear el icono de lucide
    lucide.createIcons();

    // Barra de progreso y eliminación automática
    const progressBar = toast.querySelector(".toast-progress");
    progressBar.style.transition = "width 3s linear";
    progressBar.style.width = "0%";
    
    setTimeout(() => {
        progressBar.style.width = "100%";
    }, 10);

    const closeBtn = toast.querySelector(".toast-close");
    
    const removeToast = () => {
        toast.classList.add("removing");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    };

    closeBtn.addEventListener("click", removeToast);

    // Auto-remove tras 3 segundos
    setTimeout(removeToast, 3000);
}


// --- VERIFICACIÓN DE CONTRASEÑA PARA ACCIONES DESTRUCTIVAS ---
function requirePassword(actionLabel = "esta acción") {
    return new Promise((resolve) => {
        // Crear el modal dinámicamente si no existe aún
        let modal = document.getElementById("modal-password-check");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "modal-password-check";
            modal.className = "modal";
            modal.innerHTML = `
                <div class="modal-content" style="max-width:400px">
                    <div class="modal-header">
                        <h3 id="pw-modal-title"><i data-lucide="shield-alert"></i> Verificación requerida</h3>
                        <button class="btn-icon" id="btn-pw-close"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body">
                        <p id="pw-modal-desc" style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;line-height:1.5"></p>
                        <div class="login-input-wrapper">
                            <i data-lucide="lock" class="input-icon"></i>
                            <input type="password" id="pw-modal-input" placeholder="Ingresá la contraseña del sistema"
                                autocomplete="off"
                                style="width:100%;padding:12px 44px;background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-sm);color:var(--text-main);font-family:var(--font-primary);font-size:0.95rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s;">
                            <button class="btn-toggle-pass" id="btn-pw-toggle" type="button">
                                <i data-lucide="eye"></i>
                            </button>
                        </div>
                        <p id="pw-modal-error" style="display:none;color:var(--danger);font-size:0.82rem;margin-top:10px;font-weight:500;">
                            ❌ Contraseña incorrecta. Intentá de nuevo.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="btn-pw-cancel">Cancelar</button>
                        <button class="btn btn-danger" id="btn-pw-confirm">
                            <i data-lucide="unlock"></i> Confirmar
                        </button>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }

        const input     = document.getElementById("pw-modal-input");
        const errorEl   = document.getElementById("pw-modal-error");
        const descEl    = document.getElementById("pw-modal-desc");
        const btnToggle = document.getElementById("btn-pw-toggle");
        const btnOk     = document.getElementById("btn-pw-confirm");
        const btnCancel = document.getElementById("btn-pw-cancel");
        const btnClose  = document.getElementById("btn-pw-close");

        // Resetear estado
        descEl.textContent = `Para ${actionLabel} necesitás confirmar tu identidad con la contraseña del sistema.`;
        input.value = "";
        input.type = "password";
        errorEl.style.display = "none";

        // Mostrar y enfocar
        modal.classList.add("active");
        setTimeout(() => input.focus(), 120);
        lucide.createIcons();

        // Toggle ojo
        const onToggle = () => {
            const isPass = input.type === "password";
            input.type = isPass ? "text" : "password";
            btnToggle.innerHTML = isPass ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
            lucide.createIcons();
        };

        const cleanup = (result) => {
            modal.classList.remove("active");
            btnOk.removeEventListener("click", onConfirm);
            btnCancel.removeEventListener("click", onCancel);
            btnClose.removeEventListener("click", onCancel);
            btnToggle.removeEventListener("click", onToggle);
            input.removeEventListener("keydown", onEnter);
            resolve(result);
        };

        const onConfirm = () => {
            if (input.value === APP_PASS) {
                cleanup(true);
            } else {
                errorEl.style.display = "block";
                input.value = "";
                input.focus();
            }
        };

        const onCancel = () => cleanup(false);
        const onEnter  = (e) => { if (e.key === "Enter") onConfirm(); };

        btnOk.addEventListener("click", onConfirm);
        btnCancel.addEventListener("click", onCancel);
        btnClose.addEventListener("click", onCancel);
        btnToggle.addEventListener("click", onToggle);
        input.addEventListener("keydown", onEnter);
    });
}

function showConfirm(title, message, confirmText = "Confirmar", cancelText = "Cancelar") {
    return new Promise((resolve) => {
        const modal = document.getElementById("modal-confirm");
        const titleEl = document.getElementById("confirm-title");
        const messageEl = document.getElementById("confirm-message");
        const btnOk = document.getElementById("btn-confirm-ok");
        const btnCancel = document.getElementById("btn-confirm-cancel");
        const btnClose = document.getElementById("btn-confirm-close");

        if (!modal) {
            // fallback
            resolve(window.confirm(message));
            return;
        }

        // Configurar contenido
        titleEl.innerHTML = `<i data-lucide="alert-triangle"></i> ${title}`;
        messageEl.textContent = message;
        btnOk.textContent = confirmText;
        btnCancel.textContent = cancelText;

        // Cargar iconos en el modal
        lucide.createIcons();

        // Mostrar modal
        modal.classList.add("active");

        // Eventos
        const cleanupAndClose = (result) => {
            btnOk.removeEventListener("click", onConfirm);
            btnCancel.removeEventListener("click", onCancel);
            if (btnClose) btnClose.removeEventListener("click", onCancel);
            modal.classList.remove("active");
            resolve(result);
        };

        const onConfirm = () => cleanupAndClose(true);
        const onCancel = () => cleanupAndClose(false);

        btnOk.addEventListener("click", onConfirm);
        btnCancel.addEventListener("click", onCancel);
        if (btnClose) btnClose.addEventListener("click", onCancel);
    });
}

function showRestockConfirm(productName, qty, totalCost) {
    return new Promise((resolve) => {
        const modal = document.getElementById("modal-restock-confirm");
        const messageEl = document.getElementById("restock-confirm-message");
        const btnExpense = document.getElementById("btn-restock-confirm-expense");
        const btnNoExpense = document.getElementById("btn-restock-confirm-no-expense");
        const btnCancel = document.getElementById("btn-restock-confirm-cancel");
        const btnClose = document.getElementById("btn-restock-confirm-close");

        if (!modal) {
            // fallback
            const val = window.confirm(`¿Deseas registrar esta reposición de ${productName} (x${qty}) por ${formatCurrency(totalCost)} como un Gasto en la caja?\n\nAceptar: Registrar como Gasto\nCancelar: Solo Reponer Stock (dinero aparte)`);
            resolve(val ? "expense" : "no-expense");
            return;
        }

        // Configurar mensaje dinámico
        messageEl.innerHTML = `Estás a punto de reponer <strong>${qty}</strong> unidades de <strong>${productName}</strong> con un costo total de <strong>${formatCurrency(totalCost)}</strong>.<br><br>¿Cómo deseas registrar esta reposición?`;

        // Mostrar modal
        modal.classList.add("active");
        lucide.createIcons();

        const cleanupAndClose = (result) => {
            btnExpense.removeEventListener("click", onExpense);
            btnNoExpense.removeEventListener("click", onNoExpense);
            btnCancel.removeEventListener("click", onCancel);
            if (btnClose) btnClose.removeEventListener("click", onCancel);
            modal.classList.remove("active");
            resolve(result);
        };

        const onExpense = () => cleanupAndClose("expense");
        const onNoExpense = () => cleanupAndClose("no-expense");
        const onCancel = () => cleanupAndClose("cancel");

        btnExpense.addEventListener("click", onExpense);
        btnNoExpense.addEventListener("click", onNoExpense);
        btnCancel.addEventListener("click", onCancel);
        if (btnClose) btnClose.addEventListener("click", onCancel);
    });
}


function setupExportHandlers() {
    document.getElementById("btn-export-pdf-report").addEventListener("click", exportTransactionsToPDF);
    document.getElementById("btn-export-pdf-inventory").addEventListener("click", exportInventoryToPDF);
    document.getElementById("btn-export-excel").addEventListener("click", exportToExcel);
}

async function exportTransactionsToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Movimientos de Caja", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

    const sortedTx = [...appState.transactions].sort((a, b) => new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00'));

    const tableData = sortedTx.map(t => [
        t.date.split('-').reverse().join('/'),
        getMonthNameSpanish(t.date),
        t.type === 'ingreso' ? 'Ingreso' : 'Gasto',
        t.description,
        t.category,
        formatCurrency(t.value)
    ]);

    doc.autoTable({
        head: [['Fecha', 'Mes', 'Tipo', 'Descripción', 'Categoría', 'Valor']],
        body: tableData,
        startY: 38,
        styles: { font: 'helvetica', fontSize: 9 },
        headStyles: { fillColor: [99, 102, 241] },
        alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    if (window.pywebview && window.pywebview.api) {
        const b64 = doc.output('datauristring').split('base64,')[1];
        const saved = await window.pywebview.api.save_file_native('reporte_movimientos.pdf', b64);
        if (saved) showToast("PDF guardado correctamente", "success");
        else showToast("Exportación a PDF cancelada", "info");
    } else {
        doc.save('reporte_movimientos.pdf');
        showToast("PDF generado correctamente", "success");
    }
}

async function exportInventoryToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.text("Inventario Completo", 14, 22);
    doc.setFontSize(11);
    doc.text(`Total productos: ${appState.products.length} | Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

    const tableData = appState.products.map(p => {
        const margin = p.costPrice > 0 ? ((p.sellingPrice - p.costPrice) / p.costPrice * 100).toFixed(0) : '0';
        return [
            p.id,
            p.name,
            p.category,
            formatCurrency(p.costPrice),
            formatCurrency(p.sellingPrice),
            `${margin}%`,
            p.stock,
            p.minStock
        ];
    });

    doc.autoTable({
        head: [['Código', 'Producto', 'Categoría', 'P. Costo', 'P. Venta', 'Margen', 'Stock', 'Min. Stock']],
        body: tableData,
        startY: 38,
        styles: { font: 'helvetica', fontSize: 8 },
        headStyles: { fillColor: [16, 185, 129] },
        alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    if (window.pywebview && window.pywebview.api) {
        const b64 = doc.output('datauristring').split('base64,')[1];
        const saved = await window.pywebview.api.save_file_native('inventario_completo.pdf', b64);
        if (saved) showToast("PDF guardado correctamente", "success");
        else showToast("Exportación a PDF cancelada", "info");
    } else {
        doc.save('inventario_completo.pdf');
        showToast("PDF generado correctamente", "success");
    }
}

async function exportToExcel() {
    const wb = XLSX.utils.book_new();

    const inventoryWS = XLSX.utils.json_to_sheet(appState.products.map(p => ({
        'Código': p.id,
        'Producto': p.name,
        'Categoría': p.category,
        'Precio Costo': p.costPrice,
        'Precio Venta': p.sellingPrice,
        'Stock': p.stock,
        'Stock Mínimo': p.minStock
    })));
    XLSX.utils.book_append_sheet(wb, inventoryWS, 'Inventario');

    const transactionsWS = XLSX.utils.json_to_sheet(appState.transactions.map(t => ({
        'Fecha': t.date.split('-').reverse().join('/'),
        'Mes': getMonthNameSpanish(t.date),
        'Tipo': t.type === 'ingreso' ? 'Ingreso' : 'Gasto',
        'Descripción': t.description,
        'Categoría': t.category,
        'Valor': t.value
    })));
    XLSX.utils.book_append_sheet(wb, transactionsWS, 'Movimientos');

    if (window.pywebview && window.pywebview.api) {
        const b64 = XLSX.write(wb, {bookType:'xlsx', type:'base64'});
        const saved = await window.pywebview.api.save_file_native('inventario_y_movimientos.xlsx', b64);
        if (saved) showToast("Archivo Excel guardado correctamente", "success");
        else showToast("Exportación a Excel cancelada", "info");
    } else {
        XLSX.writeFile(wb, 'inventario_y_movimientos.xlsx');
        showToast("Archivo Excel generado correctamente", "success");
    }
}

// --- MÓDULO DE PRÉSTAMOS Y COBROS ---
function setupLoanHandlers() {
    // Abrir Modal de Préstamo
    const btnNewLoan = document.getElementById("btn-new-loan");
    if (btnNewLoan) {
        btnNewLoan.addEventListener("click", () => {
            document.getElementById("form-loan").reset();
            document.getElementById("loan-date").value = new Date().toISOString().substring(0, 10);
            openModal("loan");
        });
    }

    // Calcular Total y Cuota en vivo
    const amountInput = document.getElementById("loan-amount");
    const interestInput = document.getElementById("loan-interest");
    const daysInput = document.getElementById("loan-days");
    const totalInput = document.getElementById("loan-total");
    const quotaInput = document.getElementById("loan-quota");

    function calculateLoan() {
        const amount = parseFloat(amountInput.value) || 0;
        const interest = parseFloat(interestInput.value) || 0;
        const days = parseInt(daysInput.value) || 1;
        
        const total = amount + (amount * (interest / 100));
        const quota = total / days;
        
        totalInput.value = total.toFixed(2);
        quotaInput.value = formatCurrency(quota) + " / día";
    }

    if (amountInput) amountInput.addEventListener("input", calculateLoan);
    if (interestInput) interestInput.addEventListener("input", calculateLoan);
    if (daysInput) daysInput.addEventListener("input", calculateLoan);

    // Guardar Préstamo
    const formLoan = document.getElementById("form-loan");
    if (formLoan) {
        formLoan.addEventListener("submit", (e) => {
            e.preventDefault();
            const date = document.getElementById("loan-date").value;
            const client = document.getElementById("loan-client").value;
            const amount = parseFloat(amountInput.value);
            const interest = parseFloat(interestInput.value);
            const total = parseFloat(totalInput.value);
            const days = parseInt(daysInput.value);
            
            const newLoan = {
                id: generateId("loan"),
                date: date,
                client: client,
                amount: amount,
                interest: interest,
                total: total,
                days: days,
                paid: 0,
                status: 'active'
            };
            if (!appState.loans) appState.loans = [];
            appState.loans.push(newLoan);
            saveState();
            
            closeModal("loan");
            renderLoans();
            refreshActiveView();
            showToast("Préstamo registrado correctamente", "success");
        });
    }

    // Guardar Pago
    const formPayment = document.getElementById("form-payment");
    if (formPayment) {
        formPayment.addEventListener("submit", (e) => {
            e.preventDefault();
            const loanId = document.getElementById("payment-loan-id").value;
            const date = document.getElementById("payment-date").value;
            const amount = parseFloat(document.getElementById("payment-amount").value);

            const loan = appState.loans.find(l => l.id === loanId);
            if (!loan) return;

            loan.paid += amount;
            if (loan.paid >= loan.total) {
                loan.status = 'paid';
            }
            saveState();
            
            closeModal("payment");
            renderLoans();
            refreshActiveView();
            showToast("Pago registrado correctamente", "success");
        });
    }

    // Filtros de búsqueda
    const searchInput = document.getElementById("loan-search");
    if (searchInput) searchInput.addEventListener("input", renderLoans);
    
    const filterStatus = document.getElementById("loan-filter-status");
    if (filterStatus) filterStatus.addEventListener("change", renderLoans);
}

function openPaymentModal(loanId) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan) return;
    
    document.getElementById("form-payment").reset();
    document.getElementById("payment-loan-id").value = loan.id;
    document.getElementById("payment-client-name").textContent = loan.client;
    document.getElementById("payment-date").value = new Date().toISOString().substring(0, 10);
    
    const quota = loan.total / loan.days;
    const remaining = loan.total - loan.paid;
    document.getElementById("payment-amount").value = Math.min(quota, remaining).toFixed(2);
    
    openModal("payment");
}

function renderLoans() {
    const tbody = document.getElementById("loans-tbody");
    if (!tbody) return;
    
    if (!appState.loans) appState.loans = [];

    // Calcular KPIs de préstamos
    let totalCapital = 0;
    let totalToCollect = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let activeLoansCount = 0;

    appState.loans.forEach(loan => {
        totalCollected += loan.paid;
        if (loan.status === 'active') {
            totalCapital += loan.amount;
            totalToCollect += loan.total;
            totalPending += (loan.total - loan.paid);
            activeLoansCount++;
        }
    });

    const kpiCapital = document.getElementById("loan-kpi-capital");
    const kpiCapitalSub = document.getElementById("loan-kpi-capital-sub");
    const kpiTotal = document.getElementById("loan-kpi-total");
    const kpiCollected = document.getElementById("loan-kpi-collected");
    const kpiPending = document.getElementById("loan-kpi-pending");

    if (kpiCapital) kpiCapital.textContent = formatCurrency(totalCapital);
    if (kpiCapitalSub) kpiCapitalSub.textContent = `${activeLoansCount} préstamo${activeLoansCount !== 1 ? 's' : ''} activo${activeLoansCount !== 1 ? 's' : ''}`;
    if (kpiTotal) kpiTotal.textContent = formatCurrency(totalToCollect);
    if (kpiCollected) kpiCollected.textContent = formatCurrency(totalCollected);
    if (kpiPending) kpiPending.textContent = formatCurrency(totalPending);

    const search = (document.getElementById("loan-search").value || "").toLowerCase();
    const statusFilter = document.getElementById("loan-filter-status").value || "all";

    let filtered = appState.loans.filter(loan => {
        const matchSearch = loan.client.toLowerCase().includes(search);
        const matchStatus = statusFilter === "all" || loan.status === statusFilter;
        return matchSearch && matchStatus;
    });

    tbody.innerHTML = "";

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No se encontraron préstamos.</td></tr>`;
        return;
    }

    filtered.forEach(loan => {
        const remaining = loan.total - loan.paid;
        const quota = loan.total / loan.days;
        
        let statusBadge = '';
        if (loan.status === 'paid') {
            statusBadge = `<span class="badge badge-success">Pagado</span>`;
        } else {
            statusBadge = `<span class="badge badge-warning">Activo</span>`;
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${loan.date.split('-').reverse().join('/')}</td>
            <td><strong>${loan.client}</strong></td>
            <td class="text-right text-danger">${formatCurrency(loan.amount)}</td>
            <td class="text-right">${formatCurrency(loan.total)}</td>
            <td class="text-right fw-bold text-warning">${formatCurrency(remaining)}</td>
            <td class="text-center">${formatCurrency(quota)}</td>
            <td class="text-center">${statusBadge}</td>
            <td class="text-center">
                ${loan.status !== 'paid' ? `<button class="btn-icon btn-pay text-success" title="Registrar Pago" data-id="${loan.id}"><i data-lucide="dollar-sign"></i></button>` : '-'}
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll(".btn-pay").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            openPaymentModal(id);
        });
    });

    lucide.createIcons();
}

