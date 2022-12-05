import { HTMLAttributes } from "react";
import styles from "./Button.module.scss";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  primary?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

function Button({
  title,
  onClick,
  primary,
  disabled,
  style,
  type = "submit",
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${primary ? styles.primary : null} ${
        disabled ? styles.disabled : null
      }`}
      onClick={onClick}
      style={style}
      type={type}
      disabled={disabled}
    >
      {title}
    </button>
  );
}

export default Button;
