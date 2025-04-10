import type { CategoryDTO } from "@/features/warehouse/categories/category.dto";

export function buildCategoryTree(categories: CategoryDTO[]): CategoryDTO[] {
  const categoryMap: Record<string, CategoryDTO> = {};
  const tree: CategoryDTO[] = [];

  // First: map all categories by ID
  categories.forEach((category) => {
    if (category._id) {
      categoryMap[category._id] = { ...category, children: [] };
    }
  });

  // Then: build the tree
  categories.forEach((category) => {
    const id = category._id;
    const parentId = category.parentId;

    if (parentId && categoryMap[parentId]) {
      categoryMap[parentId].children!.push(categoryMap[id!]);
    } else {
      // Top-level node
      if (id) {
        tree.push(categoryMap[id]);
      }
    }
  });

  return tree;
}
