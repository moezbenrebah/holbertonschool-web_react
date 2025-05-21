
from my_auth.clerk_auth import ClerkJWTAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError


###############################################

from my_auth.models import Organization, AuditLog
from my_auth.serializers import AuditLogSerializer

###############################################

class AuditLogListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AuditLogSerializer

    def get_queryset(self):
        org_id = self.request.query_params.get("orgId")
        entity_id = self.kwargs.get("id", None)

        if not org_id:
            raise ValidationError({"detail": "'orgId' query param is required."})

        queryset = AuditLog.objects.filter(org__clerk_organization_id=org_id)

        if entity_id:
            queryset = queryset.filter(entityId=entity_id)

        return queryset

    def perform_create(self, serializer):

        org_id = self.request.data.get("org")

        if not org_id:
            raise ValidationError({'org': 'This field is required.'})

        try:
            org = Organization.objects.get(clerk_organization_id=org_id)
        except Organization.DoesNotExist:
            raise ValidationError({"org": "Invalid organization ID."})

        serializer.save(org=org)
