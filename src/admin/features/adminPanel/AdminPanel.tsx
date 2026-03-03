import { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { 
    Box,
    Avatar,
    Drawer,
    AppBar,
    CssBaseline,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    Tooltip,
    MenuItem,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { ADMIN_PANEL_ICONS, ADMIN_PANEL_TEXTS, PROFILE_MENU_OPTIONS, RESOURCE_URLS } from '@/admin/core/constants/appConstants';
import { TOAST_MESSAGES } from '@/admin/core/constants/appConstants';
import { ADMIN_ROUTES } from '@/admin/routes/Admin.routes';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { FaUsers, FaHome, FaChevronDown, FaBars } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import usePageTitle from '@/admin/hooks/usePageTitle';
import { AuthContext } from '@/admin/core/context/authContext';
import { useToast } from '@/admin/core/context/toastContext';

const drawerWidth = 260; 

function AdminPanel() {
    usePageTitle(ADMIN_PANEL_TEXTS.PAGE_TITLE);
    const { usuario, setLogout } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleGoProfile = () => {
        handleCloseUserMenu();
        navigate(ROUTES_PATHS.ADMIN_PROFILE);
    };

    const handleLogout = () => {
        handleCloseUserMenu();
        setLogout();
        showToast(TOAST_MESSAGES.AUTH.LOGOUT_SUCCESS, 'info');
    };

    const handleNavItemClick = () => {
        if (isMobileOrTablet) {
            setMobileOpen(false);
        }
    };

    const colors = {
        mainBg: '#020617',
        mainGradient: 'linear-gradient(135deg, #020617 0%, #1E1B4B 100%)',
        surface: 'rgba(0, 0, 0, 0.25)',
        border: 'rgba(255, 255, 255, 0.18)',
        textPrimary: '#FFFFFF',
        textSecondary: '#94A3B8',
        accent: '#4F46E5',
        accentAlt: '#00BCD4',
        accentHover: 'rgba(79, 70, 229, 0.18)'
    };

    // CONFIGURACIÓN DE LAS BARRAS DIAGONALES
    const BARS = [
        { left: '5%', color: 'rgba(79, 70, 229, 0.05)', animation: 'compressRight' },
        { left: '30%', color: 'rgba(0, 188, 212, 0.05)', animation: 'compressLeft' },
        { left: '55%', color: 'rgba(79, 70, 229, 0.05)', animation: 'compressRight' },
        { left: '80%', color: 'rgba(0, 188, 212, 0.05)', animation: 'compressLeft' },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                background: colors.mainGradient,
                color: colors.textPrimary,
                position: 'relative'
            }}
        >
            <CssBaseline />

            {/* FONDO ANIMADO DIAGONAL TIPO ACORDEÓN */}
            <Box sx={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                overflow: 'hidden',
                zIndex: 0,
                pointerEvents: 'none', // Para que no interfiera con los clicks
                '@keyframes compressRight': {
                '0%, 100%': { transform: 'skewX(-35deg) translateX(0)' },
                '50%': { transform: 'skewX(-35deg) translateX(4vw)' } // Se mueve a la derecha
                },
                '@keyframes compressLeft': {
                '0%, 100%': { transform: 'skewX(-35deg) translateX(0)' },
                '50%': { transform: 'skewX(-35deg) translateX(-4vw)' } // Se mueve a la izquierda
                }
            }}>
                {BARS.map((bar, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        top: '-25vh', // Lo hacemos más alto por arriba y por abajo para que la inclinación no deje huecos
                        left: bar.left,
                        width: '15vw', // Ancho de cada barra
                        height: '150vh', // Alto extendido
                        bgcolor: bar.color,
                        // Le damos unos bordes sutiles para que parezcan placas de cristal
                        borderLeft: '1px solid rgba(255, 255, 255, 0.03)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.01)',
                        filter: 'blur(20px)',
                        animation: `${bar.animation} 10s ease-in-out infinite`,
                    }}
                />
                ))}
            </Box>
            
            {/* AppBar - BARRA SUPERIOR */}
            <AppBar 
                position="fixed" 
                elevation={0} 
                sx={{ 
                width: isMobileOrTablet ? '100%' : `calc(100% - ${drawerWidth}px)`, 
                ml: isMobileOrTablet ? 0 : `${drawerWidth}px`,
                bgcolor: colors.surface,
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${colors.border}`,
                zIndex: (theme) => (isMobileOrTablet ? theme.zIndex.appBar : theme.zIndex.drawer + 1)
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1, px: { xs: 1, sm: 2 }, gap: 1 }}>           
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: { xs: 0, md: 2 }, flex: 1, minWidth: 0, pr: 1 }}>
                    {isMobileOrTablet && (
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{ color: colors.textPrimary }}
                            aria-label="abrir menú"
                        >
                            <FaBars size={18} />
                        </IconButton>
                    )}
                    <Box sx={{ minWidth: 0, width: '100%' }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            color: colors.accentAlt,
                            mb: { xs: 0, md: 1 },
                            fontSize: { xs: '0.95rem', sm: '1.2rem', md: '1.7rem', lg: '2rem' },
                            whiteSpace: { xs: 'normal', sm: 'nowrap' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: { xs: 1.15, sm: 1.2 },
                            '@media (max-width:1280px)': {
                                fontSize: '1.7rem'
                            }
                        }}
                    > 
                        {ADMIN_PANEL_TEXTS.WELCOME_MESSAGE + (usuario?.username || 'Admin User') + '!'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.textSecondary, display: { xs: 'none', sm: 'block' }, fontSize: { sm: '0.9rem', md: '1rem' } }}>
                        {ADMIN_PANEL_TEXTS.SUBTITLE_TEXT}
                    </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2, md: 3 }, flexShrink: 0 }}>
                    <Box 
                        onClick={handleOpenUserMenu}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2, 
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 }
                        }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', lg: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.textPrimary }}>
                            {usuario?.username || 'Admin User'}
                            </Typography>
                        </Box>

                        <Tooltip title="Abrir perfil">
                            <Avatar 
                            src={usuario?.img || ''} 
                            alt={`${usuario?.username}'s avatar`}  
                            sx={{ 
                                bgcolor: colors.accentAlt, 
                                color: 'white',
                                fontWeight: 'bold',
                                width: { xs: 34, sm: 40 },
                                height: { xs: 34, sm: 40 }
                            }} 
                            >
                            {usuario?.username ? usuario.username.charAt(0).toUpperCase() : 'AD'}
                            </Avatar>
                        </Tooltip>

                        <Box sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                            <FaChevronDown size={14} color={colors.textSecondary} />
                        </Box>
                    </Box>

                    <Menu
                        sx={{ mt: '15px' }}
                        anchorEl={anchorElUser}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        slotProps={{
                            paper: {
                            sx: {
                                bgcolor: colors.mainBg, 
                                color: colors.textPrimary,
                                border: `1px solid ${colors.border}`,
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }
                            }
                        }}
                    >
                        <MenuItem onClick={handleGoProfile} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                            <Typography textAlign="center">
                                {PROFILE_MENU_OPTIONS.PROFILE}
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                            <Typography textAlign="center" sx={{ color: colors.accentAlt }}>
                                {PROFILE_MENU_OPTIONS.LOGOUT}
                            </Typography>
                        </MenuItem>

                    </Menu>
                </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer - MENÚ LATERAL */}
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                zIndex: (theme) => (isMobileOrTablet ? theme.zIndex.modal : 1),
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: colors.surface,
                    backdropFilter: 'blur(10px)', 
                    color: colors.textPrimary,
                    borderRight: `1px solid ${colors.border}`
                }
                }}
                variant={isMobileOrTablet ? 'temporary' : 'permanent'}
                open={isMobileOrTablet ? mobileOpen : true}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                anchor="left"
            >
                <Box sx={{
                backgroundImage: `url(${RESOURCE_URLS.LOGO})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: { xs: '4.5em', md: '6em' },
                mx: 2,
                mt: 1
                }} /> 
                
                <Divider sx={{ borderColor: colors.border, mb: 2, mx: 2 }} />
                
                <List sx={{ px: 2}}>
                {ADMIN_ROUTES.filter(item => item.display !== false).map((item, index) => (
                    <ListItem disablePadding key={index} sx={{ mb: 1 }}>
                        <NavLink 
                            to={item.path} 
                            style={({ isActive }) => ({
                            textDecoration: 'none',
                            color: isActive ? colors.textPrimary : colors.textSecondary,
                            backgroundColor: isActive ? colors.accentHover : 'transparent',
                            width: '100%',
                            display: 'block',
                            borderRadius: '10px',
                            transition: 'all 0.2s',
                            })}
                        >
                            {({ isActive }) => (
                            <ListItemButton 
                                onClick={handleNavItemClick}
                                sx={{ 
                                    borderRadius: '10px',
                                    borderLeft: isActive ? `4px solid ${colors.accentAlt}` : '4px solid transparent',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'transparent' : 'rgba(255,255,255,0.03)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon === ADMIN_PANEL_ICONS.USERS ? <FaUsers color={isActive ? colors.accentAlt : colors.textSecondary} size={20} /> : 
                                    item.icon === ADMIN_PANEL_ICONS.COURSES ? <IoIosSchool color={isActive ? colors.accentAlt : colors.textSecondary} size={22} /> : 
                                    <FaHome color={isActive ? colors.accentAlt : colors.textSecondary} size={20} />}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label} 
                                    slotProps={{ 
                                        primary: {
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: '0.95rem'
                                        }
                                    }} 
                                />
                            </ListItemButton>
                            )}
                        </NavLink>
                    </ListItem>
                ))}
                </List>
            </Drawer>

            {/* Contenido Principal */}
            <Box
                component="main"
                sx={{
                flexGrow: 1,
                width: isMobileOrTablet ? '100%' : `calc(100% - ${drawerWidth}px)`,
                height: '100vh',
                overflowY: 'auto',
                py: { xs: 1, sm: 2 },
                px: { xs: 1, sm: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1 // Por encima del fondo
                }}
            >
                <Toolbar sx={{ mb: { xs: 8, sm: 4, md: 6 } }} />

                <Box sx={{ flexGrow: 1 }}>
                <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default AdminPanel;