"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

/**
 * NeuralConstellation
 * A particle system representing a neural network concept.
 */
function NeuralConstellation(props: any) {
    const ref = useRef<any>(null);
    // Generate 5000 random points in a sphere
    const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#3B82F6"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <fog attach="fog" args={['#050507', 0.5, 3]} />
                <ambientLight intensity={0.5} />
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <NeuralConstellation />
                </Float>
            </Canvas>

            {/* Overlay Gradient to fade bottom into the rest of the page */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-obsidian)] to-transparent pointer-events-none" />
        </div>
    );
}
