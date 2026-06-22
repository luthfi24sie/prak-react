import { Outlet, NavLink } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"
import { FaHome, FaShoppingCart, FaListUl } from "react-icons/fa"

export default function MemberLayout() {
    const { profile } = useAuth()

    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-2 transition-all 
        ${isActive ?
            "text-hijau bg-green-200 font-extrabold" :
            "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`

    return (
        <div>
            <div id="app-container" className="bg-gray-100 min-h-screen flex">
                {/* Member Sidebar */}
                <div id="sidebar" className="w-64 bg-white min-h-screen border-r border-garis flex flex-col fixed left-0 top-0 z-40 overflow-y-auto">
                    <div id="sidebar-logo" className="p-8 flex flex-col">
                        <span id="logo-title" className="font-poppins font-[1000] text-[48px] leading-tight text-teks">
                            Sedap <b id="logo-dot" className="text-hijau">.</b>
                        </span>
                        <span id="logo-subtitle" className="text-teks-samping font-semibold font-barlow text-xs">Member Dashboard</span>
                    </div>

                    <div id="sidebar-menu" className="flex-grow mt-4 px-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Member Menu</p>
                        <ul id="menu-list" className="space-y-2 mb-6">
                            <li>
                                <NavLink to="/member/dashboard" className={menuClass}>
                                    <FaHome className="mr-2 text-xl" />
                                    <span className="text-sm tracking-wide">Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/member/create-order" className={menuClass}>
                                    <FaShoppingCart className="mr-2 text-xl" />
                                    <span className="text-sm tracking-wide">Buat Pesanan</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/member/orders" className={menuClass}>
                                    <FaListUl className="mr-2 text-xl" />
                                    <span className="text-sm tracking-wide">History Pesanan</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div id="sidebar-footer" className="p-8 mt-auto flex flex-col gap-4">
                        {profile && (
                            <div className="p-4 bg-hijau/10 rounded-xl">
                                <p className="text-sm font-bold text-teks">{profile.full_name || "Member"}</p>
                                <p className="text-xs text-gray-500">Tier: <span className="font-bold capitalize text-hijau">{profile.tier}</span></p>
                                <p className="text-xs text-gray-500">Poin: <span className="font-bold text-hijau">{profile.total_points}</span></p>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <span id="footer-brand" className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Sedap Restaurant</span>
                            <p id="footer-copyright" className="font-light text-gray-400 text-[10px]">&copy; 2025 All Right Reserved</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div id="main-content" className="flex-1 p-4 ml-64">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
