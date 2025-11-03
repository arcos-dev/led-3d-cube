import { CUBE_SIZE } from '../constants';

/**
 * Converte coordenadas XYZ em um índice linear para a fita de LED,
 * replicando a lógica de mapeamento em serpentina do código Arduino.
 * @param x - Coordenada X (0-7)
 * @param y - Coordenada Y (0-7)
 * @param z - Coordenada Z (0-7)
 * @returns O índice linear do LED (0-511)
 */
export const xyzToIndex = (x: number, y: number, z: number): number => {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE || x < 0 || y < 0 || z < 0) {
    return 0; // Proteção contra overflow
  }

  let index = z * (CUBE_SIZE * CUBE_SIZE); // Camada Z

  if (z % 2 === 0) { // Camadas Z pares (0, 2, 4, 6)
    index += y * CUBE_SIZE; // Direção de Y normal
    if (y % 2 === 0) { // Linhas Y pares
      index += x; // Direção de X normal
    } else { // Linhas Y ímpares
      index += (CUBE_SIZE - 1 - x); // Direção de X reversa
    }
  } else { // Camadas Z ímpares (1, 3, 5, 7)
    index += (CUBE_SIZE - 1 - y) * CUBE_SIZE; // Direção de Y reversa
    if ((y + 1) % 2 === 0) { // A lógica do X depende do Y original, não do Y revertido
      index += (CUBE_SIZE - 1 - x);
    } else {
      index += x;
    }
  }
  
  return index;
};

/**
 * Converte um índice linear para coordenadas XYZ,
 * fazendo o inverso da lógica de mapeamento em serpentina.
 * @param index - O índice linear do LED (0-511)
 * @returns Um objeto com as coordenadas { x, y, z }
 */
export const indexToXyz = (index: number): { x: number; y: number; z: number } => {
  if (index < 0 || index >= CUBE_SIZE * CUBE_SIZE * CUBE_SIZE) {
    return { x: 0, y: 0, z: 0 }; // Proteção
  }

  const z = Math.floor(index / (CUBE_SIZE * CUBE_SIZE));
  const layerIndex = index % (CUBE_SIZE * CUBE_SIZE);

  let y: number, x: number;

  if (z % 2 === 0) { // Camadas Z pares
    y = Math.floor(layerIndex / CUBE_SIZE);
    const xInRow = layerIndex % CUBE_SIZE;
    if (y % 2 === 0) { // Linhas Y pares
      x = xInRow;
    } else { // Linhas Y ímpares
      x = CUBE_SIZE - 1 - xInRow;
    }
  } else { // Camadas Z ímpares
    const yRev = Math.floor(layerIndex / CUBE_SIZE);
    y = CUBE_SIZE - 1 - yRev;
    const xInRow = layerIndex % CUBE_SIZE;
    // A lógica do X depende da linha original na camada (yRev)
    if (yRev % 2 === 0) {
      x = CUBE_SIZE - 1 - xInRow;
    } else {
      x = xInRow;
    }
  }

  return { x, y, z };
};