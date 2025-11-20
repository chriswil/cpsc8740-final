import datetime

def calculate_review(grade: int, repetitions: int, ease_factor: float, interval: int):
    """
    Implements the SuperMemo-2 (SM-2) algorithm.
    
    Args:
        grade (int): User's grade for the card (0-5).
                     0-2: Incorrect/Forgot
                     3: Hard
                     4: Good
                     5: Easy
        repetitions (int): Number of consecutive correct answers.
        ease_factor (float): Difficulty multiplier.
        interval (int): Current interval in days.
        
    Returns:
        dict: {
            "repetitions": int,
            "ease_factor": float,
            "interval": int,
            "next_review": datetime.datetime
        }
    """
    if grade >= 3:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = int(interval * ease_factor)
        
        repetitions += 1
    else:
        repetitions = 0
        interval = 1
    
    # Update Ease Factor
    # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    # q = grade
    ease_factor = ease_factor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
    if ease_factor < 1.3:
        ease_factor = 1.3
        
    next_review = datetime.datetime.utcnow() + datetime.timedelta(days=interval)
    
    return {
        "repetitions": repetitions,
        "ease_factor": ease_factor,
        "interval": interval,
        "next_review": next_review
    }
