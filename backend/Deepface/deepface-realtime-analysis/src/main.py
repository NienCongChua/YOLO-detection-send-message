from deepface import DeepFace
import cv2
import os
import matplotlib.pyplot as plt

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def analyze_frame(frame):
    result = DeepFace.analyze(frame, actions=['age', 'gender', 'race', 'emotion'], enforce_detection=False)
    return result

def display_results(frame, results):
    for result in results:
        age = result["age"]
        gender = result["gender"]
        race = result["dominant_race"]
        emotion = result["dominant_emotion"]

        text = f"Age: {age}, Gender: {gender}, Race: {race}, Emotion: {emotion}"
        cv2.putText(frame, text, (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

def main():
    cap = cv2.VideoCapture(0)

    plt.ion()  # Turn on interactive mode for matplotlib
    fig, ax = plt.subplots()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = analyze_frame(frame)
        display_results(frame, results)

        # Convert frame to RGB for matplotlib
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        ax.imshow(frame_rgb)
        plt.draw()
        plt.pause(0.001)

        # Check for 'q' key press to exit
        if plt.waitforbuttonpress(0.001):
            break

    cap.release()
    plt.close(fig)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()