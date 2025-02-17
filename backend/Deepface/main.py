from deepface import DeepFace

# Analyze a given image
result = DeepFace.analyze(img_path="path_to_your_image.jpg", actions=['age', 'gender', 'race', 'emotion'])

print("Age: ", result["age"])
print("Gender: ", result["gender"])
print("Race: ", result["dominant_race"])
print("Emotion: ", result["dominant_emotion"])