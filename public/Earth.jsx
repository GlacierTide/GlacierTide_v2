import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2 } from 'three';
import Marker from '../src/components/Marker';

export default function Earth(props) {
  const { nodes, materials } = useGLTF('/Earth.gltf');
  const { camera, scene } = useThree();
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const earthRef = useRef();

  const handleClick = (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast from the camera to the scene
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(earthRef.current, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0];
      const uv = clickedObject.uv; // UV coordinates of the clicked point
      console.log(`Clicked UV: x=${uv.x.toFixed(3)}, y=${uv.y.toFixed(3)}`);

      // Map UV coordinates to specific regions
      const seaName = getSeaNameFromUV(uv);
      if (seaName) {
        props.onSeaClick(seaName);
      }
    }
  };

  const getSeaNameFromUV = (uv) => {
    const { x, y } = uv;

    // Arabian Sea (Refined) - Near India and the Arabian Peninsula
    if (x > 0.66 && x < 0.70 && y > 0.55 && y < 0.58) {
      return 'Arabian Sea';
    }
    // Red Sea (Refined) - Between Africa and the Arabian Peninsula
    else if (x > 0.58 && x < 0.62 && y > 0.56 && y < 0.65) {
      return 'Red Sea';
    }
    // Black Sea (Refined) - North of Turkey, between Europe and Asia
    else if (x > 0.57 && x < 0.62 && y > 0.70 && y < 0.77) {
      return 'Black Sea';
    }
    //Caribbean sea
    else if (x > 0.257 && x < 0.275 && y > 0.510 && y < 0.550) {
      return 'Caribbean Sea';
    }
  
    return null; // No recognized sea region
  };

  return (
    <group ref={earthRef} dispose={null} onClick={handleClick}>
      {/* Earth Model */}
      <mesh
        geometry={nodes.Object_4.geometry}
        material={materials['Scene_-_Root']}
        scale={2}
      />

      {/* Markers */}
      <Marker
        u={0.897}
        v={0.637}
        color="red"
        onClick={() => props.onSeaClick('Red Sea')} // Trigger popup for Red Sea
      />
      <Marker
        u={0.9}
        v={0.740}
        color="yellow"
        onClick={() => props.onSeaClick('Black Sea')} // Trigger popup for Black Sea
      />
      <Marker
        u={0.825}
        v={0.571}
        color="black"
        onClick={() => props.onSeaClick('Arabian Sea')} // Trigger popup for Arabian Sea
      />
      <Marker
        u={0.236}
        v={0.607}
        color="white"
        onClick={() => props.onSeaClick('Caribbean Sea')} // Trigger popup for Arabian Sea
      />
    </group>
  );
}

useGLTF.preload('/Earth.gltf');