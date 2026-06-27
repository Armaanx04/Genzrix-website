import Cubes from './components/Cubes';

function App() {
  return <div style={{ height: '600px', position: 'relative' }}>
  <Cubes 
    gridSize={8}
    maxAngle={45}
    radius={3}
    borderStyle="2px dashed #B497CF"
    faceColor="#1a1a2e"
    rippleColor="#ff6b6b"
    rippleSpeed={1.5}
    autoAnimate
    rippleOnClick
  />
</div>
}

export default App;


