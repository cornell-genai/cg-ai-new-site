"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/ThemeProvider";

interface NodeConnection {
    start: THREE.Vector3;
    end: THREE.Vector3;
}

/**
 * NeuralNetwork3D
 * An interactive neural network visualization with connected nodes
 * Updated with warm indigo/violet/amber color palette
 */
function NeuralNetwork3D({
    count = 450,
    connectionDistance = 2.0,
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

        // Red/Warm color palette
        const colorPrimary = new THREE.Color("#b91c1c"); // Red-700
        const colorSecondary = new THREE.Color("#be123c"); // Rose-700
        const colorDark = new THREE.Color("#7f1d1d"); // Red-900
        const colorLight = new THREE.Color("#fca5a5"); // Red-300

        for (let i = 0; i < actualCount; i++) {
            // Create a tighter sphere/cloud shape with layers for denser clustering
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const layer = Math.floor(Math.random() * 4); // 0, 1, 2, 3 for depth layers
            // Adjusted radius: halfway between tight and loose (range ~1.75-6)
            const r = 1.75 + layer * 1.25 + Math.random() * 1.5;

            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi) - 3; // Offset back in z (closer to camera)

            // Assign warm red colors
            const colorMix = Math.random();
            let color: THREE.Color;
            if (colorMix < 0.4) {
                color = colorPrimary.clone().lerp(colorSecondary, Math.random());
            } else if (colorMix < 0.7) {
                color = colorSecondary.clone().lerp(colorDark, Math.random() * 0.6);
            } else {
                color = colorPrimary.clone().lerp(colorLight, Math.random() * 0.3);
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
        const maxConnections = 120; // Increased for denser network appearance
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

                if (distance < connectionDistance && Math.random() > 0.55) {
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
                    opacity={0.9}
                    blending={THREE.NormalBlending}
                />
            </Points>

            {/* Connection lines - now indigo */}
            {connections.map((conn, i) => (
                <Line
                    key={i}
                    points={[conn.start, conn.end]}
                    color="#b91c1c"
                    lineWidth={1}
                    transparent
                    opacity={0.25}
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
                color="#7f1d1d"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.4}
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
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Calculate opacity based on scroll progress
    const opacity = Math.max(0, 1 - scrollProgress * 1.5);

    // Theme-dependent colors
    const fogColor = isDark ? "#0F0A1A" : "#FAFAF9";

    return (
        <div
            className={`absolute inset-0 z-0 ${className}`}
            style={{ opacity }}
        >
            {/* Light/Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF9] via-[#F5F5F4] to-[#EDE9FE] dark:from-[#0F0A1A] dark:via-[#1A1226] dark:to-[#0F0A1A]" />

            {/* Hide 3D Canvas on mobile devices */}
            {!isMobile && (
                <Canvas
                    camera={{ position: [0, 0, 12], fov: 60 }}
                    dpr={isMobile ? 1 : [1, 2]}
                    gl={{ antialias: !isMobile, alpha: true }}
                >
                    <fog attach="fog" args={[fogColor, 15, 40]} />
                    <ambientLight intensity={isDark ? 0.4 : 0.8} />
                    <pointLight position={[10, 10, 10]} intensity={isDark ? 1.2 : 0.8} color="#b91c1c" />
                    <pointLight position={[-10, -10, -5]} intensity={isDark ? 0.8 : 0.5} color="#991b1b" />
                    <pointLight position={[0, 5, 5]} intensity={isDark ? 0.6 : 0.4} color="#dc2626" />

                    <NeuralNetwork3D isMobile={isMobile} />
                    <FloatingParticles isMobile={isMobile} />
                </Canvas>
            )}

            {/* Soft vignette overlay - light mode only */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(250,250,249,0.5)_70%)] dark:hidden pointer-events-none" />

            {/* Bottom fade gradient to content */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/80 to-transparent dark:from-[#0F0A1A] dark:via-[#0F0A1A]/80 dark:to-transparent pointer-events-none" />

            {/* Red glow for dark mode */}
            <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-red-600/20 blur-[150px] rounded-full opacity-0 dark:opacity-100 pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/15 blur-[120px] rounded-full opacity-0 dark:opacity-100 pointer-events-none" />
        </div>
    );
}

