/*
 * Animações para Cubo de LEDs 8x8x8
 * FastLED 3.10.3 + Arduino Mega 2560
 *
 * Autor: Arcostasi (arcos-dev)
 * Data: 31 de Outubro de 2025
 *
 * Descrição:
 * Suite de 8 animações premium para cubo 8x8x8 com transições suaves
 * e padrões matemáticos interessantes.
 *
 * ANIMAÇÕES DISPONÍVEIS:
 * 0. Espiral 3D Fibonacci      - Proporcões áureas em forma espiral
 * 1. Ondas de Fibonacci        - Camadas pulsantes com efeito radial
 * 2. Partículas Fibonacci      - Pontos orbitando em padrão Fibonacci
 * 3. Hélice de Fibonacci       - Dupla espiral descendente
 * 4. Kaleidoscópio Fractal     - Padrões fractais espelhados dinâmicos
 * 5. Chuva de Meteoros         - Partículas caindo com estelas luminosas
 * 6. Aurora Boreal 3D          - Ondas fluidas de cores suaves
 * 7. Pulso Cardíaco            - Batidas expandindo do centro
 *
 * Cada animação roda por 12 segundos, alternando continuamente.
 */

#include <FastLED.h>

// ========== CONFIGURAÇÕES DO HARDWARE ==========
#define DATA_PIN        6      // Pino de dados conectado ao DIN dos LEDs
#define LED_TYPE        WS2812B
#define COLOR_ORDER     GRB
#define NUM_LEDS        512    // 8 x 8 x 8 = 512 LEDs
#define CUBE_SIZE       8      // Tamanho de cada dimensão do cubo

// ========== CONFIGURAÇÕES DE BRILHO E PERFORMANCE ==========
#define BRIGHTNESS      255     // 0-255 (40 = ~15% para segurança)
#define FRAMES_PER_SECOND  60

// Array de LEDs
CRGB leds[NUM_LEDS];

// ========== VARIÁVEIS DA ANIMAÇÃO FIBONACCI ==========
uint8_t gHue = 0;              // Cor rotativa
float timeOffset = 0;          // Offset de tempo para animação
const float PHI = 1.618033988; // Proporção áurea (Fibonacci)
const float GOLDEN_ANGLE = 137.5077640; // Ângulo dourado em graus

// Sequência de Fibonacci para mapeamento
const uint16_t fibonacci[] = {0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610};

// ========== FUNÇÕES DE MAPEAMENTO 3D ==========

// Converte coordenadas XYZ em índice linear do LED
uint16_t XYZ(uint8_t x, uint8_t y, uint8_t z) {
  // Mapeamento zigue-zague em serpentina para melhor fluxo visual
  // Ajuste esta função de acordo com a fiação física do seu cubo

  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) {
    return 0; // Proteção contra overflow
  }

  uint16_t index = z * (CUBE_SIZE * CUBE_SIZE); // Camada Z

  // Alterna direção em Y (serpentina)
  if (z % 2 == 0) {
    index += y * CUBE_SIZE;
    // Alterna direção em X
    if (y % 2 == 0) {
      index += x;
    } else {
      index += (CUBE_SIZE - 1 - x);
    }
  } else {
    index += (CUBE_SIZE - 1 - y) * CUBE_SIZE;
    if (y % 2 == 0) {
      index += x;
    } else {
      index += (CUBE_SIZE - 1 - x);
    }
  }

  return index;
}

// Calcula distância 3D entre dois pontos
float distance3D(float x1, float y1, float z1, float x2, float y2, float z2) {
  float dx = x2 - x1;
  float dy = y2 - y1;
  float dz = z2 - z1;
  return sqrt(dx*dx + dy*dy + dz*dz);
}

// ========== VARIÁVEIS DE ESTADO PARA ANIMAÇÕES ==========
// Armazena posições anteriores para efeitos de estela
float meteorX[8], meteorY[8], meteorZ[8];
uint8_t meteorHue[8];

// ========== VARIÁVEIS PARA EFEITOS PWM E REALISMO ==========
// Oscilação de brilho para cada LED (simula PWM)
uint8_t pwmPhase[CUBE_SIZE][CUBE_SIZE][CUBE_SIZE];
uint8_t pwmFrequency = 3;  // Velocidade da oscilação (0-10, quanto maior mais rápido)

// Buffer para armazenar cores base (com oscilação)
CRGB colorBuffer[NUM_LEDS];

// ========== FUNÇÃO HELPER: APLICAR EFEITO PWM/OSCILAÇÃO ==========
// Simula efeito de PWM em LEDs reais com flicker suave
uint8_t applyPWMEffect(uint8_t originalBrightness, uint8_t ledIndex, float timeOffset) {
  // Cria uma oscilação baseada no índice do LED e tempo
  float oscillation = sin((ledIndex * 0.5 + timeOffset * pwmFrequency) * PI) * 0.5 + 0.5;

  // Adiciona um pequeno flicker aleatório para mais realismo
  uint8_t flicker = random8(0, 15);  // 0-15 de variação

  // Combina: oscilação suave + pequeno flicker aleatório
  float pwmEffect = (oscillation * 0.7 + 0.3) * (1.0 - (flicker / 255.0));

  // Retorna brilho modificado
  return (uint8_t)(originalBrightness * pwmEffect);
}

// ========== FUNÇÃO HELPER: OSCILAÇÃO DE COR ==========
// Faz cor oscilar suavemente entre matizes (efeito de cor "respirando")
uint8_t oscillateHue(uint8_t baseHue, uint8_t ledIndex, float timeOffset) {
  // Oscilação em torno da cor base
  float hueOscillation = sin((ledIndex * 0.3 + timeOffset * 0.8) * PI) * 5.0;  // ±5 na cor
  return (uint8_t)(int(baseHue + hueOscillation + 256) % 256);  // Garante valor entre 0-255
}

// ========== FUNÇÃO HELPER: APLICAR REALISMO A COR ==========
// Aplica PWM e oscilação de cor simultaneamente
void applyRealisticLED(uint16_t ledIndex, uint8_t hue, uint8_t saturation, uint8_t brightness, float timeOffset) {
  // Aplica oscilação de cor
  uint8_t oscillatedHue = oscillateHue(hue, ledIndex, timeOffset);

  // Aplica efeito PWM ao brilho
  uint8_t pwmBrightness = applyPWMEffect(brightness, ledIndex, timeOffset);

  // Define cor final com efeitos aplicados
  leds[ledIndex] = CHSV(oscillatedHue, saturation, pwmBrightness);
}

// ========== ANIMAÇÕES FIBONACCI E PREMIUM ==========

// Animação 1: Espiral de Fibonacci 3D (com realismo PWM)
void fibonacciSpiral3D() {
  float centerX = CUBE_SIZE / 2.0;
  float centerY = CUBE_SIZE / 2.0;
  float centerZ = CUBE_SIZE / 2.0;

  for (uint8_t z = 0; z < CUBE_SIZE; z++) {
    for (uint8_t y = 0; y < CUBE_SIZE; y++) {
      for (uint8_t x = 0; x < CUBE_SIZE; x++) {

        // Calcula ângulo e raio em coordenadas polares
        float dx = x - centerX;
        float dy = y - centerY;
        float dz = z - centerZ;

        float radius = sqrt(dx*dx + dy*dy);
        float angle = atan2(dy, dx) * 180.0 / PI;
        if (angle < 0) angle += 360.0;

        // Aplica proporção áurea ao ângulo e altura
        float fibAngle = fmod(angle + dz * GOLDEN_ANGLE + timeOffset, 360.0);

        // Calcula intensidade baseada em Fibonacci
        float distance = distance3D(x, y, z, centerX, centerY, centerZ);
        float fibDistance = distance * PHI;

        // Onda senoidal com frequência fibonacci
        float wave = sin((fibAngle / 360.0 * TWO_PI) + (timeOffset / 10.0)) * 0.5 + 0.5;
        float zWave = sin((dz / (float)CUBE_SIZE * TWO_PI * 2) + timeOffset / 5.0) * 0.5 + 0.5;

        uint8_t brightness = wave * zWave * 255;

        // Cor baseada em ângulo fibonacci
        uint8_t hue = (uint8_t)(fibAngle + gHue);

        // Define cor do LED com efeito realista PWM
        uint16_t ledIndex = XYZ(x, y, z);
        applyRealisticLED(ledIndex, hue, 255, brightness, timeOffset);
      }
    }
  }

  timeOffset += 0.1;
  EVERY_N_MILLISECONDS(20) { gHue++; }
}

// Animação 2: Ondas de Fibonacci (camadas pulsantes com realismo)
void fibonacciWaves() {
  for (uint8_t z = 0; z < CUBE_SIZE; z++) {
    // Usa números de Fibonacci para criar padrões em camadas específicas
    uint8_t fibIndex = fibonacci[z % 16];

    float wave = sin((z / (float)CUBE_SIZE * TWO_PI * 3) + timeOffset / 8.0) * 0.5 + 0.5;

    for (uint8_t y = 0; y < CUBE_SIZE; y++) {
      for (uint8_t x = 0; x < CUBE_SIZE; x++) {
        float centerDist = distance3D(x, y, z, CUBE_SIZE/2.0, CUBE_SIZE/2.0, z);

        // Onda radial baseada em Fibonacci
        float radialWave = sin((centerDist * PHI) + timeOffset / 5.0) * 0.5 + 0.5;

        uint8_t brightness = wave * radialWave * 255;
        uint8_t hue = (gHue + z * 32 + fibIndex * 10) % 255;

        uint16_t ledIndex = XYZ(x, y, z);

        // Aplica realismo: oscilação de cor + PWM
        applyRealisticLED(ledIndex, hue, 240, brightness, timeOffset);
      }
    }
  }

  timeOffset += 0.15;
  EVERY_N_MILLISECONDS(30) { gHue++; }
}

// Animação 3: Partículas de Fibonacci (pontos orbitando com realismo)
void fibonacciParticles() {
  // Fade suave em vez de clear completo
  fadeToBlackBy(leds, NUM_LEDS, 60);

  // Cria partículas que seguem órbitas fibonacci
  for (uint8_t i = 0; i < 13; i++) {
    float angle = (timeOffset + i * GOLDEN_ANGLE) * PI / 180.0;
    float radius = (fibonacci[i % 13] % CUBE_SIZE) / 2.0;

    float x = CUBE_SIZE/2.0 + cos(angle) * radius;
    float y = CUBE_SIZE/2.0 + sin(angle) * radius;
    float z = (sin(timeOffset / 10.0 + i) * 0.5 + 0.5) * (CUBE_SIZE - 1);

    // Certifica que está dentro dos limites
    uint8_t ix = constrain((uint8_t)x, 0, CUBE_SIZE - 1);
    uint8_t iy = constrain((uint8_t)y, 0, CUBE_SIZE - 1);
    uint8_t iz = constrain((uint8_t)z, 0, CUBE_SIZE - 1);

    uint16_t ledIndex = XYZ(ix, iy, iz);

    // Aplica realismo com oscilação de cor e PWM
    applyRealisticLED(ledIndex, gHue + i * 20, 255, 255, timeOffset);
  }

  timeOffset += 0.08;
  EVERY_N_MILLISECONDS(25) { gHue++; }
}

// Animação 4: Helix de Fibonacci (espiral dupla com realismo)
void fibonacciHelix() {
  for (uint8_t z = 0; z < CUBE_SIZE; z++) {
    float angle1 = (z * GOLDEN_ANGLE + timeOffset * 2) * PI / 180.0;
    float angle2 = (z * GOLDEN_ANGLE + timeOffset * 2 + 180) * PI / 180.0;

    float radius = 3.0;

    // Primeira hélice
    float x1 = CUBE_SIZE/2.0 + cos(angle1) * radius;
    float y1 = CUBE_SIZE/2.0 + sin(angle1) * radius;

    // Segunda hélice (oposta)
    float x2 = CUBE_SIZE/2.0 + cos(angle2) * radius;
    float y2 = CUBE_SIZE/2.0 + sin(angle2) * radius;

    // Acende LEDs nas posições calculadas
    uint8_t ix1 = constrain((uint8_t)x1, 0, CUBE_SIZE - 1);
    uint8_t iy1 = constrain((uint8_t)y1, 0, CUBE_SIZE - 1);
    uint8_t ix2 = constrain((uint8_t)x2, 0, CUBE_SIZE - 1);
    uint8_t iy2 = constrain((uint8_t)y2, 0, CUBE_SIZE - 1);

    // Aplica realismo com PWM e oscilação de cor
    uint16_t ledIndex1 = XYZ(ix1, iy1, z);
    uint16_t ledIndex2 = XYZ(ix2, iy2, z);

    applyRealisticLED(ledIndex1, gHue + z * 16, 255, 255, timeOffset);
    applyRealisticLED(ledIndex2, gHue + z * 16 + 128, 255, 255, timeOffset);
  }

  // Fade do resto
  fadeToBlackBy(leds, NUM_LEDS, 50);

  timeOffset += 0.12;
  EVERY_N_MILLISECONDS(20) { gHue++; }
}

// ========== ANIMAÇÕES PREMIUM ==========

// Animação 5: Kaleidoscópio Fractal 3D - Padrões espelhados com realismo
void kaleidoscopeFractal() {
  float centerX = CUBE_SIZE / 2.0;
  float centerY = CUBE_SIZE / 2.0;
  float centerZ = CUBE_SIZE / 2.0;

  for (uint8_t z = 0; z < CUBE_SIZE; z++) {
    for (uint8_t y = 0; y < CUBE_SIZE; y++) {
      for (uint8_t x = 0; x < CUBE_SIZE; x++) {

        // Distância do centro em 3D
        float dx = x - centerX;
        float dy = y - centerY;
        float dz = z - centerZ;
        float dist = sqrt(dx*dx + dy*dy + dz*dz);

        // Ângulos em diferentes planos
        float angleXY = atan2(dy, dx) * 180.0 / PI;
        float angleXZ = atan2(dz, dx) * 180.0 / PI;
        float angleYZ = atan2(dz, dy) * 180.0 / PI;

        // Padrão fractal com múltiplas camadas de seno
        float fractal = sin((dist / 2.0 + timeOffset * 1.5) * PI / 2.0) * 0.5 + 0.5;
        fractal *= sin((angleXY / 60.0 + timeOffset * 0.8) * PI) * 0.5 + 0.5;
        fractal *= sin((angleXZ / 60.0 + timeOffset * 1.1) * PI) * 0.5 + 0.5;

        // Cores em rotação
        uint8_t hue1 = (uint8_t)(int(gHue + angleXY * 0.7 + dist * 10) % 255);
        uint8_t hue2 = (uint8_t)(int(gHue + angleXZ * 0.7 + dist * 10 + 85) % 255);
        uint8_t finalHue = (hue1 + hue2) / 2;

        uint8_t brightness = (uint8_t)(fractal * 255);
        uint8_t saturation = (uint8_t)(255 - (dist * 20));

        uint16_t ledIndex = XYZ(x, y, z);

        // Aplica realismo: oscilação de cor + PWM
        applyRealisticLED(ledIndex, finalHue, saturation, brightness, timeOffset);
      }
    }
  }

  timeOffset += 0.08;
  EVERY_N_MILLISECONDS(25) { gHue++; }
}

// Animação 6: Chuva de Meteoros - Partículas com estelas e realismo
void meteorShower() {
  // Fade suave para criar efeito de estela
  fadeToBlackBy(leds, NUM_LEDS, 40);

  float centerX = CUBE_SIZE / 2.0;
  float centerY = CUBE_SIZE / 2.0;

  // Cria múltiplos meteoros
  for (uint8_t i = 0; i < 8; i++) {
    // Posição do meteoro (órbita circular + queda)
    float angle = (timeOffset * 1.2 + i * 45) * PI / 180.0;
    meteorX[i] = centerX + cos(angle) * 3.5;
    meteorY[i] = centerY + sin(angle) * 3.5;
    meteorZ[i] = fmod(timeOffset * 3.5 + i * 1.5, (float)CUBE_SIZE);

    meteorHue[i] = (gHue + i * 32) % 255;

    // Desenha o meteoro com cauda
    for (uint8_t trail = 0; trail < 4; trail++) {
      float z = meteorZ[i] - trail;
      if (z >= 0 && z < CUBE_SIZE) {
        uint8_t ix = constrain((uint8_t)meteorX[i], 0, CUBE_SIZE - 1);
        uint8_t iy = constrain((uint8_t)meteorY[i], 0, CUBE_SIZE - 1);
        uint8_t iz = (uint8_t)z;

        // Brilho decresce com a distância da cabeça
        uint8_t trailBrightness = 255 - (trail * 60);
        uint16_t ledIndex = XYZ(ix, iy, iz);

        // Aplica realismo com PWM suave
        applyRealisticLED(ledIndex, meteorHue[i], 200, trailBrightness, timeOffset);
      }
    }

    // Cabeça do meteoro brilhante (com mais oscilação)
    uint8_t ix = constrain((uint8_t)(meteorX[i] + random8(-1, 2)), 0, CUBE_SIZE - 1);
    uint8_t iy = constrain((uint8_t)(meteorY[i] + random8(-1, 2)), 0, CUBE_SIZE - 1);
    uint8_t iz = constrain((uint8_t)meteorZ[i], 0, CUBE_SIZE - 1);
    uint16_t ledIndex = XYZ(ix, iy, iz);

    applyRealisticLED(ledIndex, meteorHue[i], 255, 255, timeOffset);
  }

  timeOffset += 0.05;
  EVERY_N_MILLISECONDS(30) { gHue++; }
}

// Animação 7: Aurora Boreal 3D - Ondas fluidas com realismo PWM
void auroraFlow() {
  float centerX = CUBE_SIZE / 2.0;
  float centerY = CUBE_SIZE / 2.0;
  float centerZ = CUBE_SIZE / 2.0;

  for (uint8_t z = 0; z < CUBE_SIZE; z++) {
    for (uint8_t y = 0; y < CUBE_SIZE; y++) {
      for (uint8_t x = 0; x < CUBE_SIZE; x++) {

        float dx = x - centerX;
        float dy = y - centerY;
        float dz = z - centerZ;

        // Ondas fluidas em múltiplas direções
        float wave1 = sin((dx / 2.0 + timeOffset * 2.0) * PI / 4.0) * 0.33 + 0.33;
        float wave2 = sin((dy / 2.0 + timeOffset * 1.5) * PI / 4.0) * 0.33 + 0.33;
        float wave3 = sin((dz / 2.0 + timeOffset * 1.8) * PI / 4.0) * 0.34;

        float flowPattern = wave1 * 0.4 + wave2 * 0.4 + wave3 * 0.2;

        // Distância do centro para gradiente
        float dist = sqrt(dx*dx + dy*dy + dz*dz);
        float distFade = 1.0 - (dist / (CUBE_SIZE * 0.9));

        // Cores variadas (aurora verde, roxo, azul)
        uint8_t hue = (uint8_t)(int(gHue + flowPattern * 100 + dist * 8) % 255);
        if (hue > 200) hue = 180 + (hue - 200) / 2;  // Focar em azul/ciano

        uint8_t brightness = (uint8_t)(flowPattern * distFade * 255);
        uint8_t saturation = (uint8_t)(200 - (dist * 10));

        uint16_t ledIndex = XYZ(x, y, z);

        // Aplica realismo: oscilação de cor + PWM
        applyRealisticLED(ledIndex, hue, constrain(saturation, 0, 255), brightness, timeOffset);
      }
    }
  }

  timeOffset += 0.06;
  EVERY_N_MILLISECONDS(35) { gHue++; }
}

// Animação 8: Pulso Cardíaco Digital - Ondas com oscilação realista
void heartbeatPulse() {
  float centerX = CUBE_SIZE / 2.0;
  float centerY = CUBE_SIZE / 2.0;
  float centerZ = CUBE_SIZE / 2.0;

  // Fade base
  fadeToBlackBy(leds, NUM_LEDS, 50);

  // Cria duas ondas de expansão (batida dupla)
  float beatCycle = fmod(timeOffset, 2.0);  // Ciclo de 2 segundos
  float beat1 = beatCycle < 0.5 ? beatCycle * 2.0 : 0;  // Primeira batida
  float beat2 = beatCycle < 1.3 ? fmod(beatCycle - 0.5, 2.0) * 2.0 : 0;  // Segunda batida

  for (uint8_t z = 0; z < CUBE_SIZE; z++) {
    for (uint8_t y = 0; y < CUBE_SIZE; y++) {
      for (uint8_t x = 0; x < CUBE_SIZE; x++) {

        float dx = x - centerX;
        float dy = y - centerY;
        float dz = z - centerZ;
        float dist = sqrt(dx*dx + dy*dy + dz*dz);

        uint8_t brightness = 0;
        uint8_t hue = gHue;

        // Primeira onda (vermelho/laranja)
        if (beat1 > 0) {
          float waveFront1 = beat1 * CUBE_SIZE / 1.5;
          float distance1 = abs(dist - waveFront1);
          if (distance1 < 1.5) {
            brightness = max(brightness, (uint8_t)(255 - distance1 * 100));
            hue = 0;  // Vermelho
          }
        }

        // Segunda onda (roxo/rosa)
        if (beat2 > 0) {
          float waveFront2 = beat2 * CUBE_SIZE / 1.5;
          float distance2 = abs(dist - waveFront2);
          if (distance2 < 1.5) {
            uint8_t wave2Brightness = (uint8_t)(255 - distance2 * 100);
            if (wave2Brightness > brightness) {
              brightness = wave2Brightness;
              hue = 200;  // Roxo
            }
          }
        }

        // Centro sempre brilhante
        if (dist < 1.0) {
          brightness = 255;
          hue = (gHue + 50) % 255;
        }

        uint16_t ledIndex = XYZ(x, y, z);

        // Aplica realismo com oscilação e PWM
        applyRealisticLED(ledIndex, hue, 255, brightness, timeOffset);
      }
    }
  }

  timeOffset += 0.015;
  EVERY_N_MILLISECONDS(40) { gHue += 2; }
}

// ========== SETUP ==========
void setup() {
  // Inicializa porta serial para debug (opcional)
  Serial.begin(115200);
  delay(1000); // Delay de segurança na inicialização

  // Inicializa FastLED
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS)
    .setCorrection(TypicalLEDStrip)
    .setDither(BRIGHTNESS < 255);

  FastLED.setBrightness(BRIGHTNESS);

  // Limpa todos os LEDs
  FastLED.clear();
  FastLED.show();

  // Extrai os números da versão a partir da macro FASTLED_VERSION
  long major = FASTLED_VERSION / 1000000L;        // (3010003 / 1000000) = 3
  long minor = (FASTLED_VERSION / 1000L) % 1000L; // (3010003 / 1000) % 1000 = 3010 % 1000 = 10
  long revision = FASTLED_VERSION % 1000L;        // (3010003 % 1000) = 3

  Serial.print(F("Fibonacci LED Cube 8x8x8 - FastLED "));
  Serial.print(major);
  Serial.print(F("."));
  Serial.print(minor);
  Serial.print(F("."));
  Serial.println(revision);

  Serial.println(F("Iniciando animações..."));
}

// ========== LOOP PRINCIPAL ==========
uint8_t currentPattern = 0;
unsigned long patternTimer = 0;
const unsigned long PATTERN_DURATION = 12000; // 12 segundos por padrão (reduzido para mais variedade)

void loop() {
  // Alterna entre animações a cada 12 segundos
  if (millis() - patternTimer > PATTERN_DURATION) {
    patternTimer = millis();
    currentPattern = (currentPattern + 1) % 8;  // Agora temos 8 animações
    FastLED.clear();
    timeOffset = 0; // Reset animation timing

    Serial.print(F("Mudando para padrão: "));
    Serial.println(currentPattern);
  }

  // Executa animação atual
  switch(currentPattern) {
    case 0:
      fibonacciSpiral3D();
      break;
    case 1:
      fibonacciWaves();
      break;
    case 2:
      fibonacciParticles();
      break;
    case 3:
      fibonacciHelix();
      break;
    case 4:
      kaleidoscopeFractal();
      break;
    case 5:
      meteorShower();
      break;
    case 6:
      auroraFlow();
      break;
    case 7:
      heartbeatPulse();
      break;
  }

  // Atualiza LEDs
  FastLED.show();
  FastLED.delay(1000 / FRAMES_PER_SECOND);
}
