FROM node:22-bookworm

# Install required Linux desktop & procps libraries for Electron and web server
RUN apt-get update && apt-get install -y \
    procps \
    xvfb \
    libglib2.0-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Prevent onnxruntime-node from attempting CUDA/GPU binary installation on CPU cloud instances
ENV ONNXRUNTIME_NODE_INSTALL_CUDA=skip

# Copy entire monorepo
COPY . .

# Set working directory to the backend/desktop app directory where server.mjs lives
WORKDIR /app/natively-cluely-ai-assistant

RUN npm install

# Build the web bundle for production serving
RUN npm run build

EXPOSE 8080 5180

CMD ["node", "server.mjs"]
