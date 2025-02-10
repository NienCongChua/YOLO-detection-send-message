import mysql.connector

# Establish the connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="YOLO_detection_send_message"
)

# Create a cursor object
cursor = conn.cursor()

# Execute the query
cursor.execute("SELECT * FROM user")

# Fetch all the rows
rows = cursor.fetchall()

# Print the rows
for row in rows:
    print(row)

# Close the cursor and connection
cursor.close()
conn.close()