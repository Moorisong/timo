import os
from PIL import Image

def pad_image_fit(image_path, target_width, target_height, output_path):
    img = Image.open(image_path)
    w, h = img.size
    
    # Calculate target aspect
    target_aspect = target_width / target_height
    aspect = w / h
    
    if aspect > target_aspect:
        # Original is wider than target aspect ratio -> scale based on width
        new_w = target_width
        new_h = int(target_width / aspect)
    else:
        # Original is taller than target aspect ratio -> scale based on height
        new_h = target_height
        new_w = int(target_height * aspect)
        
    # Resize keeping aspect ratio
    resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create target canvas and paste resized image in center
    canvas = Image.new("RGB", (target_width, target_height), (0, 0, 0))
    x_offset = (target_width - new_w) // 2
    y_offset = (target_height - new_h) // 2
    canvas.paste(resized_img, (x_offset, y_offset))
    
    canvas.save(output_path, "JPEG", quality=95)
    print(f"Padded & scaled {image_path} ({w}x{h}) -> {output_path} ({canvas.size[0]}x{canvas.size[1]})")

# Paths
brain_dir = "/Users/shkim/.gemini/antigravity-ide/brain/7eab8e0c-f4cb-464c-b08a-6ff72401e516"
assets_dir = "/Users/shkim/Desktop/Project/timo/assets/images"

# 1. 휴대전화 스크린샷 (기존)
pad_image_fit(
    os.path.join(brain_dir, "media__1781596542052.jpg"),
    1024,
    576,
    os.path.join(assets_dir, "screenshot_1.jpg")
)
pad_image_fit(
    os.path.join(brain_dir, "media__1781596542509.jpg"),
    576,
    1024,
    os.path.join(assets_dir, "screenshot_2.jpg")
)

# 2. 10인치 태블릿 스크린샷 추가 (최소 1080px 이상, 16:9 / 9:16 비율)
# tablet_screenshot_1 (16:9 가로 -> 1920x1080)
pad_image_fit(
    os.path.join(brain_dir, "media__1781596542052.jpg"),
    1920,
    1080,
    os.path.join(assets_dir, "tablet_screenshot_1.jpg")
)
# tablet_screenshot_2 (9:16 세로 -> 1080x1920)
pad_image_fit(
    os.path.join(brain_dir, "media__1781596542509.jpg"),
    1080,
    1920,
    os.path.join(assets_dir, "tablet_screenshot_2.jpg")
)
