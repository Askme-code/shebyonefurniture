import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/image/sheby-logo.png"
      alt="Sheby One Furniture"
      width={150}
      height={35}
      className="object-contain dark:invert"
    />
  );
}
