"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";

interface NodeConnection {
    start: THREE.Vector3;
    end: THREE.Vector3;
}

/**
 * NeuralNetwork3D
 * An interactive neural network visualization with connected nodes
 */
function NeuralNetwork3D({
    count = 300,
    connectionDistance = 2.5,
    isMobile = false
}: {
    count?: number;
    connectionDistance?: number;
    isMobile?: boolean;
}) {
    const { mouse } = useThree();
    const pointsRef = useRef<THREE.Points>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Reduce count for mobile/lower devices
    const actualCount = isMobile ? Math.floor(count / 4) : count;

    // Generate initial random positions in a spread-out sphere
    const { positions, colors } = useMemo(() => {
        const p = new Float32Array(actualCount * 3);
        const c = new Float32Array(actualCount * 3);

        // Color palette
        const colorRed = new THREE.Color("#FF1A1A");
        const colorBlue = new THREE.Color("#0066FF");
        const colorPurple = new THREE.Color("#8B5CF6");
        const colorWhite = new THREE.Color("#FFFFFF");

        for (let i = 0; i < actualCount; i++) {
            // Create a loose sphere/cloud shape with layers
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const layer = Math.floor(Math.random() * 3); // 0, 1, 2 for depth layers
            const r = 3 + layer * 2 + Math.random() * 2;

            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi) - 5; // Offset back in z

            // Assign colors based on position/layer
            const colorMix = Math.random();
            let color: THREE.Color;
            if (colorMix < 0.3) {
                color = colorRed.clone().lerp(colorPurple, Math.random());
            } else if (colorMix < 0.6) {
                color = colorBlue.clone().lerp(colorPurple, Math.random());
            } else if (colorMix < 0.85) {
                color = colorPurple.clone().lerp(colorBlue, Math.random() * 0.5);
            } else {
                color = colorWhite.clone();
            }

            c[i * 3] = color.r;
            c[i * 3 + 1] = color.g;
            c[i * 3 + 2] = color.b;
        }
        return { positions: p, colors: c };
    }, [actualCount]);

    // Generate connections between nearby nodes
    const connections = useMemo(() => {
        if (isMobile) return []; // Skip connections on mobile for performance

        const conns: NodeConnection[] = [];
        const maxConnections = 60; // Reduced for performance
        let connCount = 0;

        for (let i = 0; i < actualCount && connCount < maxConnections; i++) {
            const x1 = positions[i * 3];
            const y1 = positions[i * 3 + 1];
            const z1 = positions[i * 3 + 2];

            for (let j = i + 1; j < actualCount && connCount < maxConnections; j++) {
                const x2 = positions[j * 3];
                const y2 = positions[j * 3 + 1];
                const z2 = positions[j * 3 + 2];

                const distance = Math.sqrt(
                    (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
                );

                if (distance < connectionDistance && Math.random() > 0.7) {
                    conns.push({
                        start: new THREE.Vector3(x1, y1, z1),
                        end: new THREE.Vector3(x2, y2, z2)
                    });
                    connCount++;
                }
            }
        }
        return conns;
    }, [positions, connectionDistance, actualCount, isMobile]);

    // Animation loop
    useFrame((state) => {
        if (!pointsRef.current || !groupRef.current) return;

        const time = state.clock.getElapsedTime();

        // Slow rotation of the entire system
        groupRef.current.rotation.y = time * 0.05;
        groupRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;

        // Mouse influence on rotation
        const targetRotationX = mouse.y * 0.3;
        const targetRotationY = mouse.x * 0.3;

        pointsRef.current.rotation.x += (targetRotationX - pointsRef.current.rotation.x) * 0.02;
        pointsRef.current.rotation.y += (targetRotationY - pointsRef.current.rotation.y) * 0.02;
    });

    return (
        <group ref={groupRef}>
            {/* Main particle layer */}
            <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={isMobile ? 0.12 : 0.08}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={1}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Connection lines */}
            {connections.map((conn, i) => (
                <Line
                    key={i}
                    points={[conn.start, conn.end]}
                    color="#FF1A1A"
                    lineWidth={1}
                    transparent
                    opacity={0.35}
                />
            ))}
        </group>
    );
}

/**
 * FloatingParticles
 * Ambient floating particles for atmosphere
 */
function FloatingParticles({ count = 50, isMobile = false }: { count?: number; isMobile?: boolean }) {
    const ref = useRef<THREE.Points>(null);
    const actualCount = isMobile ? Math.floor(count / 3) : count;

    const positions = useMemo(() => {
        const p = new Float32Array(actualCount * 3);
        for (let i = 0; i < actualCount; i++) {
            p[i * 3] = (Math.random() - 0.5) * 30;
            p[i * 3 + 1] = (Math.random() - 0.5) * 30;
            p[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
        }
        return p;
    }, [actualCount]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
        ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.05;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#FFFFFF"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.3}
            />
        </Points>
    );
}

interface HeroBackground3DProps {
    className?: string;
    scrollProgress?: number;
}

export default function HeroBackground3D({ className = "", scrollProgress = 0 }: HeroBackground3DProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Calculate opacity based on scroll progress
    const opacity = Math.max(0, 1 - scrollProgress * 1.5);

    return (
        <div
            className={`absolute inset-0 z-0 ${className}`}
            style={{ opacity }}
        >
            <Canvas
                camera={{ position: [0, 0, 12], fov: 60 }}
                dpr={isMobile ? 1 : [1, 2]}
                gl={{ antialias: !isMobile, alpha: true }}
            >
                <fog attach="fog" args={["#050505", 12, 35]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#FF1A1A" />
                <pointLight position={[-10, -10, -5]} intensity={0.6} color="#0066FF" />
                <pointLight position={[0, 5, 5]} intensity={0.4} color="#8B5CF6" />

                <NeuralNetwork3D isMobile={isMobile} />
                <FloatingParticles isMobile={isMobile} />
            </Canvas>

            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_70%)] opacity-60 pointer-events-none" />

            {/* Bottom fade gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent pointer-events-none" />
        </div>
    );
}
