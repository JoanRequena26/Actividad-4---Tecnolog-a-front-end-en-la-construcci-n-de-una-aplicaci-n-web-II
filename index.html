<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestor PyME - Sistema de Gestión</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        .sidebar-item.active {
            background-color: #e0e7ff;
            color: #4f46e5;
            border-right: 4px solid #4f46e5;
        }

        /* Modal Transitions */
        .modal {
            transition: opacity 0.25s ease;
        }
        
        /* Print Styles */
        @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white; }
            #invoice-modal-content { 
                box-shadow: none; 
                border: none; 
                position: absolute; 
                top: 0; 
                left: 0; 
                width: 100%; 
            }
        }
    </style>
</head>
<body class="text-gray-800 h-screen flex overflow-hidden">

    <!-- Notificaciones Toast -->
    <div id="toast-container" class="fixed top-5 right-5 z-50 flex flex-col gap-2"></div>

    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg z-20 hidden md:flex flex-col h-full no-print">
        <div class="p-6 border-b border-gray-100 flex items-center gap-3">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
            </div>
            <h1 class="text-xl font-bold text-gray-800">PyME Manager</h1>
        </div>
        
        <nav class="flex-1 overflow-y-auto py-4">
            <ul class="space-y-1">
                <li>
                    <button onclick="router('dashboard')" id="nav-dashboard" class="sidebar-item w-full flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
                        <i class="fas fa-chart-line w-5"></i> Dashboard
                    </button>
                </li>
                <li>
                    <button onclick="router('pos')" id="nav-pos" class="sidebar-item w-full flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
                        <i class="fas fa-cash-register w-5"></i> Nueva Venta (TPV)
                    </button>
                </li>
                <li>
                    <button onclick="router('inventory')" id="nav-inventory" class="sidebar-item w-full flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
                        <i class="fas fa-boxes w-5"></i> Inventario
                    </button>
                </li>
                <li>
                    <button onclick="router('sales')" id="nav-sales" class="sidebar-item w-full flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
                        <i class="fas fa-file-invoice-dollar w-5"></i> Historial Ventas
                    </button>
                </li>
                <li>
                    <button onclick="router('expenses')" id="nav-expenses" class="sidebar-item w-full flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
                        <i class="fas fa-receipt w-5"></i> Gastos
                    </button>
                </li>
                <li>
                    <button onclick="router('clients')" id="nav-clients" class="sidebar-item w-full flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
                        <i class="fas fa-users w-5"></i> Clientes
                    </button>
                </li>
            </ul>
        </nav>

        <div class="p-4 border-t border-gray-100">
            <button onclick="resetData()" class="w-full flex items-center justify-center gap-2 text-red-500 text-sm hover:bg-red-50 p-2 rounded transition-colors">
                <i class="fas fa-trash-alt"></i> Resetear Datos
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
        <!-- Header Mobile -->
        <header class="bg-white shadow-sm p-4 flex justify-between items-center md:hidden no-print">
            <h1 class="font-bold text-lg">PyME Manager</h1>
            <button onclick="document.querySelector('aside').classList.toggle('hidden'); document.querySelector('aside').classList.toggle('flex'); document.querySelector('aside').classList.toggle('absolute'); document.querySelector('aside').classList.toggle('h-full');" class="text-gray-600">
                <i class="fas fa-bars text-xl"></i>
            </button>
        </header>

        <!-- Views Container -->
        <div id="main-container" class="flex-1 overflow-y-auto p-4 md:p-8">
            
            <!-- VIEW: DASHBOARD -->
            <section id="view-dashboard" class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Resumen del Negocio</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <!-- Cards -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Ventas Totales</p>
                                <h3 class="text-2xl font-bold text-indigo-600" id="dash-sales">$0.00</h3>
                            </div>
                            <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600"><i class="fas fa-wallet"></i></div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Gastos</p>
                                <h3 class="text-2xl font-bold text-red-500" id="dash-expenses">$0.00</h3>
                            </div>
                            <div class="p-2 bg-red-50 rounded-lg text-red-500"><i class="fas fa-arrow-down"></i></div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Beneficio Neto</p>
                                <h3 class="text-2xl font-bold text-emerald-600" id="dash-profit">$0.00</h3>
                            </div>
                            <div class="p-2 bg-emerald-50 rounded-lg text-emerald-600"><i class="fas fa-piggy-bank"></i></div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Productos Bajo Stock</p>
                                <h3 class="text-2xl font-bold text-orange-500" id="dash-low-stock">0</h3>
                            </div>
                            <div class="p-2 bg-orange-50 rounded-lg text-orange-500"><i class="fas fa-exclamation-triangle"></i></div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-800 mb-4">Últimas Ventas</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead class="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-3">ID</th>
                                        <th class="px-4 py-3">Fecha</th>
                                        <th class="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody id="dash-latest-sales">
                                    <!-- Populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-800 mb-4">Productos más vendidos</h3>
                        <ul class="space-y-3" id="dash-top-products">
                            <!-- Populated by JS -->
                        </ul>
                    </div>
                </div>
            </section>

            <!-- VIEW: INVENTORY -->
            <section id="view-inventory" class="hidden space-y-6">
                <div class="flex justify-between items-center flex-wrap gap-4">
                    <h2 class="text-2xl font-bold text-gray-800">Inventario</h2>
                    <button onclick="openModal('product-modal')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <i class="fas fa-plus"></i> Nuevo Producto
                    </button>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-4 border-b border-gray-100">
                        <input type="text" id="inventory-search" placeholder="Buscar producto..." class="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 text-sm">
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3">Producto</th>
                                    <th class="px-6 py-3">Categoría</th>
                                    <th class="px-6 py-3">Precio</th>
                                    <th class="px-6 py-3">Costo</th>
                                    <th class="px-6 py-3 text-center">Stock</th>
                                    <th class="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="inventory-table-body">
                                <!-- JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- VIEW: POS (Point of Sale) -->
            <section id="view-pos" class="hidden h-full flex flex-col md:flex-row gap-6">
                <!-- Product Grid -->
                <div class="w-full md:w-2/3 flex flex-col gap-4">
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                        <div class="relative flex-1">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            <input type="text" id="pos-search" placeholder="Buscar producto por nombre o código..." class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500">
                        </div>
                        <select id="pos-category-filter" class="border rounded-lg px-4 py-2 bg-white">
                            <option value="all">Todas</option>
                        </select>
                    </div>
                    
                    <div id="pos-products-grid" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4">
                        <!-- Products rendered here -->
                    </div>
                </div>

                <!-- Cart Sidebar -->
                <div class="w-full md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-[calc(100vh-8rem)] sticky top-4">
                    <div class="p-4 border-b bg-gray-50 rounded-t-xl">
                        <h3 class="font-bold text-gray-800"><i class="fas fa-shopping-cart mr-2"></i>Carrito de Venta</h3>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-4 space-y-3" id="pos-cart-items">
                        <!-- Cart Items -->
                        <div class="text-center text-gray-400 mt-10">El carrito está vacío</div>
                    </div>

                    <div class="p-4 bg-gray-50 border-t space-y-3 rounded-b-xl">
                        <div class="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span id="cart-subtotal">$0.00</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Impuesto (19%)</span>
                            <span id="cart-tax">$0.00</span>
                        </div>
                        <div class="flex justify-between text-xl font-bold text-indigo-900 border-t pt-2">
                            <span>Total</span>
                            <span id="cart-total">$0.00</span>
                        </div>
                        
                        <div class="pt-2">
                            <label class="block text-xs font-medium text-gray-700 mb-1">Cliente</label>
                            <select id="pos-client-select" class="w-full border rounded p-2 text-sm mb-3">
                                <option value="general">Cliente General</option>
                            </select>
                            <button onclick="processSale()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                                <i class="fas fa-check"></i> Finalizar Venta
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- VIEW: SALES HISTORY -->
            <section id="view-sales" class="hidden space-y-6">
                <h2 class="text-2xl font-bold text-gray-800">Historial de Ventas</h2>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3"># Factura</th>
                                    <th class="px-6 py-3">Fecha</th>
                                    <th class="px-6 py-3">Cliente</th>
                                    <th class="px-6 py-3">Items</th>
                                    <th class="px-6 py-3 text-right">Total</th>
                                    <th class="px-6 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="sales-table-body">
                                <!-- JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

             <!-- VIEW: EXPENSES -->
             <section id="view-expenses" class="hidden space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Gastos</h2>
                    <button onclick="openModal('expense-modal')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <i class="fas fa-plus"></i> Registrar Gasto
                    </button>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-6 py-3">Descripción</th>
                                <th class="px-6 py-3">Categoría</th>
                                <th class="px-6 py-3">Fecha</th>
                                <th class="px-6 py-3 text-right">Monto</th>
                                <th class="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="expenses-table-body">
                            <!-- JS -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- VIEW: CLIENTS -->
            <section id="view-clients" class="hidden space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Clientes</h2>
                    <button onclick="openModal('client-modal')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <i class="fas fa-user-plus"></i> Nuevo Cliente
                    </button>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-6 py-3">Nombre</th>
                                <th class="px-6 py-3">Email</th>
                                <th class="px-6 py-3">Teléfono</th>
                                <th class="px-6 py-3 text-right">Compras Totales</th>
                                <th class="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="clients-table-body">
                            <!-- JS -->
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </main>

    <!-- MODALS -->

    <!-- Product Modal -->
    <div id="product-modal" class="modal fixed inset-0 bg-black bg-opacity-50 hidden z-40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 class="font-bold text-gray-800" id="product-modal-title">Nuevo Producto</h3>
                <button onclick="closeModal('product-modal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <form id="product-form" onsubmit="saveProduct(event)" class="p-4 space-y-4">
                <input type="hidden" id="prod-id">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input type="text" id="prod-name" required class="mt-1 w-full border rounded px-3 py-2">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Categoría</label>
                        <input type="text" id="prod-cat" list="categories-list" required class="mt-1 w-full border rounded px-3 py-2">
                        <datalist id="categories-list">
                            <option value="General">
                            <option value="Bebidas">
                            <option value="Alimentos">
                            <option value="Servicios">
                        </datalist>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Stock Inicial</label>
                        <input type="number" id="prod-stock" required min="0" class="mt-1 w-full border rounded px-3 py-2">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Costo (Compra)</label>
                        <input type="number" step="0.01" id="prod-cost" required min="0" class="mt-1 w-full border rounded px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Precio (Venta)</label>
                        <input type="number" step="0.01" id="prod-price" required min="0" class="mt-1 w-full border rounded px-3 py-2">
                    </div>
                </div>
                <div class="pt-2">
                    <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">Guardar Producto</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Client Modal -->
    <div id="client-modal" class="modal fixed inset-0 bg-black bg-opacity-50 hidden z-40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 class="font-bold text-gray-800">Registrar Cliente</h3>
                <button onclick="closeModal('client-modal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <form id="client-form" onsubmit="saveClient(event)" class="p-4 space-y-4">
                <input type="hidden" id="client-id">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input type="text" id="client-name" required class="mt-1 w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="client-email" class="mt-1 w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input type="tel" id="client-phone" class="mt-1 w-full border rounded px-3 py-2">
                </div>
                <div class="pt-2">
                    <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">Guardar Cliente</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Expense Modal -->
    <div id="expense-modal" class="modal fixed inset-0 bg-black bg-opacity-50 hidden z-40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 class="font-bold text-gray-800">Registrar Gasto</h3>
                <button onclick="closeModal('expense-modal')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <form id="expense-form" onsubmit="saveExpense(event)" class="p-4 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Descripción</label>
                    <input type="text" id="exp-desc" required placeholder="Ej: Pago de Luz" class="mt-1 w-full border rounded px-3 py-2">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Monto</label>
                        <input type="number" step="0.01" id="exp-amount" required class="mt-1 w-full border rounded px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Categoría</label>
                        <select id="exp-cat" class="mt-1 w-full border rounded px-3 py-2">
                            <option value="Operativo">Operativo</option>
                            <option value="Nomina">Nómina</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Fecha</label>
                    <input type="date" id="exp-date" required class="mt-1 w-full border rounded px-3 py-2">
                </div>
                <div class="pt-2">
                    <button type="submit" class="w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600">Registrar Gasto</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Invoice Modal (Printable) -->
    <div id="invoice-modal" class="modal fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto" id="invoice-modal-content">
            <div class="p-8" id="invoice-content">
                <!-- Header -->
                <div class="flex justify-between items-start mb-8 border-b pb-4">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800">FACTURA</h1>
                        <p class="text-gray-500 text-sm mt-1"># <span id="inv-number">0000</span></p>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-xl text-indigo-600">Mi Empresa S.A.S</div>
                        <p class="text-gray-500 text-sm">Calle 123 # 45-67</p>
                        <p class="text-gray-500 text-sm">Ciudad, País</p>
                        <p class="text-gray-500 text-sm">Tel: +57 300 123 4567</p>
                    </div>
                </div>

                <!-- Info -->
                <div class="flex justify-between mb-8">
                    <div>
                        <p class="text-xs font-bold text-gray-500 uppercase">Facturar a:</p>
                        <p class="font-bold text-gray-800" id="inv-client">Cliente General</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-bold text-gray-500 uppercase">Fecha:</p>
                        <p class="font-bold text-gray-800" id="inv-date">01/01/2023</p>
                    </div>
                </div>

                <!-- Table -->
                <table class="w-full mb-8">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="text-left py-2 px-2 text-xs font-bold text-gray-600 uppercase">Item</th>
                            <th class="text-right py-2 px-2 text-xs font-bold text-gray-600 uppercase">Cant.</th>
                            <th class="text-right py-2 px-2 text-xs font-bold text-gray-600 uppercase">Precio</th>
                            <th class="text-right py-2 px-2 text-xs font-bold text-gray-600 uppercase">Total</th>
                        </tr>
                    </thead>
                    <tbody id="inv-items" class="text-sm">
                        <!-- Items go here -->
                    </tbody>
                </table>

                <!-- Totals -->
                <div class="flex justify-end mb-8">
                    <div class="w-1/2 space-y-2">
                        <div class="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span id="inv-subtotal">$0.00</span>
                        </div>
                        <div class="flex justify-between text-gray-600">
                            <span>Impuesto (19%):</span>
                            <span id="inv-tax">$0.00</span>
                        </div>
                        <div class="flex justify-between font-bold text-xl text-gray-800 border-t pt-2">
                            <span>Total:</span>
                            <span id="inv-total">$0.00</span>
                        </div>
                    </div>
                </div>

                <div class="text-center text-gray-400 text-sm mt-12">
                    <p>¡Gracias por su compra!</p>
                </div>
            </div>

            <!-- Actions -->
            <div class="bg-gray-50 p-4 flex justify-end gap-3 no-print border-t">
                <button onclick="closeModal('invoice-modal')" class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cerrar</button>
                <button onclick="window.print()" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2">
                    <i class="fas fa-print"></i> Imprimir
                </button>
            </div>
        </div>
    </div>

    <!-- Confirmation Modal (New) -->
    <div id="confirm-modal" class="modal fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden transform transition-all">
            <div class="p-6">
                <div class="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
                    <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900 text-center mb-2">¿Estás seguro?</h3>
                <p class="text-gray-500 text-center text-sm" id="confirm-message">Esta acción no se puede deshacer.</p>
            </div>
            <div class="bg-gray-50 px-6 py-4 flex justify-center gap-3 border-t">
                <button onclick="closeConfirmModal()" class="w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                    Cancelar
                </button>
                <button onclick="executeConfirmAction()" class="w-1/2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                    Sí, eliminar
                </button>
            </div>
        </div>
    </div>

    <!-- JAVASCRIPT LOGIC -->
    <script>
        // --- DATA STORE ---
        let data = {
            products: [],
            clients: [{id: 1, name: 'Cliente General', email: '', phone: '', totalSpent: 0}],
            sales: [],
            expenses: []
        };

        const TAX_RATE = 0.19;

        // --- INIT ---
        window.onload = function() {
            loadData();
            updateDashboard();
            router('dashboard');
        };

        // --- LOCAL STORAGE MANAGER ---
        function saveData() {
            localStorage.setItem('pymeData', JSON.stringify(data));
            updateDashboard(); // Refresh stats whenever data changes
        }

        function loadData() {
            const stored = localStorage.getItem('pymeData');
            if (stored) {
                data = JSON.parse(stored);
            } else {
                // Seed some fake data for demo
                seedData();
            }
        }

        function seedData() {
            data.products = [
                {id: 1715, name: 'Camiseta Básica', category: 'Ropa', stock: 50, price: 99900, cost: 45000},
                {id: 1716, name: 'Pantalón Jean', category: 'Ropa', stock: 20, price: 180000, cost: 90000},
                {id: 1717, name: 'Zapatillas Deportivas', category: 'Calzado', stock: 5, price: 350000, cost: 175000},
                {id: 1718, name: 'Gorra Logo', category: 'Accesorios', stock: 100, price: 50000, cost: 15000},
            ];
            data.expenses = [
                {id: 1, description: 'Alquiler Local', amount: 2000000, category: 'Operativo', date: '2023-10-01'},
                {id: 2, description: 'Internet', amount: 120000, category: 'Servicios', date: '2023-10-05'}
            ];
            saveData();
        }

        // --- CONFIRMATION LOGIC (NEW) ---
        let pendingAction = null;

        function showConfirmModal(message, action) {
            document.getElementById('confirm-message').innerText = message;
            pendingAction = action;
            document.getElementById('confirm-modal').classList.remove('hidden');
        }

        function closeConfirmModal() {
            document.getElementById('confirm-modal').classList.add('hidden');
            pendingAction = null;
        }

        function executeConfirmAction() {
            if (pendingAction) {
                pendingAction();
            }
            closeConfirmModal();
        }

        function resetData() {
            showConfirmModal('Se borrarán todos los datos y se recargará la página.', () => {
                localStorage.removeItem('pymeData');
                location.reload();
            });
        }

        // --- ROUTING / UI ---
        function router(viewId) {
            // Hide all views
            document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
            // Show selected view
            document.getElementById(`view-${viewId}`).classList.remove('hidden');
            
            // Update sidebar active state
            document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
            document.getElementById(`nav-${viewId}`).classList.add('active');

            // Trigger specific renderers
            if(viewId === 'inventory') renderInventory();
            if(viewId === 'pos') initPOS();
            if(viewId === 'sales') renderSalesHistory();
            if(viewId === 'expenses') renderExpenses();
            if(viewId === 'clients') renderClients();
        }

        // --- FORMATTERS ---
        const formatCurrency = (num) => {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
        };

        const formatDate = (dateString) => {
            if(!dateString) return '';
            return new Date(dateString).toLocaleDateString('es-CO');
        };

        // --- TOAST NOTIFICATIONS ---
        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            const colors = type === 'success' ? 'bg-emerald-500' : (type === 'error' ? 'bg-red-500' : 'bg-blue-500');
            
            toast.className = `${colors} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0 flex items-center gap-2`;
            toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> <span>${message}</span>`;
            
            container.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.classList.remove('translate-x-full', 'opacity-0');
            }, 10);

            // Remove
            setTimeout(() => {
                toast.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // --- MODALS ---
        function openModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
        }
        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
        }

        // --- DASHBOARD LOGIC ---
        function updateDashboard() {
            const totalSales = data.sales.reduce((acc, curr) => acc + curr.total, 0);
            const totalExpenses = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
            // Calculate Profit: (Sales - Cost of Goods Sold) - Expenses
            // For simplicity in this lightweight version, we'll assume Cost is calculated at time of sale or just do Revenue - Expenses
            // A better way: sum(item.price - item.cost) for all sold items - expenses
            
            let grossProfit = 0;
            data.sales.forEach(sale => {
                sale.items.forEach(item => {
                    // Try to find original cost, otherwise assume 50% margin
                    const product = data.products.find(p => p.id === item.id);
                    const cost = product ? product.cost : (item.price * 0.5);
                    grossProfit += (item.price - cost) * item.qty;
                });
            });

            const netProfit = grossProfit - totalExpenses;
            const lowStockCount = data.products.filter(p => p.stock < 10).length;

            document.getElementById('dash-sales').innerText = formatCurrency(totalSales);
            document.getElementById('dash-expenses').innerText = formatCurrency(totalExpenses);
            document.getElementById('dash-profit').innerText = formatCurrency(netProfit);
            document.getElementById('dash-low-stock').innerText = lowStockCount;

            // Latest Sales
            const tbody = document.getElementById('dash-latest-sales');
            tbody.innerHTML = '';
            data.sales.slice(-5).reverse().forEach(sale => {
                tbody.innerHTML += `
                    <tr class="bg-white border-b">
                        <td class="px-4 py-2 font-medium text-gray-900">#${sale.id}</td>
                        <td class="px-4 py-2 text-gray-500">${new Date(sale.date).toLocaleDateString()}</td>
                        <td class="px-4 py-2 text-right font-bold text-gray-700">${formatCurrency(sale.total)}</td>
                    </tr>
                `;
            });

            // Top Products (simple frequency count)
            const productCount = {};
            data.sales.forEach(s => s.items.forEach(i => {
                productCount[i.name] = (productCount[i.name] || 0) + i.qty;
            }));
            const topProducts = Object.entries(productCount).sort((a,b) => b[1] - a[1]).slice(0,5);
            
            const prodList = document.getElementById('dash-top-products');
            prodList.innerHTML = '';
            topProducts.forEach(([name, count]) => {
                prodList.innerHTML += `
                    <li class="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                        <span class="font-medium text-gray-700">${name}</span>
                        <span class="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-xs font-bold">${count} sold</span>
                    </li>
                `;
            });
        }

        // --- INVENTORY LOGIC ---
        function renderInventory() {
            const tbody = document.getElementById('inventory-table-body');
            const filter = document.getElementById('inventory-search').value.toLowerCase();
            tbody.innerHTML = '';

            data.products.forEach(p => {
                if(p.name.toLowerCase().includes(filter)) {
                    const stockClass = p.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-600';
                    tbody.innerHTML += `
                        <tr class="bg-white border-b hover:bg-gray-50">
                            <td class="px-6 py-4 font-medium text-gray-900">${p.name}</td>
                            <td class="px-6 py-4">${p.category}</td>
                            <td class="px-6 py-4">${formatCurrency(p.price)}</td>
                            <td class="px-6 py-4">${formatCurrency(p.cost)}</td>
                            <td class="px-6 py-4 text-center ${stockClass}">${p.stock}</td>
                            <td class="px-6 py-4 text-right">
                                <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:text-red-700 ml-2"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                }
            });
        }

        document.getElementById('inventory-search').addEventListener('input', renderInventory);

        function saveProduct(e) {
            e.preventDefault();
            const name = document.getElementById('prod-name').value;
            const cat = document.getElementById('prod-cat').value;
            const stock = parseInt(document.getElementById('prod-stock').value);
            const price = parseFloat(document.getElementById('prod-price').value);
            const cost = parseFloat(document.getElementById('prod-cost').value);

            const newProd = {
                id: Date.now(),
                name, category: cat, stock, price, cost
            };

            data.products.push(newProd);
            saveData();
            closeModal('product-modal');
            document.getElementById('product-form').reset();
            renderInventory();
            showToast('Producto agregado correctamente');
        }

        function deleteProduct(id) {
            showConfirmModal('¿Estás seguro de eliminar este producto del inventario?', () => {
                data.products = data.products.filter(p => p.id !== id);
                saveData();
                renderInventory();
                showToast('Producto eliminado', 'error');
            });
        }

        // --- POS / SALES LOGIC ---
        let cart = [];

        function initPOS() {
            renderPosProducts();
            updateCartUI();
            
            // Populate Client Select
            const clientSelect = document.getElementById('pos-client-select');
            clientSelect.innerHTML = '';
            data.clients.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.text = c.name;
                clientSelect.appendChild(opt);
            });
        }

        document.getElementById('pos-search').addEventListener('input', renderPosProducts);

        function renderPosProducts() {
            const grid = document.getElementById('pos-products-grid');
            const search = document.getElementById('pos-search').value.toLowerCase();
            grid.innerHTML = '';

            data.products.forEach(p => {
                if(p.name.toLowerCase().includes(search) && p.stock > 0) {
                    grid.innerHTML += `
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between" onclick="addToCart(${p.id})">
                            <div>
                                <h4 class="font-bold text-gray-800 line-clamp-2">${p.name}</h4>
                                <p class="text-xs text-gray-500 mt-1">${p.category}</p>
                            </div>
                            <div class="flex justify-between items-end mt-3">
                                <span class="text-indigo-600 font-bold">${formatCurrency(p.price)}</span>
                                <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Stock: ${p.stock}</span>
                            </div>
                        </div>
                    `;
                }
            });
        }

        function addToCart(productId) {
            const product = data.products.find(p => p.id === productId);
            const existingItem = cart.find(i => i.id === productId);

            if (existingItem) {
                if (existingItem.qty < product.stock) {
                    existingItem.qty++;
                } else {
                    showToast('No hay suficiente stock', 'error');
                    return;
                }
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    qty: 1,
                    maxStock: product.stock
                });
            }
            updateCartUI();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartUI();
        }

        function updateCartUI() {
            const container = document.getElementById('pos-cart-items');
            
            if(cart.length === 0) {
                container.innerHTML = '<div class="text-center text-gray-400 mt-10"><i class="fas fa-shopping-basket text-4xl mb-2"></i><br>El carrito está vacío</div>';
                document.getElementById('cart-subtotal').innerText = '$0.00';
                document.getElementById('cart-tax').innerText = '$0.00';
                document.getElementById('cart-total').innerText = '$0.00';
                return;
            }

            container.innerHTML = '';
            let subtotal = 0;

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.qty;
                subtotal += itemTotal;
                container.innerHTML += `
                    <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div class="flex-1">
                            <p class="text-sm font-bold text-gray-800">${item.name}</p>
                            <p class="text-xs text-gray-500">${item.qty} x ${formatCurrency(item.price)}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="font-bold text-sm text-indigo-700">${formatCurrency(itemTotal)}</span>
                            <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                `;
            });

            const tax = subtotal * TAX_RATE;
            const total = subtotal + tax;

            document.getElementById('cart-subtotal').innerText = formatCurrency(subtotal);
            document.getElementById('cart-tax').innerText = formatCurrency(tax);
            document.getElementById('cart-total').innerText = formatCurrency(total);
        }

        function processSale() {
            if(cart.length === 0) {
                showToast('Agrega productos al carrito primero', 'error');
                return;
            }

            const clientId = document.getElementById('pos-client-select').value;
            const clientName = document.getElementById('pos-client-select').options[document.getElementById('pos-client-select').selectedIndex].text;

            // Calc totals
            const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
            const tax = subtotal * TAX_RATE;
            const total = subtotal + tax;

            // Create Sale Record
            const sale = {
                id: Date.now().toString().slice(-6), // Simple short ID
                date: new Date().toISOString(),
                clientId: clientId,
                clientName: clientName,
                items: [...cart],
                subtotal: subtotal,
                tax: tax,
                total: total
            };

            // Update Stock
            cart.forEach(cartItem => {
                const product = data.products.find(p => p.id === cartItem.id);
                if(product) {
                    product.stock -= cartItem.qty;
                }
            });

            // Update Client Stats
            const client = data.clients.find(c => c.id == clientId);
            if(client) client.totalSpent = (client.totalSpent || 0) + total;

            data.sales.push(sale);
            saveData();
            
            // Show Invoice
            showInvoice(sale);
            
            // Reset Cart
            cart = [];
            updateCartUI();
            renderPosProducts(); // Refresh stock display
            showToast('¡Venta realizada con éxito!');
        }

        // --- INVOICE VIEW ---
        function showInvoice(sale) {
            document.getElementById('inv-number').innerText = sale.id;
            document.getElementById('inv-date').innerText = new Date(sale.date).toLocaleDateString() + ' ' + new Date(sale.date).toLocaleTimeString();
            document.getElementById('inv-client').innerText = sale.clientName;
            
            const tbody = document.getElementById('inv-items');
            tbody.innerHTML = '';
            sale.items.forEach(item => {
                tbody.innerHTML += `
                    <tr class="border-b border-gray-100">
                        <td class="text-left py-2 px-2">${item.name}</td>
                        <td class="text-right py-2 px-2">${item.qty}</td>
                        <td class="text-right py-2 px-2">${formatCurrency(item.price)}</td>
                        <td class="text-right py-2 px-2 font-medium">${formatCurrency(item.price * item.qty)}</td>
                    </tr>
                `;
            });

            document.getElementById('inv-subtotal').innerText = formatCurrency(sale.subtotal);
            document.getElementById('inv-tax').innerText = formatCurrency(sale.tax);
            document.getElementById('inv-total').innerText = formatCurrency(sale.total);

            openModal('invoice-modal');
        }

        function renderSalesHistory() {
            const tbody = document.getElementById('sales-table-body');
            tbody.innerHTML = '';
            
            // Sort by new
            const sorted = [...data.sales].sort((a,b) => new Date(b.date) - new Date(a.date));

            sorted.forEach(sale => {
                tbody.innerHTML += `
                    <tr class="bg-white border-b hover:bg-gray-50">
                        <td class="px-6 py-4 font-bold text-gray-700">#${sale.id}</td>
                        <td class="px-6 py-4">${new Date(sale.date).toLocaleDateString()}</td>
                        <td class="px-6 py-4">${sale.clientName}</td>
                        <td class="px-6 py-4">${sale.items.length} items</td>
                        <td class="px-6 py-4 text-right font-bold text-indigo-600">${formatCurrency(sale.total)}</td>
                        <td class="px-6 py-4 text-center">
                            <button onclick='openHistoryInvoice(${JSON.stringify(sale).replace(/'/g, "&apos;")})' class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded"><i class="fas fa-eye"></i> Ver</button>
                        </td>
                    </tr>
                `;
            });
        }
        
        // Helper specifically for the button onclick since passing object in HTML is tricky
        window.openHistoryInvoice = function(sale) {
            showInvoice(sale);
        }

        // --- EXPENSES LOGIC ---
        function saveExpense(e) {
            e.preventDefault();
            const desc = document.getElementById('exp-desc').value;
            const amount = parseFloat(document.getElementById('exp-amount').value);
            const cat = document.getElementById('exp-cat').value;
            const date = document.getElementById('exp-date').value;

            const exp = {
                id: Date.now(),
                description: desc,
                amount: amount,
                category: cat,
                date: date
            };

            data.expenses.push(exp);
            saveData();
            closeModal('expense-modal');
            document.getElementById('expense-form').reset();
            renderExpenses();
            showToast('Gasto registrado');
        }

        function renderExpenses() {
            const tbody = document.getElementById('expenses-table-body');
            tbody.innerHTML = '';
            data.expenses.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(exp => {
                tbody.innerHTML += `
                    <tr class="bg-white border-b">
                        <td class="px-6 py-4">${exp.description}</td>
                        <td class="px-6 py-4"><span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">${exp.category}</span></td>
                        <td class="px-6 py-4">${formatDate(exp.date)}</td>
                        <td class="px-6 py-4 text-right font-medium text-red-500">-${formatCurrency(exp.amount)}</td>
                        <td class="px-6 py-4 text-center">
                            <button onclick="deleteExpense(${exp.id})" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        function deleteExpense(id) {
            showConfirmModal('¿Estás seguro de eliminar este registro de gasto?', () => {
                data.expenses = data.expenses.filter(e => e.id !== id);
                saveData();
                renderExpenses();
                showToast('Gasto eliminado', 'error');
            });
        }

        // --- CLIENTS LOGIC ---
        function saveClient(e) {
            e.preventDefault();
            const name = document.getElementById('client-name').value;
            const email = document.getElementById('client-email').value;
            const phone = document.getElementById('client-phone').value;

            const client = {
                id: Date.now(),
                name, email, phone, totalSpent: 0
            };

            data.clients.push(client);
            saveData();
            closeModal('client-modal');
            document.getElementById('client-form').reset();
            renderClients();
            showToast('Cliente registrado');
        }

        function renderClients() {
            const tbody = document.getElementById('clients-table-body');
            tbody.innerHTML = '';
            data.clients.forEach(c => {
                tbody.innerHTML += `
                    <tr class="bg-white border-b">
                        <td class="px-6 py-4 font-bold text-gray-700">${c.name}</td>
                        <td class="px-6 py-4">${c.email || '-'}</td>
                        <td class="px-6 py-4">${c.phone || '-'}</td>
                        <td class="px-6 py-4 text-right text-emerald-600 font-medium">${formatCurrency(c.totalSpent || 0)}</td>
                        <td class="px-6 py-4 text-center">
                            <button class="text-gray-400 hover:text-gray-600"><i class="fas fa-edit"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
    </script>
</body>
</html>
