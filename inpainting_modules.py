import base64
from io import BytesIO
from PIL import Image
import torch
from diffusers import StableDiffusionInpaintPipeline

def load_model():
    model = StableDiffusionInpaintPipeline.from_pretrained(
        "runwayml/stable-diffusion-inpainting",
        torch_dtype=torch.float16
    )
    model.to("cuda")
    return model

model = load_model()

def inpaint_image(image_base64, mask_base64):
    image = Image.open(BytesIO(base64.b64decode(image_base64)))
    mask = Image.open(BytesIO(base64.b64decode(mask_base64)))

    result = model(image=image, mask_image=mask)
    buffered = BytesIO()
    result.images[0].save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()
