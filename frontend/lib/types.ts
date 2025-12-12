export interface Event {
  id: string
  title: string
  description: string
  club: string
  category: string
  date: string
  time: string
  location: string
  image: string
  likes: number
  comments: number
  shares: number
}

export interface Club {
  id: string
  name: string
  description: string
  members: number
  category: string
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
}
