import axios from 'axios';
import { WebSocket } from 'ws';
import { Attachment, AvatarOptions, BannerColorOptions, Embed, IntentsOptions } from './types';
interface DiscordApiOptions {
  token: string;
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

  async sendMessage(channelId: string, message: string): Promise<Message> {
    try {
      const { data } = await axios.post<Message>(
        `${this.apiBaseUrl}/channels/${channelId}/messages`,
        { content: message },
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
    try {
      const { data } = await axios.post<Message>(
        `${this.apiBaseUrl}/channels/${channelId}/messages`,
        {
          content: content,
          embed: embed,
        },
        {
          headers: {
            Authorization: `Bot ${this.token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error('Failed to send the message with the embed.');
    }
  }

  async sendMessageWithAttachment(channelId: string, content: string, attachment: Attachment): Promise<Message> {
    try {
      const { data } = await axios.post<Message>(
        `${this.apiBaseUrl}/channels/${channelId}/messages`,
        {
          content: content,
        },
        {
          headers: {
            Authorization: `Bot ${this.token}`,
          },
          files: [
            {
              name: attachment.name,
              attachment: attachment.content,
            },
          ],
        }
      );
      return data;
    } catch (error) {
      throw new Error('Failed to send the message with the attachment.');
    }
  }

  async updateAvatar(options: AvatarOptions): Promise<User> {
    try {
      const { data } = await axios.patch<User>(
        `${this.apiBaseUrl}/users/@me`,
        {
          avatar: options.avatar,
        },
        {
          headers: {
            Authorization: `Bot ${this.token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error('Failed to update the avatar.');
    }
  }

  async updateBannerColor(options: BannerColorOptions): Promise<User> {
    try {
      const { data } = await axios.patch<User>(
        `${this.apiBaseUrl}/users/@me`,
        {
          banner_color: options.color,
        },
        {
          headers: {
            Authorization: `Bot ${this.token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error('Failed to update the banner color.');
    }
  }

  async enableAllIntents(options: IntentsOptions): Promise<void> {
    try {
      if (options.all) {
        const allIntents = 32767; // Sum of all intent flags
        const { data } = await axios.patch(
          `${this.apiBaseUrl}/applications/@me/bot`,
          {
            intents: allIntents,
          },
          {
            headers: {
              Authorization: `Bot ${this.token}`,
            },
          }
        );
        console.log('Enabled all intents.');
      }
    } catch (error) {
      throw new Error('Failed to enable all intents.');
    }
  }

  

  // Add more methods for interacting with the Discord API here
}

export default DiscordApi;
