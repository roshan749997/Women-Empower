// types/category.ts
export interface Category {
  id: string;
  name: string;
  image: string;
}

export type ModalType = "create" | "edit" | "view";

export interface CategoryFormData {
  name: string;
  image: string | File;
}
