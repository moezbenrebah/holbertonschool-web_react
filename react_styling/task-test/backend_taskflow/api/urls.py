from django.urls import path
# http://127.0.0.1:8000/api/webhook/stripe/ whsec_d6c98960de0eb2febc69f3a723c58fa2a506998589b9178a432b52d7c413656e

##############################################

from .views.board import BoardListCreateAPIView, BoardRetrieveUpdateDestroyAPIView
from .views.list import ListCreateAPIView, ListRetrieveUpdateDestroyAPIView, ListOrderAPIView
from .views.card import CardCreateRetrieveAPIView, CardOrderBulkUpdateAPIView, CardUpdateAPIView
from .views.log import AuditLogListCreateAPIView
from .views.limit_org import OrgLimitAPIView 
from .views.subscription import OrgSubscriptionAPIView
from .views.color import ColorListCreateAPIView, ColorUpdateDestroyAPIView
from .views.organization import OrganizationRetrieve
from .views.attachement import AttachmentListCreateAPIView, AttachmentDestroyAPIView

###############################################

urlpatterns = [

    ## >> Organization
    path('api/board/organization/<str:clerk_organization_id>/', OrganizationRetrieve.as_view(), name='organization-detail'),

    ## >> Board
    path('api/boards/', BoardListCreateAPIView.as_view(), name='board-api-detail'),
    path('api/board/<int:pk>/', BoardRetrieveUpdateDestroyAPIView.as_view(), name='board-detail'),

    ## >> List
    path('api/board/<int:board_id>/list/', ListCreateAPIView.as_view(), name='list-detail'),
    path('api/board/list/', ListCreateAPIView.as_view(), name='list-get'),  
    path("api/list/<int:id>/", ListRetrieveUpdateDestroyAPIView.as_view(), name="list-detail"),
    path('api/board/list/order/update/', ListOrderAPIView.as_view(), name='list-cards'),

    ## >> Card
    path('api/board/card/', CardCreateRetrieveAPIView.as_view(), name='create-card'),
    path('api/board/card/<int:id>/', CardCreateRetrieveAPIView.as_view(), name='create-or-get-card'),
    path('api/board/card/order/update/', CardOrderBulkUpdateAPIView.as_view(), name='card-order-bulk-update'),
    path('api/board/card/order/update/<int:id>/', CardUpdateAPIView.as_view(), name='card-order-single-update'),

    ## >> Color
    path('api/board/card/color/', ColorListCreateAPIView.as_view(), name='create/retrive'),
    path('api/board/card/color/<int:id>/', ColorUpdateDestroyAPIView.as_view(), name='update/delete'),

    ## >> attachement
    path('api/board/card/Attachment/', AttachmentListCreateAPIView.as_view(), name='create/retrive'),
    path('api/board/card/Attachment/<int:id>/', AttachmentDestroyAPIView.as_view(), name='/delete'),
    
    ## >> Log
    path('api/board/card/createAuditLog/', AuditLogListCreateAPIView.as_view(), name='create-audit-log'),
    path('api/board/card/createAuditLog/<int:id>/', AuditLogListCreateAPIView.as_view(), name='update-audit-log'),

    ## >> Limit Org
    path('api/board/org-limit/', OrgLimitAPIView.as_view(), name='org-limit'),

    ## >> subscription
    path('api/board/orgsubscription/<str:org>/', OrgSubscriptionAPIView.as_view(), name='subscription'),

]
