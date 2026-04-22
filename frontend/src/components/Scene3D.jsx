import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Pure Three.js — Security Network:
// - Nodes distributed in 3D space
// - Connections between close neighbors
// - Pulses travel along edges (red = attack attempt, cyan = defense/handshake)
// - Central Guardian node with pulsing ring
// No JSX for three primitives (avoids babel x-line-number injection issues).
export default function Scene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const p1 = new THREE.PointLight(0x22d3ee, 1.2, 25);
    p1.position.set(4, 4, 6);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x3b82f6, 0.9, 25);
    p2.position.set(-5, -3, 3);
    scene.add(p2);

    // ----- Build network graph -----
    const NODE_COUNT = 16;
    const nodes = [];
    const nodeGeo = new THREE.IcosahedronGeometry(0.09, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.6,
    });

    // Distribute nodes roughly on a sphere + some randomness
    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
      const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;
      const r = 2.4 + (Math.random() - 0.5) * 0.4;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
      mesh.position.set(x, y, z);
      mesh.userData = {
        basePos: new THREE.Vector3(x, y, z),
        pulse: 0,
      };
      nodes.push(mesh);
    }

    // Graph root group so we can rotate the whole graph
    const graph = new THREE.Group();
    nodes.forEach((n) => graph.add(n));

    // ----- Edges -----
    const edges = [];
    const MAX_DIST = 2.2;
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.22,
    });
    for (let i = 0; i < nodes.length; i++) {
      // connect to up to 3 nearest neighbors
      const dists = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const d = nodes[i].position.distanceTo(nodes[j].position);
        if (d < MAX_DIST) dists.push({ j, d });
      }
      dists.sort((a, b) => a.d - b.d);
      dists.slice(0, 3).forEach(({ j }) => {
        // Avoid duplicates
        if (edges.some((e) => (e.a === i && e.b === j) || (e.a === j && e.b === i))) {
          return;
        }
        const geo = new THREE.BufferGeometry().setFromPoints([
          nodes[i].position,
          nodes[j].position,
        ]);
        const line = new THREE.Line(geo, edgeMat);
        graph.add(line);
        edges.push({ a: i, b: j, line });
      });
    }

    // ----- Central Guardian -----
    const guardianGeo = new THREE.IcosahedronGeometry(0.45, 1);
    const guardianMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.9,
      wireframe: true,
    });
    const guardian = new THREE.Mesh(guardianGeo, guardianMat);
    graph.add(guardian);

    const guardianCoreGeo = new THREE.IcosahedronGeometry(0.22, 0);
    const guardianCoreMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.2,
    });
    const guardianCore = new THREE.Mesh(guardianCoreGeo, guardianCoreMat);
    graph.add(guardianCore);

    // Guardian pulsing ring
    const ringGeo = new THREE.RingGeometry(0.6, 0.63, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    graph.add(ring);

    scene.add(graph);

    // ----- Pulses traveling along edges -----
    // Each pulse is a small glowing sphere moving from a->b.
    // Type "attack" (red) gets neutralized mid-path turning to cyan "secured".
    const pulseGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const pulses = [];

    const spawnPulse = () => {
      if (edges.length === 0) return;
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const isAttack = Math.random() < 0.55;
      const mat = new THREE.MeshBasicMaterial({
        color: isAttack ? 0xef4444 : 0x22d3ee,
        transparent: true,
        opacity: 0.95,
      });
      const mesh = new THREE.Mesh(pulseGeo, mat);
      graph.add(mesh);
      pulses.push({
        mesh,
        mat,
        from: nodes[edge.a].position.clone(),
        to: nodes[edge.b].position.clone(),
        t: 0,
        speed: 0.6 + Math.random() * 0.6,
        isAttack,
        converted: false,
        endNode: edge.b,
      });
    };

    // Seed some pulses
    const pulseInterval = setInterval(spawnPulse, 280);

    // ----- Starfield (far) -----
    const STAR_COUNT = 240;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 50;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    const starMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ----- Animation loop -----
    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Rotate graph slowly
      graph.rotation.y += delta * 0.12;
      graph.rotation.x = Math.sin(elapsed * 0.1) * 0.2;

      // Guardian animations
      guardian.rotation.y += delta * 0.35;
      guardian.rotation.x -= delta * 0.15;
      guardianCore.rotation.y -= delta * 0.8;
      const s = 1 + Math.sin(elapsed * 2) * 0.08;
      ring.scale.set(s, s, s);
      ringMat.opacity = 0.35 + Math.sin(elapsed * 2) * 0.25;

      // Node subtle float + pulse decay
      nodes.forEach((n, i) => {
        const base = n.userData.basePos;
        const t = elapsed + i;
        n.position.x = base.x + Math.sin(t * 0.7) * 0.04;
        n.position.y = base.y + Math.cos(t * 0.9) * 0.04;
        n.userData.pulse = Math.max(0, n.userData.pulse - delta * 1.5);
        const scale = 1 + n.userData.pulse;
        n.scale.set(scale, scale, scale);
        n.material.emissiveIntensity = 0.6 + n.userData.pulse * 1.2;
      });

      // Pulses travel
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += delta * p.speed;
        // Mid-path: attacks get "neutralized" → turn cyan
        if (p.isAttack && !p.converted && p.t > 0.55) {
          p.mat.color.setHex(0x22d3ee);
          p.converted = true;
        }
        if (p.t >= 1) {
          // flash target node
          const target = nodes[p.endNode];
          if (target) {
            target.userData.pulse = 0.8;
          }
          graph.remove(p.mesh);
          p.mat.dispose();
          pulses.splice(i, 1);
          continue;
        }
        p.mesh.position.lerpVectors(p.from, p.to, p.t);
        const glow = 1 - Math.abs(p.t - 0.5) * 2;
        p.mat.opacity = 0.5 + glow * 0.5;
      }

      // Stars subtle drift
      stars.rotation.y += delta * 0.015;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(pulseInterval);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      guardianGeo.dispose();
      guardianMat.dispose();
      guardianCoreGeo.dispose();
      guardianCoreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      pulseGeo.dispose();
      edgeMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
