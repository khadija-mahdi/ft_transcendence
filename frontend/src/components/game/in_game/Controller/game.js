import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { TextGeometry } from "TextGeometry";
import { FontLoader } from "FontLoader";
import { GLTFLoader } from "GLTFLoader";
//impoprt websocket function :
import AuthWebSocket from "../../../../lib/AuthWebSocket.js";

export default function () {

// let isBallModelLoaded = false; // Flag to track ball model loading
let scene, camera, renderer, controls;
let computer = null;
let ballModel = null;
let player_model = null;
let score_board = null;
let bg_scene =null;
let tableModel = null;
let tableWidth = 0; // Width of the table, to be determined dynamically
let z_velocity = 0.05;
let x_velocity = 0.05;
let moveLeftPlayer = false;
let moveRightPlayer = false;
let moveLeftComputer = false;
let moveRightComputer = false;
let computer_score = 0;
let player_score = 0;
let player_score_text = "player :";
let computer_score_text = "player :";
let textMesh = null;
let textMesh_computer = null;
let textMesh_player = null;
let textMesh_score_player = null;
let textMesh_score_computer = null;
let latestBallData = null;


const width = 800;
const height = 600;

function init() 
{

    // Create a scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue color
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.x =  -500;
    // camera.position.y = 600;
    camera.position.z =  500;
    // camera.lookAt(camera.position.x, camera.position.y, camera.position.z);
         
    // const LoadingManager = new THREE.LoadingManager();
    // LoadingManager.onStart = function(url,item,totale)
    // {
    //     console.log("on start loading .... => ",url);
    // }

    // const gltf_loader = new GLTFLoader(LoadingManager);
    
    
    // Create a renderer and add it to the DOM
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log(window.innerWidth,window.innerHeight,"   <======    ");
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    // Add light for player
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);



    function adjustCameraAndControls(object) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Calculate the camera distance
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180); // convert FOV to radians
        const cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

        // Position the camera
        camera.position.set(center.x, center.y, cameraDistance * 1.5);
        camera.lookAt(center);

        // Adjust the near and far planes of the camera
        camera.near = cameraDistance / 100;
        camera.far = cameraDistance * 100;
        camera.updateProjectionMatrix();

        // Adjust OrbitControls
        controls.target.copy(center);
        controls.maxDistance = cameraDistance * 10;
        controls.update();
    }

    // Load the secne model
    const loader_scene = new GLTFLoader();
    loader_scene.load("/components/game/in_game/assets/models/scene_bg.glb", (glb) => {
        bg_scene = glb.scene;
        scene.add(bg_scene);
        bg_scene.position.set(0, 0, 0);
        bg_scene.scale.set(90, 90, 90);

        const box = new THREE.Box3().setFromObject(bg_scene);
        console.log("=>>>>  ",box);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        adjustCameraAndControls(bg_scene);
    });


    // Load the ball model
    const loader_scene1 = new GLTFLoader();
    loader_scene1.load("/components/game/in_game/assets/models/scene_light.glb", (glb) => {
        tableModel = glb.scene;
        scene.add(tableModel);
        tableModel.position.set(0, 500, 0);
        tableModel.scale.set(850, 850, 850);

        const box = new THREE.Box3().setFromObject(tableModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        tableWidth = size.x;
        console.log("----->     ",box);
        adjustCameraAndControls(tableModel);
    });
    
    const loader_cpm = new GLTFLoader();
    loader_cpm.load("/components/game/in_game/assets/models/paddle_hock.glb", (glb) => { // computer player
        computer = glb.scene;
        scene.add(computer);
        computer.position.set(0, 200,250);
        computer.scale.set(350, 350, 350); // Adjust the scale if necessary
    }, undefined, (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
    });


    // // let ballModelLoaded = new Promise((resolve, reject) => {
    // //     const loader = new GLTFLoader();
    // //     loader.load("/components/game/in_game/assets/models/ball_rca.glb", (glb) => {
    // //         ballModel = glb.scene;
    // //         scene.add(ballModel);
    // //         ballModel.position.set(0.5, 0.9, -2.5);
    // //         ballModel.scale.set(0.9, 1.2, 0.9);
    // //         resolve();
    // //     }, undefined, reject);
    // // });
    // // // Load the ball model
    const loader = new GLTFLoader();
    loader.load("/components/game/in_game/assets/models/ball_rca.glb", (glb) => {
        ballModel = glb.scene;
        scene.add(ballModel);
        ballModel.position.set(0, -720, -1000);
        ballModel.scale.set(350, 700, 350);
        adjustCameraAndControls(ballModel);
    });

    // Load the player paddle model
    const loader2 = new GLTFLoader();
    loader2.load("/components/game/in_game/assets/models/paddle_hock.glb", (glb) => {
        player_model = glb.scene;
        scene.add(player_model);
        player_model.position.set(0, 200,2260);
        player_model.scale.set(350, 350, 350);
    });


    //load the soccer board
    const loader_board = new GLTFLoader();
    loader_board.load("/components/game/in_game/assets/models/score.glb", (glb) => {
        score_board = glb.scene;
        scene.add(score_board);
        score_board.position.set(0, 1400, 200);
        score_board.scale.set(150,150, 150);
        // score_board.rotation.y =Math.PI / 4; // 30 degrees in radians
        score_board.rotation.y = Math.PI; // 30 degrees in radians
        adjustCameraAndControls(score_board);
        // score_board.rotation.x = Math.PI / 4; // 30 degrees in radians
    });
    

    // // computer score
    // // player score
    const text_loader_computer = new FontLoader();
    text_loader_computer.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new TextGeometry('PLAYER 2', {
            font: font,
            size: 70,
            depth: 50,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        textMesh_score_computer = new THREE.Mesh(textGeometry, textMaterial);
        textMesh_score_computer.position.set(50, 2100, -1500);
        scene.add(textMesh_score_computer);
    });

    const loader1 = new FontLoader();
    loader1.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new TextGeometry(computer_score.toString(), {
            font: font,
            size: 290,
            depth: 50,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });

        // Create a material and a mesh
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position the text
        textMesh.position.set(120, 1750, -1500);

        // Add the text to the scene
        scene.add(textMesh);
    });


    // // player score
    const text_loader_player = new FontLoader();
    text_loader_player.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new TextGeometry('PLAYER 1', {
            font: font,
            size: 70,
            depth: 50,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        textMesh_score_player = new THREE.Mesh(textGeometry, textMaterial);
        textMesh_score_player.position.set(-490, 2100, -1500);
        scene.add(textMesh_score_player);
    });

    const text_load = new FontLoader();
    text_load.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new TextGeometry(player_score.toString(), {
            font: font,
            size: 290,
            depth: 50,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        // Create a material and a mesh
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        textMesh_player = new THREE.Mesh(textGeometry, textMaterial);

        // Position the text
        textMesh_player.position.set(-390, 1750, -1500);

        // Add the text to the scene
        scene.add(textMesh_player);
    });



    // function handleWebSocketMessages(message)
    // {
    //     if (!message.data) return;
    //     const data = JSON.parse(message.data);
    
    //     ballModelLoaded.then(() => {
    //         if (data.type === 'update' && data.ball && ballModel) {
    //             ballModel.position.x = data.ball.x;
    //             ballModel.position.z = data.ball.y;
    //         }
    //     }).catch(error => {
    //         console.error("Error loading the ball model:", error);
    //     });
    // }
    let lastUpdateTime = 0;
    const updateInterval = 500; // milliseconds


    function handleWebSocketMessages (message)
    {
        if (!message.data) return;
        const data = JSON.parse(message.data);
        // console.log("Received data:", data);
        console.log("this data      =======> ",ballModel);

        if (data.type === 'update' && data.ball) 
        {
            latestBallData = data.ball;
        }
        // if (!message.data) return;
        // const data = JSON.parse(message.data);
        // console.log(" i am in hadnle web socket message ==<");        
        // switch (data.type) {
        //   case 'update':
        //     console.log(" update ===>",data);
        //     latestBallData = data.ball;
          // Game state update
        // ballModelLoaded.then(() => 
        // {
        //     const currentTime = Date.now();
        //     if (currentTime - lastUpdateTime >= updateInterval) {
        //         lastUpdateTime = currentTime;
        
        //     if (data.type === 'update' && data.ball && ballModel) 
        //     {
        //         console.log("update ball model posiotion      ====>");
        //         // for ball aon 3d (z and x)
        //         ballModel.position.x = 1;
        //         // data.ball.x = ballModel.position.x;
        //         // data.ball.y = ballModel.position.z;
        //         ballModel.position.z = 2;
        //     }
        //     }
        // }).catch(error => {
        //     console.error("Error loading the ball model:", error);
        // });
        // //for paddles game
        //     if (data.leftPaddle)     
        //     {
        //         if (player_model && player_model.position)
        //         {
        //             data.leftPaddle.x = player_model.position.x;
                    
        //         }
        //     }
        //     if (data.rightPaddle)
        //     {
        //         if (computer && computer.position)
        //         {
        //             data.leftPaddle.x = computer.position.x;
        //         }
        //     }
            // break;
        //   case 'goal':
        //     // Update scores
        //     console.log("gooaaaaallllllll");
        //     player_score = data.first_player_score;
        //     computer_score = data.second_player_score;
        //     // update_text();
        //     // update_text_player();
        //     // resetBallPosition();
        //     // resetBallPosition_player();
        //     break;
        //   case 'game_over':
        //     // Handle game over scenario
        //     alert("Game Over!");
        //     break;
        //   default:
        //     console.log(data);
        //     break;
        // }
      }


    // setup web socket 
    function setupWebSocket () 
    {
          //// const ws = new AuthWebSocket('wss://localhost/ws/game/d9517b51-d861-4eba-96d6-28ec87f6284a/')
          // in next js           const lobbySocket = new AuthWebSocket(`${WS_BASE_URL}/game/${uuid}/`); 
         const lobbySocket = new AuthWebSocket(`wss://localhost:4433/ws/game/${uuid}/`);
          lobbySocket.onerror = (error) => {
            console.error('WebSocket error: dxx', error);
          };

          lobbySocket.onclose = (event) => 
            {
            console.log("hello dx i am close -------");
            console.log('WebSocket closed:', event.code, event.reason);
            };
        //   lobbySocket.onopen = (event) => 
        //     {
        //       console.log("yaaaaaaaaaaaa hooo");
        //   };
          lobbySocket.addEventListener('message', (message) => 
          {
            handleWebSocketMessages(message);
          });
  
          lobbySocket.addEventListener('close', () => {
            console.log('WebSocket disconnected');
          });
          lobbySocket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
          });
    }


    // Adding bounding boxes to our cubes
    const playerBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    const ballBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    const computerBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    function checkCollision() {
        if (player_model && computer && ballModel) 
        {
            // Update bounding boxes with the current position of the cubes
            playerBB.setFromObject(player_model);
            ballBB.setFromObject(ballModel);
            computerBB.setFromObject(computer);

            // Check collision with player paddle
            if (playerBB.intersectsBox(ballBB)) {
                console.log('Player hit');
                z_velocity = -Math.abs(z_velocity); // Ensure z_velocity is negative to move the ball towards the computer
                // Adjust the ball's x_velocity based on the paddle's movement
                x_velocity = (ballModel.position.x - player_model.position.x) * 0.05;
            } 
            // Check collision with computer paddle
            else if (computerBB.intersectsBox(ballBB))
            {
                console.log('Computer hit');
                z_velocity = Math.abs(z_velocity); // Ensure z_velocity is positive to move the ball towards the player
                // Adjust the ball's x_velocity based on the paddle's movement
                x_velocity = (ballModel.position.x - computer.position.x) * 0.05;
            }
            else if (ballModel.position.z > 1.6)
            {
                // console.log('Player hit');
                console.log("computer ----------------");
                computer_score++;
                resetBallPosition();
            }
            else if (ballModel.position.z < -7)
            {
                console.log("player ----------------");
                player_score++;
                resetBallPosition_player();
            }
        }
    }

    function update_text()
    {
        // console.log("Updating text... =>>> ",textMesh);
        if (textMesh)
        {
            console.log("remove the model ......");
            scene.remove(textMesh);
            textMesh.geometry.dispose();
            textMesh.material.dispose();
            textMesh = null;
            console.log("-------------------------------------------------dx");
        }
        // Load the font and create the new text geometry
        const loader1 = new FontLoader();
        loader1.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new TextGeometry(computer_score.toString(), {
                font: font,
                size: 0.6,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });

            // Create a material and a new mesh
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Position the text
            textMesh.position.set(0.7, 5.6, -4.5);

            // Add the new text to the scene
            scene.add(textMesh);
            console.log("add the model ......");
        });
    }

    function update_text_player()
    {
        // console.log("Updating text... =>>> ",textMesh);
        if (textMesh_player)
        {
            console.log("remove the model ......");
            scene.remove(textMesh_player);
            textMesh_player.geometry.dispose();
            textMesh_player.material.dispose();
            textMesh_player = null;
            console.log("-------------------------------------------------dx");
        }
        // Load the font and create the new text geometry
        const loader1 = new FontLoader();
        loader1.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new TextGeometry(player_score.toString(), {
                font: font,
                size: 0.6,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });

            // Create a material and a new mesh
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            textMesh_player = new THREE.Mesh(textGeometry, textMaterial);

            // Position the text
            textMesh_player.position.set(-1, 5.6, -4.5);

            // Add the new text to the scene
            scene.add(textMesh_player);
            console.log("add the model ......");
        });
    }

    function resetBallPosition()
    {
        ballModel.position.set(0.5, 0.9, -2.5); // Reset the ball to the center of the table
        z_velocity = 0.05; // Reset the velocities if needed
        x_velocity = 0.05;
        update_text();
    }



    function resetBallPosition_player()
    {
        ballModel.position.set(0.5, 0.9, -2.5); // Reset the ball to the center of the table
        z_velocity = 0.05; // Reset the velocities if needed
        x_velocity = 0.05;
        update_text_player();
    }

function animate()
{

    requestAnimationFrame(animate);
    if (latestBallData && ballModel)
    {
        console.log("Updating ball model position ====>");
        let x_c = 10000;
        ballModel.translateX(latestBallData.x / x_c);
        ballModel.translateZ(latestBallData.y / x_c);
        console.log(ballModel.position.x,"=========",latestBallData.x);
        console.log(ballModel.position.z);
        // ballModel.translateX(latestBallData.x);
        // ballModel.translateZ(latestBallData.y);
    }
    // if (ballModel && tableModel) {
    //     ballModel.translateX(x_velocity);
    //     ballModel.translateZ(z_velocity);

    //     // Constrain the ball's x position to the table width
    //     if (tableWidth > 0) {
    //         if (ballModel.position.x > tableWidth / 2) {
    //             ballModel.position.x = tableWidth / 2;
    //             x_velocity = -Math.abs(x_velocity);
    //         } else if (ballModel.position.x < -tableWidth / 2) {
    //             ballModel.position.x = -tableWidth / 2;
    //             x_velocity = Math.abs(x_velocity);
    //         }
    //     }
    //     checkCollision();
    // }

    // if (moveLeftPlayer && player_model.position.x > -tableWidth / 2) {
    //     player_model.position.x -= 0.05;
    // }
    // if (moveRightPlayer && player_model.position.x < tableWidth / 2) {
    //     player_model.position.x += 0.05;
    // }

    // // Update computer paddle position with boundary check
    // if (moveLeftComputer && computer.position.x > -tableWidth / 2) {
    //     computer.position.x -= 0.05;
    // }
    // if (moveRightComputer && computer.position.x < tableWidth / 2) {
    //     computer.position.x += 0.05;
    // }

    controls.update();
    renderer.render(scene, camera);
}

    
    // Run the animation function for the first time to kick things off
    animate();
    setupWebSocket();
    // Handle window resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Handle keydown events
    window.addEventListener('keydown', (event) => {
        if (!player_model || !computer) return;
        switch (event.key) {
            case 'ArrowLeft':
                if (player_model.position.x > -tableWidth / 2) { // Check left boundary
                    moveLeftPlayer = true;
                    controls.enabled = false;
                }
                break;
            case 'ArrowRight':
                if (player_model.position.x < tableWidth / 2) { // Check right boundary
                    moveRightPlayer = true;
                    controls.enabled = false;
                }
                break;
            case 'a': // 'a' key for moving the computer paddle left
                if (computer.position.x > -tableWidth / 2) { // Check left boundary
                    moveLeftComputer = true;
                    controls.enabled = false;
                }
                break;
            case 'd': // 'd' key for moving the computer paddle right
                if (computer.position.x < tableWidth / 2) { // Check right boundary
                    moveRightComputer = true;
                    controls.enabled = false;
                }
                break;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (!player_model || !computer) return;
        switch (event.key) {
            case 'ArrowLeft':
                moveLeftPlayer = false;
                controls.enabled = true;
                break;
            case 'ArrowRight':
                moveRightPlayer = false;
                controls.enabled = true;
                break;
            case 'a': // 'a' key for moving the computer paddle left
                moveLeftComputer = false;
                controls.enabled = true;
                break;
            case 'd': // 'd' key for moving the computer paddle right
                moveRightComputer = false;
                controls.enabled = true;
                break;
        }
    });
}

init();
}
