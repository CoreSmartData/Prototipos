from PIL import Image, ImageEnhance
import os

def mejorar_calidad_imagen(ruta_imagen):
    # Cargar la imagen
    imagen = Image.open(ruta_imagen)
    
    # Mejorar la calidad de la imagen
    enhancer = ImageEnhance.Sharpness(imagen)
    imagen_mejorada = enhancer.enhance(5.0)  # Aumentar la nitidez
    
    # Crear directorio si no existe
    directorio_mejorado = os.path.join("mejorada_Utilities")
    if not os.path.exists(directorio_mejorado):
        os.makedirs(directorio_mejorado)
    
    # Guardar la imagen mejorada
    nombre_imagen = os.path.basename(ruta_imagen)
    ruta_imagen_mejorada = os.path.join(directorio_mejorado, nombre_imagen)
    imagen_mejorada.save(ruta_imagen_mejorada)
    
    return ruta_imagen_mejorada

# Ejemplo de uso
ruta_imagen = os.path.join("Utilities", "core-logo1.png")
ruta_imagen_mejorada = mejorar_calidad_imagen(ruta_imagen)
print(f"Imagen mejorada guardada en: {ruta_imagen_mejorada}")
