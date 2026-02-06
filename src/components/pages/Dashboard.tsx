
import { Users, Heart, Share2, Eye } from 'lucide-react';
import KPICard from '../dashboard/KPICard';
import EngagementChart from '../dashboard/EngagementChart';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <section className={styles.kpiGrid}>
                <KPICard
                    title="Total Followers"
                    value="124.5K"
                    change={12.5}
                    icon={<Users size={20} />}
                />
                <KPICard
                    title="Avg. Engagement"
                    value="8.2%"
                    change={-2.1}
                    icon={<Heart size={20} />}
                />
                <KPICard
                    title="Total Reach"
                    value="1.2M"
                    change={24.8}
                    icon={<Eye size={20} />}
                />
                <KPICard
                    title="Shares"
                    value="45.2K"
                    change={5.4}
                    icon={<Share2 size={20} />}
                />
            </section>

            <section className={styles.chartsGrid}>
                <div className={styles.mainChart}>
                    <EngagementChart />
                </div>
                {/* Placeholder for platform comparison or other metrics */}
                <div className={styles.secondaryChart}>
                    <div className={styles.placeholderCard}>
                        <h3>Platform Dist.</h3>
                        <p>Coming Soon</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
