from rest_framework import serializers
from .models import Match, MatchEvent, Player, Team


class MatchEventSerializer(serializers.ModelSerializer):
    ball_label = serializers.SerializerMethodField()

    class Meta:
        model = MatchEvent
        fields = "__all__"

    def get_ball_label(self, obj):
        return f"{obj.over}.{obj.ball}"


class MatchSerializer(serializers.ModelSerializer):
    recent_events = serializers.SerializerMethodField()
    current_run_rate = serializers.SerializerMethodField()
    required_run_rate = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = "__all__"

    def get_recent_events(self, obj):
        events = obj.events.all()[:8]
        return MatchEventSerializer(events, many=True).data

    def get_current_run_rate(self, obj):
        if not obj.overs:
            return 0
        batting_score = obj.team1_score if obj.batting_team == obj.team1 else obj.team2_score
        return round(batting_score / obj.overs, 2)

    def get_required_run_rate(self, obj):
        if not obj.target or not obj.overs:
            return 0

        max_overs = 20 if obj.match_format == "T20" else 50
        remaining_overs = max(max_overs - obj.overs, 0)
        if remaining_overs == 0:
            return 0

        batting_score = obj.team1_score if obj.batting_team == obj.team1 else obj.team2_score
        runs_needed = max(obj.target - batting_score, 0)
        return round(runs_needed / remaining_overs, 2)


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = "__all__"


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = "__all__"
