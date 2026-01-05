export interface User {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
}

export interface Stream {
  id: string;
  thumbnail: string;
  title: string;
  user: User;
  viewCount: string;
  likeCount: string; // Used for the "Wished" or generic heart count
  tags?: StreamTag[];
}

export interface StreamTag {
  type: 'popularity' | 'top1' | 'exclusive' | 'pk' | 'generic';
  text: string;
  color?: string; // hex or tailwind class
}

export type TabType = 'Following' | 'For You' | 'Entertainment' | 'Game' | 'Sport' | 'Audio';