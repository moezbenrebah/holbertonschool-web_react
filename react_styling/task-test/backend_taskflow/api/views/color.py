from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from my_auth.clerk_auth import ClerkJWTAuthentication
from my_auth.models import Color, Organization, Board
from my_auth.serializers import ColorSerializer

class ColorListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ColorSerializer

    def get_queryset(self):
        org_id = self.request.query_params.get('orgId')
        board_id = self.request.query_params.get('boardId')

        if org_id and board_id:
            return Color.objects.filter(
                org__clerk_organization_id=org_id,
                board_id=board_id
            )
        return Color.objects.none()

    def perform_create(self, serializer):
        org_id = self.request.query_params.get('orgId')
        board_id = self.request.query_params.get('boardId')

        if not org_id or not board_id:
            raise ValidationError({"detail": "Missing orgId or boardId in query parameters."})

        try:
            org_obj = Organization.objects.get(clerk_organization_id=org_id)
        except Organization.DoesNotExist:
            raise ValidationError({"org": "Invalid organization ID."})

        try:
            board_obj = Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            raise ValidationError({"board": "Invalid board ID."})

        serializer.save(org=org_obj, board=board_obj)



class ColorUpdateDestroyAPIView(mixins.UpdateModelMixin,
                                 mixins.DestroyModelMixin,
                                 generics.GenericAPIView):
    
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ColorSerializer
    lookup_field = 'id'
    queryset = Color.objects.all()

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

