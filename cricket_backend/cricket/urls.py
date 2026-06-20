from django.urls import path
from .views import (
    ai_summary,
    create_match_event,
    dashboard,
    live_score,
    match_detail,
    match_events,
    matches,
    players,
    predict_winner,
    team_stats,
    teams,
)

urlpatterns = [
    path("dashboard/", dashboard),
    path("live-score/", live_score),
    path("matches/", matches),
    path("matches/<int:match_id>/", match_detail),
    path("matches/<int:match_id>/events/", match_events),
    path("matches/<int:match_id>/events/create/", create_match_event),
    path("matches/<int:match_id>/predict/", predict_winner),
    path("matches/<int:match_id>/summary/", ai_summary),
    path("players/", players),
    path("teams/", teams),
    path("predict/", predict_winner),
    path("summary/", ai_summary),
    path("team-stats/", team_stats),
]
