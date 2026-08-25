import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: "ACTIVE",
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        sku: product.sku,
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice?.toString() ?? null,
        stock: product.stock,
        weight: product.weight,
        weightUnit: product.weightUnit,
        status: product.status,
        isFeatured: product.isFeatured,
        isBestseller: product.isBestseller,
        category: {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        },
        images: product.images.map((image) => ({
          id: image.id,
          url: image.url,
          altText: image.altText,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      { status: 500 },
    );
  }
}