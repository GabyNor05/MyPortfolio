import React from "react";

// Full class names (not `bg-${colour}`) so Tailwind can actually generate them.
const styles = {
  primary: "bg-primary/15 text-primary hover:bg-primary hover:text-primary-content",
  secondary: "bg-secondary/15 text-secondary hover:bg-secondary hover:text-secondary-content",
  accent: "bg-accent/15 text-accent hover:bg-accent hover:text-accent-content",
};

const Button = ({ colour = "primary", icon, label, link, onClick, type = "button" }) => {
  const cls = `w-fit flex items-center gap-[6px] border-[0.5px] border-[var(--border-mid)] rounded-pill px-[14px] py-[6px] text-[12px] cursor-pointer transition-all duration-200 ${styles[colour] || styles.primary}`;
  if (link && !onClick) {
    return (
      <a className={cls} href={link} target="_blank" rel="noopener noreferrer">
        {icon}{label}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {icon}{label}
    </button>
  );
};

export default Button;
