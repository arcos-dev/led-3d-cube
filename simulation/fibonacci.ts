import { NUM_LEDS, CUBE_SIZE, PATTERN_NAMES } from '../constants';
import { Led } from '../types';
import { indexToXyz, xyzToIndex } from '../utils/helpers';

// #region Color Palette Logic
// Helper to convert HEX to RGB
const hexToRgb = (hex: string): Led => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

// Helper to linearly interpolate between two numbers
const lerp = (a: number, b: number, amount: number): number => {
    return a * (1 - amount) + b * amount;
};

// Helper to interpolate between two colors
const lerpColor = (color1: Led, color2: Led, amount: number): Led => {
    return {
        r: Math.round(lerp(color1.r, color2.r, amount)),
        g: Math.round(lerp(color1.g, color2.g, amount)),
        b: Math.round(lerp(color1.b, color2.b, amount)),
    };
};

const PALETTES: { [key: string]: Led[] } = {
    "Girassol": ["#FDB813", "#FF8C00", "#FF6B35", "#8B4513"].map(hexToRgb),
    "Nautilus": ["#0A3D62", "#1F618D", "#3498DB", "#5DADE2", "#AED6F1"].map(hexToRgb),
    "Crescimento Vegetal": ["#27AE60", "#52BE80", "#F39C12", "#E67E22"].map(hexToRgb),
    "Aurora": ["#9B59B6", "#3498DB", "#16A085", "#F39C12", "#E74C3C"].map(hexToRgb),
    "Galáxia": ["#1A1A2E", "#16213E", "#533483", "#E94560"].map(hexToRgb),
    "Nautilus Dourado": ["#F0EAD6", "#FFD700", "#DAA520", "#A0522D", "#191970"].map(hexToRgb),
    "Girassol Psicodélico": ["#2E112D", "#FFFF00", "#00FF00", "#FF00FF", "#8A2BE2"].map(hexToRgb),
    "Fractal Romanesco": ["#006400", "#2E8B57", "#32CD32", "#ADFF2F", "#F0FFF0"].map(hexToRgb),
    "Phi Digital": ["#FF00FF", "#00FFFF", "#FFA500", "#000000"].map(hexToRgb),
};

const hslToRgb = (h: number, s: number, l: number): Led => {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const getColorFromPalette = (paletteName: string, t: number, brightness: number = 0.5): Led => {
    if (paletteName === "Arco-íris Dinâmico" || !PALETTES[paletteName]) {
        const color = hslToRgb(t, 1, brightness);
        return color;
    }

    const palette = PALETTES[paletteName];
    const a = t % 1.0;
    const value = a < 0 ? a + 1 : a;

    const colorIndex = value * (palette.length - 1);
    const index1 = Math.floor(colorIndex);
    const index2 = Math.min(index1 + 1, palette.length - 1);
    const amount = colorIndex - index1;

    const color = lerpColor(palette[index1], palette[index2], amount);

    const brightnessFactor = brightness * 2;
    return {
        r: Math.min(255, Math.round(color.r * brightnessFactor)),
        g: Math.min(255, Math.round(color.g * brightnessFactor)),
        b: Math.min(255, Math.round(color.b * brightnessFactor)),
    };
};
// #endregion

// Helpers
const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};

const createBlankLeds = (): Led[] => Array(NUM_LEDS).fill({ r: 0, g: 0, b: 0 });
const center = CUBE_SIZE / 2 - 0.5;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// #region Pattern Generators

const generateSphericalPhyllotaxis = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const ledMatrix: Led[][][] = Array(CUBE_SIZE).fill(0).map(() => Array(CUBE_SIZE).fill(0).map(() => Array(CUBE_SIZE).fill({r:0,g:0,b:0})));
    const rotation = time / 5000;
    const numPoints = 256; // Reduced for clarity

    for (let i = 0; i < numPoints; i++) {
        const zNorm = map(i, 0, numPoints, -1, 1);
        const radius = Math.sqrt(1 - zNorm * zNorm);
        const theta = GOLDEN_ANGLE * i + rotation;

        const xNorm = Math.cos(theta) * radius;
        const yNorm = Math.sin(theta) * radius;
        
        const x = Math.floor(map(xNorm, -1, 1, 0, CUBE_SIZE));
        const y = Math.floor(map(yNorm, -1, 1, 0, CUBE_SIZE));
        const z = Math.floor(map(zNorm, -1, 1, 0, CUBE_SIZE));

        if (x >= 0 && x < CUBE_SIZE && y >= 0 && y < CUBE_SIZE && z >= 0 && z < CUBE_SIZE) {
            const hue = (i / numPoints + time / 10000) % 1;
            ledMatrix[x][y][z] = getColorFromPalette(paletteName, hue, 0.5);
        }
    }

    for (let z = 0; z < CUBE_SIZE; z++) {
        for (let y = 0; y < CUBE_SIZE; y++) {
            for (let x = 0; x < CUBE_SIZE; x++) {
                const index = xyzToIndex(x, y, z);
                leds[index] = ledMatrix[x][y][z];
            }
        }
    }
    return leds;
};

const generateConcentricWaves = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const t = time / 1000;
    for (let i = 0; i < NUM_LEDS; i++) {
        const { x, y, z } = indexToXyz(i);
        const distFromCenter = Math.sqrt((x - center) ** 2 + (y - center) ** 2 + (z - center) ** 2);
        const sinVal = Math.sin(distFromCenter - t);
        const brightness = map(sinVal, -1, 1, 0, 1);
        if (brightness > 0.1) {
            const hue = (distFromCenter / (CUBE_SIZE * 0.8)) % 1;
            leds[i] = getColorFromPalette(paletteName, hue, brightness * 0.5);
        }
    }
    return leds;
};

const generateGoldenDoubleHelix = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const t = time / 1500;
    const turns = 1.618 * 2;
    const radius = CUBE_SIZE / 2 - 1.5;

    for (let i = 0; i < NUM_LEDS; i++) {
        const { x, y, z } = indexToXyz(i);
        const yNorm = map(y, 0, CUBE_SIZE - 1, 0, 1);
        
        const angle = yNorm * 2 * Math.PI * turns + t;
        
        const targetX1 = center + Math.cos(angle) * radius;
        const targetZ1 = center + Math.sin(angle) * radius;
        const dist1 = Math.sqrt((x - targetX1)**2 + (z - targetZ1)**2);

        const targetX2 = center + Math.cos(angle + Math.PI) * radius;
        const targetZ2 = center + Math.sin(angle + Math.PI) * radius;
        const dist2 = Math.sqrt((x - targetX2)**2 + (z - targetZ2)**2);

        const dist = Math.min(dist1, dist2);

        if (dist < 1.5) {
            const brightness = map(dist, 0, 1.5, 1, 0);
            const hue = (yNorm + t / 5) % 1;
            leds[i] = getColorFromPalette(paletteName, hue, brightness * 0.5);
        }
    }
    return leds;
};

const generateRain = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const numDrops = 34;
    
    for(let i = 0; i < numDrops; i++) {
        const x = Math.floor((Math.sin(i * 1.618) * 0.5 + 0.5) * CUBE_SIZE);
        const z = Math.floor((Math.cos(i * 1.3) * 0.5 + 0.5) * CUBE_SIZE);
        const speed = map(i, 0, numDrops, 0.5, 2.5);
        const t = (time / 500) * speed;
        const y = CUBE_SIZE - 1 - (t % CUBE_SIZE);
        const hue = (i / numDrops) % 1;
        const color = getColorFromPalette(paletteName, hue, 0.6);

        for (let j = 0; j < 2; j++) {
            const currentY = Math.floor(y + j);
            if (currentY >= 0 && currentY < CUBE_SIZE) {
                const index = xyzToIndex(x, currentY, z);
                const brightness = j === 0 ? 1 : 0.3;
                if (leds[index] && leds[index].r === 0) {
                    leds[index] = { r: color.r * brightness, g: color.g * brightness, b: color.b * brightness };
                }
            }
        }
    }
    return leds;
};

const generateCenterPulse = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const t = time / 800;
    const pulseWidth = 1.5;
    const maxDist = Math.sqrt(3 * (center ** 2));

    for (let i = 0; i < NUM_LEDS; i++) {
        const { x, y, z } = indexToXyz(i);
        const distFromCenter = Math.sqrt((x - center) ** 2 + (y - center) ** 2 + (z - center) ** 2);
        const pulsePosition = t % (maxDist + pulseWidth * 2);
        const distFromPulse = Math.abs(distFromCenter - pulsePosition);

        if (distFromPulse < pulseWidth) {
            const brightness = map(distFromPulse, 0, pulseWidth, 1, 0);
            const hue = (distFromCenter / maxDist + time / 10000) % 1;
            leds[i] = getColorFromPalette(paletteName, hue, brightness * 0.6);
        }
    }
    return leds;
};

const generateGrowingCube = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const sizes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const cycleDuration = 10000;
    const stageDuration = cycleDuration / sizes.length;
    const stageIndex = Math.floor((time % cycleDuration) / stageDuration);
    const size = sizes[stageIndex];
    if (size === 0) return leds;

    const start = Math.floor(center - (size - 1) / 2);
    const end = start + size;
    const hue = (stageIndex / sizes.length) % 1;
    const color = getColorFromPalette(paletteName, hue, 0.5);

    for (let x = start; x < end; x++) {
        for (let y = start; y < end; y++) {
            for (let z = start; z < end; z++) {
                if (x >= 0 && x < CUBE_SIZE && y >= 0 && y < CUBE_SIZE && z >= 0 && z < CUBE_SIZE) {
                    const index = xyzToIndex(x, y, z);
                    leds[index] = color;
                }
            }
        }
    }
    return leds;
};

const generateStackingPlanes = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const numPlanes = 1 + Math.floor((time / 1500) % CUBE_SIZE);
    const color = getColorFromPalette(paletteName, (numPlanes / CUBE_SIZE), 0.6);

    for (let z = 0; z < numPlanes; z++) {
        for (let y = 0; y < CUBE_SIZE; y++) {
            for (let x = 0; x < CUBE_SIZE; x++) {
                leds[xyzToIndex(x, y, z)] = color;
            }
        }
    }
    return leds;
};

// --- REWRITTEN ANIMATIONS for 8x8x8 ---

const generate3dTree = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const t = (time / 5000) % 1; // 5 second animation loop
    const growth = Math.sin(t * Math.PI); // Ease in/out growth

    // Trunk
    const trunkHeight = Math.floor(growth * 2);
    const trunkColor = {r: 139, g: 69, b: 19};
    for (let y = 0; y < trunkHeight; y++) {
        leds[xyzToIndex(3, y, 3)] = trunkColor;
        leds[xyzToIndex(4, y, 3)] = trunkColor;
        leds[xyzToIndex(3, y, 4)] = trunkColor;
        leds[xyzToIndex(4, y, 4)] = trunkColor;
    }

    // Foliage (Cone Shape)
    const treeHeight = Math.floor(growth * (CUBE_SIZE - 1)) + 1;
    const foliageColor = {r:0, g:100, b:20};

    for(let y = 1; y < treeHeight; y++) {
        const radius = (CUBE_SIZE / 2.5) * (1 - y / CUBE_SIZE);
        for(let x = 0; x < CUBE_SIZE; x++) {
            for(let z = 0; z < CUBE_SIZE; z++) {
                const dist = Math.sqrt((x-center)**2 + (z-center)**2);
                if (dist < radius) {
                    const index = xyzToIndex(x,y,z);
                    leds[index] = foliageColor;

                    // Ornaments
                    const ornamentChance = 0.1;
                    if (Math.sin(x + z + time/200) > 0.8 && Math.random() < ornamentChance) {
                        const hue = (x + y + z + time / 1000) % 1;
                        leds[index] = getColorFromPalette("Arco-íris Dinâmico", hue, 0.5);
                    }
                }
            }
        }
    }
    return leds;
};


// Store fireworks state outside to persist between frames
interface Rocket {
    x: number; y: number; z: number;
    vy: number;
    hue: number;
}
interface Explosion {
    x: number; y: number; z: number;
    radius: number;
    maxRadius: number;
    life: number;
    hue: number;
}
let rockets: Rocket[] = [];
let explosions: Explosion[] = [];
let nextFireworkTime = 0;

const generateFireworks = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const dt = 0.1;

    // Launch new rockets
    if (time > nextFireworkTime) {
        rockets.push({
            x: center + (Math.random() - 0.5) * 4,
            y: 0,
            z: center + (Math.random() - 0.5) * 4,
            vy: 7 + Math.random() * 2,
            hue: Math.random()
        });
        nextFireworkTime = time + 1500 + Math.random() * 2000;
    }

    // Update and draw rockets
    const stillFlyingRockets: Rocket[] = [];
    for (const r of rockets) {
        r.y += r.vy * dt;
        r.vy -= 9.8 * dt * 0.4; // Aumenta um pouco a gravidade para um arco mais natural

        if (r.vy > 0) { // If still going up
            stillFlyingRockets.push(r);
            const ix = Math.round(r.x), iy = Math.round(r.y), iz = Math.round(r.z);
            if (ix >= 0 && ix < CUBE_SIZE && iy >= 0 && iy < CUBE_SIZE && iz >= 0 && iz < CUBE_SIZE) {
                leds[xyzToIndex(ix, iy, iz)] = { r: 255, g: 255, b: 200 };
            }
        } else { // Explode at apex
            explosions.push({
                x: r.x, y: r.y, z: r.z,
                radius: 0,
                maxRadius: 4 + Math.random() * 3,
                life: 1.0,
                hue: r.hue
            });
        }
    }
    rockets = stillFlyingRockets;

    // Update and draw explosions (volumetric shells)
    const activeExplosions: Explosion[] = [];
    for (const e of explosions) {
        e.radius += 4 * dt; // Reduz a velocidade de expansão para um efeito mais suave
        e.life -= dt * 0.3; // Aumenta a duração da explosão (fade mais lento)

        if (e.life > 0) {
            activeExplosions.push(e);
            for (let i = 0; i < NUM_LEDS; i++) {
                const { x, y, z } = indexToXyz(i);
                const dist = Math.sqrt((x-e.x)**2 + (y-e.y)**2 + (z-e.z)**2);
                const distFromShell = Math.abs(dist - e.radius);
                if (distFromShell < 1.0) {
                    const brightness = (1.0 - distFromShell) * e.life * 0.7;
                    if (brightness > 0.1) {
                        const existingBrightness = (leds[i].r + leds[i].g + leds[i].b) / 3 / 255;
                        if (brightness > existingBrightness) {
                           leds[i] = getColorFromPalette(paletteName, e.hue, brightness);
                        }
                    }
                }
            }
        }
    }
    explosions = activeExplosions;

    return leds;
};

// --- NEW ANIMATIONS ---

const generate3dPlasma = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const t = time / 2000;
    for (let i = 0; i < NUM_LEDS; i++) {
        const { x, y, z } = indexToXyz(i);
        const v = Math.sin(x * 0.5 + t) + Math.sin(y * 0.5 + t) + Math.sin(z * 0.5 + t) + Math.sin((x + y + z) * 0.3 + t);
        const brightness = map(v, -4, 4, 0, 1);
        const hue = 0.5 + 0.5 * Math.sin((x - y + z) * 0.2 + t);
        leds[i] = getColorFromPalette(paletteName, hue, brightness * 0.5);
    }
    return leds;
};


const generateAxisFill = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const t = time / 3000;
    const fillLevel = (Math.sin(t) + 1) / 2 * CUBE_SIZE;

    for (let y = 0; y < CUBE_SIZE; y++) {
        if (y < fillLevel) {
            const hue = map(y, 0, CUBE_SIZE - 1, 0, 1);
            const color = getColorFromPalette(paletteName, hue, 0.5);
            for (let x = 0; x < CUBE_SIZE; x++) {
                for (let z = 0; z < CUBE_SIZE; z++) {
                    leds[xyzToIndex(x, y, z)] = color;
                }
            }
        }
    }
    return leds;
};

const generateLissajousPath = (time: number, paletteName: string): Led[] => {
    const leds = createBlankLeds();
    const t = time / 2000;

    for(let i = 0; i < 20; i++) { // Draw a tail
        const timeOffset = t - i * 0.02;
        const x = center + (CUBE_SIZE / 2 - 1) * Math.sin(timeOffset * 1.0);
        const y = center + (CUBE_SIZE / 2 - 1) * Math.cos(timeOffset * 1.618);
        const z = center + (CUBE_SIZE / 2 - 1) * Math.sin(timeOffset * 2.618);
        
        const ix = Math.round(x);
        const iy = Math.round(y);
        const iz = Math.round(z);

        if (ix >= 0 && ix < CUBE_SIZE && iy >= 0 && iy < CUBE_SIZE && iz >= 0 && iz < CUBE_SIZE) {
            const index = xyzToIndex(ix, iy, iz);
            const brightness = map(i, 0, 20, 0.7, 0);
            const hue = (timeOffset / 5) % 1;
            leds[index] = getColorFromPalette(paletteName, hue, brightness);
        }
    }
    return leds;
};

// #endregion

const generators: { [key: string]: (time: number, paletteName: string) => Led[] } = {
    [PATTERN_NAMES[0]]: generateSphericalPhyllotaxis,
    [PATTERN_NAMES[1]]: generateConcentricWaves,
    [PATTERN_NAMES[2]]: generateGoldenDoubleHelix,
    [PATTERN_NAMES[3]]: generateRain,
    [PATTERN_NAMES[4]]: generateCenterPulse,
    [PATTERN_NAMES[5]]: generateGrowingCube,
    [PATTERN_NAMES[6]]: generateStackingPlanes,
    [PATTERN_NAMES[7]]: generate3dTree,
    [PATTERN_NAMES[8]]: generate3dPlasma,
    [PATTERN_NAMES[9]]: generateFireworks,
    [PATTERN_NAMES[10]]: generateAxisFill,
    [PATTERN_NAMES[11]]: generateLissajousPath,
};

export const updateSimulation = (patternName: string, time: number, paletteName: string): Led[] => {
    const generator = generators[patternName];
    if (generator) {
        return generator(time, paletteName);
    }
    return createBlankLeds();
};