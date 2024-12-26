import Image from "next/image";
import { Button } from "./button";
import { useCart } from "@/context/CartProvider";

const ProductCardVertical = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1, product.variants[0]);
  };

  return (
    <div className="  group grid grid-cols-2 gap-2 bg-white hover:bg-[#BDC3C7] rounded-lg shadow-md border p-2 ease-in-out duration-300 overflow-hidden">
      <div className="absolute z-50 bg-primary-clr text-white text-xs font-bold px-2 py-1 rounded-tr-lg">
        {Math.round(product.discount)}% OFF
      </div>

      <div className="w-full h-[140px] relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 ease-in-out duration-300 overflow-hidden">
          <Image
            src={product.variants[0].images[0]}
            alt={product.title}
            width={400}
            height={400}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 ease-in-out duration-300 overflow-hidden">
          <Image
            src={product.variants[0].images[1]}
            alt={product.title}
            width={400}
            height={400}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="mt-1 w-full">
        <h3 className="text-sm font-bold">{product.title}</h3>

        <div className="w-fit flex items-center gap-1 text-xs my-2 bg-white px-1 py-0.5 rounded-sm">
          <span>⭐</span>
          <span>{product.ratings}</span>
          <span className="text-gray-500">
            ({(product.reviews_number / 1000).toFixed(1)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">₹{product.salePrice}/-</span>
          <span className="text-sm line-through text-gray-500">
            ₹{product.price}/-
          </span>
        </div>

        <Button
          size="sm"
          className="mt-4 w-full bg-primary-clr text-white py-2 rounded-md hover:bg-green-700 transition"
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCardVertical;
