
import { LayoutDashboard, BarChart2, FileText, Bot, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/app' },
        { icon: BarChart2, label: 'Analytics', path: '/app/analytics' },
        { icon: FileText, label: 'Reports', path: '/app/analytics' }, // Pointing to analytics for now as requested "analytica and reports"
        { icon: Bot, label: 'AI Insights', path: '/app/ai-insights' },
        { icon: Settings, label: 'Settings', path: '/app/settings' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <div className={styles.logoIcon} />
                <h1 className={styles.logoText}>Nexus<span className={styles.highlight}>AI</span></h1>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.footer}>
                <button className={styles.logoutBtn}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
