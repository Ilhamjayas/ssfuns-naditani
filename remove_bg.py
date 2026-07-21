from PIL import Image, ImageDraw

def remove_background(image_path, output_path, tolerance=30):
    try:
        print(f"Processing {image_path}...")
        img = Image.open(image_path).convert("RGBA")
        
        # Create a mask image for floodfill
        # We add a 2px border to ensure all corners are connected if the background goes to the edge
        # Actually, floodfill in PIL works on the image itself.
        
        # Let's create an alpha mask
        # First, find the background color from top-left corner
        bg_color = img.getpixel((0, 0))
        print(f"Background color detected: {bg_color}")
        
        # We will create a binary mask where the background is black and the foreground is white
        # We can use ImageDraw.floodfill to fill the background with a specific unique color, 
        # then convert that unique color to transparent.
        
        # Unique color that is definitely not in the logo (e.g., magenta)
        magic_color = (255, 0, 255, 255)
        
        # Floodfill from 4 corners
        corners = [(0, 0), (img.width - 1, 0), (0, img.height - 1), (img.width - 1, img.height - 1)]
        
        for corner in corners:
            current_color = img.getpixel(corner)
            # If the corner color is close to the bg_color
            if all(abs(current_color[i] - bg_color[i]) <= tolerance for i in range(3)):
                ImageDraw.floodfill(img, corner, magic_color, thresh=tolerance)
                
        # Now convert magic_color to transparent
        data = img.getdata()
        new_data = []
        for item in data:
            if item == magic_color:
                new_data.append((255, 255, 255, 0)) # Transparent
            else:
                # Basic anti-aliasing edge cleanup: if it's very close to background color, reduce alpha
                # This helps soften the edges.
                dist = sum(abs(item[i] - bg_color[i]) for i in range(3))
                if dist < tolerance + 20 and item[3] > 0:
                    # Fade the edge slightly based on distance to background color
                    # For simplicity, if it's extremely close but wasn't flood-filled, just make it semi-transparent
                    new_data.append(item) # Let's keep it simple for now
                else:
                    new_data.append(item)
                    
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
        
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

remove_background("public/logo/logo-bulat.png", "public/logo/logo-bulat-v2.png", tolerance=50)
remove_background("public/logo/logo-text.png", "public/logo/logo-text-v2.png", tolerance=50)
print("Done!")
