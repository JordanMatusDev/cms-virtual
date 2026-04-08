export interface Course {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
  active?: boolean;
  author?: string;      
  videoCount?: number; 
  isNew?: boolean;
}

export interface CategoryRowProps {
  category: string;
  courses: Course[];
}