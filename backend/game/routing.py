from django.urls import re_path
from .consumers import in_game, game_looby, tournament, game_invite

from game.managers import game_manager, match_maker, tournament_manager

game_manager = game_manager.GameManager()
match_maker_manager = match_maker.MatchMaker()
tournament_manager = tournament_manager.TournamentManager()
invites_manager = match_maker.InvitesManager()

ws_urlpatterns = [
    re_path(r'ws/game/normal/looby/', game_looby.GameLobby.as_asgi(), {
        'match_maker': match_maker_manager,
    }),
    re_path(r'ws/game/invite/looby/(?P<invite_id>[0-9a-zA-Z-]+)/$', game_invite.GameInvite.as_asgi(), {
        'InvitesManager': invites_manager,
    }),
    re_path(r'ws/game/(?P<room_name>[0-9a-zA-Z-]+)/$', in_game.InGame.as_asgi(), {
        'game_manager': game_manager
    }),
    re_path(r'ws/game/tournament/(?P<tournament_id>[0-9a-zA-Z-]+)/$',
            tournament.TournamentConsumer.as_asgi(), {
                'tournament_manager': tournament_manager
            }),
]
