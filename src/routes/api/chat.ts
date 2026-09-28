import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId, withLovableAiGatewayRunIdHeader } from "@/lib/run-id.server";

const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(z.union([
    z.object({ type: z.literal("text"), text: z.string().max(4000) }),
    z.object({ type: z.literal("reasoning"), text: z.string().max(10000) }),
  ])).max(20),
}).passthrough();

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "O assistente não está disponível neste momento." }, { status: 503 });
        let messages: UIMessage[];
        try {
          const body = await request.json();
          const parsed = z.object({ messages: z.array(messageSchema).min(1).max(40) }).parse(body);
          messages = body.messages as UIMessage[];
          if (messages.at(-1)?.role !== "user") throw new Error("Missing user message");
        } catch {
          return Response.json({ error: "Não foi possível ler a mensagem." }, { status: 400 });
        }

        const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: "És o assistente musical do Pulso, uma seleção editorial de música portuguesa. Responde em português de Portugal, de forma breve, calorosa e honesta. Podes conversar sobre artistas, géneros, descoberta musical e o conteúdo visível do Pulso: novidades, seleções, rádio e listas. Não afirmes que reproduzes música, crias playlists na conta, ou consultas um catálogo em tempo real. As recomendações são sugestões, não dados verificados. Se perguntarem por conta, preços ou funcionalidades não confirmadas, diz claramente que não tens essa informação.",
          messages: await convertToModelMessages(messages),
          abortSignal: request.signal,
          maxRetries: 0,
          providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } },
        });
        return withLovableAiGatewayRunIdHeader(
          result.toUIMessageStreamResponse({
            originalMessages: messages,
            sendReasoning: true,
            onFinish: () => { /* Browser owns this conversation's history. */ },
            onError: (error) => error instanceof Error ? error.message : "O assistente não conseguiu responder. Tenta novamente mais tarde.",
          }),
          runIdFetch,
        );
      },
    },
  },
});