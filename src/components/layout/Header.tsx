
import { User } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.actions}>
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
