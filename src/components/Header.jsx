import React, { useEffect, useRef, useState } from 'react';
import { FaBell, FaSearch, FaSignOutAlt } from "react-icons/fa"; 
import { FcAreaChart } from "react-icons/fc"; 
import { SlSettings } from "react-icons/sl"; 
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom"; 

export default function Header() { 
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [profileName, setProfileName] = useState(() => localStorage.getItem("pfl_profile_name") || "Luthfi Farhan")
    const [profileAvatar, setProfileAvatar] = useState(() => localStorage.getItem("pfl_profile_avatar") || "https://avatar.iran.liara.run/public/28")
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [draftName, setDraftName] = useState("")
    const [draftAvatar, setDraftAvatar] = useState("")
    const [profileError, setProfileError] = useState("")
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (!isProfileOpen) return
        const onKeyDown = (e) => {
            if (e.key === "Escape") setIsProfileOpen(false)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [isProfileOpen])

    const openProfile = () => {
        setProfileError("")
        setDraftName(profileName)
        setDraftAvatar(profileAvatar)
        setIsProfileOpen(true)
    }

    const onPickAvatar = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 1024 * 1024) {
            setProfileError("Ukuran gambar terlalu besar (maks 1MB)")
            if (fileInputRef.current) fileInputRef.current.value = ""
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : ""
            if (!result) return
            setProfileError("")
            setDraftAvatar(result)
        }
        reader.readAsDataURL(file)
    }

    const saveProfile = () => {
        const nextName = draftName.trim() || "Luthfi Farhan"
        setProfileName(nextName)
        setProfileAvatar(draftAvatar || profileAvatar)
        localStorage.setItem("pfl_profile_name", nextName)
        localStorage.setItem("pfl_profile_avatar", draftAvatar || profileAvatar)
        setIsProfileOpen(false)
    }

    return ( 
        <div id="header-container" className="flex justify-between items-center p-4 bg-white border-b border-garis sticky top-0 z-30"> 
            {/* Search Bar */} 
            <div id="search-bar" className="relative w-full max-w-lg"> 
                <input 
                    id="search-input" 
                    type="text" 
                    placeholder="Search Here..." 
                    className="border border-gray-100 p-2 pr-10 bg-white w-full max-w-lg rounded-md outline-none focus:border-hijau transition-all"
                /> 
                <FaSearch id="search-icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" /> 
            </div> 

            {/* Icon & Profile Section */} 
            <div id="icons-container" className="flex items-center space-x-4"> 
                {/* Icons */} 
                <div id="notification-icon" className="relative p-3 bg-blue-100 rounded-2xl text-blue-500 cursor-pointer hover:bg-blue-200 transition-colors"> 
                    <FaBell /> 
                    <span id="notification-badge" className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-200 rounded-full px-2 py-1 text-xs">50</span> 
                </div> 
                <div id="chart-icon" className="p-3 bg-blue-100 rounded-2xl cursor-pointer hover:bg-blue-200 transition-colors"> 
                    <FcAreaChart className="text-xl" /> 
                </div> 
                <div id="settings-icon" className="p-3 bg-red-100 rounded-2xl text-red-500 cursor-pointer hover:bg-red-200 transition-colors"> 
                    <SlSettings className="text-xl" /> 
                </div>
                <div
                    id="logout-icon"
                    onClick={async () => { await signOut(); navigate("/login") }}
                    className="p-3 bg-red-100 rounded-2xl text-red-500 cursor-pointer hover:bg-red-200 transition-colors"
                    title="Logout"
                >
                    <FaSignOutAlt className="text-xl" />
                </div> 
              

                {/* Profile Section */} 
                <div
                    id="profile-container"
                    onClick={openProfile}
                    className="flex items-center space-x-4 border-l pl-4 border-gray-300 group cursor-pointer"
                > 
                    <span id="profile-text" className="text-sm font-medium text-teks group-hover:text-hijau transition-colors hidden sm:block"> 
                        Hello, <b className="font-bold">{profileName}</b> 
                    </span> 
                    <img 
                        id="profile-avatar" 
                        src={profileAvatar} 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform" 
                        alt="Avatar"
                    /> 
                </div> 
            </div> 

            {isProfileOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-teks">Edit Profile</h3>
                                <p className="text-sm text-gray-400 font-medium">Ubah nama dan foto profil</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen(false)}
                                className="px-3 py-2 rounded-xl hover:bg-gray-50 font-bold text-gray-400 hover:text-teks transition-colors"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 gap-4">
                            {profileError ? (
                                <div className="bg-red-200 p-4 text-sm font-medium text-gray-700 rounded-xl">
                                    {profileError}
                                </div>
                            ) : null}

                            <div className="flex items-center gap-4">
                                <img
                                    src={draftAvatar || profileAvatar}
                                    alt="Profile Preview"
                                    className="w-16 h-16 rounded-full border border-gray-100 object-cover"
                                />
                                <div className="flex flex-col gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={onPickAvatar}
                                        className="text-sm"
                                    />
                                    <span className="text-xs text-gray-400 font-medium">Format: JPG/PNG, max 1MB</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-teks">Nama</label>
                                <input
                                    value={draftName}
                                    onChange={(e) => setDraftName(e.target.value)}
                                    className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                    placeholder="Luthfi Farhan"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:text-teks hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={saveProfile}
                                    className="bg-hijau text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div> 
    ); 
}
