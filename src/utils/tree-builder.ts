import { Categories } from "../generated/prisma/client.js";

export type CategoryNode = Categories & {
  children: CategoryNode[];
};

export class TreeBuilder {
  /**
   * Converts a flat list of categories into a tree.
   */
  static build(categories: Omit<CategoryNode, "children">[]): CategoryNode[] {
    const nodeMap = new Map<string, CategoryNode>();

    // Create all nodes first
    for (const category of categories) {
      nodeMap.set(category.id, {
        ...category,
        children: []
      });
    }

    const roots: CategoryNode[] = [];

    // Link children to their parents
    for (const node of nodeMap.values()) {
      if (node.parentId === null) {
        roots.push(node);
        continue;
      }

      const parent = nodeMap.get(node.parentId);

      if (parent) {
        parent.children.push(node);
      } else {
        // Parent doesn't exist, treat as root
        roots.push(node);
      }
    }

    return roots;
  }
  
}
