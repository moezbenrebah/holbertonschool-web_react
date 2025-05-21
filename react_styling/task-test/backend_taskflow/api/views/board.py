
from my_auth.clerk_auth import ClerkJWTAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError


###############################################

from my_auth.models import Organization, Board
from my_auth.serializers import BoardSerializer

###############################################

class BoardListCreateAPIView(generics.ListCreateAPIView):

    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BoardSerializer


    def get_queryset(self):
        org_id = self.request.query_params.get('orgId')
        print(org_id)
        if org_id:
            return Board.objects.filter(organization__clerk_organization_id=org_id)
        return Board.objects.none()
    

    def perform_create(self, serializer):
        organization_id = self.request.data.get('organization')
        if not organization_id:
            raise ValidationError({'organization': 'This field is required.'})
        #print(organization_id)
        try:
            organization = Organization.objects.get(clerk_organization_id=organization_id)
            #print(organization)
        except Organization.DoesNotExist:
            raise ValidationError({'organization': 'Invalid organization ID.'})

        serializer.save(owner=self.request.user, organization=organization)


class BoardRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BoardSerializer

    def get_queryset(self):
        org_id = self.request.query_params.get('orgId')

        if not org_id:
            raise ValidationError({'orgId': 'This query parameter is required.'})
    

        return Board.objects.filter(
            organization__clerk_organization_id=org_id,
        )