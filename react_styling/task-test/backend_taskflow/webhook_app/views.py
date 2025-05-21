import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from my_auth.models import OrgSubscription, Organization
import datetime

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)



    if event['type'] == "checkout.session.completed":
        data = event['data']['object']
        metadata = data.get('metadata', {})
        org_id = metadata.get('orgId')
        #print(data)
        if not org_id:
            return HttpResponse(status=400)

        try:
            org = Organization.objects.get(clerk_organization_id=org_id)
            #print(org)
        except Organization.DoesNotExist:
            return HttpResponse(status=404)

        try:
            org_subscription, created = OrgSubscription.objects.get_or_create(org=org)
        except OrgSubscription.DoesNotExist:
            return HttpResponse(status=404)

        # Retrieve subscription from Stripe
        subscription_id = data.get('subscription')
        if subscription_id:
            subscription = stripe.Subscription.retrieve(subscription_id)
            print(subscription)
            org_subscription.stripe_customer_id = subscription.customer
            org_subscription.stripe_subscription_id = subscription.id
            org_subscription.stripe_price_id = subscription['items']['data'][0]['price']['id']
            org_subscription.stripe_current_period_end = datetime.datetime.fromtimestamp(
               subscription['items']['data'][0]['current_period_end']
            )
            org_subscription.save()

    return HttpResponse(status=200)
