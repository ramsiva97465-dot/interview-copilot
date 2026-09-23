#!/usr/bin/env bash
#
# MeetFloo Clean Reset & Fallback Models Installer for macOS
# This script stops MeetFloo, wipes all legacy caches, databases, preferences, and Keychain secrets,
# and then downloads and installs the 12 required local fallback models into MeetFloo.app.
#
# Exit immediately if a command exits with a non-zero status.
set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Helper for colored logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}
log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}
log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Print header
echo -e "${CYAN}${BOLD}=====================================================${NC}"
echo -e "${CYAN}${BOLD}     MeetFloo Deep Clean & Fallback Installer        ${NC}"
echo -e "${CYAN}${BOLD}=====================================================${NC}"
echo ""

# Confirm before proceeding
log_warning "This will permanently wipe all local settings, databases, and cached models before performing a clean models installation."
read -p "Are you sure you want to proceed? (y/N): " -r confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# ---------------------------------------------------------
# Part 1: Deep Clean Legacies
# ---------------------------------------------------------
log_info "Part 1: Stopping MeetFloo and wiping legacy data..."

# Kill running processes
killall MeetFloo 2>/dev/null || true
killall MeetFloo 2>/dev/null || true
sleep 1

remove_dir() {
    local path="$1"
    path="${path/#\~/$HOME}"
    if [ -d "$path" ] || [ -f "$path" ]; then
        echo -e "${BLUE}[CLEANING]${NC} Removing: $path"
        rm -rf "$path"
    fi
}

remove_dir "~/Library/Application Support/MeetFloo"
remove_dir "~/Library/Application Support/MeetFloo"
remove_dir "~/Library/Application Support/answercue"
remove_dir "~/Library/Application Support/Electron/MeetFloo.db"
remove_dir "~/Library/Application Support/Electron/MeetFloo-preferences-secure.json"
remove_dir "~/Library/Caches/MeetFloo-updater"
remove_dir "~/Library/Caches/MeetFloo"
remove_dir "~/Library/Caches/com.electron.meeting-notes"
remove_dir "~/Library/Preferences/com.electron.meeting-notes.plist"
remove_dir "~/Library/Saved Application State/com.electron.meeting-notes.savedState"

# Clear Keychain entries
delete_keychain_item() {
    local service="$1"
    local account="$2"
    if security find-generic-password -s "$service" -a "$account" >/dev/null 2>&1; then
        echo -e "${BLUE}[CLEANING]${NC} Deleting Keychain entry: $service ($account)"
        security delete-generic-password -s "$service" -a "$account" >/dev/null 2>&1 || true
    fi
}

delete_keychain_item "Electron Safe Storage" "Electron Key"
delete_keychain_item "MeetFloo Safe Storage" "MeetFloo Key"
delete_keychain_item "MeetFloo Safe Storage" "MeetFloo Key"
delete_keychain_item "MeetFloo Safe Storage" "Electron Key"

defaults delete com.electron.meeting-notes >/dev/null 2>&1 || true

log_success "Cleanup complete! Cache and legacy directories wiped."
echo ""

# ---------------------------------------------------------
# Part 2: Fallback Model Installation
# ---------------------------------------------------------
log_info "Part 2: Installing fallback models..."

# 1. Detect MeetFloo.app path
detect_MeetFloo_app() {
    log_info "Detecting MeetFloo.app path..."
    local mdfind_res
    mdfind_res=$(mdfind "kMDItemCFBundleIdentifier == 'com.electron.meeting-notes'" 2>/dev/null | head -n 1)
    
    if [ -n "$mdfind_res" ] && [ -d "$mdfind_res" ]; then
        echo "$mdfind_res"
        return 0
    fi
    if [ -d "/Applications/MeetFloo.app" ]; then
        echo "/Applications/MeetFloo.app"
        return 0
    fi
    if [ -d "$HOME/Applications/MeetFloo.app" ]; then
        echo "$HOME/Applications/MeetFloo.app"
        return 0
    fi
    echo ""
    return 1
}

MEETFLOO_APP_PATH=$(detect_MeetFloo_app || true)

if [ -n "$MEETFLOO_APP_PATH" ]; then
    log_success "Found MeetFloo.app at: ${BOLD}$MEETFLOO_APP_PATH${NC}"
else
    log_warning "Could not automatically locate MeetFloo.app."
    echo -n "Please drag & drop your MeetFloo.app here (or enter its path): "
    read -r user_path
    user_path=$(echo "$user_path" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e "s/^'//" -e "s/'$//" -e 's/^"//' -e 's/"$//' -e 's/\\//g')
    if [ -d "$user_path" ]; then
        MEETFLOO_APP_PATH="$user_path"
        log_success "Using path: ${BOLD}$MEETFLOO_APP_PATH${NC}"
    else
        log_error "Directory does not exist: $user_path"
        exit 1
    fi
fi

RESOURCES_DIR="$MEETFLOO_APP_PATH/Contents/Resources"
if [ ! -d "$RESOURCES_DIR" ]; then
    log_error "Not a valid macOS app bundle (missing Contents/Resources): $MEETFLOO_APP_PATH"
    exit 1
fi

# 2. Setup temporary directory for downloading
TEMP_DIR="$HOME/Downloads/MeetFloo-Fallback-Models-Temp"
log_info "Creating temporary download directory at: ${BOLD}$TEMP_DIR${NC}"
mkdir -p "$TEMP_DIR"

cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        log_info "Cleaning up temporary download files..."
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

# 3. Models configuration
HF_BASE_URL="https://huggingface.co"
MODELS_TO_DOWNLOAD=(
  "Xenova/all-MiniLM-L6-v2/config.json"
  "Xenova/all-MiniLM-L6-v2/tokenizer.json"
  "Xenova/all-MiniLM-L6-v2/tokenizer_config.json"
  "Xenova/all-MiniLM-L6-v2/onnx/model_quantized.onnx"
  
  
  "Xenova/ms-marco-MiniLM-L-6-v2/config.json"
  "Xenova/ms-marco-MiniLM-L-6-v2/tokenizer.json"
  "Xenova/ms-marco-MiniLM-L-6-v2/tokenizer_config.json"
  "Xenova/ms-marco-MiniLM-L-6-v2/onnx/model_quantized.onnx"
)

download_file() {
    local rel_path="$1"
    local temp_path="$TEMP_DIR/$rel_path"
    local org=$(echo "$rel_path" | cut -d'/' -f1)
    local repo=$(echo "$rel_path" | cut -d'/' -f2)
    local subpath=$(echo "$rel_path" | cut -d'/' -f3-)
    local download_url="$HF_BASE_URL/$org/$repo/resolve/main/$subpath"
    
    mkdir -p "$(dirname "$temp_path")"
    log_info "Downloading: $rel_path"
    if ! curl -L -# -o "$temp_path" "$download_url"; then
        log_error "Failed to download $rel_path"
        return 1
    fi
    if [ ! -s "$temp_path" ]; then
        log_error "Downloaded file $rel_path is empty."
        return 1
    fi
    return 0
}

# 4. Download loop
log_info "Downloading 12 required fallback model files (approx. 470 MB total)..."
for file in "${MODELS_TO_DOWNLOAD[@]}"; do
    if ! download_file "$file"; then
        log_error "Download failed at file: $file"
        exit 1
    fi
done
log_success "All model files downloaded successfully."

# 5. Copy to MeetFloo.app Resources
DEST_DIR="$RESOURCES_DIR/models"
log_info "Installing models to: ${BOLD}$DEST_DIR${NC}"

if [ -w "$RESOURCES_DIR" ]; then
    log_info "Copying models directly..."
    mkdir -p "$DEST_DIR"
    cp -R "$TEMP_DIR/Xenova" "$DEST_DIR/"
else
    log_info "Installing into /Applications requires administrator privileges."
    log_warning "Please enter your macOS password when prompted."
    sudo mkdir -p "$DEST_DIR"
    sudo cp -R "$TEMP_DIR/Xenova" "$DEST_DIR/"
    sudo chmod -R 755 "$DEST_DIR"
fi

# 6. Verification
log_info "Verifying installed model files..."
ALL_OK=true
for rel_path in "${MODELS_TO_DOWNLOAD[@]}"; do
    FILE_PATH="$DEST_DIR/$rel_path"
    if [ ! -f "$FILE_PATH" ] || [ ! -s "$FILE_PATH" ]; then
        log_error "Missing or empty file in app bundle: $rel_path"
        ALL_OK=false
    fi
done

if [ "$ALL_OK" = true ]; then
    log_success "Verification successful! All 12 model files are present and active."
    echo ""
    echo -e "${GREEN}${BOLD}=====================================================${NC}"
    echo -e "${GREEN}${BOLD}  CLEAN RESET AND INSTALLATION SUCCESSFUL!          ${NC}"
    echo -e "${GREEN}${BOLD}  You can now start MeetFloo.                       ${NC}"
    echo -e "${GREEN}${BOLD}=====================================================${NC}"
else
    log_error "Installation verification failed. Some files were not successfully copied."
    exit 1
fi
