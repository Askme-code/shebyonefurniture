import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/image/sheby-logo.png"
      alt="Sheby One Furniture"
      width={50}
      height={50}
      className="object-contain"
    />
  );
}
