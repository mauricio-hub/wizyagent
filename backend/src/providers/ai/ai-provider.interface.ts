export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface AIProvider {
  chat(messages: Message[]): Promise<AIResponse>;
}
