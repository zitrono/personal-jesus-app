"use client";

import { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface DonationOption {
  id: string;
  title: string;
  description: string;
  amount: string;
  stripeLink: string;
  imageUrl: string;
  isRecurring?: boolean;
}

const donationOptions: DonationOption[] = [
  {
    id: "candle",
    title: "Prayer Candle",
    description: "Light a virtual candle for your intention—pick as many flames as you wish.",
    amount: "$2 each",
    stripeLink: "https://buy.stripe.com/aFa28s1hS5BP6qqa3xdby02",
    imageUrl: "/mobile-optimized/candles.jpg"
  },
  {
    id: "indulgence",
    title: "Indulgence",
    description: "A symbolic absolution—support the mission and feel forgiven.",
    amount: "$10",
    stripeLink: "https://buy.stripe.com/5kQ00kgcM0hv3eea3xdby03",
    imageUrl: "/mobile-optimized/indulgence.jpg"
  },
  {
    id: "bread",
    title: "Daily Bread Club",
    description: "A small monthly tithe that keeps the line open 24/7 for everyone.",
    amount: "$9.99/month",
    stripeLink: "https://buy.stripe.com/9B64gA7GgfcpbKKfnRdby04",
    imageUrl: "/mobile-optimized/bread.jpg",
    isRecurring: true
  },
  {
    id: "fish",
    title: "Loaves & Fish Gift", 
    description: "One-time boost that feeds the mission and sponsors free calls for others.",
    amount: "$29",
    stripeLink: "https://buy.stripe.com/6oU9AU0dO5BPdSSdfJdby05",
    imageUrl: "/mobile-optimized/fish gift.jpg"
  },
  {
    id: "patron",
    title: "Patron Saint Sponsorship",
    description: "High-impact monthly pledge sustaining long-term outreach and development.",
    amount: "$49/month",
    stripeLink: "https://buy.stripe.com/6oU14o7Gg9S50224Jddby06",
    imageUrl: "/mobile-optimized/heart.jpg",
    isRecurring: true
  }
];

export function DonationCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop on mount
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Handle carousel selection
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Handle thumbnail click
  const scrollToIndex = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  // Configure autoplay for desktop only
  const plugins = isDesktop 
    ? [
        Autoplay({
          delay: 4000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]
    : [];

  return (
    <div className="w-full space-y-4">
      <div className="px-4">
        <Carousel
          setApi={setApi}
          plugins={plugins}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {donationOptions.map((option) => (
            <CarouselItem key={option.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2 xl:basis-1/3">
              <div className="p-1">
                <div className="group relative overflow-hidden rounded-lg border border-[var(--divine-gold)]/30 
                              bg-black/50 backdrop-blur-sm transition-all duration-300
                              hover:border-[var(--divine-gold)] hover:shadow-[0_0_30px_rgba(var(--divine-gold-rgb),0.3)]
                              min-h-[420px] flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={option.imageUrl}
                      alt={option.title}
                      className="h-full w-full object-cover transition-transform duration-500
                               group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-20 p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-semibold text-[var(--divine-gold)]">
                          {option.title}
                        </h3>
                        {option.isRecurring && (
                          <span className="flex-shrink-0 text-xs px-2 py-1 rounded-full 
                                         bg-[var(--divine-gold)]/20 text-[var(--divine-gold)]
                                         border border-[var(--divine-gold)]/30">
                            Monthly
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-3">
                        {option.description}
                      </p>
                    </div>
                    
                    {/* Amount and Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-2xl font-bold text-white">
                        {option.amount}
                      </span>
                      <a
                        href={option.stripeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="divine-button-gilded relative z-10 px-4 py-2 text-sm font-semibold w-full sm:w-auto text-center"
                        onClick={(e) => {
                          // Track donation click if needed
                          console.log(`Donation clicked: ${option.title} - ${option.amount}`);
                        }}
                      >
                        Donate
                      </a>
                    </div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--divine-gold)]/10 
                                  via-transparent to-[var(--divine-gold)]/10" />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        </Carousel>
      </div>
      
      {/* Thumbnail Navigation */}
      <div className="hidden sm:block px-2">
        <div className="flex justify-center gap-2 overflow-x-auto pb-2 
                      scrollbar-thin scrollbar-thumb-[var(--divine-gold)]/30 
                      scrollbar-track-transparent">
          {donationOptions.map((option, index) => (
            <button
              key={option.id}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "relative flex-shrink-0 rounded-lg overflow-hidden",
                "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24",
                "border-2 transition-all duration-300",
                "hover:scale-105",
                selectedIndex === index
                  ? "border-[var(--divine-gold)] shadow-[0_0_20px_rgba(var(--divine-gold-rgb),0.5)]"
                  : "border-[var(--divine-gold)]/30 hover:border-[var(--divine-gold)]/60"
              )}
              aria-label={`Go to ${option.title}`}
            >
              <img
                src={option.imageUrl}
                alt={option.title}
                className="w-full h-full object-cover"
              />
              {/* Selected overlay */}
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-1">
                    <div className="text-[10px] font-semibold text-[var(--divine-gold)] text-center">
                      {option.amount}
                    </div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Scroll Indicator - now shows autoplay status */}
      <div className="flex justify-center gap-1 mt-2">
        <div className="text-xs text-gray-400 bg-black/30 px-3 py-1 rounded-full">
          {isDesktop ? "Auto-playing • Click thumbnails to navigate" : "Swipe for more options"}
        </div>
      </div>
    </div>
  );
}