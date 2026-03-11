export interface Course {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
  active?: boolean;
  author?: string;      // NUEVO
  videoCount?: number;  // NUEVO
}

export interface CategoryRowProps {
  category: string;
  courses: Course[];
}