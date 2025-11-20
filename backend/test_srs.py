import datetime
from services.srs import calculate_review

def test_srs_logic():
    print("🧪 Testing Spaced Repetition Algorithm (SM-2)\n")
    
    # Initial State
    grade = 0
    repetitions = 0
    ease_factor = 2.5
    interval = 0
    
    print(f"Initial State: Reps={repetitions}, EF={ease_factor}, Interval={interval}")
    
    # Scenario 1: User rates "Good" (4) - First Review
    print("\n--- Review 1: User rates 'Good' (4) ---")
    result = calculate_review(4, repetitions, ease_factor, interval)
    print(f"New Interval: {result['interval']} days (Expected: 1)")
    print(f"Next Review: {result['next_review'].date()}")
    
    # Update state
    repetitions = result['repetitions']
    ease_factor = result['ease_factor']
    interval = result['interval']
    
    # Scenario 2: User rates "Good" (4) - Second Review
    print("\n--- Review 2: User rates 'Good' (4) ---")
    result = calculate_review(4, repetitions, ease_factor, interval)
    print(f"New Interval: {result['interval']} days (Expected: 6)")
    print(f"Next Review: {result['next_review'].date()}")
    
    # Update state
    repetitions = result['repetitions']
    ease_factor = result['ease_factor']
    interval = result['interval']
    
    # Scenario 3: User rates "Easy" (5) - Third Review
    print("\n--- Review 3: User rates 'Easy' (5) ---")
    result = calculate_review(5, repetitions, ease_factor, interval)
    print(f"New Interval: {result['interval']} days (Expected: > 6)")
    print(f"New Ease Factor: {result['ease_factor']:.2f} (Expected: > 2.5)")
    
    # Scenario 4: User rates "Again" (0) - Forgot
    print("\n--- Review 4: User rates 'Again' (0) ---")
    # Update state first
    repetitions = result['repetitions']
    ease_factor = result['ease_factor']
    interval = result['interval']
    
    result = calculate_review(0, repetitions, ease_factor, interval)
    print(f"New Interval: {result['interval']} days (Expected: 1)")
    print(f"Repetitions: {result['repetitions']} (Expected: 0)")

if __name__ == "__main__":
    test_srs_logic()
