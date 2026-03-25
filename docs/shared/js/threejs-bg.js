/**
 * Cyber-Taoist — Three.js Background Animation
 * Wireframe geometries with mouse parallax, scheme-aware colors.
 * Based on js-clawhub/src/shared/js/threejs-bg.js
 */

let _threeMaterial, _threeGridMaterial;

function initThreeJS(containerId) {
    const container = document.getElementById(containerId || 'canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    _threeMaterial = material;

    const mesh1 = new THREE.Mesh(new THREE.IcosahedronGeometry(8, 0), material);
    mesh1.position.x = -15;
    group.add(mesh1);

    const mesh2 = new THREE.Mesh(new THREE.TorusKnotGeometry(5, 1.5, 64, 8), material);
    mesh2.position.x = 15;
    group.add(mesh2);

    const gridHelper = new THREE.GridHelper(100, 20, 0x000000, 0x000000);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -10;
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    _threeGridMaterial = gridHelper.material;
    scene.add(gridHelper);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        mesh1.rotation.x += 0.005;
        mesh1.rotation.y += 0.005;
        mesh2.rotation.x -= 0.005;
        mesh2.rotation.y -= 0.005;
        gridHelper.rotation.z += 0.001;
        group.rotation.y = mouseX * 0.2;
        group.rotation.x = mouseY * 0.2;
        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function setThreeScheme(scheme) {
    const wireColor = scheme === 'dark' ? 0xFCD228 : 0x000000;
    if (_threeMaterial) _threeMaterial.color.setHex(wireColor);
    if (_threeGridMaterial) _threeGridMaterial.color.setHex(wireColor);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('canvas-container')) {
        initThreeJS();
        const currentScheme = document.documentElement.getAttribute('data-scheme') || 'dark';
        setThreeScheme(currentScheme);
    }
});
