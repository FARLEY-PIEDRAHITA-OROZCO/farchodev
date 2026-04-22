import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

// Isometric Hacker Room built in pure Three.js (no JSX primitives to avoid
// the visual-edits babel plugin conflict with R3F).
// Clicking the desk lamp toggles day/night across the entire page.
export default function HackerRoom() {
  const mountRef = useRef(null);
  const { theme, toggle } = useTheme();
  const themeRef = useRef(theme);
  const targetsRef = useRef(null);

  // Keep themeRef current so animation loop reads latest value
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ---------- Setup ----------
    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    // Isometric-ish orthographic camera
    const aspect = width / height;
    const viewSize = 5.2;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      0.1,
      100
    );
    camera.position.set(9, 8, 9);
    camera.lookAt(0, 1.3, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    // ---------- Lights ----------
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    // Directional "window" light — color/intensity lerps between day/night
    const windowLight = new THREE.DirectionalLight(0xffffff, 0.8);
    windowLight.position.set(-6, 8, -4);
    windowLight.castShadow = true;
    windowLight.shadow.mapSize.set(1024, 1024);
    windowLight.shadow.camera.left = -6;
    windowLight.shadow.camera.right = 6;
    windowLight.shadow.camera.top = 6;
    windowLight.shadow.camera.bottom = -6;
    scene.add(windowLight);

    // Warm lamp point light (the interactive element)
    const lampLight = new THREE.PointLight(0xffb347, 0, 7, 2);
    lampLight.position.set(1.9, 2.3, -0.6);
    lampLight.castShadow = true;
    lampLight.shadow.mapSize.set(512, 512);
    scene.add(lampLight);

    // Monitor cyan glow
    const monitorLight = new THREE.PointLight(0x22d3ee, 0.6, 4, 2);
    monitorLight.position.set(-1.3, 2.1, -0.2);
    scene.add(monitorLight);

    // ---------- Materials ----------
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a1f2e,
      roughness: 0.85,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x202635,
      roughness: 0.9,
    });
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x2f3a52,
      roughness: 0.7,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x3d4863,
      metalness: 0.7,
      roughness: 0.35,
    });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0a1525 });
    const screenGlowMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.9,
    });
    const lampShadeMat = new THREE.MeshStandardMaterial({
      color: 0xd97757,
      emissive: 0xff8855,
      emissiveIntensity: 0,
      roughness: 0.5,
    });
    const chairMat = new THREE.MeshStandardMaterial({
      color: 0x1a1f30,
      roughness: 0.8,
    });
    const plantPotMat = new THREE.MeshStandardMaterial({
      color: 0x3b2f2a,
      roughness: 0.9,
    });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.7,
    });
    const bookMats = [
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.7 }),
    ];
    const mugMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.4,
    });

    // ---------- Room geometry ----------
    // Floor
    const floorGeo = new THREE.BoxGeometry(8, 0.2, 6);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Back wall
    const backWallGeo = new THREE.BoxGeometry(8, 5, 0.2);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2.5, -3);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall
    const leftWallGeo = new THREE.BoxGeometry(0.2, 5, 6);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-4, 2.5, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Window frame on back wall
    const windowFrameGeo = new THREE.BoxGeometry(3.2, 2.2, 0.15);
    const windowFrame = new THREE.Mesh(windowFrameGeo, metalMat);
    windowFrame.position.set(-0.5, 3, -2.88);
    scene.add(windowFrame);

    // Sky panel behind window (color changes with theme)
    const skyGeo = new THREE.PlaneGeometry(3, 2);
    const skyMat = new THREE.MeshBasicMaterial({ color: 0x0a1025 });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.position.set(-0.5, 3, -2.95);
    scene.add(sky);

    // Window cross bars
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x2a3245,
      roughness: 0.6,
    });
    const barH = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.08, 0.05),
      barMat
    );
    barH.position.set(-0.5, 3, -2.86);
    scene.add(barH);
    const barV = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.2, 0.05),
      barMat
    );
    barV.position.set(-0.5, 3, -2.86);
    scene.add(barV);

    // Tiny moon / sun on sky
    const celestialGeo = new THREE.CircleGeometry(0.28, 32);
    const celestialMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const celestial = new THREE.Mesh(celestialGeo, celestialMat);
    celestial.position.set(0.6, 3.6, -2.93);
    scene.add(celestial);

    // Stars (visible at night)
    const STAR_COUNT = 60;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 3 - 0.5;
      starPositions[i * 3 + 1] = 2 + Math.random() * 2;
      starPositions[i * 3 + 2] = -2.9;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    const starMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      sizeAttenuation: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ---------- Desk ----------
    const deskGroup = new THREE.Group();
    // Top
    const deskTopGeo = new THREE.BoxGeometry(5, 0.12, 1.6);
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.set(0, 1.2, -1);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);
    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, 1.2, 0.1);
    [
      [-2.3, 0.6, -0.3],
      [2.3, 0.6, -0.3],
      [-2.3, 0.6, -1.7],
      [2.3, 0.6, -1.7],
    ].forEach((pos) => {
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      deskGroup.add(leg);
    });
    scene.add(deskGroup);

    // ---------- Monitor ----------
    const monitorGroup = new THREE.Group();
    // Stand base
    const monStand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.3, 0.08, 24),
      metalMat
    );
    monStand.position.set(-1.3, 1.3, -1);
    monitorGroup.add(monStand);
    const monNeck = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.5, 0.08),
      metalMat
    );
    monNeck.position.set(-1.3, 1.58, -1);
    monitorGroup.add(monNeck);
    // Back of monitor
    const monBack = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.3, 0.12),
      metalMat
    );
    monBack.position.set(-1.3, 2.3, -1.08);
    monBack.castShadow = true;
    monitorGroup.add(monBack);
    // Screen
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.05, 1.15),
      screenGlowMat
    );
    screen.position.set(-1.3, 2.3, -1);
    monitorGroup.add(screen);
    scene.add(monitorGroup);

    // Screen "code" lines (small horizontal planes on screen)
    const codeLines = [];
    const lineGeoSmall = new THREE.PlaneGeometry(0.9, 0.05);
    const lineMatA = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.95,
    });
    const lineMatB = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.85,
    });
    for (let i = 0; i < 6; i++) {
      const w = 0.5 + Math.random() * 1.2;
      const g = new THREE.PlaneGeometry(w, 0.05);
      const m = i % 2 === 0 ? lineMatA.clone() : lineMatB.clone();
      const line = new THREE.Mesh(g, m);
      line.position.set(
        -1.3 - (1.0 - w) * 0.5,
        2.3 + 0.4 - i * 0.16,
        -0.995
      );
      codeLines.push(line);
      scene.add(line);
    }

    // ---------- Laptop ----------
    const laptopGroup = new THREE.Group();
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.06, 0.8),
      metalMat
    );
    laptopBase.position.set(0.7, 1.29, -0.6);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);
    // Screen tilted
    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.75, 0.04),
      metalMat
    );
    laptopScreen.position.set(0.7, 1.65, -0.98);
    laptopScreen.rotation.x = -0.35;
    laptopScreen.castShadow = true;
    laptopGroup.add(laptopScreen);
    // Glowing display
    const laptopDisp = new THREE.Mesh(
      new THREE.PlaneGeometry(1.05, 0.62),
      screenGlowMat
    );
    laptopDisp.position.set(0.7, 1.65, -0.96);
    laptopDisp.rotation.x = -0.35;
    laptopGroup.add(laptopDisp);
    scene.add(laptopGroup);

    // ---------- Desk lamp (CLICKABLE) ----------
    const lampGroup = new THREE.Group();
    lampGroup.name = "lamp";
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 0.1, 24),
      metalMat
    );
    lampBase.position.set(1.9, 1.31, -0.6);
    lampBase.castShadow = true;
    lampBase.userData.isLamp = true;
    lampGroup.add(lampBase);
    // Arm (angled)
    const lampArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.1, 16),
      metalMat
    );
    lampArm.position.set(1.9, 1.85, -0.6);
    lampArm.rotation.z = 0.35;
    lampArm.userData.isLamp = true;
    lampGroup.add(lampArm);
    // Second segment
    const lampArm2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.7, 16),
      metalMat
    );
    lampArm2.position.set(2.1, 2.3, -0.6);
    lampArm2.rotation.z = -0.8;
    lampArm2.userData.isLamp = true;
    lampGroup.add(lampArm2);
    // Shade (cone)
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.32, 0.45, 24, 1, true),
      lampShadeMat
    );
    lampShade.position.set(1.85, 2.5, -0.6);
    lampShade.rotation.z = -0.9;
    lampShade.castShadow = true;
    lampShade.userData.isLamp = true;
    lampGroup.add(lampShade);
    // Bulb (small sphere glow)
    const bulbMat = new THREE.MeshBasicMaterial({
      color: 0xfff0b0,
      transparent: true,
      opacity: 0,
    });
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      bulbMat
    );
    bulb.position.set(1.72, 2.35, -0.6);
    bulb.userData.isLamp = true;
    lampGroup.add(bulb);
    scene.add(lampGroup);

    // ---------- Chair ----------
    const chairGroup = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.2), chairMat);
    seat.position.set(0, 0.9, 1);
    seat.castShadow = true;
    chairGroup.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.1), chairMat);
    back.position.set(0, 1.55, 1.55);
    back.castShadow = true;
    chairGroup.add(back);
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.85, 12),
      metalMat
    );
    pillar.position.set(0, 0.42, 1);
    chairGroup.add(pillar);
    const chairBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 0.08, 5),
      metalMat
    );
    chairBase.position.set(0, 0.04, 1);
    chairGroup.add(chairBase);
    scene.add(chairGroup);

    // ---------- Plant in corner ----------
    const plantGroup = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.22, 0.5, 16),
      plantPotMat
    );
    pot.position.set(-3, 0.25, -2);
    pot.castShadow = true;
    plantGroup.add(pot);
    // Foliage: a few spheres overlapped
    for (let i = 0; i < 5; i++) {
      const r = 0.22 + Math.random() * 0.12;
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(r, 12, 12),
        leafMat
      );
      leaf.position.set(
        -3 + (Math.random() - 0.5) * 0.35,
        0.7 + Math.random() * 0.35,
        -2 + (Math.random() - 0.5) * 0.35
      );
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }
    scene.add(plantGroup);

    // ---------- Books (stacked) ----------
    const booksGroup = new THREE.Group();
    bookMats.forEach((m, i) => {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.12, 0.55),
        m
      );
      book.position.set(-2.3, 1.34 + i * 0.13, -1.1 + i * 0.05);
      book.rotation.y = i * 0.08;
      book.castShadow = true;
      booksGroup.add(book);
    });
    scene.add(booksGroup);

    // ---------- Coffee mug ----------
    const mugGroup = new THREE.Group();
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.16, 0.32, 20),
      mugMat
    );
    mug.position.set(-0.1, 1.45, -0.55);
    mug.castShadow = true;
    mugGroup.add(mug);
    // Handle
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.025, 8, 20, Math.PI),
      mugMat
    );
    handle.position.set(0.08, 1.45, -0.55);
    handle.rotation.y = -Math.PI / 2;
    mugGroup.add(handle);
    // Coffee surface
    const coffeeMat = new THREE.MeshBasicMaterial({ color: 0x3b2415 });
    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(0.17, 20),
      coffeeMat
    );
    coffee.position.set(-0.1, 1.61, -0.55);
    coffee.rotation.x = -Math.PI / 2;
    mugGroup.add(coffee);
    scene.add(mugGroup);

    // ---------- Floating code particles ----------
    const PARTICLE_COUNT = 40;
    const particles = [];
    const particleGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.7,
    });
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      const ox = (Math.random() - 0.5) * 6;
      const oy = 1 + Math.random() * 3.5;
      const oz = (Math.random() - 0.5) * 3 - 0.5;
      p.position.set(ox, oy, oz);
      p.userData = { ox, oy, oz, speed: 0.2 + Math.random() * 0.8 };
      particles.push(p);
      scene.add(p);
    }

    // Pointer-light indicator orbiting lamp (hover hint)
    const hintGeo = new THREE.RingGeometry(0.45, 0.5, 32);
    const hintMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const hintRing = new THREE.Mesh(hintGeo, hintMat);
    hintRing.position.set(1.85, 2.5, -0.6);
    hintRing.rotation.x = -Math.PI / 2;
    scene.add(hintRing);

    // ---------- Raycaster for lamp click ----------
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const lampHitList = [lampBase, lampArm, lampArm2, lampShade, bulb];

    const onPointerMove = (ev) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(lampHitList, false);
      renderer.domElement.style.cursor = hits.length > 0 ? "pointer" : "default";
    };
    const onPointerDown = (ev) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(lampHitList, false);
      if (hits.length > 0) {
        toggle();
      }
    };
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // ---------- Theme targets ----------
    // Two palettes; current values lerp toward targets each frame.
    const state = {
      lamp: themeRef.current === "night" ? 1 : 0, // 1 = on, 0 = off
      ambient: 0.3,
      winI: 0.8,
      winC: new THREE.Color(0xffffff),
      skyC: new THREE.Color(0x0a1025),
      wallC: new THREE.Color(0x202635),
      floorC: new THREE.Color(0x1a1f2e),
      starOp: 1,
      celestialC: new THREE.Color(0xffffff),
    };

    const getTargets = (t) => {
      if (t === "day") {
        return {
          lamp: 0,
          ambient: 0.85,
          winI: 1.5,
          winC: new THREE.Color(0xfff4d8), // warm daylight
          skyC: new THREE.Color(0x9ed0ff),
          wallC: new THREE.Color(0xe5e1d6),
          floorC: new THREE.Color(0xc8beaa),
          starOp: 0,
          celestialC: new THREE.Color(0xffe066), // sun
        };
      }
      return {
        lamp: 1,
        ambient: 0.22,
        winI: 0.35,
        winC: new THREE.Color(0x7c9bd1), // cool moon
        skyC: new THREE.Color(0x0a1025),
        wallC: new THREE.Color(0x202635),
        floorC: new THREE.Color(0x1a1f2e),
        starOp: 1,
        celestialC: new THREE.Color(0xe8ecff), // moon
      };
    };

    targetsRef.current = getTargets;

    // ---------- Animation ----------
    const clock = new THREE.Clock();
    let frameId;
    const lerpNum = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const targets = getTargets(themeRef.current);

      // Lerp all theme values for smooth transitions
      const k = 1 - Math.pow(0.001, delta); // smooth
      state.lamp = lerpNum(state.lamp, targets.lamp, k);
      state.ambient = lerpNum(state.ambient, targets.ambient, k);
      state.winI = lerpNum(state.winI, targets.winI, k);
      state.starOp = lerpNum(state.starOp, targets.starOp, k);
      state.winC.lerp(targets.winC, k);
      state.skyC.lerp(targets.skyC, k);
      state.wallC.lerp(targets.wallC, k);
      state.floorC.lerp(targets.floorC, k);
      state.celestialC.lerp(targets.celestialC, k);

      // Apply
      ambient.intensity = state.ambient;
      windowLight.intensity = state.winI;
      windowLight.color.copy(state.winC);
      lampLight.intensity = state.lamp * 2.5;
      bulbMat.opacity = state.lamp;
      lampShadeMat.emissiveIntensity = state.lamp * 0.9;
      starMat.opacity = state.starOp;
      skyMat.color.copy(state.skyC);
      wallMat.color.copy(state.wallC);
      floorMat.color.copy(state.floorC);
      celestialMat.color.copy(state.celestialC);

      // Celestial moves (sun/moon subtle arc)
      celestial.position.x = 0.6 + Math.sin(elapsed * 0.1) * 0.3;

      // Screen flicker: cycle code lines subtly
      codeLines.forEach((ln, i) => {
        ln.material.opacity =
          0.55 + Math.sin(elapsed * 2 + i * 0.7) * 0.25 + 0.15;
      });

      // Laptop display subtle pulse
      laptopDisp.material = screenGlowMat;

      // Particles drifting
      particles.forEach((p, i) => {
        const { ox, oy, oz, speed } = p.userData;
        const t = elapsed * speed + i;
        p.position.x = ox + Math.sin(t * 0.6) * 0.12;
        p.position.y = oy + Math.sin(t) * 0.08;
        p.position.z = oz + Math.cos(t * 0.5) * 0.08;
      });

      // Hint ring pulses gently to draw attention to lamp
      hintMat.opacity = 0.15 + Math.sin(elapsed * 2.5) * 0.1;
      hintRing.rotation.z += delta * 0.5;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ---------- Resize ----------
    const handleResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      const a = width / height;
      camera.left = -viewSize * a;
      camera.right = viewSize * a;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose && obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose && m.dispose());
          } else {
            obj.material.dispose && obj.material.dispose();
          }
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-label="Interactive 3D hacker room. Click the desk lamp to toggle day or night."
      role="img"
    />
  );
}
