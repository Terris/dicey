import { ReactNode, HTMLAttributes } from "react";
import styles from "./TextButton.module.scss";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
}

function TextButton({
  children,
  onClick,
  style,
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={`${styles["text-button"]} ${className} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default TextButton;
