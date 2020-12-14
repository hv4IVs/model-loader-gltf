import * as THREE from "../../libs/three/three.module.js";
import { GLTFLoader } from "../../libs/three/jsm/GLTFLoader.js";
import { OrbitControls } from "../../libs/three/jsm/OrbitControls.js";
import { LoadingBar } from "../../libs/LoadingBar.js";

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 4, 14);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    const ambient = new THREE.HemisphereLight(0xffffff, 0x666666, 0.3);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight();
    light.position.set(0.2, 1, 1.5);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    container.appendChild(this.renderer.domElement);

    //Add code here
    this.loadingbar = new LoadingBar();
    this.loadGLTF();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 3.5, 0);
    this.controls.update();

    window.addEventListener("resize", this.resize.bind(this));
  }

  loadGLTF() {
    const self = this;
    const loader = new GLTFLoader().setPath("../../Assets/Models/house/");

    loader.load(
      "scene.gltf",
      function (gltf) {
        self.house = gltf.scene;
        self.scene.add(gltf.scene);
        self.loadingbar.visible = false;
        self.renderer.setAnimationLoop(self.render.bind(self));
      },
      function (xhr) {
        self.loadingbar.progress = xhr.loaded / xhr.total;
      },
      function (err) {
        console.log("An error happened!!");
      }
    );
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.house.rotateY(0.01);
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
