from my_auth.clerk_auth import ClerkJWTAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError


###############################################

from my_auth.models import Organization, OrgSubscription
from my_auth.serializers import OrgSubscriptionSerializer


###############################################


class OrgSubscriptionAPIView(generics.RetrieveAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrgSubscriptionSerializer

    def get_object(self):
        external_org_id = self.kwargs['org']
        print(external_org_id)
        try:
            organization = Organization.objects.get(clerk_organization_id=external_org_id)
        except Organization.DoesNotExist:
            raise ValidationError({"org": "Invalid organization ID."})

        try:
            return OrgSubscription.objects.get(org=organization)
        except OrgSubscription.DoesNotExist:
            return None
