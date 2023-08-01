import axios from 'axios';
import { WebSocket } from 'ws';

interface DiscordApiOptions {
  token: string;
}

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
}

interface Message {
  id: string;
  content: string;
  author: User;
}

interface Embed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: EmbedField[];
  footer?: EmbedFooter;
}

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface EmbedFooter {
  text: string;
  icon_url?: string;
}

interface Attachment {
  name: string;
  content: Buffer | string;
}

interface AvatarOptions {
  avatar: Buffer | string;
}

interface BannerColorOptions {
  color: number;
}

interface IntentsOptions {
  all: boolean;
}

class DiscordApi {
  private token: string;
  private apiBaseUrl: string;
  private gatewayUrl: string | null;
  private ws: WebSocket | null;

  constructor(options: DiscordApiOptions) {
    this.token = options.token;
    this.apiBaseUrl = 'https://discord.com/api/v9';
    this.gatewayUrl = null;
    this.ws = null;
  }

  async login(): Promise<User> {
    try {
      const { data } = await axios.get<User>(`${this.apiBaseUrl}/users/@me`, {
        headers: {
          Authorization: `Bot ${this.token}`,
        },
      });
      this.gatewayUrl = await this.getGatewayUrl();
      this.connectWebSocket();
      return data;
    } catch (error) {
      throw new Error('Failed to log in to Discord.');
    }
  }

  async getGatewayUrl(): Promise<string> {
    try {
      const { data } = await axios.get<{ url: string }>(
        `${this.apiBaseUrl}/gateway/bot`,
        {
          headers: {
            Authorization: `Bot ${this.token}`,
          },
        }
      );
      return data.url;
    } catch (error) {
      throw new Error('Failed to fetch the gateway URL.');
    }
  }

  connectWebSocket(): void {
    if (!this.gatewayUrl) {
      throw new Error('Discord Gateway URL is not set.');
    }

    this.ws = new WebSocket(this.gatewayUrl);

    this.ws.on('message', (message: string) => {
      // Handle WebSocket messages here
      console.log('Received WebSocket message:', message);
    });

    this.ws.on('close', (code: number, reason: string) => {
      console.log('WebSocket connection closed:', code, reason);
    });

    this.ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  async sendMessage(channelId: string, content: string): Promise<Message> {
    try {
      const { data } = await axios.post<Message>(
        `${this.apiBaseUrl}/channels/${channelId}/messages`,
        { content: content },
        {
          headers: {
            Authorization: `Bot ${this.token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error('Failed to send the message.');
    }
  }

  async sendMessageWithEmbed(channelId: string, content: string, embed: Embed): Promise<Message> {
    // Implement sending a message with an embed (similar to previous code)
  }

  async sendMessageWithAttachment(channelId: string, content: string, attachment: Attachment): Promise<Message> {
    // Implement sending a message with an attachment (similar to previous code)
  }

  async updateAvatar(options: AvatarOptions): Promise<User> {
    // Implement updating the bot's avatar (similar to previous code)
  }

  async updateBannerColor(options: BannerColorOptions): Promise<User> {
    // Implement updating the bot's banner color (similar to previous code)
  }

  async enableAllIntents(options: IntentsOptions): Promise<void> {
    // Implement enabling all intents for the bot (similar to previous code)
  }

  async checkUserPermissions(guildId: string, userId: string): Promise<Permissions | null> {
    try {
      // Implement permission check using discord.js (replace 'Permissions' with the actual discord.js Permissions class)
    } catch (error) {
      throw new Error('Failed to fetch user permissions.');
    }
  }
}

export default DiscordApi;
