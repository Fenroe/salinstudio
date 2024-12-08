"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface PortfolioImageProps {
  src: string;
  index: number;
  top: number;
  left: number;
  onLoad: (index: number, height: number, width: number) => void;
  containerWidth: number;
  onClick: () => void;
  visible: boolean;
}

export const PortfolioImage = ({
  src,
  index,
  top,
  left,
  onLoad,
  containerWidth,
  onClick,
  visible,
}: PortfolioImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const [width, setWidth] = useState<number>(0);

  const [height, setHeight] = useState<number>(0);

  const [loaded, setLoaded] = useState(false);

  const [imageVisible, setImageVisible] = useState<boolean>(false);

  const getImageWidth = () => {
    if (!imageRef || !imageRef.current) return 0;
    const maxWidth = 1440 - 8 * 2;
    return (imageRef.current.naturalWidth / maxWidth) * 100;
  };

  const getImageCurrentWidth = () => {
    return (getImageWidth() * (containerWidth - 8 * 2)) / 100;
  };

  const getImageHeight = () => {
    if (!imageRef || !imageRef.current) return 0;
    const ratio =
      imageRef.current.naturalWidth / imageRef.current.naturalHeight;
    const currentWidth = getImageCurrentWidth();
    const height = currentWidth / ratio;
    return height;
  };

  const handleOnLoad = () => {
    if (!imageRef || !imageRef.current) return;
    onLoad(index, imageRef.current.height, imageRef.current.width);
  };

  const setImageDimensions = () => {
    setWidth(getImageCurrentWidth());
    setHeight(getImageHeight());
  };

  useEffect(() => {
    setWidth(getImageCurrentWidth());
    setHeight(getImageHeight());
    setLoaded(false);
  }, [containerWidth]);

  useEffect(() => {
    if (width !== 0 && height !== 0) {
      setLoaded(true);
    }
  }, [width, height]);

  useEffect(() => {
    if (loaded) {
      handleOnLoad();
    }
  }, [loaded]);

  useEffect(() => {
    if (visible) {
      setImageVisible(true);
    }
  }, [visible]);

  return (
    <button onClick={onClick}>
      <Image
        width={0}
        height={0}
        priority
        className="gallery-image"
        ref={imageRef}
        src={src}
        alt=""
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          opacity: imageVisible ? "1" : "0",
        }}
        onLoad={setImageDimensions}
      />
    </button>
  );
};
