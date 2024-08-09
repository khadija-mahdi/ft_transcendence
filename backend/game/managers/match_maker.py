import asyncio
import math
import random


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
