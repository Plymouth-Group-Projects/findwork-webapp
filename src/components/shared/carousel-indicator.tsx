import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Circle } from "lucide-react";
import { CarouselApi } from "@/components/ui/carousel";

interface CarouselIndicatorProps {
  api?: CarouselApi;
  itemCount: number;
  activeIndex: number;
  onIndicatorClick: (index: number) => void;
}

const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({
  api,
  itemCount,
  activeIndex,
  onIndicatorClick,
}) => {
  // Create an array of the required length
  const items = Array.from({ length: itemCount }, (_, i) => i);

  return (
    <Pagination className="flex justify-center mt-5 mb-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => api?.scrollPrev()}
            className="cursor-pointer hover:text-lightest"
          />
        </PaginationItem>

        {items.map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => onIndicatorClick(index)}
              isActive={activeIndex === index}
              className="cursor-pointer border-none"
            >
              <Circle
                className={`scale-75 ${activeIndex === index ? "fill-white" : ""}`}
              />
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => api?.scrollNext()}
            className="cursor-pointer hover:text-lightest"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CarouselIndicator;
