import { cn } from "@/lib/utils";
import type { PhotoData } from "@/data/photos";

/** Подпись автора и лицензии — обязательна для фото с Wikimedia Commons. */
export function PhotoCredit({ photo, className }: { photo: PhotoData; className?: string }) {
  return (
    <span className={cn("rounded bg-black/45 px-1.5 py-0.5 text-[10px] leading-tight text-white/85 backdrop-blur-sm", className)}>
      Фото:{" "}
      <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
        {photo.author}
      </a>
      ,{" "}
      <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline-offset-2 hover:underline">
        {photo.license}
      </a>
    </span>
  );
}

type PhotoProps = {
  photo: PhotoData;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function Photo({ photo, className, imgClassName, sizes, priority = false }: PhotoProps) {
  return (
    <figure className={cn("relative overflow-hidden bg-muted", className)}>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-expect-error -- атрибут поддерживается браузерами, но отсутствует в типах React 18
        fetchpriority={priority ? "high" : undefined}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
      <figcaption className="absolute bottom-1.5 right-1.5">
        <PhotoCredit photo={photo} />
      </figcaption>
    </figure>
  );
}
