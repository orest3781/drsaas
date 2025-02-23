<!-- KioskBackground.vue -->
<template>
  <div class="kiosk-background">
    <canvas ref="canvas" class="nodes-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null

// Configuration
const SENSITIVITY = 100
const SIBLINGS_LIMIT = 10
const DENSITY = 50
const NODES_QTY = 0
const ANCHOR_LENGTH = 20
const MOUSE_RADIUS = 200
const circ = 2 * Math.PI
let nodes: Node[] = []
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
    this.radius = Math.random()
    this.siblings = []
    this.brightness = 0
  }

  drawNode() {
    if (!ctx) return
    const color = `rgba(56, 189, 248, ${this.brightness})`
    ctx.beginPath()
    ctx.arc(
      this.x,
      this.y,
      2 * this.radius + (2 * this.siblings.length) / SIBLINGS_LIMIT,
      0,
      circ
    )
    ctx.fillStyle = color
    ctx.fill()
  }

  drawConnections() {
    if (!ctx) return
    for (let i = 0; i < this.siblings.length; i++) {
      const color = `rgba(56, 189, 248, ${this.brightness * 0.5})`
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.siblings[i].x, this.siblings[i].y)
      ctx.lineWidth = 1 - calcDistance(this, this.siblings[i]) / SENSITIVITY
      ctx.strokeStyle = color
      ctx.stroke()
    }
  }

  moveNode() {
    this.energy -= 2
    if (this.energy < 1) {
      this.energy = Math.random() * 100
      if (this.x - this.anchorX < -ANCHOR_LENGTH) {
        this.vx = Math.random() * 2
      } else if (this.x - this.anchorX > ANCHOR_LENGTH) {
        this.vx = Math.random() * -2
      } else {
        this.vx = Math.random() * 4 - 2
      }
      if (this.y - this.anchorY < -ANCHOR_LENGTH) {
        this.vy = Math.random() * 2
      } else if (this.y - this.anchorY > ANCHOR_LENGTH) {
        this.vy = Math.random() * -2
      } else {
        this.vy = Math.random() * 4 - 2
      }
    }
    this.x += (this.vx * this.energy) / 100
    this.y += (this.vy * this.energy) / 100
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
  let nodesQty = 0
  for (let i = DENSITY; i < canvas.value.width; i += DENSITY) {
    for (let j = DENSITY; j < canvas.value.height; j += DENSITY) {
      nodes.push(new Node(i, j))
      nodesQty++
    }
  }
  return nodesQty
}

function findSiblings() {
  let node1: Node, node2: Node, distance: number
  for (let i = 0; i < nodes.length; i++) {
    node1 = nodes[i]
    node1.siblings = []
    for (let j = 0; j < nodes.length; j++) {
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

  for (let i = 0; i < nodes.length; i++) {
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

  for (let i = 0; i < nodes.length; i++) {
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
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initNodes()
}

function mousemoveHandler(e: MouseEvent) {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  if (!ctx) return

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  canvas.value.addEventListener('mousemove', mousemoveHandler)
  
  // Set initial mouse position to center
  mouse = {
    x: canvas.value.width / 2,
    y: canvas.value.height / 2
  }

  redrawScene()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (canvas.value) {
    canvas.value.removeEventListener('mousemove', mousemoveHandler)
  }
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.kiosk-background {
  @apply fixed inset-0 z-0;
  background: #0f1729;
}

.nodes-canvas {
  @apply w-full h-full;
}
</style> 