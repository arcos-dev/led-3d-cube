# LED 3D Cube Visualizer

A high-fidelity 3D LED cube visualizer for Wokwi Arduino Simulator with Three.js. Features realistic PWM simulation, dynamic color oscillation, and synchronized dual-platform animations (Arduino + Web).

## 🎯 Features

### Core Visualization
- **8×8×8 LED Cube**: 512 individual addressable LEDs
- **Real-time Synchronization**: Live updates from Wokwi simulator
- **Realistic LED Effects**:
  - PWM simulation with sinusoidal oscillation and flicker
  - RGB-independent color oscillation
  - Brightness pulsation effects
  - Dynamic material properties (metalness, roughness, opacity)
- **Advanced Lighting**:
  - 4-light setup (ambient, main, fill, accent)
  - Shadow mapping with 2048×2048 resolution
  - Dual glow layers for depth perception
- **Post-Processing**:
  - Unreal Bloom with customizable parameters
  - Real-time performance counter (FPS)
- **Smooth Animations**: 60 FPS performance maintained

### Animations (8 Total)
1. **Espiral 3D Fibonacci** - Rotating Fibonacci spiral pattern
2. **Ondas de Fibonacci** - Layered wave propagation
3. **Partículas Fibonacci** - Orbiting particle system
4. **Hélice de Fibonacci** - Dual spiral helix
5. **Kaleidoscópio Fractal** - Fractal mirror patterns ✨ NEW
6. **Chuva de Meteoros** - Falling particles with trails ✨ NEW
7. **Aurora Boreal 3D** - Fluid wave effects ✨ NEW
8. **Pulso Cardíaco** - Expanding pulse waves ✨ NEW

*All animations include PWM realism effects*

## 🚀 Quick Start

### Online Viewer
- **Live Demo**: https://arcos-dev.github.io/led-3d-cube/
- **Wokwi Project**: https://wokwi.com/projects/446347101119772673

### Local Development
```bash
# Clone the repository
git clone https://github.com/arcos-dev/led-3d-cube.git
cd led-3d-cube

# Start a simple HTTP server
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

## 🔧 Hardware Setup

### Requirements
- **Arduino Mega 2560** (configurable for other boards)
- **512× WS2812B NeoPixel LEDs** (8×8×8 cube)
- **5V Power Supply** (appropriate amperage for 512 LEDs)
- **FastLED Library** (v3.10.3 or later)

### Arduino Code
- Firmware: `FiboCube3D.ino` (573 lines)
- Compiles to: ~52KB flash, ~8KB SRAM
- Upload speed: 115200 baud

## 🌐 Wokwi Integration

### Online Simulation
Run this project directly in Wokwi:
- **Project Link**: https://wokwi.com/projects/446347101119772673
- **No setup required** - everything runs in the browser

### Custom View Setup
Configure your own Wokwi project to use this visualizer:

1. In your Wokwi project, add a Custom View:
   ```json
   {
     "type": "custom_view",
     "url": "https://arcos-dev.github.io/led-3d-cube/"
   }
   ```

2. The visualizer automatically listens for LED data:
   ```javascript
   window.parent.postMessage({
     app: 'wokwi',
     command: 'listen',
     version: 1
   }, '*');
   ```

3. LED data format (32-bit RGB):
   - Bits 8-15: Red channel (0-255)
   - Bits 16-23: Green channel (0-255)
   - Bits 0-7: Blue channel (0-255)

## 📊 Technical Details

### PWM Realism Algorithm
Simulates realistic LED behavior with:
- **Sinusoidal Oscillation**: `sin(index × 0.5 + time × frequency) × 0.5 + 0.5`
- **Random Flicker**: 0-6% brightness variation
- **Combined Effect**: `(oscillation × 0.7 + 0.3) × (1.0 - flicker)`

### Color Oscillation
Independent RGB channel modulation:
- Red: ±0.04 @ 0.8× frequency
- Green: ±0.04 @ 0.85× frequency
- Blue: ±0.04 @ 0.75× frequency

### Pulsation
Dynamic intensity: `sin(time × 1.5 + index × 0.2) × 0.15 + 0.85`

### Material Properties
Dynamic per-LED adjustment:
- **Metalness**: 0.6-0.8 based on intensity
- **Roughness**: 0.15-0.25 based on intensity
- **Opacity**: 0.80-1.0 based on intensity

## 📁 Project Structure

```
led-3d-cube/
├── index.html              # Main visualization (399 lines, inline Three.js)
├── FiboCube3D.ino          # Arduino firmware (573 lines)
├── README.md               # This file
└── package.json            # Metadata
```

## 🎨 Technologies

- **Three.js** (r181+): 3D graphics rendering with WebGL 2.0
- **FastLED** (3.10.3): Arduino LED library
- **Vanilla JavaScript** (ES6+): No frameworks or build tools
- **HTML5 Canvas**: Hardware-accelerated rendering
- **Wokwi Simulator**: Arduino hardware emulation

## 📈 Performance

- **FPS**: 60 FPS on modern hardware
- **Flash Usage**: ~52KB (Arduino)
- **SRAM Usage**: ~8KB (Arduino)
- **LED Update Rate**: Real-time synchronized
- **Render Resolution**: Up to 4K+

## 📝 Files

- `index.html` - Three.js visualization with LEDRealism class
- `FiboCube3D.ino` - Arduino firmware with 8 animations

## 🔗 Resources

- **Wokwi Project**: https://wokwi.com/projects/446347101119772673
- **GitHub Repository**: https://github.com/arcos-dev/led-3d-cube
- **GitHub Pages**: https://arcos-dev.github.io/led-3d-cube/
- **Three.js Documentation**: https://threejs.org/docs/
- **FastLED Documentation**: https://fastled.io/

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**arcos-dev** - LED Cube 3D Visualizer Project

---

**Last Updated**: October 2025

