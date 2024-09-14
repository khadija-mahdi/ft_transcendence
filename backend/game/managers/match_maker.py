import asyncio
import math
import random
import json
import uuid
from channels.db import database_sync_to_async
from game.models import Matchup


class MatchMaker():
    def __init__(self):
        self.registered_users = []
        self.lock = None

    async def get_lock(self):
        if self.lock is None:
            self.lock = asyncio.Lock()
        return self.lock

    async def remove_user(self, user):
        print('try to remove user ', user.username)
        self.lock = await self.get_lock()
        async with self.lock:
            print(user.username, 'secssusefly removed')
            self.registered_users.remove(user)

    async def get_match_users(self, user):
        self.lock = await self.get_lock()
        async with self.lock:
            if user in self.registered_users:
                return None
            if len(self.registered_users) == 0:
                self.registered_users.append(user)
                return None
            matched_user = self.registered_users[math.floor(
                random.random() * len(self.registered_users))]
            self.registered_users.remove(matched_user)
            return matched_user


class InvitesManager():
    def __init__(self):
        self.registered_users = {}
        self.lock = None
        pass

    async def get_lock(self):
        if self.lock is None:
            self.lock = asyncio.Lock()
        return self.lock

    async def addPlayer(self, uuid, user):
        self.lock = await self.get_lock()
        async with self.lock:
            print('addPlayer called')
            if uuid not in self.registered_users:
                self.registered_users[uuid] = []
            self.registered_users[uuid].append(user)

    async def get_match_users(self, uuid):
        # Check if the uuid exists in registered_users
        print('uuid is', uuid)
        if uuid in self.registered_users:
            print('list', self.registered_users[uuid])
        else:
            print('uuid does exists on list')
        if uuid in self.registered_users and len(self.registered_users[uuid]) > 0:
            return self.registered_users[uuid][0]
        return None  # Return None if no match found

    async def remove_user(self, uuid, user):
        print('try to remove user ', user.username)
        try:
            self.lock = await self.get_lock()
            async with self.lock:
                if self.registered_users[uuid]:
                    self.registered_users[uuid].remove(user)
                print(user.username, 'secssusefly removed')
        except:
            print('remove user failed')
