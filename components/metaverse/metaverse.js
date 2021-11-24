import AFRAME from 'aframe';
import * as THREE from 'three'

import { getMetaData, getNFTListBYIssuer, getParameterByName, fetchNFTMetadata } from './random'

AFRAME.registerComponent("arrange-nft", {
  SECTION1_FRONT_WALL_LIMIT: 7,
  SECTION1_LEFT_WALL_LIMIT: 11,
  DISTANCE_BETWEEN_FRAME: 16,
  startDataOffset: 0,
  endDataOffset: 0,
  frameWidth: 0,
  framePadding: 2.5,
  artWidth: 28,
  init: function () {
    this.frameWidth = this.artWidth + 1.5;
    this.fetchNFT();
  },

  fetchNFT: async function () {
    let issuerID = "EaMrxQTs2autK9nsrkvSn52dBucQeU4U3KEzy5NiyAj63Li";
    // let issuerID = getParameterByName("i");
    let issuerNFTS = await getNFTListBYIssuer(issuerID);
    issuerNFTS = issuerNFTS.data.nFTEntities.nodes;
    //TODO: Handle slicing error if there is no enough NFTS to do slicing as per wall length
    this.endDataOffset = this.SECTION1_FRONT_WALL_LIMIT;
    let frontSect1WallNFTS = issuerNFTS.slice(
      this.startDataOffset,
      this.endDataOffset
    );
    this.setSection1FrontWall(frontSect1WallNFTS);

    this.startDataOffset = this.endDataOffset;
    this.endDataOffset += this.SECTION1_LEFT_WALL_LIMIT;
    let leftSect1WallNFTS = issuerNFTS.slice(
      this.startDataOffset,
      this.endDataOffset
    );
    this.setSection1LeftWall(leftSect1WallNFTS);

    // this.startDataOffset = this.endDataOffset;
    // this.endDataOffset += this.SECTION1_FRONT_WALL_LIMIT;
    // let frontSec2tWallNFTS = issuerNFTS.slice(
    //   this.startDataOffset,
    //   this.endDataOffset
    // );
    // this.setSection2FrontWall(frontSec2tWallNFTS);

    this.startDataOffset = this.endDataOffset;
    this.endDataOffset += this.SECTION1_LEFT_WALL_LIMIT;
    let rightSect1WallNFTS = issuerNFTS.slice(
      this.startDataOffset,
      this.endDataOffset
    );
    this.setSection1RightWall(rightSect1WallNFTS);

    this.startDataOffset = this.endDataOffset;
    this.endDataOffset += this.SECTION1_FRONT_WALL_LIMIT;
    let backSect1WallNFTS = issuerNFTS.slice(
      this.startDataOffset,
      this.endDataOffset
    );
    this.setSection1BackWall(backSect1WallNFTS);

    //TODO: Load new nfts on blocks
    this.setBlocks(issuerNFTS);

    // console.log(issuerNFTS);
    // console.log(frontSec1tWallNFTS);
    // console.log(leftSec1tWallNFTS);
  },

  createArtFrame: function (props) {
    let boxEl = document.createElement("a-box");
    let position = props.position;
    let rotation = props.rotation || { x: 0, y: 0, z: 0 };
    boxEl.object3D.position.set(position.x, position.y, position.z);

    boxEl.object3D.rotation.set(
      THREE.MathUtils.degToRad(rotation.x || 0),
      THREE.MathUtils.degToRad(rotation.y || 0),
      THREE.MathUtils.degToRad(rotation.z || 0)
    );
    boxEl.setAttribute("color", "#E1E3E2");
    boxEl.setAttribute("width", this.frameWidth);

    //Add assets
    let nftImg = document.createElement("img");
    const nftImgId =
      "nftImg" + (document.getElementsByTagName("img").length + 1);
    nftImg.setAttribute("id", nftImgId); // Create a unique id for asset
    nftImg.setAttribute("src", props.src);
    nftImg.setAttribute("crossOrigin", "anonymous");
    document.getElementById("assets").appendChild(nftImg);

    let imageEl = document.createElement("a-image");
    imageEl.object3D.position.set(0, 0, -1);
    imageEl.setAttribute("src", "#" + nftImgId);
    //If rotation applied to parent box then rotate image back to it's original position
    imageEl.object3D.rotation.set(
      THREE.MathUtils.degToRad(rotation.x * 2 || 0),
      THREE.MathUtils.degToRad(rotation.y * 2 || 0),
      THREE.MathUtils.degToRad(rotation.z * 2 || 0)
    );

    // Set image element's height and width
    nftImg.onload = () => {
      let w = nftImg.naturalWidth;
      let h = nftImg.naturalHeight;
      let ratio = w / h;

      let newH = this.artWidth / ratio;
      imageEl.setAttribute("height", newH);
      imageEl.setAttribute("width", this.artWidth);

      boxEl.setAttribute("height", newH + this.framePadding);
    };

    boxEl.appendChild(imageEl);
    return boxEl;
  },

  setBlocks: async function (issuerNFTS) {
    const numberOfBlocks = 3;
    const blockSides = 4;
    let totalNFTS = numberOfBlocks * blockSides;

    this.startDataOffset = this.endDataOffset;
    this.endDataOffset += totalNFTS;

    console.log(this.startDataOffset, this.endDataOffset);
    let nfts = issuerNFTS.slice(this.startDataOffset, this.endDataOffset);

    let zF1 = 82.42;
    let zF2 = 65.24;
    let zF3 = 100.42;
    let zF4 = 82.19;

    for (let blockIndex = 0; blockIndex < nfts.length; blockIndex++) {
      let boxEl = null;
      let metaData = await getMetaData(nfts[blockIndex].metadata);
      if (blockIndex < 3) {
        //console.log(nfts[sideIndex]);
        boxEl = this.createArtFrame({
          position: { x: 24.76, y: 20.44, z: zF1 },
          rotation: { y: -90 },
          src: metaData.imageUrl,
        });
        zF1 -= 99;
      } else if (blockIndex >= 3 && blockIndex < 6) {
        boxEl = this.createArtFrame({
          position: { x: -1.52, y: 20.44, z: zF2 },
          src: metaData.imageUrl,
        });
        zF2 -= 99;
      } else if (blockIndex >= 6 && blockIndex < 9) {
        boxEl = this.createArtFrame({
          position: { x: -0.24, y: 20.44, z: zF3 },
          rotation: { y: 180 },
          src: metaData.imageUrl,
        });
        zF3 -= 99;
      } else if (blockIndex >= 9 && blockIndex < 12) {
        boxEl = this.createArtFrame({
          position: { x: -23.6, y: 20.44, z: zF4 },
          rotation: { y: 90 },
          src: metaData.imageUrl,
        });
        zF4 -= 99;
      }


      if (boxEl) {
        this.el.appendChild(boxEl);
      }
    }
  },

  setSection1FrontWall: async function (nfts) {
    let boxZPos = 143.93388;
    for (let i = 0; i < nfts.length; i++) {
      // console.log(nfts[i]);
      let metaData = await getMetaData(nfts[i].metadata);
      let boxEl = this.createArtFrame({
        position: { x: -264.82978, y: 39.87341, z: boxZPos },
        rotation: { y: -90 },
        src: metaData.imageUrl,
      });
      this.el.appendChild(boxEl);
      boxZPos -= this.frameWidth + this.DISTANCE_BETWEEN_FRAME;
    }
  },

  setSection1LeftWall: async function (nfts) {
    let boxXPos = -229.107;
    for (let i = 0; i < nfts.length; i++) {
      let metaData = await getMetaData(nfts[i].metadata);
      let boxEl = this.createArtFrame({
        position: { x: boxXPos, y: 39.87341, z: 161.6894 },
        src: metaData.imageUrl,
      });
      this.el.appendChild(boxEl);
      boxXPos += this.frameWidth + this.DISTANCE_BETWEEN_FRAME;
    }
  },

  // setSection2FrontWall: async function (nfts) {
  //   let boxZPos = -21;
  //   for (let i = 0; i < nfts.length; i++) {
  //     let metaData = await getMetaData(nfts[i].metadata);
  //     let boxEl = this.createArtFrame({
  //       position: { x: -264.82978, y: 39.87341, z: boxZPos },
  //       rotation: { y: -92.074 },
  //       src: metaData.imageUrl,
  //     });
  //     this.el.appendChild(boxEl);
  //     boxZPos -= this.frameWidth + this.DISTANCE_BETWEEN_FRAME;
  //   }
  // },

  setSection1RightWall: async function (nfts) {
    let boxXPos = -235;
    for (let i = 0; i < nfts.length; i++) {
      let metaData = await getMetaData(nfts[i].metadata);
      let boxEl = this.createArtFrame({
        position: { x: boxXPos, y: 39.87, z: -161 },
        rotation: { y: 180 },
        src: metaData.imageUrl,
      });
      this.el.appendChild(boxEl);
      boxXPos += this.frameWidth + this.DISTANCE_BETWEEN_FRAME;
    }
  },

  setSection1BackWall: async function (nfts) {
    let boxZPos = -135.6;
    for (let i = 0; i < nfts.length; i++) {
      let metaData = await getMetaData(nfts[i].metadata);
      let boxEl = this.createArtFrame({
        position: { x: 268, y: 39.87, z: boxZPos },
        rotation: { y: 90 },
        src: metaData.imageUrl,
      });
      this.el.appendChild(boxEl);
      boxZPos += this.frameWidth + this.DISTANCE_BETWEEN_FRAME;
    }
  },
});
