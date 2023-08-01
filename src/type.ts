export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
}

export interface Message {
  id: string;
  content: string;
  author: User;
}
// ... (existing types)

export interface Embed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: EmbedField[];
  footer?: EmbedFooter;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
}

export interface Attachment {
  name: string;
  content: Buffer | string;
}

export interface AvatarOptions {
  avatar: Buffer | string;
}

export interface BannerColorOptions {
  color: number;
}

export interface IntentsOptions {
  all: boolean;
}
