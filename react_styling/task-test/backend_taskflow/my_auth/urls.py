from django.urls import path
from .views import ClerkWebhookView

urlpatterns = [
    path('webhooks/clerk/', ClerkWebhookView.as_view(), name='clerk-webhook'),

]
