import type { CategoryDTO } from "@/features/warehouse/categories/category.dto";

interface CategoryOption {
  title: string;
  value: string;
  children?: CategoryOption[];
}

export function buildCategoryOptionsTree(
  categories: CategoryDTO[],
  excludeItem?: string
): CategoryOption[] {
  const categoryMap: Record<
    string,
    CategoryOption & { parentId?: string | null }
  > = {};
  const tree: CategoryOption[] = [];

  // Step 1: Map all categories to { label, value }
  categories
    .filter((item) => item._id !== excludeItem)
    .forEach((category) => {
      if (category._id) {
        categoryMap[category._id] = {
          title: category.name,
          value: category._id,
          parentId: category.parentId ?? null,
          children: [],
        };
      }
    });

  // Step 2: Build the tree
  Object.values(categoryMap).forEach((option) => {
    if (option.parentId && categoryMap[option.parentId]) {
      categoryMap[option.parentId].children!.push(option);
    } else {
      tree.push(option);
    }
  });

  // Step 3: Remove empty children arrays
  const cleanTree = (nodes: CategoryOption[]): CategoryOption[] => {
    return nodes.map(({ title, value, children }) => ({
      title,
      value,
      ...(children && children.length > 0
        ? { children: cleanTree(children) }
        : {}),
    }));
  };

  return cleanTree(tree);
}
