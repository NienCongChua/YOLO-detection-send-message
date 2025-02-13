## Project Overview

This project is a YOLO-based object detection system that sends messages upon detecting specified objects. YOLO (You Only Look Once) is a state-of-the-art, real-time object detection system.

## How to Run

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/NienCongChua/YOLO-detection-send-message.git
    cd YOLO-detection-send-message
    ```

2. **Install Dependencies:**
    Make sure you have Python and pip installed. Then, install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

3. **Download YOLO Weights:**
    Download the pre-trained YOLO weights and place them in the `weights` directory.

4. **Run the Detection Script:**
    Execute the detection script with the following command:
    ```bash
    python detect.py --source your_video.mp4 --output output_directory
    ```

5. **Configure Messaging:**
    Set up your messaging service (e.g., Twilio) and configure the necessary API keys and settings in the `config.py` file.

6. **Start the Application:**
    Run the main application:
    ```bash
    python app.py
    ```

7. **View Results:**
    Check the output directory for detection results and monitor messages sent to your configured service.

For more detailed instructions, please refer to the documentation within the repository.

<h2 id="contrib">Contributors</h2>
<a href="https://github.com/NienCongChua/YOLO-detection-send-message/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=NienCongChua/YOLO-detection-send-message" />
</a>