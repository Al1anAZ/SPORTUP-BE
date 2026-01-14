type ProductFilterOptionItem = {
  name: string;
  slug?: string;
  count: number;
};

export const toProductFilterOptions = <T>(
  items: T[],
  options: {
    name: (item: T) => string;
    count: (item: T) => number;
    slug?: (item: T) => string;
  }
): ProductFilterOptionItem[] => {
  return items
    .map((item) => ({
      name: options.name(item),
      slug: options.slug?.(item),
      count: options.count(item),
    }))
    .filter((item) => item.count > 0);
};
