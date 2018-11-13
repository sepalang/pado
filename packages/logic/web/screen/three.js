import threeShake from './threeShake';
const { OrthographicCamera, PerspectiveCamera, Scene, CSS3DRenderer, CSS3DObject, MapControls, Plane, Vector3 } = threeShake;

export const mapScreen = function(container, { width, height, content }){
  
  const DEFAULT_Z = 250;
  //const camera = new PerspectiveCamera( 40, width / height, 1, 10000 );
  const camera = new OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000)
  camera.position.z = DEFAULT_Z;
  //
  const scene = new Scene();
  const contentObject = new CSS3DObject(content);
  contentObject.position.x = 0;
  contentObject.position.y = 0;
  contentObject.position.z = 0;
  scene.add(contentObject);
  //
  const renderer = new CSS3DRenderer();
  renderer.setSize(width, height);
  container.appendChild( renderer.domElement );
  
  //
  const controls = new MapControls({object:camera, domElement:renderer.domElement, scene});
  //controls.enableDamping = true;
  controls.dampingFactor = 1;
  controls.screenSpacePanning = true;
  controls.enableRotate = false;
  
  controls.minDistance = DEFAULT_Z;
  controls.maxDistance = DEFAULT_Z * 2;
  
  controls.minZoom = 1;
  controls.maxZoom = 1 * 2;

  animate();
  
  function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
  }

  function render() {
    renderer.render( scene, camera );
  }
  
  return {
    element : renderer.domElement
  }
  
};
