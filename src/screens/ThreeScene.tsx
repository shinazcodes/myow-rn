import React, {useRef, useState} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber/native';
import {View, Button, StyleSheet} from 'react-native';
import {OrbitControls} from '@react-three/drei/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as THREE from 'three';
// extend({BoxGeometry: THREE.BoxGeometry});

// Extend the THREE namespace with BoxGeometry and CylinderGeometry
// THREE.BoxGeometry = THREE.BoxGeometry || new THREE.BoxGeometry();
// THREE.CylinderGeometry = THREE.CylinderGeometry || new THREE.CylinderGeometry();

const MovableBox = ({position, onInsideCylinder}) => {
  const meshRef = useRef();
  const {gl} = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [isFalling, setIsFalling] = useState(false);

  const onPointerDown = event => {
    event.stopPropagation();
    setIsDragging(true);
  };

  const onPointerUp = event => {
    event.stopPropagation();
    setIsDragging(false);
  };

  const onPointerMove = event => {
    event.stopPropagation();
    if (isDragging) {
      const [x, y] = [event.point.x, event.point.y];
      meshRef.current.position.set(x, y, 0);

      // Check if the box is inside the cylinder
      const boxPosition = new THREE.Vector3(x, y, 0);
      const cylinderPosition = new THREE.Vector3(0, 0, 0); // Assuming the cylinder is at the origin
      const distance = boxPosition.distanceTo(cylinderPosition);

      if (distance < 1) {
        // Adjust the distance based on the cylinder's radius
        onInsideCylinder(meshRef.current);
        setIsFalling(true);
      }
    }
  };

  useFrame(() => {
    gl.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
    if (isFalling) {
      if (
        meshRef.current.position.y > -1 ||
        meshRef.current.position.x > -1 ||
        meshRef.current.position.z > -1
      ) {
        // Adjust the bottom position as needed
        if (meshRef.current.position.y > -1) meshRef.current.position.y -= 0.05; // Adjust the falling speed as needed
        if (meshRef.current.position.x > -1) meshRef.current.position.x -= 0.05; // Adjust the falling speed as needed
        if (meshRef.current.position.z > -1) meshRef.current.position.z -= 0.05; // Adjust the falling speed as needed
      } else {
        setIsFalling(false);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const Scene = ({onInsideCylinder}) => {
  const {camera} = useThree();

  const rotateCamera = direction => {
    const step = 0.05;
    camera.rotation.y += direction === 'left' ? step : -step;
  };

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <MovableBox position={[-1.5, 0, 0]} onInsideCylinder={onInsideCylinder} />
      <MovableBox position={[1.5, 0, 0]} onInsideCylinder={onInsideCylinder} />
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 2, 32]} />
        <meshStandardMaterial color="blue" transparent opacity={0.5} />
      </mesh>
      {/* <OrbitControls /> */}
      {/* <View style={styles.buttonContainer}>
        <Button title="Left" onPress={() => rotateCamera('left')} />
        <Button title="Right" onPress={() => rotateCamera('right')} />
      </View> */}
      <mesh position={[1.5, 2.5, 0]} onPointerDown={() => rotateCamera('left')}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh
        position={[-1.5, 2.5, 0]}
        onPointerDown={() => rotateCamera('right')}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </>
  );
};

const App = () => {
  const handleInsideCylinder = mesh => {
    console.log('gggg');
    // Trigger the falling animation
    mesh.position.set(mesh.position.x, mesh.position.y, 1); // Start position at the top of the cylinder
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Canvas camera={{position: [0, 0, 5]}}>
          <Scene onInsideCylinder={handleInsideCylinder} />
        </Canvas>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
