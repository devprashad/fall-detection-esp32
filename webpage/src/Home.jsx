import React from 'react';
import dataflowImage from '/dataflow.jpg'; // Import the image file

// Component for individual contributor
const Contributor = ({ name, rollNo, photo }) => {
  const contributorStyle = {
    marginBottom: '20px',
    textAlign: 'center',
  };

  const photoStyle = {
    width: '150px',
    borderRadius: '50%',
    marginBottom: '10px',
  };

  return (
    <div style={contributorStyle}>
      <img src={photo} alt={name} style={photoStyle} />
      <p>Name: {name}</p>
      <p>Roll No: {rollNo}</p>
    </div>
  );
};

// Load Google Fonts
const loadGoogleFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Aptos:wght@700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const Home = () => {
  React.useEffect(() => {
    loadGoogleFonts();
  }, []);

  const containerStyle = {
    fontFamily: 'Aptos, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: '1.6',
  };

  const headingStyle = {
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
  };

  const videoContainerStyle = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    maxWidth: '100%',
    background: '#000',
    marginBottom: '20px',
  };

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  const listStyle = {
    paddingLeft: '20px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>FALL DETECTION SYSTEM</h1>
      <div style={videoContainerStyle}>
        <iframe
          style={iframeStyle}
          src="https://www.youtube.com/embed/dD0rUo1wZds"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div>
        <h2 style={headingStyle}>Objective:</h2>
        <p>
          To develop an integrated IoT system that leverages edge computing and cloud-based technologies for real-time fall detection, immediate alerting, and comprehensive data analysis, while empowering users with a manual emergency trigger mechanism through a touch sensor.
        </p>
        <h2 style={headingStyle}>Key Aspects:</h2>
        <ul style={listStyle}>
          <li>Real-time fall detection using MPU 6050 sensor and threshold-based fall detection algorithms</li>
          <li>Immediate alerting through SMS using SIM808L module</li>
          <li>Data logging and comprehensive data analysis using Influx DB</li>
          <li>Edge computing using ESP32 microcontrollers</li>
          <li>Manual emergency trigger mechanism through touch sensor</li>
        </ul>
        <h2 style={headingStyle}>Hardware Selection and Design:</h2>
        <ul style={listStyle}>
          <li>MPU 6050 sensor for fall detection</li>
          <li>Touch sensor for user input</li>
          <li>SIM808L module for SMS communication</li>
          <li>ESP32 microcontroller board as the brain of the system</li>
        </ul>
        <h2 style={headingStyle}>Software Design:</h2>
        <p>
          The system uses a data flow diagram (DFD) to represent the flow of data between different components. The DFD consists of the following components:
        </p>
        <p>
          <img src={dataflowImage} alt="Data Flow Diagram" />
        </p>
        <h2 style={headingStyle}>IoT System Design:</h2>
        <p>
          The system is classified as a level 5 IoT system, which has multiple end nodes and one coordinator node. The end nodes perform sensing and/or actuation, while the coordinator node collects endpoint data from the end nodes and sends it to the cloud.
        </p>
      </div>
      <h2 style={headingStyle}>Contributors:</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* Add contributors with their name, roll number, and photo */}
        <Contributor name="CHARAN KUMAR" rollNo="CB.EN.U4CSE21413" photo="person.png" />
        <Contributor name="DEV PRASHAD" rollNo="CB.EN.U4CSE21626" photo="person.png" />
        <Contributor name="PRASANTH" rollNo="CB.EN.U4CSE21626" photo="person.png" />
      </div>
    </div>
  );
};

export default Home;
