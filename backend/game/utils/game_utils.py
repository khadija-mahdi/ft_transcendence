import math
import logging

logger = logging.getLogger(__name__)


class Config():
    tableWidth = 200
    tableHeight = 10
    tableDepth = 100
    ballRadius = 3
    paddleWidth = 3
    paddleHeight = 0.5
    paddleDepth = 15
    winScore = 4
    maxScore = 7
    requiredScoreDiff = 2


class Ball():
    SPEED = 2

    def __init__(self):
        self.width = Config.tableWidth
        self.height = Config.tableDepth
        self.radius = Config.ballRadius
        self.reset()

    def setAngle(self, angle):
        self.angle = angle
        self.dx = self.speed * math.cos(self.angle)
        self.dy = self.speed * math.sin(self.angle)

    def reset(self):
        self.x = self.width / 2
        self.y = self.height / 2
        self.speed = Ball.SPEED
        self.setAngle(0)

    async def update(self, callback):
        self.x += self.dx
        self.y += self.dy

        # Collision with the left paddle
        if (self.x - self.radius < self.leftPaddle.x + self.leftPaddle.WIDTH / 2 and
                self.leftPaddle.is_on_same_level(self)):
            self.setAngle(self.leftPaddle.get_hit_angle(self))
            # self.dx *= -1

        # Collision with the right paddle
        if (self.x + self.radius > self.rightPaddle.x - self.rightPaddle.WIDTH / 2 and
                self.rightPaddle.is_on_same_level(self)):
            self.setAngle(self.rightPaddle.get_hit_angle(self))
            self.dx *= -1

        # Collision with the top or bottom wall
        if self.y - self.radius < 0 or self.y + self.radius > self.height:
            self.dy *= -1

        # Ball out of bounds (left or right)
        if self.x - self.radius < 0 or self.x + self.radius > self.width:
            is_left_goal = self.x - self.radius < 0
            await callback(is_left_goal)
            self.reset()

    def setPaddles(self, leftPaddle, rightPaddle):
        self.leftPaddle = leftPaddle
        self.rightPaddle = rightPaddle


class Paddle():
    PADDLE_SPEED = 3
    AI_MODE = False

    def __init__(self, x, y, is_ai=False, ai_difficulty=.3):
        self.x = x
        self.y = y
        self.is_ai = is_ai
        self.HEIGHT = Config.paddleDepth
        self.WIDTH = Config.paddleWidth
        self.tableHeight = Config.tableDepth
        self.max_height = self.tableHeight - (self.HEIGHT / 2)
        self.min_height = (self.HEIGHT / 2)

        self.AI_PADDLE_SPEED = self.PADDLE_SPEED * ai_difficulty

    def updatePosition(self, y):
        self.y = y

    def movePaddle(self, action):
        if action == 'left':
            nv = self.y - self.PADDLE_SPEED
            self.y = nv if (nv > self.min_height) else self.min_height

        elif action == 'right':
            nv = self.y + self.PADDLE_SPEED
            self.y = nv if (nv < self.max_height) else self.max_height
        else:
            logger.error(f'Unsupported Action {action},'
                         'please make sure to use on of this actions (left|right)')

    def getY(self):
        return self.y

    def getX(self):
        return self.x

    def ai_update(self, ball):
        if ball.y < self.y - self.HEIGHT / 2:
            self.y -= self.AI_PADDLE_SPEED
        elif ball.y > self.y + self.HEIGHT / 2:
            self.y += self.AI_PADDLE_SPEED

    def get_hit_angle(self, ball):
        diff = ball.y - self.y
        return map_value(diff, -self.HEIGHT / 2, self.HEIGHT / 2, -math.pi / 4, math.pi / 4)

    def is_on_same_level(self, ball):
        return self.y - self.HEIGHT / 2 <= ball.y <= self.y + self.HEIGHT / 2


def map_value(val, start_src, end_src, start_dst, end_dst):
    src_span = end_src - start_src
    dst_span = end_dst - start_dst

    valueScaled = float(val - start_src) / float(src_span)
    return start_dst + (valueScaled * dst_span)
