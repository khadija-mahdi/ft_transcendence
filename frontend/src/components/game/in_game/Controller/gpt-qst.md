here is my problem 
i developed bussnise logic for pingpong game in backend as it was 2d but our goal shifted to  3d 
the ball it just slides on the table meaning it only play in 2d plain but that plain represented in 3d cordinate system so as you can guess my logic didnt quite work well 
so am trying to handle the chnage but i dont have any idea on how 
ill attack some code files so you could understand me more
## game_utils.py:
```py
import math

class Ball():
    RADIUS = 5
    SPEED = 5

    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.radius = Ball.RADIUS
        self.reset()

    def setAngle(self, angle):
        self.angle = angle
        self.dx = self.speed * math.cos(self.angle)
        self.dy = self.speed * math.sin(self.angle)

    def reset(self):
        self.x = self.width / 2
        self.y = self.height / 2
        self.speed = Ball.SPEED
        self.setAngle(0)

    async def update(self, callback):
        self.x += self.dx
        self.y += self.dy

        # Collision with the left paddle
        if (self.x - self.radius < self.leftPaddle.x + self.leftPaddle.WIDTH / 2 and
                self.leftPaddle.is_on_same_level(self)):
            self.setAngle(self.leftPaddle.get_hit_angle(self))
            # self.dx *= -1

        # Collision with the right paddle
        if (self.x + self.radius > self.rightPaddle.x - self.rightPaddle.WIDTH / 2 and
                self.rightPaddle.is_on_same_level(self)):
            self.setAngle(self.rightPaddle.get_hit_angle(self))
            self.dx *= -1

        # Collision with the top or bottom wall
        if self.y - self.radius < 0 or self.y + self.radius > self.height:
            self.dy *= -1

        # Ball out of bounds (left or right)
        if self.x - self.radius < 0 or self.x + self.radius > self.width:
            is_left_goal = self.x - self.radius < 0
            await callback(is_left_goal)
            self.reset()

    def setPaddles(self, leftPaddle, rightPaddle):
        self.leftPaddle = leftPaddle
        self.rightPaddle = rightPaddle


class Paddle():
    HEIGHT = 60
    WIDTH = 10
    PADDLE_SPEED = 2
    AI_MODE = False

    def __init__(self, x, y, is_ai=False, ai_difficulty=1):
        self.x = x
        self.y = y
        self.is_ai = is_ai
        self.PADDLE_SPEED = Paddle.PADDLE_SPEED * ai_difficulty

    def updatePosition(self, y):
        self.y = y

    def ai_update(self, ball):
        if ball.y < self.y - Paddle.HEIGHT / 2:
            self.y -= Paddle.PADDLE_SPEED
        elif ball.y > self.y + Paddle.HEIGHT / 2:
            self.y += Paddle.PADDLE_SPEED

    def get_hit_angle(self, ball):
        diff = ball.y - self.y
        return map_value(diff, -Paddle.HEIGHT / 2, Paddle.HEIGHT / 2, -math.pi / 4, math.pi / 4)

    def is_on_same_level(self, ball):
        return self.y - Paddle.HEIGHT / 2 <= ball.y <= self.y + Paddle.HEIGHT / 2


def map_value(val, start_src, end_src, start_dst, end_dst):
    src_span = end_src - start_src
    dst_span = end_dst - start_dst

    valueScaled = float(val - start_src) / float(src_span)
    return start_dst + (valueScaled * dst_span)
```
## frontend/game.js
```ts
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
```

i thought about using geometric transformations 2d to 3d so i could change the backend:(x,y) to the (x,y,z)needed by frontend 
but if i did so how i could know in backend the limites of table in 2d system i just had a variable of height and width 

so you see what am strugling with
so could you help me here 