import Image from "next/image";
import React from "react";

const features = [
  {
    title: "Chemical Free",
    description: "Made without harmful chemicals",
    icon: "/assets/harmless/iconOne.svg",
    hoverIcon: "/assets/harmless/iconOneHover.svg",
  },
  {
    title: "Well Certified",
    description: "Meets highest standards",
    icon: "/assets/harmless/iconTwo.svg",
    hoverIcon: "/assets/harmless/iconTwoHover.svg",
  },
  {
    title: "Safety Tested",
    description: "Thoroughly tested for safety",
    icon: "/assets/harmless/iconThree.svg",
    hoverIcon: "/assets/harmless/iconThreeHover.svg",
  },
  {
    title: "No Preservatives",
    description: "Pure and natural formula",
    icon: "/assets/harmless/iconFour.svg",
    hoverIcon: "/assets/harmless/iconFourHover.svg",
  },
  {
    title: "No-GMO",
    description: "100% natural ingredients",
    icon: "/assets/harmless/iconFive.svg",
    hoverIcon: "/assets/harmless/iconFiveHover.svg",
  },
];

const SafetyProduct = () => {
  return (
    <div className="w-full h-full relative bg-[#F9F6F0] overflow-hidden">
      <div className="max-w-5xl mx-auto py-16 px-4 overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
          How Our Products Are Harmless!
        </h2>

        <div className="relative min-h-[200px]">
          <HexagonConnector />

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 relative z-10">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col items-center h-fit  ${
                  index % 2 === 1 ? "md:mt-[85px]" : "md:mt-[10px]"
                } `}
              >
                <div className="hex group">
                  <div className="hex2 relative w-full h-full flex-center overflow-hidden">
                    <div className="absolute inset-0 z-10 flex-center overflow-hidden">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={100}
                        height={100}
                        className="w-11 h-11 object-contain group-hover:opacity-0 ease-in-out duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 z-0 flex-center overflow-hidden">
                      <Image
                        src={feature.hoverIcon}
                        alt={feature.title}
                        width={100}
                        height={100}
                        className="w-11 h-16 object-contain opacity-0 group-hover:opacity-100 ease-in-out duration-300"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm md:text-md lg:text-lg font-semibold text-gray-800 text-center mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 text-center max-w-[120px]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyProduct;

const HexagonConnector = () => {
  return (
    <svg
      className="absolute left-0 right-0 w-full hidden md:block overflow-hidden"
      height="240"
      style={{
        top: "48%",
        transform: "translateY(-50%)",
        zIndex: 1,
        overflow: "visible",
      }}
    >
      <g>
        {/* Line from Chemical Free to Well Certified */}
        <line
          x1="11%"
          y1="26%"
          x2="30%"
          y2="75%"
          stroke="#385147"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
        {/* Line from Well Certified to Safety Tested */}
        <line
          x1="30%"
          y1="75%"
          x2="49%"
          y2="25%"
          stroke="#385147"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
        {/* Line from Safety Tested to No Preservatives */}
        <line
          x1="52%"
          y1="25%"
          x2="70.5%"
          y2="75%"
          stroke="#385147"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
        {/* Line from No Preservatives to No-GMO */}
        <line
          x1="71.5%"
          y1="73%"
          x2="89%"
          y2="25%"
          stroke="#385147"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
      </g>
    </svg>
  );
};
