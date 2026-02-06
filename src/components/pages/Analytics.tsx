import React from 'react';
import styles from './Analytics.module.css';

const Analytics = () => {
    // Dummy data for charts
    const barHeights = ['40%', '60%', '45%', '80%', '55%', '90%', '70%'];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Analytics & Reports</h1>
                <p className={styles.subtitle}>Detailed breakdown of your social media performance.</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Impressions</div>
                    <div className={styles.statValue}>2.4M</div>
                    <div className={`${styles.statChange} ${styles.positive}`}>+12.5% from last month</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Engagement Rate</div>
                    <div className={styles.statValue}>4.8%</div>
                    <div className={`${styles.statChange} ${styles.negative}`}>-0.2% from last month</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>New Followers</div>
                    <div className={styles.statValue}>8,234</div>
                    <div className={`${styles.statChange} ${styles.positive}`}>+5.3% from last month</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Profile Visits</div>
                    <div className={styles.statValue}>45.2K</div>
                    <div className={`${styles.statChange} ${styles.positive}`}>+8.1% from last month</div>
                </div>
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Weekly Engagement</h3>
                    <div className={styles.placeholderChart}>
                        {barHeights.map((height, i) => (
                            <div
                                key={i}
                                className={styles.bar}
                                style={{ height }}
                                title={`Day ${i + 1}: ${height}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Audience Demographics</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                        {/* Simple CSS text placeholder for pie chart or similar */}
                        [Demographics Visualization Placeholder]
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
