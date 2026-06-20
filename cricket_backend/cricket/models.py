from django.db import models

class Match(models.Model):
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("live", "Live"),
        ("innings_break", "Innings Break"),
        ("completed", "Completed"),
        ("delayed", "Delayed"),
    ]

    FORMAT_CHOICES = [
        ("T20", "T20"),
        ("ODI", "ODI"),
        ("TEST", "Test"),
    ]

    team1 = models.CharField(max_length=100)
    team2 = models.CharField(max_length=100)
    team1_score = models.IntegerField()
    team2_score = models.IntegerField()
    overs = models.FloatField()
    team1_wickets = models.IntegerField(default=0)
    team2_wickets = models.IntegerField(default=0)
    batting_team = models.CharField(max_length=100, blank=True, default="")
    bowling_team = models.CharField(max_length=100, blank=True, default="")
    venue = models.CharField(max_length=150, blank=True, default="")
    match_format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default="T20")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="live")
    target = models.IntegerField(default=0)
    current_batter = models.CharField(max_length=100, blank=True, default="")
    non_striker = models.CharField(max_length=100, blank=True, default="")
    current_bowler = models.CharField(max_length=100, blank=True, default="")
    last_ball = models.CharField(max_length=30, blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    predicted_winner = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.team1} vs {self.team2}"

class Player(models.Model):
    name = models.CharField(max_length=100)
    team = models.CharField(max_length=100)
    runs = models.IntegerField()
    wickets = models.IntegerField()

    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=100)
    matches_played = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class MatchEvent(models.Model):
    EVENT_CHOICES = [
        ("ball", "Ball"),
        ("four", "Four"),
        ("six", "Six"),
        ("wicket", "Wicket"),
        ("wide", "Wide"),
        ("no_ball", "No Ball"),
        ("milestone", "Milestone"),
        ("break", "Break"),
    ]

    match = models.ForeignKey(Match, related_name="events", on_delete=models.CASCADE)
    innings = models.IntegerField(default=1)
    over = models.IntegerField(default=0)
    ball = models.IntegerField(default=0)
    batting_team = models.CharField(max_length=100, blank=True, default="")
    batter = models.CharField(max_length=100, blank=True, default="")
    bowler = models.CharField(max_length=100, blank=True, default="")
    runs = models.IntegerField(default=0)
    extras = models.IntegerField(default=0)
    wicket = models.BooleanField(default=False)
    event_type = models.CharField(max_length=20, choices=EVENT_CHOICES, default="ball")
    commentary = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.match} {self.over}.{self.ball} - {self.event_type}"
