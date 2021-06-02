import {Color3, DynamicTexture, Mesh, StandardMaterial, TransformNode, Vector3} from "@babylonjs/core";
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder";

export const showAxis = (size: number, scene) => {
  const makeTextPlane = (text, color, size) => {
    const dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
    const plane = Mesh.CreatePlane("TextPlane", size, scene, true);
    const material = new StandardMaterial("TextPlaneMaterial", scene);
    material.specularColor = new Color3(0, 0, 0);
    material.backFaceCulling = false;
    material.diffuseTexture = dynamicTexture;
    plane.material = material;
    // plane.material.backFaceCulling = false;
    // plane.material.spe = new Color3(0, 0, 0); // 为什么这里无法补全 material.specularColor 。
    return plane;
  }

  const axisX = Mesh.CreateLines("axisX", [
    Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
    new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
  ]);
  axisX.color = new Color3(1, 0, 0);
  const xChar = makeTextPlane("X", "read", size / 10);
  xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

  // 为什么都是乘以 0.05 或者 0.9 之类的值。
  const axisY = Mesh.CreateLines("axisY", [
    Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
    new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
  ]);
  axisY.color = new Color3(0, 1, 0);
  const yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

  const axisZ = Mesh.CreateLines("axisZ", [
    Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
    new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
  ]);
  axisZ.color = new Color3(0, 0, 1);
  const zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
}

export const localAxes = (size, scene) => {
  const local_axisX = Mesh.CreateLines("local_axisX", [
    Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
    new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
  ], scene);
  local_axisX.color = new Color3(1, 0, 0);

  const local_axisY = Mesh.CreateLines("local_axisY", [
    Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
    new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
  ], scene);
  local_axisY.color = new Color3(0, 1, 0);

  const local_axisZ = Mesh.CreateLines("local_axisZ", [
    Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
    new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
  ], scene);
  local_axisZ.color = new Color3(0, 0, 1);

  const local_origin = new TransformNode("local_origin");

  local_axisX.parent = local_origin;
  local_axisY.parent = local_origin;
  local_axisZ.parent = local_origin;

  return local_origin;
}

export const createAxes = (scene) => {
  const faceColors = [];
  faceColors[0] = Color3.Blue();
  faceColors[1] = Color3.Teal();
  faceColors[2] = Color3.Red();
  faceColors[3] = Color3.Purple();
  faceColors[4] = Color3.Green();
  faceColors[5] = Color3.Yellow();

  const boxParent = MeshBuilder.CreateBox("Box", { faceColors });
  const boxChild = MeshBuilder.CreateBox("Box", { size: 0.5, faceColors });
  boxChild.setParent(boxParent); // 跟一个空的 TransformNode 有什么区别。

  boxChild.position.x = 0;
  boxChild.position.y = 2;
  boxChild.position.z = 0;

  boxChild.rotation.x = Math.PI / 4;
  boxChild.rotation.y = Math.PI / 4;
  boxChild.rotation.z = Math.PI / 4;

  boxParent.position.x = 2;
  boxParent.position.y = 0;
  boxParent.position.z = 0;

  boxParent.rotation.x = 0;
  boxParent.rotation.y = 0;
  boxParent.rotation.z = -Math.PI / 4;

  const boxChildAxes = localAxes(1, scene);
  boxChildAxes.parent = boxChild;
  showAxis(6, scene);
}
