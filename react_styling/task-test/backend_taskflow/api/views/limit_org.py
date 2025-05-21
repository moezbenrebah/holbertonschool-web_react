
from my_auth.clerk_auth import ClerkJWTAuthentication
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

###############################################

from my_auth.models import Organization, OrgLimit
from my_auth.serializers import OrgLimitSerializer

###############################################




class OrgLimitAPIView(generics.GenericAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrgLimitSerializer
    
    def post(self, request, *args, **kwargs):
        org_id = request.data.get("org")
        mode = request.data.get("mode")

        if not org_id:
            raise ValidationError({'org': 'This field is required.'})
        
        try:
            org = Organization.objects.get(clerk_organization_id=org_id)
        except Organization.DoesNotExist:
            raise ValidationError({"org": "Invalid organization ID."})
        
        limit_obj, _ = OrgLimit.objects.get_or_create(org=org)

        if mode == "increase":
            limit_obj.count += 1
        elif mode == "decrease":
            if limit_obj.count > 0:
                limit_obj.count -= 1
        else:
            raise ValidationError({"mode": "Must be 'increase' or 'decrease'."})

        limit_obj.save()
        return Response({"org": org_id, "count": limit_obj.count}, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        org_id = request.query_params.get("org")

        if not org_id:
            raise ValidationError({'org': 'This field is required.'})

        try:
            org = Organization.objects.get(clerk_organization_id=org_id)
        except Organization.DoesNotExist:
            raise ValidationError({"org": "Invalid organization ID."})
        
        limit_obj, _ = OrgLimit.objects.get_or_create(org=org)
        return Response({
            "org": org_id,
            "hasAvailableCount": limit_obj.count < 5,
            "count": limit_obj.count
        }, status=status.HTTP_200_OK)
    