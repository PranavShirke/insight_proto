
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ReactNode } from 'react';
import styles from './KPICard.module.css';

interface KPICardProps {
    title: string;
    value: string;
    change: number;
    icon: ReactNode;
}

const KPICard = ({ title, value, change, icon }: KPICardProps) => {
    const isPositive = change >= 0;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <div className={styles.iconContainer}>{icon}</div>
            </div>
            <div className={styles.content}>
                <span className={styles.value}>{value}</span>
                <div className={`${styles.changeBadge} ${isPositive ? styles.positive : styles.negative}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{Math.abs(change)}%</span>
                </div>
            </div>
        </div>
    );
};

export default KPICard;
