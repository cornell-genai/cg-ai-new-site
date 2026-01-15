"use client";

import React, { useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Stars, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { VolumetricCloud } from "./VolumetricCloud";
import * as THREE from "three";


/**
 * CameraController
 * Handles the "Fly-Through" effect based on scroll and mouse position.
 */
function CameraController() {
    const { camera, mouse } = useThree();

    useFrame(() => {
        // Smooth mouse look
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 2, 0.05);

        // Constant forward drift (optional) or scroll based
        // camera.position.z -= delta * 0.5; 

        camera.lookAt(0, 0, -100);
    });
    return null;
}

/**
 * FloatingNode
 * A text/content node that appears in the fog.
 */
function FloatingNode({ text, position, color = "white", scale = 1 }: any) {
    const [hovered, setHover] = useState(false);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={position}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}>
                <Text
                    font="/fonts/Inter-Bold.woff" // Assuming font availability or fallback
                    fontSize={scale}
                    color={hovered ? "#3b82f6" : color}
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={hovered ? 1 : 0.7}
                >
                    {text}
                </Text>
                {hovered && (
                    <Sparkles count={20} scale={scale * 2} size={6} speed={0.4} opacity={1} color="#3b82f6" />
                )}
            </group>
        </Float>
    );
}

export default function CloudScene() {
    return (
        <div className="fixed inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }} gl={{ antialias: false }}>
                <fog attach="fog" args={['#050505', 5, 25]} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#4c1d95" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* The Tunnel of Clouds */}
                <group>
                    <VolumetricCloud position={[-4, 2, -5]} scale={4} color="#333" />
                    <VolumetricCloud position={[4, -2, -10]} scale={5} color="#222" />
                    <VolumetricCloud position={[-3, -4, -15]} scale={6} color="#444" />
                    <VolumetricCloud position={[0, 0, -20]} scale={8} opacity={0.3} color="#111" />
                </group>

                {/* Content Nodes */}
                <FloatingNode text="GEN AI" position={[0, 0, -2]} scale={1.5} />
                <FloatingNode text="BUILD" position={[-3, 2, -6]} scale={1} color="#aaa" />
                <FloatingNode text="RESEARCH" position={[3, -1, -8]} scale={1} color="#aaa" />
                <FloatingNode text="SHIP" position={[0, -3, -12]} scale={1.2} />

                <CameraController />

                <EffectComposer>
                    <Bloom luminanceThreshold={0} mipmapBlur intensity={0.5} radius={0.8} />
                    <Noise opacity={0.15} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
