import { forwardRef, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const apps = [
  { id: 'profile', label: 'Sobre Mí', glyph: '●', icon: 'profile' },
  { id: 'projects', label: 'Proyectos', glyph: '✣', icon: 'projects' },
  { id: 'skills', label: 'Trofeos', glyph: '♜', icon: 'trophy' },
  { id: 'contact', label: 'Contacto', glyph: '➤', icon: 'contact' },
  { id: 'github', label: 'GitHub', glyph: 'GH', icon: 'github', external: 'https://github.com/Frxn5J' },
  { id: 'linkedin', label: 'LinkedIn', glyph: 'in', icon: 'linkedin', external: 'https://linkedin.com' }
];

const defaultProjects = [
  {
    id: 'vagaroute-ai',
    title: 'VagaRoute AI',
    description: 'Gateway de IA self-hosted con API compatible con OpenAI, routing entre proveedores, failover, límites, caché y dashboard.',
    tags: ['TypeScript', 'Bun', 'SQLite', 'Docker'],
    image: '',
    url: 'https://github.com/Frxn5J/vagaroute-ai'
  },
  {
    id: 'telestremio-autorenamebot',
    title: 'TeleStremio AutoRenameBot',
    description: 'Bot de Telegram para renombrar y enviar vídeos a un canal sin almacenarlos localmente; admite flujos de películas y series y metadatos.',
    tags: ['Python', 'Telegram', 'Docker', 'SQLite'],
    image: '',
    url: 'https://github.com/Frxn5J/TeleStremio-autorenamebot'
  },
  {
    id: 'ndo-noticias-front',
    title: 'NDO Noticias Front',
    description: 'Aplicación móvil en React para Noticias De Ojuelo, conectada a un backend Laravel y PostgreSQL.',
    tags: ['React', 'Laravel', 'PostgreSQL'],
    image: '',
    url: ''
  }
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

function VitaIcon({ type }) {
  const common = { viewBox: '0 0 48 48', role: 'img', 'aria-hidden': 'true' };

  if (type === 'profile') return <svg {...common}><circle cx="24" cy="15" r="8" /><path d="M9 42c1.6-9.4 6.8-14 15-14s13.4 4.6 15 14Z" /></svg>;
  if (type === 'projects') return <svg {...common}><path d="M24 7v34M7 24h34M12 12l24 24M36 12 12 36" /><circle cx="24" cy="24" r="5" /></svg>;
  if (type === 'trophy') return <svg {...common}><path d="M16 9h16v8c0 7-3.2 11-8 11s-8-4-8-11Z" /><path d="M16 13H9v3c0 5 3 8 8 8M32 13h7v3c0 5-3 8-8 8M24 28v8M16 40h16M19 36h10" /></svg>;
  if (type === 'contact') return <svg {...common}><path d="m7 24 34-15-9 30-9-11Z" /><path d="m23 28 11 9" /></svg>;
  if (type === 'github') return <svg {...common}><path d="M18 39c-9 3-9-5-13-6m26 9v-7c0-2-1-4-3-5 7-1 14-3 14-14a11 11 0 0 0-3-8c.3-1.2.3-3.4-1-6 0 0-2.4-.8-8 3a21 21 0 0 0-12 0c-5.6-3.8-8-3-8-3-1.3 2.6-1.3 4.8-1 6a11 11 0 0 0-3 8c0 11 7 13 14 14-2 1-3 3-3 6v6" /></svg>;
  if (type === 'linkedin') return <svg {...common}><path d="M13 19v18M13 12v.2M21 37V19m0 8c0-5 2.6-8 7-8s7 3 7 8v10" /></svg>;
  if (type === 'lock') return <svg {...common}><rect x="11" y="20" width="26" height="20" rx="3" /><path d="M16 20v-5a8 8 0 0 1 16 0v5M24 29v4" /></svg>;
  return <svg {...common}><circle cx="24" cy="24" r="14" /></svg>;
}

function AppWindow({ app, onClose, children }) {
  return (
    <section className={`app-window ${app ? 'active' : ''}`} aria-hidden={!app}>
      <header className="app-header">
        <h3><span className="app-glyph"><VitaIcon type={app?.icon || 'lock'} /></span> {app?.title}</h3>
        <button className="close-btn" type="button" data-close-app aria-label="Cerrar aplicación">×</button>
      </header>
      <div className="app-body">{children}</div>
    </section>
  );
}

function ProjectsPanel({ projects, editorOpen, editingProjectId }) {
  const editingProject = projects.find((project) => project.id === editingProjectId) || projects[0];

  return (
    <div className="projects-panel">
      <div className="projects-toolbar">
        <div>
          <p className="projects-kicker">PROYECTOS DESTACADOS</p>
          <p className="projects-note">Contenido editable en este navegador, sin backend.</p>
        </div>
        <button className="action-btn editor-toggle" type="button" data-project-editor-toggle>
          Configurar proyectos
        </button>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-item" key={project.id}>
            <div className="project-thumb">
              {project.image ? <img src={project.image} alt={`Imagen de ${project.title}`} /> : <VitaIcon type="projects" />}
            </div>
            <div className="project-copy">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <div className="project-tags">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
              <div className="project-actions">
                {project.url && <a className="project-link" href={project.url} target="_blank" rel="noreferrer">Ver repositorio</a>}
                <button className="project-edit-btn" type="button" data-project-edit={project.id}>Editar</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editorOpen && editingProject && (
        <form className="project-editor" data-project-editor key={editingProject.id}>
          <div className="editor-heading">
            <div><p className="projects-kicker">EDITOR LOCAL</p><h4>Configura lo que aparece en cada proyecto</h4></div>
            <span className="editor-storage">Se guarda en este navegador</span>
          </div>
          <label className="editor-field">Proyecto
            <select name="projectId" data-project-select value={editingProject.id} onChange={() => {}}>
              {projects.map((project) => <option value={project.id} key={project.id}>{project.title}</option>)}
            </select>
          </label>
          <div className="editor-fields-grid">
            <label className="editor-field">Título<input name="title" defaultValue={editingProject.title} required /></label>
            <label className="editor-field">Repositorio<input name="url" type="url" defaultValue={editingProject.url} placeholder="https://github.com/..." /></label>
          </div>
          <label className="editor-field">Descripción<textarea name="description" rows="3" defaultValue={editingProject.description} required /></label>
          <label className="editor-field">Tecnologías <span className="field-hint">separadas por comas</span><input name="tags" defaultValue={editingProject.tags.join(', ')} placeholder="React, TypeScript, Docker" /></label>
          <label className="editor-field">Imagen del proyecto<input name="image" type="file" accept="image/*" data-project-image /><span className="field-hint">La imagen se convierte a datos locales, no se sube a ningún servidor.</span></label>
          <div className="editor-actions">
            {editingProject.image && <button className="secondary-btn" type="button" data-project-clear-image>Quitar imagen actual</button>}
            <button className="secondary-btn" type="button" data-project-cancel>Cancelar</button>
            <button className="action-btn" type="submit">Guardar cambios</button>
          </div>
        </form>
      )}
    </div>
  );
}

const VitaScreen = forwardRef(function VitaScreen({ activeApp, setActiveApp, locked, setLocked, messageSent, setMessageSent, projects, setProjects, projectEditorOpen, setProjectEditorOpen, editingProjectId, setEditingProjectId }, ref) {
  const clock = useClock();

  const selectedApp = activeApp ? apps.find((app) => app.id === activeApp) : null;

  return (
    <div id="vita-screen-dom" ref={ref}>
      <div className="status-bar">
        <div className="status-group"><span className="status-wifi" aria-hidden="true">◔</span><span className="status-home" aria-hidden="true">⌂</span><span>FC-VITA</span></div>
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
          <div className="notification-row"><span className="notification-icon"><VitaIcon type="trophy" /></span><span>Tu colección de trofeos se ha actualizado</span></div>
          <div className="notification-row"><span className="notification-icon"><VitaIcon type="projects" /></span><span>Nuevo proyecto disponible en tu LiveArea</span></div>
          <div className="notification-row"><span className="notification-icon"><VitaIcon type="profile" /></span><span>Francisco Castillo · Web Developer</span></div>
        </div>
        <div className="lock-dev"><span className="code-glyph">&lt;/&gt;</span><span>Francisco Castillo · Web Developer</span></div>
      </div>

      <div className="home-screen">
        {apps.map((app) => (
          <button className="bubble-item" type="button" key={app.id} data-app-id={app.id}>
            <span className="bubble-sphere"><span className="bubble-glyph"><VitaIcon type={app.icon} /></span></span>
            <span className="bubble-label">{app.label}</span>
          </button>
        ))}
        <button className="bubble-item" type="button" data-lock-vita>
          <span className="bubble-sphere bubble-lock"><span className="bubble-glyph"><VitaIcon type="lock" /></span></span>
          <span className="bubble-label">Bloquear</span>
        </button>
        <div className="home-pagination" aria-label="Página 1 de 3"><span className="active" /><span /><span /></div>
      </div>

      <AppWindow app={selectedApp && { ...selectedApp, title: selectedApp.label === 'Sobre Mí' ? 'José Francisco Castillo - Perfil' : selectedApp.label }} onClose={() => setActiveApp(null)}>
        {activeApp === 'profile' && (
          <>
            <div className="profile-banner">
              <div className="profile-pic">FC</div>
              <div><h2>José Francisco Castillo Marmolejo</h2><p className="accent-copy">Full Stack Developer · Jr Developer</p><p className="profile-role">Manuel Solis Law Firm</p><div><span className="tag">React</span><span className="tag">PHP / Laravel</span><span className="tag">Go</span><span className="tag">IA &amp; Self-hosting</span></div></div>
            </div>
            <p>Soy ingeniero en Sistemas Inteligentes y desarrollo aplicaciones Full Stack, automatizaciones e integraciones para resolver problemas reales. Actualmente profundizo en Go, APIs de inteligencia artificial y herramientas self-hosted.</p>
            <div className="profile-contact-links"><a className="profile-link" href="https://github.com/Frxn5J" target="_blank" rel="noreferrer">github.com/Frxn5J</a><a className="profile-link" href="mailto:jojosefrancisco2002@gmail.com">jojosefrancisco2002@gmail.com</a></div>
          </>
        )}

        {activeApp === 'projects' && (
          <ProjectsPanel projects={projects} editorOpen={projectEditorOpen} editingProjectId={editingProjectId} />
        )}

        {activeApp === 'skills' && (
          <div>
            {[['trophy', 'Frontend', 'React, HTML, CSS, JavaScript y TypeScript.'], ['trophy', 'Backend y datos', 'PHP, Laravel, Go, SQLite, MySQL, MongoDB y PostgreSQL.'], ['trophy', 'IA, automatización y self-hosting', 'APIs de IA, bots, Docker, GitHub y herramientas autoalojadas.']].map(([medal, title, description]) => (
              <div className="trophy-row" key={title}><span className="medal"><VitaIcon type={medal} /></span><div><strong>{title}</strong><p className="accent-copy small-copy">{description}</p></div></div>
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
  const [projectEditorOpen, setProjectEditorOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(defaultProjects[0].id);
  const [projects, setProjects] = useState(() => {
    if (typeof window === 'undefined') return defaultProjects;
    try {
      const stored = window.localStorage.getItem('fc-vita-projects');
      const parsed = stored ? JSON.parse(stored) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : defaultProjects;
    } catch {
      return defaultProjects;
    }
  });
  const [modelState, setModelState] = useState({ state: 'loading', message: 'Cargando PS_Vita.glb…' });
  const { isMobile, isPortrait } = viewport;
  const mobileScale = Math.min((window.innerWidth - 32) / 960, (window.innerHeight - 32) / 544);

  useEffect(() => {
    try {
      window.localStorage.setItem('fc-vita-projects', JSON.stringify(projects));
    } catch (error) {
      console.warn('No se pudieron guardar los proyectos localmente.', error);
    }
  }, [projects]);

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

    const renderScene = () => {
      syncCssRoot();
      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
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
      const desktopTargetSize = window.innerWidth >= 1100 ? 34 : 30;
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
        vitaRoot.rotation.set(Math.PI / 2, 0, 0);
        setModelState({ state: 'ready', message: `Modelo cargado · pantalla detectada: ${detectedScreen}` });
        renderScene();
      } catch (error) {
        console.error(error);
        setModelState({ state: 'error', message: error.message });
      }
    }, undefined, (error) => {
      console.error('No se pudo cargar PS_Vita.glb.', error);
      setModelState({ state: 'error', message: 'No se pudo cargar PS_Vita.glb. Revisa la carpeta public.' });
    });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.z = window.innerWidth < 768 ? 82 : 36;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
      renderScene();
    };
    window.addEventListener('resize', onResize);

    return () => {
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
      if (event.target.closest('[data-project-editor-toggle]')) {
        setProjectEditorOpen(true);
        return;
      }
      const projectEdit = event.target.closest('[data-project-edit]');
      if (projectEdit) {
        setEditingProjectId(projectEdit.dataset.projectEdit);
        setProjectEditorOpen(true);
        return;
      }
      if (event.target.closest('[data-project-cancel]')) {
        setProjectEditorOpen(false);
        return;
      }
      if (event.target.closest('[data-project-clear-image]')) {
        setProjects((current) => current.map((project) => project.id === editingProjectId ? { ...project, image: '' } : project));
        return;
      }
      const appButton = event.target.closest('[data-app-id]');
      if (appButton) {
        const app = apps.find((item) => item.id === appButton.dataset.appId);
        if (app?.external) window.open(app.external, '_blank', 'noopener,noreferrer');
        else if (app) {
          setMessageSent(false);
          if (app.id !== 'projects') setProjectEditorOpen(false);
          setActiveApp(app.id);
        }
        return;
      }
      if (event.target.closest('[data-lock-vita]')) setLocked(true);
      if (event.target.closest('[data-unlock-vita]')) setLocked(false);
      if (event.target.closest('[data-close-app]')) setActiveApp(null);
    };

    const onScreenChange = (event) => {
      if (event.target.matches('[data-project-select]')) setEditingProjectId(event.target.value);
    };

    const onScreenSubmit = (event) => {
      const projectForm = event.target.closest('form[data-project-editor]');
      if (projectForm) {
        event.preventDefault();
        const formData = new FormData(projectForm);
        const projectId = String(formData.get('projectId') || '');
        const saveProject = (image) => {
          const tags = String(formData.get('tags') || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
          setProjects((current) => current.map((project) => project.id === projectId ? {
            ...project,
            title: String(formData.get('title') || project.title).trim(),
            description: String(formData.get('description') || project.description).trim(),
            tags,
            url: String(formData.get('url') || '').trim(),
            image: image === null ? project.image : image
          } : project));
          setProjectEditorOpen(false);
        };
        const imageFile = projectForm.querySelector('[data-project-image]')?.files?.[0];
        if (imageFile) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            const preview = new Image();
            preview.addEventListener('load', () => {
              const maxDimension = 1000;
              const scale = Math.min(1, maxDimension / Math.max(preview.naturalWidth, preview.naturalHeight));
              const canvas = document.createElement('canvas');
              canvas.width = Math.max(1, Math.round(preview.naturalWidth * scale));
              canvas.height = Math.max(1, Math.round(preview.naturalHeight * scale));
              canvas.getContext('2d')?.drawImage(preview, 0, 0, canvas.width, canvas.height);
              saveProject(canvas.toDataURL('image/webp', 0.78));
            }, { once: true });
            preview.src = String(reader.result || '');
          }, { once: true });
          reader.addEventListener('error', () => console.error('No se pudo leer la imagen del proyecto.'), { once: true });
          reader.readAsDataURL(imageFile);
        } else {
          saveProject(null);
        }
        return;
      }
      if (!event.target.matches('form')) return;
      event.preventDefault();
      setMessageSent(true);
    };

    screenDom.addEventListener('click', onScreenClick);
    screenDom.addEventListener('change', onScreenChange);
    screenDom.addEventListener('submit', onScreenSubmit);
    return () => {
      screenDom.removeEventListener('click', onScreenClick);
      screenDom.removeEventListener('change', onScreenChange);
      screenDom.removeEventListener('submit', onScreenSubmit);
    };
  }, [editingProjectId, isPortrait, projects]);

  return (
    <main className="vita-app">
      {!isMobile && <div ref={containerRef} id="canvas-container" />}

      {!isMobile && <>
        <div className="model-status" data-state={modelState.state} role="status" aria-live="polite">{modelState.message}</div>
      <div className="hint-bar"><span className="hint-glyph">✣</span><span>Selecciona una burbuja para abrir una sección del menú</span></div>
        <VitaScreen ref={screenRef} activeApp={activeApp} setActiveApp={setActiveApp} locked={locked} setLocked={setLocked} messageSent={messageSent} setMessageSent={setMessageSent} projects={projects} setProjects={setProjects} projectEditorOpen={projectEditorOpen} setProjectEditorOpen={setProjectEditorOpen} editingProjectId={editingProjectId} setEditingProjectId={setEditingProjectId} />
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
            <VitaScreen ref={screenRef} activeApp={activeApp} setActiveApp={setActiveApp} locked={locked} setLocked={setLocked} messageSent={messageSent} setMessageSent={setMessageSent} projects={projects} setProjects={setProjects} projectEditorOpen={projectEditorOpen} setProjectEditorOpen={setProjectEditorOpen} editingProjectId={editingProjectId} setEditingProjectId={setEditingProjectId} />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
