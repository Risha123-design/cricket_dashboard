import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Match, MatchEvent
from .serializers import MatchSerializer, MatchEventSerializer
from .analytics import build_prediction, build_match_summary, build_insights


class ScoreConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("live_scores", self.channel_name)
        await self.accept()
        payload = await self.get_dashboard_payload()
        await self.send(text_data=json.dumps({
            "type": "snapshot",
            "payload": payload,
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("live_scores", self.channel_name)

    async def receive(self, text_data):
        await self.send(text_data=json.dumps({
            "type": "heartbeat",
            "message": "Live score socket connected",
        }))

    async def score_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "score_update",
            "payload": event["payload"],
        }))

    @database_sync_to_async
    def get_dashboard_payload(self):
        matches_qs = Match.objects.all().order_by("-updated_at", "-id")
        selected_match = matches_qs.first()
        events_qs = list(MatchEvent.objects.filter(match=selected_match)[:30]) if selected_match else []

        return {
            "matches": MatchSerializer(matches_qs, many=True).data,
            "selected_match": MatchSerializer(selected_match).data if selected_match else None,
            "events": MatchEventSerializer(events_qs, many=True).data,
            "prediction": build_prediction(selected_match),
            "summary": build_match_summary(selected_match, events_qs),
            "insights": build_insights(selected_match, events_qs),
        }
