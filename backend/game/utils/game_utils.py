import math


class Ball():
    RADIUS = 5
    SPEED = 5

    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.radius = Ball.RADIUS
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
            await callback(self.x - self.radius < 0)
            self.reset()

    def setPaddles(self, leftPaddle, rightPaddle):
        self.leftPaddle = leftPaddle
        self.rightPaddle = rightPaddle


class Paddle():
    HEIGHT = 60
    WIDTH = 10
    PADDLE_SPEED = 2
    AI_MODE = False

    def __init__(self, x, y, is_ai=False, ai_difficulty=1):
        self.x = x
        self.y = y
        self.is_ai = is_ai
        self.PADDLE_SPEED = Paddle.PADDLE_SPEED * ai_difficulty

    def updatePosition(self, y):
        self.y = y

    def ai_update(self, ball):
        if ball.y < self.y - Paddle.HEIGHT / 2:
            self.y -= Paddle.PADDLE_SPEED
        elif ball.y > self.y + Paddle.HEIGHT / 2:
            self.y += Paddle.PADDLE_SPEED

    def get_hit_angle(self, ball):
        diff = ball.y - self.y
        return map_value(diff, -Paddle.HEIGHT / 2, Paddle.HEIGHT / 2, -math.pi / 4, math.pi / 4)

    def is_on_same_level(self, ball):
        return self.y - Paddle.HEIGHT / 2 <= ball.y <= self.y + Paddle.HEIGHT / 2


def map_value(val, start_src, end_src, start_dst, end_dst):
    src_span = end_src - start_src
    dst_span = end_dst - start_dst

    valueScaled = float(val - start_src) / float(src_span)
    return start_dst + (valueScaled * dst_span)
