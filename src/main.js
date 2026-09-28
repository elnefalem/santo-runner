
import Phaser from 'phaser';
import santoSheet from './assets/santo-walk.png';
import sueloTexture from './assets/suelo_plataforma.png';

const config = {
  type: Phaser.AUTO,

  width: 960,
  height: 540,

  pixelArt: false,

  render: {
    antialias: true,
    roundPixels: false
  },

  backgroundColor: '#87CEEB',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 1000
      },
      debug: false
    }
  },

  scene: {
    preload,
    create,
    update
  }
};

// CARGA DE RECURSOS
function preload() {
  this.load.spritesheet('santo', santoSheet, {
    frameWidth: 256,
    frameHeight: 350
  });

  this.load.image('suelo', sueloTexture);
}

// INICIALIZACIÓN DE LA ESCENA
function create() {
  // MUNDO
  this.physics.world.setBounds(0, 0, 3000, 540);

  // SUELO VISUAL
const sueloVisual = this.add.tileSprite(
  1500,
  510,
  3000,
  120,
  'suelo'
);

sueloVisual.setTileScale(0.35, 0.35);

// SUELO FÍSICO INVISIBLE
const suelo = this.add.rectangle(
  1500,
  470,
  3000,
  40
);

this.physics.add.existing(suelo, true);
this.physics.add.collider(this.santo, suelo);

  // SANTO
  this.santo = this.physics.add.sprite(
    200,
    420,
    'santo'
  );

  this.santo.setDepth(10);
  this.santo.setScale(0.5);
  this.santo.setOrigin(0.5, 0.5);
  this.santo.setBodySize(100, 350, true);
  this.santo.setCollideWorldBounds(true);

  // ANIMACIÓN DE CAMINAR
  this.anims.create({
    key: 'caminar',
    frames: this.anims.generateFrameNumbers('santo', {
      start: 0,
      end: 5
    }),
    frameRate: 8,
    repeat: -1
  });

  // COLISIONES
  this.physics.add.collider(this.santo, suelo);

  // PLATAFORMA
  const plataforma = this.add.rectangle(
    600,
    400,
    180,
    30,
    0x6b4f2a
  );

  plataforma.setDepth(2);
  this.physics.add.existing(plataforma, true);

  this.physics.add.collider(this.santo, plataforma);

  // ÁRBOLES PROVISIONALES
  for (let i = 0; i < 10; i++) {
    const posicionX = Phaser.Math.Between(
      700 + i * 180,
      850 + i * 180
    );

    const escala = Phaser.Math.FloatBetween(0.7, 1.4);

    crearArbol(this, posicionX, 485, escala);
  }

  // CÁMARA
  this.cameras.main.setBounds(0, 0, 3000, 540);
  this.cameras.main.startFollow(this.santo);

  // CONTROLES
  this.teclas = this.input.keyboard.createCursorKeys();
}

// BUCLE PRINCIPAL
function update() {
  if (this.teclas.left.isDown) {
    this.santo.body.setVelocityX(-200);
    this.santo.setFlipX(true);
    this.santo.anims.play('caminar', true);

  } else if (this.teclas.right.isDown) {
    this.santo.body.setVelocityX(200);
    this.santo.setFlipX(false);
    this.santo.anims.play('caminar', true);

  } else {
    this.santo.body.setVelocityX(0);
    this.santo.anims.stop();
    this.santo.setFrame(0);
  }
}

// ÁRBOLES PROVISIONALES
function crearArbol(escena, posH, posV, escala = 1) {
  const alturaTronco = 60 * escala;
  const alturaCopa = 80 * escala;

  const anchoTronco = 20 * escala;
  const anchoCopa = 60 * escala;

  const tronco = escena.add.rectangle(
    posH,
    posV - alturaTronco / 2,
    anchoTronco,
    alturaTronco,
    0x654321
  );

  const copa = escena.add.rectangle(
    posH,
    posV - alturaTronco - alturaCopa / 2,
    anchoCopa,
    alturaCopa,
    0x90ee90
  );

  tronco.setDepth(2);
  copa.setDepth(2);

  return { tronco, copa };
}

// CREAR JUEGO
const game = new Phaser.Game(config);