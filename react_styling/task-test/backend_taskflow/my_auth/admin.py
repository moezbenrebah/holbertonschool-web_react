from django.contrib import admin
from .models import ClerkUser, Organization, Board, List, Card, AuditLog, OrgSubscription, OrgLimit, Color, Attachment
from django.contrib.auth.admin import UserAdmin


# Register models with admin
admin.site.register(ClerkUser)

class OrganizationAdmin(admin.ModelAdmin):
    filter_horizontal = ('members',)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Board)
admin.site.register(List)

class CardAdmin(admin.ModelAdmin):
    filter_horizontal = ('colors', 'members')
admin.site.register(Card, CardAdmin)

admin.site.register(AuditLog)
admin.site.register(OrgSubscription)
admin.site.register(OrgLimit)
admin.site.register(Color)
admin.site.register(Attachment)
