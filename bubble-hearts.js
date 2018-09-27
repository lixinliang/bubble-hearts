import random from './random.js'

const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || ((fn) => setTimeout(fn, 16))

/**
 * Create a default Render
 * @param  {Canvas} canvas canvas
 * @param  {Context} context context
 * @return {Function} handler
 */
function createRender (image, canvas, context) {
  const zoomInStage = random.uniformDiscrete(89, 91) / 100
  const zoomInRest = 1 - zoomInStage
  const basicScale = (random.uniformDiscrete(45, 60) + random.uniformDiscrete(45, 60)) / 100
  let getScale = (lifespan) => {
    if (lifespan > zoomInStage) {
      return Math.max(((1 - lifespan) / zoomInRest).toFixed(2), 0.1) * basicScale
    } else {
      return basicScale
    }
  }

  const basicRotate = random.uniformDiscrete(-30, 30)
  let getRotate = (lifespan) => {
    return basicRotate
  }

  const offset = 10
  const basicTranslateX = canvas.width / 2 + random.uniformDiscrete(-offset, offset)
  const amplitude = (canvas.width - Math.sqrt(Math.pow(image.width, 2) + Math.pow(image.height, 2))) / 2 - offset
  const wave = random.uniformDiscrete(amplitude * 0.8, amplitude) * (random.uniformDiscrete(0, 1) ? 1 : -1)
  const frequency = random.uniformDiscrete(250, 400)
  let getTranslateX = (lifespan) => {
    if (lifespan > zoomInStage) {
      return basicTranslateX
    } else {
      return basicTranslateX + wave * Math.sin(frequency * (zoomInStage - lifespan) * Math.PI / 180)
    }
  }

  let getTranslateY = (lifespan) => {
    return image.height / 2 + (canvas.height - image.height / 2) * lifespan
  }

  const fadeOutStage = random.uniformDiscrete(14, 18) / 100
  let getAlpha = (lifespan) => {
    if (lifespan > fadeOutStage) {
      return 1
    } else {
      return 1 - ((fadeOutStage - lifespan) / fadeOutStage).toFixed(2)
    }
  }

  return (lifespan) => {
    if (lifespan >= 0) {
      context.save()
      let scale = getScale(lifespan)
      let rotate = getRotate(lifespan)
      let translateX = getTranslateX(lifespan)
      let translateY = getTranslateY(lifespan)
      context.translate(translateX, translateY)
      context.scale(scale, scale)
      context.rotate(rotate * Math.PI / 180)
      context.globalAlpha = getAlpha(lifespan)
      context.drawImage(
        image,
        -image.width / 2,
        -image.height / 2,
        image.width,
        image.height
      )
      context.restore()
    } else {
      return true
    }
  }
}

class BubbleHearts {
  /**
     * Init a stage
     * @return {BubbleHearts} this
     */
  constructor () {
    let canvas = this.canvas = document.createElement('canvas')
    let context = this.context = canvas.getContext('2d')
    let children = this._children = []
    let animate = () => {
      requestAnimationFrame(animate)
      context.clearRect(0, 0, canvas.width, canvas.height)
      let index = 0
      let length = children.length
      while (index < length) {
        let child = children[index]
        if (child.render.call(null, (child.timestamp + child.duration - new Date()) / child.duration)) {
          // pop it
          children.splice(index, 1)
          length--
        } else {
          // continue
          index++
        }
      }
    }
    requestAnimationFrame(animate)
  }

  /**
     * Create a bubble heart animation on stage
     * @param  {Image} image heart e.g.
     * @param  {Number} duration lifespan
     * @param  {Function} render handler
     * @return {BubbleHearts} this
     */
  bubble (image, duration = random.uniformDiscrete(2400, 3600), render = createRender(image, this.canvas, this.context)) {
    this._children.push({
      render,
      duration,
      timestamp: +new Date()
    })
    return this
  }
}

export default BubbleHearts
