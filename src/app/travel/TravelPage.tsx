"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";

import { travelData } from "@/data/travelData";
import styles from "./page.module.css";

export default function TravelPage() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className={styles.root}>
      <Swiper
        modules={[FreeMode, Mousewheel]}
        freeMode={{
          enabled: true,
          momentum: true,
          momentumRatio: 0.5,
          momentumBounce: false,
        }}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
          sensitivity: 1.5,
        }}
        slidesPerView="auto"
        spaceBetween={2}
        grabCursor
        speed={600}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        className={styles.swiper}
        loop={true}
      >
        {travelData.map((item, idx) => (
          <SwiperSlide key={idx} className={styles.slide}>
            <div className={styles.imgWrap}>
              <img
                src={item.image}
                alt={item.country}
                className={styles.img}
                loading={idx < 8 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
            <div className={styles.label}>
              <span className={styles.country}>{item.country}</span>
              <span className={styles.guide}>VIEW GUIDES</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
