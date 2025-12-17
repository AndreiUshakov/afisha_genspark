'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { CarouselBlockContent } from '@/lib/types/content-blocks'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Импорт стилей Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface CarouselBlockProps {
  content: CarouselBlockContent
}

export default function CarouselBlock({ content }: CarouselBlockProps) {
  if (!content.images || content.images.length === 0) {
    return null
  }

  const slidesPerView = content.slidesPerView || 4
  const slidesPerViewMobile = content.slidesPerViewMobile || 1

  return (
    <div className="w-full">
      <style jsx global>{`
        .carousel-swiper .swiper-button-next,
        .carousel-swiper .swiper-button-prev {
          color: #fff;
          background: rgba(0, 0, 0, 0.5);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .carousel-swiper .swiper-button-next:hover,
        .carousel-swiper .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        
        .carousel-swiper .swiper-button-next:after,
        .carousel-swiper .swiper-button-prev:after {
          font-size: 18px;
        }
        
        .carousel-swiper .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.5;
        }
        
        .carousel-swiper .swiper-pagination-bullet-active {
          background: #f97316;
          opacity: 1;
        }
        
        .dark .carousel-swiper .swiper-pagination-bullet {
          background: #d1d5db;
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={slidesPerViewMobile}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: Math.min(2, slidesPerView),
          },
          768: {
            slidesPerView: Math.min(3, slidesPerView),
          },
          1024: {
            slidesPerView: slidesPerView,
          },
        }}
        className="carousel-swiper"
      >
        {content.images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}