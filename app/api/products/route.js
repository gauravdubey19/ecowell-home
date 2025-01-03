import { NextResponse } from "next/server";
import connectToMongoDB from "@/utils/db";
import Products from "@/models/Products";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    await connectToMongoDB();

    let query = {};
    if (category && category !== "All Products") {
      query = { "category.title": category };
    }

    let sortQuery = {};
    let useAggregation = false;
    if (sort) {
      switch (sort) {
        case "random-products":
          useAggregation = true;
          break;
        case "price-low-high":
          sortQuery = {
            $expr: {
              $cond: [
                { $ifNull: ["$salePrice", false] },
                "$salePrice",
                "$price",
              ],
            },
          };
          break;
        case "price-high-low":
          sortQuery = {
            $expr: {
              $multiply: [
                -1,
                {
                  $cond: [
                    { $ifNull: ["$salePrice", false] },
                    "$salePrice",
                    "$price",
                  ],
                },
              ],
            },
          };
          break;
        case "rating":
          sortQuery = { ratings: -1 };
          break;
        case "newest":
          query = { ...query, new: true };
          sortQuery = { createdAt: -1 };
          break;
        default:
          sortQuery = { createdAt: -1 };
      }
    }

    const skip = (page - 1) * limit;

    // First, get unique categories
    const categories = await Products.distinct("category.title");
    categories.unshift("All Products");

    const [products, totalCount] = await Promise.all([
      useAggregation
        ? Products.aggregate([
            { $match: query },
            { $sample: { size: limit } },
            {
              $project: {
                _id: 1,
                sku: 1,
                title: 1,
                new: 1,
                category: 1,
                brand: 1,
                price: 1,
                salePrice: 1,
                discount: 1,
                variants: { $slice: ["$variants", 1] },
                ratings: 1,
                reviews_number: 1,
              },
            },
          ])
        : Products.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .select({
              _id: 1,
              sku: 1,
              title: 1,
              new: 1,
              category: 1,
              brand: 1,
              price: 1,
              salePrice: 1,
              discount: 1,
              variants: { $slice: 1 },
              ratings: 1,
              reviews_number: 1,
            }),
      Products.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalProducts: totalCount,
      },
    });
  } catch (error) {
    console.error("Error in products API:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
