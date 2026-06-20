from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("cricket", "0004_match_predicted_winner"),
    ]

    operations = [
        migrations.AddField(
            model_name="match",
            name="batting_team",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="match",
            name="bowling_team",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="match",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name="match",
            name="current_batter",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="match",
            name="current_bowler",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="match",
            name="last_ball",
            field=models.CharField(blank=True, default="", max_length=30),
        ),
        migrations.AddField(
            model_name="match",
            name="match_format",
            field=models.CharField(choices=[("T20", "T20"), ("ODI", "ODI"), ("TEST", "Test")], default="T20", max_length=10),
        ),
        migrations.AddField(
            model_name="match",
            name="non_striker",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="match",
            name="status",
            field=models.CharField(choices=[("scheduled", "Scheduled"), ("live", "Live"), ("innings_break", "Innings Break"), ("completed", "Completed"), ("delayed", "Delayed")], default="live", max_length=20),
        ),
        migrations.AddField(
            model_name="match",
            name="target",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="match",
            name="team1_wickets",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="match",
            name="team2_wickets",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="match",
            name="updated_at",
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AddField(
            model_name="match",
            name="venue",
            field=models.CharField(blank=True, default="", max_length=150),
        ),
        migrations.CreateModel(
            name="MatchEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("innings", models.IntegerField(default=1)),
                ("over", models.IntegerField(default=0)),
                ("ball", models.IntegerField(default=0)),
                ("batting_team", models.CharField(blank=True, default="", max_length=100)),
                ("batter", models.CharField(blank=True, default="", max_length=100)),
                ("bowler", models.CharField(blank=True, default="", max_length=100)),
                ("runs", models.IntegerField(default=0)),
                ("extras", models.IntegerField(default=0)),
                ("wicket", models.BooleanField(default=False)),
                ("event_type", models.CharField(choices=[("ball", "Ball"), ("four", "Four"), ("six", "Six"), ("wicket", "Wicket"), ("wide", "Wide"), ("no_ball", "No Ball"), ("milestone", "Milestone"), ("break", "Break")], default="ball", max_length=20)),
                ("commentary", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("match", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="events", to="cricket.match")),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
