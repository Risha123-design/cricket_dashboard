"""
ASGI config for cricket_backend project.
"""

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cricket_backend.settings")

from django.core.asgi import get_asgi_application
from django.contrib.staticfiles.handlers import ASGIStaticFilesHandler

django_asgi_app = get_asgi_application()

django_asgi_app = ASGIStaticFilesHandler(django_asgi_app)

from channels.routing import ProtocolTypeRouter, URLRouter
import cricket.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,

    "websocket": URLRouter(
        cricket.routing.websocket_urlpatterns
    ),
})