from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.conf import settings
import uuid
  
class CustomUserManager(BaseUserManager): 
    def create_user(self, email, password=None, **extra_fields ): 
        if not email: 
            raise ValueError('Email is a required field')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,email, password=None, **extra_fields): 
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class ClerkUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    username = models.CharField(max_length=200, null=True, blank=True)
    clerk_user_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    userImage = models.TextField(blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Organization(models.Model):
    clerk_organization_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    owner = models.ForeignKey(ClerkUser, on_delete=models.CASCADE)

    members = models.ManyToManyField( ClerkUser, blank=True, related_name='members_organization')

    def __str__(self):
        return self.name

# models.py
class Board(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='boards')
    owner = models.ForeignKey(ClerkUser, on_delete=models.CASCADE, related_name='boards')
    
    title = models.CharField(max_length=255)

    image_id = models.CharField(max_length=255, blank=True)
    image_thumb_url = models.TextField(blank=True)
    image_full_url = models.TextField(blank=True)
    image_username = models.TextField(blank=True)
    image_link_html = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
    
class List(models.Model):

    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='lists')

    title = models.CharField(max_length=255)
    order = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Color(models.Model):

    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)

    
    title = models.CharField(max_length=255)
    color = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title
    

      
class Card(models.Model):

    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='cards')
    colors = models.ManyToManyField(Color, blank=True)

    title = models.CharField(max_length=255)
    order = models.IntegerField()
    description = models.TextField(blank=True)
    
    start_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    time_date = models.TimeField(null=True, blank=True)
    reminder_time = models.CharField(max_length=50, blank=True)

    members = models.ManyToManyField(ClerkUser, blank=True, related_name='assigned_cards')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Attachment(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='attachments')

    description = models.TextField(blank=True)
    file = models.FileField(upload_to='attachments/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)

    #uploaded_by = models.ForeignKey(ClerkUser, on_delete=models.SET_NULL, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"Attachment for {self.card.title}"


class AuditLog(models.Model):
    class Action(models.TextChoices):
        CREATE = 'CREATE', 'Create'
        UPDATE = 'UPDATE', 'Update'
        DELETE = 'DELETE', 'Delete'
        COPY = 'COPY', 'Copy'

    class EntityType(models.TextChoices):
        BOARD = 'BOARD', 'Board'
        LIST = 'LIST', 'List'
        CARD = 'CARD', 'Card'
        COLOR = 'COLOR', 'Color'
        DESCRIPTION = 'DESCRIPTION', 'Description'
        ATTACHMENT = 'ATTACHMENT', 'Attachment'
        COMMENT = 'COMMENT', 'Comment'


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=Action.choices)
    entityId = models.CharField(max_length=255)
    entityType = models.CharField(max_length=14, choices=EntityType.choices)
    entityTitle = models.CharField(max_length=255)
    userId = models.CharField(max_length=255, null=True) 
    userImage = models.TextField()
    userName = models.TextField()
    action_description = models.TextField(null=True, blank=True) 
    entityBoard = models.TextField()
 
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-createdAt']

    def __str__(self):
        return f"{self.action} {self.entityType} {self.entityTitle}"


class OrgLimit(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='limit')
    count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Limit for {self.org.name}: {self.count}"
    

class OrgSubscription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='subscription', unique=True)

    stripe_customer_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    stripe_subscription_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    stripe_price_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_current_period_end = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Subscription for {self.org.name}"
