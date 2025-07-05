import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Slider: React.FC = () => {
  const slides = [
    { id: 1, image: 'https://dkstatics-public.digikala.com/digikala-adservice-banners/8ae2cc7c57f8731c1aa7e7d31ea64c187cb63c9d_1742234352.jpg?x-oss-process=image/quality,q_95/format,webp', alt: 'Slide 1' },
    { id: 2, image: 'https://dkstatics-public.digikala.com/digikala-adservice-banners/fac4a224ddb368a6704398a677dae2b9d3bba9a6_1742435887.jpg?x-oss-process=image/quality,q_95/format,webp', alt: 'Slide 2' },
    { id: 3, image: 'https://dkstatics-public.digikala.com/digikala-adservice-banners/8474ab06517c5a4930f32a8b7cbbf74781f83afb_1742435700.jpg?x-oss-process=image/quality,q_95/format,webp', alt: 'Slide 3' },
  ];

  return (
      <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="my-8 h-80"
      >
        {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover rounded-lg" />
            </SwiperSlide>
        ))}
      </Swiper>
  );
};

export default Slider;