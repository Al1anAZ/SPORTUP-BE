import { Prisma } from "@prisma/client";

export const productBySlugSelect = {
  id: true,
  name: true,
  slug: true,
  tags: true,
  description: true,

  brand: {
    select: {
      name: true,
      slug: true,
    },
  },

  category: {
    select: {
      name: true,
      slug: true,
    },
  },

  images: {
    select: {
      url: true,
      color: true,
    },
  },

  variants: {
    select: {
      id: true,
      color: true,
      price: true,
      stock: true,
      size: {
        select: {
          value: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export const userSelect = {
  email: true,
  name: true,
  avatarKey: true,
  address: true,
  phone: true,
} satisfies Prisma.UserSelect;

export const productWithPaginationAndFilter = {
  id: true,
  name: true,
  slug: true,

  category: {
    select: {
      name: true,
      slug: true,
    },
  },

  images: {
    select: {
      url: true,
      color: true,
    },
  },
  variants: {
    select: {
      color: true,
      price: true,
      stock: true,
    },
  },
} satisfies Prisma.ProductSelect;
