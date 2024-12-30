"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartProvider";
import { useWishlist } from "@/context/WishlistContext";
import { useNotification } from "@/context/NotificationProvider";
import { useDebounce } from "@/hooks/debounce";
import { fadeIn, staggerContainer } from "@/lib/utils";
import { links } from "@/constants/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ReactCountUp from "@/components/ui/countUp";
import Notification from "./Notification";
import { ImageIcon, List, LogOut, X } from "lucide-react";
import { CiHeart, CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";

const Navbar = ({ companyName }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems, noOfCartItems, totalPrice } = useCart();
  const { isNotificationOpen } = useNotification();
  const { wishlistProducts } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const heroSection = document.getElementById("hero");
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => observer.disconnect();
  }, [pathname]);

  const handleTrendingItemClick = useCallback((text) => {
    setSearchOpen(true);
    setSearchQuery(text);
  }, []);

  const isHomeScrolled = pathname === "/" ? isScrolled : true;

  const handleUserIconClick = () => {
    if (session && session?.user) {
      router.push("/account");
    } else {
      router.push("/auth/sign-in");
    }
  };

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="show"
      className="fixed top-0 left-0 right-0 w-screen z-40 backdrop-blur-md "
    >
      {isNotificationOpen && <Notification />}
      <div className="w-full flex justify-between items-center p-4 px-2 sm:px-4 md:px-8">
        <motion.div
          variants={fadeIn("down", 0.2)}
          className="text-lg font-bold"
        >
          <Link href="/">
            <Image
              src={"/logo.png"}
              alt={companyName || "Logo"}
              width={150}
              height={150}
            />
          </Link>
        </motion.div>
        <motion.div
          variants={fadeIn("down", 0.3)}
          className=" space-x-4 hidden md:flex"
        >
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.herf}
              className={`hover:text-gray-700 text-lg text-bold ${
                isHomeScrolled ? "text-black" : "text-white"
              } ease-in-out duration-300`}
            >
              {link.head}
            </Link>
          ))}
        </motion.div>
        <motion.div variants={fadeIn("down", 0.4)} className="flex space-x-4">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              <NavigationMenuItem className="hidden md:block cursor-pointer">
                <Search
                  isHomeScrolled={isHomeScrolled}
                  open={searchOpen}
                  setOpen={setSearchOpen}
                  initialQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/account/wishlist">
                  <div className="relative hidden sm:block">
                    <CiHeart
                      size={20}
                      className={`hover:text-gray-700 size-[30px] md:size-[20px] ${
                        isHomeScrolled ? "text-black" : "text-white"
                      } ease-in-out duration-300`}
                    />
                    {wishlistProducts.length > 0 && (
                      <div className="absolute -top-2.5 -right-2.5 text-xs text-white bg-[red] rounded-full px-1">
                        {wishlistProducts.length}
                      </div>
                    )}
                  </div>
                </Link>
              </NavigationMenuItem>
              {session && session?.user && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Link href="/account/cart">
                      <div className="relative">
                        {noOfCartItems > 0 && (
                          <div className="absolute -top-2.5 -right-2.5 text-xs text-white bg-[red] rounded-full px-1">
                            {noOfCartItems}
                          </div>
                        )}
                        <CiShoppingCart
                          size={20}
                          className={`hover:text-gray-700 ${
                            isHomeScrolled ? "text-black" : "text-white"
                          } ease-in-out duration-300 size-[30px] md:size-[20px]`}
                        />
                      </div>
                    </Link>
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 md:w-[400px] h-[250px] max-h-[280px] overflow-x-hidden overflow-y-scroll">
                      {cartItems &&
                        Array.isArray(cartItems) &&
                        cartItems.length > 0 &&
                        cartItems.map((item, index) => (
                          <HoverCartProductCard
                            key={index}
                            productDetails={item}
                          />
                        ))}
                    </div>
                    <hr />
                    <div className="space-y-2 p-4">
                      <div className="flex-between gap-4 font-semibold">
                        <span>Sub Total: </span>
                        <ReactCountUp
                          amt={totalPrice}
                          prefix="₹"
                          className="text-xl text-primary-clr"
                        />
                      </div>

                      <div className="flex-between gap-4 border-t pt-4">
                        <Link href="/account/cart">
                          <Button
                            size="sm"
                            effect="gooeyLeft"
                            className="bg-primary-clr text-white py-2 rounded-md hover:bg-green-700 transition"
                          >
                            View in Cart
                          </Button>
                        </Link>
                        <Link href="/account/cart/checkout">
                          <Button
                            size="sm"
                            effect="gooeyRight"
                            className="bg-primary-clr text-white py-2 rounded-md hover:bg-green-700 transition"
                          >
                            CHECK OUT
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}

              {/* user */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Link href="/account">
                    <CiUser
                      size={20}
                      className={`hover:text-gray-700 ${
                        isHomeScrolled ? "text-black" : "text-white"
                      } ease-in-out duration-300 cursor-pointer size-[30px] md:size-[20px] hidden sm:block`}
                      onClick={handleUserIconClick}
                    />
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-2 md:w-[200px]">
                    {session && session?.user && (
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/account"
                            className="flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted hover:bg-gray-200 hover:from-muted/50 hover:to-muted  px-4 py-[8px]"
                          >
                            <p className="text-sm leading-tight">Profile</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    )}
                    <li>
                      <Button
                        onClick={() => {
                          if (session && session?.user) signOut();
                          else router.push("/auth/sign-in");
                        }}
                        effect={
                          session && session?.user ? "shineHover" : "shine"
                        }
                        className="w-full bg-primary-clr hover:bg-green-700"
                      >
                        <LogOut size={20} />
                        {session && session?.user ? "Logout" : "Login"}
                      </Button>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Mobile */}
              <Sheet>
                <SheetTrigger className="md:hidden">
                  <List
                    size={20}
                    className={`hover:text-gray-700 ${
                      isHomeScrolled ? "text-black" : "text-white"
                    } ease-in-out duration-300 cursor-pointer size-[30px] md:size-[20px]`}
                  />
                </SheetTrigger>
                <SheetContent className="h-full">
                  <SheetTitle className="">Menu</SheetTitle>
                  <SheetDescription className="h-full p-4">
                    <motion.div
                      variants={fadeIn("down", 0.3)}
                      className=" h-full space-x-4 flex flex-col gap-4 items-center justify-center  "
                    >
                      {links.map((link, index) => (
                        <Link
                          key={index}
                          href={link.herf}
                          className={`hover:text-gray-700 text-lg text-bold text-black ease-in-out duration-300`}
                        >
                          {link.head}
                        </Link>
                      ))}
                      <div className="h-[1px] w-full bg-gray-300 "></div>
                      { session && session?.user && <Button
                        onClick={() => handleUserIconClick()}
                        variant="outline"
                        className="w-full justify-center gap-2 "
                      >
                        <CiUser size={20} color="black" />
                        User
                      </Button>}
                      { session && session?.user && <Button
                        onClick={() =>
                          session
                            ? router.push("/account/wishlist")
                            : router.push("/auth/sign-in")
                        }
                        variant="outline"
                        className="w-full justify-center gap-2 "
                      >
                        <CiHeart size={20} color="black" />
                        Wishlist
                      </Button>}

                      <div className="h-[1px] w-full bg-gray-300 mt-auto"></div>
                      <Button
                        onClick={() => {
                          if (session && session?.user) signOut();
                          else router.push("/auth/sign-in");
                        }}
                        effect={
                          session && session?.user ? "shineHover" : "shine"
                        }
                        className="w-full bg-primary-clr hover:bg-green-700"
                      >
                        <LogOut size={20} />
                        {session && session?.user ? "Logout" : "Login"}
                      </Button>
                    </motion.div>
                  </SheetDescription>
                </SheetContent>
              </Sheet>
            </NavigationMenuList>
          </NavigationMenu>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Navbar;

export function Search({
  isHomeScrolled,
  open,
  setOpen,
  initialQuery,
  setSearchQuery: setParentSearchQuery,
}) {
  const [searchQuery, setLocalSearchQuery] = useState(initialQuery || "");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const dialogRef = useRef(null);

  useEffect(() => {
    setLocalSearchQuery(initialQuery || "");
  }, [initialQuery]);

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setLocalSearchQuery(newValue);
    setParentSearchQuery(newValue);
  };

  useEffect(() => {
    async function searchProducts() {
      if (!debouncedSearch.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/products/search?query=${encodeURIComponent(debouncedSearch)}`
        );
        const data = await response.json();

        const sortedResults = data.sort((a, b) => {
          if (a.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
            return -1;
          if (b.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
            return 1;
          if (
            a.description.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
            return -1;
          if (
            b.description.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
            return 1;
          if (
            a.category.title
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase())
          )
            return -1;
          if (
            b.category.title
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase())
          )
            return 1;
          return 0;
        });

        setResults(sortedResults);
      } catch (error) {
        console.error("Error searching products:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    searchProducts();
  }, [debouncedSearch]);

  const handleClose = () => {
    setOpen(false);
    setLocalSearchQuery("");
    setParentSearchQuery("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-default">
        <CiSearch
          size={20}
          className={`hover:text-gray-700 size-[30px] md:size-[20px] cursor-default ${
            isHomeScrolled ? "text-black" : "text-white"
          } ease-in-out duration-300`}
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent
        className=" w-full h-full md:max-w-[600px] z-50"
        ref={dialogRef}
      >
        <DialogHeader>
          <DialogTitle className="text-left mb-4">Search Products</DialogTitle>
          <div className="relative">
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="mt-4 max-h-[60vh] rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 p-2">
              {results.map((product) => (
                <ProductNode
                  key={product._id}
                  productDetails={product}
                  onClose={handleClose}
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8 text-muted-foreground">
              No products found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Start typing to search for products
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

const HoverCartProductCard = ({ productDetails }) => {
  const { removeCartItem } = useCart();
  return (
    <div className="w-full h-fit">
      <Link
        href={`/prodcuts/${productDetails?.productId?.sku}`}
        className="w-full"
      >
        <div className="w-full h-fit group flex justify-between gap-7 rounded-md hover:shadow-sm hover:bg-gray-200 transition-transform duration-300 px-3">
          {productDetails?.variant && productDetails?.variant?.image_link ? (
            <div className="w-20 h-20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <Image
                src={productDetails?.variant?.image_link}
                alt={productDetails?.productId?.title}
                width={150}
                height={150}
              />
            </div>
          ) : (
            <ImageIcon width={100} height={150} />
          )}

          <div className="w-full flex-1 flex flex-col gap-1">
            <div className="w-full flex-1 flex flex-col gap-1">
              <h5 className="text-base font-semibold">
                {productDetails?.productId?.title}
              </h5>
              {/* <p className="text-base">chosedVariant</p> */}
            </div>

            <div className="w-fit flex flex-col gap-1">
              <h5 className="text-base font-semibold">Price</h5>
              <div className="flex flex-row gap-4 w-full items-center">
                <p className="flex-center gap-1">
                  <ReactCountUp
                    amt={
                      productDetails?.productId?.salePrice ||
                      productDetails?.productId?.price
                    }
                    prefix="₹"
                  />
                  X
                  <ReactCountUp amt={productDetails?.quantity} />
                </p>
              </div>
            </div>
          </div>

          <RxCross1
            onClick={() => removeCartItem(productDetails?.productId?._id)}
            title="Remove from cart"
            size={15}
            className="cursor-pointer hover:text-[red] mt-1.5 -mr-1.5 ease-in-out duration-500"
          />
        </div>
      </Link>
    </div>
  );
};

export const ProductNode = ({ productDetails, onClose }) => {
  const chosedVariant = productDetails?.variants[0];

  return (
    <div className="w-full h-fit">
      <Link
        href={`/products/${productDetails?.sku}`}
        onClick={onClose}
        className="w-full"
      >
        <div className="w-full h-fit group flex justify-between gap-3 hover:shadow-md transition-transform duration-300">
          {chosedVariant ? (
            <div className="w-20 h-20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <Image
                src={chosedVariant?.images[0]}
                alt={chosedVariant?.flavor}
                width={150}
                height={150}
              />
            </div>
          ) : (
            <ImageIcon src={""} alt={""} width={100} height={150} />
          )}
          <div className="w-full flex-1 flex flex-col gap-1">
            <h5 className="text-base font-semibold">{productDetails?.title}</h5>
            <p className="text-base">{chosedVariant?.flavor}</p>
          </div>

          <div className="w-fit flex flex-col gap-1">
            <h5 className="text-base font-semibold">Price</h5>
            <p className="text-base">
              <ReactCountUp
                amt={productDetails?.salePrice || productDetails?.price || 0}
                prefix="₹"
              />
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
