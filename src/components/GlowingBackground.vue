<!-- GlowingBackground.vue -->
<template>
  <div class="fullscreen-background">
    <canvas ref="canvas" class="glowing-canvas" @mousemove="mousemoveHandler"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null

// Configuration - Adjusted for fewer nodes and longer lines
const SENSITIVITY = 200 // Increased from 120 to 200 for longer connections
const SIBLINGS_LIMIT = 12 // Increased from 8 to 12 for more connections per node
const DENSITY = 120 // Increased from 60 to 120 for fewer nodes
const ANCHOR_LENGTH = 50 // Increased from 30 to 50 for wider movement range
const MOUSE_RADIUS = 300 // Increased from 250 to 300 for larger interaction area
const circ = 2 * Math.PI

// State
let nodes: Node[] = []
let NODES_QTY = 0
let mouse = { x: 0, y: 0 }

class Node {
  anchorX: number
  anchorY: number
  x: number
  y: number
  vx: number
  vy: number
  energy: number
  radius: number
  siblings: Node[]
  brightness: number

  constructor(x: number, y: number) {
    this.anchorX = x
    this.anchorY = y
    this.x = Math.random() * (x - (x - ANCHOR_LENGTH)) + (x - ANCHOR_LENGTH)
    this.y = Math.random() * (y - (y - ANCHOR_LENGTH)) + (y - ANCHOR_LENGTH)
    this.vx = Math.random() * 2 - 1
    this.vy = Math.random() * 2 - 1
    this.energy = Math.random() * 100
    this.radius = Math.random() * 3 // Increased from 2 to 3 for better visibility with fewer nodes
    this.siblings = []
    this.brightness = 0
  }

  drawNode() {
    if (!ctx) return
    const color = `rgba(56, 189, 248, ${this.brightness * 0.5})` // Increased from 0.4 to 0.5
    ctx.beginPath()
    ctx.arc(
      this.x,
      this.y,
      2 * this.radius + (3 * this.siblings.length) / SIBLINGS_LIMIT, // Increased multiplier from 2 to 3
      0,
      circ
    )
    ctx.fillStyle = color
    ctx.fill()
  }

  drawConnections() {
    if (!ctx) return
    for (let i = 0; i < this.siblings.length; i++) {
      const color = `rgba(56, 189, 248, ${this.brightness * 0.25})` // Increased from 0.2 to 0.25
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.siblings[i].x, this.siblings[i].y)
      ctx.lineWidth = (1 - calcDistance(this, this.siblings[i]) / SENSITIVITY) * 1.2 // Increased from 0.8 to 1.2
      ctx.strokeStyle = color
      ctx.stroke()
    }
  }

  moveNode() {
    this.energy -= 0.5
    if (this.energy < 1) {
      this.energy = Math.random() * 100
      if (this.x - this.anchorX < -ANCHOR_LENGTH) {
        this.vx = Math.random() * 0.5
      } else if (this.x - this.anchorX > ANCHOR_LENGTH) {
        this.vx = Math.random() * -0.5
      } else {
        this.vx = Math.random() * 1 - 0.5
      }
      if (this.y - this.anchorY < -ANCHOR_LENGTH) {
        this.vy = Math.random() * 0.5
      } else if (this.y - this.anchorY > ANCHOR_LENGTH) {
        this.vy = Math.random() * -0.5
      } else {
        this.vy = Math.random() * 1 - 0.5
      }
    }
    this.x += (this.vx * this.energy) / 200
    this.y += (this.vy * this.energy) / 200
  }
}

function calcDistance(node1: Node, node2: Node) {
  return Math.sqrt(
    Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
  )
}

function initNodes() {
  if (!canvas.value || !ctx) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  nodes = []
  NODES_QTY = 0
  for (let i = DENSITY; i < canvas.value.width; i += DENSITY) {
    for (let j = DENSITY; j < canvas.value.height; j += DENSITY) {
      nodes.push(new Node(i, j))
      NODES_QTY++
    }
  }
}

function findSiblings() {
  let node1: Node, node2: Node, distance: number
  for (let i = 0; i < NODES_QTY; i++) {
    node1 = nodes[i]
    node1.siblings = []
    for (let j = 0; j < NODES_QTY; j++) {
      node2 = nodes[j]
      if (node1 !== node2) {
        distance = calcDistance(node1, node2)
        if (distance < SENSITIVITY) {
          if (node1.siblings.length < SIBLINGS_LIMIT) {
            node1.siblings.push(node2)
          } else {
            let node_sibling_distance = 0
            let max_distance = 0
            let s = 0
            for (let k = 0; k < SIBLINGS_LIMIT; k++) {
              node_sibling_distance = calcDistance(node1, node1.siblings[k])
              if (node_sibling_distance > max_distance) {
                max_distance = node_sibling_distance
                s = k
              }
            }
            if (distance < max_distance) {
              node1.siblings.splice(s, 1)
              node1.siblings.push(node2)
            }
          }
        }
      }
    }
  }
}

function redrawScene() {
  if (!canvas.value || !ctx) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  findSiblings()

  for (let i = 0; i < NODES_QTY; i++) {
    const node = nodes[i]
    const distance = calcDistance(
      {
        x: mouse.x,
        y: mouse.y,
      } as Node,
      node
    )
    if (distance < MOUSE_RADIUS) {
      node.brightness = 1 - distance / MOUSE_RADIUS
    } else {
      node.brightness = 0
    }
  }

  for (let i = 0; i < NODES_QTY; i++) {
    const node = nodes[i]
    if (node.brightness) {
      node.drawNode()
      node.drawConnections()
    }
    node.moveNode()
  }

  animationFrame = requestAnimationFrame(redrawScene)
}

function resizeCanvas() {
  if (!canvas.value) return
  
  // Get the container dimensions
  const container = canvas.value.parentElement
  if (!container) return
  
  // Set canvas size to match container
  canvas.value.width = container.clientWidth
  canvas.value.height = container.clientHeight
  
  // Reinitialize nodes when canvas is resized
  initNodes()
}

// Add resize observer
let resizeObserver: ResizeObserver | null = null

function mousemoveHandler(e: MouseEvent) {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  if (!ctx) {
    console.error('Canvas context not supported')
    return
  }

  // Initial setup
  resizeCanvas()
  
  // Set up resize observer
  const container = canvas.value.parentElement
  if (container) {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(container)
  }

  // Event listeners
  window.addEventListener('resize', resizeCanvas)

  // Set initial mouse position to center of canvas
  const rect = canvas.value.getBoundingClientRect()
  mouse = {
    x: rect.width / 2,
    y: rect.height / 2,
  }

  initNodes()
  redrawScene()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
.fullscreen-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background-color: #0f1729;
  overflow: hidden;
}

.glowing-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: none;
}
</style> 