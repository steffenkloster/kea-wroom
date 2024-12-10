import React from "react";
import NearMe from "@/icons/near-me.svg";

const icons = {
  nearMe: NearMe
};

interface IconProps {
  name: keyof typeof icons;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  const IconComponent = icons[name];
  if (!IconComponent) {
    console.error(`Icon "${name}" not found.`);
    return null;
  }

  return <IconComponent width={size} height={size} className={className} />;
};

export default Icon;
