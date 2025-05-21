from functools import wraps

from rest_framework.authentication import BaseAuthentication
from clerk_backend_api import authenticate_request, AuthenticateRequestOptions
from django.conf import settings
from .models import ClerkUser
from rest_framework.exceptions import NotFound


CLERK_AUTHORIZED_PARTIES=settings.CLERK_AUTHORIZED_PARTIES
CLERK_SECRET_KEY=settings.CLERK_SECRET_KEY


class ClerkJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        if 'Authorization' not in request.headers:
            return None

        try:
            auth_result = authenticate_request(
                request,
                AuthenticateRequestOptions(
                    secret_key=CLERK_SECRET_KEY,
                    authorized_parties=CLERK_AUTHORIZED_PARTIES,
                )
            )

            if not auth_result.is_signed_in:
                return None
            
            #print(auth_result)
            clerk_id = auth_result.payload["sub"]
            #print(clerk_id)
            try:
                user = ClerkUser.objects.get(clerk_user_id=clerk_id)
            except ClerkUser.DoesNotExist:
                raise NotFound(detail="User not found")
            return (user, None)

        except Exception:
            return None