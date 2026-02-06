
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SceneBackground from '../3d/SceneBackground';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    return (
        <div className={styles.container}>
            <SceneBackground />
            <Sidebar />
            <main className={styles.mainContent}>
                <Header />
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
