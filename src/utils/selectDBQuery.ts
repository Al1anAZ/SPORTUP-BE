import { Prisma } from "@prisma/client";

export const productSelectDBQuery = {
  id: true,
  name: true,
  slug: true,
  tag: true,
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

  variants: {
    select: {
      id: true,
      color: true,
      price: true,
      stock: true,
      images: {
        select: {
          url: true,
        },
      },
      size: {
        select: {
          value: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export const productReducedSelectDBQuery = {
  id: true,
  name: true,
  slug: true,

  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  variants: {
    select: {
      id: true,
      images: {
        select: {
          url: true,
        },
      },
      color: true,
      price: true,
      stock: true,
    },
  },
} satisfies Prisma.ProductSelect;


export const userSelectDBQuery = {
  email: true,
  name: true,
  avatarKey: true,
  address: true,
  phone: true,
  role: true
} satisfies Prisma.UserSelect;
