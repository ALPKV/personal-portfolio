import { Canvas, useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'

const RADIUS = 1
const STITCHES = 72

// Three rows of stitches either side of the seam, like a real ball.
function Seam() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const rows = useMemo(() => [-0.13, -0.09, -0.05, 0.05, 0.09, 0.13], [])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    let i = 0
    for (const offset of rows) {
      const r = Math.sqrt(RADIUS * RADIUS - offset * offset) * 1.004
      for (let s = 0; s < STITCHES; s++) {
        const t = (s / STITCHES) * Math.PI * 2
        dummy.position.set(offset, Math.cos(t) * r, Math.sin(t) * r)
        dummy.lookAt(0, 0, 0)
        dummy.rotateZ(t + (offset > 0 ? 0.7 : -0.7))
        dummy.updateMatrix()
        mesh.setMatrixAt(i++, dummy.matrix)
      }
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [rows])

  return (
    <group>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[RADIUS * 1.001, 0.022, 12, 160]} />
        <meshStandardMaterial color="#5a0710" roughness={0.6} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, rows.length * STITCHES]}>
        <boxGeometry args={[0.012, 0.038, 0.012]} />
        <meshStandardMaterial color="#f4ead2" roughness={0.5} />
      </instancedMesh>
    </group>
  )
}

function Ball({ spinRef }: { spinRef: RefObject<number> }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    // Spin decays back to a lazy idle rotation after each "delivery".
    spinRef.current = THREE.MathUtils.lerp(spinRef.current, 0.6, delta * 0.8)
    g.rotation.x += delta * spinRef.current
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, state.pointer.x * 0.6 + 0.4, delta * 2)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, -state.pointer.y * 0.5 + 0.3, delta * 2)
    g.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshPhysicalMaterial
          color="#b40f22"
          roughness={0.38}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          sheen={0.4}
          sheenColor="#ff6b6b"
        />
      </mesh>
      <Seam />
    </group>
  )
}

export default function CricketBall() {
  const spinRef = useRef(0.6)
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      onPointerDown={() => (spinRef.current = 22)}
      style={{ cursor: 'grab' }}
      aria-label="Interactive 3D cricket ball. Click to bowl it."
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} />
      <pointLight position={[-4, -2, 2]} intensity={18} color="#ff2e4d" />
      <pointLight position={[2, -3, -2]} intensity={10} color="#f2ede4" />
      <Ball spinRef={spinRef} />
    </Canvas>
  )
}
