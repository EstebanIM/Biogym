import React from "react";
import clsx from "clsx"; // Para manejar las variantes y clases condicionales

export const Card = ({ className, variant = "default", children }) => {
  const variantStyles = clsx({
    "bg-gray-800 text-white": variant === "default",
    "bg-white text-gray-900": variant === "light",
  });

  return (
    <div className={clsx("rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105", variantStyles, className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => (
  <div className={clsx("p-4 flex flex-col items-center", className)}>
    {children}
  </div>
);

export const CardContent = ({ className, children }) => (
  <div className={clsx("p-4 text-center", className)}>{children}</div>
);

export const CardTitle = ({ className, children }) => (
  <h2 className={clsx("text-lg font-bold text-white", className)}>{children}</h2>
);

export const CardDescription = ({ className, children }) => (
  <p className={clsx("text-sm text-gray-400", className)}>{children}</p>
);
