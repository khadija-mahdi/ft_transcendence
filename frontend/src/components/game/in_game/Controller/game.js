import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { GLTFLoader } from "GLTFLoader";
import { TextGeometry } from "TextGeometry";
import { FontLoader } from "FontLoader";
import AuthWebSocket from "/lib/authwebsocket.js";


const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (item, loaded, total) => {
  const progress = (loaded / total) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
};

loadingManager.onLoad = () => {
  document.getElementById('loading-screen').style.display = 'none';
};


function loadModels(scene, adjustCameraAndControls, callback)
{
  let tableModel = null;
  let tableWidth = 0;
  let computer = null;
  let ballModel = null;
  let player_model = null;
  let score_board = null;
  let bg_scene = null;

  const loader_scene = new GLTFLoader(loadingManager);
  loader_scene.load(
    "/components/game/in_game/assets/models/scene_bg.glb",
    (glb) => {
      bg_scene = glb.scene;
      scene.add(bg_scene);
      bg_scene.position.set(0, 0, 0);
      bg_scene.scale.set(90, 90, 90);
      adjustCameraAndControls(bg_scene);
    }
  );

  const loader_scene1 = new GLTFLoader(loadingManager);
  loader_scene1.load(
    "/components/game/in_game/assets/models/scene_light.glb",
    (glb) => {
      tableModel = glb.scene;
      scene.add(tableModel);
      tableModel.scale.set(850, 850, 850);
      tableModel.position.set(200, 500, 0);
      const box = new THREE.Box3().setFromObject(tableModel);
      const size = new THREE.Vector3();
      box.getSize(size);
      tableWidth = size.x;
      adjustCameraAndControls(tableModel);
    }
  );

  const loader_cpm = new GLTFLoader(loadingManager);
  loader_cpm.load(
    "/components/game/in_game/assets/models/paddle_hock.glb",
    (glb) => {
      computer = glb.scene;
      scene.add(computer);
      computer.position.set(0, 200, 250);
      computer.scale.set(350, 350, 350);
    }
  );

  const loader = new GLTFLoader(loadingManager);
  loader.load(
    "/components/game/in_game/assets/models/ball_rca.glb",
    (glb) => {
      ballModel = glb.scene;
      scene.add(ballModel);
      ballModel.position.set(220, -720, -1000);
      ballModel.scale.set(350, 700, 350);
      adjustCameraAndControls(ballModel);
    }
  );

  const loader2 = new GLTFLoader(loadingManager);
  loader2.load(
    "/components/game/in_game/assets/models/paddle_hock.glb",
    (glb) => {
      player_model = glb.scene;
      scene.add(player_model);
      player_model.position.set(0, 200, 2260);
      player_model.scale.set(350, 350, 350);
    }
  );

  const loader_board = new GLTFLoader(loadingManager);
  loader_board.load(
    "/components/game/in_game/assets/models/score.glb",
    (glb) => {
      score_board = glb.scene;
      scene.add(score_board);
      score_board.position.set(0, 1400, 200);
      score_board.scale.set(150, 150, 150);
      score_board.rotation.y = Math.PI;
      adjustCameraAndControls(score_board);
    }
  );

  callback({
    tableModel,
    tableWidth,
    computer,
    ballModel,
    player_model,
    score_board,
    bg_scene,
  });
}



function addTextToScene(scene)
{

  let textMesh = null;
  let textMesh_player = null;
  let textMesh_score_player = null;
  let textMesh_score_computer = null;
  let computer_score = 0;
  let player_score = 0;

  const text_loader_computer = new FontLoader(loadingManager);
  text_loader_computer.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry("PLAYER 2", {
        font: font,
        size: 70,
        depth: 50,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      textMesh_score_computer = new THREE.Mesh(textGeometry, textMaterial);
      textMesh_score_computer.position.set(50, 2100, -1500);
      scene.add(textMesh_score_computer);
    }
  );

  const loader1 = new FontLoader(loadingManager);
  loader1.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry(computer_score.toString(), {
        font: font,
        size: 290,
        depth: 50,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(120, 1750, -1500);
      scene.add(textMesh);
    }
  );

  const text_loader_player = new FontLoader();
  text_loader_player.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry("PLAYER 1", {
        font: font,
        size: 70,
        depth: 50,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      textMesh_score_player = new THREE.Mesh(textGeometry, textMaterial);
      textMesh_score_player.position.set(-490, 2100, -1500);
      scene.add(textMesh_score_player);
    }
  );

  const text_load = new FontLoader();
  text_load.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry(player_score.toString(), {
        font: font,
        size: 290,
        depth: 50,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      textMesh_player = new THREE.Mesh(textGeometry, textMaterial);

      textMesh_player.position.set(-390, 1750, -1500);
      scene.add(textMesh_player);
    }
  );
}


export default function () {
  const uuid = new URLSearchParams(window.location.search).get("uuid");
  let scene, camera, renderer, controls;
  let tableModel = null;
  let tableWidth = 0;
  let computer = null;
  let ballModel = null;
  let player_model = null;
  let score_board = null;
  let bg_scene = null;
  let latestBallData = null;

  function init() {
    // Create a scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1600, 2200);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const main = document.getElementById("main");
    main.appendChild(renderer.domElement);


    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    function adjustCameraAndControls(object) {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      const cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

      camera.position.set(0, 1888, 3000);
      camera.lookAt(center);

      camera.near = cameraDistance / 100;
      camera.far = cameraDistance * 100;
      camera.updateProjectionMatrix();
    }

    loadModels(scene, adjustCameraAndControls, (models) => {
      tableModel = models.tableModel;
      tableWidth = models.tableWidth;
      computer = models.computer;
      ballModel = models.ballModel;
      player_model = models.player_model;
      score_board = models.score_board;
      bg_scene = models.bg_scene;
      addTextToScene(scene);
    });

    function handleWebSocketMessages(message) {
      if (!message.data) return;
      const data = JSON.parse(message.data);
      if (data.type === "update" && data.ball) {
        latestBallData = data.ball;
      }
    }

    function setupWebSocket() {
      const lobbySocket = new AuthWebSocket(
        `wss://localhost:4433/ws/game/${uuid}/`
      );
      lobbySocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      lobbySocket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
      };
      lobbySocket.addEventListener("message", (message) => {
        handleWebSocketMessages(message);
      });

      lobbySocket.addEventListener("close", () => {
        console.log("WebSocket disconnected");
      });
      lobbySocket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
      });
    }

    function animate() {
      requestAnimationFrame(animate);
      if (latestBallData && ballModel) {
        let x_c = 10000;
        ballModel.translateX(latestBallData.x / x_c);
        ballModel.translateZ(latestBallData.y / x_c);
      }
      renderer.render(scene, camera);
    }

    animate();
    setupWebSocket();

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  }

  init();
}
