
import { Search, Bell, User } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.searchContainer}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Ask anything... (e.g., 'Best post last month?')"
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.actions}>
                <button className={styles.iconBtn}>
                    <Bell size={20} />
                    <span className={styles.notificationDot}></span>
                </button>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        <User size={20} />
                    </div>
                    <span className={styles.username}>Creator</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
