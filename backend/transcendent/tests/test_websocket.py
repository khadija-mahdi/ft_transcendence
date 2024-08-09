import uuid
from channels.testing import WebsocketCommunicator
from rest_framework.test import APIClient
from transcendent.asgi import application
from user.models import User
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import RefreshToken
from asgiref.sync import sync_to_async
import pytest
from django.urls import reverse


@pytest.fixture
def SetUp(db):
    user = User.objects.create_user(
        email=f"{str(uuid.uuid4())}@gmail.com",
        username='testuser',
        password='testpassword'
    )
    refresh = RefreshToken.for_user(user)
    headers = [
        (b'cookie', f'access={str(refresh.access_token)}'.encode()),
        (b'host', b'localhost')]

    return {
        'headers': headers,
        'user': user,
        'token': str(refresh.access_token),
    }


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_connect(SetUp):
    user, headers = SetUp['user'], SetUp['headers']

    communicator = WebsocketCommunicator(
        application, '/ws/user/connect', headers=headers)
    connected = await communicator.connect()
    assert connected
    await sync_to_async(user.refresh_from_db)()
    assert user.status == 'online'
    await communicator.send_json_to({"type": "message", "data": "test"})
    response = await communicator.receive_json_from()
    assert response['email'] == user.email
    await communicator.disconnect()


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_receive_notification(SetUp):
    user, headers = SetUp['user'], SetUp['headers']
    communicator = WebsocketCommunicator(
        application, '/ws/user/connect', headers=headers)
    await communicator.connect()
    res = await send_notification(user)
    assert res.status_code == 201
    response = await communicator.receive_json_from()
    assert response['type'] == 'notification'
    await communicator.disconnect()


@sync_to_async
def send_notification(user):
    client = APIClient()
    user_2 = User.objects.create_user(
        email=f"{str(uuid.uuid4())}@gmail.com",
        username='testuser2',
        password='testpassword')
    refresh = RefreshToken.for_user(user_2)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    response = client.post(
        reverse('send-friend-request', args=[user.id]))
    return response
