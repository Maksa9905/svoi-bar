import Image from "next/image";
import styles from "./CoverImage.module.css";

type CoverImageProps = {
  src: string;
  alt: string;
  height?: number;
  priority?: boolean;
  sizes: string;
  className?: string;
};

export function CoverImage({ src, alt, height, priority, sizes, className }: CoverImageProps) {
  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(" ")}
      style={height ? { height } : undefined}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={styles.image} />
    </div>
  );
}
