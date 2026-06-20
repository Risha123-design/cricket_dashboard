from django.urls import path
from .views import matches, live_score, team_stats

urlpatterns = [
    path('matches/', matches),
    path('live-score/', live_score),
    path('team-stats/', team_stats),
]