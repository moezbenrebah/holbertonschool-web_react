from my_auth.clerk_auth import ClerkJWTAuthentication
from rest_framework import generics , mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

###############################################

from my_auth.models import Card, List
from my_auth.serializers import CardSerializer, CardSerializer_update

###############################################



class CardCreateRetrieveAPIView(mixins.RetrieveModelMixin,
                                 mixins.CreateModelMixin,
                                 mixins.DestroyModelMixin,
                                 generics.GenericAPIView):
   
    serializer_class = CardSerializer
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    queryset = Card.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if not request.data:
            return self.copy_card(request, *args, **kwargs)
        else:
            return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        card_id = kwargs.get('id')
        if not card_id:
            return Response({"error": "Card ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            card = Card.objects.select_related('list__board').get(id=card_id)
        except Card.DoesNotExist:
            return Response({"error": "Card not found."}, status=status.HTTP_404_NOT_FOUND)

        card.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        list_id = self.request.data.get('listId')
        title = self.request.data.get('title')

        if not list_id:
            raise ValidationError({"listId": "This field is required."})
        # select_related('board')
        try:
            list_obj = List.objects.prefetch_related('cards').get(id=list_id)
        except List.DoesNotExist:
            raise ValidationError({"listId": "Invalid list ID."})


        max_order = list_obj.cards.order_by("-order").first()
        new_order = max_order.order + 1 if max_order else 1

        serializer.save(
            list=list_obj,
            order=new_order,
        )

    def copy_card(self, request, *args, **kwargs):
        card_id = kwargs.get('id')

        if not card_id:
            raise ValidationError({"id": "Card ID is required for copying."})

        try:
            original_card = Card.objects.select_related('list__board').get(id=card_id)
        except Card.DoesNotExist:
            raise ValidationError({"error": "Card not found."})



        last_card = Card.objects.filter(list=original_card.list).order_by('-order').first()
        new_order = last_card.order + 1 if last_card else 1

        copied_card = Card.objects.create(
            title=f"{original_card.title} - Copy",
            description=original_card.description,
            list=original_card.list,
            order=new_order,
        )

        serializer = self.get_serializer(copied_card)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# reorder the card
class CardOrderBulkUpdateAPIView(APIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]


    def post(self, request, *args, **kwargs):
        items = request.data.get('items')
        
        if not items:
            raise ValidationError({'items': 'This field is required.'})
        
        for item in items:
            card_id = item.get('id')
            new_order = item.get('order')
            new_list_id = item.get('listId')

            if card_id is None or new_order is None:
                continue  # skip invalid data

            try:
                card = Card.objects.get(id=card_id, list__board__owner=request.user)
                if new_list_id is not None:
                    try:
                        new_list = List.objects.get(id=new_list_id)
                        card.list = new_list
                    except List.DoesNotExist:
                        continue 
                card.order = new_order
                card.save()
            except Card.DoesNotExist:
                continue  # skip if not found or not user's card

        return Response({"message": "Card order updated successfully."}, status=status.HTTP_200_OK)
    

class CardUpdateAPIView(generics.UpdateAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CardSerializer_update
    lookup_field = 'id'
    queryset = Card.objects.all()


    def patch(self, request, *args, **kwargs):
        #print(request.data)
        try:
            return self.partial_update(request, *args, **kwargs)
        except Exception as e:
            print(e)
    
    