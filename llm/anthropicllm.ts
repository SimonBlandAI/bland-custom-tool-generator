import { Anthropic } from '@anthropic-ai/sdk';
import { ILLM } from '../interfaces/ILLM';

interface Generation {
  id: string;
  text: string;
  timestamp: Date;
  model: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  completion: string;
  timestamp: Date;
  model: string;
}

type AnthropicModel = 'claude-2' | 'claude-instant-1' | 'claude-1' | 'claude-instant-1.1';

class AnthropicLLM implements ILLM {
  private history: HistoryItem[];
  private generations: Generation[];
  private variables: Map<string, string>;
  private client: Anthropic;
  private currentModel: AnthropicModel;

  constructor(apiKey: string, model: AnthropicModel = 'claude-2') {
    this.history = [];
    this.generations = [];
    this.variables = new Map();
    this.client = new Anthropic(apiKey);
    this.currentModel = model;
  }

  async generate(prompt: string): Promise<string> {
    const updatedPrompt = this.updateVariables(prompt);
    const completion = await this.callAnthropicAPI(updatedPrompt);
    
    this.addToHistory(updatedPrompt, completion);
    this.addGeneration(completion);
    
    return completion;
  }

  private async callAnthropicAPI(prompt: string): Promise<string> {
    const params: Messages.MessageCreateParams = {
      model: this.currentModel,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    };

    const response = await this.client.messages.create(params);
    return response.content[0]["text"] ?? '';
  }

  setModel(model: AnthropicModel): void {
    this.currentModel = model;
  }

  private addToHistory(prompt: string, completion: string): void {
    const historyItem: HistoryItem = {
      id: this.generateId(),
      prompt,
      completion,
      timestamp: new Date(),
      model: this.currentModel
    };
    this.history.push(historyItem);
  }

  private addGeneration(text: string): void {
    const generation: Generation = {
      id: this.generateId(),
      text,
      timestamp: new Date(),
      model: this.currentModel
    };
    this.generations.push(generation);
  }

  setVariable(key: string, value: string): void {
    this.variables.set(key, value);
  }

  getVariable(key: string): string | undefined {
    return this.variables.get(key);
  }

  updateVariables(text: string): string {
    let updatedText = text;
    for (const [key, value] of this.variables.entries()) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedText = updatedText.replace(regex, value);
    }
    return updatedText;
  }

  getHistory(): HistoryItem[] {
    return this.history;
  }

  getGenerations(): Generation[] {
    return this.generations;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default AnthropicLLM;