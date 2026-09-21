import { forwardRef, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const apps = [
  { id: 'profile', label: 'Sobre Mí', glyph: '◉' },
  { id: 'projects', label: 'Proyectos', glyph: '✣' },
  { id: 'skills', label: 'Trofeos', glyph: '🏆' },
  { id: 'contact', label: 'Contacto', glyph: '➤' },
  { id: 'github', label: 'GitHub', glyph: 'GH', external: 'https://github.com' },
  { id: 'linkedin', label: 'LinkedIn', glyph: 'in', external: 'https://linkedin.com' }
];

const getViewport = () => {
  if (typeof window === 'undefined') return { isMobile: false, isPortrait: false };
  const isMobile = window.innerWidth <= 900;
  return { isMobile, isPortrait: isMobile && window.innerHeight > window.innerWidth };
};

function useClock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setDate(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return {
    time: date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
    date: date.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })
      .replace(/^./, (letter) => letter.toUpperCase())
  };
}

function AppWindow({ app, onClose, children }) {
  return (
    <section className={`app-window ${app ? 'active' : ''}`} aria-hidden={!app}>
      <header className="app-header">
        <h3><span className="app-glyph">{app?.glyph || '▣'}</span> {app?.title}</h3>
        <button className="close-btn" type="button" data-close-app aria-label="Cerrar aplicación">×</button>
      </header>
      <div className="app-body">{children}</div>
    </section>
  );
}

const VitaScreen = forwardRef(function VitaScreen({ activeApp, setActiveApp, locked, setLocked, messageSent, setMessageSent }, ref) {
  const clock = useClock();

  const openApp = (app) => {
    if (app.external) {
      window.open(app.external, '_blank', 'noopener,noreferrer');
      return;
    }
    setMessageSent(false);
    setActiveApp(app.id);
  };

  const selectedApp = activeApp ? apps.find((app) => app.id === activeApp) : null;

  return (
    <div id="vita-screen-dom" ref={ref}>
      <div className="status-bar">
        <div className="status-group"><span className="status-glyph">⌁</span><span>FC-VITA</span></div>
        <div className="status-group"><span>{clock.time}</span></div>
        <div className="status-group"><span>100%</span><div className="battery"><div className="battery-level" /></div></div>
      </div>

      <div className={`lock-screen ${locked ? '' : 'unlocked'}`}>
        <button className="peel-corner" type="button" data-unlock-vita title="Desbloquear Vita">
          <span className="peel-fold" /><span className="peel-hint">JÁLAME</span>
        </button>
        <div className="lock-clock">{clock.time}</div>
        <div className="lock-date">{clock.date}</div>
        <div className="notification-stack" aria-label="Notificaciones recientes">
          <div className="notification-row"><span className="notification-icon">🏆</span><span>Tu colección de trofeos se ha actualizado</span></div>
          <div className="notification-row"><span className="notification-icon">●</span><span>Nuevo proyecto disponible en tu LiveArea</span></div>
          <div className="notification-row"><span className="notification-icon">✦</span><span>Francisco Castillo · Web Developer</span></div>
        </div>
        <div className="lock-dev"><span className="code-glyph">&lt;/&gt;</span><span>Francisco Castillo · Web Developer</span></div>
      </div>

      <div className="home-screen">
        {apps.map((app) => (
          <button className="bubble-item" type="button" key={app.id} data-app-id={app.id}>
            <span className="bubble-sphere"><span className="bubble-glyph">{app.glyph}</span></span>
            <span className="bubble-label">{app.label}</span>
          </button>
        ))}
        <button className="bubble-item" type="button" data-lock-vita>
          <span className="bubble-sphere bubble-lock"><span className="bubble-glyph">▣</span></span>
          <span className="bubble-label">Bloquear</span>
        </button>
      </div>

      <AppWindow app={selectedApp && { ...selectedApp, title: selectedApp.label === 'Sobre Mí' ? 'Francisco Castillo - Perfil' : selectedApp.label }} onClose={() => setActiveApp(null)}>
        {activeApp === 'profile' && (
          <>
            <div className="profile-banner">
              <div className="profile-pic">FC</div>
              <div><h2>Francisco Castillo</h2><p className="accent-copy">Desarrollador Web Full Stack</p><div><span className="tag">TypeScript</span><span className="tag">React / Next.js</span><span className="tag">Three.js</span><span className="tag">Node.js</span></div></div>
            </div>
            <p>Desarrollo experiencias web interactivas, dinámicas y con interfaces cuidadas. Combino tecnología moderna con conceptos creativos e interactivos.</p>
          </>
        )}

        {activeApp === 'projects' && (
          <div className="project-grid">
            {[
              ['E-Commerce 3D Interactive', 'Configurador visual con Three.js, React y pagos en tiempo real.', 'Next.js', 'Three.js'],
              ['Retro Console Web UI', 'Emulación de consolas clásicas con shaders y Web Audio API.', 'TypeScript', 'Tailwind'],
              ['Task Quest RPG', 'Gestor de tareas gamificado para programadores.', 'React', 'Firebase'],
              ['API Microservices', 'Arquitectura escalable en NestJS, Kafka y Redis.', 'NestJS', 'Docker']
            ].map(([title, description, firstTag, secondTag]) => (
              <article className="project-item" key={title}><h4>{title}</h4><p>{description}</p><span className="tag">{firstTag}</span><span className="tag">{secondTag}</span></article>
            ))}
          </div>
        )}

        {activeApp === 'skills' && (
          <div>
            {[['🏆', 'Platino: Web Master', 'Frontend, Backend y Arquitectura Web.'], ['🥇', 'Oro: Frontend & 3D WebGL', 'React, Vue, Three.js, Canvas y animaciones fluidas.'], ['🥇', 'Oro: Backend & Cloud', 'Node.js, Express, NestJS, Docker y bases de datos.']].map(([medal, title, description]) => (
              <div className="trophy-row" key={title}><span className="medal">{medal}</span><div><strong>{title}</strong><p className="accent-copy small-copy">{description}</p></div></div>
            ))}
          </div>
        )}

        {activeApp === 'contact' && (
          <form onSubmit={(event) => { event.preventDefault(); setMessageSent(true); }}>
            <input className="input-field" type="text" placeholder="Tu nombre" required />
            <input className="input-field" type="email" placeholder="Tu correo electrónico" required />
            <textarea className="input-field" rows="3" placeholder="Tu mensaje…" required />
            <button type="submit" className="action-btn">Enviar mensaje</button>
            {messageSent && <p className="form-feedback" role="status">Mensaje preparado correctamente.</p>}
          </form>
        )}
      </AppWindow>
    </div>
  );
});

function App() {
  const containerRef = useRef(null);
  const screenRef = useRef(null);
  const [viewport, setViewport] = useState(getViewport);
  const [activeApp, setActiveApp] = useState(null);
  const [locked, setLocked] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [modelState, setModelState] = useState({ state: 'loading', message: 'Cargando PS_Vita.glb…' });
  const { isMobile, isPortrait } = viewport;
  const mobileScale = Math.min((window.innerWidth - 32) / 960, (window.innerHeight - 32) / 544);

  useEffect(() => {
    const updateViewport = () => setViewport(getViewport());
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const screenDom = screenRef.current;
    if (isMobile || !container || !screenDom) return undefined;

    const scene = new THREE.Scene();
    const cssScene = new THREE.Scene();
    const vitaRoot = new THREE.Group();
    const cssRoot = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const cssRenderer = new CSS3DRenderer();
    const screenObject = new CSS3DObject(screenDom);
    const startedAt = performance.now();
    const drag = { active: false, x: 0, y: 0, targetX: 0, targetY: 0 };
    let animationFrame;
    let model;

    camera.position.set(0, 0, window.innerWidth < 768 ? 82 : 36);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.inset = '0';
    cssRenderer.domElement.style.pointerEvents = 'none';
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    container.append(renderer.domElement, cssRenderer.domElement);
    scene.add(vitaRoot, new THREE.AmbientLight(0xffffff, 0.85));
    cssScene.add(cssRoot);
    cssRoot.add(screenObject);
    screenObject.visible = false;

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.3);
    mainLight.position.set(12, 18, 30);
    scene.add(mainLight);
    const purpleBacklight = new THREE.PointLight(0xa855f7, 2.5, 40);
    purpleBacklight.position.set(-18, -12, 15);
    scene.add(purpleBacklight);

    const syncCssRoot = () => {
      cssRoot.position.copy(vitaRoot.position);
      cssRoot.quaternion.copy(vitaRoot.quaternion);
      cssRoot.scale.copy(vitaRoot.scale);
    };

    const attachMenuToScreen = (loadedModel) => {
      const screenGroup = loadedModel.getObjectByName('inner_screen_low');
      let screenMesh;
      screenGroup?.traverse((object) => {
        if (!screenMesh && object.isMesh) screenMesh = object;
      });
      if (!screenMesh) throw new Error('No se encontró la malla inner_screen_low en el modelo.');

      screenMesh.geometry.computeBoundingBox();
      const bounds = screenMesh.geometry.boundingBox;
      const localCenter = bounds.getCenter(new THREE.Vector3());
      const localSize = bounds.getSize(new THREE.Vector3());
      loadedModel.updateMatrixWorld(true);
      vitaRoot.updateMatrixWorld(true);
      screenMesh.updateWorldMatrix(true, false);
      const worldPosition = screenMesh.localToWorld(localCenter.clone());
      const worldQuaternion = screenMesh.getWorldQuaternion(new THREE.Quaternion());
      const rootQuaternion = vitaRoot.getWorldQuaternion(new THREE.Quaternion());
      const rootScale = vitaRoot.getWorldScale(new THREE.Vector3());
      const screenScale = screenMesh.getWorldScale(new THREE.Vector3());

      screenObject.position.copy(vitaRoot.worldToLocal(worldPosition));
      screenObject.quaternion.copy(rootQuaternion.invert().multiply(worldQuaternion));
      screenObject.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)));
      screenObject.scale.set(
        (localSize.x * screenScale.x / rootScale.x) / 960,
        (localSize.z * screenScale.z / rootScale.z) / 544,
        1
      );
      screenObject.visible = true;
      return screenGroup.name;
    };

    const frameModel = (loadedModel) => {
      loadedModel.position.set(0, 0, 0);
      loadedModel.scale.setScalar(1);
      loadedModel.updateMatrixWorld(true);
      const initialBounds = new THREE.Box3().setFromObject(loadedModel);
      const initialSize = initialBounds.getSize(new THREE.Vector3());
      const desktopTargetSize = window.innerWidth >= 1100 ? 29 : 25;
      loadedModel.scale.setScalar(desktopTargetSize / Math.max(initialSize.x, initialSize.y, initialSize.z));
      loadedModel.updateMatrixWorld(true);
      loadedModel.position.sub(new THREE.Box3().setFromObject(loadedModel).getCenter(new THREE.Vector3()));
      loadedModel.updateMatrixWorld(true);
    };

    const loader = new GLTFLoader();
    loader.load('/PS_Vita.glb', (gltf) => {
      try {
        model = gltf.scene;
        frameModel(model);
        vitaRoot.add(model);
        const detectedScreen = attachMenuToScreen(model);
        setModelState({ state: 'ready', message: `Modelo cargado · pantalla detectada: ${detectedScreen}` });
      } catch (error) {
        console.error(error);
        setModelState({ state: 'error', message: error.message });
      }
    }, undefined, (error) => {
      console.error('No se pudo cargar PS_Vita.glb.', error);
      setModelState({ state: 'error', message: 'No se pudo cargar PS_Vita.glb. Revisa la carpeta public.' });
    });

    const onPointerDown = (event) => {
      if (event.target.closest('#vita-screen-dom')) return;
      drag.active = true;
      drag.x = event.clientX;
      drag.y = event.clientY;
    };
    const onPointerMove = (event) => {
      if (!drag.active) return;
      drag.targetY = THREE.MathUtils.clamp(drag.targetY + (event.clientX - drag.x) * 0.004, -0.38, 0.38);
      drag.targetX = THREE.MathUtils.clamp(drag.targetX + (event.clientY - drag.y) * 0.004, -0.28, 0.28);
      drag.x = event.clientX;
      drag.y = event.clientY;
    };
    const stopDragging = () => { drag.active = false; };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDragging);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.z = window.innerWidth < 768 ? 82 : 36;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const renderLoop = () => {
      animationFrame = window.requestAnimationFrame(renderLoop);
      const time = (performance.now() - startedAt) / 1000;
      if (!drag.active) {
        drag.targetX *= 0.94;
        drag.targetY *= 0.94;
      }
      vitaRoot.rotation.x += (Math.PI / 2 + drag.targetX + Math.sin(time * 1.5) * 0.015 - vitaRoot.rotation.x) * 0.08;
      vitaRoot.rotation.y += (drag.targetY + Math.cos(time * 1.2) * 0.018 - vitaRoot.rotation.y) * 0.08;
      syncCssRoot();
      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    };
    renderLoop();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (model) vitaRoot.remove(model);
      container.replaceChildren();
    };
  }, [isMobile]);

  useEffect(() => {
    const screenDom = screenRef.current;
    if (!screenDom) return undefined;

    const onScreenClick = (event) => {
      const appButton = event.target.closest('[data-app-id]');
      if (appButton) {
        const app = apps.find((item) => item.id === appButton.dataset.appId);
        if (app?.external) window.open(app.external, '_blank', 'noopener,noreferrer');
        else if (app) {
          setMessageSent(false);
          setActiveApp(app.id);
        }
        return;
      }
      if (event.target.closest('[data-lock-vita]')) setLocked(true);
      if (event.target.closest('[data-unlock-vita]')) setLocked(false);
      if (event.target.closest('[data-close-app]')) setActiveApp(null);
    };

    const onScreenSubmit = (event) => {
      if (!event.target.matches('form')) return;
      event.preventDefault();
      setMessageSent(true);
    };

    screenDom.addEventListener('click', onScreenClick);
    screenDom.addEventListener('submit', onScreenSubmit);
    return () => {
      screenDom.removeEventListener('click', onScreenClick);
      screenDom.removeEventListener('submit', onScreenSubmit);
    };
  }, [isPortrait]);

  return (
    <main className="vita-app">
      {!isMobile && <div ref={containerRef} id="canvas-container" />}

      {!isMobile && <>
        <div className="model-status" data-state={modelState.state} role="status" aria-live="polite">{modelState.message}</div>
      <div className="hint-bar"><span className="hint-glyph">✣</span><span>Arrastra <strong>por fuera</strong> para rotar la PS Vita · Usa las burbujas para abrir el menú</span></div>
        <VitaScreen ref={screenRef} activeApp={activeApp} setActiveApp={setActiveApp} locked={locked} setLocked={setLocked} messageSent={messageSent} setMessageSent={setMessageSent} />
      </>}

      {isMobile && isPortrait && (
        <section className="portrait-warning" role="status" aria-live="polite">
          <div className="rotate-phone" aria-hidden="true"><span className="rotate-phone-screen" /><span className="rotate-arrow">↻</span></div>
          <p className="warning-kicker">PS VITA INTERFACE</p>
          <h1>Gira tu teléfono</h1>
          <p>Colócalo en posición lateral para cargar la interfaz de la PS Vita.</p>
          <span className="warning-status"><span className="warning-glyph">▣</span> Esperando orientación horizontal</span>
        </section>
      )}

      {isMobile && !isPortrait && (
        <div className="mobile-interface">
          <div className="mobile-screen-shell" style={{ '--mobile-scale': mobileScale }}>
            <VitaScreen ref={screenRef} activeApp={activeApp} setActiveApp={setActiveApp} locked={locked} setLocked={setLocked} messageSent={messageSent} setMessageSent={setMessageSent} />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
