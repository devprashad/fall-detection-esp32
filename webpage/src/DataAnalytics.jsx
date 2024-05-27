import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DataAnalytics = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    // Fetch sensor data from FastAPI endpoint
    fetch('http://127.0.0.1:8000/data') // Update the URL with your FastAPI server URL
      .then(response => response.json())
      .then(data => {
        // Transform the data to the required format
        const formattedData = data.map((point, index) => ({
          acceleration: point[0],
          gyroscope: point[1]
        }));
        setSensorData(formattedData);
      })
      .catch(error => console.error('Error fetching sensor data:', error));
  }, []);

  // Filtered data for the table and graph, with new sequential IDs and fall condition
  const filteredData = sensorData
    .filter(point => point.acceleration > 20 || point.gyroscope > 2)
    .map((point, index) => ({
      id: index + 1,
      ...point,
      fall: point.acceleration > 20 && point.gyroscope > 2 ? 'Fall' : 'Not Fall'
    }));

  return (
    <div>
      <h1>Data Analytics</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={filteredData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="acceleration" stroke="#8884d8" activeDot={{ r: 8 }} /> {/* Acceleration */}
          <Line type="monotone" dataKey="gyroscope" stroke="#82ca9d" /> {/* Gyroscope */}
        </LineChart>
      </ResponsiveContainer>

      <h1>Filtered Data Table</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Acceleration</th>
            <th>Gyroscope</th>
            <th>Fall Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((point) => (
            <tr key={point.id}>
              <td>{point.id}</td>
              <td>{point.acceleration}</td> {/* Display acceleration */}
              <td>{point.gyroscope}</td> {/* Display gyroscope */}
              <td>{point.fall}</td> {/* Display fall status */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataAnalytics;
