def _batting_score(match):
    return match.team1_score if match.batting_team == match.team1 else match.team2_score


def _bowling_score(match):
    return match.team2_score if match.batting_team == match.team1 else match.team1_score


def _batting_wickets(match):
    return match.team1_wickets if match.batting_team == match.team1 else match.team2_wickets


def _max_overs(match):
    return 20 if match.match_format == "T20" else 50


def build_prediction(match):
    if not match:
        return {
            "predicted_winner": "No data",
            "team1_probability": 50,
            "team2_probability": 50,
            "confidence": "low",
            "reason": "No match data is available yet.",
        }

    batting_score = _batting_score(match)
    bowling_score = _bowling_score(match)
    wickets = _batting_wickets(match)
    max_overs = _max_overs(match)
    remaining_overs = max(max_overs - float(match.overs or 0), 0)
    current_rate = round(batting_score / match.overs, 2) if match.overs else 0
    projected_score = round(batting_score + current_rate * remaining_overs)

    score_edge = match.team1_score - match.team2_score
    target_pressure = 0
    if match.target:
        target_pressure = batting_score - match.target

    wicket_pressure = wickets * 4
    momentum = score_edge + target_pressure - wicket_pressure
    team1_probability = max(8, min(92, round(50 + momentum / 3)))
    team2_probability = 100 - team1_probability

    predicted_winner = match.team1 if team1_probability >= team2_probability else match.team2
    confidence_gap = abs(team1_probability - team2_probability)
    confidence = "high" if confidence_gap >= 30 else "medium" if confidence_gap >= 14 else "low"

    reason = (
        f"{match.batting_team or 'The batting side'} are scoring at {current_rate} per over "
        f"with a projected total near {projected_score}."
    )
    if match.target:
        reason = (
            f"{match.batting_team or 'The batting side'} need {max(match.target - batting_score, 0)} more runs "
            f"with {remaining_overs:.1f} overs remaining."
        )

    return {
        "predicted_winner": predicted_winner,
        "team1_probability": team1_probability,
        "team2_probability": team2_probability,
        "confidence": confidence,
        "reason": reason,
        "projected_score": projected_score,
        "current_run_rate": current_rate,
        "required_run_rate": _required_run_rate(match),
    }


def _required_run_rate(match):
    if not match.target:
        return 0

    max_overs = _max_overs(match)
    remaining_overs = max(max_overs - float(match.overs or 0), 0)
    if remaining_overs == 0:
        return 0

    runs_needed = max(match.target - _batting_score(match), 0)
    return round(runs_needed / remaining_overs, 2)


def build_match_summary(match, events=None):
    if not match:
        return "No live match is available yet."

    events = list(events or [])
    prediction = build_prediction(match)
    batting_team = match.batting_team or match.team1
    bowling_team = match.bowling_team or match.team2
    latest_event = events[0].commentary if events else "No ball-by-ball events have been recorded yet."

    return (
        f"{match.team1} are {match.team1_score}/{match.team1_wickets} and {match.team2} are "
        f"{match.team2_score}/{match.team2_wickets}. {batting_team} are currently batting against "
        f"{bowling_team}. {prediction['reason']} Latest update: {latest_event}"
    )


def build_insights(match, events=None):
    if not match:
        return []

    events = list(events or [])
    prediction = build_prediction(match)
    recent_runs = sum(event.runs + event.extras for event in events[:12])
    recent_wickets = sum(1 for event in events[:12] if event.wicket)
    insights = [
        {
            "title": "Win probability",
            "body": f"{prediction['predicted_winner']} lead the model with {prediction['confidence']} confidence.",
            "tone": "success" if prediction["confidence"] != "low" else "neutral",
        },
        {
            "title": "Projected score",
            "body": f"Projected score is {prediction['projected_score']} at the current scoring rate.",
            "tone": "neutral",
        },
    ]

    if recent_runs:
        insights.append({
            "title": "Recent momentum",
            "body": f"The last 12 recorded balls produced {recent_runs} runs and {recent_wickets} wickets.",
            "tone": "success" if recent_runs >= 18 else "warning",
        })

    if match.target:
        insights.append({
            "title": "Chase equation",
            "body": f"Required run rate is {prediction['required_run_rate']} per over.",
            "tone": "warning" if prediction["required_run_rate"] > prediction["current_run_rate"] else "success",
        })

    return insights
