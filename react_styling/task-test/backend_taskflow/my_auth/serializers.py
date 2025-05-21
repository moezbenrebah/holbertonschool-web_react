# serializers.py
from rest_framework import serializers
from .models import ClerkUser, Board, Organization, List, Card, AuditLog, OrgLimit, OrgSubscription, Color, Attachment

class ClerkUserSerializers(serializers.ModelSerializer):
    class Meta:
        model  = ClerkUser
        fields =  ['id', 'email', 'userImage']
        read_only_fields =  ['id', 'email', 'userImage']


class OrganisationSerializers(serializers.ModelSerializer):
    members = ClerkUserSerializers(many=True, read_only=True)
    class Meta:
        model = Organization
        fields =  ['members']

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = [
            'id', 'title',
            'owner', 'created_at',
            'image_id', 'image_thumb_url', 'image_full_url',
            'image_username', 'image_link_html'
        ]
        read_only_fields = ['organization','owner', 'created_at']

############# >> Card part for list
class MiniListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['id', 'title'] 

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'title', 'color', 'org']
        read_only_fields = ['id', 'board', 'org', 'created_at', 'updated_at']

class AttachmentSerializer(serializers.ModelSerializer):
    #file = serializers.FileField(use_url=True)

    class Meta:
        model = Attachment
        fields = '__all__'
        read_only_fields = ['id', 'org', 'card', 'created_at', 'updated_at']

class AuditLogSerializer_get(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'


class CardSerializer(serializers.ModelSerializer):
    list = MiniListSerializer(read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)
    colors = ColorSerializer(many=True, read_only=True)
    members = ClerkUserSerializers(many=True, read_only=True)
    audit_logs = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = '__all__'
        read_only_fields = ['id', 'board', 'order', 'list', 'created_at', 'updated_at']

    def get_audit_logs(self, obj):
        from .models import AuditLog
        logs = AuditLog.objects.filter(
            entityId=str(obj.id),
            entityType=AuditLog.EntityType.COMMENT
        )
        return AuditLogSerializer_get(logs, many=True).data


############# >> card for update
class CardSerializer_update(serializers.ModelSerializer):
    list = MiniListSerializer(read_only=True)
    colors = serializers.PrimaryKeyRelatedField(many=True, queryset=Color.objects.all())
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=ClerkUser.objects.all())

    class Meta:
        model = Card
        fields =  '__all__'
        read_only_fields = ['id', 'board', 'order','list', 'created_at', 'updated_at']

############# >> List
class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ['id', 'board', 'title', 'order', 'created_at', 'updated_at', 'cards']
        read_only_fields = ['id', 'board', 'order', 'created_at', 'updated_at', 'cards']

############# >> AuditLog
class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields =  '__all__'
        read_only_fields = ['org', 'id', 'createdAt', 'updatedAt']


class OrgLimitSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrgLimit
        fields = ['id', 'org', 'count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'org', 'created_at', 'updated_at']

    
class OrgSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrgSubscription
        fields = ['id', 'org', 'stripe_customer_id', 'stripe_subscription_id', 'stripe_price_id', 'stripe_current_period_end']
        read_only_fields = ['id', 'org']