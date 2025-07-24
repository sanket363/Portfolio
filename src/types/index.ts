export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl?: string;
  ciCdBrief: string;
}
