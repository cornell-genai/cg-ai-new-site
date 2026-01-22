"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * InteractiveNodeCluster
 * A particle system that reacts to mouse position.
 */
function InteractiveNodeCluster({ count = 300 }) {
    const { mouse } = useThree();

    // Generate initial random positions
    const initialPositions = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Create a loose sphere/cloud shape
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 4 + Math.random() * 4; // Spread out more

            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi);
        }
        return p;
    }, [count]);

    const pointsRef = useRef<any>(null);
    // const dummy = new THREE.Vector3();
    const mouseVec = new THREE.Vector3();

    // Animation Loop
    useFrame((state) => {
        if (!pointsRef.current) return;

        // Slow rotation of the entire system
        pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;

        // Interactive Physics (Simulated in vertex shader or purely visual here? 
        // Actual vertex displacement is expensive to re-upload every frame for simple Points.
        // For this effect, we'll map mouse to rotation speed or use a custom shader if we want individual particle repulsion.
        // Given the constraints, let's stick to camera/rotation influence for high performance or verify if we need detailed displacement).

        // Let's make the cluster "look" at the mouse slightly
        mouseVec.set(mouse.x * 2, mouse.y * 2, 0);
        pointsRef.current.rotation.x += (mouse.y * 0.2 - pointsRef.current.rotation.x) * 0.05;
        pointsRef.current.rotation.y += (mouse.x * 0.2 - pointsRef.current.rotation.y) * 0.05;
    });

    return (
        <group ref={pointsRef}>
            <Points positions={initialPositions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#FF4D4D" // Nebula Red
                    size={0.06}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            {/* Secondary Layer for depth - Purple/Blue */}
            <Points positions={initialPositions.map(p => p * 1.5)} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#be123c" // Nebula Rose
                    size={0.04}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

export default function NeuralCluster() {
    return (
        <div className="fixed inset-0 z-0 bg-[#0A0A0F] pointer-events-none transition-colors duration-1000">
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <fog attach="fog" args={['#0A0A0F', 10, 30]} />
                <InteractiveNodeCluster />
            </Canvas>
            {/* Vignette Overlay to focus center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0F_100%)] opacity-80 pointer-events-none" />
        </div>
    );
}
