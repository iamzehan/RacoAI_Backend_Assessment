interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string | null;
}

interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string | null;
}

interface UpdateCategoryDto {
  id: string;
  name?: string;
  description?: string;
  parentId?: string | null;
}
