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
