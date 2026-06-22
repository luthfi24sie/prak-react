import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useAuth } from "../../lib/AuthContext"
import PageHeader from "../../components/PageHeader"
import AlertBox from "../../components/AlertBox"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useNavigate } from "react-router-dom"

export default function CreateOrder() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [notes, setNotes] = useState("")

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .gt('stock', 0)
                .order('name')

            if (error) throw error
            setProducts(data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoadingProducts(false)
        }
    }

    const addToCart = (product) => {
        const existing = cart.find(item => item.product_id === product.id)
        if (existing) {
            if (existing.quantity >= product.stock) return
            setCart(cart.map(item =>
                item.product_id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ))
        } else {
            setCart([...cart, {
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                maxStock: product.stock,
            }])
        }
    }

    const updateQuantity = (productId, newQty) => {
        if (newQty <= 0) {
            setCart(cart.filter(item => item.product_id !== productId))
            return
        }
        setCart(cart.map(item =>
            item.product_id === productId
                ? { ...item, quantity: Math.min(newQty, item.maxStock) }
                : item
        ))
    }

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId))
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (cart.length === 0) {
            setError("Keranjang masih kosong")
            return
        }

        setLoading(true)
        setError("")
        setSuccess("")

        try {
            if (!user) throw new Error("Anda belum login")

            // 1. Insert order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: totalAmount,
                    notes: notes || null,
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Insert order items
            const items = cart.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.price,
            }))

            const { error: itemsError } = await supabase.from('order_items').insert(items)
            if (itemsError) throw itemsError

            // 3. Kurangi stok
            for (const item of cart) {
                const { error: stockError } = await supabase.rpc('decrement_stock', {
                    p_product_id: item.product_id,
                    p_qty: item.quantity,
                })
                if (stockError) console.error("Stock error:", stockError)
            }

            setSuccess("Pesanan berhasil dibuat!")
            setCart([])
            setNotes("")
            setTimeout(() => navigate("/member/orders"), 2000)
        } catch (err) {
            setError(err.message || "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="pb-10">
            <PageHeader title="Buat Pesanan" breadcrumb={["Dashboard", "Buat Pesanan"]} />

            {error && <div className="px-5"><AlertBox type="error">{error}</AlertBox></div>}
            {success && <div className="px-5"><AlertBox type="success">{success}</AlertBox></div>}

            <div className="px-5 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-teks">Pilih Produk</h2>
                            <p className="text-sm text-gray-400 font-medium">Klik produk untuk menambahkan ke keranjang</p>
                        </div>

                        {loadingProducts ? (
                            <LoadingSpinner text="Memuat produk..." />
                        ) : (
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="p-4 rounded-2xl border border-gray-100 hover:border-hijau hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <h3 className="font-bold text-teks">{product.name}</h3>
                                        <p className="text-sm text-gray-400">{product.category}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="font-bold text-hijau">{formatRupiah(product.price)}</span>
                                            <span className="text-xs text-gray-400">Stok: {product.stock}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart */}
                <div>
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-teks">Keranjang</h2>
                            <p className="text-sm text-gray-400 font-medium">{cart.length} item</p>
                        </div>

                        {cart.length === 0 ? (
                            <div className="p-6 text-center text-gray-400">
                                <p>Keranjang masih kosong</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.product_id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-teks">{item.name}</p>
                                                <p className="text-xs text-gray-400">{formatRupiah(item.price)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                    className="w-7 h-7 rounded-lg bg-gray-200 text-teks font-bold text-sm hover:bg-gray-300"
                                                >-</button>
                                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-lg bg-gray-200 text-teks font-bold text-sm hover:bg-gray-300"
                                                >+</button>
                                                <button
                                                    onClick={() => removeFromCart(item.product_id)}
                                                    className="ml-2 text-red-400 hover:text-red-600 text-sm"
                                                >✕</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 border-t border-gray-50">
                                    <div className="mb-4">
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Catatan (opsional)"
                                            rows="2"
                                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-hijau transition-all resize-none text-sm"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-teks">Total:</span>
                                        <span className="text-xl font-extrabold text-hijau">{formatRupiah(totalAmount)}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-hijau text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? "Mohon Tunggu..." : "Buat Pesanan"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
