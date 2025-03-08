import React, { useRef, useState } from 'react';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

function MapPin({ 
  u, 
  v, 
  color = '#FF4D4D', 
  onClick, 
  label, 
  selected = false,
  size = 0.015
}) {
  const groupRef = useRef();
  const pinRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [pulsePhase] = useState(Math.random() * Math.PI * 2);
  
  // Convert UV coordinates to 3D position
  const phi = u * Math.PI * 2; // Azimuthal angle (longitude)
  const theta = (1 - v) * Math.PI; // Polar angle (latitude), invert v
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.cos(theta);
  const z = Math.sin(theta) * Math.sin(phi);
  
  // Offset to place pin above surface
  const offset = 1.13; // Matches your setup
  const position = [x * offset, y * offset, z * offset];
  
  // Animation
  useFrame((state) => {
    if (pinRef.current) {
      const targetScale = hovered || selected ? 1.3 : 1.0;
      pinRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
      if (hovered || selected) {
        const floatOffset = Math.sin(state.clock.elapsedTime * 2) * 0.0005;
        pinRef.current.position.y = floatOffset;
      }
    }
    if (groupRef.current && (hovered || selected)) {
      const shadowPulse = Math.sin(state.clock.elapsedTime * 3 + pulsePhase) * 0.1 + 0.9;
      groupRef.current.children.forEach(child => {
        if (child.name === 'shadow') {
          child.scale.set(shadowPulse, shadowPulse, shadowPulse);
          child.material.opacity = 0.3 * (1 - shadowPulse * 0.5);
        }
      });
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Pin with realistic shape */}
      <group 
        ref={pinRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        {/* Pin head */}
        <mesh position={[0, size * 1.8, 0]}>
          <sphereGeometry args={[size * 0.9, 16, 16]} />
          <meshStandardMaterial
            color={color}
            metalness={0.1}
            roughness={0.3}
            emissive={color}
            emissiveIntensity={hovered || selected ? 0.3 : 0.1}
          />
        </mesh>
        
        {/* Pin shaft */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[size * 0.15, size * 0.15, size * 3.6, 12]} />
          <meshStandardMaterial
            color="#CCCCCC"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        
        {/* Pin point */}
        <mesh position={[0, -size * 1.9, 0]}>
          <coneGeometry args={[size * 0.15, size * 0.3, 12, 1]} rotation={[Math.PI, 0, 0]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      
      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -size * 2, 0]} name="shadow">
        <circleGeometry args={[size * 0.6, 16]} />
        <meshBasicMaterial
          color="black"
          transparent={true}
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>
      
      {/* Label with flag-like appearance */}
      {label && (hovered || selected) && (
        <group position={[size * 0.2, size * 0.5, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[size * 0.03, size * 0.03, size * 1.4, 8]} />
            <meshStandardMaterial color="#AAAAAA" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[size * 1.2, size * 0.5, 0]}>
            <boxGeometry args={[size * 2.2, size * 1, size * 0.05]} />
            <meshStandardMaterial
              color={color}
              metalness={0.1}
              roughness={0.9}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      )}
      
      {/* Highlight effect */}
      {selected && (
        <pointLight
          position={[0, 0, 0]}
          color={color}
          intensity={0.5}
          distance={size * 10}
        />
      )}
    </group>
  );
}

function MapPinTooltip({ isVisible, label, position, color }) {
  if (!isVisible) return null;
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none z-10"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="flex flex-col items-center">
        <div className="bg-white text-gray-900 px-3 py-1.5 rounded-md shadow-lg border border-gray-200 text-sm font-medium max-w-xs animate-fadeIn">
          {label}
          <div className="absolute h-2 w-2 bg-white rotate-45 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b border-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

function GlobeMarkers({ markers, onMarkerClick, selectedMarkerId }) {
  return (
    <group>
      {markers.map((marker) => (
        <MapPin
          key={marker.id}
          u={marker.longitude / 360}
          v={1 - ((marker.latitude + 90) / 180)}
          color={marker.color || '#FF4D4D'}
          size={marker.size || 0.015}
          label={marker.label}
          selected={selectedMarkerId === marker.id}
          onClick={() => onMarkerClick(marker.id)}
        />
      ))}
    </group>
  );
}

export { MapPin, MapPinTooltip, GlobeMarkers };
export default MapPin;