import React, { useState, useRef } from 'react';
import {
    User, Mail, AtSign, Camera, Lock, Trash2,
    Save, AlertTriangle, CheckCircle, Loader2,
    Shield, Upload, Settings as SettingsIcon,
    ArrowRight, Eye, EyeOff, X, Edit2
} from 'lucide-react';
import { CircleStencil, ImageRestriction, FixedCropper } from 'react-advanced-cropper';
import type { FixedCropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import useSettings from '../hooks/pages/useSettings';




import usePageTitle from '../hooks/usePageTitle';
const Settings = () => {
    usePageTitle('Configuración');
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [showPasswordError, setShowPasswordError] = useState(false);

    const cropperRef = useRef<FixedCropperRef>(null);

    const {
        user, activeTab, loading, resultModal, profileError, fieldErrors,
        fieldErrorMessages, passwords, showCurrentPass, showNewPass,
        showConfirmPass, passVerified, showDeleteModal, showAvatarOptions,
        showCameraModal, showCropModal, cropImageSrc, cropSaving,
        isProfileDirty, fileInputRef, passwordValidationError,
        setPasswordValidationError, videoRef, setResultModal,
        setShowAvatarOptions, setShowCurrentPass, setShowNewPass,
        setShowConfirmPass, setShowDeleteModal,
        handleInputChange, handlePassChange, handleAvatarUpload,
        handleRemoveAvatarClick, confirmRemoveAvatar, handleOpenCamera,
        handleCloseCamera, handleCapturePhoto,
        //handleCropComplete, // Ya no lo usaremos en la vista
        handleConfirmCrop, handleCancelCrop, handleSaveProfile,
        handleCancelProfileChanges, handleVerifyCurrentPass,
        handleChangePassword, handleCancelPasswordChange,
        handleCancelPasswordVerify, handleDeleteAccount, handleTabChange,
        showDeleteConfirm, setShowDeleteConfirm
    } = useSettings();


    // Efecto mouse para el banner (como en MyCourse)
    const bannerRef = React.useRef<HTMLDivElement>(null);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!bannerRef.current) return;
        const rect = bannerRef.current.getBoundingClientRect();
        bannerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        bannerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    const primerNombre = user.nombre?.split(' ')[0] || '';
    const primerApellido = user.apellido?.split(' ')[0] || '';

    const handleTabChangeWithFullReset = (tab: 'profile' | 'security' | 'danger') => {
        setShowPasswordError(false);
        setPasswordValidationError(null);
        handleTabChange(tab);
    };



    return (
        <div className="min-h-screen bg-[#04070f] text-white font-sans selection:bg-cyan-500/30">
            <div className="h-24"></div>

            <main className="w-full max-w-[1200px] mx-auto px-4 pb-20">

                {/* --- BANNER CON SPOTLIGHT --- */}
                <div
                    ref={bannerRef}
                    onMouseMove={handleMouseMove}
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-[#0f1214] to-black border border-white/10 p-8 sm:p-10 mb-12 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#0f1214] to-[#0f0f0f]"></div>
                    {/* Efecto Spotlight */}
                    <div
                        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.15), transparent 40%)` }}
                    />
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
                            <SettingsIcon size={56} className="text-cyan-400 animate-[spin_8s_linear_infinite]" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-2">Configuración de Cuenta</h1>
                            <p className="text-gray-300 text-lg max-w-2xl">
                                Hola <span className="text-cyan-400 font-medium">{primerNombre} {primerApellido}</span>, personaliza tu perfil, gestiona tu seguridad y ajusta tus preferencias.
                            </p>
                        </div>
                    </div>
                </div>

                {/* LAYOUT GRID */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* --- SIDEBAR --- */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                            <button
                                onClick={() => handleTabChangeWithFullReset('profile')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'profile'
                                    ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <User size={18} className={activeTab === 'profile' ? 'text-cyan-400' : ''} />
                                Mi Perfil
                            </button>

                            <button
                                onClick={() => handleTabChangeWithFullReset('security')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'security'
                                    ? 'bg-white/10 text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Shield size={18} className={activeTab === 'security' ? 'text-cyan-400' : ''} />
                                Seguridad
                            </button>

                            <button
                                onClick={() => handleTabChangeWithFullReset('danger')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'danger'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-red-400'
                                    }`}
                            >
                                <AlertTriangle size={18} />
                                Acciones Críticas
                            </button>
                        </nav>
                    </aside>

                    {/* --- CONTENT PANEL --- */}
                    <div className="flex-1 min-w-0">

                        {resultModal && (
                            <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                                    onClick={() => setResultModal(null)}
                                />

                                {/* Modal Card */}
                                <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">
                                    {/* Línea de luz superior dinámica */}
                                    <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent to-transparent opacity-60 ${resultModal.type === 'success'
                                        ? 'via-green-500'
                                        : 'via-red-500'
                                        }`} />



                                    <div className="p-8 pb-6 flex flex-col items-center text-center relative z-10">
                                        {/* Icono con Glow Dinámico */}
                                        <div className={`relative mb-6 group`}>
                                            <div className={`absolute inset-0 ${resultModal.type === 'success' ? 'bg-green-500' : 'bg-red-500'} blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full`}></div>
                                            <div className={`relative w-16 h-16 rounded-full ${resultModal.type === 'success' ? 'bg-green-500/10 ring-1 ring-green-500/20 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]' : 'bg-red-500/10 ring-1 ring-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]'} flex items-center justify-center`}>
                                                {resultModal.type === 'success' ? <CheckCircle size={32} className="text-green-500" /> : <AlertTriangle size={32} className="text-red-500" />}
                                            </div>
                                        </div>

                                        {/* Títulos y Texto */}

                                        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                                            {resultModal.title}
                                        </h3>

                                        {resultModal.detail && (
                                            <p className="text-sm text-gray-400 leading-relaxed text-balance mb-12">
                                                {resultModal.detail}
                                            </p>
                                        )}

                                        {/* Botón Principal - Estilo Sólido para confirmar la lectura */}
                                        <button
                                            onClick={() => setResultModal(null)}
                                            className={`px-10 py-3 mt-8 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center ${resultModal.type === 'success'
                                                ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20 hover:shadow-green-500/30 border border-green-500'
                                                : 'bg-red-600 hover:bg-red-500 shadow-red-500/20 hover:shadow-red-500/30 border border-red-500'
                                                }`}
                                        >
                                            {resultModal.type === 'success' ? 'Entendido' : 'Cerrar'}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: PERFIL */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* Avatar Card */}
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-cyan-400/70 shadow-[0_0_0_10px_rgba(6,182,212,0.12),0_12px_35px_rgba(6,182,212,0.25)]">
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                    <User size={64} className="text-cyan-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                            {user.avatarUrl && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveAvatarClick}
                                                    className="w-8 h-8 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                                                    aria-label="Eliminar avatar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            {showDeleteConfirm && (
                                                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                                                    {/* Backdrop con desenfoque */}
                                                    <div
                                                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                    />

                                                    {/* Modal Card */}
                                                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">

                                                        {/* Luz superior decorativa ROJA (Indica acción destructiva) */}
                                                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-70" />

                                                        <div className="p-8 flex flex-col items-center text-center">

                                                            {/* Icono con Efecto Glow */}
                                                            <div className="relative mb-6 group">
                                                                <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                                                                <div className="relative w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]">
                                                                    <Trash2 size={32} className="text-red-500" />
                                                                </div>
                                                            </div>

                                                            {/* Textos */}
                                                            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar foto?</h3>
                                                            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                                                                Tu perfil volverá a tener el avatar por defecto.
                                                            </p>

                                                            {/* Botones */}
                                                            <div className="flex items-center gap-3 w-full">
                                                                <button
                                                                    onClick={() => setShowDeleteConfirm(false)}
                                                                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all active:scale-95"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                                <button
                                                                    onClick={confirmRemoveAvatar}
                                                                    className="flex-1 py-3 rounded-xl bg-red-600 border border-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                                >
                                                                    Sí, eliminar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setShowAvatarOptions(true)}
                                                className="w-8 h-8 rounded-full bg-cyan-500 text-black shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                                                aria-label="Cambiar avatar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleAvatarUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-lg font-bold">Foto de perfil</h3>
                                        <p className="text-sm text-gray-400">JPG o PNG (Max 2MB)</p>
                                    </div>
                                </div>

                                {/* Form Profile */}
                                <form onSubmit={handleSaveProfile} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <User size={20} className="text-cyan-500" /> Información Personal
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 font-medium ml-1">Nombre</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                <input autoComplete="off"
                                                    type="text"
                                                    name="nombre"
                                                    value={user.nombre}
                                                    onChange={handleInputChange}
                                                    className={`w-full bg-[#151515] border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors ${fieldErrors.nombre
                                                        ? 'border-red-500/60 focus:border-red-500'
                                                        : 'border-white/10 focus:border-cyan-500/50'
                                                        }`}
                                                />
                                            </div>
                                            {fieldErrorMessages.nombre && (
                                                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrorMessages.nombre}</div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 font-medium ml-1">Apellido</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                <input autoComplete="off"
                                                    type="text"
                                                    name="apellido"
                                                    value={user.apellido}
                                                    onChange={handleInputChange}
                                                    className={`w-full bg-[#151515] border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors ${fieldErrors.apellido
                                                        ? 'border-red-500/60 focus:border-red-500'
                                                        : 'border-white/10 focus:border-cyan-500/50'
                                                        }`}
                                                />
                                            </div>
                                            {fieldErrorMessages.apellido && (
                                                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrorMessages.apellido}</div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 font-medium ml-1">Usuario</label>
                                            <div className="relative">
                                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                <input autoComplete="off"
                                                    type="text"
                                                    name="username"
                                                    value={user.username}
                                                    onChange={handleInputChange}
                                                    className={`w-full bg-[#151515] border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors ${fieldErrors.username
                                                        ? 'border-red-500/60 focus:border-red-500'
                                                        : 'border-white/10 focus:border-cyan-500/50'
                                                        }`}
                                                />
                                            </div>
                                            {fieldErrorMessages.username && (
                                                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrorMessages.username}</div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 font-medium ml-1">Correo electronico</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                <input autoComplete="off"
                                                    type="text"
                                                    name="email"
                                                    value={user.email}
                                                    onChange={handleInputChange}
                                                    className={`w-full bg-[#151515] border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors ${fieldErrors.email
                                                        ? 'border-red-500/60 focus:border-red-500'
                                                        : 'border-white/10 focus:border-cyan-500/50'
                                                        }`}
                                                />
                                            </div>
                                            {fieldErrorMessages.email && (
                                                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrorMessages.email}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            {isProfileDirty && (
                                                <button
                                                    type="button"
                                                    onClick={handleCancelProfileChanges}
                                                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all"
                                                >
                                                    <X size={18} />
                                                    Cancelar
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={loading || !isProfileDirty}
                                                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                                Guardar Cambios
                                            </button>
                                        </div>
                                        {profileError && (
                                            <p className="mt-2 text-xs text-red-400">{profileError}</p>
                                        )}
                                    </div>
                                </form>

                                {/* MODAL DE CONFIRMACIÓN ELIMINAR FOTO */}
                                {showDeleteConfirm && (
                                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                                        {/* Backdrop */}
                                        <div
                                            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                                            onClick={() => setShowDeleteConfirm(false)}
                                        />
                                        {/* Modal Card */}
                                        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">
                                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-70" />
                                            <div className="p-8 flex flex-col items-center text-center">
                                                <div className="relative mb-6 group">
                                                    <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                                                    <div className="relative w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]">
                                                        <Trash2 size={32} className="text-red-500" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">¿Eliminar foto?</h3>
                                                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                                                    Tu perfil volverá a tener el avatar por defecto.
                                                </p>
                                                <div className="flex items-center gap-3 w-full">
                                                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all active:scale-95">
                                                        Cancelar
                                                    </button>
                                                    <button onClick={confirmRemoveAvatar} className="flex-1 py-3 rounded-xl bg-red-600 border border-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                        Sí, eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: SEGURIDAD (ACTUALIZADO) */}
                        {activeTab === 'security' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 max-w-2xl">
                                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <Lock size={20} className="text-cyan-500" /> Cambiar Contraseña
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Para tu seguridad, primero verificaremos tu contraseña actual.
                                    </p>

                                    <div className="space-y-6">

                                        {/* PASO 1: VERIFICAR CONTRASEÑA ACTUAL */}
                                        <form onSubmit={handleVerifyCurrentPass} className="space-y-4">
                                            <div className="space-y-2 relative">
                                                <label className="text-sm text-gray-400 font-medium ml-1 flex justify-between">
                                                    Contraseña Actual
                                                    {passVerified && (
                                                        <span className="text-green-400 text-xs flex items-center gap-1">
                                                            <CheckCircle size={12} /> Verificado
                                                        </span>
                                                    )}
                                                </label>
                                                <div className="relative">
                                                    <input autoComplete="off"
                                                        type={showCurrentPass ? "text" : "password"}
                                                        name="current"
                                                        value={passwords.current}
                                                        onChange={handlePassChange}
                                                        disabled={passVerified}

                                                        className={`w-full bg-[#151515] border rounded-xl px-4 py-3 focus:outline-none transition-all
                                                            ${passVerified
                                                                ? 'border-green-500/30 text-green-100 opacity-70 cursor-not-allowed pl-10'
                                                                : fieldErrors.currentPassword
                                                                    ? 'border-red-500 focus:border-red-500'
                                                                    : 'border-white/10 focus:border-cyan-500/50'
                                                            }`}
                                                        placeholder="Ingresa tu contraseña actual"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPass(prev => !prev)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400"
                                                        aria-label={showCurrentPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                    >
                                                        {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                <div style={{ minHeight: '0.5rem' }}>
                                                    {fieldErrors.currentPassword && (
                                                        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">
                                                            {fieldErrorMessages.currentPassword}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Botón de verificar (Solo visible si NO está verificado) */}
                                            {!passVerified && (
                                                <div className="flex justify-end">
                                                    <div className="flex items-center gap-3">
                                                        {passwords.current && (
                                                            <button
                                                                type="button"
                                                                onClick={handleCancelPasswordVerify}
                                                                className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all"
                                                            >
                                                                <X size={18} />
                                                                Cancelar
                                                            </button>
                                                        )}
                                                        <button
                                                            type="submit"
                                                            disabled={loading || !passwords.current}
                                                            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                                                        >
                                                            {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                                                            Verificar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </form>

                                        {/* PASO 2: NUEVA CONTRASEÑA (Solo visible si está verificado) */}
                                        {passVerified && (
                                            <form onSubmit={e => {
                                                e.preventDefault();
                                                if (passwords.new !== passwords.confirm) {
                                                    setShowPasswordError(true);
                                                } else {
                                                    setShowPasswordError(false);
                                                    handleChangePassword(e);
                                                }
                                            }} className="space-y-4 pt-6 border-t border-white/5 animate-in slide-in-from-top-4 fade-in duration-500">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm text-gray-400 font-medium ml-1">Nueva Contraseña</label>
                                                        <div className="relative">
                                                            <input
                                                                type={showNewPass ? "text" : "password"}
                                                                name="new"
                                                                value={passwords.new}
                                                                onChange={e => {
                                                                    setShowPasswordError(false);
                                                                    setPasswordValidationError(null);
                                                                    handlePassChange(e);
                                                                }}
                                                                autoComplete="off"
                                                                className={`w-full bg-[#151515] border rounded-xl px-4 py-3 pr-10 focus:outline-none transition-colors ${(showPasswordError || passwordValidationError) ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500/50'}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                tabIndex={-1}
                                                                onClick={() => setShowNewPass(prev => !prev)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400"
                                                                aria-label={showNewPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                            >
                                                                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm text-gray-400 font-medium ml-1">Confirmar Contraseña</label>
                                                        <div className="relative">
                                                            <input
                                                                type={showConfirmPass ? "text" : "password"}
                                                                name="confirm"
                                                                value={passwords.confirm}
                                                                onChange={e => {
                                                                    setShowPasswordError(false);
                                                                    setPasswordValidationError(null);
                                                                    handlePassChange(e);
                                                                }}
                                                                autoComplete="off"
                                                                className={`w-full bg-[#151515] border rounded-xl px-4 py-3 pr-10 focus:outline-none transition-colors ${(showPasswordError || passwordValidationError) ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500/50'}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                tabIndex={-1}
                                                                onClick={() => setShowConfirmPass(prev => !prev)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400"
                                                                aria-label={showConfirmPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                            >
                                                                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Error debajo de los inputs */}
                                                <div style={{ minHeight: '0.5rem' }}>
                                                    {(showPasswordError || passwordValidationError) && (
                                                        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">
                                                            {passwordValidationError || 'Las contraseñas no coinciden.'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelPasswordChange}
                                                            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all"
                                                        >
                                                            <X size={18} />
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                loading ||
                                                                !passwords.new ||
                                                                !passwords.confirm
                                                            }
                                                            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                                                        >
                                                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                                            Actualizar Contraseña
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}

                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: PELIGRO */}
                        {activeTab === 'danger' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="bg-[#0a0a0a] border border-red-900/30 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-red-500 mb-3 flex items-center gap-2">
                                        <AlertTriangle size={22} /> Eliminar Cuenta
                                    </h3>
                                    <p className="text-gray-400 text-base mb-7">
                                        Esta acción es irreversible.
                                    </p>

                                    <div className="bg-red-950/20 border border-red-900/50 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div>
                                            <h4 className="text-red-400 font-bold text-base">¿Eliminar permanentemente?</h4>
                                            <p className="text-red-300/60 text-sm mt-1">Perderás acceso a tus cursos.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-6 rounded-xl transition-colors whitespace-nowrap"
                                        >
                                            Sí, eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </main>

            {/* MODAL ELIMINAR CUENTA */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                        onClick={() => {
                            if (!loading) {
                                setShowDeleteModal(false);
                                setDeleteConfirmation(''); // Limpia el input al cerrar
                            }
                        }}
                    />

                    {/* Modal Card */}
                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Luz superior decorativa ROJA */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-70" />

                        <div className="p-8 flex flex-col items-center text-center">
                            {/* Icono con Efecto Glow */}
                            <div className="relative mb-6 group">
                                <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                                <div className="relative w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]">
                                    <Trash2 size={32} className="text-red-500" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">Eliminar Cuenta</h3>
                            <p className="text-sm text-gray-400 mb-2 leading-relaxed">
                                <br />
                                Escribe <strong className="text-red-400">ELIMINAR</strong> para confirmar.
                            </p>

                            {/* Input Controlado e Inteligente */}
                            <div className="w-full mb-6">
                                <input
                                    autoComplete='off'
                                    type="text"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="ELIMINAR"
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-center text-white font-bold tracking-[0.2em] placeholder-gray-700 focus:outline-none focus:border-red-500/50 focus:bg-black transition-all uppercase"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmation('');
                                    }}
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmation.trim().toUpperCase() !== 'ELIMINAR' || loading}
                                    className={`flex-1 py-3 rounded-xl text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2
                                        ${deleteConfirmation.trim().toUpperCase() === 'ELIMINAR'
                                            ? 'bg-red-600 border border-red-500 shadow-red-600/20 hover:bg-red-500 active:scale-95 cursor-pointer'
                                            : 'bg-white/5 border border-white/5 text-gray-500 opacity-50 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL AJUSTAR IMAGEN */}
            {showCropModal && cropImageSrc && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    {/* Fondo oscuro con blur */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                        onClick={() => !cropSaving && handleCancelCrop()}
                    />

                    {/* Contenedor principal del Modal */}
                    <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-[#151515] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">

                        {/* Brillo superior Cyan */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                        {/* NUEVO: Botón Cerrar (X) estilo flotante arriba a la derecha */}
                        <button
                            onClick={handleCancelCrop}
                            disabled={cropSaving}
                            className="absolute right-4 top-4 z-20 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            {/* Cabecera (ajustada para la X) */}
                            <div className="flex items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                                        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                                        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                                    </svg>
                                    Ajustar Foto
                                </h3>
                            </div>

                            {/* Área del Cropper */}
                            <div className="rounded-xl overflow-hidden border border-white/5 bg-black/40 shadow-inner mb-6">
                                <FixedCropper
                                    ref={cropperRef}
                                    src={cropImageSrc}
                                    className="h-[400px] w-full"
                                    stencilComponent={CircleStencil}
                                    imageRestriction={ImageRestriction.stencil}
                                    stencilSize={{ width: 256, height: 256 }}
                                />
                            </div>

                            {/* NUEVO: Botones de Acción Minimalistas (Girar y Guardar) */}
                            <div className="flex justify-center gap-12">

                                {/* Botón Girar */}
                                <button
                                    type="button"
                                    onClick={() => cropperRef.current?.rotateImage(90)}
                                    disabled={cropSaving}
                                    className="flex flex-col items-center justify-center gap-2 group transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white/10 group-hover:text-white transition-colors shadow-sm ring-1 ring-white/5 group-hover:ring-white/20">
                                        {/* SVG Custom: Flecha circular */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                                            <path d="M21 3v5h-5" />
                                            <rect x="9" y="9" width="6" height="6" rx="1" transform="rotate(45 12 12)" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Girar</span>
                                </button>

                                {/* Botón Guardar */}
                                <button
                                    onClick={async () => {
                                        if (cropperRef.current) {
                                            const canvas = cropperRef.current.getCanvas();
                                            if (canvas) {
                                                const base64Image = canvas.toDataURL('image/jpeg');
                                                await handleConfirmCrop(base64Image);
                                            }
                                        }
                                    }}
                                    disabled={cropSaving}
                                    className="flex flex-col items-center justify-center gap-2 group transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <div className="w-14 h-14 rounded-full bg-cyan-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] group-hover:bg-cyan-500 transition-colors ring-2 ring-cyan-500/50 group-hover:ring-cyan-400">
                                        {cropSaving ? (
                                            <Loader2 className="animate-spin" size={24} />
                                        ) : (
                                            <Save size={24} />
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                        {cropSaving ? 'Guardando...' : 'Guardar'}
                                    </span>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* MODAL ACTUALIZAR FOTO */}
            {showAvatarOptions && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowAvatarOptions(false)}
                    />

                    {/* Modal Card */}
                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Luz superior Cyan */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                        {/* Botón Cerrar (X) */}
                        <button
                            onClick={() => setShowAvatarOptions(false)}
                            className="absolute right-4 top-4 z-20 p-2 rounded-full text-white/20 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 pb-8 relative z-10">
                            {/* Título */}
                            <h3 className="text-lg font-bold text-center text-white mb-8 tracking-tight">
                                Cambiar foto de perfil
                            </h3>

                            {/* Avatar Preview con Glow */}
                            <div className="relative w-32 h-32 mx-auto mb-10 group">
                                {/* Efecto de resplandor detrás del avatar */}
                                <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#151515] ring-2 ring-white/10 shadow-2xl">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="Avatar actual" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#1A1D24] flex items-center justify-center">
                                            <User size={48} className="text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                {/* Pequeño indicador de edición (opcional) */}
                                <div className="absolute bottom-1 right-1 bg-[#151515] p-1.5 rounded-full ring-1 ring-white/10 text-cyan-400">
                                    <Edit2 size={14} />
                                </div>
                            </div>

                            {/* Botones de Acción - Estilo Íconos Flotantes (Minimalistas) */}
                            <div className="flex justify-center gap-12 mb-6">
                                <button
                                    onClick={() => {
                                        setShowAvatarOptions(false);
                                        fileInputRef.current?.click();
                                    }}
                                    className="flex flex-col items-center justify-center gap-3 w-24 group transition-all active:scale-95"
                                >
                                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 transition-colors shadow-sm ring-1 ring-white/5 group-hover:ring-cyan-500/30">
                                        <Upload size={24} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Subir foto</span>
                                </button>

                                <button
                                    onClick={handleOpenCamera}
                                    className="flex flex-col items-center justify-center gap-3 w-24 group transition-all active:scale-95"
                                >
                                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/10 group-hover:text-purple-300 transition-colors shadow-sm ring-1 ring-white/5 group-hover:ring-purple-500/30">
                                        <Camera size={24} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Tomar foto</span>
                                </button>
                            </div>

                            {/* Footer Info */}
                            <p className="text-center text-xs text-gray-500 font-medium">
                                Formatos: JPG o PNG (Max 2MB)
                            </p>

                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CAMARA */}
            {showCameraModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    {/* Backdrop con desenfoque */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                        onClick={handleCloseCamera}
                    ></div>

                    {/* Tarjeta del Modal (Ajustado a max-w-xl para que coincida con el de editar) */}
                    <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Luz superior decorativa Cyan */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                        {/* Botón Cerrar (X) */}
                        <button
                            onClick={handleCloseCamera}
                            className="absolute right-4 top-4 z-20 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            {/* Título con icono */}
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                    <circle cx="12" cy="13" r="3" />
                                </svg>
                                Cámara
                            </h3>

                            {/* Área del Video (Visor) - Ajustado a h-[400px] para formato cuadrado */}
                            <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden ring-1 ring-white/10 shadow-inner group">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />

                                {/* UI: Indicador LIVE */}
                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                    <span className="text-[10px] font-bold tracking-widest text-white uppercase">Live</span>
                                </div>

                                {/* UI: Guías de encuadre (Esquinas decorativas) */}
                                <div className="absolute inset-4 pointer-events-none opacity-30">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg"></div>
                                </div>
                            </div>

                            {/* Botón de Captura Central */}
                            <div className="mt-8 mb-2 flex justify-center items-center">
                                <button
                                    onClick={handleCapturePhoto}
                                    className="relative flex items-center justify-center w-16 h-16 rounded-full border-[3px] border-white/50 hover:border-white transition-all active:scale-95 group"
                                    title="Capturar foto"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white group-active:scale-90 transition-transform duration-150"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Settings;