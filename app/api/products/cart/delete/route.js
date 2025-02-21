import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectToMongoDB from "@/utils/db";
import Cart from "@/models/Cart";

export async function DELETE(request) {
  const { userId, cartItemId } = await request.json();

  // console.log("userId:", userId, cartItemId);

  try {
    await connectToMongoDB();

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "_id title sku salePrice price variants",
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found", status: 404 });
    }

    const cartItem = cart.items.id(cartItemId);

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found", status: 404 });
    }

    const productName = cartItem?.productId?.title;
    const productVariantFlavor = cartItem.variant.flavor;

    // Remove cart item
    cart.items.pull(cartItemId);

    // Calculate new totals using reduce
    const totals = cart.items.reduce(
      (acc, item) => {
        const price = item.productId.salePrice || item.productId.price;
        return {
          totalQuantity: acc.totalQuantity + item.quantity,
          totalPrice: acc.totalPrice + price * item.quantity,
        };
      },
      { totalQuantity: 0, totalPrice: 0 }
    );

    cart.totalQuantity = totals.totalQuantity;
    cart.totalPrice = totals.totalPrice;

    await cart.save();

    const updatedCart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        select: "_id title sku salePrice price variants",
      })
      .sort({ ["createdAt"]: "desc" })
      .lean();

    // console.log(updatedCart);

    const message =
      productVariantFlavor === "none"
        ? `Removed ${productName} from your cart!`
        : `Removed ${productName} of variant ${productVariantFlavor} from your cart!`;
    revalidatePath(request.url);
    return NextResponse.json({
      message: message,
      status: 200,
      updatedCart,
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json({
      error: "Failed to delete cart item",
      status: 500,
    });
  }
}
