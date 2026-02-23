export interface Course {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
  active?: boolean; 
}

export interface CategoryRowProps {
  category: string;
  courses: Course[];
}