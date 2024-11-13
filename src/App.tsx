import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function IcoSphere({ index }: { index: number }) {
  // console.log(index);
  const icoRef = React.useRef<THREE.Points>(null);

  const offset = index * 0.005;
  let elapstTime = 0;
  useFrame((_, dTime) => {
    elapstTime += dTime * 0.1;
    if(icoRef.current){
      icoRef.current.rotation.x = elapstTime + offset;
      icoRef.current.rotation.y = elapstTime + offset;
    }
  });

  const icoGeo = new THREE.IcosahedronGeometry(2, 4);

  const colors = [];
  let col = new THREE.Color();
  const icoVerts = icoGeo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < icoVerts.count; i++) {
    p.fromBufferAttribute(icoVerts, i);
    let hue = 0.3 + p.y * 0.15;
    let light = index * 0.015;
    let { r, g, b } = col.setHSL(hue, 1, light);
    colors.push(r, g, b);
  }

  const colorBuffer = new Float32Array(colors);

  const size = index * 0.0015;

  const sprite = useLoader(THREE.TextureLoader, "./circle.png");

  return (
    <points ref={icoRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          count={icoVerts.count}
          itemSize={3}
          array={icoVerts.array}
        />
        <bufferAttribute 
          attach="attributes-color"
          count={icoVerts.count}
          itemSize={3}
          array={colorBuffer}
        />
      </bufferGeometry>
      <pointsMaterial 
        vertexColors
        // color={0xffff00} 
        size={size} 
        map={sprite}
        alphaTest={0.5}
        transparent
        />
    </points>
  );
}

function IcoSphereGroup() {
  const children = [];
  for (let i = 0; i < 40; i += 1) {
    children.push(<IcoSphere index={i} key={i} />);
  }
  return <group>{children}</group>;
}

function App() {
  return (
    <Canvas
      gl={{ toneMapping: THREE.NoToneMapping }}
    >
      <IcoSphereGroup />
      <hemisphereLight args={[0xffffff, 0x000000, 1.0]} />
      {/* <primitive object={bgSprites} /> */}
      <OrbitControls />
    </Canvas>
  );
}

export default App;