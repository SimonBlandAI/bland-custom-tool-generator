import { CompletionCreateParams, AnthropicClient } from '@anthropic-ai/sdk';

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

class BaseLLM {
  private history: HistoryItem[];
  private generations: Generation[];
  private variables: Map<string, string>;
  private client: AnthropicClient;
  private currentModel: AnthropicModel;

  constructor(apiKey: string, model: AnthropicModel = 'claude-2') {
    this.history = [];
    this.generations = [];
    this.variables = new Map();
    this.client = new AnthropicClient(apiKey);
    this.currentModel = model;
  }

  async generate(prompt: string): Promise<string> {
    const completion = await this.callAnthropicAPI(prompt);
    
    this.addToHistory(prompt, completion);
    this.addGeneration(completion);
    
    return completion;
  }

  private async callAnthropicAPI(prompt: string): Promise<string> {
    const params: CompletionCreateParams = {
      model: this.currentModel,
      prompt: prompt,
      max_tokens_to_sample: 300,
    };

    const response = await this.client.completions.create(params);
    return response.completion;
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

export default BaseLLM;


