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

  // Define the getSeaNameFromUV function to map UV coordinates to sea regions
  const getSeaNameFromUV = (uv) => {
    const { x, y } = uv;

    // Arabian Sea
    if (x > 0.80 && x < 0.85 && y > 0.55 && y < 0.59) {
      return 'Arabian Sea';
    }
    // Caribbean Sea
    else if (x > 0.22 && x < 0.25 && y > 0.59 && y < 0.62) {
      return 'Caribbean Sea';
    }
    // Philippine Sea
    else if (x > 0.62 && x < 0.66 && y > 0.57 && y < 0.61) {
      return 'Philippine Sea';
    }
    // Coral Sea
    else if (x > 0.57 && x < 0.61 && y > 0.40 && y < 0.45) {
      return 'Coral Sea';
    }
    // Labrador Sea
    else if (x > 0.12 && x < 0.16 && y > 0.79 && y < 0.83) {
      return 'Labrador Sea';
    }
    // Barents Sea
    else if (x > 0.87 && x < 0.91 && y > 0.87 && y < 0.91) {
      return 'Barents Sea';
    }

    return null; // No recognized sea region
  };

  return (
    <group ref={earthRef} dispose={null} onClick={handleClick}>
      {/* Earth Model */}
      <mesh
        geometry={nodes.Object_4.geometry}
        material={materials['Scene_-_Root']}
        scale={2.5}
      />

      {/* Markers */}
      <Marker
        u={0.825}
        v={0.571}
        color="black"
        onClick={() => props.onSeaClick('Arabian Sea')}
      />
      <Marker
        u={0.236}
        v={0.607}
        color="red"
        onClick={() => props.onSeaClick('Caribbean Sea')}
      />
      <Marker
        u={0.64}
        v={0.59}
        color="orange"
        onClick={() => props.onSeaClick('Philippine Sea')}
      />
      <Marker
        u={0.59}
        v={0.423}
        color="cyan"
        onClick={() => props.onSeaClick('Coral Sea')}
      />
      <Marker
        u={0.14}
        v={0.81}
        color="brown"
        onClick={() => props.onSeaClick('Labrador Sea')}
      />
      <Marker
        u={0.89}
        v={0.89}
        color="violet"
        onClick={() => props.onSeaClick('Barents Sea')}
      />
    </group>
  );
}

useGLTF.preload('/Earth.gltf');
