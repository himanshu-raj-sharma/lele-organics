import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const auth = await verifyAuthToken(token);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: auth.userId,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            product: {
              include: {
                category: true,
                images: {
                  orderBy: {
                    sortOrder: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        cart: {
          id: null,
          items: [],
          totalItems: 0,
          subtotal: "0.00",
        },
      });
    }

    const totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const subtotal = cart.items.reduce(
      (total, item) =>
        total + Number(item.product.price) * item.quantity,
      0
    );

    return NextResponse.json({
      success: true,
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: item.product.price.toString(),
            stock: item.product.stock,
            weight: item.product.weight,
            weightUnit: item.product.weightUnit,
            category: {
              id: item.product.category.id,
              name: item.product.category.name,
              slug: item.product.category.slug,
            },
            images: item.product.images.map((image) => ({
              id: image.id,
              url: image.url,
              altText: image.altText,
              sortOrder: image.sortOrder,
              isPrimary: image.isPrimary,
            })),
          },
        })),
        totalItems,
        subtotal: subtotal.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Failed to fetch cart:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cart",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const auth = await verifyAuthToken(token);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId =
      typeof body.productId === "string" ? body.productId : "";

    const quantity =
      typeof body.quantity === "number" ? body.quantity : 1;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be a positive integer",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient stock",
        },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.upsert({
      where: {
        userId: auth.userId,
      },
      create: {
        userId: auth.userId,
      },
      update: {},
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            success: false,
            message: "Insufficient stock",
          },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    console.error("Failed to add product to cart:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product to cart",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const auth = await verifyAuthToken(token);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId =
      typeof body.productId === "string" ? body.productId : "";

    const quantity =
      typeof body.quantity === "number" ? body.quantity : 0;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be at least 1",
        },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: auth.userId,
      },
    });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
        },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is not in cart",
        },
        { status: 404 }
      );
    }

    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient stock",
        },
        { status: 400 }
      );
    }

    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cart quantity updated",
    });
  } catch (error) {
    console.error("Failed to update cart:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update cart",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const auth = await verifyAuthToken(token);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId =
      typeof body.productId === "string" ? body.productId : "";

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: auth.userId,
      },
    });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
        },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is not in cart",
        },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Failed to remove product from cart:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove product from cart",
      },
      { status: 500 }
    );
  }
}