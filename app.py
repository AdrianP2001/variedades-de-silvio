import webview
import os
import sys
import threading
import base64
import socket
import ctypes
from http.server import SimpleHTTPRequestHandler
import socketserver

def resource_path(relative_path):
    """Obtiene la ruta absoluta al recurso, compatible con desarrollo y PyInstaller"""
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

class Handler(SimpleHTTPRequestHandler):
    # Forzar los tipos MIME principales por si el Windows del cliente (ej. Phoenix LiteOS) 
    # tiene el registro de extensiones recortado/dañado.
    extensions_map = SimpleHTTPRequestHandler.extensions_map.copy()
    extensions_map.update({
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.html': 'text/html',
        '.json': 'application/json',
    })

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=resource_path("."), **kwargs)

    def log_message(self, format, *args):
        pass

class Api:
    def save_file_native(self, filename, content_b64):
        try:
            window = webview.windows[0]
            if filename.endswith('.json'):
                file_types = ('JSON Files (*.json)', 'All files (*.*)')
            elif filename.endswith('.xlsx'):
                file_types = ('Excel Files (*.xlsx)', 'All files (*.*)')
            elif filename.endswith('.pdf'):
                file_types = ('PDF Files (*.pdf)', 'All files (*.*)')
            elif filename.endswith('.csv'):
                file_types = ('CSV Files (*.csv)', 'All files (*.*)')
            else:
                file_types = ('All files (*.*)',)
                
            result = window.create_file_dialog(webview.SAVE_DIALOG, save_filename=filename, file_types=file_types)
            if result:
                with open(result[0], 'wb') as f:
                    f.write(base64.b64decode(content_b64))
                return True
        except Exception as e:
            print("Error al guardar archivo:", e)
        return False

def start_server(port):
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", port), Handler) as httpd:
        httpd.serve_forever()

def check_single_instance(port):
    """Verifica si la aplicación ya está abierta usando el puerto"""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        # Intentar conectar al puerto. Si se conecta, es porque ya hay otra instancia corriendo.
        s.connect(("127.0.0.1", port))
        s.close()
        # Mostrar mensaje de error nativo en Windows
        ctypes.windll.user32.MessageBoxW(0, "La aplicación ya se encuentra abierta.", "Aviso - Variedades de Silvio", 0x30 | 0x0)
        sys.exit(0)
    except socket.error:
        # Si da error, significa que el puerto está libre, no hay otra instancia.
        pass

def on_closing():
    """Pregunta antes de cerrar la ventana"""
    # Si retorna True, se cierra. Si retorna False, se cancela el cierre.
    global window
    return window.create_confirmation_dialog('Cerrar Sistema', '¿Estás seguro que querés salir de Variedades de Silvio?')

if __name__ == '__main__':
    PORT = 8432
    
    # 1. Prevenir múltiples instancias
    check_single_instance(PORT)
    
    # 2. Iniciar servidor local
    t = threading.Thread(target=start_server, args=(PORT,), daemon=True)
    t.start()
    
    # 3. Iniciar ventana
    api = Api()
    url = f"http://127.0.0.1:{PORT}/index.html"
    window = webview.create_window(
        'Variedades de Silvio',
        url,
        js_api=api,
        width=1280,
        height=800,
        min_size=(800, 600)
    )
    
    # 4. Asignar evento de confirmación de cierre
    window.events.closing += on_closing
    
    webview.start()
