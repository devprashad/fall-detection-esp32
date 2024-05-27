from fastapi import FastAPI
import psycopg2
from pydantic import BaseModel
from typing import List

app = FastAPI()

class DataItem(BaseModel):
    id: int
    accelerometer: float
    gyroscope: float

@app.get("/data", response_model=List[DataItem])
def read_data():
    conn = psycopg2.connect("dbname=yourdbname user=yourdbuser password=yourdbpassword")
    cursor = conn.cursor()
    cursor.execute("SELECT id, accelerometer, gyroscope FROM your_table")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [{"id": row[0], "accelerometer": row[1], "gyroscope": row[2]} for row in rows]
