import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera"
import {Engine} from "@babylonjs/core/Engines/engine"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder"
import {Scene} from "@babylonjs/core/scene"
import {Vector3, Vector4} from "@babylonjs/core/Maths/math.vector"
import {Sound, Color3, StandardMaterial, Texture, Mesh, SceneLoader} from "@babylonjs/core";
import "@babylonjs/core/Materials/standardMaterial"; // 需要事先导入默认材质。
import { GLTF2Export } from "babylonjs-serializers";
import { createAxes } from "./axis";
// import { SampleMaterial } from "./Materials/SampleMaterial"

const exportBtn = document.querySelector(".save-btn");


const view = document.getElementById("view") as HTMLCanvasElement
const engine = new Engine(view, true)

const scene = new Scene(engine);

// SceneLoader.ImportMeshAsync("", "./models/", "village.glb");

const camera = new ArcRotateCamera(
  "camera",
  -Math.PI / 2,
  Math.PI / 2.5,
  15,
  Vector3.Zero(),
  scene)

camera.attachControl(view, true)

const light = new HemisphericLight(
  "light",
  new Vector3(1, 1, 0),
  scene)

const buildBox = (width: number) => {
  const boxMat = new StandardMaterial("boxMat", scene);

  if (width === 2) {
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png", scene);
  } else {
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png", scene);
  }
  const faceUV = [];
  // 图片不同的部分作为材质渲染不同的面。
  if (width == 2) {
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); // rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); // front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); // right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); // left side
  } else {
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); // rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); // front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); // right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); // left side
  }

  const box = MeshBuilder.CreateBox("box1", {
    width,
    faceUV,
    wrap: true,
  });
  box.position.y = 0.5; // 默认放在原点，往上挪，以免被平面横截。
  box.material = boxMat;

  return box;
}

const buildRoof = (y: number) => {
  const roofMat = new StandardMaterial("roofMat", scene);
  roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);

  const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3}, scene);
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.scaling.y = y;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
}

const buildHouse = (width: number) => {
  const box = buildBox(width);
  const roof = buildRoof(width);

  // for performance reasons.
  return Mesh.MergeMeshes([box, roof], true, false, null, false, true);
}

const buildGround = () => {
  const groundMat = new StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new Color3(0, 1, 0); // 地面使用绿色材质。

  const ground = MeshBuilder.CreateGround("ground", {width: 15, height: 16}, scene);
  ground.material = groundMat;
  return ground;
}

const buildSound = () => {
  return new Sound("cello", "https://playground.babylonjs.com/sounds/cellolong.wav", scene, null, {
    loop: true,
    autoplay: true,
  })
}

const buildDwellings = () => {
  const ground = buildGround();

  const detached_house = buildHouse(1);
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;

  const semi_house = buildHouse(2);
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -4.5;
  semi_house.position.z = 3;

  const places = []; // each entry is an array [house type, rotation, x, z]
  places.push([1, -Math.PI / 16, -6.8, 2.5]);
  places.push([2, -Math.PI / 16, -4.5, 3]);
  places.push([2, -Math.PI / 16, -1.5, 4]);
  places.push([2, -Math.PI / 3, 1.5, 6]);
  places.push([2, 15 * Math.PI / 16, -6.4, -1.5]);
  places.push([1, 15 * Math.PI / 16, -4.1, -1]);
  places.push([2, 15 * Math.PI / 16, -2.1, -0.5]);
  places.push([1, 5 * Math.PI / 4, 0, -1]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
  places.push([2, Math.PI / 1.9, 4.75, -1]);
  places.push([1, Math.PI / 1.95, 4.5, -3]);
  places.push([2, Math.PI / 1.9, 4.75, -5]);
  places.push([1, Math.PI / 1.9, 4.75, -7]);
  places.push([2, -Math.PI / 3, 5.25, 2]);
  places.push([1, -Math.PI / 3, 6, 4]);

  const houses = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
      houses[i] = detached_house.createInstance("house" + i);
    } else {
      houses[i] = semi_house.createInstance("house" + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }
}

// buildDwellings();
// SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb")
// SceneLoader.ImportMeshAsync("Village", "https://assets.babylonjs.com/meshes/", "village.glb", scene)
// .then(res => {
//     console.log("scene", res);
// }).catch(e => {
//     console.log("ImportScene Error", e);
// })
createAxes(scene);

exportBtn.addEventListener("click", () => {
  return GLTF2Export.GLBAsync(scene, "scene_" + Date.now()).then(glb => {
    glb.downloadFiles();
  })
})

engine.runRenderLoop(() => {
  scene.render();
})
