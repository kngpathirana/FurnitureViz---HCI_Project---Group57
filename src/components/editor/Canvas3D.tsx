'use client';

import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { useEditorStore } from '@/store/editorStore';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Room component
function Room() {
  const { room } = useEditorStore();
  
  const wallColor = useMemo(() => new THREE.Color(room.wallColor), [room.wallColor]);
  const floorColor = useMemo(() => new THREE.Color(room.floorColor), [room.floorColor]);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[room.width / 2, 0, room.length / 2]} receiveShadow>
        <planeGeometry args={[room.width, room.length]} />
        <meshStandardMaterial color={floorColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall */}
      <mesh position={[room.width / 2, room.height / 2, 0]} receiveShadow>
        <planeGeometry args={[room.width, room.height]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, room.height / 2, room.length / 2]} receiveShadow>
        <planeGeometry args={[room.length, room.height]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[room.width, room.height / 2, room.length / 2]} receiveShadow>
        <planeGeometry args={[room.length, room.height]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Furniture item in 3D
function FurnitureMesh({ item, isSelected, onClick }: { 
  item: { 
    id: string;
    name: string;
    x: number;
    y: number;
    zPosition: number;
    width: number;
    depth: number;
    height: number;
    rotation: number;
    color: string;
    material: string;
    modelFile?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [objModel, setObjModel] = useState<THREE.Group | null>(null);
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);
  
  const color = useMemo(() => new THREE.Color(item.color), [item.color]);

  // Load OBJ model
  useEffect(() => {
    if (!item.modelFile) return;

    const loader = new OBJLoader();
    loader.load(
      item.modelFile,
      (object) => {
        // Calculate bounding box to scale model appropriately
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        
        // Scale the model to fit the desired dimensions
        const scaleX = item.width / size.x;
        const scaleY = item.height / size.y;
        const scaleZ = item.depth / size.z;
        
        // Use the smallest scale to maintain aspect ratio
        const scale = Math.min(scaleX, scaleY, scaleZ);
        object.scale.setScalar(scale);
        
        // Center the model
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center.multiplyScalar(scale));
        
        // Apply color to all meshes
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = new THREE.MeshStandardMaterial({
              color: color,
              ...getMaterialProps(item.material),
            });
          }
        });
        
        setObjModel(object);
        
        // Calculate final bounding box for selection outline
        const finalBox = new THREE.Box3().setFromObject(object);
        setBoundingBox(finalBox);
      },
      undefined,
      (error) => {
        console.error('Error loading OBJ:', error);
      }
    );
  }, [item.modelFile, item.width, item.height, item.depth, color, item.material]);

  // Get material properties based on furniture material type
  const getMaterialProps = (material: string) => {
    switch (material) {
      case 'wood':
        return { roughness: 0.7, metalness: 0.1 };
      case 'fabric':
        return { roughness: 0.9, metalness: 0 };
      case 'metal':
        return { roughness: 0.3, metalness: 0.8 };
      case 'glass':
        return { roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.6 };
      case 'leather':
        return { roughness: 0.6, metalness: 0.2 };
      case 'ceramic':
        return { roughness: 0.4, metalness: 0.1 };
      default:
        return { roughness: 0.5, metalness: 0.1 };
    }
  };

  return (
    <group
      ref={groupRef}
      position={[item.x + item.width / 2, item.zPosition || 0, item.y + item.depth / 2]}
      rotation={[0, (-item.rotation * Math.PI) / 180, 0]}
      onClick={onClick}
    >
      {/* 3D Model or fallback box */}
      {objModel ? (
        <primitive object={objModel} />
      ) : item.modelFile ? (
        // Loading placeholder
        <mesh position={[0, item.height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[item.width * 0.8, item.height * 0.8, item.depth * 0.8]} />
          <meshStandardMaterial color="#cccccc" opacity={0.5} transparent />
        </mesh>
      ) : (
        // Fallback to box if no model file specified
        <mesh position={[0, item.height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[item.width, item.height, item.depth]} />
          <meshStandardMaterial color={color} {...getMaterialProps(item.material)} />
        </mesh>
      )}

      {/* Selection outline */}
      {isSelected && boundingBox && (
        <mesh position={[0, item.height / 2, 0]}>
          <boxGeometry args={[item.width + 0.02, item.height + 0.02, item.depth + 0.02]} />
          <meshBasicMaterial color="#2563EB" wireframe />
        </mesh>
      )}
      
      {/* Fallback selection outline if no model loaded yet */}
      {isSelected && !boundingBox && (
        <mesh position={[0, item.height / 2, 0]}>
          <boxGeometry args={[item.width + 0.02, item.height + 0.02, item.depth + 0.02]} />
          <meshBasicMaterial color="#2563EB" wireframe />
        </mesh>
      )}
    </group>
  );
}

// Scene content
function Scene() {
  const { furnitureItems, selectedItemId, setSelectedItemId, room, showGrid } = useEditorStore();

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[room.width * 1.5, room.height * 2, room.length * 1.5]} fov={50} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[room.width / 2, room.height - 0.5, room.length / 2]} intensity={0.3} />

      {/* Room */}
      <Room />

      {/* Grid */}
      {showGrid && (
        <Grid
          position={[room.width / 2, 0.001, room.length / 2]}
          args={[room.width, room.length]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#909090"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#606060"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
        />
      )}

      {/* Furniture */}
      {furnitureItems.map((item) => (
        <FurnitureMesh
          key={item.id}
          item={item}
          isSelected={item.id === selectedItemId}
          onClick={() => setSelectedItemId(item.id === selectedItemId ? null : item.id)}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={30}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[room.width / 2, 0, room.length / 2]}
      />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ccc" />
    </mesh>
  );
}

// Main 3D Canvas component
export function Canvas3D() {
  const { room } = useEditorStore();

  return (
    <div className="flex-1 bg-gray-100">
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#f0f0f0']} />
        <fog attach="fog" args={['#f0f0f0', 20, 50]} />
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
