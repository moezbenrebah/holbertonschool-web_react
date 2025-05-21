
from my_auth.clerk_auth import ClerkJWTAuthentication
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, NotFound
from django.db.models import Prefetch
from rest_framework.views import APIView
from rest_framework.response import Response

###############################################

from my_auth.models import  Board, List, Card
from my_auth.serializers import ListSerializer

###############################################

class ListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ListSerializer

    def get_queryset(self):
        org_id = self.request.query_params.get('orgId')
        board_id = self.request.query_params.get('boardId')

        if not org_id or not board_id:
            raise ValidationError({"error": "Missing orgId or boardId in query parameters."})

        return List.objects.filter(
            board__id=board_id,
            board__organization__clerk_organization_id=org_id
        ).prefetch_related(
            Prefetch('cards', queryset=Card.objects.order_by('order'))
        ).order_by('order')

    def perform_create(self, serializer):
        board_id = self.kwargs.get('board_id')
        print(board_id)
        if not board_id:
            raise ValidationError({'boardId': 'boardId is required in URL or body.'})

        try:
            board = Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            raise ValidationError({'board': 'Invalid board ID.'})

        order = board.lists.count() + 1
        serializer.save(board=board, order=order)


class ListRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ListSerializer
    queryset = List.objects.all()
    lookup_field = 'id'

    def perform_update(self, serializer):
        serializer.save()
        
    def perform_destroy(self, instance):
        instance.delete()

    def post(self, request, *args, **kwargs):
        """Custom POST method: Copy the list and its cards."""
        list_id = self.kwargs.get("id")

        try:
            original_list = self.get_queryset().prefetch_related("cards").get(id=list_id)
        except List.DoesNotExist:
            raise NotFound("List not found.")

        board = original_list.board

        last_list = board.lists.order_by('-order').first()
        new_order = last_list.order + 1 if last_list else 1

        # Create the new copied list
        copied_list = List.objects.create(
            title=f"{original_list.title} - Copy",
            board=original_list.board,
            order=new_order,
        )

        # Copy the cards
        cards_to_create = [
            Card(
                list=copied_list,
                title=card.title,
                description=card.description,
                order=card.order,
            ) for card in original_list.cards.all()
        ]
        Card.objects.bulk_create(cards_to_create)

        serializer = self.get_serializer(copied_list)
        return Response(serializer.data, status=status.HTTP_201_CREATED)





class ListOrderAPIView(APIView):
    """
    Updates the order of multiple lists in a board.
    """
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Handle bulk update of list orders.
        """
        items = request.data.get('items', [])

        if not items:
            return Response({"error": "No items provided."}, status=status.HTTP_400_BAD_REQUEST)

        #user = request.user

        list_ids = [item['id'] for item in items]
        lists = List.objects.filter(id__in=list_ids).select_related('board')

        if not lists.exists():
            return Response({"error": "No matching lists found."}, status=status.HTTP_404_NOT_FOUND)

        # Update orders
        update_objs = []
        for item in items:
            try:
                list_obj = lists.get(id=item["id"])
                #print(list_obj)
                list_obj.order = item["order"]
                update_objs.append(list_obj)
            except List.DoesNotExist:
                continue

        List.objects.bulk_update(update_objs, ["order"])

        return Response({"success": True, "updated_lists": ListSerializer(update_objs, many=True).data}, status=status.HTTP_200_OK)
