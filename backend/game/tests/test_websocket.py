import uuid
from channels.testing import WebsocketCommunicator
from transcendent.asgi import application
from user.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import pytest
from django.db import connection
import asyncio


@pytest.fixture
def user(db):
    user = User.objects.create_user(
        email=f"{str(uuid.uuid4())}@gmail.com",
        username=f'testuser_{str(uuid.uuid4())}',
        password='testpassword'
    )
    return user


def headers(user):
    refresh = RefreshToken.for_user(user)
    return [
        (b'cookie', f'access={str(refresh.access_token)}'.encode()),
        (b'host', b'localhost')]


@pytest.fixture
def users(db):
    users = []
    for i in range(10):
        users.append(User.objects.create_user(
            email=f"{str(uuid.uuid4())}@gmail.com",
            username=f'testuser{i}',
            password='testpassword'
        ))
    return users


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_join_game_looby(user):
    communicator = WebsocketCommunicator(
        application, 'ws/game/normal/looby/', headers=headers(user))
    connected = await communicator.connect()
    assert connected
    await communicator.disconnect()


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_matchmaking(users):
    communicators = []
    for i in range(10):
        communicator = WebsocketCommunicator(
            application, 'ws/game/normal/looby/?game_mode=singleplayer', headers=headers(users[i]))
        communicators.append(communicator)
        connected = await communicator.connect()
        assert connected
        # await asyncio.sleep(0.1)
    for i in range(10):
        message = await communicators[i].receive_json_from()
        assert 'game_room_url' in message['message']
    await asyncio.gather(*[communicator.disconnect() for communicator in communicators])
