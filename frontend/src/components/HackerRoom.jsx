import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

// -------------------- Canvas Texture helpers --------------------
function makeCurtainTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext("2d");
  // Fabric base: slate-dark with soft vertical gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#2a3042");
  grad.addColorStop(0.5, "#1b2032");
  grad.addColorStop(1, "#141828");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 512);
  // Vertical folds
  for (let x = 0; x < 128; x += 8) {
    const alpha = 0.05 + Math.random() * 0.08;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(x, 0, 1, 512);
    ctx.fillStyle = `rgba(0,0,0,${alpha * 1.5})`;
    ctx.fillRect(x + 4, 0, 1, 512);
  }
  // Horizontal slat seams (hints of blinds)
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 1;
  for (let y = 0; y < 512; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(128, y);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(1, 1);
  return tex;
}

function makeScreenTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 288;
  const ctx = c.getContext("2d");
  // Terminal background
  ctx.fillStyle = "#0a1525";
  ctx.fillRect(0, 0, 512, 288);
  // Header bar
  ctx.fillStyle = "#0f1d33";
  ctx.fillRect(0, 0, 512, 20);
  ctx.fillStyle = "#ef4444";
  ctx.beginPath(); ctx.arc(10, 10, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath(); ctx.arc(22, 10, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#22c55e";
  ctx.beginPath(); ctx.arc(34, 10, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#64748b";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.fillText("~ — farley@dev: zsh", 50, 14);
  // Code content
  const lines = [
    { prompt: "$", text: "npm run test:e2e --headed", color: "#22d3ee" },
    { prompt: ">", text: "Running 420 tests...", color: "#94a3b8" },
    { prompt: "✓", text: "auth.spec.ts (42)", color: "#22c55e" },
    { prompt: "✓", text: "dashboard.spec.ts (58)", color: "#22c55e" },
    { prompt: "✓", text: "payments.spec.ts (36)", color: "#22c55e" },
    { prompt: "✓", text: "api-contracts.spec.ts (61)", color: "#22c55e" },
    { prompt: "!", text: "edge-cases: SQLi vector...", color: "#f59e0b" },
    { prompt: "$", text: "nmap -sV 10.0.0.1", color: "#22d3ee" },
    { prompt: ">", text: "Starting Nmap scan...", color: "#94a3b8" },
    { prompt: "$", text: "_", color: "#22d3ee" },
  ];
  ctx.font = "13px 'JetBrains Mono', Menlo, monospace";
  lines.forEach((ln, i) => {
    const y = 42 + i * 22;
    ctx.fillStyle = "#22d3ee";
    ctx.fillText(ln.prompt, 14, y);
    ctx.fillStyle = ln.color;
    ctx.fillText(ln.text, 34, y);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

function makeLaptopScreenTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 160;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0b1628";
  ctx.fillRect(0, 0, 256, 160);
  // "Editor" panes
  ctx.fillStyle = "#0f1d33";
  ctx.fillRect(0, 0, 60, 160);
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(0, 0, 256, 14);
  ctx.fillStyle = "#fff";
  ctx.font = "8px 'JetBrains Mono', monospace";
  ctx.fillText("farley-portfolio — VS Code", 4, 10);
  // Code lines
  const codeLines = [
    { t: "import React from 'react'", c: "#f472b6" },
    { t: "", c: "" },
    { t: "function Hero() {", c: "#c084fc" },
    { t: "  const [theme] = useTheme()", c: "#93c5fd" },
    { t: "  return (", c: "#93c5fd" },
    { t: "    <Canvas>", c: "#fbbf24" },
    { t: "      <HackerRoom />", c: "#22d3ee" },
    { t: "    </Canvas>", c: "#fbbf24" },
    { t: "  )", c: "#93c5fd" },
    { t: "}", c: "#c084fc" },
  ];
  ctx.font = "9px 'JetBrains Mono', monospace";
  codeLines.forEach((ln, i) => {
    ctx.fillStyle = "#64748b";
    ctx.fillText(String(i + 1).padStart(2, "0"), 66, 30 + i * 13);
    ctx.fillStyle = ln.c || "#cbd5e1";
    ctx.fillText(ln.t, 84, 30 + i * 13);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

function makePictureTexture() {
  const c = document.createElement("canvas");
  c.width = 320;
  c.height = 400;
  const ctx = c.getContext("2d");

  // Sky gradient (top portion)
  const sky = ctx.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, "#0f172a");
  sky.addColorStop(0.6, "#1e3a8a");
  sky.addColorStop(1, "#0891b2");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 320, 280);

  // Stars / dots in the sky
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 320;
    const y = Math.random() * 160;
    const size = Math.random() * 1.5 + 0.5;
    ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Moon / circle
  ctx.fillStyle = "#f1f5f9";
  ctx.beginPath();
  ctx.arc(220, 90, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(148,163,184,0.4)";
  ctx.beginPath();
  ctx.arc(228, 85, 8, 0, Math.PI * 2);
  ctx.fill();

  // Mountain ranges (back) - darker
  ctx.fillStyle = "#0e1a33";
  ctx.beginPath();
  ctx.moveTo(0, 280);
  ctx.lineTo(60, 190);
  ctx.lineTo(120, 230);
  ctx.lineTo(180, 160);
  ctx.lineTo(250, 210);
  ctx.lineTo(320, 180);
  ctx.lineTo(320, 280);
  ctx.closePath();
  ctx.fill();

  // Mountain range (front) - cyan tint
  ctx.fillStyle = "#155e75";
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(50, 250);
  ctx.lineTo(100, 280);
  ctx.lineTo(160, 230);
  ctx.lineTo(220, 270);
  ctx.lineTo(280, 240);
  ctx.lineTo(320, 260);
  ctx.lineTo(320, 300);
  ctx.closePath();
  ctx.fill();

  // Snow caps on back mountains (thin)
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.moveTo(55, 198);
  ctx.lineTo(60, 190);
  ctx.lineTo(65, 198);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(175, 168);
  ctx.lineTo(180, 160);
  ctx.lineTo(185, 168);
  ctx.closePath();
  ctx.fill();

  // Foreground / ground (bottom panel with title)
  ctx.fillStyle = "#0a1425";
  ctx.fillRect(0, 300, 320, 100);

  // Subtle horizon glow line
  ctx.fillStyle = "rgba(34,211,238,0.3)";
  ctx.fillRect(0, 298, 320, 2);

  // Title
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 26px 'Inter', sans-serif";
  ctx.fillText("Quiet Code", 26, 345);
  ctx.fillStyle = "#22d3ee";
  ctx.font = "11px 'JetBrains Mono', monospace";
  ctx.fillText("// focus · build · repeat", 26, 370);

  return new THREE.CanvasTexture(c);
}

function makeStickyNoteTexture(text, bg = "#facc15", color = "#0f172a") {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 128, 128);
  // Tape
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(40, 2, 48, 12);
  // Slight shadow gradient
  const g = ctx.createLinearGradient(0, 0, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  // Text
  ctx.fillStyle = color;
  ctx.font = "bold 14px 'JetBrains Mono', monospace";
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    ctx.fillText(line, 12, 40 + i * 20);
  });
  return new THREE.CanvasTexture(c);
}

function makeSkylineTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 180;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 512, 180);
  // Draw buildings silhouettes - dark charcoal
  ctx.fillStyle = "#1a2234";
  let x = 0;
  const buildings = [];
  while (x < 512) {
    const w = 18 + Math.random() * 55;
    const h = 50 + Math.random() * 110;
    buildings.push({ x, w, h });
    ctx.fillRect(x, 180 - h, w, h);
    x += w + 2;
  }
  // Antenna on tallest building
  const tallest = buildings.reduce((a, b) => (b.h > a.h ? b : a), buildings[0]);
  ctx.fillStyle = "#1a2234";
  ctx.fillRect(tallest.x + tallest.w / 2 - 1, 180 - tallest.h - 18, 2, 18);
  ctx.beginPath();
  ctx.arc(tallest.x + tallest.w / 2, 180 - tallest.h - 22, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#ef4444";
  ctx.fill();
  // Lit windows
  buildings.forEach((b) => {
    for (let wx = b.x + 4; wx < b.x + b.w - 4; wx += 6) {
      for (let wy = 180 - b.h + 8; wy < 180 - 6; wy += 9) {
        if (Math.random() > 0.55) {
          ctx.fillStyle =
            Math.random() > 0.15
              ? "rgba(246, 198, 106, 0.9)"
              : "rgba(34, 211, 238, 0.9)";
          ctx.fillRect(wx, wy, 2, 3);
        }
      }
    }
  });
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

// -------------------- Component --------------------
export default function HackerRoom() {
  const mountRef = useRef(null);
  const { theme, toggle } = useTheme();
  const themeRef = useRef(theme);
  const prevThemeRef = useRef(theme);
  const revealStartRef = useRef(0);

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
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const windowLight = new THREE.DirectionalLight(0xffffff, 0.8);
    windowLight.position.set(-6, 8, -4);
    windowLight.castShadow = true;
    windowLight.shadow.mapSize.set(1024, 1024);
    windowLight.shadow.camera.left = -6;
    windowLight.shadow.camera.right = 6;
    windowLight.shadow.camera.top = 6;
    windowLight.shadow.camera.bottom = -6;
    scene.add(windowLight);

    const lampLight = new THREE.PointLight(0xffb347, 0, 8, 2);
    lampLight.position.set(1.9, 2.3, -0.6);
    lampLight.castShadow = true;
    lampLight.shadow.mapSize.set(512, 512);
    scene.add(lampLight);

    const monitorLight = new THREE.PointLight(0x22d3ee, 0.9, 4.5, 2);
    monitorLight.position.set(-1.3, 2.1, -0.2);
    scene.add(monitorLight);

    // Soft fill from screen onto desk (always on in night)
    const deskGlow = new THREE.PointLight(0x22d3ee, 0.2, 2.5, 2);
    deskGlow.position.set(0, 1.4, -0.5);
    scene.add(deskGlow);

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
      roughness: 0.65,
      metalness: 0.05,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x3d4863,
      metalness: 0.75,
      roughness: 0.3,
    });
    const screenFrameMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e18,
      roughness: 0.4,
      metalness: 0.3,
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
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0x7c2d12,
      roughness: 0.95,
    });
    const rugAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd97757,
      roughness: 0.95,
    });
    const keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x0f1422,
      roughness: 0.6,
      metalness: 0.2,
    });
    const mouseMat = keyboardMat.clone();

    // ---------- Room geometry ----------
    const floorGeo = new THREE.BoxGeometry(8, 0.2, 6);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Baseboard
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x151a27,
      roughness: 0.85,
    });
    const baseB = new THREE.Mesh(new THREE.BoxGeometry(8, 0.18, 0.04), baseMat);
    baseB.position.set(0, 0.09, -2.92);
    scene.add(baseB);
    const baseL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 6), baseMat);
    baseL.position.set(-3.92, 0.09, 0);
    scene.add(baseL);

    // Back wall — split into 4 pieces around window cutout
    // Window dimensions used by both back-wall pieces and frame below
    const winW = 3.2;
    const winH = 2.2;
    const winX = -0.5;
    const winY = 3;
    const winZ = -2.88;
    const bwMat = wallMat;
    const BW_W = 8, BW_H = 5;
    const winLeft = winX - winW / 2;
    const winRight = winX + winW / 2;
    const winTop = winY + winH / 2;
    const winBottom = winY - winH / 2;
    // Left piece
    const bwLeft = new THREE.Mesh(
      new THREE.BoxGeometry(BW_W / 2 + winLeft, BW_H, 0.2),
      bwMat
    );
    bwLeft.position.set(-BW_W / 2 + (BW_W / 2 + winLeft) / 2, BW_H / 2, -3);
    bwLeft.receiveShadow = true;
    scene.add(bwLeft);
    // Right piece
    const bwRight = new THREE.Mesh(
      new THREE.BoxGeometry(BW_W / 2 - winRight, BW_H, 0.2),
      bwMat
    );
    bwRight.position.set(winRight + (BW_W / 2 - winRight) / 2, BW_H / 2, -3);
    bwRight.receiveShadow = true;
    scene.add(bwRight);
    // Top piece (above window)
    const bwTop = new THREE.Mesh(
      new THREE.BoxGeometry(winW, BW_H - winTop, 0.2),
      bwMat
    );
    bwTop.position.set(winX, winTop + (BW_H - winTop) / 2, -3);
    bwTop.receiveShadow = true;
    scene.add(bwTop);
    // Bottom piece (below window)
    const bwBottom = new THREE.Mesh(
      new THREE.BoxGeometry(winW, winBottom, 0.2),
      bwMat
    );
    bwBottom.position.set(winX, winBottom / 2, -3);
    bwBottom.receiveShadow = true;
    scene.add(bwBottom);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 5, 6),
      wallMat
    );
    leftWall.position.set(-4, 2.5, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // ---------- Window frame ----------
    // Hollow window frame: 4 thin bars so sky/skyline show through
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x3d4863,
      metalness: 0.6,
      roughness: 0.45,
    });
    const frameT = 0.12;
    const frameD = 0.18;
    // top
    const frameTop = new THREE.Mesh(
      new THREE.BoxGeometry(winW, frameT, frameD),
      frameMat
    );
    frameTop.position.set(winX, winY + winH / 2 - frameT / 2, winZ);
    scene.add(frameTop);
    // bottom (sill)
    const frameBottom = new THREE.Mesh(
      new THREE.BoxGeometry(winW, frameT, frameD + 0.06),
      frameMat
    );
    frameBottom.position.set(winX, winY - winH / 2 + frameT / 2, winZ + 0.03);
    scene.add(frameBottom);
    // left
    const frameLeft = new THREE.Mesh(
      new THREE.BoxGeometry(frameT, winH, frameD),
      frameMat
    );
    frameLeft.position.set(winX - winW / 2 + frameT / 2, winY, winZ);
    scene.add(frameLeft);
    // right
    const frameRight = new THREE.Mesh(
      new THREE.BoxGeometry(frameT, winH, frameD),
      frameMat
    );
    frameRight.position.set(winX + winW / 2 - frameT / 2, winY, winZ);
    scene.add(frameRight);

    // Sky (gradient plane) — color changes with theme
    const skyGeo = new THREE.PlaneGeometry(3, 2);
    const skyMat = new THREE.MeshBasicMaterial({ color: 0x0a1025 });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.position.set(-0.5, 3, -2.95);
    scene.add(sky);

    // Skyline silhouette (always in scene; only visible when curtain up)
    const skylineTex = makeSkylineTexture();
    const skylineMat = new THREE.MeshBasicMaterial({
      map: skylineTex,
      transparent: true,
      opacity: 0,
    });
    const skyline = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.9), skylineMat);
    skyline.position.set(-0.5, 2.32, -2.92);
    scene.add(skyline);

    // Window cross bars (brighter metal)
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x3a4258,
      roughness: 0.5,
      metalness: 0.4,
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

    // Celestial (sun/moon)
    const celestialMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const celestial = new THREE.Mesh(
      new THREE.CircleGeometry(0.28, 32),
      celestialMat
    );
    celestial.position.set(0.6, 3.6, -2.93);
    scene.add(celestial);

    // Moon crater overlay (a slightly darker circle that shows only at night)
    const craterMat = new THREE.MeshBasicMaterial({
      color: 0x9aa3c0,
      transparent: true,
      opacity: 0.6,
    });
    const crater1 = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 12),
      craterMat
    );
    crater1.position.set(0.5, 3.65, -2.925);
    scene.add(crater1);
    const crater2 = new THREE.Mesh(
      new THREE.CircleGeometry(0.04, 12),
      craterMat
    );
    crater2.position.set(0.7, 3.55, -2.925);
    scene.add(crater2);

    // Stars
    const STAR_COUNT = 70;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 3 - 0.5;
      starPositions[i * 3 + 1] = 2 + Math.random() * 2;
      starPositions[i * 3 + 2] = -2.92;
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

    // ---------- Curtain (roll-up blind) ----------
    const curtainTex = makeCurtainTexture();
    const curtainMat = new THREE.MeshStandardMaterial({
      map: curtainTex,
      roughness: 0.85,
      side: THREE.DoubleSide,
    });
    const CURTAIN_H = 2.35;
    const CURTAIN_W = 3.35;
    const curtainGeo = new THREE.PlaneGeometry(CURTAIN_W, CURTAIN_H, 1, 1);
    // Shift geometry so top edge is at y=0 (scale will roll from bottom up)
    curtainGeo.translate(0, -CURTAIN_H / 2, 0);
    const curtain = new THREE.Mesh(curtainGeo, curtainMat);
    // Top of curtain aligned just above window
    curtain.position.set(-0.5, 4.15, -2.78);
    curtain.castShadow = false;
    curtain.receiveShadow = false;
    scene.add(curtain);

    // Curtain rod
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.6, 16),
      metalMat
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(-0.5, 4.18, -2.78);
    scene.add(rod);
    // Rod caps
    [-1.8, 1.8].forEach((x) => {
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        metalMat
      );
      cap.position.set(-0.5 + x, 4.18, -2.78);
      scene.add(cap);
    });
    // Pull-string tassel
    const tasselGroup = new THREE.Group();
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    string.position.set(1.15, -0.15, 0);
    tasselGroup.add(string);
    const tasselBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97757, roughness: 0.8 })
    );
    tasselBall.position.set(1.15, -0.35, 0);
    tasselGroup.add(tasselBall);
    curtain.add(tasselGroup); // attach so tassel stays at bottom of curtain

    // ---------- Floor rug ----------
    const rugGroup = new THREE.Group();
    const rug = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 48),
      rugMat
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0.3, 0.02, 0.5);
    rug.receiveShadow = true;
    rugGroup.add(rug);
    const rugRing = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.3, 48),
      rugAccentMat
    );
    rugRing.rotation.x = -Math.PI / 2;
    rugRing.position.set(0.3, 0.021, 0.5);
    rugGroup.add(rugRing);
    const rugRing2 = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.68, 48),
      rugAccentMat
    );
    rugRing2.rotation.x = -Math.PI / 2;
    rugRing2.position.set(0.3, 0.022, 0.5);
    rugGroup.add(rugRing2);
    scene.add(rugGroup);

    // ---------- Desk ----------
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.12, 1.6),
      deskMat
    );
    deskTop.position.set(0, 1.2, -1);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk LED strip — thin bar under front edge
    const ledStripGeo = new THREE.BoxGeometry(4.6, 0.03, 0.03);
    const ledStripMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.85,
    });
    const ledStrip = new THREE.Mesh(ledStripGeo, ledStripMat);
    ledStrip.position.set(0, 1.135, -0.21);
    deskGroup.add(ledStrip);

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
    // Body
    const monBack = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 1.4, 0.14),
      screenFrameMat
    );
    monBack.position.set(-1.3, 2.3, -1.08);
    monBack.castShadow = true;
    monitorGroup.add(monBack);
    // Bezel (thin darker surround)
    const bezel = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.3),
      screenFrameMat
    );
    bezel.position.set(-1.3, 2.3, -1.005);
    monitorGroup.add(bezel);
    // Screen texture
    const screenTex = makeScreenTexture();
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
      transparent: false,
    });
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.05, 1.15),
      screenMat
    );
    screen.position.set(-1.3, 2.3, -1);
    monitorGroup.add(screen);
    // Monitor LEDs (power indicators)
    const ledGreen = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    ledGreen.position.set(-0.3, 1.67, -1);
    monitorGroup.add(ledGreen);
    const ledRed = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    ledRed.position.set(-0.2, 1.67, -1);
    monitorGroup.add(ledRed);

    // Bias lighting behind monitor — rim glow plane
    const biasMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.55,
    });
    const bias = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.65), biasMat);
    bias.position.set(-1.3, 2.3, -1.2);
    monitorGroup.add(bias);
    // Fake soft blur via additional larger plane with lower opacity
    const biasGlowMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const biasGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.2), biasGlowMat);
    biasGlow.position.set(-1.3, 2.3, -1.25);
    monitorGroup.add(biasGlow);
    scene.add(monitorGroup);

    // ---------- Laptop ----------
    const laptopGroup = new THREE.Group();
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.06, 0.8),
      metalMat
    );
    laptopBase.position.set(0.7, 1.29, -0.6);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);
    // Keyboard inlay on laptop base
    const lkInlay = new THREE.Mesh(
      new THREE.PlaneGeometry(1.05, 0.45),
      keyboardMat
    );
    lkInlay.rotation.x = -Math.PI / 2;
    lkInlay.position.set(0.7, 1.322, -0.7);
    laptopGroup.add(lkInlay);
    // Tilted screen
    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.75, 0.04),
      screenFrameMat
    );
    laptopScreen.position.set(0.7, 1.65, -0.98);
    laptopScreen.rotation.x = -0.35;
    laptopScreen.castShadow = true;
    laptopGroup.add(laptopScreen);
    // Display (canvas texture)
    const laptopTex = makeLaptopScreenTexture();
    const laptopDispMat = new THREE.MeshBasicMaterial({ map: laptopTex });
    const laptopDisp = new THREE.Mesh(
      new THREE.PlaneGeometry(1.05, 0.62),
      laptopDispMat
    );
    laptopDisp.position.set(0.7, 1.65, -0.96);
    laptopDisp.rotation.x = -0.35;
    laptopGroup.add(laptopDisp);
    scene.add(laptopGroup);

    // ---------- Keyboard & Mouse on desk ----------
    const kb = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.06, 0.45),
      keyboardMat
    );
    kb.position.set(-1.0, 1.295, -0.45);
    kb.castShadow = true;
    scene.add(kb);
    // Key pattern (single plane with grid pattern simulated via texture could be added;
    // for performance, add a few highlighted key rows)
    const keyCap = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
    });
    for (let r = 0; r < 3; r++) {
      for (let cc = 0; cc < 12; cc++) {
        const k = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.025, 0.09),
          keyCap
        );
        k.position.set(-1.6 + cc * 0.11, 1.335, -0.55 + r * 0.11);
        scene.add(k);
      }
    }
    // Mouse
    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.05, 0.28),
      mouseMat
    );
    mouse.position.set(-0.05, 1.29, -0.35);
    scene.add(mouse);

    // ---------- Desk Lamp (CLICKABLE) ----------
    const lampGroup = new THREE.Group();
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 0.1, 24),
      metalMat
    );
    lampBase.position.set(1.9, 1.31, -0.6);
    lampBase.castShadow = true;
    lampBase.userData.isLamp = true;
    lampGroup.add(lampBase);
    const lampArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.1, 16),
      metalMat
    );
    lampArm.position.set(1.9, 1.85, -0.6);
    lampArm.rotation.z = 0.35;
    lampArm.userData.isLamp = true;
    lampGroup.add(lampArm);
    const lampArm2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.7, 16),
      metalMat
    );
    lampArm2.position.set(2.1, 2.3, -0.6);
    lampArm2.rotation.z = -0.8;
    lampArm2.userData.isLamp = true;
    lampGroup.add(lampArm2);
    // Shade
    const lampShadeMat = new THREE.MeshStandardMaterial({
      color: 0xc96b44,
      emissive: 0xff8855,
      emissiveIntensity: 0,
      roughness: 0.5,
    });
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.32, 0.45, 24, 1, true),
      lampShadeMat
    );
    lampShade.position.set(1.85, 2.5, -0.6);
    lampShade.rotation.z = -0.9;
    lampShade.castShadow = true;
    lampShade.userData.isLamp = true;
    lampGroup.add(lampShade);
    // Bulb
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
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.2), chairMat);
    seat.position.set(0, 0.9, 1);
    seat.castShadow = true;
    chairGroup.add(seat);
    const seatCushion = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.06, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x262e47, roughness: 0.9 })
    );
    seatCushion.position.set(0, 0.98, 1);
    chairGroup.add(seatCushion);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.12), chairMat);
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

    // ---------- Plant ----------
    const plantGroup = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.22, 0.5, 16),
      plantPotMat
    );
    pot.position.set(-3, 0.25, -2);
    pot.castShadow = true;
    plantGroup.add(pot);
    const potRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.03, 10, 24),
      new THREE.MeshStandardMaterial({ color: 0x2a211c, roughness: 0.9 })
    );
    potRim.position.set(-3, 0.5, -2);
    potRim.rotation.x = Math.PI / 2;
    plantGroup.add(potRim);
    // Foliage
    const leaves = [];
    for (let i = 0; i < 6; i++) {
      const r = 0.22 + Math.random() * 0.14;
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(r, 12, 12),
        leafMat
      );
      const basePos = [
        -3 + (Math.random() - 0.5) * 0.35,
        0.7 + Math.random() * 0.35,
        -2 + (Math.random() - 0.5) * 0.35,
      ];
      leaf.position.set(basePos[0], basePos[1], basePos[2]);
      leaf.userData = { basePos, phase: Math.random() * Math.PI * 2 };
      leaf.castShadow = true;
      leaves.push(leaf);
      plantGroup.add(leaf);
    }
    scene.add(plantGroup);

    // ---------- Books ----------
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

    // ---------- Coffee mug + steam ----------
    const mugGroup = new THREE.Group();
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.16, 0.32, 20),
      mugMat
    );
    mug.position.set(-0.1, 1.45, -0.55);
    mug.castShadow = true;
    mugGroup.add(mug);
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.025, 8, 20, Math.PI),
      mugMat
    );
    handle.position.set(0.08, 1.45, -0.55);
    handle.rotation.y = -Math.PI / 2;
    mugGroup.add(handle);
    const coffeeMat = new THREE.MeshBasicMaterial({ color: 0x3b2415 });
    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(0.17, 20),
      coffeeMat
    );
    coffee.position.set(-0.1, 1.61, -0.55);
    coffee.rotation.x = -Math.PI / 2;
    mugGroup.add(coffee);
    scene.add(mugGroup);

    // Steam particles
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.35,
    });
    const steamGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const steamParticles = [];
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Mesh(steamGeo, steamMat.clone());
      p.userData = {
        t: Math.random(),
        speed: 0.25 + Math.random() * 0.25,
        ox: -0.1 + (Math.random() - 0.5) * 0.1,
      };
      scene.add(p);
      steamParticles.push(p);
    }

    // ---------- Wall clock (on back wall to the right of window) ----------
    const clockGroup = new THREE.Group();
    const clockFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.45, 48),
      new THREE.MeshStandardMaterial({
        color: 0xe5e7eb,
        roughness: 0.3,
        metalness: 0.1,
      })
    );
    clockFace.position.set(2.5, 3.2, -2.88);
    clockGroup.add(clockFace);
    const clockRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.04, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
        metalness: 0.6,
      })
    );
    clockRim.position.set(2.5, 3.2, -2.87);
    clockGroup.add(clockRim);
    // Hour marks
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.07, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x0f172a })
      );
      mark.position.set(
        2.5 + Math.sin(angle) * 0.37,
        3.2 + Math.cos(angle) * 0.37,
        -2.86
      );
      mark.rotation.z = -angle;
      clockGroup.add(mark);
    }
    // Hands
    const handMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const hourHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.25, 0.01),
      handMat
    );
    hourHand.geometry.translate(0, 0.1, 0);
    hourHand.position.set(2.5, 3.2, -2.855);
    clockGroup.add(hourHand);
    const minuteHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.35, 0.01),
      handMat
    );
    minuteHand.geometry.translate(0, 0.15, 0);
    minuteHand.position.set(2.5, 3.2, -2.85);
    clockGroup.add(minuteHand);
    const centerDot = new THREE.Mesh(
      new THREE.CircleGeometry(0.04, 16),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    centerDot.position.set(2.5, 3.2, -2.84);
    clockGroup.add(centerDot);
    scene.add(clockGroup);

    // ---------- Mini library (wall-mounted shelves on left wall) ----------
    const shelfGroup = new THREE.Group();
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x4a3528,
      roughness: 0.8,
      metalness: 0.05,
    });
    const shelfSupportMat = new THREE.MeshStandardMaterial({
      color: 0x2a1f18,
      roughness: 0.85,
    });

    const SHELF_W = 1.6; // along z-axis (depth on wall)
    const SHELF_D = 0.42; // extends into room (x-axis)
    const SHELF_H = 0.05;
    const SHELF_X = -3.77; // near left wall (wall at -4)
    const SHELF_Z_CENTER = -0.4;
    const shelfYs = [3.2, 2.5, 1.8];

    shelfYs.forEach((y, idx) => {
      // Shelf plank
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(SHELF_D, SHELF_H, SHELF_W),
        shelfMat
      );
      shelf.position.set(SHELF_X, y, SHELF_Z_CENTER);
      shelf.castShadow = true;
      shelf.receiveShadow = true;
      shelfGroup.add(shelf);

      // Two L-brackets under each shelf
      [-1, 1].forEach((side) => {
        const bracket = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.14, 0.03),
          shelfSupportMat
        );
        bracket.position.set(
          SHELF_X + 0.05,
          y - 0.1,
          SHELF_Z_CENTER + side * 0.6
        );
        shelfGroup.add(bracket);
      });
    });

    // Populate shelves with books & trinkets
    const bookPalette = [
      0x1e40af, // navy
      0x991b1b, // burgundy
      0x0f766e, // teal
      0x7c2d12, // brown
      0xb45309, // amber
      0x064e3b, // deep green
      0x4c1d95, // deep purple
      0xeab308, // yellow
      0xe2e8f0, // off-white
      0x1e293b, // charcoal
    ];

    // Helper: add a book at position
    const addBook = (y, z, { h, w, tilt = 0, color, leaning = false }) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.78,
        metalness: 0.05,
      });
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, w), mat);
      book.castShadow = true;
      // Place on top of shelf
      book.position.set(SHELF_X, y + SHELF_H / 2 + h / 2, z);
      if (leaning) {
        book.rotation.z = tilt;
      }
      // Thin spine stripe (lighter) on top for detail
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.21, 0.015, w * 0.8),
        new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.6,
        })
      );
      stripe.position.y = h / 2 - 0.04;
      book.add(stripe);
      shelfGroup.add(book);
      return book;
    };

    // --- Top shelf: row of upright books + small trophy ---
    let z = -1.05;
    [
      { h: 0.38, w: 0.09, color: bookPalette[0] },
      { h: 0.42, w: 0.08, color: bookPalette[8] },
      { h: 0.35, w: 0.11, color: bookPalette[1] },
      { h: 0.45, w: 0.09, color: bookPalette[2] },
      { h: 0.4, w: 0.1, color: bookPalette[7] },
      { h: 0.38, w: 0.08, color: bookPalette[3] },
      { h: 0.43, w: 0.09, color: bookPalette[6] },
    ].forEach((b) => {
      addBook(3.2, z + b.w / 2, b);
      z += b.w + 0.005;
    });
    // Trophy at end of shelf (inside shelf bounds z: -1.2 to 0.4)
    const trophyBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.05, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
    );
    trophyBase.position.set(SHELF_X, 3.25, 0.22);
    shelfGroup.add(trophyBase);
    const trophyCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.03, 0.18, 12),
      new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.85,
        roughness: 0.25,
      })
    );
    trophyCup.position.set(SHELF_X, 3.365, 0.22);
    shelfGroup.add(trophyCup);
    const trophyHandleL = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.01, 6, 12, Math.PI),
      new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.85,
        roughness: 0.25,
      })
    );
    trophyHandleL.position.set(SHELF_X - 0.05, 3.38, 0.22);
    trophyHandleL.rotation.z = Math.PI / 2;
    shelfGroup.add(trophyHandleL);
    const trophyHandleR = trophyHandleL.clone();
    trophyHandleR.position.set(SHELF_X + 0.05, 3.38, 0.22);
    trophyHandleR.rotation.z = -Math.PI / 2;
    shelfGroup.add(trophyHandleR);

    // --- Middle shelf: some upright, some leaning, and a small figurine (rubik's cube) ---
    z = -1.05;
    [
      { h: 0.38, w: 0.09, color: bookPalette[4] },
      { h: 0.4, w: 0.09, color: bookPalette[0] },
      { h: 0.36, w: 0.1, color: bookPalette[2] },
      { h: 0.33, w: 0.09, color: bookPalette[9], leaning: true, tilt: 0.22 },
      { h: 0.33, w: 0.09, color: bookPalette[1], leaning: true, tilt: 0.22 },
    ].forEach((b) => {
      addBook(2.5, z + b.w / 2, b);
      z += b.w + 0.005;
    });
    // Horizontal stack (3 books lying flat)
    const stackColors = [bookPalette[5], bookPalette[7], bookPalette[0]];
    stackColors.forEach((col, i) => {
      const m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.78 });
      const flat = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.32), m);
      flat.position.set(SHELF_X, 2.56 + i * 0.07, -0.25);
      flat.castShadow = true;
      shelfGroup.add(flat);
    });
    // Rubik's cube sitting on middle shelf (within shelf z bounds)
    const cubeColors = [0xef4444, 0x22c55e, 0x3b82f6, 0xeab308, 0xf97316, 0xffffff];
    const cubeMats = cubeColors.map(
      (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 })
    );
    const rubik = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), cubeMats);
    // Shelf y=2.5 top=2.525, cube half-height=0.11 → center at 2.635
    rubik.position.set(SHELF_X, 2.635, 0.22);
    rubik.rotation.y = 0.25;
    rubik.castShadow = true;
    shelfGroup.add(rubik);

    // --- Bottom shelf: tall books + small plant ---
    z = -1.05;
    [
      { h: 0.5, w: 0.11, color: bookPalette[8] },
      { h: 0.52, w: 0.1, color: bookPalette[0] },
      { h: 0.48, w: 0.12, color: bookPalette[3] },
      { h: 0.55, w: 0.1, color: bookPalette[6] },
      { h: 0.5, w: 0.11, color: bookPalette[4] },
      { h: 0.47, w: 0.1, color: bookPalette[2] },
    ].forEach((b) => {
      addBook(1.8, z + b.w / 2, b);
      z += b.w + 0.005;
    });
    // Small succulent on end of bottom shelf (inside shelf bounds)
    // Shelf y=1.8 top=1.825; pot height 0.18 → center at 1.915 so bottom sits on shelf
    const miniPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.08, 0.18, 12),
      new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 })
    );
    miniPot.position.set(SHELF_X, 1.915, 0.22);
    shelfGroup.add(miniPot);
    // Succulent leaves (sitting on pot top ~y=2.005)
    const succMat = new THREE.MeshStandardMaterial({
      color: 0x4d7c0f,
      roughness: 0.7,
    });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const leaf = new THREE.Mesh(
        new THREE.ConeGeometry(0.035, 0.11, 6),
        succMat
      );
      leaf.position.set(
        SHELF_X + Math.cos(angle) * 0.05,
        2.05,
        0.22 + Math.sin(angle) * 0.05
      );
      leaf.rotation.z = Math.cos(angle) * 0.35;
      leaf.rotation.x = Math.sin(angle) * 0.35;
      shelfGroup.add(leaf);
    }
    // Center leaf pointing up
    const centerLeaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.035, 0.14, 6),
      succMat
    );
    centerLeaf.position.set(SHELF_X, 2.07, 0.22);
    shelfGroup.add(centerLeaf);

    scene.add(shelfGroup);

    // ---------- Sticky notes on back wall (left of window) ----------
    const notes = [
      { text: "ship\nit.", bg: "#facc15", pos: [-2.7, 3.4, -2.85], tilt: -0.08 },
      { text: "TODO\ne2e +\nsecurity", bg: "#fb7185", pos: [-3.15, 2.9, -2.85], tilt: 0.12 },
      { text: "coffee?", bg: "#86efac", pos: [-2.4, 2.6, -2.85], tilt: -0.15 },
    ];
    notes.forEach((n) => {
      const tex = makeStickyNoteTexture(n.text, n.bg);
      const note = new THREE.Mesh(
        new THREE.PlaneGeometry(0.38, 0.38),
        new THREE.MeshBasicMaterial({ map: tex })
      );
      note.position.set(n.pos[0], n.pos[1], n.pos[2]);
      note.rotation.z = n.tilt;
      scene.add(note);
    });

    // ---------- Ceiling pendant lamp ----------
    const ceilGroup = new THREE.Group();
    // Cord from ceiling (top at y=5 down to fixture at y=3.7)
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 1.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    cord.position.set(0.6, 4.35, 0);
    ceilGroup.add(cord);
    // Lamp shade (inverted cone dome)
    const pendantShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.3, 24, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x3d4863,
        roughness: 0.5,
        metalness: 0.6,
        side: THREE.DoubleSide,
      })
    );
    pendantShade.position.set(0.6, 3.85, 0);
    pendantShade.rotation.x = Math.PI;
    ceilGroup.add(pendantShade);
    // Pendant bulb
    const pendantBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0xfff4d8,
        transparent: true,
        opacity: 0,
      })
    );
    pendantBulb.position.set(0.6, 3.75, 0);
    ceilGroup.add(pendantBulb);
    scene.add(ceilGroup);
    // Pendant light source
    const pendantLight = new THREE.PointLight(0xfff0c0, 0, 6, 2);
    pendantLight.position.set(0.6, 3.7, 0);
    scene.add(pendantLight);

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

    // Lamp hint ring
    const hintMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const hintRing = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.5, 32),
      hintMat
    );
    hintRing.position.set(1.85, 2.5, -0.6);
    hintRing.rotation.x = -Math.PI / 2;
    scene.add(hintRing);

    // ---------- Raycaster (lamp click) ----------
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

    // ---------- Theme state ----------
    const state = {
      lamp: themeRef.current === "night" ? 1 : 0,
      ambient: 0.35,
      winI: 0.8,
      curtainY: themeRef.current === "night" ? 1 : 0.04,
      winC: new THREE.Color(0xffffff),
      skyC: new THREE.Color(0x0a1025),
      wallC: new THREE.Color(0x202635),
      floorC: new THREE.Color(0x1a1f2e),
      starOp: 1,
      celestialC: new THREE.Color(0xffffff),
      skylineOp: 0,
    };

    const getTargets = (t) => {
      if (t === "day") {
        return {
          lamp: 0,
          ambient: 0.85,
          winI: 1.5,
          curtainY: 0.04,
          winC: new THREE.Color(0xfff4d8),
          skyC: new THREE.Color(0x9ed0ff),
          wallC: new THREE.Color(0xe5e1d6),
          floorC: new THREE.Color(0xc8beaa),
          starOp: 0,
          celestialC: new THREE.Color(0xffe066),
          skylineOp: 1,
        };
      }
      return {
        lamp: 1,
        ambient: 0.3,
        winI: 0.4,
        curtainY: 1,
        winC: new THREE.Color(0x7c9bd1),
        skyC: new THREE.Color(0x0a1025),
        wallC: new THREE.Color(0x202635),
        floorC: new THREE.Color(0x1a1f2e),
        starOp: 1,
        celestialC: new THREE.Color(0xe8ecff),
        skylineOp: 0,
      };
    };

    // ---------- Animation loop ----------
    const clock = new THREE.Clock();
    let frameId;
    const lerpNum = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Detect theme change -> trigger reveal animations
      if (prevThemeRef.current !== themeRef.current) {
        revealStartRef.current = elapsed;
        prevThemeRef.current = themeRef.current;
      }
      const revealT = elapsed - revealStartRef.current;
      const inReveal = revealT < 2.0;

      const targets = getTargets(themeRef.current);

      // Use slower lerp for curtain, faster for lights
      const kLight = 1 - Math.pow(0.001, delta);
      const kCurtain = 1 - Math.pow(0.02, delta); // smoother rolling

      state.lamp = lerpNum(state.lamp, targets.lamp, kLight);
      state.ambient = lerpNum(state.ambient, targets.ambient, kLight);
      state.winI = lerpNum(state.winI, targets.winI, kLight);
      state.starOp = lerpNum(state.starOp, targets.starOp, kLight);
      state.curtainY = lerpNum(state.curtainY, targets.curtainY, kCurtain);
      state.skylineOp = lerpNum(state.skylineOp, targets.skylineOp, kLight);
      state.winC.lerp(targets.winC, kLight);
      state.skyC.lerp(targets.skyC, kLight);
      state.wallC.lerp(targets.wallC, kLight);
      state.floorC.lerp(targets.floorC, kLight);
      state.celestialC.lerp(targets.celestialC, kLight);

      // Apply
      ambient.intensity = state.ambient;
      windowLight.intensity = state.winI;
      windowLight.color.copy(state.winC);
      lampLight.intensity = state.lamp * 3.0;
      bulbMat.opacity = state.lamp;
      lampShadeMat.emissiveIntensity = state.lamp * 0.95;
      pendantLight.intensity = state.lamp * 1.4;
      pendantBulb.material.opacity = state.lamp * 0.95;
      biasMat.opacity = 0.45 + state.lamp * 0.2; // stronger at night
      biasGlowMat.opacity = 0.15 + state.lamp * 0.1;
      starMat.opacity = state.starOp;
      craterMat.opacity = state.starOp * 0.6;
      skyMat.color.copy(state.skyC);
      wallMat.color.copy(state.wallC);
      floorMat.color.copy(state.floorC);
      celestialMat.color.copy(state.celestialC);
      skylineMat.opacity = state.skylineOp;
      // Curtain roll: scale.y from 1 (down) to ~0.04 (rolled up)
      curtain.scale.y = Math.max(0.01, state.curtainY);
      // Hide tassel when rolled up (no bottom to hang from)
      tasselGroup.visible = state.curtainY > 0.15;
      // Tassel swing during transition
      if (inReveal) {
        tasselGroup.rotation.z = Math.sin(elapsed * 8) * 0.15 * (1 - revealT / 2);
      } else {
        tasselGroup.rotation.z *= 0.9;
      }

      // Celestial drifts
      celestial.position.x = 0.6 + Math.sin(elapsed * 0.08) * 0.3;
      crater1.position.x = 0.5 + Math.sin(elapsed * 0.08) * 0.3;
      crater2.position.x = 0.7 + Math.sin(elapsed * 0.08) * 0.3;

      // LED strip subtle pulse
      ledStripMat.opacity = 0.55 + Math.sin(elapsed * 1.4) * 0.25;

      // Monitor LED blink
      ledGreen.material.color.setHex(0x22c55e);
      const blink = Math.sin(elapsed * 3) > 0.9 ? 1 : 0.3;
      ledRed.material.opacity = blink;
      ledRed.material.transparent = true;

      // Clock hands — normal tick + fast spin during reveal
      const baseHourSpeed = 0.02;
      const baseMinuteSpeed = 0.25;
      const revealBoost = inReveal ? 8 * (1 - revealT / 2) : 0;
      hourHand.rotation.z -= delta * (baseHourSpeed + revealBoost);
      minuteHand.rotation.z -= delta * (baseMinuteSpeed + revealBoost * 2);

      // Plant wobble (stronger during reveal)
      leaves.forEach((leaf) => {
        const { basePos, phase } = leaf.userData;
        const wobble = inReveal ? 0.06 * (1 - revealT / 2) : 0.008;
        leaf.position.x = basePos[0] + Math.sin(elapsed * 2 + phase) * wobble;
        leaf.position.z = basePos[2] + Math.cos(elapsed * 1.7 + phase) * wobble;
      });

      // Coffee steam particles (night only: more visible)
      const steamVisible = state.lamp; // tied to night-ness
      steamParticles.forEach((p, i) => {
        p.userData.t += delta * p.userData.speed;
        if (p.userData.t > 1) p.userData.t = 0;
        const t = p.userData.t;
        p.position.x = p.userData.ox + Math.sin(t * Math.PI * 2 + i) * 0.08;
        p.position.y = 1.63 + t * 0.9;
        p.position.z = -0.55;
        p.material.opacity = steamVisible * (1 - t) * 0.4;
        p.scale.setScalar(1 + t * 1.8);
      });

      // Floating code particles
      particles.forEach((p, i) => {
        const { ox, oy, oz, speed } = p.userData;
        const t = elapsed * speed + i;
        p.position.x = ox + Math.sin(t * 0.6) * 0.12;
        p.position.y = oy + Math.sin(t) * 0.08;
        p.position.z = oz + Math.cos(t * 0.5) * 0.08;
      });

      // Hint ring
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
      curtainTex.dispose();
      screenTex.dispose();
      laptopTex.dispose();
      skylineTex.dispose();
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
