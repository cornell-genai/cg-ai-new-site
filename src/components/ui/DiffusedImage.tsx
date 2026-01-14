import React from "react";
import Image from "next/image";

export const DiffusedImage = ({ src, alt = "Visual" }: { src: string, alt?: string }) => (
    <div className="relative w-full h-full overflow-hidden bg-[#121212]">
        {src.startsWith('/') ? (
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-all duration-1000 ease-out grayscale-[0.4] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
            />
        ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-all duration-1000 ease-out grayscale-[0.4] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000'; }}
            />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
    </div>
);
