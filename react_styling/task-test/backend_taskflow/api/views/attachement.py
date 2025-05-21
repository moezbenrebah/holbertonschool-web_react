
from my_auth.clerk_auth import ClerkJWTAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

###############################################

from my_auth.models import Organization, Card, Attachment
from my_auth.serializers import AttachmentSerializer

###############################################


class AttachmentListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AttachmentSerializer

    def get_queryset(self):
        org_id = self.request.query_params.get('orgId')
        cardId = self.request.query_params.get('cardId')

        if org_id and cardId:
            return Attachment.objects.filter(
                org__clerk_organization_id=org_id,
                card_id=cardId
            )
        return Attachment.objects.none()

    def perform_create(self, serializer):
        try:
            print("Raw request data:", self.request.data)

            description = self.request.data.get('description')
            uploaded_file = self.request.FILES.get('file')

            print(f"Description: {description}")
            print(f"Uploaded file: {uploaded_file}")
            if uploaded_file:
                print(f"Filename: {uploaded_file.name}, Size: {uploaded_file.size}")

            org_id = self.request.query_params.get('orgId')
            cardId = self.request.query_params.get('cardId')

            print(f"org_id: {org_id}, cardId: {cardId}")

            if not org_id or not cardId:
                raise ValidationError({"detail": "Missing orgId or cardId in query parameters."})

            try:
                org_obj = Organization.objects.get(clerk_organization_id=org_id)
            except Organization.DoesNotExist as e:
                raise ValidationError({"org": f"Invalid organization ID. Error: {str(e)}"})

            try:
                card_obj = Card.objects.get(id=cardId)
            except Card.DoesNotExist as e:
                raise ValidationError({"board": f"Invalid board ID. Error: {str(e)}"})

            serializer.save(org=org_obj, card=card_obj)

        except Exception as e:

            import traceback
            print(f"An error occurred: {str(e)}")




class AttachmentDestroyAPIView(generics.DestroyAPIView):
    
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AttachmentSerializer
    lookup_field = 'id'
    queryset = Attachment.objects.all()


