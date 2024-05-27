from fastapi import FastAPI, HTTPException
from typing import List
import psycopg2
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# PostgreSQL database connection settings
DATABASE_URL = "dbname=fall_detection_uwzd user=fall_detection_uwzd_user password=TSFtnTEpJMS02re7dsRMm6YFeTV107JI host=dpg-cp41st779t8c73e98fkg-a.singapore-postgres.render.com port=5432"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Function to retrieve data from the database
def get_sensor_data():
    try:
        # Connect to the database
        conn = psycopg2.connect(DATABASE_URL)

        # Open a cursor to perform database operations
        cur = conn.cursor()

        # Query to select acceleration and gyroscope data
        query = "SELECT acceleration, gyroscope FROM falldetect"

        # Execute the query
        cur.execute(query)

        # Fetch all rows of the result
        rows = cur.fetchall()

        # Close cursor and connection
        cur.close()
        conn.close()

        # Return the fetched data
        return rows

    except psycopg2.Error as e:
        # Handle database errors
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

# Endpoint to retrieve acceleration and gyroscope data
@app.get("/data", response_model=List[List[float]])
async def read_sensor_data():
    # Retrieve data from the database
    data = get_sensor_data()
    return data
