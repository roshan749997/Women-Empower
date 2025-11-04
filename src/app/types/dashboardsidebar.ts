export interface MenuSubItem {
  name: string;
  href: string;
}

export interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: MenuSubItem[];
}