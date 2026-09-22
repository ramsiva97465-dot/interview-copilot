import os
import numpy as np
from PIL import Image

def generate_hq_logos():
    p_dark = 'C:/Users/siva/.gemini/antigravity-ide/brain/5100d81f-d7bf-4701-9821-00a9ca382cb6/.user_uploaded/media_1790103186119.jpg'
    p_light = 'C:/Users/siva/.gemini/antigravity-ide/brain/5100d81f-d7bf-4701-9821-00a9ca382cb6/.user_uploaded/media_1790103194110.jpg'

    img_dark = Image.open(p_dark).convert('RGB')
    img_light = Image.open(p_light).convert('RGB')

    d = np.array(img_dark, dtype=np.float32)
    l = np.array(img_light, dtype=np.float32)

    # ─────────────────────────────────────────────────────────────
    # 1. MF Ribbon Mark (Isolated, Transparent)
    # ─────────────────────────────────────────────────────────────
    # Crop ribbon area
    rx1, rx2, ry1, ry2 = 60, 350, 80, 265
    d_ribbon = d[ry1:ry2, rx1:rx2]
    l_ribbon = l[ry1:ry2, rx1:rx2]

    # Two-background matting
    diff = (l_ribbon - d_ribbon) / 255.0
    diff_mean = np.mean(diff, axis=2)
    alpha_ribbon = np.clip(1.0 - diff_mean, 0.0, 1.0)
    alpha_ribbon[alpha_ribbon < 0.04] = 0.0

    fg_ribbon = np.zeros_like(d_ribbon)
    mask = alpha_ribbon > 0.01
    for c in range(3):
        fg_ribbon[:, :, c][mask] = np.clip(d_ribbon[:, :, c][mask] / alpha_ribbon[mask], 0, 255)

    rgba_ribbon = np.dstack([fg_ribbon, alpha_ribbon * 255.0]).astype(np.uint8)
    ribbon_img = Image.fromarray(rgba_ribbon, 'RGBA')
    bbox_ribbon = ribbon_img.getbbox()
    ribbon_cropped = ribbon_img.crop(bbox_ribbon)
    print(f"Extracted Ribbon Mark cropped dimensions: {ribbon_cropped.size}")

    # ─────────────────────────────────────────────────────────────
    # 2. Master Square Icon (1024x1024)
    # Centered with optimal margins (82% scale)
    # ─────────────────────────────────────────────────────────────
    master_square = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    rw, rh = ribbon_cropped.size
    target_w = 820
    target_h = int(rh * (target_w / rw))
    ribbon_resized = ribbon_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    pos_x = (1024 - target_w) // 2
    pos_y = (1024 - target_h) // 2
    master_square.paste(ribbon_resized, (pos_x, pos_y), ribbon_resized)
    print("Master 1024x1024 square mark prepared.")

    # ─────────────────────────────────────────────────────────────
    # 3. Full Logo Dark (Transparent with White Text)
    # ─────────────────────────────────────────────────────────────
    fx1, fx2, fy1, fy2 = 60, 970, 80, 265
    d_full = d[fy1:fy2, fx1:fx2]
    max_c = np.max(d_full, axis=2)
    alpha_dark = np.clip((max_c - 7.0) / 28.0, 0.0, 1.0)
    alpha_dark[max_c <= 7.0] = 0.0

    fg_dark = np.zeros_like(d_full)
    mask_d = alpha_dark > 0.01
    for c in range(3):
        fg_dark[:, :, c][mask_d] = np.clip(d_full[:, :, c][mask_d] / alpha_dark[mask_d], 0, 255)

    full_dark_rgba = np.dstack([fg_dark, alpha_dark * 255.0]).astype(np.uint8)
    full_dark_img = Image.fromarray(full_dark_rgba, 'RGBA')
    full_dark_cropped = full_dark_img.crop(full_dark_img.getbbox())
    print(f"Extracted Full Logo Dark: {full_dark_cropped.size}")

    # ─────────────────────────────────────────────────────────────
    # 4. Full Logo Light (Transparent with Dark Text)
    # ─────────────────────────────────────────────────────────────
    l_full = l[fy1:fy2, fx1:fx2]
    dist_white = 255.0 - np.min(l_full, axis=2)
    alpha_light = np.clip((dist_white - 7.0) / 28.0, 0.0, 1.0)
    alpha_light[dist_white <= 7.0] = 0.0

    fg_light = np.zeros_like(l_full)
    mask_l = alpha_light > 0.01
    for c in range(3):
        fg_light[:, :, c][mask_l] = np.clip((l_full[:, :, c][mask_l] - 255.0 * (1.0 - alpha_light[mask_l])) / alpha_light[mask_l], 0, 255)

    full_light_rgba = np.dstack([fg_light, alpha_light * 255.0]).astype(np.uint8)
    full_light_img = Image.fromarray(full_light_rgba, 'RGBA')
    full_light_cropped = full_light_img.crop(full_light_img.getbbox())
    print(f"Extracted Full Logo Light: {full_light_cropped.size}")

    # ─────────────────────────────────────────────────────────────
    # 5. Save Assets Across The Entire Codebase
    # ─────────────────────────────────────────────────────────────
    base_dir = os.path.abspath('.')

    # Full logos for landing & themes
    full_dark_cropped.save(os.path.join(base_dir, 'src/assets/logo-full-dark.png'))
    full_dark_cropped.save(os.path.join(base_dir, 'src/assets/logo-full-dark.webp'))
    full_light_cropped.save(os.path.join(base_dir, 'src/assets/logo-full-light.png'))
    full_light_cropped.save(os.path.join(base_dir, 'src/assets/logo-full-light.webp'))

    # Square logomarks & icons
    # src/assets
    master_square.resize((644, 644), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'src/assets/logo.png'))
    master_square.resize((644, 644), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'src/assets/logo.webp'))
    master_square.save(os.path.join(base_dir, 'src/assets/logowebsite.png'))

    # src/components
    master_square.resize((644, 644), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'src/components/icon.png'))

    # assets/
    master_square.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'assets/icon.png'))
    master_square.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'assets/icon-512.png'))

    # assets/icons/png/
    png_dir = os.path.join(base_dir, 'assets/icons/png')
    os.makedirs(png_dir, exist_ok=True)
    master_square.save(os.path.join(png_dir, 'icon_1024x1024.png'))
    for sz in [512, 256, 128, 64, 32, 16]:
        resized = master_square.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(os.path.join(png_dir, f'icon_{sz}x{sz}.png'))

    # assets/icons/win/icon.ico
    win_dir = os.path.join(base_dir, 'assets/icons/win')
    os.makedirs(win_dir, exist_ok=True)
    ico_path = os.path.join(win_dir, 'icon.ico')
    master_square.save(ico_path, format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
    print(f"Generated {ico_path}")

    # renderer/public
    renderer_public = os.path.join(base_dir, 'renderer/public')
    if os.path.exists(renderer_public):
        master_square.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(renderer_public, 'logo512.png'))
        master_square.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(renderer_public, 'logo192.png'))
        master_square.save(os.path.join(renderer_public, 'favicon.ico'), format='ICO', sizes=[(16,16), (32,32), (48,48)])
        print("Updated renderer/public logos and favicon.")

    # public in root (create if missing for web dev/vite)
    root_public = os.path.join(base_dir, 'public')
    os.makedirs(root_public, exist_ok=True)
    master_square.save(os.path.join(root_public, 'favicon.ico'), format='ICO', sizes=[(16,16), (32,32), (48,48)])
    master_square.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(root_public, 'icon-512.png'))
    master_square.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(root_public, 'icon-192.png'))

    print("ALL HQ LOGO ASSETS SUCCESSFULLY GENERATED!")

if __name__ == '__main__':
    generate_hq_logos()
