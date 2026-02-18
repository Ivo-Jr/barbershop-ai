import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
    system:
      "Você é o Aparatus AI, um assistente virtual de agendamento de barbearias",
  });

  return result.toUIMessageStreamResponse();
};
