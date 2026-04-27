import { ENV } from "../lib/env.js";

const PISTON_API_URL = ENV.PISTON_API_URL || "https://emkc.org/api/v2/piston";

export async function executeCode(req, res) {
  try {
    const { language, version, files, stdin } = req.body || {};

    if (!language || !version || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: "Invalid execute payload" });
    }

    const headers = {
      "Content-Type": "application/json",
    };

    if (ENV.PISTON_API_KEY) {
      headers.Authorization = `Bearer ${ENV.PISTON_API_KEY}`;
    }

    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers,
      body: JSON.stringify({ language, version, files, stdin }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({ message: data.message || "Piston error" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error executing code via Piston:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
