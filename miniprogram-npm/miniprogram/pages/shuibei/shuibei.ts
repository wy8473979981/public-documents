import { createScopedThreejs } from 'threejs-miniprogram'

Page({
  onReady() {
    wx.createSelectorQuery()
      .select('#webgl')
      .node()
      .exec((res) => {
        const canvas = res[0].node
        const THREE = createScopedThreejs(canvas)

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        renderer.setSize(canvas.width, canvas.height)
        renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 100)
        camera.position.set(0, 1, 3)

        // 添加光源
        const light = new THREE.PointLight(0xffffff, 1.5, 10)
        light.position.set(2, 3, 2)
        scene.add(light)
        scene.add(new THREE.AmbientLight(0x404040))

        // 杯子轮廓
        const points = [
          new THREE.Vector2(0.2, 0),  // 杯底
          new THREE.Vector2(0.3, 0.05),
          new THREE.Vector2(0.15, 0.8), // 杯杆
          new THREE.Vector2(0.4, 1.2), // 杯身底部
          new THREE.Vector2(0.45, 1.3),
          new THREE.Vector2(0.48, 1.35), // 杯口
          new THREE.Vector2(0.05, 1.38) // 杯口边缘
        ]

        // 玻璃材质
        const glassMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.05,
          metalness: 0.1,
          roughness: 0.1,
          transmission: 0.95, // 玻璃折射
          ior: 1.52
        })

        // 创建酒杯
        const cup = new THREE.Mesh(new THREE.LatheGeometry(points, 64), glassMaterial)
        scene.add(cup)

        // 创建红酒液体
        const wineGeometry = new THREE.CylinderGeometry(0.4, 0.35, 0.3, 32)
        const wineMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x880000, // 红酒颜色
          transparent: true,
          opacity: 0.8,
          metalness: 0.2,
          roughness: 0.15
        })
        const wine = new THREE.Mesh(wineGeometry, wineMaterial)
        wine.position.y = 1.1 // 使红酒位于杯身内
        scene.add(wine)

        // 动画循环
        function animate() {
          cup.rotation.y += 0.005
          wine.rotation.y += 0.005
          renderer.render(scene, camera)
          canvas.requestAnimationFrame(animate)
        }
        animate()
      })
  }
})
