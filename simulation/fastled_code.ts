export const FASTLED_CODE: { [key: string]: string } = {
    "Filotaxia Esférica": `/*
 * Exemplo de código para FastLED: Filotaxia Esférica
 * Cria um padrão de pontos em uma esfera usando o Ângulo Dourado.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6 // Altere para o pino de dados do seu projeto

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t); // Protótipo da função de mapeamento

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void sphericalPhyllotaxis() {
    fadeToBlackBy(leds, NUM_LEDS, 60);

    const float GOLDEN_ANGLE = PI * (3.0 - sqrt(5.0));
    float rotation = millis() / 5000.0;
    uint16_t numPoints = 256;

    for (uint16_t i = 0; i < numPoints; i++) {
        float zNorm = (float)i / numPoints * 2.0 - 1.0;
        float radius = sqrt(1.0 - zNorm * zNorm);
        float theta = GOLDEN_ANGLE * i + rotation;

        float xNorm = cos(theta) * radius;
        float yNorm = sin(theta) * radius;

        uint8_t x = round((xNorm + 1.0) / 2.0 * (CUBE_SIZE - 1));
        uint8_t y = round((yNorm + 1.0) / 2.0 * (CUBE_SIZE - 1));
        uint8_t z = round((zNorm + 1.0) / 2.0 * (CUBE_SIZE - 1));

        uint8_t hue = (uint8_t)(millis() / 40) + (uint8_t)(i * 255.0 / numPoints);
        leds[xyz(x, y, z)] = CHSV(hue, 255, 255);
    }
}

// ===============================================================
// CÓDIGO COMUM (COLE NO FINAL DO SEU SKETCH)
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Ondas Concêntricas": `/*
 * Exemplo de código para FastLED: Ondas Concêntricas
 * Gera ondas esféricas que emanam do centro do cubo.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void concentricWaves() {
    float t = millis() / 1000.0;
    const float center = (CUBE_SIZE - 1) / 2.0;

    for (uint8_t x = 0; x < CUBE_SIZE; x++) {
        for (uint8_t y = 0; y < CUBE_SIZE; y++) {
            for (uint8_t z = 0; z < CUBE_SIZE; z++) {
                float dx = x - center;
                float dy = y - center;
                float dz = z - center;
                float dist = sqrt(dx * dx + dy * dy + dz * dz);
                
                uint8_t brightness = (sin(dist - t) + 1.0) * 127.5;
                uint8_t hue = (uint8_t)(dist * 20);

                leds[xyz(x, y, z)] = CHSV(hue, 255, brightness);
            }
        }
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Dupla Hélice Áurea": `/*
 * Exemplo de código para FastLED: Dupla Hélice Áurea
 * Desenha duas hélices entrelaçadas que giram em torno do eixo Y.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void goldenDoubleHelix() {
    fadeToBlackBy(leds, NUM_LEDS, 50);

    float t = millis() / 1500.0;
    const float TURNS = 1.618 * 2.0;
    const float RADIUS = CUBE_SIZE / 2.0 - 1.5;
    const float CENTER = (CUBE_SIZE - 1) / 2.0;

    for (uint8_t y = 0; y < CUBE_SIZE; y++) {
        float yNorm = (float)y / (CUBE_SIZE - 1);
        float angle = yNorm * 2.0 * PI * TURNS + t;
        
        uint8_t x1 = round(CENTER + cos(angle) * RADIUS);
        uint8_t z1 = round(CENTER + sin(angle) * RADIUS);
        
        uint8_t x2 = round(CENTER + cos(angle + PI) * RADIUS);
        uint8_t z2 = round(CENTER + sin(angle + PI) * RADIUS);

        uint8_t hue = (uint8_t)(yNorm * 255) + (uint8_t)(millis()/20);

        if (x1 < CUBE_SIZE && z1 < CUBE_SIZE) leds[xyz(x1, y, z1)] = CHSV(hue, 255, 255);
        if (x2 < CUBE_SIZE && z2 < CUBE_SIZE) leds[xyz(x2, y, z2)] = CHSV(hue, 255, 255);
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Árvore 3D": `/*
 * Exemplo de código para FastLED: Árvore 3D Estilizada
 * Anima o crescimento de um pinheiro cônico com enfeites piscando.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void tree3D() {
    fill_solid(leds, NUM_LEDS, CRGB::Black);

    // Animação de crescimento suave usando seno
    float t_norm = (sin(millis() / 5000.0 * PI - PI/2.0) + 1.0) / 2.0;
    const float CENTER = (CUBE_SIZE - 1) / 2.0;

    // Tronco
    uint8_t trunkHeight = t_norm * 2.5;
    CRGB trunkColor = CRGB(139, 69, 19);
    for (uint8_t y = 0; y < trunkHeight; y++) {
        leds[xyz(3, y, 3)] = trunkColor;
        leds[xyz(4, y, 3)] = trunkColor;
        leds[xyz(3, y, 4)] = trunkColor;
        leds[xyz(4, y, 4)] = trunkColor;
    }

    // Folhagem (cone)
    uint8_t treeHeight = t_norm * (CUBE_SIZE - 1) + 1;
    CRGB foliageColor = CRGB(0, 100, 20);

    for (uint8_t y = 1; y < treeHeight; y++) {
        float radius = (CUBE_SIZE / 2.5) * (1.0 - (float)y / CUBE_SIZE);
        for (uint8_t x = 0; x < CUBE_SIZE; x++) {
            for (uint8_t z = 0; z < CUBE_SIZE; z++) {
                float dist = sqrt(pow(x - CENTER, 2) + pow(z - CENTER, 2));
                if (dist < radius) {
                    // Enfeites piscantes
                    if ( (x + z + y) % 5 == (millis()/200)%5 ) {
                         uint8_t hue = (x * 30 + y * 20 + z * 10 + millis() / 50) % 255;
                         leds[xyz(x,y,z)] = CHSV(hue, 240, 255);
                    } else {
                         leds[xyz(x,y,z)] = foliageColor;
                    }
                }
            }
        }
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Planos Empilhados": `/*
 * Exemplo de código para FastLED: Planos Empilhados
 * Preenche o cubo com planos horizontais, um de cada vez.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void stackingPlanes() {
    fill_solid(leds, NUM_LEDS, CRGB::Black);
    
    uint8_t numPlanes = 1 + (millis() / 1500) % CUBE_SIZE;
    uint8_t hue = numPlanes * (255 / CUBE_SIZE);
    CRGB color = CHSV(hue, 255, 255);

    for (uint8_t z = 0; z < numPlanes; z++) {
        for (uint8_t y = 0; y < CUBE_SIZE; y++) {
            for (uint8_t x = 0; x < CUBE_SIZE; x++) {
                leds[xyz(x, y, z)] = color;
            }
        }
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Chuva": `/*
 * Exemplo de código para FastLED: Chuva
 * Simula gotas de chuva caindo do topo do cubo.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6
#define NUM_DROPS 34 // Número de gotas simultâneas

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void rain() {
    fadeToBlackBy(leds, NUM_LEDS, 30);
    
    for(int i = 0; i < NUM_DROPS; i++) {
        // Gera posições X e Z pseudo-aleatórias mas consistentes para cada gota
        uint8_t x = sin8(i * 20) >> (8 - log2(CUBE_SIZE));
        uint8_t z = cos8(i * 23) >> (8 - log2(CUBE_SIZE));
        
        // Calcula a posição Y baseada no tempo, com velocidades diferentes
        uint32_t t = millis() * (i + 10) / 15;
        uint8_t y_raw = (t / 100);
        uint8_t y = y_raw % CUBE_SIZE;

        uint8_t hue = i * (255 / NUM_DROPS);
        
        // Desenha a gota com uma pequena cauda
        if(y < CUBE_SIZE) leds[xyz(x, CUBE_SIZE - 1 - y, z)] = CHSV(hue, 255, 255);
        if(y > 0 && y <= CUBE_SIZE) leds[xyz(x, CUBE_SIZE - y, z)] = CHSV(hue, 255, 80);
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Pulso Central": `/*
 * Exemplo de código para FastLED: Pulso Central
 * Uma onda esférica se expande do centro para fora.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
void indexToXyz(uint16_t, uint8_t&, uint8_t&, uint8_t&);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void centerPulse() {
    float t = millis() / 800.0;
    const float CENTER = (CUBE_SIZE - 1) / 2.0;
    const float PULSE_WIDTH = 1.5;
    const float MAX_DIST = sqrt(3 * CENTER * CENTER);
    
    float pulsePosition = fmod(t, MAX_DIST + PULSE_WIDTH * 2);

    for (uint16_t i = 0; i < NUM_LEDS; i++) {
        uint8_t x, y, z;
        indexToXyz(i, x, y, z);
        float dist = sqrt(pow(x-CENTER,2) + pow(y-CENTER,2) + pow(z-CENTER,2));
        float distFromPulse = abs(dist - pulsePosition);

        if (distFromPulse < PULSE_WIDTH) {
            float brightness_f = 1.0 - (distFromPulse / PULSE_WIDTH);
            uint8_t brightness = brightness_f * 255;
            uint8_t hue = (uint8_t)(dist / MAX_DIST * 255) + (uint8_t)(millis()/40);
            leds[i] = CHSV(hue, 255, brightness);
        } else {
            leds[i].fadeToBlackBy(40);
        }
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
void indexToXyz(uint16_t index, uint8_t &x, uint8_t &y, uint8_t &z) {
  if (index >= NUM_LEDS) { x=y=z=0; return; }
  z = index / (CUBE_SIZE*CUBE_SIZE);
  uint16_t l = index % (CUBE_SIZE*CUBE_SIZE);
  if (z%2==0) { y = l/CUBE_SIZE; if(y%2==0){x=l%CUBE_SIZE;}else{x=CUBE_SIZE-1-(l%CUBE_SIZE);} }
  else { uint8_t r = l/CUBE_SIZE; y=CUBE_SIZE-1-r; if(r%2==0){x=CUBE_SIZE-1-(l%CUBE_SIZE);}else{x=l%CUBE_SIZE;} }
}
    `,
    "Cubo Crescente": `/*
 * Exemplo de código para FastLED: Cubo Crescente
 * Um cubo central cresce e encolhe, mudando de cor.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void growingCube() {
    const uint16_t CYCLE_DURATION = 10000;
    const uint8_t NUM_STAGES = CUBE_SIZE + 1;
    uint32_t t = millis() % CYCLE_DURATION;
    uint8_t stage = t / (CYCLE_DURATION / NUM_STAGES);

    fill_solid(leds, NUM_LEDS, CRGB::Black);

    if (stage == 0) return;

    uint8_t size = stage;
    uint8_t start = (CUBE_SIZE - size) / 2;
    uint8_t end = start + size;
    
    uint8_t hue = stage * (255 / NUM_STAGES);
    CRGB color = CHSV(hue, 255, 255);

    for (uint8_t x = start; x < end; x++) {
        for (uint8_t y = start; y < end; y++) {
            for (uint8_t z = start; z < end; z++) {
                leds[xyz(x, y, z)] = color;
            }
        }
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Plasma 3D": `/*
 * Exemplo de código para FastLED: Plasma 3D
 * Um efeito de plasma volumétrico e pulsante.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void plasma3D() {
    float t = millis() / 2000.0;
    for (uint8_t x = 0; x < CUBE_SIZE; x++) {
        for (uint8_t y = 0; y < CUBE_SIZE; y++) {
            for (uint8_t z = 0; z < CUBE_SIZE; z++) {
                float v = sin(x*0.5+t) + sin(y*0.5+t) + sin(z*0.5+t) + sin((x+y+z)*0.3+t);
                uint8_t hue = (0.5 + 0.5 * sin((x - y + z) * 0.2 + t)) * 255;
                uint8_t brightness = (v + 4.0) / 8.0 * 255;
                leds[xyz(x,y,z)] = CHSV(hue, 255, brightness);
            }
        }
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Fogos de Artifício": `/*
 * Exemplo de código para FastLED: Fogos de Artifício
 * Simula foguetes subindo e explodindo em cascas esféricas.
 * NOTA: Este é um padrão complexo e que consome muitos recursos.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

#define MAX_ROCKETS 3
#define MAX_EXPLOSIONS 3

struct Rocket { bool active; float x, y, z, vy; uint8_t hue; };
struct Explosion { bool active; float x, y, z, radius, maxRadius, life; uint8_t hue; };

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);
void indexToXyz(uint16_t, uint8_t&, uint8_t&, uint8_t&);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void fireworks() {
    static Rocket rockets[MAX_ROCKETS];
    static Explosion explosions[MAX_EXPLOSIONS];
    static unsigned long nextFireworkTime = 0;
    
    fadeToBlackBy(leds, NUM_LEDS, 60);

    // Lança um novo foguete
    if (millis() > nextFireworkTime) {
        for(int i=0; i<MAX_ROCKETS; i++) {
            if(!rockets[i].active) {
                rockets[i] = {true, 3.5f+(random8(101)-50)/25.f, 0, 3.5f+(random8(101)-50)/25.f, (7.f+random8(100)/50.f)/10.f, random8()};
                nextFireworkTime = millis() + 1500 + random16(2000);
                break;
            }
        }
    }

    // Atualiza foguetes
    for(int i=0; i<MAX_ROCKETS; i++) {
        if(!rockets[i].active) continue;
        
        rockets[i].y += rockets[i].vy;
        rockets[i].vy -= 9.8 / 10.0 * 0.04;

        if (rockets[i].vy <= 0) { // Explode
            rockets[i].active = false;
            for(int j=0; j<MAX_EXPLOSIONS; j++) {
                if(!explosions[j].active) {
                    explosions[j] = {true, rockets[i].x, rockets[i].y, rockets[i].z, 0, 4.f+random8(100)/50.f, 1.f, rockets[i].hue};
                    break;
                }
            }
        } else {
            leds[xyz(rockets[i].x, rockets[i].y, rockets[i].z)] = CRGB::White;
        }
    }

    // Atualiza explosões
    for(int i=0; i<MAX_EXPLOSIONS; i++) {
        if(!explosions[i].active) continue;

        explosions[i].radius += 0.4;
        explosions[i].life -= 0.03;
        
        if (explosions[i].life <= 0) { explosions[i].active = false; continue; }

        for (uint16_t j=0; j<NUM_LEDS; j++) {
            uint8_t x, y, z;
            indexToXyz(j, x, y, z);
            float dist = sqrt(pow(x-explosions[i].x,2) + pow(y-explosions[i].y,2) + pow(z-explosions[i].z,2));
            float distFromShell = abs(dist - explosions[i].radius);
            
            if (distFromShell < 1.0) {
                uint8_t brightness = (1.0 - distFromShell) * explosions[i].life * 255;
                leds[j] += CHSV(explosions[i].hue, 255, brightness);
            }
        }
    }
}
// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
void indexToXyz(uint16_t index, uint8_t &x, uint8_t &y, uint8_t &z) {
  if (index >= NUM_LEDS) { x=y=z=0; return; }
  z = index / (CUBE_SIZE*CUBE_SIZE);
  uint16_t l = index % (CUBE_SIZE*CUBE_SIZE);
  if (z%2==0) { y = l/CUBE_SIZE; if(y%2==0){x=l%CUBE_SIZE;}else{x=CUBE_SIZE-1-(l%CUBE_SIZE);} }
  else { uint8_t r = l/CUBE_SIZE; y=CUBE_SIZE-1-r; if(r%2==0){x=CUBE_SIZE-1-(l%CUBE_SIZE);}else{x=l%CUBE_SIZE;} }
}
    `,
    "Preenchimento de Eixo": `/*
 * Exemplo de código para FastLED: Preenchimento de Eixo
 * Preenche e esvazia o cubo ao longo do eixo Y com um gradiente de cores.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void axisFill() {
    float t = millis() / 3000.0;
    uint8_t fillLevel = ((sin(t) + 1.0) / 2.0) * CUBE_SIZE;

    for (uint8_t y = 0; y < CUBE_SIZE; y++) {
        CRGB color = (y < fillLevel) ? CHSV(y * (255/CUBE_SIZE), 255, 255) : CRGB::Black;
        for (uint8_t x = 0; x < CUBE_SIZE; x++) {
            for (uint8_t z = 0; z < CUBE_SIZE; z++) {
                leds[xyz(x, y, z)] = color;
            }
        }
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
    "Caminho de Lissajous": `/*
 * Exemplo de código para FastLED: Caminho de Lissajous
 * Desenha o rastro de uma curva de Lissajous 3D.
 */
#include <FastLED.h>

#define CUBE_SIZE 8
#define NUM_LEDS (CUBE_SIZE * CUBE_SIZE * CUBE_SIZE)
#define DATA_PIN 6

CRGB leds[NUM_LEDS];
uint16_t xyz(uint8_t, uint8_t, uint8_t);

// ===============================================================
// FUNÇÃO DO PADRÃO
// ===============================================================
void lissajousPath() {
    fadeToBlackBy(leds, NUM_LEDS, 40);

    float t = millis() / 2000.0;
    const float CENTER = (CUBE_SIZE - 1) / 2.0;

    uint8_t x = round(CENTER + (CUBE_SIZE / 2.0 - 1) * sin(t * 1.0));
    uint8_t y = round(CENTER + (CUBE_SIZE / 2.0 - 1) * cos(t * 1.618));
    uint8_t z = round(CENTER + (CUBE_SIZE / 2.0 - 1) * sin(t * 2.618));
    
    uint8_t hue = (uint8_t)(t * 20);

    if (x < CUBE_SIZE && y < CUBE_SIZE && z < CUBE_SIZE) {
        leds[xyz(x, y, z)] = CHSV(hue, 255, 255);
    }
}

// ===============================================================
// CÓDIGO COMUM
// ===============================================================
uint16_t xyz(uint8_t x, uint8_t y, uint8_t z) {
  if (x >= CUBE_SIZE || y >= CUBE_SIZE || z >= CUBE_SIZE) return 0;
  uint16_t i;
  if (z % 2 == 0) {
    if (y % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + (y * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  } else {
    if ((CUBE_SIZE - 1 - y) % 2 == 0) { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + x; } 
    else { i = (z * CUBE_SIZE * CUBE_SIZE) + ((CUBE_SIZE - 1 - y) * CUBE_SIZE) + (CUBE_SIZE - 1 - x); }
  }
  return i;
}
    `,
};
