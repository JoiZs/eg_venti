import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

function App() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    72,
    innerWidth / innerHeight,
    0.01,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  const controls = new OrbitControls(camera, renderer.domElement);
  const loader = new GLTFLoader();

  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(innerWidth, innerHeight);

  camera.position.set(0.2, 0.2, -0.13);
  controls.update();

  useEffect(() => {
    document.querySelector(".canvasDiv")?.appendChild(renderer.domElement);
    gsap.fromTo(
      "#title",
      { opacity: 0, translateY: 20 },
      { opacity: 1, translateY: 0 }
    );
  });

  loader.load(
    "./gltf/ventilator2.gltf",
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(0.003, 0.003, 0.003);
      model.rotation.set(0.18, -3.5, 0.13);
      scene.add(model);
      const mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;

      for (let i = 0; i < clips.length; i++) {
        const action = mixer.clipAction(clips[i]);
        action.play();
      }

      const clock = new THREE.Clock();
      function animate() {
        mixer.update(clock.getDelta());
        requestAnimationFrame(animate);
        controls.update();

        model.rotation.y += 0.003;
        renderer.render(scene, camera);
      }

      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log("An error happened");
    }
  );

  const light = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(35, 3, 150);
  scene.add(spotLight);

  const spotLight2 = new THREE.SpotLight(0x000000, 1);
  spotLight2.position.set(35, 3, 150);
  scene.add(spotLight2);

  return (
    <div className="App">
      <div className="text-slate-700 tracking-wider md:text-6xl text-4xl uppercase font-bold absolute top-3/4 text-center -translate-x-1/2 md:top-1/2  left-1/2">
        <h1 id="title"> ventilation device</h1>
        <button className="border border-slate-600 p-2 rounded uppercase text-2xl hover:bg-slate-100 ">
          Contact Now
        </button>
      </div>
      <div className="canvasDiv bg-slate-200"></div>
    </div>
  );
}

export default App;
