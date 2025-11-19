import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

interface UserContext {
  name?: string;
  preferences: string[];
  topics: string[];
}

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export async function POST(request: Request) {
  try {
    const { messages, userContext } = await request.json();

    // Build context-aware system prompt
    const systemPrompt = `Eres AsistenteLess, un agente de IA autónomo amigable, inteligente y contextual. Tu nombre es único porque eres "sin menos" - siempre positivo y práctico.

${userContext.name ? `El usuario se llama ${userContext.name}.` : ''}
${userContext.topics.length > 0 ? `Los temas de interés del usuario son: ${userContext.topics.join(', ')}.` : ''}

Instrucciones:
1. Responde de forma clara, concisa y útil
2. Personaliza tus respuestas según el contexto del usuario
3. Si no entiendes la pregunta, pide una aclaración de manera amigable
4. Usa un tono conversacional con algo de humor ligero
5. Si detectas nueva información del usuario (nombre, preferencias, intereses), menciona que la has aprendido
6. Mantén el contexto de la conversación anterior

Responde SIEMPRE en español, de manera natural y amigable.`;

    const messagesForGroq = messages.map((msg: Message) => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Extract user info from latest message
    let updatedContext = { ...userContext };
    const latestMessage = messages[messages.length - 1];

    const nameMatch = latestMessage.content.match(
      /(?:me llamo|soy|mi nombre es|llamame)\s+([A-Za-záéíóúñ]+)/i
    );
    if (nameMatch && !userContext.name) {
      updatedContext.name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    }

    // Generate AI response with full conversation history
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: messagesForGroq,
      temperature: 0.8,
      maxTokens: 300,
    });

    return Response.json({
      response: text,
      updatedContext,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}
