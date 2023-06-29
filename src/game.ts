/// --- Set up a system ---

// class RotatorSystem {
//   // this group will contain every entity that has a Transform component
//   group = engine.getComponentGroup(Transform)

//   update(dt: number) {
//     // iterate over the entities of the group
//     for (const entity of this.group.entities) {
//       // get the Transform component of the entity
//       const transform = entity.getComponent(Transform)

//       // mutate the rotation
//       transform.rotate(Vector3.Up(), dt * 10)
//     }
//   }
// }

// Add a new instance of the system to the engine
// engine.addSystem(new RotatorSystem())

/// --- Spawner function ---

// function spawnCube(x: number, y: number, z: number) {
//   // create the entity
//   const cube = new Entity()

//   // add a transform to the entity
//   cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

//   // add a shape to the entity
//   cube.addComponent(new BoxShape())

//   // add the entity to the engine
//   engine.addEntity(cube)

//   return cube
// }

// /// --- Spawn a cube ---

// const cube = spawnCube(8, 1, 8)

// cube.addComponent(
//   new OnPointerDown(() => {
//     cube.getComponent(Transform).scale.z *= 1.1
//     cube.getComponent(Transform).scale.x *= 0.9

//     spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
//   })
// )

import * as EthereumController from '@decentraland/EthereumController';
import * as EthConnect from 'eth-connect';
import abi from './abi';
import { getProvider } from "@decentraland/web3-provider";

const contractAddress = '0x7d71F00D4c91cF3E60C131f16e228fE959Df8a5F';

let openDoor = false;

let name = "", surname = "";

executeTask(async () => {
  // create an instance of the web3 provider to interface with Metamask
  const provider = await getProvider();
  // Create the object that will handle the sending and receiving of RPC messages
  const requestManager = new EthConnect.RequestManager(provider);
  // Create a factory object based on the abi
  const factory = new EthConnect.ContractFactory(requestManager, abi);
  // Use the factory object to instance a `contract` object, referencing a specific contract
  const contract = (await factory.at(
    contractAddress
  )) as any;

  const address = await EthereumController.getUserAccount();

  const arr = await contract.identity(address);
  name = arr[0];
  surname = arr[1];

  if (name != "" && surname != "") {
    text.value = `Museum of Art Fraud,\nAuthentication required`;
  }

  doorEntity.addComponent(new OnPointerDown(() => {
    if (!openDoor) {
      doorEntity.getComponent(Transform).rotation = Quaternion.Euler(0, 90, 0);
      doorEntity.getComponent(Transform).position = doorEntity.getComponent(Transform).position.add(new Vector3(-1,0,0));
      openDoor = true;
    }
    else {
      doorEntity.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0);
      doorEntity.getComponent(Transform).position = doorEntity.getComponent(Transform).position.add(new Vector3(1,0,0));
      openDoor = false;
    }
  }));
})


class CheckIdentity {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  async update(dt: number) {
  }
}

const wallMaterial = new Material();
wallMaterial.metallic = 0.0;
wallMaterial.roughness = 1;
wallMaterial.albedoTexture = new Texture('https://i.imgur.com/fv7Su2h.jpg');

const doorMaterial = new Material();
doorMaterial.albedoColor = Color3.White();
doorMaterial.roughness = 0.5;
doorMaterial.albedoTexture = new Texture('https://i.imgur.com/nDXsxPP.jpg');

const wallHeight = 7;

const leftWall = new Entity();
leftWall.addComponent(new Transform({position: new Vector3(4.5,0,5.5)}));
leftWall.getComponent(Transform).scale.x = 5;
leftWall.getComponent(Transform).scale.y = wallHeight;
leftWall.addComponent(wallMaterial);
leftWall.addComponent(new BoxShape());

const rightWall = new Entity();
rightWall.addComponent(new Transform({position: new Vector3(11.5,0,5.5)}));
rightWall.getComponent(Transform).scale.x = 5;
rightWall.getComponent(Transform).scale.y = wallHeight;
rightWall.addComponent(wallMaterial);
rightWall.addComponent(new BoxShape());

const topWall = new Entity();
topWall.addComponent(new Transform({position: new Vector3(8,5, 5.5)}));
topWall.getComponent(Transform).scale.x = 13;
topWall.getComponent(Transform).scale.y = 3;
topWall.addComponent(wallMaterial);
topWall.addComponent(new BoxShape());

const westWall = new Entity();
westWall.addComponent(new Transform({position: new Vector3(2, 0, 10)}));
westWall.getComponent(Transform).scale.y = wallHeight+6;
westWall.getComponent(Transform).scale.z = 10;
westWall.addComponent(wallMaterial);
westWall.addComponent(new BoxShape());

const eastWall = new Entity();
eastWall.addComponent(new Transform({position: new Vector3(14, 0, 10)}));
eastWall.getComponent(Transform).scale.y = wallHeight+6;
eastWall.getComponent(Transform).scale.z = 10;
eastWall.addComponent(wallMaterial);
eastWall.addComponent(new BoxShape());

const northWall = new Entity();
northWall.addComponent(new Transform({position: new Vector3(8, 0, 15)}));
northWall.getComponent(Transform).scale.y = wallHeight+6;
northWall.getComponent(Transform).scale.x = 13;
northWall.addComponent(wallMaterial);
northWall.addComponent(new BoxShape());

const doorEntity = new Entity();
const door = new BoxShape();
doorEntity.addComponent(new Transform({position: new Vector3(8,0,5.2)}));
doorEntity.getComponent(Transform).scale.y = 7;
doorEntity.getComponent(Transform).scale.x = 2;
doorEntity.getComponent(Transform).scale.z = 0.2;
doorEntity.addComponent(door);
doorEntity.addComponent(doorMaterial);

const floorSignEntity = new Entity();
const floorSign = new GLTFShape('models/floor-sign.glb');
floorSignEntity.addComponent(new Transform({position: new Vector3(0,0,0), scale: new Vector3(10,10,10)}));
floorSignEntity.addComponent(floorSign);
floorSignEntity.addComponent(doorMaterial);

engine.addEntity(leftWall);
engine.addEntity(rightWall);
engine.addEntity(topWall);
engine.addEntity(doorEntity);
engine.addEntity(westWall);
engine.addEntity(eastWall);
engine.addEntity(northWall);
engine.addEntity(floorSignEntity);

const textEntity = new Entity()

const text = new TextShape('Museum of Art Fraud,\nAuthentication required');
text.color = Color3.Black();
textEntity.addComponent(text);

textEntity.addComponent(new Transform({
  position: new Vector3(8, 5, 4.9)
}));

engine.addEntity(textEntity);

engine.addSystem(new CheckIdentity());

const imageEntity = new Entity()

// Crea una forma di piano e aggiungila all'entità
const plane = new PlaneShape();
imageEntity.addComponent(plane);

// Crea un materiale, carica una texture da un URL e aggiungi il materiale all'entità
const material = new Material()
material.albedoTexture = new Texture('https://i.imgur.com/NbQpIGP.png');
imageEntity.addComponent(material);

// Posiziona l'entità davanti all'utente
imageEntity.addComponent(new Transform({
  position: new Vector3(10, 2.5 , 14.49 ),
  rotation: Quaternion.Euler(0, 0, 180),
  scale: new Vector3(5,4,5)
}));

// Aggiungi l'entità al motore
engine.addEntity(imageEntity);