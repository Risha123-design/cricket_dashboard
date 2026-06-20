from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .analytics import build_insights, build_match_summary, build_prediction
from .models import Match, MatchEvent, Player, Team
from .serializers import MatchEventSerializer, MatchSerializer, PlayerSerializer, TeamSerializer


def dashboard_payload(match=None):
    matches_qs = Match.objects.all().order_by("-updated_at", "-id")
    selected_match = match or matches_qs.first()
    events_qs = MatchEvent.objects.filter(match=selected_match)[:30] if selected_match else []

    return {
        "matches": MatchSerializer(matches_qs, many=True).data,
        "selected_match": MatchSerializer(selected_match).data if selected_match else None,
        "events": MatchEventSerializer(events_qs, many=True).data,
        "prediction": build_prediction(selected_match),
        "summary": build_match_summary(selected_match, events_qs),
        "insights": build_insights(selected_match, events_qs),
    }


def broadcast_dashboard(match=None):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return

    async_to_sync(channel_layer.group_send)(
        "live_scores",
        {
            "type": "score.update",
            "payload": dashboard_payload(match),
        },
    )


@api_view(["GET"])
def dashboard(request):
    match_id = request.query_params.get("match_id")
    match = None
    if match_id:
        match = get_object_or_404(Match, id=match_id)

    return Response(dashboard_payload(match))


@api_view(["GET"])
def matches(request):
    all_matches = Match.objects.all().order_by("-updated_at", "-id")
    serializer = MatchSerializer(all_matches, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def match_detail(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    return Response(MatchSerializer(match).data)


@api_view(["GET"])
def live_score(request):
    latest_match = Match.objects.all().order_by("-updated_at", "-id").first()

    if not latest_match:
        return Response({"message": "No match available"}, status=status.HTTP_404_NOT_FOUND)

    return Response(MatchSerializer(latest_match).data)


@api_view(["GET"])
def players(request):
    all_players = Player.objects.all().order_by("-runs", "name")
    serializer = PlayerSerializer(all_players, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def teams(request):
    all_teams = Team.objects.all().order_by("-wins", "name")
    serializer = TeamSerializer(all_teams, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def match_events(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    events = MatchEvent.objects.filter(match=match)[:50]
    return Response(MatchEventSerializer(events, many=True).data)


@api_view(["POST"])
def create_match_event(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    serializer = MatchEventSerializer(data={**request.data, "match": match.id})

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    event = serializer.save()
    apply_event_to_match(match, event)
    broadcast_dashboard(match)

    return Response(MatchEventSerializer(event).data, status=status.HTTP_201_CREATED)


def apply_event_to_match(match, event):
    runs = event.runs + event.extras
    batting_team = event.batting_team or match.batting_team or match.team1
    match.batting_team = batting_team
    match.bowling_team = match.team2 if batting_team == match.team1 else match.team1
    match.last_ball = "W" if event.wicket else str(runs)
    match.current_batter = event.batter or match.current_batter
    match.current_bowler = event.bowler or match.current_bowler
    match.overs = float(f"{event.over}.{event.ball}") if event.over or event.ball else match.overs

    if batting_team == match.team1:
        match.team1_score += runs
        if event.wicket:
            match.team1_wickets += 1
    else:
        match.team2_score += runs
        if event.wicket:
            match.team2_wickets += 1

    match.predicted_winner = build_prediction(match)["predicted_winner"]
    match.save()


@api_view(["GET"])
def predict_winner(request, match_id=None):
    match = get_object_or_404(Match, id=match_id) if match_id else Match.objects.all().order_by("-updated_at", "-id").first()
    return Response(build_prediction(match))


@api_view(["GET"])
def ai_summary(request, match_id=None):
    match = get_object_or_404(Match, id=match_id) if match_id else Match.objects.all().order_by("-updated_at", "-id").first()
    events = MatchEvent.objects.filter(match=match)[:30] if match else []
    return Response({
        "summary": build_match_summary(match, events),
        "insights": build_insights(match, events),
    })


@api_view(["GET"])
def team_stats(request):
    matches_qs = Match.objects.all()
    total_matches = matches_qs.count()
    total_runs = sum(match.team1_score + match.team2_score for match in matches_qs)
    live_matches = matches_qs.filter(status="live").count()

    return Response({
        "total_matches": total_matches,
        "total_runs": total_runs,
        "live_matches": live_matches,
    })
