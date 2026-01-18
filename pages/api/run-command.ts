import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { command } = req.body;
  if (!command || typeof command !== 'string') {
    res.status(400).json({ error: 'Invalid command' });
    return;
  }

  // Execute the command using child_process.exec
  exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: stdout || stderr || 'Command executed successfully' });
  });
}
