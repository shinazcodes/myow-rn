// ThreeScene.tsx
import React, {useRef, useState} from 'react';
import {Canvas, extend, useFrame, useThree} from '@react-three/fiber/native';
import {Cylinder} from '@react-three/drei/native'; // You can also use other components from drei
import useControls from 'r3f-native-orbitcontrols';
import {Button, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as THREE from 'three';
extend({BoxGeometry: THREE.BoxGeometry});

const MovableBox = ({position}) => {
  const meshRef = useRef();
  const {camera, gl} = useThree();
  const [isDragging, setIsDragging] = useState(false);

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
    }
  };

  useFrame(() => {
    if (isDragging) {
      gl.domElement.style.cursor = 'grabbing';
    } else {
      gl.domElement.style.cursor = 'grab';
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

const Scene = () => {
  const {camera} = useThree();

  const panCamera = direction => {
    const step = 0.05;
    console.log(camera.current);
    if (camera.rotation) {
      camera.rotation.y += direction === 'left' ? step : -step;
    }
  };

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <MovableBox position={[-1.5, 0, 0]} />
      <MovableBox position={[1.5, 0, 0]} />
      <Cylinder args={[1, 1, 2, 32]} position={[0, 0, 0]} />
      {/* <OrbitControls /> */}
      <mesh position={[1.5, 2.5, 0]} onPointerDown={() => panCamera('left')}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh position={[-1.5, 2.5, 0]} onPointerDown={() => panCamera('right')}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </>
  );
};
const ThreeScene: React.FC = () => {
  //   const [OrbitControls, events] = useControls(); // this line

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View
        style={{
          backgroundColor: 'red',
          width: '100%',
          height: '100%',
        }}>
        <Canvas
          style={{width: '100%', height: '100%'}}
          camera={{position: [0, 0, 5]}}>
          {/* <OrbitControls />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Cylinder args={[1, 1, 2, 32]} position={[0, 0, 0]} />
          <MovableBox position={[-1.5, -2.5, 0]} />
          <MovableBox position={[1.5, -2.5, 0]} />
          <View style={styles.buttonContainer}>
            <Button title="Left" onPress={() => panCamera('left')} />
            <Button title="Right" onPress={() => panCamera('right')} />
          </View> */}
          <Scene />
        </Canvas>
        <View style={styles.buttonContainer}>
          <Button title="Left" onPress={() => rotateCamera('left')} />
          <Button title="Right" onPress={() => rotateCamera('right')} />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default ThreeScene;
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
