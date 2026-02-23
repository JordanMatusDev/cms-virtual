
import { useState } from 'react';
import { verifyCertificate } from '../../services/pages/verificationService';

// --- INTERFACES ---
export interface CertificateData {
    studentName: string;
    courseName: string;
    issueDate: string;
    code: string;
    instructor: string;
}

// --- UTILIDADES (Helpers) ---
// Las definimos fuera del hook porque son funciones puras (no dependen del estado)
const formatDate = (value: string | null | undefined) => {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(parsed);
};

const resolveStudentName = (data: any) => {
    const estudiante = data?.estudiante || data?.student || data?.alumno;
    if (typeof estudiante === 'string') return estudiante;
    return estudiante?.nombre || estudiante?.username || data?.estudiante_nombre || '';
};

const resolveInstructor = (data: any) => {
    const autor = data?.curso?.autor || data?.autor || data?.instructor;
    if (typeof autor === 'string') return autor;
    return autor?.nombre || autor?.username || data?.instructor || '';
};

const resolveCourseName = (data: any) => {
    const curso = data?.curso || data?.course;
    if (typeof curso === 'string') return curso;
    return curso?.titulo || curso?.nombre || data?.curso_nombre || data?.course_name || '';
};

export const useVerification = () => {
    // --- ESTADOS ---
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [certData, setCertData] = useState<CertificateData | null>(null);

    // --- LÓGICA DE VALIDACIÓN ---
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;
        setStatus('loading');
        setCertData(null);
        try {
            const data = await verifyCertificate(code);
            if (data?.valido !== true) {
                setStatus('error');
                return;
            }
            const studentName = data?.estudiante_nombre || resolveStudentName(data);
            const courseName = data?.curso_titulo || resolveCourseName(data);
            const issueDate = formatDate(
                data?.fecha_emision || data?.fecha_completado || data?.fecha || data?.fecha_creacion || data?.created_at
            );
            const certCode = data?.codigo_verificacion || data?.codigo || data?.code || code.trim().toUpperCase();
            const instructor = resolveInstructor(data) || 'Instructor';
            setCertData({
                studentName: studentName || 'Estudiante',
                courseName: courseName || 'Curso',
                issueDate: issueDate || 'Fecha no disponible',
                code: certCode,
                instructor
            });
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    // Función para reiniciar la búsqueda
    const handleReset = () => {
        setStatus('idle');
        setCode('');
        setCertData(null);
    };

    return {
        code,
        setCode,
        status,
        certData,
        handleVerify,
        handleReset
    };
};