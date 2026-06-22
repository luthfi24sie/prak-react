import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"
import Loading from "./Loading"

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, profile, loading } = useAuth()

    if (loading) {
        return <Loading />
    }

    // Belum login -> redirect ke login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Sudah login tapi role tidak sesuai
    if (requiredRole && profile && profile.role !== requiredRole) {
        if (profile.role === 'admin') {
            return <Navigate to="/" replace />
        }
        return <Navigate to="/member/dashboard" replace />
    }

    return children
}
