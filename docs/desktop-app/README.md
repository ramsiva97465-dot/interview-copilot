# Desktop App Guide

The `natively-cluely-ai-assistant` folder houses the primary desktop co-pilot application.

## Core Stack
- **Electron**: Window management, global hotkeys, audio capture, IPC bridges.
- **React**: Renderer application interface and overlay popups.
- **Native Modules**: Rust NAPI bindings and C++ audio STT integration.

## Development

```bash
cd natively-cluely-ai-assistant
npm run app:dev
```
