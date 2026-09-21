import Phaser from 'phaser'

const config = {
  type: Phaser.AUTO,

  width: 960,
  height: 540,

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
      debug: true
    }
  },

  scene: {
    create() {
      // SANTO
      this.santo = this.add.rectangle(
        200,
        400,
        40,
        60,
        0x8b4513
      )

      this.physics.add.existing(this.santo)

      this.santo.body.setCollideWorldBounds(true)
      this.santo.setDepth(10)

      // SUELO
      const suelo = this.add.rectangle(
        1500,
        500,
        3000,
        40,
        0x654321
      )

      this.physics.add.existing(suelo, true)

      this.physics.add.collider(this.santo, suelo)

      // PLATAFORMA
      const plataforma = this.add.rectangle(
        600,
        400,
        180,
        30,
        0x6b4f2a
      )

      this.physics.add.existing(plataforma, true)

      this.physics.add.collider(this.santo, plataforma)

      // ÁRBOLES
      for (let i = 0; i < 10; i++) {
        const posicionX = Phaser.Math.Between(
          700 + i * 180,
          850 + i * 180
        )

        crearArbol(this, posicionX, 480)
      }

      // CÁMARA
      this.cameras.main.startFollow(this.santo)

      this.cameras.main.setBounds(
        0,
        0,
        3000,
        540
      )

      // LÍMITES DEL MUNDO
      this.physics.world.setBounds(
        0,
        0,
        3000,
        540
      )

      // CONTROLES
      this.teclaEspacio = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      )

      this.teclas = this.input.keyboard.createCursorKeys()
    },

    update() {
      // MOVIMIENTO HORIZONTAL
      if (this.teclas.left.isDown) {
        this.santo.body.setVelocityX(-200)
      } else if (this.teclas.right.isDown) {
        this.santo.body.setVelocityX(200)
      } else {
        this.santo.body.setVelocityX(0)
      }

      // SALTO
      if (Phaser.Input.Keyboard.JustDown(this.teclaEspacio)) {
        this.santo.body.setVelocityY(-600)
      }
    }
  }
}


// FUNCIÓN PARA CREAR ÁRBOLES
function crearArbol(escena, posH, posV) {
  const alturaTronco = 60
  const alturaCopa = 80

  // TRONCO
  const tronco = escena.add.rectangle(
    posH,
    posV - alturaTronco / 2,
    20,
    alturaTronco,
    0x654321
  )

  // COPA
  const copa = escena.add.rectangle(
    posH,
    posV - alturaTronco - alturaCopa / 2,
    60,
    alturaCopa,
    0x90ee90
  )

  return {
    tronco,
    copa
  }
}


// CREAR JUEGO
const game = new Phaser.Game(config)