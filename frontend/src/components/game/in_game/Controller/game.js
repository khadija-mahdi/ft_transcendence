import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { TextGeometry } from "TextGeometry";
import { FontLoader } from "FontLoader";
import { RGBELoader } from "RGBELoader";
import { getMatchInfo } from "/_api/game.js";
import { fetchMyData } from "/_api/user.js";
import AuthWebSocket from "/lib/authwebsocket.js";
import {
  ShowModal,
  WinModal,
  LoseModal,
  ErrorModal,
  CountDownModal,
} from "../View/game.js";

const uuid = new URLSearchParams(window.location.search).get("uuid");

const config = {
  tableWidth: 200,
  tableHeight: 10,
  tableDepth: 100,
  ballRadius: 3,
  paddleWidth: 3,
  paddleHeight: 0.5,
  paddleDepth: 15,
};

const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (item, loaded, total) => {
  const progress = (loaded / total) * 100;
  document.getElementById("progress-bar").style.width = progress + "%";
};

loadingManager.onLoad = () => {
  console.log("HERE");
  document.getElementById("loading-screen").style.display = "none";
  document.querySelector(".score-count-container").style.visibility = "visible";
};

function loadPaddles(scene) {
  const paddleGeometry = new THREE.BoxGeometry(
    config.paddleWidth,
    config.paddleHeight,
    config.paddleDepth
  );

  const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue color for the paddles
  const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  leftPaddle.position.set(
    -(config.tableWidth / 2) + 10,
    config.tableHeight + config.paddleHeight / 2,
    0
  );
  const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  rightPaddle.position.set(
    config.tableWidth / 2 - 10,
    config.tableHeight + config.paddleHeight / 2,
    0
  );

  scene.add(leftPaddle);
  scene.add(rightPaddle);
  return { lp: leftPaddle, rp: rightPaddle };
}

async function loadTable(scene) {
  const tableGeometry = new THREE.BoxGeometry(
    config.tableWidth,
    config.tableHeight,
    config.tableDepth
  );
  const textureLoader = new THREE.TextureLoader(loadingManager);
  function loadTexture(url, onLoad, onError) {
    return textureLoader.load(url, onLoad, undefined, onError);
  }
  // Load textures
  const diffuseTexture = loadTexture(
    "/components/game/in_game/assets/table_textures/wood_table_001_diff_1k.jpg",
    () => console.log("Diffuse texture loaded"),
    (err) => console.error("Failed to load diffuse texture", err)
  );
  const roughnessTexture = loadTexture(
    "/components/game/in_game/assets/table_textures/wood_table_001_rough_1k.jpg",
    () => console.log("Roughness texture loaded"),
    (err) => console.error("Failed to load roughness texture", err)
  );
  const normalTexture = loadTexture(
    "/components/game/in_game/assets/table_textures/wood_table_001_nor_gl_1k.jpg",
    () => console.log("Normal texture loaded"),
    (err) => console.error("Failed to load normal texture", err)
  );
  const displacementTexture = loadTexture(
    "/components/game/in_game/assets/table_textures/wood_table_001_disp_1k.png",
    () => console.log("Displacement texture loaded"),
    (err) => console.error("Failed to load displacement texture", err)
  );

  const tableMaterial = new THREE.MeshStandardMaterial({
    map: diffuseTexture, // Diffuse (Albedo) map
    roughnessMap: roughnessTexture, // Roughness map
    normalMap: normalTexture, // Normal map
    displacementMap: displacementTexture, // Displacement map
    displacementScale: 0, // Adjust as needed
    metalness: 0.1, // Adjust for shininess, 0.5 is a good starting point
    roughness: 0.1, // Lower roughness for more reflection
  });

  const tableModel = new THREE.Mesh(tableGeometry, tableMaterial);
  scene.add(tableModel);
  tableModel.position.set(0, config.tableHeight / 2, 0);
  tableModel.scale.set(1, 1, 1);
  return tableModel;
}

async function loadModels(scene) {
  let tableModel = null;
  let ballModel = null;

  tableModel = await loadTable(scene);

  const diskHeight = 1;
  const ballGeometry = new THREE.CylinderGeometry(
    config.ballRadius,
    config.ballRadius,
    1
  );

  const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  ballModel = new THREE.Mesh(ballGeometry, ballMaterial);

  ballModel.position.set(0, config.tableHeight + diskHeight, 0);
  scene.add(ballModel);

  return {
    tableModel,
    ballModel,
    ...loadPaddles(scene),
  };
}

function addTextToScene(scene) {
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

function Camera() {
  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-269.13, 96, 3.1);
  camera.rotation.set(
    -1.537864937968381,
    -1.225414904638361,
    -1.5357998077952344
  );
  camera.rotation.order = "XYZ";
  camera.lookAt(new THREE.Vector3(0, config.tableHeight / 2, 0));
  return camera;
}

function Lights(scene) {
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 100, 10);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(-269.13, 96, 3.1);
  scene.add(pointLight);
}

function Renderer(scene) {
  const main = document.getElementById("main");

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  main.appendChild(renderer.domElement);

  const loader = new RGBELoader(loadingManager);
  loader.load(
    "/components/game/in_game/assets/netball_court_2k.hdr",
    function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping; // Use it as an environment map
      scene.background = texture; // Or set as background
      scene.environment = texture; // Use for reflections if needed
    }
  );

  renderer.toneMapping = THREE.ACESFilmicToneMapping; // Optional for tone mapping
  renderer.toneMappingExposure = 1.0; // Adjust exposure
  renderer.outputEncoding = THREE.sRGBEncoding; // Ensures proper color encoding
  return renderer;
}

export default async function () {
  let scene, renderer, controls;
  let latestData = null;
  const keysPressed = {};
  let intervalId = null;
  const me = await fetchMyData();

  async function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const camera = Camera();
    renderer = Renderer(scene);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    Lights(scene);

    const { ballModel, rp, lp } = await loadModels(scene);
    addTextToScene(scene);

    function handleWebSocketMessages(message) {
      if (!message.data) return;
      const data = JSON.parse(message.data);
      if (data.type === "update") {
        latestData = data;
      } else if (data.type === "goal") {
        UpdateScore(data.first_player_score, data.second_player_score);
        ShowModal({
          view: CountDownModal(3),
          onConfirm: () => {},
        });
      } else if (data.type === "game_over") {
        const view = data.winner === me.username ? WinModal() : LoseModal();
        ShowModal({
          view,
          onConfirm: () => (window.location.href = "/home"),
          hasPriority: true,
        });
      }
    }

    function setupWebSocket() {
      loadingManager.itemStart("WebSocket");
      const Socket = new AuthWebSocket(`wss://localhost:4433/ws/game/${uuid}/`);
      Socket.onopen = () => {
        console.log("WebSocket connected");
        loadingManager.itemEnd("WebSocket");
      };
      Socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        loadingManager.itemEnd("WebSocket");

        ShowModal({
          view: ErrorModal(),
          onConfirm: () => (window.location.href = "/home"),
          hasPriority: true,
        });
      };

      Socket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
      };
      Socket.addEventListener("message", (message) => {
        handleWebSocketMessages(message);
      });
      return Socket;
    }

    function animate() {
      requestAnimationFrame(animate);
      if (latestData) {
        ballModel.position.x = latestData.ball.x - config.tableWidth / 2;
        ballModel.position.z = latestData.ball.y - config.tableDepth / 2;

        lp.position.x = latestData.leftPaddle.x - config.tableWidth / 2;
        lp.position.z = latestData.leftPaddle.y - config.tableDepth / 2;

        rp.position.x = latestData.rightPaddle.x - config.tableWidth / 2;
        rp.position.z = latestData.rightPaddle.y - config.tableDepth / 2;
      }
      renderer.render(scene, camera);
    }
    InitScoreBoard();
    animate();
    const GameSocket = setupWebSocket();
    function StartMovementLoop() {
      if (intervalId) return;
      intervalId = setInterval(() => {
        if (keysPressed["ArrowLeft"]) handleMovement(GameSocket, "left");
        else if (keysPressed["ArrowRight"]) handleMovement(GameSocket, "right");
      }, 50);
    }

    function StopMovementLoop() {
      if (!intervalId) return;
      if (!keysPressed["ArrowLeft"] && !keysPressed["ArrowRight"]) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    document.addEventListener("keydown", (e) => {
      if (keysPressed[e.key]) return;
      keysPressed[e.key] = true;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") StartMovementLoop();
    });

    document.addEventListener("keyup", (e) => {
      console.log("keyup", e.key);
      delete keysPressed[e.key];
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") StopMovementLoop();
    });

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  }

  await init();
}

function handleMovement(Socket, action) {
  Socket.send(JSON.stringify({ type: "move", action }));
}

async function InitScoreBoard() {
  const {
    first_player,
    second_player,
    first_player_score,
    second_player_score,
  } = await loadMatchInfo();
  SetPlayerInfo(first_player, first_player_score, true);
  SetPlayerInfo(second_player, second_player_score);
}

function SetPlayerInfo(player, score, isMe = false) {
  const PlayerImage = document.getElementById(
    `player-image-${isMe ? "1" : "2"}`
  );
  const PlayerName = document.getElementById(`player-name-${isMe ? "1" : "2"}`);
  const PlayerScore = document.getElementById(
    `player-score-${isMe ? "1" : "2"}`
  );
  PlayerImage.src = player.image_url;
  PlayerName.innerText = player.username;
  PlayerScore.innerText = score;
}

const UpdateScore = (FpScore, SpScore) => {
  const FPlayerScore = document.getElementById(`player-score-1`);
  const SPlayerScore = document.getElementById(`player-score-2`);
  FPlayerScore.innerText = FpScore;
  SPlayerScore.innerText = SpScore;
};

async function loadMatchInfo() {
  const matchUp = await getMatchInfo(uuid);
  return matchUp;
}
