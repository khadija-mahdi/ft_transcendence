
list(Matchup.objects.filter(game_over=True,Winner__isnull=False,round_number=1).values_list('Winner', flat=True))