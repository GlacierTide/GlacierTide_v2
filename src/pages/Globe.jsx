// frontend/src/pages/Globe.jsx
import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Earth from "../../public/Earth"; // Adjust path as needed
import Popup from '../components/Popup';
import { Layout } from '../components/Layout';
import * as THREE from 'three';

// Sea coordinates based on your Marker UVs
const seaCoordinates = {
  'Red Sea': { u: 0.897, v: 0.637 },
  'Black Sea': { u: 0.9, v: 0.740 },
  'Arabian Sea': { u: 0.825, v: 0.571 },
  'Caribbean Sea': { u: 0.236, v: 0.607 },
};

// Camera controller for animation
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
      ).multiplyScalar(1.13); // Match marker offset

      const newPosition = targetPosition.clone().multiplyScalar(2); // Zoom to 2x distance
      camera.position.lerp(newPosition, 0.05); // Smooth transition
      camera.lookAt(0, 0, 0); // Look at globe center
    }
  });

  return null;
}

const Globe = () => {
  const [selectedSea, setSelectedSea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetSea, setTargetSea] = useState(null);
  const [isRotating, setIsRotating] = useState(true); // Auto-rotation state
  const controlsRef = useRef(); // Reference to OrbitControls

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
      setTargetSea(seaName); // Trigger camera animation
      setIsRotating(false); // Stop rotation on search
      setSearchTerm('');
    } else {
      alert('Sea not found!');
    }
  };

  // Close popup
  const closePopup = () => {
    setSelectedSea(null);
  };

  // Handle click to toggle rotation
  const handleCanvasClick = () => {
    setIsRotating((prev) => !prev); // Toggle rotation on click
    if (controlsRef.current) {
      controlsRef.current.enableRotate = true; // Ensure manual control is enabled
    }
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
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          onClick={handleCanvasClick} // Toggle rotation on canvas click
          style={{ background: '#1a1a1a' }} // Optional: dark background
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <Earth onSeaClick={handleSeaClick} targetSea={targetSea} isRotating={isRotating} />
            <CameraController targetSea={targetSea} />
            <OrbitControls
              ref={controlsRef}
              enableZoom={true}
              enablePan={false}
              autoRotate={isRotating} // Use OrbitControls for auto-rotation
              autoRotateSpeed={1.2} // Adjust speed (positive for counterclockwise)
              enableDamping={true} // Smooth manual rotation
            />
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