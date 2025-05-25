from PIL import Image
import os

# Set the path to your folder with the 10 images
folder = "/Applications/VSCODE/Heart_Throb/BF's HT"

# Ensure the folder exists
if not os.path.exists(folder):
    raise FileNotFoundError(f"The folder '{folder}' does not exist.")

# Layout: 2 rows x 3 columns
rows, cols = 2, 3
count = 1  # To name files HTBF1, HTBF2, ...

# Loop through each image in the folder
for filename in os.listdir(folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        img_path = os.path.join(folder, filename)
        img = Image.open(img_path)
        img_width, img_height = img.size
        boy_width = img_width // cols
        boy_height = img_height // rows

        # Crop and save each of the 6 boys
        for i in range(rows):
            for j in range(cols):
                left = j * boy_width
                upper = i * boy_height
                right = left + boy_width
                lower = upper + boy_height
                crop = img.crop((left, upper, right, lower))
                output_path = os.path.join(folder, f"HTBF{count}.jpg")
                crop.save(output_path)
                count += 1

print(f"✅ Done! {count - 1} images saved to the same folder.")
