import { Groq } from 'groq-sdk';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAgentConfig {
  name: string;
  personality: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

export class ChatAgent {
  private groq: Groq;
  private name: string;
  private personality: string;
  private messageHistory: Message[];
  private temperature: number;
  private maxTokens: number;

  constructor(config: ChatAgentConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required to initialize the chat agent');
    }
    
    this.groq = new Groq({ 
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true // Enable browser usage
    });
    this.name = config.name;
    this.personality = config.personality;
    this.messageHistory = [];
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens ?? 1024;
  }

  private validateInput(message: string): void {
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid input: Message must be a non-empty string');
    }
  }

  private async generateSystemPrompt(): Promise<string> {
    return `You are ${this.name}, an AI assistant with the following personality: ${this.personality}. 
    Respond to messages in a way that reflects this personality while being helpful and accurate.`;
  }

  public getMessageHistory(): Message[] {
    return [...this.messageHistory];
  }

  public async sendMessage(message: string): Promise<string> {
    try {
      this.validateInput(message);

      this.messageHistory.push({ role: 'user', content: message });

      const messages = [
        { role: 'system', content: await this.generateSystemPrompt() },
        ...this.messageHistory
      ];

      const chatCompletion = await this.groq.chat.completions.create({
        messages,
        model: "llama-3.2-90b-vision-preview",
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        top_p: 1,
        stream: false,
        stop: null
      });

      const response = chatCompletion.choices[0]?.message?.content || 'No response generated';
      this.messageHistory.push({ role: 'assistant', content: response });

      return response;
    } catch (error) {
      console.error('Error in chat agent:', error);
      throw new Error('Failed to generate response');
    }
  }

  public clearHistory(): void {
    this.messageHistory = [];
  }

  public updateConfig(config: Partial<ChatAgentConfig>): void {
    if (config.name) this.name = config.name;
    if (config.personality) this.personality = config.personality;
    if (config.temperature) this.temperature = config.temperature;
    if (config.maxTokens) this.maxTokens = config.maxTokens;
  }
}