import { Agent } from "@mastra/core/agent";
import { OpenAIRealtimeVoice } from "@mastra/voice-openai-realtime";
import { openai } from "@ai-sdk/openai";

const voice = new OpenAIRealtimeVoice({
  model: "gpt-4o-mini-realtime-preview",
  speaker: "alloy",
});
voice.updateConfig({
  turn_detection: {
    type: "server_vad",
    threshold: 0.6,
    silence_duration_ms: 1200,
  },
});

// Create an agent with speech-to-speech voice capabilities
export const realtimeVoiceAgent = new Agent({
  name: "Agent",
  instructions: `You are a helpful assistant with speech-to-speech capabilities.`,
  model: openai("gpt-4o"),
  tools: {},
  voice,
});


realtimeVoiceAgent.voice.on("writing", ({ text, role }) => {
  console.log(`${role} said(w): ${text}`);
});

realtimeVoiceAgent.voice.on("error", (error) => {
  console.error("Voice error:", error);
});

console.log("realtime voice connect...");
await realtimeVoiceAgent.voice.connect();

console.log("realtime voice start");
realtimeVoiceAgent.voice.speak("Hello, I'm your AI assistant!");

console.log("realtime voice start");
realtimeVoiceAgent.voice.speak("Hello, I'm your AI assistant!");

console.log("realtime voice fin....");


