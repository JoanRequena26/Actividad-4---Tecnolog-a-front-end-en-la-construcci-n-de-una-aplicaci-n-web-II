import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  LogOut,
  Printer,
  Save,
  X
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  where
} from "firebase/firestore";

// --- Configuración de Firebase ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Componentes UI Reutilizables ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 active:scale-95",
    outline: "border border-gray-300 text-gray-600 hover:bg-gray-50"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1 mb-3">
    {label && <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>}
    <input 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      {...props}
    />
  </div>
);

// --- Componente Principal ---
export default function BusinessManager() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Estados de datos
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Estados de formularios/UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'product', 'transaction', 'invoice'
  const [formData, setFormData] = useState({});
  const [cart, setCart] = useState([]); // Para crear facturas

  // --- Autenticación y Carga de Datos ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Escuchar datos de Firestore cuando hay usuario
  useEffect(() => {
    if (!user) return;

    // Rutas protegidas por usuario
    const inventoryRef = collection(db, 'artifacts', appId, 'users', user.uid, 'inventory');
    const transactionsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'transactions');
    const invoicesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'invoices');

    // Listeners
    const unsubInv = onSnapshot(inventoryRef, (snapshot) => {
      setInventory(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Inv Error", err));

    const unsubTrans = onSnapshot(query(transactionsRef, orderBy('date', 'desc')), (snapshot) => {
      setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Trans Error", err));

    const unsubInvcs = onSnapshot(query(invoicesRef, orderBy('date', 'desc')), (snapshot) => {
      setInvoices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Invcs Error", err));

    return () => {
      unsubInv();
      unsubTrans();
      unsubInvcs();
    };
  }, [user]);

  // --- Lógica de Negocio ---
  
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

    const inventoryValue = inventory.reduce((acc, curr) => {
      return acc + (parseFloat(curr.price || 0) * parseFloat(curr.stock || 0));
    }, 0);

    const lowStockItems = inventory.filter(i => i.stock < 5).length;

    return { totalIncome, totalExpense, netProfit: totalIncome - totalExpense, inventoryValue, lowStockItems };
  }, [inventory, transactions]);

  // --- Manejadores de Acciones ---

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'inventory'), {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        updatedAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({});
    } catch (err) {
      alert("Error al guardar producto");
    }
  };

  const handleDeleteProduct = async (id) => {
    if(!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'inventory', id));
    } catch(err) { console.error(err); }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString(),
      });
      setIsModalOpen(false);
      setFormData({});
    } catch (err) { alert("Error transacción"); }
  };

  const handleCreateInvoice = async () => {
    if (cart.length === 0 || !formData.clientName) return;
    
    try {
      const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      
      // 1. Guardar Factura
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'invoices'), {
        clientName: formData.clientName,
        items: cart,
        total: total,
        date: new Date().toISOString(),
        status: 'paid' // Simplificado
      });

      // 2. Registrar como Ingreso
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), {
        type: 'income',
        description: `Venta Factura - ${formData.clientName}`,
        amount: total,
        date: new Date().toISOString(),
        category: 'Ventas'
      });

      // 3. Descontar Inventario
      for (const item of cart) {
        const productRef = doc(db, 'artifacts', appId, 'users', user.uid, 'inventory', item.id);
        const newStock = item.stock - item.qty;
        await updateDoc(productRef, { stock: newStock });
      }

      setCart([]);
      setFormData({});
      setIsModalOpen(false);
      setActiveTab('invoices');
    } catch (err) {
      console.error(err);
      alert("Error al crear factura");
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) return alert("No hay suficiente stock");
      setCart(cart.map(c => c.id === product.id ? {...c, qty: c.qty + 1} : c));
    } else {
      setCart([...cart, {...product, qty: 1}]);
    }
  };

  // --- Renderizado de Vistas ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <p className="text-gray-500 text-sm">Ingresos Totales</p>
          <h3 className="text-2xl font-bold text-gray-800">${stats.totalIncome.toFixed(2)}</h3>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <p className="text-gray-500 text-sm">Gastos Totales</p>
          <h3 className="text-2xl font-bold text-gray-800">${stats.totalExpense.toFixed(2)}</h3>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <p className="text-gray-500 text-sm">Ganancia Neta</p>
          <h3 className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.netProfit.toFixed(2)}
          </h3>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <p className="text-gray-500 text-sm">Valor Inventario</p>
          <h3 className="text-2xl font-bold text-gray-800">${stats.inventoryValue.toFixed(2)}</h3>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Alertas de Stock</h3>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">{stats.lowStockItems} Items</span>
          </div>
          <div className="overflow-y-auto max-h-60">
            {inventory.filter(i => i.stock < 5).length === 0 ? (
              <p className="text-gray-400 text-center py-4">Todo el inventario está saludable.</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr><th className="p-2">Producto</th><th className="p-2">Stock</th></tr>
                </thead>
                <tbody>
                  {inventory.filter(i => i.stock < 5).map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2 text-red-600 font-bold">{item.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg text-gray-800 mb-4">Últimas Transacciones</h3>
          <div className="overflow-y-auto max-h-60 space-y-3">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount}
                </span>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-gray-400 text-center">No hay movimientos recientes.</p>}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>
        <Button onClick={() => { setModalType('product'); setFormData({}); setIsModalOpen(true); }}>
          <Plus size={18} /> Nuevo Producto
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-500 text-sm font-mono">{item.sku || '---'}</td>
                  <td className="p-4 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-600">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{item.category}</span>
                  </td>
                  <td className="p-4 text-gray-800">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.stock} un.
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteProduct(item.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Finanzas</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setModalType('transaction'); setFormData({type: 'expense'}); setIsModalOpen(true); }}>
            <TrendingDown size={18} className="text-red-500" /> Registrar Gasto
          </Button>
          <Button variant="outline" onClick={() => { setModalType('transaction'); setFormData({type: 'income'}); setIsModalOpen(true); }}>
            <TrendingUp size={18} className="text-green-500" /> Registrar Ingreso
          </Button>
        </div>
      </div>

      <Card>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Categoría</th>
              <th className="p-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map(t => (
              <tr key={t.id}>
                <td className="p-3 text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-3 font-medium">{t.description}</td>
                <td className="p-3 text-sm text-gray-500">{t.category}</td>
                <td className={`p-3 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const renderPOS = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Listado Productos */}
      <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
        <div className="bg-white p-4 rounded-xl shadow-sm border flex gap-2">
          <Search className="text-gray-400" />
          <input placeholder="Buscar producto..." className="bg-transparent w-full focus:outline-none" />
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 pb-20">
          {inventory.map(item => (
            <div 
              key={item.id} 
              onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all active:scale-95 select-none"
            >
              <div className="h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-300">
                <Package size={32} />
              </div>
              <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-blue-600 font-bold">${item.price}</span>
                <span className="text-xs text-gray-500">Stock: {item.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito / Factura Actual */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b bg-gray-50 rounded-t-xl">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <ShoppingCart size={18} /> Nueva Venta
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <ShoppingCart size={48} className="mb-2"/>
              <p>Carrito vacío</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">${item.price} x {item.qty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">${(item.price * item.qty).toFixed(2)}</span>
                  <button 
                    onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-xl space-y-3">
          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total:</span>
            <span>${cart.reduce((acc, i) => acc + (i.price * i.qty), 0).toFixed(2)}</span>
          </div>
          <Input 
            placeholder="Nombre del Cliente" 
            value={formData.clientName || ''}
            onChange={e => setFormData({...formData, clientName: e.target.value})}
          />
          <Button 
            className="w-full justify-center" 
            onClick={handleCreateInvoice}
            disabled={cart.length === 0 || !formData.clientName}
          >
            <Save size={18} /> Generar Factura
          </Button>
        </div>
      </div>
    </div>
  );

  const renderInvoicesList = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Historial de Facturas</h2>
      <Card>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Cliente</th>
              <th className="p-3 text-center">Items</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="p-3 text-sm">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="p-3 font-medium">{inv.clientName}</td>
                <td className="p-3 text-center text-sm">{inv.items.length}</td>
                <td className="p-3 text-right font-bold text-blue-600">${inv.total.toFixed(2)}</td>
                <td className="p-3 text-center">
                  <button className="text-gray-500 hover:text-blue-600" title="Imprimir" onClick={() => alert("Función de imprimir abriría PDF generado aquí.")}>
                    <Printer size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  // --- Renderizado Principal ---
  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-blue-600">Cargando Sistema...</div>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">P</div>
            PyME Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gestión Empresarial v1.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
            { id: 'inventory', icon: Package, label: 'Inventario' },
            { id: 'pos', icon: ShoppingCart, label: 'Punto de Venta' },
            { id: 'invoices', icon: FileText, label: 'Facturas' },
            { id: 'finances', icon: DollarSign, label: 'Finanzas' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
              <Users size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Admin Usuario</p>
              <p className="text-xs text-slate-400 truncate">ID: {user?.uid.slice(0,5)}...</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between">
          <h1 className="font-bold text-gray-800">PyME Manager</h1>
          <button className="text-gray-600"><Settings size={20}/></button>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'pos' && renderPOS()}
          {activeTab === 'invoices' && renderInvoicesList()}
          {activeTab === 'finances' && renderTransactions()}
        </div>
      </main>

      {/* Modal Genérico */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {modalType === 'product' && 'Agregar Producto'}
              {modalType === 'transaction' && (formData.type === 'income' ? 'Registrar Ingreso' : 'Registrar Gasto')}
            </h3>

            <form onSubmit={modalType === 'product' ? handleAddProduct : handleAddTransaction} className="space-y-4">
              
              {modalType === 'product' && (
                <>
                  <Input label="Nombre del Producto" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="SKU / Código" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} />
                    <Input label="Categoría" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Precio ($)" type="number" step="0.01" required value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                    <Input label="Stock Inicial" type="number" required value={formData.stock || ''} onChange={e => setFormData({...formData, stock: e.target.value})} />
                  </div>
                </>
              )}

              {modalType === 'transaction' && (
                <>
                  <Input label="Descripción" required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  <Input label="Categoría (ej: Luz, Alquiler, Venta)" required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                  <Input label="Monto ($)" type="number" step="0.01" required value={formData.amount || ''} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
