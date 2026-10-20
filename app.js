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
    loans: [],
    stockEntries: []
};

let activeDashModule = 'store';

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

// ==========================================================================
// GESTOR DE SINCRONIZACIÓN OFFLINE-FIRST CON NEON POSTGRES (VERCEL)
// ==========================================================================
const CloudSync = {
    isOnline: navigator.onLine,
    isCloudConnected: false,
    pollInterval: null,
    isSyncing: false,
    syncQueueKey: "silvio_pending_sync_queue",

    getQueue() {
        try {
            return JSON.parse(localStorage.getItem(this.syncQueueKey) || "[]");
        } catch (e) {
            return [];
        }
    },

    saveQueue(queue) {
        localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
        this.updateStatusBadge();
    },

    addToQueue(action, payload) {
        const queue = this.getQueue();
        queue.push({
            id: "sync-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
            action,
            payload,
            timestamp: new Date().toISOString()
        });
        this.saveQueue(queue);
    },

    async init() {
        this.setupListeners();
        await this.checkConnectionAndSync();
        this.startPolling();
    },

    setupListeners() {
        window.addEventListener("online", async () => {
            this.isOnline = true;
            this.updateStatusBadge();
            showToast("Conexión a internet restablecida. Sincronizando datos...", "info");
            await this.processQueue();
            await this.fetchUpdates();
        });

        window.addEventListener("offline", () => {
            this.isOnline = false;
            this.updateStatusBadge();
            showToast("Sin conexión a internet. Todas las ventas se guardan en tu equipo y se subirán solas al volver la luz/red.", "warning");
        });

        window.addEventListener("focus", () => {
            if (this.isOnline) {
                this.checkConnectionAndSync();
            }
        });

        // Al hacer clic en la insignia, explicar el estado
        const badge = document.getElementById("cloud-sync-badge");
        if (badge) {
            badge.style.cursor = "pointer";
            badge.addEventListener("click", () => {
                const q = this.getQueue().length;
                if (!this.isOnline) {
                    showToast(`Modo Sin Internet: Tienes ${q} operaciones guardadas localmente. Se subirán solas cuando vuelva la red.`, "warning");
                } else if (this.isCloudConnected) {
                    showToast("🟢 Conectado en vivo a Neon Postgres. Tu celular y laptop están sincronizados.", "success");
                } else {
                    showToast("Operando en modo local (sin base de datos en la nube).", "info");
                }
            });
        }
    },

    updateStatusBadge() {
        const badge = document.getElementById("cloud-sync-badge");
        if (!badge) return;

        const queueCount = this.getQueue().length;

        if (!this.isOnline) {
            badge.className = "cloud-sync-badge offline";
            badge.innerHTML = `<span class="status-dot warning"></span><span>Sin conexión (${queueCount > 0 ? queueCount + ' guardadas' : 'Local'})</span>`;
            badge.title = "Operando sin internet. Tus ventas se guardan seguras en el equipo.";
        } else if (queueCount > 0) {
            badge.className = "cloud-sync-badge offline";
            badge.innerHTML = `<span class="status-dot warning"></span><span>Subiendo ${queueCount} operaciones...</span>`;
            badge.title = "Sincronizando operaciones pendientes con Neon Postgres...";
        } else if (this.isCloudConnected) {
            badge.className = "cloud-sync-badge online";
            badge.innerHTML = '<span class="status-dot success"></span><span>Nube Neon (En vivo)</span>';
            badge.title = "Conectado a Neon Postgres. Todo sincronizado en vivo.";
        } else {
            badge.className = "cloud-sync-badge local";
            badge.innerHTML = '<span class="status-dot neutral"></span><span>Modo Local</span>';
            badge.title = "Operando con almacenamiento local.";
        }
    },

    async checkConnectionAndSync() {
        if (!this.isOnline) {
            this.updateStatusBadge();
            return;
        }

        try {
            const res = await fetch("/api/data", { method: "GET", cache: "no-store" });
            if (!res.ok) {
                this.isCloudConnected = false;
                this.updateStatusBadge();
                return;
            }
            const json = await res.json();

            if (json.connected) {
                this.isCloudConnected = true;

                // Primero subir cualquier venta guardada durante el corte de luz
                await this.processQueue();

                const hasCloudProducts = Array.isArray(json.data.products) && json.data.products.length > 0;
                const hasLocalProducts = Array.isArray(appState.products) && appState.products.length > 0;

                if (!hasCloudProducts && hasLocalProducts) {
                    console.log("Sembrando datos iniciales en Neon Postgres...");
                    await this.pushFullState(appState);
                } else if (hasCloudProducts) {
                    const queue = this.getQueue();
                    if (queue.length === 0) {
                        appState = {
                            products: json.data.products || [],
                            transactions: json.data.transactions || [],
                            stockEntries: json.data.stockEntries || [],
                            loans: json.data.loans || [],
                            categories: json.data.categories || ["Ropa", "Calzado", "Perfumes", "Accesorios", "Otros"]
                        };
                        saveState();
                        refreshActiveView();
                    }
                }
            } else {
                this.isCloudConnected = false;
            }
            this.updateStatusBadge();
        } catch (e) {
            this.isCloudConnected = false;
            this.updateStatusBadge();
        }
    },

    async processQueue() {
        let queue = this.getQueue();
        if (queue.length === 0 || !this.isOnline || !this.isCloudConnected) return;

        const totalToSync = queue.length;
        let syncedCount = 0;
        const failedItems = [];

        for (const item of queue) {
            try {
                let success = false;
                if (item.action === "sale") {
                    const res = await fetch("/api/sale", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item.payload)
                    });
                    success = res.ok;
                } else if (item.action === "expense") {
                    const res = await fetch("/api/expense", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item.payload)
                    });
                    success = res.ok;
                } else if (item.action === "product") {
                    const res = await fetch("/api/product", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item.payload)
                    });
                    success = res.ok;
                } else if (item.action === "deleteProduct") {
                    const res = await fetch("/api/product", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item.payload)
                    });
                    success = res.ok;
                } else if (item.action === "restock") {
                    const res = await fetch("/api/restock", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item.payload)
                    });
                    success = res.ok;
                } else if (item.action === "loan") {
                    const res = await fetch("/api/loan", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item.payload)
                    });
                    success = res.ok;
                } else if (item.action === "deleteLoan") {
                    const res = await fetch("/api/loan", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(item.payload)
                    });
                    success = res.ok;
                }

                if (success) {
                    syncedCount++;
                } else {
                    failedItems.push(item);
                }
            } catch (err) {
                failedItems.push(item);
            }
        }

        this.saveQueue(failedItems);

        if (syncedCount > 0) {
            showToast(`¡Conexión restaurada! Se sincronizaron ${syncedCount} operaciones con la nube sin pérdida de datos.`, "success");
            await this.fetchUpdates();
        }
    },

    async fetchUpdates() {
        if (this.isSyncing || !this.isCloudConnected || !this.isOnline) return;
        const queue = this.getQueue();
        if (queue.length > 0) {
            await this.processQueue();
            return;
        }

        this.isSyncing = true;
        try {
            const res = await fetch("/api/data", { method: "GET", cache: "no-store" });
            if (res.ok) {
                const json = await res.json();
                if (json.connected && json.data) {
                    appState = {
                        products: json.data.products || [],
                        transactions: json.data.transactions || [],
                        stockEntries: json.data.stockEntries || [],
                        loans: json.data.loans || [],
                        categories: json.data.categories || appState.categories
                    };
                    saveState();
                    refreshActiveView();
                }
            }
        } catch (e) {
            // Silencioso
        } finally {
            this.isSyncing = false;
        }
    },

    startPolling() {
        if (this.pollInterval) clearInterval(this.pollInterval);
        this.pollInterval = setInterval(() => {
            if (this.isOnline && this.isCloudConnected && !document.hidden) {
                this.fetchUpdates();
            }
        }, 10000);
    },

    async pushFullState(state) {
        try {
            const res = await fetch("/api/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(state)
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    },

    async recordSale(txData) {
        if (!this.isOnline || !this.isCloudConnected) {
            this.addToQueue("sale", txData);
            return;
        }
        try {
            const res = await fetch("/api/sale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(txData)
            });
            if (!res.ok) throw new Error("Status " + res.status);
        } catch (e) {
            console.warn("Fallo de red, guardando venta en cola offline:", e);
            this.addToQueue("sale", txData);
        }
    },

    async recordExpense(txData) {
        if (!this.isOnline || !this.isCloudConnected) {
            this.addToQueue("expense", txData);
            return;
        }
        try {
            const res = await fetch("/api/expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(txData)
            });
            if (!res.ok) throw new Error("Status " + res.status);
        } catch (e) {
            console.warn("Fallo de red, guardando gasto en cola offline:", e);
            this.addToQueue("expense", txData);
        }
    },

    async saveProduct(prodData) {
        if (!this.isOnline || !this.isCloudConnected) {
            this.addToQueue("product", prodData);
            return;
        }
        try {
            const res = await fetch("/api/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prodData)
            });
            if (!res.ok) throw new Error("Status " + res.status);
        } catch (e) {
            this.addToQueue("product", prodData);
        }
    },

    async deleteProduct(prodId) {
        if (!this.isOnline || !this.isCloudConnected) {
            this.addToQueue("deleteProduct", { id: prodId });
            return;
        }
        try {
            const res = await fetch("/api/product", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: prodId })
            });
            if (!res.ok) throw new Error("Status " + res.status);
        } catch (e) {
            this.addToQueue("deleteProduct", { id: prodId });
        }
    },

    async recordRestock(entry, expenseTx) {
        const payload = { entry, expenseTx };
        if (!this.isOnline || !this.isCloudConnected) {
            this.addToQueue("restock", payload);
            return;
        }
        try {
            const res = await fetch("/api/restock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Status " + res.status);
        } catch (e) {
            this.addToQueue("restock", payload);
        }
    },

    async saveLoan(loanData) {
        if (!this.isOnline || !this.isCloudConnected) {
            this.addToQueue("loan", loanData);
            return;
        }
        try {
            const res = await fetch("/api/loan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loanData)
            });
            if (!res.ok) throw new Error("Status " + res.status);
        } catch (e) {
            this.addToQueue("loan", loanData);
        }
    },

    async deleteLoan(loanId) {
        if (!this.isOnline || !this.isCloudConnected) {
            this.addToQueue("deleteLoan", { id: loanId });
            return;
        }
        try {
            const res = await fetch("/api/loan", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: loanId })
            });
            if (!res.ok) throw new Error("Status " + res.status);
        } catch (e) {
            this.addToQueue("deleteLoan", { id: loanId });
        }
    }
};


function initApp() {
    // 1. Cargar Datos
    loadState();

    // Iniciar Sincronización en la Nube (Neon Postgres / Vercel)
    if (typeof CloudSync !== 'undefined' && CloudSync.init) {
        CloudSync.init();
    }
    
    // 2. Traducir/Establecer fecha de cabecera
    updateHeaderDate();

    // 3. Registrar eventos de navegación
    setupNavigation();

    // 4. Registrar controladores de formularios y botones
    setupFormHandlers();
    setupLoanHandlers();
    setupQuickActionModals();
    setupThemeToggle();
    setupProductHistoryListeners();
    setupEditStockEntryForm();

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
            if (!appState.stockEntries) appState.stockEntries = [];

            // Filtrar y eliminar transacciones de préstamos registradas previamente en la Caja de la tienda
            appState.transactions = appState.transactions.filter(t => {
                if (t.loanId) return false;
                if (t.description && t.description.toUpperCase().includes("PRESTAMO")) return false;
                if (t.category === "Préstamos" || t.category === "Prestamos") return false;
                return true;
            });
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
    appState.stockEntries = DEMO_PRODUCTS.map(p => ({
        id: "entry-" + p.id,
        type: "nuevo_producto",
        productId: p.id,
        productName: p.name,
        category: p.category,
        qty: p.stock,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
        date: new Date().toISOString(),
        txId: null
    }));
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
        appState.stockEntries = [];
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
    // Reset horizontal table scrolls
    document.querySelectorAll(".table-container").forEach(c => c.scrollLeft = 0);
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
    if (document.getElementById("modal-product-history")?.classList.contains("active")) {
        renderProductHistory();
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
function activateModal(modalOrId) {
    const modal = typeof modalOrId === "string" 
        ? (modalOrId.startsWith("modal-") ? document.getElementById(modalOrId) : document.getElementById(`modal-${modalOrId}`))
        : modalOrId;
    if (!modal) return;
    const activeModals = document.querySelectorAll(".modal.active");
    const nextZIndex = 100 + (activeModals.length * 10);
    modal.style.zIndex = nextZIndex;
    modal.classList.add("active");
}

function deactivateModal(modalOrId) {
    const modal = typeof modalOrId === "string" 
        ? (modalOrId.startsWith("modal-") ? document.getElementById(modalOrId) : document.getElementById(`modal-${modalOrId}`))
        : modalOrId;
    if (!modal) return;
    modal.classList.remove("active");
    modal.style.zIndex = "";
}

function setupQuickActionModals() {
    const closeButtons = document.querySelectorAll(".modal-close");
    
    // Botones de Abrir
    document.getElementById("btn-quick-sale").addEventListener("click", () => openModal("sale"));
    document.getElementById("btn-quick-expense").addEventListener("click", () => openModal("expense"));
    const btnHistory = document.getElementById("btn-history-products");
    if (btnHistory) {
        btnHistory.addEventListener("click", () => openModal("product-history"));
    }

    // Botones de Cerrar: cierra específicamente el modal al que pertenece el botón
    closeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const parentModal = btn.closest(".modal");
            if (parentModal) {
                deactivateModal(parentModal);
            } else {
                const activeModals = document.querySelectorAll(".modal.active");
                if (activeModals.length > 0) {
                    deactivateModal(activeModals[activeModals.length - 1]);
                }
            }
        });
    });

    // Cerrar haciendo clic en el fondo oscuro del modal específico que recibió el clic
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            deactivateModal(e.target);
        }
    });

    // Cerrar con Escape el modal que se encuentra más arriba
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const activeModals = document.querySelectorAll(".modal.active");
            if (activeModals.length > 0) {
                deactivateModal(activeModals[activeModals.length - 1]);
            }
        }
    });
}

function openModal(modalName) {
    const modal = document.getElementById(`modal-${modalName}`);
    if (modal) {
        activateModal(modal);
        
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
        } else if (modalName === "product-history") {
            renderProductHistory();
        } else if (modalName === "product") {
            // El formulario del producto se maneja directo en setupFormHandlers para diferenciar NEW vs EDIT
        }
        
        lucide.createIcons();
    }
}

function closeModal(modalName) {
    deactivateModal(modalName);
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
            qty: prodId ? qty : null,
            // Se congela el costo del producto al momento de la venta para que la
            // ganancia histórica no cambie si después se edita el precio de costo
            unitCost: prodId ? appState.products.find(p => p.id === prodId).costPrice : null
        };
        
        appState.transactions.push(newTx);
        saveState();
        CloudSync.recordSale(newTx);
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
        CloudSync.recordExpense(newTx);
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
            if (product.initialStock === undefined) {
                product.initialStock = stock;
            }
            showToast("Producto actualizado correctamente.", "success");
        } else {
            // Nuevo Producto
            const now = new Date();
            const newProduct = {
                id: generateId("prod"),
                name,
                category,
                costPrice,
                sellingPrice,
                stock,
                initialStock: stock,
                minStock,
                createdAt: now.toISOString()
            };
            appState.products.push(newProduct);

            // Registrar en historial de ingresos de mercancía
            if (!appState.stockEntries) appState.stockEntries = [];
            const entry = {
                id: generateId("entry"),
                type: "nuevo_producto",
                productId: newProduct.id,
                productName: newProduct.name,
                category: newProduct.category,
                qty: stock,
                costPrice: costPrice,
                sellingPrice: sellingPrice,
                date: now.toISOString(),
                txId: null
            };
            appState.stockEntries.unshift(entry);

            showToast("Producto añadido al inventario.", "success");
        }

        saveState();
        const savedProd = appState.products.find(p => p.id === (prodId || (typeof newProduct !== 'undefined' ? newProduct.id : '')));
        if (savedProd && typeof CloudSync !== 'undefined') CloudSync.saveProduct(savedProd);
        closeModal("product");
        refreshActiveView();
        if (document.getElementById("modal-product-history")?.classList.contains("active")) {
            renderProductHistory();
        }
    });

    // Abrir modal de añadir producto
    document.getElementById("btn-add-product").addEventListener("click", () => {
        document.getElementById("form-product").reset();
        document.getElementById("product-id").value = "";
        document.getElementById("product-modal-title").innerHTML = `<i data-lucide="package-plus"></i> Añadir Nuevo Producto`;
        document.getElementById("btn-save-product").textContent = "Guardar Producto";
        
        // Habilitar la edición de stock inicial al crear
        document.getElementById("product-stock").disabled = false;
        const unlockWrapper = document.getElementById("stock-unlock-wrapper");
        if (unlockWrapper) unlockWrapper.style.display = "none";
        
        openModal("product");
    });

    // Desbloquear campo de stock en modo edición si hubo error de tipeo
    const btnUnlockStock = document.getElementById("btn-unlock-stock");
    if (btnUnlockStock) {
        btnUnlockStock.addEventListener("click", (e) => {
            e.preventDefault();
            const inputStock = document.getElementById("product-stock");
            inputStock.disabled = false;
            inputStock.focus();
            showToast("Campo de stock desbloqueado para corregir error de tipeo.", "info");
        });
    }

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
            
            let newTxId = null;
            if (choice === "expense") {
                // Registrar egreso por compra de mercancía
                newTxId = generateId("tx");
                const newTx = {
                    id: newTxId,
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

            // Registrar en historial de ingresos de mercancía
            if (!appState.stockEntries) appState.stockEntries = [];
            const now = new Date();
            const entry = {
                id: generateId("entry"),
                type: "reabastecimiento",
                productId: prodId,
                productName: product.name,
                category: product.category,
                qty: qty,
                costPrice: costPrice,
                sellingPrice: product.sellingPrice,
                date: now.toISOString(),
                txId: newTxId
            };
            appState.stockEntries.unshift(entry);
            
            saveState();
            CloudSync.recordRestock(entry, choice === "expense" ? newTx : null);
            closeModal("restock");
            refreshActiveView();
            if (document.getElementById("modal-product-history")?.classList.contains("active")) {
                renderProductHistory();
            }
            
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
                        // Si el respaldo no incluye historial previo de ingresos, arrancar con lista limpia
                        if (!Array.isArray(appState.stockEntries)) {
                            appState.stockEntries = [];
                        } else {
                            // Limpiar cualquier entrada artificial previa si existiera
                            appState.stockEntries = appState.stockEntries.filter(e => !e.id.startsWith("entry-prod-"));
                        }
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

// --- FUNCIONES DE SINCRONIZACIÓN MÓVIL Y FUSIÓN INTELIGENTE ---
// Helper global para guardar / descargar archivos compatible con PyWebView y navegadores web
async function saveFileNativeOrWeb(filename, content, isBase64 = false) {
    if (window.pywebview && window.pywebview.api) {
        try {
            let b64 = isBase64 ? content : btoa(unescape(encodeURIComponent(content)));
            return await window.pywebview.api.save_file_native(filename, b64);
        } catch (e) {
            console.warn("pywebview save failed, fallback to web:", e);
        }
    }

    try {
        let blob;
        if (isBase64) {
            const byteCharacters = atob(content);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            blob = new Blob([new Uint8Array(byteNumbers)], { type: "application/octet-stream" });
        } else {
            blob = new Blob([content], { type: "application/json;charset=utf-8" });
        }
        const url = URL.createObjectURL(blob);
        const dlAnchorElem = document.createElement("a");
        dlAnchorElem.href = url;
        dlAnchorElem.download = filename;
        document.body.appendChild(dlAnchorElem);
        dlAnchorElem.click();
        setTimeout(() => {
            document.body.removeChild(dlAnchorElem);
            URL.revokeObjectURL(url);
        }, 300);
        return true;
    } catch (err) {
        console.error("Error al descargar archivo web:", err);
        const dataStr = isBase64 
            ? `data:application/octet-stream;base64,${content}`
            : `data:text/json;charset=utf-8,${encodeURIComponent(content)}`;
        const dlAnchorElem = document.createElement("a");
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", filename);
        dlAnchorElem.click();
        return true;
    }
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
    setupDashboardModuleSelectors();
    if (activeDashModule === 'loans') {
        renderDashboardLoansMode();
    } else {
        renderDashboardStoreMode();
    }
}

function setupDashboardModuleSelectors() {
    const dashModuleBtns = document.querySelectorAll("#dashboard-module-selector .btn");
    dashModuleBtns.forEach(btn => {
        btn.removeEventListener("click", handleDashModuleChange);
        btn.addEventListener("click", handleDashModuleChange);
    });
}

function handleDashModuleChange(e) {
    const targetBtn = e.currentTarget;
    const moduleType = targetBtn.getAttribute("data-dash-module");

    const buttons = document.querySelectorAll("#dashboard-module-selector .btn");
    buttons.forEach(b => b.classList.remove("active"));
    targetBtn.classList.add("active");

    activeDashModule = moduleType;
    renderDashboard();
}

function renderDashboardStoreMode() {
    // Restablecer etiquetas de la tarjeta
    const labelBalance = document.querySelector(".card-balance .kpi-label");
    const labelIncome = document.querySelector(".card-income .kpi-label");
    const labelExpense = document.querySelector(".card-expense .kpi-label");
    const labelNet = document.querySelector(".card-net-profit .kpi-label");
    const labelInv = document.querySelector(".card-inventory .kpi-label");

    if (labelBalance) labelBalance.textContent = "Saldo Actual (Caja)";
    if (labelIncome) labelIncome.textContent = "Total Ingresos";
    if (labelExpense) labelExpense.textContent = "Total Egresos";
    if (labelNet) labelNet.textContent = "Ingreso Neto (Ganancia)";
    if (labelInv) labelInv.textContent = "Valor de Inventario";

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
    
    // Ingreso Neto (Ingresos - Egresos)
    const netIncomeVal = totalIncome - totalExpense;
    const kpiNetProfit = document.getElementById("kpi-net-profit");
    const kpiNetProfitSub = document.getElementById("kpi-net-profit-sub");
    if (kpiNetProfit) {
        kpiNetProfit.textContent = formatCurrency(netIncomeVal);
        kpiNetProfit.className = netIncomeVal < 0 ? "kpi-value text-danger" : "kpi-value text-success";
    }
    if (kpiNetProfitSub) {
        if (netIncomeVal < 0) {
            kpiNetProfitSub.className = "kpi-trend text-danger";
            kpiNetProfitSub.innerHTML = `<i data-lucide="trending-down"></i> Pérdida neta en tienda`;
        } else {
            kpiNetProfitSub.className = "kpi-trend text-success";
            kpiNetProfitSub.innerHTML = `<i data-lucide="sparkles"></i> Beneficio neto acumulado`;
        }
    }

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

    renderDashboardStockAlerts();
    renderDashboardRecentActivity();
    renderDashboardChart();
}

function renderDashboardLoansMode() {
    if (!appState.loans) appState.loans = [];
    
    let totalCapital = 0;
    let totalToCollect = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let totalInterestProfit = 0;
    let activeLoansCount = 0;

    appState.loans.forEach(loan => {
        totalCollected += loan.paid;
        if (loan.total > 0) {
            const interestProportion = (loan.total - loan.amount) / loan.total;
            totalInterestProfit += (loan.paid * interestProportion);
        }

        if (loan.status === 'active') {
            totalCapital += loan.amount;
            totalToCollect += loan.total;
            totalPending += (loan.total - loan.paid);
            activeLoansCount++;
        }
    });

    const labelBalance = document.querySelector(".card-balance .kpi-label");
    const labelIncome = document.querySelector(".card-income .kpi-label");
    const labelExpense = document.querySelector(".card-expense .kpi-label");
    const labelNet = document.querySelector(".card-net-profit .kpi-label");
    const labelInv = document.querySelector(".card-inventory .kpi-label");

    if (labelBalance) labelBalance.textContent = "Capital Prestado";
    if (labelIncome) labelIncome.textContent = "Total a Cobrar";
    if (labelExpense) labelExpense.textContent = "Total Recaudado";
    if (labelNet) labelNet.textContent = "Ingreso Neto (Interés)";
    if (labelInv) labelInv.textContent = "Saldo Pendiente";

    document.getElementById("kpi-balance").textContent = formatCurrency(totalCapital);
    document.getElementById("kpi-income").textContent = formatCurrency(totalToCollect);
    document.getElementById("kpi-expense").textContent = formatCurrency(totalCollected);

    const kpiNetProfit = document.getElementById("kpi-net-profit");
    const kpiNetProfitSub = document.getElementById("kpi-net-profit-sub");
    if (kpiNetProfit) {
        kpiNetProfit.textContent = formatCurrency(totalInterestProfit);
        kpiNetProfit.className = "kpi-value text-success";
    }
    if (kpiNetProfitSub) {
        kpiNetProfitSub.className = "kpi-trend text-success";
        kpiNetProfitSub.innerHTML = `<i data-lucide="sparkles"></i> Ganancia por Intereses`;
    }

    document.getElementById("kpi-inventory").textContent = formatCurrency(totalPending);
    document.getElementById("kpi-inventory-sub").innerHTML = `<i data-lucide="badge-alert"></i> Capital activo por cobrar`;

    const balanceTrend = document.getElementById("kpi-balance-trend");
    if (balanceTrend) {
        balanceTrend.className = "kpi-trend text-warning";
        balanceTrend.innerHTML = `<i data-lucide="hand-coins"></i> ${activeLoansCount} préstamos activos`;
    }

    renderDashboardStockAlerts();
    renderDashboardLoansRecentActivity();
    renderDashboardLoansChart();
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

    lucide.createIcons();
}

function renderDashboardLoansRecentActivity() {
    const tbody = document.getElementById("recent-transactions-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const loanEvents = [];
    appState.loans.forEach(loan => {
        loanEvents.push({
            date: loan.date,
            type: 'otorgado',
            description: `Préstamo Otorgado: ${loan.client}`,
            category: 'Préstamo Principal',
            amount: loan.amount
        });
        if (loan.payments) {
            loan.payments.forEach(p => {
                loanEvents.push({
                    date: p.date,
                    type: 'cobro',
                    description: `Abono/Cobro Préstamo: ${loan.client}`,
                    category: 'Cobro de Cuota',
                    amount: p.amount
                });
            });
        }
    });

    loanEvents.sort((a, b) => new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00'));
    const top5 = loanEvents.slice(0, 5);

    if (top5.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay actividad reciente de préstamos.</td></tr>`;
        return;
    }

    top5.forEach(item => {
        const isCobro = item.type === 'cobro';
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Fecha">${item.date.split('-').reverse().join('/')}</td>
            <td data-label="Tipo">
                <span class="row-type-badge ${isCobro ? 'row-type-ingreso' : 'row-type-egreso'}">
                    <i data-lucide="${isCobro ? 'hand-coins' : 'arrow-up-right'}"></i>
                    ${isCobro ? 'Cobro' : 'Prestado'}
                </span>
            </td>
            <td class="product-cell" style="font-weight: 500;">${item.description}</td>
            <td data-label="Categoría">${item.category}</td>
            <td class="text-right font-semibold ${isCobro ? 'text-success' : 'text-danger'}" data-label="Monto">
                ${isCobro ? '+' : '-'}${formatCurrency(item.amount)}
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function renderDashboardLoansChart() {
    const ctx = document.getElementById("chart-dashboard").getContext("2d");
    
    const monthlyData = {};
    appState.loans.forEach(loan => {
        const mStart = loan.date.substring(0, 7);
        if (!monthlyData[mStart]) monthlyData[mStart] = { prestado: 0, cobrado: 0 };
        monthlyData[mStart].prestado += loan.amount;

        if (loan.payments) {
            loan.payments.forEach(p => {
                const mPay = p.date.substring(0, 7);
                if (!monthlyData[mPay]) monthlyData[mPay] = { prestado: 0, cobrado: 0 };
                monthlyData[mPay].cobrado += p.amount;
            });
        }
    });

    const sortedMonths = Object.keys(monthlyData).sort().slice(-6);
    if (sortedMonths.length === 0) {
        const now = new Date();
        for (let i = 2; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[mStr] = { prestado: 0, cobrado: 0 };
            sortedMonths.push(mStr);
        }
    }

    const labels = sortedMonths.map(m => {
        const parts = m.split('-');
        return new Date(parts[0], parts[1] - 1, 1).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    });
    
    const prestado = sortedMonths.map(m => monthlyData[m].prestado);
    const cobrado = sortedMonths.map(m => monthlyData[m].cobrado);

    if (dashboardChartInstance) {
        dashboardChartInstance.destroy();
    }

    const isDark = document.body.classList.contains("dark-theme");
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    dashboardChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Recaudado (Abonos)',
                    data: cobrado,
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: 'Capital Otorgado',
                    data: prestado,
                    backgroundColor: '#f59e0b',
                    borderColor: '#d97706',
                    borderWidth: 1,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: textColor } },
                y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
        }
    });
}

function renderDashboardChart() {
    const ctx = document.getElementById("chart-dashboard").getContext("2d");
    
    // Obtener los meses que tienen datos reales
    const monthlyData = {};
    
    // Si no hay transacciones aún, inicializar con los últimos 3 meses dinámicos según fecha actual
    if (appState.transactions.length === 0) {
        const now = new Date();
        for (let i = 2; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthStr] = { ingresos: 0, gastos: 0 };
        }
    }

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
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: 'Gastos',
                    data: gastos,
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626',
                    borderWidth: 1,
                    borderRadius: 6
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
                <div class="product-title-td">${p.name}</div>
                <div class="product-id-td">${p.id}</div>
            </td>
            <td data-label="Categoría"><span class="badge-cat-pill">${p.category}</span></td>
            <td class="text-right font-medium" data-label="P. Costo">${formatCurrency(p.costPrice)}</td>
            <td class="text-right font-semibold text-success" data-label="P. Venta">${formatCurrency(p.sellingPrice)}</td>
            <td class="text-right text-info font-medium" data-label="Margen">+${markupPercent}%</td>
            <td class="text-center" data-label="Stock">
                <div class="stock-main-val font-bold text-white">${p.stock}</div>
                <div class="stock-min-hint text-muted">mín. ${p.minStock}</div>
            </td>
            <td class="text-center" data-label="Estado">
                <span class="stock-pill ${stockClass}">${stockLabel}</span>
            </td>
            <td class="table-actions-cell" data-label="Acciones">
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

    lucide.createIcons();

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

    // Deshabilitar la edición manual directa de stock al editar por defecto
    document.getElementById("product-stock").disabled = true;
    const unlockWrapper = document.getElementById("stock-unlock-wrapper");
    if (unlockWrapper) unlockWrapper.style.display = "inline";

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
        if (appState.stockEntries) {
            appState.stockEntries = appState.stockEntries.filter(e => e.productId !== productId);
        }
        saveState();
        CloudSync.deleteProduct(productId);
        renderInventory();
        if (document.getElementById("modal-product-history")?.classList.contains("active")) {
            renderProductHistory();
        }
        showToast("Producto eliminado.", "info");
    }
}

// --- HISTORIAL DE PRODUCTOS E INGRESOS DE MERCANCÍA ---
function ensureStockEntriesInitialized() {
    if (!appState.stockEntries || !Array.isArray(appState.stockEntries)) {
        appState.stockEntries = [];
    }

    let modified = false;

    // Sincronizar catálogo existente con el historial
    appState.products.forEach(p => {
        const hasEntry = appState.stockEntries.some(e => e.productId === p.id && (e.type === "nuevo_producto" || e.type === "base_inicial"));
        if (!hasEntry) {
            const isBase = !p.createdAt;
            appState.stockEntries.push({
                id: "entry-" + p.id,
                type: isBase ? "base_inicial" : "nuevo_producto",
                productId: p.id,
                productName: p.name,
                category: p.category,
                qty: p.initialStock !== undefined ? p.initialStock : p.stock,
                costPrice: p.costPrice,
                sellingPrice: p.sellingPrice,
                date: p.createdAt || null, // null indica Inventario Base histórico, no de hoy
                txId: null
            });
            modified = true;
        }
    });

    if (modified) {
        saveState();
    }
}

function setupProductHistoryListeners() {
    const searchInput = document.getElementById("product-history-search");
    const periodSelect = document.getElementById("product-history-period");
    
    if (searchInput) {
        searchInput.removeEventListener("input", renderProductHistory);
        searchInput.addEventListener("input", renderProductHistory);
    }
    if (periodSelect) {
        periodSelect.removeEventListener("change", renderProductHistory);
        periodSelect.addEventListener("change", renderProductHistory);
    }
}

function renderProductHistory() {
    const tbody = document.getElementById("product-history-tbody");
    const countEl = document.getElementById("product-history-count");
    if (!tbody) return;

    tbody.innerHTML = "";
    ensureStockEntriesInitialized();

    const searchVal = (document.getElementById("product-history-search")?.value || "").toLowerCase().trim();
    const periodVal = document.getElementById("product-history-period")?.value || "all";

    const now = new Date();
    const todayStr = now.toISOString().substring(0, 10);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const currentMonthPrefix = now.toISOString().substring(0, 7);

    // Clonar lista de entradas ordenadas: más recientes con fecha primero, inventario base al final
    let list = [...appState.stockEntries].sort((a, b) => {
        if (a.date && b.date) return new Date(b.date) - new Date(a.date);
        if (a.date && !b.date) return -1;
        if (!a.date && b.date) return 1;
        return 0;
    });

    // Filtro por periodo
    if (periodVal === "today") {
        list = list.filter(e => e.date && e.date.substring(0, 10) === todayStr);
    } else if (periodVal === "week") {
        list = list.filter(e => e.date && new Date(e.date) >= oneWeekAgo);
    } else if (periodVal === "month") {
        list = list.filter(e => e.date && e.date.substring(0, 7) === currentMonthPrefix);
    }

    // Filtro por búsqueda
    if (searchVal) {
        list = list.filter(e => 
            (e.productName && e.productName.toLowerCase().includes(searchVal)) ||
            (e.category && e.category.toLowerCase().includes(searchVal)) ||
            (e.productId && e.productId.toLowerCase().includes(searchVal))
        );
    }

    if (countEl) {
        countEl.textContent = `Mostrando ${list.length} de ${appState.stockEntries.length} ingresos registrados`;
    }

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted" style="padding: 36px 16px;">
                    <i data-lucide="package-search" style="width: 36px; height: 36px; margin: 0 auto 10px; display: block; opacity: 0.4;"></i>
                    <p style="margin: 0; font-size: 0.9rem;">No se encontraron ingresos registrados para el filtro seleccionado.</p>
                </td>
            </tr>
        `;
        lucide.createIcons();
        return;
    }

    list.forEach(entry => {
        const prod = appState.products.find(p => p.id === entry.productId);
        const isBase = entry.type === "base_inicial";
        const isNew = entry.type === "nuevo_producto";
        const currentStockDisplay = prod ? `${prod.stock} u.` : '<span class="text-muted">No en catálogo</span>';

        let dateFormatted = "Inventario Base";
        let isToday = false;

        if (entry.date) {
            const d = new Date(entry.date);
            const pDateStr = entry.date.substring(0, 10);
            const timeStr = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            
            if (pDateStr === todayStr) {
                isToday = true;
                dateFormatted = `Hoy, ${timeStr}`;
            } else {
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                dateFormatted = `${day}/${month}/${year} ${timeStr}`;
            }
        }

        let badgeTypeHtml = '';
        if (isBase) {
            badgeTypeHtml = `
                <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--text-muted); font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--border-color);">
                    <i data-lucide="database" style="width: 12px; height: 12px;"></i>
                    Inventario Base
                </span>`;
        } else if (isNew) {
            badgeTypeHtml = `
                <span class="badge badge-info" style="font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                    <i data-lucide="package-plus" style="width: 12px; height: 12px;"></i>
                    Alta Nueva
                </span>`;
        } else {
            badgeTypeHtml = `
                <span class="badge badge-success" style="font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                    <i data-lucide="plus-circle" style="width: 12px; height: 12px;"></i>
                    Reposición
                </span>`;
        }

        const dateIcon = isBase ? 'database' : 'calendar';
        const dateIconColor = isBase ? 'var(--text-muted)' : 'var(--primary)';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Fecha y Hora">
                <div style="font-weight: 500; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                    <i data-lucide="${dateIcon}" style="width: 14px; height: 14px; color: ${dateIconColor};"></i>
                    <span>${dateFormatted}</span>
                    ${isToday ? '<span class="badge badge-success" style="font-size: 0.65rem; padding: 2px 6px;">Hoy</span>' : ''}
                </div>
            </td>
            <td data-label="Tipo Ingreso">
                ${badgeTypeHtml}
            </td>
            <td class="product-cell" data-label="Producto">
                <div style="font-weight: 600; color: #fff;" class="product-title-td">${entry.productName}</div>
                <div style="font-size: 0.75rem;" class="text-muted">${entry.productId}</div>
            </td>
            <td data-label="Categoría">
                <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 0.8rem; font-weight: 500;">${entry.category || (prod ? prod.category : 'Varios')}</span>
            </td>
            <td class="text-center font-bold" data-label="Cant. Ingresada" style="color: var(--primary); font-size: 1rem;">
                +${entry.qty} u.
            </td>
            <td class="text-right font-medium" data-label="P. Costo">${formatCurrency(entry.costPrice)}</td>
            <td class="text-center font-bold" data-label="Stock Actual">${currentStockDisplay}</td>
            <td class="table-actions-cell" data-label="Acciones">
                <button class="btn-sm-icon" onclick="handleEditStockEntry('${entry.id}')" title="Corregir equivocación en este ingreso">
                    <i data-lucide="edit-3"></i>
                </button>
                <button class="btn-sm-icon text-danger" onclick="handleDeleteStockEntry('${entry.id}')" title="Anular este ingreso y descontar solo esta cantidad (-${entry.qty} u.)">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function showDeleteEntryChoiceModal(entry, product) {
    return new Promise((resolve) => {
        const modal = document.getElementById("modal-delete-entry");
        const descEl = document.getElementById("delete-entry-desc");
        const btnQty = document.getElementById("btn-delete-entry-qty");
        const btnFull = document.getElementById("btn-delete-entry-full");
        const btnCancel = document.getElementById("btn-delete-entry-cancel");
        const btnClose = document.getElementById("btn-delete-entry-close");
        const fullNote = document.getElementById("delete-entry-full-note");

        if (!modal) {
            const res = window.confirm(`¿Deseas descontar las ${entry.qty} unidades de "${product.name}"?`);
            resolve(res ? "qty" : "cancel");
            return;
        }

        const isNewProduct = entry.type === "nuevo_producto" || entry.type === "base_inicial";
        const newStockAfterQty = Math.max(0, product.stock - entry.qty);

        if (isNewProduct) {
            descEl.innerHTML = `Estás a punto de anular el ingreso de <strong>${entry.qty} unidades</strong> del producto <strong>"${product.name}"</strong> (Stock actual: ${product.stock} u.).<br><br>¿Cómo deseas proceder?`;
            btnQty.textContent = `Descontar solo ${entry.qty} u.`;
            btnFull.style.display = "inline-flex";
            if (fullNote) fullNote.style.display = "block";
        } else {
            descEl.innerHTML = `Estás a punto de anular el reabastecimiento de <strong>+${entry.qty} unidades</strong> de <strong>"${product.name}"</strong>.<br><br>Al confirmar se restarán las <strong>${entry.qty} unidades</strong> del inventario (pasará de ${product.stock} a <strong>${newStockAfterQty} u.</strong>) y el producto seguirá existiendo en el catálogo.`;
            btnQty.textContent = `Sí, descontar ${entry.qty} unidades`;
            btnFull.style.display = "none";
            if (fullNote) fullNote.style.display = "none";
        }

        activateModal(modal);
        lucide.createIcons();

        const cleanup = (result) => {
            deactivateModal(modal);
            btnQty.removeEventListener("click", onQty);
            btnFull.removeEventListener("click", onFull);
            btnCancel.removeEventListener("click", onCancel);
            if (btnClose) btnClose.removeEventListener("click", onCancel);
            resolve(result);
        };

        const onQty = () => cleanup("qty");
        const onFull = () => cleanup("full");
        const onCancel = () => cleanup("cancel");

        btnQty.addEventListener("click", onQty);
        btnFull.addEventListener("click", onFull);
        btnCancel.addEventListener("click", onCancel);
        if (btnClose) btnClose.addEventListener("click", onCancel);
    });
}

async function handleDeleteStockEntry(entryId) {
    if (!appState.stockEntries) return;
    const entryIndex = appState.stockEntries.findIndex(e => e.id === entryId);
    if (entryIndex === -1) return;

    const entry = appState.stockEntries[entryIndex];
    const product = appState.products.find(p => p.id === entry.productId);

    if (!product) {
        // El producto ya no existe en el catálogo, simplemente quitar el registro del historial
        appState.stockEntries.splice(entryIndex, 1);
        saveState();
        renderProductHistory();
        showToast("Registro de ingreso eliminado.", "info");
        return;
    }

    const choice = await showDeleteEntryChoiceModal(entry, product);
    if (choice === "cancel") return;

    if (choice === "qty") {
        // Descontar ÚNICAMENTE la cantidad ingresada del stock del producto
        product.stock = Math.max(0, product.stock - entry.qty);

        // Si fue un reabastecimiento que generó gasto en caja, anular el egreso para reintegrar el dinero
        if (entry.txId) {
            const txIndex = appState.transactions.findIndex(t => t.id === entry.txId);
            if (txIndex !== -1) {
                appState.transactions.splice(txIndex, 1);
            }
        }

        // Quitar la entrada del historial
        appState.stockEntries.splice(entryIndex, 1);
        saveState();
        refreshActiveView();
        renderProductHistory();
        showToast(`Se descontaron ${entry.qty} u. de "${product.name}". Nuevo stock: ${product.stock} u.`, "success");
    } else if (choice === "full") {
        // Opción explícita para eliminar el producto por completo si el usuario así lo solicita
        if (!await requirePassword(`eliminar el producto "${product.name}" completamente`)) return;
        
        // Eliminar producto de inventario
        const pIdx = appState.products.findIndex(p => p.id === product.id);
        if (pIdx !== -1) appState.products.splice(pIdx, 1);

        // Eliminar todas las entradas asociadas a este producto
        appState.stockEntries = appState.stockEntries.filter(e => e.productId !== product.id);
        
        saveState();
        refreshActiveView();
        renderProductHistory();
        showToast(`Producto "${product.name}" eliminado completamente.`, "info");
    }
}

function handleEditStockEntry(entryId) {
    openEditStockEntryModal(entryId);
}

function openEditStockEntryModal(entryId) {
    if (!appState.stockEntries) return;
    const entry = appState.stockEntries.find(e => e.id === entryId);
    if (!entry) return;

    const product = appState.products.find(p => p.id === entry.productId);
    if (!product) {
        showToast("El producto ya no existe en el inventario.", "warning");
        return;
    }

    const modal = document.getElementById("modal-edit-stock-entry");
    if (!modal) return;

    document.getElementById("edit-entry-id").value = entry.id;
    document.getElementById("edit-entry-product-name").textContent = product.name;
    document.getElementById("edit-entry-old-qty").textContent = `${entry.qty} u.`;
    document.getElementById("edit-entry-current-stock").textContent = `${product.stock} u.`;

    const inputQty = document.getElementById("edit-entry-new-qty");
    inputQty.value = entry.qty;

    const summaryEl = document.getElementById("edit-entry-summary");
    
    function updateSummary() {
        const newQty = parseInt(inputQty.value) || 0;
        const diff = newQty - entry.qty;
        const resultingStock = Math.max(0, product.stock + diff);
        const sign = diff > 0 ? `+${diff}` : `${diff}`;
        const diffColor = diff > 0 ? 'var(--success)' : (diff < 0 ? 'var(--warning)' : 'var(--text-muted)');

        let expenseNotice = '';
        if (entry.txId) {
            const newCost = entry.costPrice * newQty;
            expenseNotice = `<br><span style="font-size:0.8rem; color:var(--text-muted);">El egreso en Caja se ajustará automáticamente a: <strong>${formatCurrency(newCost)}</strong></span>`;
        }

        summaryEl.innerHTML = `
            <div>Nuevo stock total resultante: <strong style="color: #fff; font-size: 1rem;">${resultingStock} u.</strong></div>
            <div style="margin-top: 4px; font-size: 0.8rem; color: ${diffColor};">
                Diferencia sobre el inventario: <strong>${sign} u.</strong>
            </div>
            ${expenseNotice}
        `;
    }

    updateSummary();

    const btnMinus = document.getElementById("btn-edit-entry-minus");
    const btnPlus = document.getElementById("btn-edit-entry-plus");
    
    btnMinus.onclick = () => {
        let val = parseInt(inputQty.value) || 1;
        if (val > 1) {
            inputQty.value = val - 1;
            updateSummary();
        }
    };
    
    btnPlus.onclick = () => {
        let val = parseInt(inputQty.value) || 0;
        inputQty.value = val + 1;
        updateSummary();
    };

    inputQty.oninput = updateSummary;

    // Enlace opcional para editar datos completos del producto si es un alta o inventario base
    const fullProdBtnWrap = document.getElementById("edit-entry-product-details-link");
    if (fullProdBtnWrap) {
        fullProdBtnWrap.style.display = (entry.type === "nuevo_producto" || entry.type === "base_inicial") ? "block" : "none";
        const btnFullProd = document.getElementById("btn-edit-entry-full-product");
        if (btnFullProd) {
            btnFullProd.onclick = () => {
                deactivateModal(modal);
                handleEditProduct(product.id);
            };
        }
    }

    activateModal(modal);
    lucide.createIcons();
    inputQty.focus();
    inputQty.select();
}

function setupEditStockEntryForm() {
    const form = document.getElementById("form-edit-stock-entry");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const entryId = document.getElementById("edit-entry-id").value;
        const newQty = parseInt(document.getElementById("edit-entry-new-qty").value);

        if (isNaN(newQty) || newQty <= 0) {
            showToast("Por favor ingresa una cantidad válida mayor a 0.", "error");
            return;
        }

        const entry = appState.stockEntries.find(e => e.id === entryId);
        if (!entry) return;

        const product = appState.products.find(p => p.id === entry.productId);
        if (!product) return;

        const diff = newQty - entry.qty;
        product.stock = Math.max(0, product.stock + diff);
        entry.qty = newQty;

        // Si era alta inicial o base, sincronizar initialStock si existe
        if ((entry.type === "nuevo_producto" || entry.type === "base_inicial") && product.initialStock !== undefined) {
            product.initialStock = newQty;
        }

        // Si tenía transacción asociada de egreso, actualizar valor en Caja
        if (entry.txId) {
            const tx = appState.transactions.find(t => t.id === entry.txId);
            if (tx) {
                tx.qty = newQty;
                tx.value = entry.costPrice * newQty;
                tx.description = `REABASTECIMIENTO: ${product.name} (x${newQty})`;
            }
        }

        saveState();
        closeModal("edit-stock-entry");
        refreshActiveView();
        renderProductHistory();
        showToast(`Cantidad de ingreso actualizada a ${newQty} u.`, "success");
    });
}

function handleEditProductFromHistory(productId) {
    handleEditProduct(productId);
    // Habilitar edición directa de stock para corrección rápida por error de tipeo
    const inputStock = document.getElementById("product-stock");
    if (inputStock) inputStock.disabled = false;
    document.getElementById("product-modal-title").innerHTML = `<i data-lucide="edit-3"></i> Corregir Producto Agregado`;
    document.getElementById("btn-save-product").textContent = "Guardar Corrección";
    lucide.createIcons();
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

    lucide.createIcons();

    setupTransactionSearchListeners();
}

function populateTransactionMonthsDropdown(selectedValue) {
    const dropdown = document.getElementById("transaction-filter-month");
    
    // Obtener meses únicos con datos reales
    const months = new Set();

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

// --- CÁLCULO DE GANANCIA NETA (VENTA - COSTO DEL PRODUCTO) ---

// Costo total de la mercadería de una venta. Usa el costo congelado al momento
// de la venta y, para movimientos viejos, cae al costo actual del producto.
function getSaleCost(tx) {
    if (!tx.productId || !tx.qty) return 0;
    if (typeof tx.unitCost === "number" && tx.unitCost >= 0) return tx.unitCost * tx.qty;
    const product = appState.products.find(p => p.id === tx.productId);
    return product ? product.costPrice * tx.qty : 0;
}

// Ganancia real de las ventas: lo facturado menos lo que costó la mercadería.
// No descuenta gastos operativos ni reabastecimientos (eso ya lo hace la Ganancia Neta de caja).
function calcSalesProfit(txList) {
    let revenue = 0;
    let cost = 0;
    let unlinkedRevenue = 0;

    txList.forEach(t => {
        if (t.type !== "ingreso") return;
        revenue += t.value;
        if (t.productId && t.qty) {
            cost += getSaleCost(t);
        } else {
            unlinkedRevenue += t.value;
        }
    });

    return {
        revenue,
        cost,
        profit: revenue - cost,
        unlinkedRevenue,
        marginPct: revenue > 0 ? ((revenue - cost) / revenue * 100) : 0
    };
}

// --- VISTA 4: INFORME Y REPORTES (RENDERING Y GRÁFICOS) ---
function renderReports() {
    // 1. Obtener Periodo Activo
    const activePeriodBtn = document.querySelector(".period-selectors .btn.active");
    const period = activePeriodBtn ? activePeriodBtn.getAttribute("data-period") : "diario";

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

    // Ganancia real del periodo (ventas menos costo de la mercadería vendida)
    const salesProfit = calcSalesProfit(filteredTx);

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

    // Ganancia neta de ventas (descontando solo el costo del producto)
    const salesProfitEl = document.getElementById("report-sales-profit");
    const salesProfitDetailEl = document.getElementById("report-sales-profit-detail");
    if (salesProfitEl) {
        salesProfitEl.textContent = formatCurrency(salesProfit.profit);
        salesProfitEl.className = salesProfit.profit < 0 ? "text-danger" : "text-success";
    }
    if (salesProfitDetailEl) {
        if (salesProfit.revenue === 0) {
            salesProfitDetailEl.textContent = "Sin ventas registradas en el periodo";
        } else {
            let detail = `Ventas ${formatCurrency(salesProfit.revenue)} − Costo ${formatCurrency(salesProfit.cost)} (${salesProfit.marginPct.toFixed(1)}%)`;
            if (salesProfit.unlinkedRevenue > 0) {
                detail += ` · ${formatCurrency(salesProfit.unlinkedRevenue)} sin producto vinculado`;
            }
            salesProfitDetailEl.textContent = detail;
        }
    }

    document.getElementById("report-top-product").textContent = topProductName;
    document.getElementById("report-top-product-qty").textContent = topProductId ? `${topProductQty} unidades vendidas` : '0 unidades';

    // 3. Renderizar Tabla de Resumen Mensual (Última sección de reportes)
    renderReportsSummaryTable();

    // 4. Renderizar Reporte de Préstamos e Historial de Clientes
    renderLoansReport();

    // 5. Renderizar Gráficos de Reportes
    renderReportsCharts(filteredTx);

    // Registrar escuchadores de periodo y módulos
    setupPeriodSelectors();
    setupReportModuleSelectors();
}

function setupReportModuleSelectors() {
    const buttons = document.querySelectorAll("#report-module-selector .btn");
    buttons.forEach(btn => {
        btn.removeEventListener("click", handleReportModuleChange);
        btn.addEventListener("click", handleReportModuleChange);
    });
}

function handleReportModuleChange(e) {
    const targetBtn = e.currentTarget;
    const moduleType = targetBtn.getAttribute("data-module");

    const buttons = document.querySelectorAll("#report-module-selector .btn");
    buttons.forEach(b => b.classList.remove("active"));
    targetBtn.classList.add("active");

    const salesModule = document.getElementById("reports-sales-module");
    const loansModule = document.getElementById("reports-loans-module");

    if (moduleType === "sales") {
        if (salesModule) salesModule.style.display = "flex";
        if (loansModule) loansModule.style.display = "none";
    } else {
        if (salesModule) salesModule.style.display = "none";
        if (loansModule) loansModule.style.display = "grid";
    }
}

function renderLoansReport() {
    if (!appState.loans) appState.loans = [];

    let totalInterestProfit = 0;
    let totalPendingCapital = 0;
    let paidCount = 0;
    let renewedCount = 0;

    appState.loans.forEach(loan => {
        if (loan.total > 0) {
            const interestProportion = (loan.total - loan.amount) / loan.total;
            totalInterestProfit += (loan.paid * interestProportion);
        }

        if (loan.status === 'paid') paidCount++;
        else if (loan.status === 'renewed') renewedCount++;
        else if (loan.status === 'active') {
            totalPendingCapital += (loan.total - loan.paid);
        }
    });

    const elInterest = document.getElementById("report-loan-total-interest");
    const elSummary = document.getElementById("report-loan-status-summary");
    const elPending = document.getElementById("report-loan-pending-capital");

    if (elInterest) elInterest.textContent = formatCurrency(totalInterestProfit);
    if (elSummary) elSummary.textContent = `${paidCount} pagados / ${renewedCount} renovados`;
    if (elPending) elPending.textContent = formatCurrency(totalPendingCapital);

    // Llenar el selector de clientes para ver su historial
    const selectClient = document.getElementById("report-loan-client-select");
    if (selectClient) {
        const clientSet = new Set();
        appState.loans.forEach(l => {
            if (l.client) clientSet.add(l.client.trim());
        });
        const clients = Array.from(clientSet).sort();

        const currentVal = selectClient.value;
        selectClient.innerHTML = '<option value="" style="background: var(--bg-card); color: var(--text-main);">-- Seleccionar cliente para ver historial --</option>';
        clients.forEach(c => {
            const selected = (c === currentVal) ? 'selected' : '';
            selectClient.innerHTML += `<option value="${c}" ${selected} style="background: var(--bg-card); color: var(--text-main);">${c}</option>`;
        });

        selectClient.removeEventListener("change", handleReportClientChange);
        selectClient.addEventListener("change", handleReportClientChange);

        if (currentVal && clients.includes(currentVal)) {
            renderReportClientHistory(currentVal);
        } else {
            const details = document.getElementById("report-loan-client-details");
            if (details) details.style.display = "none";
        }
    }
}

function handleReportClientChange(e) {
    const clientName = e.target.value;
    renderReportClientHistory(clientName);
}

function renderReportClientHistory(clientName) {
    const detailsContainer = document.getElementById("report-loan-client-details");
    if (!clientName) {
        if (detailsContainer) detailsContainer.style.display = "none";
        return;
    }

    const clientLoans = appState.loans.filter(l => l.client.toLowerCase() === clientName.toLowerCase());
    if (clientLoans.length === 0) {
        if (detailsContainer) detailsContainer.style.display = "none";
        return;
    }

    detailsContainer.style.display = "block";
    document.getElementById("report-client-name-title").textContent = `Historial Completo: ${clientName}`;

    const totalLoans = clientLoans.length;
    const paidLoans = clientLoans.filter(l => l.status === 'paid').length;
    const activeLoans = clientLoans.filter(l => l.status === 'active').length;
    const renewedLoans = clientLoans.filter(l => l.status === 'renewed').length;

    let totalInvested = 0;
    let totalCollected = 0;
    clientLoans.forEach(l => {
        totalInvested += l.amount;
        totalCollected += l.paid;
    });

    document.getElementById("report-client-badges").innerHTML = `
        <span class="badge badge-info">Total Préstamos: ${totalLoans}</span>
        <span class="badge badge-success">Pagados: ${paidLoans}</span>
        <span class="badge badge-warning">Activos: ${activeLoans}</span>
        ${renewedLoans > 0 ? `<span class="badge badge-secondary">Renovados: ${renewedLoans}</span>` : ''}
        <span class="text-muted ml-auto" style="align-self:center;">Otorgado: <strong>${formatCurrency(totalInvested)}</strong> | Recaudado: <strong>${formatCurrency(totalCollected)}</strong></span>
    `;

    const tbody = document.getElementById("report-client-history-tbody");
    tbody.innerHTML = "";

    const sorted = [...clientLoans].sort((a, b) => new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00'));
    sorted.forEach(loan => {
        const quota = loan.total / loan.days;
        const freq = loan.frequency || 'diaria';

        let freqLabel = " / día";
        if (freq === 'semanal') freqLabel = " / sem";
        if (freq === 'quincenal') freqLabel = " / quin";
        if (freq === 'mensual') freqLabel = " / mes";

        let statusBadge = '';
        if (loan.status === 'paid') statusBadge = `<span class="badge badge-success">Pagado</span>`;
        else if (loan.status === 'renewed') statusBadge = `<span class="badge badge-info">Renovado</span>`;
        else statusBadge = `<span class="badge badge-warning">Activo</span>`;

        let paymentsHTML = '<span class="text-muted">Sin abonos</span>';
        if (loan.payments && loan.payments.length > 0) {
            paymentsHTML = `<details><summary style="cursor:pointer; color:var(--primary); font-weight:500;">${loan.payments.length} abono(s)</summary><ul style="padding-left:14px; margin-top:4px; font-size:0.8rem; text-align:left;" class="text-muted">` +
                loan.payments.map(p => `<li>${p.date.split('-').reverse().join('/')}: <strong>${formatCurrency(p.amount)}</strong></li>`).join('') +
                `</ul></details>`;
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${loan.date.split('-').reverse().join('/')}</td>
            <td class="text-right text-danger">${formatCurrency(loan.amount)}</td>
            <td class="text-right">${formatCurrency(loan.total)}</td>
            <td class="text-right text-success">${formatCurrency(loan.paid)}</td>
            <td class="text-center">${formatCurrency(quota)} <small class="text-muted">${freqLabel}</small></td>
            <td class="text-center">${statusBadge}</td>
            <td class="text-center">${paymentsHTML}</td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
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
            monthlyData[mKey] = { ingresos: 0, gastos: 0, ganancia: 0 };
        }
        if (t.type === "ingreso") {
            monthlyData[mKey].ingresos += t.value;
            monthlyData[mKey].ganancia += t.value - getSaleCost(t);
        } else {
            monthlyData[mKey].gastos += t.value;
        }
    });

    const sortedMonths = Object.keys(monthlyData).sort().reverse(); // Recientes primero

    if (sortedMonths.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Sin datos suficientes.</td></tr>`;
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
            <td class="text-right font-semibold ${data.ganancia >= 0 ? 'text-success' : 'text-danger'}" data-label="Gan. Neta">${formatCurrency(data.ganancia)}</td>
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
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: datasetInc,
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: 'Gastos',
                    data: datasetExp,
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626',
                    borderWidth: 1,
                    borderRadius: 6
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
                    <form id="pw-modal-form" onsubmit="event.preventDefault(); document.getElementById('btn-pw-confirm').click();">
                        <div class="modal-header">
                            <h3 id="pw-modal-title"><i data-lucide="shield-alert"></i> Verificación requerida</h3>
                            <button type="button" class="btn-icon" id="btn-pw-close"><i data-lucide="x"></i></button>
                        </div>
                        <div class="modal-body">
                            <p id="pw-modal-desc" style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;line-height:1.5"></p>
                            
                            <!-- Campo trampa para el autocompletado de usuario -->
                            <div style="position:absolute; width:1px; height:1px; overflow:hidden; opacity:0; top:-999px;">
                                <input type="text" name="fakeusernameremembered" tabindex="-1" autocomplete="username">
                            </div>

                            <div class="login-input-wrapper">
                                <i data-lucide="lock" class="input-icon"></i>
                                <input type="password" id="pw-modal-input" placeholder="Ingresá la contraseña del sistema"
                                    autocomplete="current-password"
                                    style="width:100%;padding:12px 44px;background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-sm);color:var(--text-main);font-family:var(--font-primary);font-size:0.95rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s;">
                                <button class="btn-toggle-pass" id="btn-pw-toggle" type="button">
                                    <i data-lucide="eye"></i>
                                </button>
                            </div>
                            <p id="pw-modal-error" style="display:none;color:var(--danger);font-size:0.82rem;margin-top:10px;font-weight:500;">
                                ⚠️ Contraseña incorrecta. Intentá de nuevo.
                            </p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="btn-pw-cancel">Cancelar</button>
                            <button type="button" class="btn btn-danger" id="btn-pw-confirm">
                                <i data-lucide="unlock"></i> Confirmar
                            </button>
                        </div>
                    </form>
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
        activateModal(modal);
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
            deactivateModal(modal);
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
        activateModal(modal);

        // Eventos
        const cleanupAndClose = (result) => {
            btnOk.removeEventListener("click", onConfirm);
            btnCancel.removeEventListener("click", onCancel);
            if (btnClose) btnClose.removeEventListener("click", onCancel);
            deactivateModal(modal);
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
        activateModal(modal);
        lucide.createIcons();

        const cleanupAndClose = (result) => {
            btnExpense.removeEventListener("click", onExpense);
            btnNoExpense.removeEventListener("click", onNoExpense);
            btnCancel.removeEventListener("click", onCancel);
            if (btnClose) btnClose.removeEventListener("click", onCancel);
            deactivateModal(modal);
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

    const frequencyInput = document.getElementById("loan-frequency");

    function calculateLoan() {
        const amount = parseFloat(amountInput.value) || 0;
        const interest = parseFloat(interestInput.value) || 0;
        const days = parseInt(daysInput.value) || 1;
        const frequency = frequencyInput ? frequencyInput.value : 'diaria';
        
        const total = amount + (amount * (interest / 100));
        const quota = total / days;
        
        totalInput.value = total.toFixed(2);
        
        let freqLabel = " / día";
        if (frequency === 'semanal') freqLabel = " / sem";
        if (frequency === 'quincenal') freqLabel = " / quin";
        if (frequency === 'mensual') freqLabel = " / mes";

        quotaInput.value = formatCurrency(quota) + freqLabel;
    }

    if (amountInput) amountInput.addEventListener("input", calculateLoan);
    if (interestInput) interestInput.addEventListener("input", calculateLoan);
    if (daysInput) daysInput.addEventListener("input", calculateLoan);
    if (frequencyInput) frequencyInput.addEventListener("change", calculateLoan);

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
            
            const frequency = document.getElementById("loan-frequency") ? document.getElementById("loan-frequency").value : 'diaria';
            
            const newLoan = {
                id: generateId("loan"),
                date: date,
                client: client,
                amount: amount,
                interest: interest,
                total: total,
                days: days,
                frequency: frequency,
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

            if (!loan.payments) loan.payments = [];
            loan.payments.push({
                id: generateId("pay"),
                date: date,
                amount: amount
            });

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

    // Renovar Préstamo - cálculos en tiempo real
    const renewNewCapital = document.getElementById("renew-new-capital");
    const renewIncludePending = document.getElementById("renew-include-pending");
    const renewInterest = document.getElementById("renew-interest");
    const renewDays = document.getElementById("renew-days");
    const renewFrequency = document.getElementById("renew-frequency");

    function calculateRenewLoan() {
        const oldPending = parseFloat(document.getElementById("renew-old-pending").value) || 0;
        const includePending = renewIncludePending.checked;
        const newCapital = parseFloat(renewNewCapital.value) || 0;

        const baseCapital = newCapital + (includePending ? oldPending : 0);
        document.getElementById("renew-total-capital").value = baseCapital.toFixed(2);

        const interest = parseFloat(renewInterest.value) || 0;
        const days = parseInt(renewDays.value) || 1;
        const frequency = renewFrequency ? renewFrequency.value : 'diaria';

        const total = baseCapital + (baseCapital * (interest / 100));
        const quota = total / days;

        document.getElementById("renew-total").value = total.toFixed(2);

        let freqLabel = " / día";
        if (frequency === 'semanal') freqLabel = " / sem";
        if (frequency === 'quincenal') freqLabel = " / quin";
        if (frequency === 'mensual') freqLabel = " / mes";

        document.getElementById("renew-quota").value = formatCurrency(quota) + freqLabel;
    }

    if (renewNewCapital) renewNewCapital.addEventListener("input", calculateRenewLoan);
    if (renewIncludePending) renewIncludePending.addEventListener("change", calculateRenewLoan);
    if (renewInterest) renewInterest.addEventListener("input", calculateRenewLoan);
    if (renewDays) renewDays.addEventListener("input", calculateRenewLoan);
    if (renewFrequency) renewFrequency.addEventListener("change", calculateRenewLoan);

    // Form Submit Renovación
    const formRenew = document.getElementById("form-renew-loan");
    if (formRenew) {
        formRenew.addEventListener("submit", (e) => {
            e.preventDefault();
            const oldLoanId = document.getElementById("renew-old-loan-id").value;
            const oldLoan = appState.loans.find(l => l.id === oldLoanId);
            if (!oldLoan) return;

            const date = document.getElementById("renew-date").value;
            const newCapital = parseFloat(renewNewCapital.value) || 0;
            const totalCapital = parseFloat(document.getElementById("renew-total-capital").value) || 0;
            const interest = parseFloat(renewInterest.value) || 0;
            const totalToCollect = parseFloat(document.getElementById("renew-total").value) || 0;
            const days = parseInt(renewDays.value) || 1;
            const frequency = renewFrequency.value;

            // Marcar anterior como renovado
            oldLoan.status = 'renewed';

            // Crear nuevo préstamo
            const newLoan = {
                id: generateId("loan"),
                date: date,
                client: oldLoan.client,
                amount: totalCapital,
                interest: interest,
                total: totalToCollect,
                days: days,
                frequency: frequency,
                paid: 0,
                status: 'active',
                renewedFromId: oldLoan.id,
                payments: []
            };

            oldLoan.renewedToId = newLoan.id;

            if (!appState.loans) appState.loans = [];
            appState.loans.push(newLoan);

            saveState();
            closeModal("renew-loan");
            renderLoans();
            refreshActiveView();
            showToast("Préstamo renovado con éxito", "success");
        });
    }

    // Formulario de edición de préstamo
    const formEditLoan = document.getElementById("form-edit-loan");
    if (formEditLoan) {
        ["edit-loan-amount", "edit-loan-interest", "edit-loan-days", "edit-loan-frequency"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener("input", calculateEditLoan);
            if (el) el.addEventListener("change", calculateEditLoan);
        });

        formEditLoan.addEventListener("submit", (e) => {
            e.preventDefault();
            const loanId = document.getElementById("edit-loan-id").value;
            const loan = appState.loans.find(l => l.id === loanId);
            if (!loan) return;

            const date = document.getElementById("edit-loan-date").value;
            const client = document.getElementById("edit-loan-client").value.trim();
            const amount = parseFloat(document.getElementById("edit-loan-amount").value) || 0;
            const interest = parseFloat(document.getElementById("edit-loan-interest").value) || 0;
            const days = parseInt(document.getElementById("edit-loan-days").value) || 1;
            const frequency = document.getElementById("edit-loan-frequency").value;
            const total = amount + (amount * (interest / 100));

            loan.date = date;
            loan.client = client;
            loan.amount = amount;
            loan.interest = interest;
            loan.days = days;
            loan.frequency = frequency;
            loan.total = total;

            if (loan.paid >= loan.total) loan.status = 'paid';
            else if (loan.status === 'paid' && loan.paid < loan.total) loan.status = 'active';

            saveState();
            closeModal("edit-loan");
            renderLoans();
            refreshActiveView();
            showToast("Préstamo actualizado correctamente", "success");
        });
    }

    // Filtros de búsqueda
    const searchInput = document.getElementById("loan-search");
    if (searchInput) searchInput.addEventListener("input", renderLoans);
    
    const filterStatus = document.getElementById("loan-filter-status");
    if (filterStatus) filterStatus.addEventListener("change", renderLoans);

    const filterFreq = document.getElementById("loan-filter-frequency");
    if (filterFreq) filterFreq.addEventListener("change", renderLoans);
}

function openEditLoanModal(loanId) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan) return;

    document.getElementById("edit-loan-id").value = loan.id;
    document.getElementById("edit-loan-date").value = loan.date;
    document.getElementById("edit-loan-client").value = loan.client;
    document.getElementById("edit-loan-amount").value = loan.amount;
    document.getElementById("edit-loan-interest").value = loan.interest || 20;
    document.getElementById("edit-loan-days").value = loan.days || 24;
    document.getElementById("edit-loan-frequency").value = loan.frequency || 'diaria';

    calculateEditLoan();
    openModal("edit-loan");
}

function calculateEditLoan() {
    const amount = parseFloat(document.getElementById("edit-loan-amount").value) || 0;
    const interest = parseFloat(document.getElementById("edit-loan-interest").value) || 0;
    const days = parseInt(document.getElementById("edit-loan-days").value) || 1;
    const frequency = document.getElementById("edit-loan-frequency") ? document.getElementById("edit-loan-frequency").value : 'diaria';

    const total = amount + (amount * (interest / 100));
    const quota = total / days;

    const totalEl = document.getElementById("edit-loan-total");
    const quotaEl = document.getElementById("edit-loan-quota");

    if (totalEl) totalEl.value = total.toFixed(2);

    let freqLabel = " / día";
    if (frequency === 'semanal') freqLabel = " / sem";
    if (frequency === 'quincenal') freqLabel = " / quin";
    if (frequency === 'mensual') freqLabel = " / mes";

    if (quotaEl) quotaEl.value = formatCurrency(quota) + freqLabel;
}

function openPaymentModal(loanId) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan) return;
    
    document.getElementById("form-payment").reset();
    document.getElementById("payment-loan-id").value = loan.id;
    document.getElementById("payment-client-name").textContent = loan.client;
    document.getElementById("payment-date").value = new Date().toISOString().substring(0, 10);
    
    const quota = loan.total / loan.days;
    const remaining = Math.max(0, loan.total - loan.paid);

    document.getElementById("payment-current-pending").value = remaining;
    document.getElementById("payment-regular-quota").value = quota;
    document.getElementById("payment-pending-display").value = formatCurrency(remaining);
    
    const defaultPayment = Math.min(quota, remaining);
    const amountInput = document.getElementById("payment-amount");
    amountInput.value = defaultPayment.toFixed(2);
    
    amountInput.removeEventListener("input", updatePaymentCalculations);
    amountInput.addEventListener("input", updatePaymentCalculations);

    updatePaymentCalculations();
    openModal("payment");
}

function updatePaymentCalculations() {
    const currentPending = parseFloat(document.getElementById("payment-current-pending").value) || 0;
    const regularQuota = parseFloat(document.getElementById("payment-regular-quota").value) || 1;
    const paymentAmount = parseFloat(document.getElementById("payment-amount").value) || 0;

    const newPending = Math.max(0, currentPending - paymentAmount);
    const newPendingEl = document.getElementById("payment-new-pending-display");
    if (newPendingEl) {
        newPendingEl.value = formatCurrency(newPending);
        newPendingEl.style.color = newPending <= 0 ? "var(--success)" : "var(--text-main)";
    }

    const infoBox = document.getElementById("payment-info-box");
    if (infoBox) {
        if (newPending <= 0) {
            infoBox.innerHTML = `<span class="text-success font-bold">🎉 ¡Con este abono el préstamo quedará COMPLETAMENTE PAGADO Y CANCELADO!</span>`;
        } else {
            const remQuotas = Math.ceil(newPending / regularQuota);
            infoBox.innerHTML = `Cuota habitual: <strong>${formatCurrency(regularQuota)}</strong> | Saldo restante tras este pago: <strong class="text-warning">${formatCurrency(newPending)}</strong> (aprox. <strong>${remQuotas} cuota(s)</strong> restantes).`;
        }
    }
}

function openRenewModal(loanId) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan) return;

    document.getElementById("form-renew-loan").reset();
    document.getElementById("renew-old-loan-id").value = loan.id;
    document.getElementById("renew-client-name").textContent = loan.client;
    document.getElementById("renew-date").value = new Date().toISOString().substring(0, 10);
    
    const pending = Math.max(0, loan.total - loan.paid);
    document.getElementById("renew-old-pending").value = pending.toFixed(2);
    document.getElementById("renew-new-capital").value = "0.00";
    document.getElementById("renew-include-pending").checked = true;
    document.getElementById("renew-interest").value = loan.interest || 20;
    document.getElementById("renew-days").value = loan.days || 24;
    document.getElementById("renew-frequency").value = loan.frequency || 'diaria';

    const event = new Event('input');
    document.getElementById("renew-new-capital").dispatchEvent(event);

    openModal("renew-loan");
}

function openClientHistoryModal(clientName) {
    const clientLoans = appState.loans.filter(l => l.client.toLowerCase() === clientName.toLowerCase());
    
    document.getElementById("history-client-name").textContent = clientName;
    
    const totalLoans = clientLoans.length;
    const paidLoans = clientLoans.filter(l => l.status === 'paid').length;
    const activeLoans = clientLoans.filter(l => l.status === 'active').length;
    const renewedLoans = clientLoans.filter(l => l.status === 'renewed').length;
    
    let totalInvested = 0;
    let totalCollected = 0;
    clientLoans.forEach(l => {
        totalInvested += l.amount;
        totalCollected += l.paid;
    });

    document.getElementById("history-client-stats").innerHTML = `
        <span class="badge badge-info">Total Préstamos: ${totalLoans}</span>
        <span class="badge badge-success">Pagados: ${paidLoans}</span>
        <span class="badge badge-warning">Activos: ${activeLoans}</span>
        ${renewedLoans > 0 ? `<span class="badge badge-secondary">Renovados: ${renewedLoans}</span>` : ''}
        <span class="text-muted ml-auto">Otorgado: <strong>${formatCurrency(totalInvested)}</strong> | Recaudado: <strong>${formatCurrency(totalCollected)}</strong></span>
    `;

    const tbody = document.getElementById("history-loans-tbody");
    tbody.innerHTML = "";

    if (clientLoans.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hay préstamos registrados para este cliente.</td></tr>`;
    } else {
        const sorted = [...clientLoans].sort((a, b) => new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00'));
        sorted.forEach(loan => {
            const quota = loan.total / loan.days;
            const freq = loan.frequency || 'diaria';

            let freqLabel = " / día";
            if (freq === 'semanal') freqLabel = " / sem";
            if (freq === 'quincenal') freqLabel = " / quin";
            if (freq === 'mensual') freqLabel = " / mes";

            let statusBadge = '';
            if (loan.status === 'paid') statusBadge = `<span class="badge badge-success">Pagado</span>`;
            else if (loan.status === 'renewed') statusBadge = `<span class="badge badge-info">Renovado</span>`;
            else statusBadge = `<span class="badge badge-warning">Activo</span>`;

            let paymentsHTML = '<span class="text-muted">Sin abonos</span>';
            if (loan.payments && loan.payments.length > 0) {
                paymentsHTML = `<details><summary style="cursor:pointer; color:var(--primary); font-weight:500;">${loan.payments.length} abono(s)</summary><ul style="padding-left:14px; margin-top:4px; font-size:0.8rem; text-align:left;" class="text-muted">` +
                    loan.payments.map(p => `<li>${p.date.split('-').reverse().join('/')}: <strong>${formatCurrency(p.amount)}</strong></li>`).join('') +
                    `</ul></details>`;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${loan.date.split('-').reverse().join('/')}</td>
                <td class="text-right text-danger">${formatCurrency(loan.amount)}</td>
                <td class="text-right">${formatCurrency(loan.total)}</td>
                <td class="text-right text-success">${formatCurrency(loan.paid)}</td>
                <td class="text-center">${formatCurrency(quota)} <small class="text-muted">${freqLabel}</small></td>
                <td class="text-center">${statusBadge}</td>
                <td class="text-center">${paymentsHTML}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    openModal("loan-history");
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
    let totalInterestProfit = 0;
    let activeLoansCount = 0;

    appState.loans.forEach(loan => {
        totalCollected += loan.paid;
        
        // Proporción de ganancia neta por intereses en lo recaudado
        if (loan.total > 0) {
            const interestProportion = (loan.total - loan.amount) / loan.total;
            totalInterestProfit += (loan.paid * interestProportion);
        }

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
    const kpiInterest = document.getElementById("loan-kpi-interest");
    const kpiPending = document.getElementById("loan-kpi-pending");

    if (kpiCapital) kpiCapital.textContent = formatCurrency(totalCapital);
    if (kpiCapitalSub) kpiCapitalSub.textContent = `${activeLoansCount} préstamo${activeLoansCount !== 1 ? 's' : ''} activo${activeLoansCount !== 1 ? 's' : ''}`;
    if (kpiTotal) kpiTotal.textContent = formatCurrency(totalToCollect);
    if (kpiCollected) kpiCollected.textContent = formatCurrency(totalCollected);
    if (kpiInterest) kpiInterest.textContent = formatCurrency(totalInterestProfit);
    if (kpiPending) kpiPending.textContent = formatCurrency(totalPending);

    const search = (document.getElementById("loan-search").value || "").toLowerCase();
    const statusFilter = document.getElementById("loan-filter-status").value || "all";
    const freqFilter = document.getElementById("loan-filter-frequency") ? document.getElementById("loan-filter-frequency").value : "all";

    let filtered = appState.loans.filter(loan => {
        const matchSearch = loan.client.toLowerCase().includes(search);
        const matchStatus = statusFilter === "all" || loan.status === statusFilter;
        const matchFreq = freqFilter === "all" || (loan.frequency || 'diaria') === freqFilter;
        return matchSearch && matchStatus && matchFreq;
    });

    tbody.innerHTML = "";

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No se encontraron préstamos.</td></tr>`;
        return;
    }

    filtered.forEach(loan => {
        const remaining = loan.total - loan.paid;
        const quota = loan.total / loan.days;
        const freq = loan.frequency || 'diaria';
        
        let freqLabel = " / día";
        if (freq === 'semanal') freqLabel = " / sem";
        if (freq === 'quincenal') freqLabel = " / quin";
        if (freq === 'mensual') freqLabel = " / mes";
        
        let statusBadge = '';
        if (loan.status === 'paid') {
            statusBadge = `<span class="badge badge-success">Pagado</span>`;
        } else if (loan.status === 'renewed') {
            statusBadge = `<span class="badge badge-info">Renovado</span>`;
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
            <td class="text-center">${formatCurrency(quota)} <small class="text-muted">${freqLabel}</small></td>
            <td class="text-center">${statusBadge}</td>
            <td class="text-center">
                <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                    ${loan.status === 'active' ? `<button type="button" class="btn-action-icon btn-pay" title="Registrar cobro / pago" data-id="${loan.id}"><i data-lucide="dollar-sign"></i></button>` : ''}
                    ${loan.status === 'active' ? `<button type="button" class="btn-action-icon btn-renew-loan" title="Renovar préstamo" data-id="${loan.id}"><i data-lucide="refresh-cw"></i></button>` : ''}
                    <button type="button" class="btn-action-icon btn-edit-loan" title="Editar préstamo" data-id="${loan.id}"><i data-lucide="pencil"></i></button>
                    <button type="button" class="btn-action-icon btn-history-loan" title="Ver historial del cliente" data-client="${loan.client}"><i data-lucide="history"></i></button>
                    <button type="button" class="btn-action-icon btn-delete-loan" title="Eliminar préstamo" data-id="${loan.id}"><i data-lucide="trash-2"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll(".btn-edit-loan").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            openEditLoanModal(id);
        });
    });

    document.querySelectorAll(".btn-history-loan").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const client = e.currentTarget.getAttribute("data-client");
            openClientHistoryModal(client);
        });
    });

    document.querySelectorAll(".btn-renew-loan").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            openRenewModal(id);
        });
    });

    document.querySelectorAll(".btn-pay").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            openPaymentModal(id);
        });
    });

    document.querySelectorAll(".btn-delete-loan").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            deleteLoan(id);
        });
    });

    lucide.createIcons();
}

async function deleteLoan(loanId) {
    if (!await requirePassword("eliminar este préstamo")) return;
    
    if (await showConfirm("Eliminar Préstamo", "¿Estás seguro que deseas eliminar este préstamo? Esto revertirá su estado y eliminará del historial de caja el registro del préstamo otorgado y los cobros realizados.", "Eliminar", "Cancelar")) {
        const loan = appState.loans.find(l => l.id === loanId);
        if (!loan) return;
        
        // Eliminar transacciones asociadas
        appState.transactions = appState.transactions.filter(tx => {
            if (tx.loanId === loanId) return false;
            if (!tx.loanId && (tx.description === `PRESTAMO OTORGADO: ${loan.client}` || tx.description === `COBRO DE PRESTAMO: ${loan.client}`)) {
                return false;
            }
            return true;
        });

        appState.loans = appState.loans.filter(l => l.id !== loanId);
        saveState();
        renderLoans();
        showToast("Préstamo eliminado con éxito", "info");
    }
}


