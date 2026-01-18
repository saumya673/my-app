import React, { useState } from 'react';

const Home = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');

  const runCommand = async () => {
    if (!command.trim()) {
      setOutput('Please enter a command to run.');
      return;
    }

    setOutput('Running command...');

    try {
      // Call the backend API to run the command using the github-mcp agent
      const response = await fetch('/api/run-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      const data = await response.json();
      if (response.ok) {
        setOutput(data.message || 'Command executed successfully.');
      } else {
        setOutput(data.error || 'Failed to execute command.');
      }
    } catch (error) {
      setOutput('Error running command: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Run Command with github-mcp Agent</h1>
      <textarea
        rows={4}
        style={{ width: '100%', fontSize: 16, padding: 8, boxSizing: 'border-box' }}
        placeholder="Enter command to run"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />
      <button
        onClick={runCommand}
        style={{ marginTop: 12, padding: '8px 16px', fontSize: 16, cursor: 'pointer' }}
      >
        Run Command
      </button>
      <pre style={{ marginTop: 20, backgroundColor: '#f4f4f4', padding: 12, minHeight: 100 }}>
        {output}
      </pre>
    </div>
  );
};

export default Home;
