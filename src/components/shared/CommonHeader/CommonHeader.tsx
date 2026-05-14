"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CommonHeaderProps {
  title: string;
  highlightText?: string;
  subtitle: string;
  className?: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  highlightText,
  subtitle,
  className = "",
}) => {
  const pathname = usePathname();
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment !== "")
    .slice(0, 2);

  return (
    <section
      className={`bg-gradient-to-b from-primary/5 to-transparent ${className}`}
    >
      <div className="route-container">
        <div className="max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={index}>
                <span className="text-base-content/20">/</span>
                <span
                  className={
                    index === pathSegments.length - 1
                      ? "text-secondary"
                      : "hover:text-primary transition-colors capitalize"
                  }
                >
                  {segment.replace(/-/g, " ")}
                </span>
              </React.Fragment>
            ))}
          </nav>

          <h1 className="text-2xl font-black text-base-content tracking-tight mb-4">
            {title}{" "}
            {highlightText && (
              <span className="text-primary">{highlightText}</span>
            )}
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-4 opacity-20"></div>
          <p className="text-sm text-base-content/60 font-medium leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CommonHeader;
