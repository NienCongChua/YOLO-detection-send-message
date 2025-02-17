def process_frame(frame):
    # Function to process a single frame and return analysis results
    from deepface import DeepFace
    import cv2

    # Analyze the frame using DeepFace
    result = DeepFace.analyze(frame, actions=['age', 'gender', 'race', 'emotion'], enforce_detection=False)

    # Format the results for display
    output = {
        "age": result[0]["age"],
        "gender": result[0]["gender"],
        "race": result[0]["dominant_race"],
        "emotion": result[0]["dominant_emotion"]
    }
    
    return output

def display_results(frame, results):
    # Function to display the analysis results on the frame
    age = results["age"]
    gender = results["gender"]
    race = results["race"]
    emotion = results["emotion"]

    # Prepare the text to display
    text = f"Age: {age}, Gender: {gender}, Race: {race}, Emotion: {emotion}"
    
    # Put the text on the frame
    cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    return frame