from rest_framework import generics 
from my_auth.clerk_auth import ClerkJWTAuthentication
from rest_framework.permissions import IsAuthenticated

###############################################

from my_auth.models import Organization
from my_auth.serializers import OrganisationSerializers

###############################################

class OrganizationRetrieve(generics.RetrieveAPIView):

    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrganisationSerializers
    queryset = Organization.objects.all()
    lookup_field = 'clerk_organization_id'
    