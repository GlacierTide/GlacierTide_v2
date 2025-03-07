import React from 'react'
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Earth from "../../public/Earth";
import Popup from '../components/Popup';
import { Layout } from '../components/Layout';

const Globe = () => {
    const [selectedSea, setSelectedSea] = useState(null);

  const handleSeaClick = (seaName) => {
    setSelectedSea(seaName);
  };

  const closePopup = () => {
    setSelectedSea(null);
  };
  return (
      <Layout>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <Earth onSeaClick={handleSeaClick} />
          <OrbitControls />
          <Environment preset="forest" />
        </Suspense>
      </Canvas>
      {selectedSea && <Popup seaName={selectedSea} onClose={closePopup} />}
      </Layout>
  );
}

export default Globe
