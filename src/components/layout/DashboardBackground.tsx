import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// Generate random points in a sphere
function generateSpherePoints(count: number, radius: number): Float32Array {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.cbrt(Math.random()) * radius;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
}

// Animated Particle Field
function ParticleField() {
    const ref = useRef<any>();
    const [sphere] = useState(() => generateSpherePoints(3000, 2));

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 20;
            ref.current.rotation.y -= delta / 25;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#06b6d4"
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}

// Simple floating sphere using basic mesh
function FloatingOrb({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
    const ref = useRef<any>();

    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            ref.current.rotation.x = state.clock.elapsedTime * 0.1;
            ref.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={0.15}
                roughness={0.2}
            />
        </mesh>
    );
}

// Main Background Component
export default function DashboardBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-purple-900/10" />
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-brand-primary/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />

            {/* Three.js Canvas */}
            <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />
                <ParticleField />
                <FloatingOrb position={[-1.5, 0.5, -1]} color="#06b6d4" size={0.5} />
                <FloatingOrb position={[1.5, -0.5, -1]} color="#8b5cf6" size={0.4} />
                <FloatingOrb position={[0, 0, -1.5]} color="#10b981" size={0.3} />
            </Canvas>

            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        </div>
    );
}
