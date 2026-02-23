import { useState, useEffect, useMemo } from 'react';
import {
    getUserEnrollments, 
    getCertificateByEnrollment, 
    generateCertificate, 
    downloadCertificate as downloadCertificateApi 
} from '../../services/pages/certificatesService';

export interface CertificateItem {
    id: string;
    enrollmentId: number;
    curso: string;
    instructor: string;
    fecha: string;
    categoria: string;
    categoriaKey: string; // normalized for filtering
    verificationCode?: string;
}

export const useCertificates = () => {
    // --- ESTADOS DE DATOS ---
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState<CertificateItem[]>([]);
    const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());

    // --- ESTADOS DE FILTRO ---
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // --- HELPERS ---
    const formatDate = (value: string | null | undefined) => {
        if (!value) return '';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return '';
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric'
        }).format(parsed);
    };

    const sanitizeFileName = (value: string) => {
        return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 50);
    };

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const loadCertificates = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) { setLoading(false); return; }
            try {
                const token = localStorage.getItem('authToken');
                const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
                // 1. Obtener inscripciones
                const data = await getUserEnrollments(userId, headers);
                const completed = (Array.isArray(data) ? data : []).filter((item: any) => Number(item.completado) === 1);
                // 2. Mappear y obtener códigos de verificación
                const mapped = await Promise.all(
                    completed.map(async (item: any) => {
                        const course = item.curso || {};
                        const instructor = typeof course.autor === 'object'
                            ? (course.autor?.username || course.autor?.nombre || 'Autor')
                            : (course.autor || course.instructor || 'Autor');
                        let verificationCode: string | undefined;
                        try {
                            const certData = await getCertificateByEnrollment(item.id, headers);
                            verificationCode = certData?.verification_code;
                            console.log('Certificado recibido:', certData);
                            console.log('Código de verificación:', verificationCode);
                        } catch {}
                        const categoriaOriginal = course.categoria?.nombre || 'general';
                        return {
                            id: `INS-${item.id}`,
                            enrollmentId: Number(item.id),
                            curso: course.titulo || course.nombre || 'Curso sin titulo',
                            instructor,
                            fecha: formatDate(item.fecha_completado || item.fecha_inscripcion),
                            categoria: categoriaOriginal,
                            categoriaKey: categoriaOriginal.toLowerCase(),
                            verificationCode
                        } as CertificateItem;
                    })
                );
                setCertificates(mapped);
            } catch (err) {
                console.error(err);
                setCertificates([]);
            } finally {
                setLoading(false);
            }
        };
        loadCertificates();
    }, []);

    // --- LÓGICA DE DESCARGA ---
    const downloadCertificate = async (enrollmentId: number, courseName: string) => {
        if (downloadingIds.has(enrollmentId)) return;
        setDownloadingIds(prev => new Set(prev).add(enrollmentId));
        try {
            const token = localStorage.getItem('authToken');
            const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
            // 1. Intentar obtener certificado existente
            let certData: any = null;
            try {
                certData = await getCertificateByEnrollment(enrollmentId, headers);
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    certData = await generateCertificate(enrollmentId, headers);
                } else {
                    throw err;
                }
            }
            const certId = certData?.id ?? certData?.certificado_id;
            if (!certId) return;
            // 3. Descargar PDF
            const blob = await downloadCertificateApi(certId, headers);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Diploma_VirtualPlus_${sanitizeFileName(courseName || 'curso')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error descargando certificado", error);
        } finally {
            setDownloadingIds(prev => {
                const next = new Set(prev);
                next.delete(enrollmentId);
                return next;
            });
        }
    };

    // --- FILTRADO ---
    const filteredCerts = useMemo(() => {
        return certificates.filter(cert => {
            const matchesSearch = cert.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cert.instructor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || cert.categoriaKey === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [certificates, searchTerm, categoryFilter]);

    // Provide both display and key for categories
    const availableCategories = useMemo(() => {
        const map = new Map<string, string>();
        certificates.forEach(cert => {
            if (!map.has(cert.categoriaKey)) {
                map.set(cert.categoriaKey, cert.categoria);
            }
        });
        return Array.from(map.entries()).map(([key, display]) => ({ key, display })).sort((a, b) => a.display.localeCompare(b.display));
    }, [certificates]);

    return {
        loading,
        certificates,
        filteredCerts,
        availableCategories,
        searchTerm, setSearchTerm,
        categoryFilter, setCategoryFilter,
        downloadingIds, downloadCertificate
    };
};