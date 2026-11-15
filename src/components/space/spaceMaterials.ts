import * as THREE from 'three';

const RIM_VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export interface RimGlowOptions {
  colorVec3: string;
  power: string;
  intensityScale: string;
  depthWrite?: boolean;
}

/**
 * Fresnel-style atmospheric/corona rim shader material shared by the Sun and Earth.
 */
export function createRimGlowMaterial({
  colorVec3,
  power,
  intensityScale,
  depthWrite = true,
}: RimGlowOptions): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: RIM_VERTEX_SHADER,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), ${power});
        gl_FragColor = vec4(${colorVec3}, 1.0) * intensity * ${intensityScale};
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite,
  });
}

export interface EarthTextureBundle {
  diffuse: THREE.Texture;
  normal: THREE.Texture;
  specular: THREE.Texture;
  clouds: THREE.Texture;
  moon: THREE.Texture;
}

/**
 * Loads Earth & Moon surface textures with consistent color space configuration and error reporting.
 */
export function loadEarthTextureBundle(): EarthTextureBundle {
  const loader = new THREE.TextureLoader();
  const loadTexture = (url: string, colorSpace?: THREE.ColorSpace): THREE.Texture => {
    const tex = loader.load(url, undefined, undefined, (err) => {
      console.warn(`[ThreeSpaceSystem] Failed to load texture "${url}":`, err);
    });
    if (colorSpace) {
      tex.colorSpace = colorSpace;
    }
    return tex;
  };

  return {
    diffuse: loadTexture('/textures/earth_atmos_2048.jpg', THREE.SRGBColorSpace),
    normal: loadTexture('/textures/earth_normal_2048.jpg'),
    specular: loadTexture('/textures/earth_specular_2048.jpg'),
    clouds: loadTexture('/textures/earth_clouds_1024.png', THREE.SRGBColorSpace),
    moon: loadTexture('/textures/moon_1024.jpg', THREE.SRGBColorSpace),
  };
}

/**
 * Builds a reusable texture lookup shared by planetary globes and structure cutaways.
 */
export function buildPlanetSurfaceTextures(
  earthDiffuse: THREE.Texture,
  canvasMap: Record<string, HTMLCanvasElement>
): {
  surfaceTextures: Record<string, THREE.Texture>;
  protectedTextures: Set<THREE.Texture>;
} {
  const surfaceTextures: Record<string, THREE.Texture> = {
    earth: earthDiffuse,
  };
  const protectedTextures = new Set<THREE.Texture>([earthDiffuse]);

  for (const [id, canvas] of Object.entries(canvasMap)) {
    const tex = new THREE.CanvasTexture(canvas);
    surfaceTextures[id] = tex;
    protectedTextures.add(tex);
  }

  return { surfaceTextures, protectedTextures };
}

const TEXTURE_KEYS = ['map', 'normalMap', 'roughnessMap', 'emissiveMap', 'alphaMap'] as const;

function disposeSingleMaterial(
  material: THREE.Material,
  protectedTextures?: Set<THREE.Texture>
): void {
  const matRecord = material as unknown as Record<string, unknown>;
  for (const key of TEXTURE_KEYS) {
    const tex = matRecord[key];
    if (tex instanceof THREE.Texture && !protectedTextures?.has(tex)) {
      tex.dispose();
    }
  }
  material.dispose();
}

/**
 * Recursively disposes geometries, materials, and non-shared textures under a Three.js Object3D.
 */
export function disposeObject3D(
  root: THREE.Object3D,
  protectedTextures?: Set<THREE.Texture>
): void {
  root.traverse((obj) => {
    if (obj instanceof THREE.InstancedMesh) {
      obj.dispose();
    }
    const renderable = obj as THREE.Mesh;
    if (renderable.geometry) {
      renderable.geometry.dispose();
    }
    const mat = renderable.material;
    if (Array.isArray(mat)) {
      mat.forEach((m) => disposeSingleMaterial(m, protectedTextures));
    } else if (mat) {
      disposeSingleMaterial(mat, protectedTextures);
    }
  });
}
