from django.http import JsonResponse
from rest_framework.views import APIView
from .models import ClerkUser, Organization
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator



ClerkUser = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class ClerkWebhookView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            event_type = data.get('type')
            event_data = data.get('data', {})
            #print('//////////////////////////////')
            #print(event_data)
            
            if not event_type or not event_data:
                return JsonResponse({'status': 'failure', 'message': 'Missing event type or data'}, status=400)

            # --- ORGANIZATION CREATED ---
            if event_type == 'organization.created':
                print('organization.created')
                org_id = event_data.get('id')
                name = event_data.get('name')
                slug = event_data.get('slug')
                clerk_user_id = event_data.get('created_by')

                if not clerk_user_id:
                    return JsonResponse({'status': 'failure', 'message': 'Missing clerk user ID'}, status=400)

                try:
                    owner = ClerkUser.objects.get(clerk_user_id=clerk_user_id)
                except ClerkUser.DoesNotExist:
                    return JsonResponse({'status': 'failure', 'message': 'Clerk user not found'}, status=404)


                Organization.objects.update_or_create(
                    clerk_organization_id=org_id,
                    defaults={
                        'name': name,
                        'slug': slug,
                        'owner': owner,
                    }
                )

                return JsonResponse({'status': 'success', 'message': 'Organization processed successfully'}, status=200)
            # --- ORGANIZATION UPDATED ---
            elif event_type == 'organization.updated':
                print('organization.updated')
                org_id = event_data.get('id')
                name = event_data.get('name')
                slug = event_data.get('slug')

                try:
                    org = Organization.objects.get(clerk_organization_id=org_id)
                    org.name = name or org.name
                    org.slug = slug or org.slug
                    org.save()
                    return JsonResponse({'status': 'success', 'message': 'Organization updated'}, status=200)
                except Organization.DoesNotExist:
                    return JsonResponse({'status': 'failure', 'message': 'Organization not found'}, status=404)

            # --- ORGANIZATION DELETED ---
            elif event_type == 'organization.deleted':
                print('organization.deleted')
                org_id = event_data.get('id')
                try:
                    org = Organization.objects.get(clerk_organization_id=org_id)
                    org.delete()
                    return JsonResponse({'status': 'success', 'message': 'Organization deleted'}, status=200)
                except Organization.DoesNotExist:
                    return JsonResponse({'status': 'failure', 'message': 'Organization not found'}, status=404)

            # --- USER DELETED ---
            elif event_type == 'user.deleted':
                clerk_user_id = event_data.get('id')
                try:
                    user = ClerkUser.objects.get(clerk_user_id=clerk_user_id)
                    user.delete()
                    return JsonResponse({'status': 'success', 'message': 'User deleted'}, status=200)
                except ClerkUser.DoesNotExist:
                    return JsonResponse({'status': 'failure', 'message': 'User not found'}, status=404)

            # --- USER CREATED / UPDATED ---
            elif event_type in ['user.created', 'user.updated']:
                print('user. created / updated')
                clerk_user_id = event_data.get('id')
                email = event_data.get('email_addresses', [{}])[0].get('email_address')
                first_name = event_data.get('first_name')
                last_name = event_data.get('last_name')
                user_image = event_data.get('image_url')

                if not clerk_user_id or not email:
                    return JsonResponse({'status': 'failure', 'message': 'Missing required user data'}, status=400)

                user, _ = ClerkUser.objects.get_or_create(clerk_user_id=clerk_user_id)
                user.email = email
                user.first_name = first_name or ''
                user.last_name = last_name or ''
                user.userImage = user_image or ''
                user.save()

                return JsonResponse({'status': 'success', 'message': 'User created/updated'}, status=200)
            
            # --- Membership CREATED / UPDATED ---
            elif event_type == 'organizationMembership.created':
                print('organizationMembership.created')
                org = event_data.get('organization')
                org_id = org.get('id') if org else None
                ##
                public_user_data = event_data.get('public_user_data')
                clerk_user_id = public_user_data.get('user_id') if public_user_data else None

                if not org_id:
                    return JsonResponse({'status': 'failure', 'message': 'Missing organization ID'}, status=400)
                
                if not clerk_user_id:
                    return JsonResponse({'status': 'failure', 'message': 'Missing clerk user ID'}, status=400)


                try:
                    user = ClerkUser.objects.get(clerk_user_id=clerk_user_id)
                except ClerkUser.DoesNotExist:
                    return JsonResponse({'status': 'failure', 'message': 'Clerk user not found'}, status=404)

                try:
                    organization = Organization.objects.get(clerk_organization_id=org_id)
                except Organization.DoesNotExist:
                    return JsonResponse({'status': 'failure', 'message': 'Organization not found'}, status=404)

                organization.members.add(user)
                return JsonResponse({'status': 'success', 'message': 'User added to organization'})

            # --- Membership DELETED ---
            elif event_type == 'organizationMembership.deleted':
                print('organizationMembership.deleted')
                org = event_data.get('organization')
                org_id = org.get('id') if org else None
                ##
                public_user_data = event_data.get('public_user_data')
                clerk_user_id = public_user_data.get('user_id') if public_user_data else None

                if not org_id:
                    return JsonResponse({'status': 'failure', 'message': 'Missing organization ID'}, status=400)
                
                if not clerk_user_id:
                    return JsonResponse({'status': 'failure', 'message': 'Missing clerk user ID'}, status=400)

                try:
                    user = ClerkUser.objects.get(clerk_user_id=clerk_user_id)
                    organization = Organization.objects.get(clerk_organization_id=org_id)
                except (ClerkUser.DoesNotExist, Organization.DoesNotExist):
                    return JsonResponse({'status': 'failure', 'message': 'User or organization not found'}, status=404)

                organization.members.remove(user)
                return JsonResponse({'status': 'success', 'message': 'User removed from organization'})


            return JsonResponse({'status': 'ignored', 'message': f'Unhandled event type: {event_type}'}, status=200)

        except Exception as e:
            return JsonResponse({'status': 'failure', 'message': str(e)}, status=500)

    def get(self, request, *args, **kwargs):
        return JsonResponse({'message': 'This endpoint only accepts POST requests.'}, status=200)
