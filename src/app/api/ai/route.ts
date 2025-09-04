import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;
    const messages = body?.messages ?? (message ? [message] : undefined);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('messages is required', { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const streamIterator = openai.responses.stream({
      model: 'gpt-4.1',
      input: messages,
      temperature: 1.0,
      stream: true,
      tools: [{ type: 'web_search' }],
      tool_choice: 'auto',
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of streamIterator) {
            if (event.type === 'response.output_text.delta') {
              controller.enqueue(encoder.encode(event.delta));
            }
            if (event.type === 'response.completed') break;
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    return new Response(e?.message ?? 'Internal Server Error', { status: 500 });
  }
}
