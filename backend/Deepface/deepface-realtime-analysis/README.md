# deepface-realtime-analysis/deepface-realtime-analysis/README.md

# DeepFace Real-Time Analysis

This project demonstrates the use of the DeepFace library for real-time facial analysis using a camera feed. The application captures video from the camera, processes each frame to analyze age, gender, race, and emotion, and displays the results in real-time.

## Project Structure

```
deepface-realtime-analysis
├── src
│   ├── main.py        # Entry point of the application
│   └── utils.py       # Utility functions for image processing
├── requirements.txt    # List of dependencies
└── README.md           # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd deepface-realtime-analysis
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

To run the application, execute the following command:

```
python src/main.py
```

The application will open a window displaying the camera feed with real-time analysis results for each detected face.

## Functionality

- **Age Detection**: Estimates the age of the person in the frame.
- **Gender Detection**: Identifies the gender of the person.
- **Race Detection**: Determines the dominant race of the individual.
- **Emotion Detection**: Analyzes the facial expression to identify the dominant emotion.

## Requirements

- Python 3.x
- DeepFace
- OpenCV
- Other dependencies listed in `requirements.txt`

## License

This project is licensed under the MIT License. See the LICENSE file for more details.