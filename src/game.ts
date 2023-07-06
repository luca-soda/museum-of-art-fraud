import * as EthereumController from '@decentraland/EthereumController';
import * as EthConnect from 'eth-connect';
import abi from './abi';
import { getProvider } from "@decentraland/web3-provider";
import * as environment from '@decentraland/EnvironmentAPI';

const contractAddress = '0x7971a2809DB4e9a72c5B0F94CA479B5779932385';

let openDoor = false;

// const pollQr = (async () => {
//   const data = await (await fetch(`https://issuer-verifier-express.delightfulriver-e0d8cb6b.westeurope.azurecontainerapps.io/verifierQrCode`)).json();
//   qrCode.albedoTexture = new Texture(data.qrCode);

// });

const pollRequestId = (async () => {
  const address = await EthereumController.getUserAccount();
  const data = await (await fetch(`https://issuer-verifier-express.delightfulriver-e0d8cb6b.westeurope.azurecontainerapps.io/isVerified?address=${address}`)).json();
  if (data.verified) {
    qrCode.albedoTexture = new Texture('https://i.imgur.com/tPP5qv2.jpg');
    americanGothicMaterial.albedoTexture = new Texture('https://i.imgur.com/nPewMuX.jpg');
  }
});

executeTask(async () => {
  // const provider = await getProvider();
  // const requestManager = new EthConnect.RequestManager(provider);
  // const factory = new EthConnect.ContractFactory(requestManager, abi);
  // const contract = (await factory.at(
  //   contractAddress
  // )) as any;

  const address = await EthereumController.getUserAccount();

  // const [name, surname] = await contract.identity(address);

  const result = await (await fetch('https://identity-provider.delightfulriver-e0d8cb6b.westeurope.azurecontainerapps.io/api/identity', {
    method: 'POST',
    body: JSON.stringify({
      address
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })).json();

  const { name } = result;

  if (name != "") {
    welcomeText.value = welcomeText.value.replace('Auth Required', `${name}`);
    doorEntity.addComponent(new OnPointerDown(async () => {
      if (!openDoor) {
        doorEntity.getComponent(Transform).rotation = Quaternion.Euler(0, 90, 0);
        doorEntity.getComponent(Transform).position = doorEntity.getComponent(Transform).position.add(new Vector3(-1, 0, 0));
        openDoor = true
        // await pollQr();
      }
      else {
        doorEntity.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0);
        doorEntity.getComponent(Transform).position = doorEntity.getComponent(Transform).position.add(new Vector3(1, 0, 0));
        openDoor = false;
      }
    }));
  }
})


class CheckIdentity {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  async update(dt: number) {
    const seconds = (await environment.getDecentralandTime()).seconds;
    // if (seconds % (10 * 100) === 0) {
    //   pollQr();
    // }
    if (seconds % (10 * 10) === 0) {
      pollRequestId();
    }
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
leftWall.addComponent(new Transform({ position: new Vector3(4.5, 0, 5.5) }));
leftWall.getComponent(Transform).scale.x = 5;
leftWall.getComponent(Transform).scale.y = wallHeight;
leftWall.addComponent(wallMaterial);
leftWall.addComponent(new BoxShape());

const rightWall = new Entity();
rightWall.addComponent(new Transform({ position: new Vector3(11.5, 0, 5.5) }));
rightWall.getComponent(Transform).scale.x = 5;
rightWall.getComponent(Transform).scale.y = wallHeight;
rightWall.addComponent(wallMaterial);
rightWall.addComponent(new BoxShape());

const topWall = new Entity();
topWall.addComponent(new Transform({ position: new Vector3(8, 5, 5.5) }));
topWall.getComponent(Transform).scale.x = 13;
topWall.getComponent(Transform).scale.y = 3;
topWall.addComponent(wallMaterial);
topWall.addComponent(new BoxShape());

const westWall = new Entity();
westWall.addComponent(new Transform({ position: new Vector3(2, 0, 10) }));
westWall.getComponent(Transform).scale.y = wallHeight + 6;
westWall.getComponent(Transform).scale.z = 10;
westWall.addComponent(wallMaterial);
westWall.addComponent(new BoxShape());

const eastWall = new Entity();
eastWall.addComponent(new Transform({ position: new Vector3(14, 0, 10) }));
eastWall.getComponent(Transform).scale.y = wallHeight + 6;
eastWall.getComponent(Transform).scale.z = 10;
eastWall.addComponent(wallMaterial);
eastWall.addComponent(new BoxShape());

const northWall = new Entity();
northWall.addComponent(new Transform({ position: new Vector3(8, 0, 15) }));
northWall.getComponent(Transform).scale.y = wallHeight + 6;
northWall.getComponent(Transform).scale.x = 13;
northWall.addComponent(wallMaterial);
northWall.addComponent(new BoxShape());

const doorEntity = new Entity();
const door = new BoxShape();
doorEntity.addComponent(new Transform({ position: new Vector3(8, 0, 5.2) }));
doorEntity.getComponent(Transform).scale.y = 7;
doorEntity.getComponent(Transform).scale.x = 2;
doorEntity.getComponent(Transform).scale.z = 0.2;
doorEntity.addComponent(door);
doorEntity.addComponent(doorMaterial);


engine.addEntity(leftWall);
engine.addEntity(rightWall);
engine.addEntity(topWall);
engine.addEntity(doorEntity);
engine.addEntity(westWall);
engine.addEntity(eastWall);
engine.addEntity(northWall);

engine.addSystem(new CheckIdentity());

const welcomeEntity = new Entity()

const welcomeText = new TextShape('Welcome to\n Museum of Art Fraud\nAuth Required');
welcomeText.color = Color3.White();
welcomeText.fontSize = 5;
welcomeEntity.addComponent(welcomeText);

welcomeEntity.addComponent(new Transform({
  position: new Vector3(8, 5, 4.5),
}));

engine.addEntity(welcomeEntity);

const imageEntity = new Entity()

const plane = new PlaneShape();
imageEntity.addComponent(plane);

const material = new Material()
material.albedoTexture = new Texture('https://i.imgur.com/5pdEXNG.jpg');
imageEntity.addComponent(material);

imageEntity.addComponent(new Transform({
  position: new Vector3(8, 3.2, 14.49),
  rotation: Quaternion.Euler(0, 0, 180),
  scale: new Vector3(5, 6, 5)
}));

engine.addEntity(imageEntity);

const qrCodeEntity = new Entity();

const plane2 = new PlaneShape();
qrCodeEntity.addComponent(plane2);

const qrCode = new Material()
qrCode.albedoTexture = new Texture('https://i.imgur.com/IjsozLk.png');
qrCodeEntity.addComponent(qrCode);
qrCode.castShadows = false;
qrCode.metallic = 0;
qrCode.albedoColor = Color4.White();

qrCodeEntity.addComponent(new Transform({
  position: new Vector3(2.54, 3.2, 10.49),
  rotation: Quaternion.Euler(0, -90, 180),
  scale: new Vector3(5, 6, 5)
}));

engine.addEntity(qrCodeEntity);

const americanGothicEntity = new Entity();

const plane3 = new PlaneShape();
americanGothicEntity.addComponent(plane3);

const americanGothicMaterial = new Material();
americanGothicMaterial.albedoTexture = new Texture('https://i.imgur.com/IjsozLk.png');
americanGothicEntity.addComponent(americanGothicMaterial);

americanGothicEntity.addComponent(new Transform({
  position: new Vector3(13.45, 3.2, 10.49),
  rotation: Quaternion.Euler(0, 90, -180),
  scale: new Vector3(5, 6, 5)
}));

engine.addEntity(americanGothicEntity);

const whiteMaterial = new Material();
whiteMaterial.albedoColor = Color4.White();

const authSignEntity = new Entity();
const authSign = new GLTFShape('models/billboard.glb');
authSignEntity.addComponent(authSign);
authSignEntity.addComponent(new Transform({
  position: new Vector3(8, 5, 4.7),
  scale: new Vector3(1.5, 1.1, 1)
}));
authSignEntity.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0);
authSignEntity.addComponent(whiteMaterial);

engine.addEntity(authSignEntity);


const button = new GLTFShape('models/button.glb');
const buttonEntity = new Entity();
buttonEntity.addComponent(button);
buttonEntity.addComponent(new Transform({
  position: new Vector3(4, 3, 15),
  scale: new Vector3(0.8, 0.8, 0.8)
}));
buttonEntity.getComponent(Transform).rotation = Quaternion.Euler(90, 0, 0);
buttonEntity.addComponent(new OnPointerDown(async () => {
  openExternalURL(`https://identity-provider.delightfulriver-e0d8cb6b.westeurope.azurecontainerapps.io/verifier?URL=aHR0cHM6Ly9pc3N1ZXItdmVyaWZpZXItZXhwcmVzcy5kZWxpZ2h0ZnVscml2ZXItZTBkOGNiNmIud2VzdGV1cm9wZS5henVyZWNvbnRhaW5lcmFwcHMuaW8vdmVyaWZpZXI&name=Museum%20of%20Art%20Fraud`);
}));

engine.addEntity(buttonEntity);
