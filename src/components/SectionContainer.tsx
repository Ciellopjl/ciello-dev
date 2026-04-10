"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionContainer({
  children,
  className,
  id,
}: SectionContainerProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn("py-32 px-6 max-w-7xl mx-auto", className)}
    >
      {children}
    </motion.section>
  );
}
