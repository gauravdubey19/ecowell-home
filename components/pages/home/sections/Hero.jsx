"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/utils";
import { useNotification } from "@/context/NotificationProvider";
import { Button } from "@/components/ui/button";
import Carousel from "@/components/ui/carousel";

const Hero = () => {
  const router = useRouter();
  const { isNotificationOpen } = useNotification();

  // const backgrounds = [
  //   { type: "vid", src: "/assets/hero-banner-1.mp4" },
  //   { type: "img", src: "/assets/hero-banner-2.jpg" },
  //   { type: "img", src: "/assets/hero-banner-3.png" },
  //   { type: "img", src: "/assets/hero-banner-4.png" },
  // ];

  const handleShopNowBtn = () => router.push("/products");

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="group"
    >
      <div
        className={`w-full h-[30vh] sm:h-[60vh] md:h-[65vh] lg:h-[85vh] xl:h-[100vh] relative bg-transparent ${
          isNotificationOpen ? "mt-6" : "mt-0"
        } overflow-hidden`}
      >
        <div className="z-10 w-full h-full flex items-end justify-center pb-10 sm:pb-8 md:pb-12 lg:pb-20 2xl:pb-32">
          <div className="w-full md:max-w-3xl lg:max-w-4xl text-center grid items-center gap-4 md:gap-5 lg:gap-6">
            <motion.div
              variants={fadeIn("up", 0.3)}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold font-serif leading-10 text-white text-center text-balanc"
            >
              Redefining Wellness, One Scoop at a Time
            </motion.div>
            <motion.div variants={fadeIn("up", 0.5)}>
              <Button
                onClick={handleShopNowBtn}
                id="hero"
                variant="outline"
                effect="shine"
                className="btn-hover-fil rounded-full bg-white/30 backdrop-blur-md text-white font-semibold mt-2 px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3"
              >
                Shop Now
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 group-hover:scale-110 duration-500 ease-in-out overflow-hidden">
          <video
            src="/assets/hero-banner-1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* <Carousel
            autoplay={true}
            autoplaySpeed={8000}
            slidesToShow={1}
            slidesToShow560={1}
            slidesToShow680={1}
            slidesToShow970={1}
            slidesToShow1280={1}
            dots={false}
            arrows={false}
            className="w-full h-full flex-center overflow-hidden"
          >
            {backgrounds.map((bg, index) =>
              bg.type === "vid" ? (
                <video
                  key={index}
                  src={bg.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  key={index}
                  src={bg.src}
                  alt={`Hero background ${index + 1}`}
                  width={1920}
                  height={1080}
                  quality={100}
                  sizes="100vw"
                  priority={index === 0}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              )
            )}
          </Carousel> */}
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
