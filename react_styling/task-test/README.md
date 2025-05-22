# MindFlow: Meditation & Mindfulness Web Application

![MindFlow Interface Preview](https://via.placeholder.com/800x400?text=MindFlow+Interface) <!-- Add actual preview image -->

A modern web application for meditation practice featuring synchronized audio-visual experiences. Combines Web Audio API with React for immersive mindfulness sessions.

[![Live Demo](https://img.shields.io/badge/Demo-Live_Site-green)](https://mindflow.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🌟 Key Features

### Core Functionality
- **Guided Meditation Library**
  - Preloaded nature sounds and guided sessions
  - Cross-browser HTML5 audio playback
  - Now Playing bar with persistent controls
  - Volume normalization and mute toggle

- **Dynamic Visualizations**
  - Real-time frequency analysis (Web Audio API)
  - Multiple visualization modes:
    - Frequency bars
    - Waveform display
    - Circular spectrum
    - Particle systems
  - Customizable color themes

### User Experience
- 🧑💻 **User Profiles**
  - LocalStorage persistence for settings
  - Meditation history tracking
  - Customizable preferences
- 🎨 **Theme Engine**
  - Light/dark mode support
  - Custom accent colors
  - Visualization style presets
- ♿ **Accessibility First**
  - WCAG 2.1 compliant contrast ratios
  - Keyboard navigation support
  - Screen reader optimized

## 🛠 Technology Stack

### Core Architecture
- **Framework**: Next.js 13 (React) with TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: React Context API
- **Persistence**: Browser LocalStorage

### Audio Processing
- **Web Audio API** for real-time analysis
- **HTML5 Audio Element** for playback
- Custom audio processing pipeline:
  ```mermaid
  graph LR
    A[Audio File] --> B[HTML5 Audio]
    B --> C[Web Audio Context]
    C --> D[Analyser Node]
    D --> E[Frequency Data]
    E --> F[Visualization]

### Instllation

git clone https://github.com/your-repo/mindflow.git
cd mindflow
npm install
npm run dev

### Core Contribuitors

Sean A Cardona
Raphael Santos
Ladie Juarbe
