from django.contrib import admin
from .models import Match, MatchEvent, Player, Team

admin.site.register(Match)
admin.site.register(MatchEvent)
admin.site.register(Player)
admin.site.register(Team)
