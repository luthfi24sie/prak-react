import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useAuth } from "../../lib/AuthContext"
import PageHeader from "../../components/PageHeader"
import LoadingSpinner from "../../components/LoadingSpinner"
import AlertBox from "../../components/AlertBox"
import EmptyState from "../../components/EmptyState"

export default function MemberOrders() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [orders, setOrders] = useState([])
    const [expandedOrder, setExpandedOrder] = useState(null)
    const [orderItems, setOrderItems] = useState({})

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            setLoading(true)
            setError("")

            const { data, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (ordersError) throw ordersError
            setOrders(data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const toggleDetail = async (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null)
            return
        }

        setExpandedOrder(orderId)

        if (!orderItems[orderId]) {
            const { data, error } = await supabase
                .from('order_items')
                .select('*, products(name)')
                .eq('order_id', orderId)

            if (!error && data) {
                setOrderItems(prev => ({ ...prev, [orderId]: data }))
            }
        }
    }

    const statusClass = (status) => {
        if (status === "completed") return "text-hijau bg-hijau/10"
        if (status === "pending") return "text-blue-600 bg-blue-50"
        if (status === "processing") return "text-yellow-600 bg-yellow-50"
        return "text-red-600 bg-red-50"
    }

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
        })
    }

    return (
        <div className="pb-10">
            <PageHeader title="History Pesanan" breadcrumb={["Dashboard", "History Pesanan"]} />

            {error && <div className="px-5"><AlertBox type="error">{error}</AlertBox></div>}

            <div className="px-5 mt-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-xl font-bold text-teks">Daftar Pesanan</h2>
                        <p className="text-sm text-gray-400 font-medium">Total: {orders.length} pesanan</p>
                    </div>

                    {loading ? (
                        <LoadingSpinner text="Memuat pesanan..." />
                    ) : orders.length === 0 ? (
                        <EmptyState text="Belum ada pesanan. Yuk buat pesanan pertama!" />
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleDetail(order.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-hijau/10 text-hijau flex items-center justify-center font-bold text-sm">
                                                #{order.id.slice(0, 4)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-teks text-sm">{order.id.slice(0, 8)}...</p>
                                                <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <div className="text-right">
                                                <p className="font-bold text-teks text-sm">{formatRupiah(order.total_amount)}</p>
                                                {order.points_earned > 0 && (
                                                    <p className="text-xs text-hijau font-medium">+{order.points_earned} poin</p>
                                                )}
                                            </div>
                                            <span className="text-gray-300 text-lg">{expandedOrder === order.id ? "▲" : "▼"}</span>
                                        </div>
                                    </div>

                                    {/* Expanded Detail */}
                                    {expandedOrder === order.id && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                                            {order.notes && (
                                                <p className="text-sm text-gray-500 mb-3">
                                                    <span className="font-bold">Catatan:</span> {order.notes}
                                                </p>
                                            )}

                                            {orderItems[order.id] ? (
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Produk</th>
                                                            <th className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Qty</th>
                                                            <th className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Harga</th>
                                                            <th className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {orderItems[order.id].map((item) => (
                                                            <tr key={item.id}>
                                                                <td className="px-4 py-3 text-sm font-bold text-teks">
                                                                    {item.products?.name || "Produk"}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-500">{formatRupiah(item.unit_price)}</td>
                                                                <td className="px-4 py-3 text-sm font-bold text-teks">{formatRupiah(item.subtotal)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="text-sm text-gray-400 text-center py-2">Memuat detail...</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
