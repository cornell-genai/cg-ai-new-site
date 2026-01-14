"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { LayerMaterial, Depth, Noise } from "lamina";
import * as THREE from "three";

/**
 * VolumetricCloud
 * A procedural cloud sphere using layered shaders for a soft, volumetric look.
 */
export function VolumetricCloud({ position = [0, 0, 0], scale = 1, speed = 0.2, color = "#a1a1aa" }: any) {
    const ref = useRef<any>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            // Slowly rotate the noise texture coordinates or mesh
            ref.current.rotation.y += delta * speed * 0.1;
            ref.current.rotation.z += delta * speed * 0.05;
        }
    });

    return (
        <mesh position={position} scale={scale} ref={ref}>
            <sphereGeometry args={[1, 32, 32]} />
            <LayerMaterial side={THREE.BackSide} transparent lighting="physical" transmission={0.5}>
                <Depth
                    colorA="#000000"
                    colorB="#222222"
                    alpha={0.5}
                    mode="normal"
                    near={0}
                    far={2}
                    origin={[0, 0, 0]}
                />
                <Depth
                    colorA={color}
                    colorB="#000000"
                    alpha={0.5}
                    mode="add"
                    near={2}
                    far={0}
                    origin={[0, 1, 1]}
                />
                <Noise
                    mapping="local"
                    type="curl"
                    scale={0.5}
                    colorA="#ffffff"
                    colorB="#000000"
                    mode="overlay"
                    alpha={0.2}
                />
            </LayerMaterial>
        </mesh>
    );
}
