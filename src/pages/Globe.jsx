import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Earth from "../../public/Earth"; // Adjust path as needed
import Popup from '../components/Popup';
import { Layout } from '../components/Layout';
import * as THREE from 'three';

// Sea coordinates based on your Marker UVs
const seaCoordinates = {
  'Red Sea': { u: 0.897, v: 0.630 },
  'Black Sea': { u: 0.9, v: 0.740 },
  'Arabian Sea': { u: 0.825, v: 0.571 },
  'Caribbean Sea': { u: 0.258, v: 0.548 },
};

// New component for camera animation
function CameraController({ targetSea }) {
  const cameraRef = useRef();

  useFrame(({ camera }) => {
    if (!cameraRef.current) cameraRef.current = camera;

    if (targetSea) {
      const { u, v } = seaCoordinates[targetSea];
      const phi = u * Math.PI * 2; // Azimuthal angle (longitude)
      const theta = (1 - v) * Math.PI; // Polar angle (latitude)
      const targetPosition = new THREE.Vector3(
        Math.sin(theta) * Math.cos(phi),
        Math.cos(theta),
        Math.sin(theta) * Math.sin(phi)
      ).multiplyScalar(1.13); // Match your marker offset

      // Smoothly move camera
      const currentPosition = camera.position.clone();
      const newPosition = targetPosition.clone().multiplyScalar(2); // Zoom to 2x distance
      camera.position.lerp(newPosition, 0.05); // Smooth transition
      camera.lookAt(0, 0, 0); // Keep looking at globe center
    }
  });

  return null; // This component doesn't render anything, just controls the camera
}

const Globe = () => {
  const [selectedSea, setSelectedSea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetSea, setTargetSea] = useState(null); // For animation

  // Handle sea click (for popup)
  const handleSeaClick = (seaName) => {
    setSelectedSea(seaName);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    const seaName = Object.keys(seaCoordinates).find(
      (key) => key.toLowerCase() === searchTerm.toLowerCase()
    );
    if (seaName) {
      setTargetSea(seaName); // Trigger globe animation
      setSearchTerm(''); // Clear input
    } else {
      alert('Sea not found!');
    }
  };

  // Close popup
  const closePopup = () => {
    setSelectedSea(null);
  };

  return (
    <Layout>
      <div style={{ position: 'relative' }}>
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a sea (e.g., Red Sea)"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{ padding: '8px', marginLeft: '5px', borderRadius: '4px', background: '#007bff', color: 'white', border: 'none' }}
          >
            Search
          </button>
        </form>

        {/* Globe Canvas */}
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight />
            <Earth onSeaClick={handleSeaClick} targetSea={targetSea} />
            <CameraController targetSea={targetSea} />
            <OrbitControls enableZoom={true} enablePan={false} />
            <Environment preset="forest" />
          </Suspense>
        </Canvas>

        {/* Popup */}
        {selectedSea && <Popup seaName={selectedSea} onClose={closePopup} />}
      </div>
    </Layout>
  );
};

export default Globe;