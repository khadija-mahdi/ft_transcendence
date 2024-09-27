import asyncio
import math
import random
from typing import Dict, List
from user.models import User
import logging

logger = logging.getLogger(__name__)


class MatchMaker():
    def __init__(self):
        self.registered_users = []
        self.lock = None

    async def get_lock(self):
        if self.lock is None:
            self.lock = asyncio.Lock()
        return self.lock

    async def remove_user(self, user):
        self.lock = await self.get_lock()
        async with self.lock:
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
        self.registered_users: Dict[str, List[User]] = {}
        self.lock = None
        pass

    async def get_lock(self):
        if self.lock is None:
            self.lock = asyncio.Lock()
        return self.lock

    async def addPlayer(self, uuid, user):
        logger.debug(f'addPlayer for usre-{user.username} uuid-{uuid}')

        self.lock = await self.get_lock()
        async with self.lock:
            if uuid not in self.registered_users:
                self.registered_users[uuid] = []
            logger.debug(f'registered_users {self.registered_users[uuid]}')
            if user in self.registered_users[uuid]:
                logger.debug('returing false')
                return False
            self.registered_users[uuid].append(user)
            return True

    async def get_match_users(self, uuid):
        if uuid in self.registered_users and len(self.registered_users[uuid]) > 0:
            return self.registered_users[uuid].pop()
        return None

    async def remove_user(self, uuid, user):
        try:
            self.lock = await self.get_lock()
            async with self.lock:
                if self.registered_users[uuid]:
                    self.registered_users[uuid].remove(user)
        except Exception as e:
            print('remove user failed', e)
