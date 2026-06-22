import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useAuth } from "../../lib/AuthContext"
import PageHeader from "../../components/PageHeader"
import LoadingSpinner from "../../components/LoadingSpinner"
import AlertBox from "../../components/AlertBox"

export default function MemberDashboard() {
    const { user, profile } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
    })

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            setLoading(true)

            if (!user) return

            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('status')
                .eq('user_id', user.id)

            if (ordersError) throw ordersError

            setStats({
                totalOrders: orders.length,
                pendingOrders: orders.filter(o => o.status === 'pending').length,
                completedOrders: orders.filter(o => o.status === 'completed').length,
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const tierBadge = (tier) => {
        const badges = { bronze: "🥉", silver: "🥈", gold: "🥇", platinum: "💎" }
        return badges[tier] || "🥉"
    }

    const tierColor = (tier) => {
        const colors = {
            bronze: "text-amber-700 bg-amber-50",
            silver: "text-gray-700 bg-gray-100",
            gold: "text-yellow-700 bg-yellow-50",
            platinum: "text-purple-700 bg-purple-50",
        }
        return colors[tier] || "text-amber-700 bg-amber-50"
    }

    if (loading) return <LoadingSpinner text="Memuat dashboard..." />

    return (
        <div className="pb-10">
            <PageHeader title="Dashboard Member" breadcrumb={["Dashboard"]} />

            {error && <div className="px-5"><AlertBox type="error">{error}</AlertBox></div>}

            {/* Info Profil & Tier */}
            <div className="px-5 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="bg-hijau rounded-2xl p-4 text-3xl text-white shadow-lg shadow-hijau/20">
                        {tierBadge(profile?.tier)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-extrabold text-teks capitalize">{profile?.tier}</span>
                        <span className="text-sm font-medium text-gray-400">Tier Saat Ini</span>
                    </div>
                </div>

                <div className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="bg-blue-500 rounded-2xl p-4 text-3xl text-white shadow-lg shadow-blue-500/20">
                        ⭐
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-extrabold text-teks">{profile?.total_points?.toLocaleString()}</span>
                        <span className="text-sm font-medium text-gray-400">Total Poin</span>
                    </div>
                </div>

                <div className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="bg-yellow-500 rounded-2xl p-4 text-3xl text-white shadow-lg shadow-yellow-500/20">
                        📦
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-extrabold text-teks">{stats.totalOrders}</span>
                        <span className="text-sm font-medium text-gray-400">Total Pesanan</span>
                    </div>
                </div>
            </div>

            {/* Ringkasan Pesanan */}
            <div className="px-5 mt-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-teks mb-4">Ringkasan Pesanan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl border border-gray-100 text-center">
                            <p className="text-2xl font-extrabold text-blue-500">{stats.pendingOrders}</p>
                            <p className="text-sm text-gray-400 font-medium">Pending</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 text-center">
                            <p className="text-2xl font-extrabold text-hijau">{stats.completedOrders}</p>
                            <p className="text-sm text-gray-400 font-medium">Completed</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 text-center">
                            <p className="text-2xl font-extrabold text-teks">{stats.totalOrders - stats.pendingOrders - stats.completedOrders}</p>
                            <p className="text-sm text-gray-400 font-medium">Lainnya</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tier Progress */}
            <div className="px-5 mt-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-teks mb-4">Progress Tier</h2>
                    <div className="space-y-3">
                        {[
                            { name: "Bronze", min: 0, max: 4999, icon: "🥉" },
                            { name: "Silver", min: 5000, max: 14999, icon: "🥈" },
                            { name: "Gold", min: 15000, max: 29999, icon: "🥇" },
                            { name: "Platinum", min: 30000, max: null, icon: "💎" },
                        ].map((t) => {
                            const isActive = profile?.tier === t.name.toLowerCase()
                            const progress = t.max
                                ? Math.min(((profile?.total_points || 0) - t.min) / (t.max - t.min) * 100, 100)
                                : (profile?.total_points || 0) >= t.min ? 100 : 0

                            return (
                                <div key={t.name} className={`p-4 rounded-2xl border ${isActive ? "border-hijau bg-hijau/5" : "border-gray-100"}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-teks">{t.icon} {t.name}</span>
                                        <span className="text-sm text-gray-400">
                                            {t.min.toLocaleString()} - {t.max ? t.max.toLocaleString() : "∞"} poin
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-hijau h-2 rounded-full transition-all"
                                            style={{ width: `${Math.max(0, progress)}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
