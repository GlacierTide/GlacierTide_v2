import React from 'react';
import { SphereGeometry, MeshStandardMaterial, PointLight } from 'three';

function Marker({ u, v, color = 'red', onClick }) {
  // Convert UV coordinates to 3D position
  const phi = u * Math.PI * 2; // Azimuthal angle (longitude)
  const theta = (1 - v) * Math.PI; // Polar angle (latitude), invert v for correct orientation
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.cos(theta);
  const z = Math.sin(theta) * Math.sin(phi);

  // Add a small offset to ensure the marker is above the Earth's surface
  const offset = 1.12; // 2% above the Earth's surface
  const position = [x * offset, y * offset, z * offset];

  return (
    <group position={position}>
      {/* Marker (small sphere) */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.01, 16, 16]} /> {/* Small sphere */}
        <meshStandardMaterial
          color={color}
          emissive={color} // Glowing effect
          emissiveIntensity={1} // Adjust intensity of the glow
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>

      {/* Glow (PointLight) */}
      <pointLight
        color={color}
        intensity={0.5} // Adjust intensity of the glow
        distance={0.1} // Adjust the range of the glow
      />
    </group>
  );
}

export default Marker;