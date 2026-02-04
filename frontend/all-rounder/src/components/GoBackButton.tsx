'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface GoBackButtonProps {
  label?: string;
  href?: string;
  className?: string;
  variant?: 'ghost' | 'solid';
}

export default function GoBackButton({
  label = "Go Back",
  href,
  className = "",
  variant = 'ghost'
}: GoBackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  const baseStyles = "flex items-center gap-2 px-4 py-2 transition-all rounded-lg font-medium";
  const variants = {
    ghost: "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20",
    solid: "bg-[#8387CC] text-white hover:bg-[#4169E1] transition-colors"
  };

  return (
    <button
      onClick={handleBack}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
