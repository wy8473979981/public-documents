import { createScopedThreejs } from 'threejs-miniprogram';

Page({
  onReady() {
    wx.createSelectorQuery()
      .select('#webgl')
      .node()
      .exec((res) => {
        const canvas = res[0].node;
        const THREE = createScopedThreejs(canvas);
        
        // 1. 初始化基础Three.js组件
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          canvas.width / canvas.height,
          0.1,
          1000
        );
        
        // 2. 创建WebGL渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true
        });
        renderer.setSize(canvas.width, canvas.height);

        // 3. 创建立方体
        const geometry = new THREE.BoxGeometry(2, 2, 2); // 边长为2的立方体
        const material = new THREE.MeshNormalMaterial(); // 使用法向材质
        const cube = new THREE.Mesh(geometry, material);
        
        // 4. 设置相机位置
        camera.position.z = 5;

        // 5. 将立方体加入场景
        scene.add(cube);

        // 6. 动画循环
        const animate = () => {
          // 使用小程序canvas请求动画帧
          canvas.requestAnimationFrame(animate);

          // 立方体旋转动画
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          // 渲染场景
          renderer.render(scene, camera);
        };

        // 启动动画
        animate();
      });
  }
});