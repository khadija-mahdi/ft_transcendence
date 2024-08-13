import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { TextGeometry } from "TextGeometry";
import { FontLoader } from "FontLoader";
import { GLTFLoader } from "GLTFLoader";
//impoprt websocket function :
// import {AuthWebSocket} from "../../../../lib/AuthWebSocket.js";

console.log("oussma oussaada");
// export default function () {

// let scene, camera, renderer, controls;
// let computer = null;
// let ballModel = null;
// let player_model = null;
// let score_board = null;
// let bg_scene =null;
// let tableModel = null;
// let tableWidth = 0; // Width of the table, to be determined dynamically
// let z_velocity = 0.05;
// let x_velocity = 0.05;
// let moveLeftPlayer = false;
// let moveRightPlayer = false;
// let moveLeftComputer = false;
// let moveRightComputer = false;
// let computer_score = 0;
// let player_score = 0;
// let player_score_text = "player :";
// let computer_score_text = "player :";
// let textMesh = null;
// let textMesh_computer = null;
// let textMesh_player = null;
// let textMesh_score_player = null;
// let textMesh_score_computer = null;

// function init() {
//     // Create a scene
//     scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x87CEEB); // Sky blue color
    
//     // Create a camera, which determines what we'll see when we render the scene
//     camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.z = 5;

//     // Create a renderer and add it to the DOM
//     renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);

//     controls = new OrbitControls(camera, renderer.domElement);

//     // Add light for player
//     const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
//     directionalLight.position.set(5, 10, 7.5);
//     scene.add(directionalLight);

//     // Load the secne model
//     const loader_scene = new GLTFLoader();
//     loader_scene.load("/components/game/in_game/assets/models/scene_bg.glb", (glb) => {
//         bg_scene = glb.scene;
//         scene.add(bg_scene);
//         bg_scene.position.set(0, 0, 0);
//         bg_scene.scale.set(0.4, 0.4, 0.4);
//     });


//     // Load the ball model
//     const loader_scene1 = new GLTFLoader();
//     loader_scene1.load("/components/game/in_game/assets/models/scene_light.glb", (glb) => {
//         tableModel = glb.scene;
//         scene.add(tableModel);
//         tableModel.position.set(0, 2, 0);
//         tableModel.scale.set(2.8, 2.8, 2.8);

//         const box = new THREE.Box3().setFromObject(tableModel);
//         const size = new THREE.Vector3();
//         box.getSize(size);
//         tableWidth = size.x;
//         console.log("-----",tableWidth)
//     });

//     const loader_cpm = new GLTFLoader();
//     loader_cpm.load("/components/game/in_game/assets/models/paddle_hock.glb", (glb) => { // computer player
//         computer = glb.scene;
//         scene.add(computer);
//         computer.position.set(0, 1.4, 0.2);
//         computer.scale.set(1, 1, 1); // Adjust the scale if necessary
//     }, undefined, (error) => {
//         console.error('An error occurred while loading the GLTF model:', error);
//     });
//     // Load the ball model
//     const loader = new GLTFLoader();
//     loader.load("/components/game/in_game/assets/models/ball_rca.glb", (glb) => {
//         ballModel = glb.scene;
//         scene.add(ballModel);
//         ballModel.position.set(0.5, 0.9, -2.5);
//         ballModel.scale.set(0.9, 1.2, 0.9);
//     });

//     // Load the player paddle model
//     const loader2 = new GLTFLoader();
//     loader2.load("/components/game/in_game/assets/models/paddle_hock.glb", (glb) => {
//         player_model = glb.scene;
//         scene.add(player_model);
//         player_model.position.set(0, 1.4, 7);
//         player_model.scale.set(1, 1, 1);
//     });


//     //load the soccer board
//     const loader_board = new GLTFLoader();
//     loader_board.load("/components/game/in_game/assets/models/score.glb", (glb) => {
//         score_board = glb.scene;
//         scene.add(score_board);
//         score_board.position.set(0, 5, -1);
//         score_board.scale.set(0.5, 0.3, 0.3);
//         // score_board.rotation.y =Math.PI / 4; // 30 degrees in radians
//         score_board.rotation.y = Math.PI; // 30 degrees in radians
//         // score_board.rotation.x = Math.PI / 4; // 30 degrees in radians
//     });
    

//     // computer score
//     // player score
//     const text_loader_computer = new FontLoader();
//     text_loader_computer.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//         const textGeometry = new TextGeometry('Computer ', {
//             font: font,
//             size: 0.2,
//             depth: 0.2,
//             curveSegments: 12,
//             bevelEnabled: true,
//             bevelThickness: 0.03,
//             bevelSize: 0.02,
//             bevelSegments: 5
//         });
//         const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//         textMesh_score_computer = new THREE.Mesh(textGeometry, textMaterial);
//         textMesh_score_computer.position.set(0.4, 6.3, -4.5);
//         scene.add(textMesh_score_computer);
//     });

//     const loader1 = new FontLoader();
//     loader1.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//         const textGeometry = new TextGeometry(computer_score.toString(), {
//             font: font,
//             size: 0.6,
//             depth: 0.2,
//             curveSegments: 12,
//             bevelEnabled: true,
//             bevelThickness: 0.03,
//             bevelSize: 0.02,
//             bevelSegments: 5
//         });

//         // Create a material and a mesh
//         const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//         textMesh = new THREE.Mesh(textGeometry, textMaterial);

//         // Position the text
//         textMesh.position.set(0.7, 5.6, -4.5);

//         // Add the text to the scene
//         scene.add(textMesh);
//     });


//     // player score
//     const text_loader_player = new FontLoader();
//     text_loader_player.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//         const textGeometry = new TextGeometry('PLAYER ', {
//             font: font,
//             size: 0.2,
//             depth: 0.2,
//             curveSegments: 12,
//             bevelEnabled: true,
//             bevelThickness: 0.03,
//             bevelSize: 0.02,
//             bevelSegments: 5
//         });
//         const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//         textMesh_score_player = new THREE.Mesh(textGeometry, textMaterial);
//         textMesh_score_player.position.set(-1.2, 6.3, -4.5);
//         scene.add(textMesh_score_player);
//     });

//     const text_load = new FontLoader();
//     text_load.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//         const textGeometry = new TextGeometry(player_score.toString(), {
//             font: font,
//             size: 0.6,
//             depth: 0.2,
//             curveSegments: 12,
//             bevelEnabled: true,
//             bevelThickness: 0.03,
//             bevelSize: 0.02,
//             bevelSegments: 5
//         });

//         // Create a material and a mesh
//         const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//         textMesh_player = new THREE.Mesh(textGeometry, textMaterial);

//         // Position the text
//         textMesh_player.position.set(-1, 5.6, -4.5);

//         // Add the text to the scene
//         scene.add(textMesh_player);
//     });

//     // function handleWebSocketMessages (message)
//     // {
//     //     if (!message.data) return;
//     //     const data = JSON.parse(message.data);

//     //     switch (data.type) {
//     //       case 'update':
//     //         // Game state update
//     //         if (data.ball) {
//     //           if (ballModel && ballModel.position)
//     //           {
//     //             ballModel.position.x = data.ball.x;
//     //             ballModel.position.z = data.ball.y;
//     //           } else {
//     //             console.error('ballModel is not initialized', ballModel);
//     //           }
//     //         }
//     //         if (data.leftPaddle)     
//     //         {
//     //           player_model.position.set(data.leftPaddle.x, player_model.position.y, data.leftPaddle.z);
//     //         }
//     //         if (data.rightPaddle)
//     //         {
//     //           computer.position.set(data.rightPaddle.x, computer.position.y, data.rightPaddle.z);
//     //         }
//     //         break;
//     //       case 'goal':
//     //         // Update scores
//     //         player_score = data.first_player_score;
//     //         computer_score = data.second_player_score;
//     //         update_text();
//     //         resetBallPosition();
//     //         break;
//     //       case 'game_over':
//     //         // Handle game over scenario
//     //         alert("Game Over!");
//     //         break;
//     //       default:
//     //         console.log(data);
//     //         break;
//     //     }
//     //   }


//     // // setup web socket 
//     // function setupWebSocket () 
//     // {
//     //       //AuthWebSocket
//     //       //searchparams

//     //       // get a token of game
//     //       //  i should be to get uid of game
//     //       const lobbySocket = new AuthWebSocket(`${WS_BASE_URL}/game/${uuid}/`);          
//     //       lobbySocket.onerror = (error) => {
//     //         console.error('WebSocket error: dxx', error);
//     //       };
//     //       lobbySocket.onclose = (event) => {
//     //         console.log('WebSocket closed:', event.code, event.reason);
//     //       };
//     //       lobbySocket.onopen = (event) => {
//     //           console.log("yaaaaaaaaaaaa hooo");
//     //       };

//     //       lobbySocket.addEventListener('open', () => {
//     //         console.log('WebSocket connected');
//     //       });
  
//     //       lobbySocket.addEventListener('message', (message) => 
//     //       {
//     //         console.log("=------------------=-=--==-=i have a message");
//     //         handleWebSocketMessages(message);
//     //       });
  
//     //       lobbySocket.addEventListener('close', () => {
//     //         console.log('WebSocket disconnected');
//     //       });
//     //       lobbySocket.addEventListener('error', (error) => {
//     //         console.error('WebSocket error:', error);
//     //       });
//     // }




//     // Adding bounding boxes to our cubes
//     const playerBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
//     const ballBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
//     const computerBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

//     function checkCollision() {
//         if (player_model && computer && ballModel) 
//         {
//             // Update bounding boxes with the current position of the cubes
//             playerBB.setFromObject(player_model);
//             ballBB.setFromObject(ballModel);
//             computerBB.setFromObject(computer);

//             // Check collision with player paddle
//             if (playerBB.intersectsBox(ballBB)) {
//                 console.log('Player hit');
//                 z_velocity = -Math.abs(z_velocity); // Ensure z_velocity is negative to move the ball towards the computer
//                 // Adjust the ball's x_velocity based on the paddle's movement
//                 x_velocity = (ballModel.position.x - player_model.position.x) * 0.05;
//             } 
//             // Check collision with computer paddle
//             else if (computerBB.intersectsBox(ballBB))
//             {
//                 console.log('Computer hit');
//                 z_velocity = Math.abs(z_velocity); // Ensure z_velocity is positive to move the ball towards the player
//                 // Adjust the ball's x_velocity based on the paddle's movement
//                 x_velocity = (ballModel.position.x - computer.position.x) * 0.05;
//             }
//             else if (ballModel.position.z > 1.6)
//             {
//                 // console.log('Player hit');
//                 console.log("computer ----------------");
//                 computer_score++;
//                 resetBallPosition();
//             }
//             else if (ballModel.position.z < -7)
//             {
//                 console.log("player ----------------");
//                 player_score++;
//                 resetBallPosition_player();
//             }
//         }
//     }

//     function update_text()
//     {
//         // console.log("Updating text... =>>> ",textMesh);
//         if (textMesh)
//         {
//             console.log("remove the model ......");
//             scene.remove(textMesh);
//             textMesh.geometry.dispose();
//             textMesh.material.dispose();
//             textMesh = null;
//             console.log("-------------------------------------------------dx");
//         }
//         // Load the font and create the new text geometry
//         const loader1 = new FontLoader();
//         loader1.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//             const textGeometry = new TextGeometry(computer_score.toString(), {
//                 font: font,
//                 size: 0.6,
//                 depth: 0.2,
//                 curveSegments: 12,
//                 bevelEnabled: true,
//                 bevelThickness: 0.03,
//                 bevelSize: 0.02,
//                 bevelSegments: 5
//             });

//             // Create a material and a new mesh
//             const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//             textMesh = new THREE.Mesh(textGeometry, textMaterial);

//             // Position the text
//             textMesh.position.set(0.7, 5.6, -4.5);

//             // Add the new text to the scene
//             scene.add(textMesh);
//             console.log("add the model ......");
//         });
//     }

//     function update_text_player()
//     {
//         // console.log("Updating text... =>>> ",textMesh);
//         if (textMesh_player)
//         {
//             console.log("remove the model ......");
//             scene.remove(textMesh_player);
//             textMesh_player.geometry.dispose();
//             textMesh_player.material.dispose();
//             textMesh_player = null;
//             console.log("-------------------------------------------------dx");
//         }
//         // Load the font and create the new text geometry
//         const loader1 = new FontLoader();
//         loader1.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//             const textGeometry = new TextGeometry(player_score.toString(), {
//                 font: font,
//                 size: 0.6,
//                 depth: 0.2,
//                 curveSegments: 12,
//                 bevelEnabled: true,
//                 bevelThickness: 0.03,
//                 bevelSize: 0.02,
//                 bevelSegments: 5
//             });

//             // Create a material and a new mesh
//             const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//             textMesh_player = new THREE.Mesh(textGeometry, textMaterial);

//             // Position the text
//             textMesh_player.position.set(-1, 5.6, -4.5);

//             // Add the new text to the scene
//             scene.add(textMesh_player);
//             console.log("add the model ......");
//         });
//     }

//     function resetBallPosition()
//     {
//         ballModel.position.set(0.5, 0.9, -2.5); // Reset the ball to the center of the table
//         z_velocity = 0.05; // Reset the velocities if needed
//         x_velocity = 0.05;
//         update_text();
//     }



//     function resetBallPosition_player()
//     {
//         ballModel.position.set(0.5, 0.9, -2.5); // Reset the ball to the center of the table
//         z_velocity = 0.05; // Reset the velocities if needed
//         x_velocity = 0.05;
//         update_text_player();
//     }

// function animate(currentTime) {

//     requestAnimationFrame(animate);

//     if (ballModel && tableModel) {
//         ballModel.translateX(x_velocity);
//         ballModel.translateZ(z_velocity);

//         // Constrain the ball's x position to the table width
//         if (tableWidth > 0) {
//             if (ballModel.position.x > tableWidth / 2) {
//                 ballModel.position.x = tableWidth / 2;
//                 x_velocity = -Math.abs(x_velocity);
//             } else if (ballModel.position.x < -tableWidth / 2) {
//                 ballModel.position.x = -tableWidth / 2;
//                 x_velocity = Math.abs(x_velocity);
//             }
//         }
//         checkCollision();
//     }

//     if (moveLeftPlayer && player_model.position.x > -tableWidth / 2) {
//         player_model.position.x -= 0.05;
//     }
//     if (moveRightPlayer && player_model.position.x < tableWidth / 2) {
//         player_model.position.x += 0.05;
//     }

//     // Update computer paddle position with boundary check
//     if (moveLeftComputer && computer.position.x > -tableWidth / 2) {
//         computer.position.x -= 0.05;
//     }
//     if (moveRightComputer && computer.position.x < tableWidth / 2) {
//         computer.position.x += 0.05;
//     }

//     controls.update();
//     renderer.render(scene, camera);
// }

    
//     // Run the animation function for the first time to kick things off
//     animate();

//     // Handle window resize
//     window.addEventListener('resize', () => {
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//     });

//     // Handle keydown events
//     window.addEventListener('keydown', (event) => {
//         if (!player_model || !computer) return;
//         switch (event.key) {
//             case 'ArrowLeft':
//                 if (player_model.position.x > -tableWidth / 2) { // Check left boundary
//                     moveLeftPlayer = true;
//                     controls.enabled = false;
//                 }
//                 break;
//             case 'ArrowRight':
//                 if (player_model.position.x < tableWidth / 2) { // Check right boundary
//                     moveRightPlayer = true;
//                     controls.enabled = false;
//                 }
//                 break;
//             case 'a': // 'a' key for moving the computer paddle left
//                 if (computer.position.x > -tableWidth / 2) { // Check left boundary
//                     moveLeftComputer = true;
//                     controls.enabled = false;
//                 }
//                 break;
//             case 'd': // 'd' key for moving the computer paddle right
//                 if (computer.position.x < tableWidth / 2) { // Check right boundary
//                     moveRightComputer = true;
//                     controls.enabled = false;
//                 }
//                 break;
//         }
//     });

//     window.addEventListener('keyup', (event) => {
//         if (!player_model || !computer) return;
//         switch (event.key) {
//             case 'ArrowLeft':
//                 moveLeftPlayer = false;
//                 controls.enabled = true;
//                 break;
//             case 'ArrowRight':
//                 moveRightPlayer = false;
//                 controls.enabled = true;
//                 break;
//             case 'a': // 'a' key for moving the computer paddle left
//                 moveLeftComputer = false;
//                 controls.enabled = true;
//                 break;
//             case 'd': // 'd' key for moving the computer paddle right
//                 moveRightComputer = false;
//                 controls.enabled = true;
//                 break;
//         }
//     });
// }

// init();
// }
