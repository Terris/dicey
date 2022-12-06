import { InputHTMLAttributes } from "react";
import styles from "./TextInput.module.scss";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disabled?: boolean;
}

export default function Input({
  name,
  label,
  disabled,
  placeholder,
  type = "text",
  onChange,
  value,
  style,
}: TextInputProps) {
  return (
    <div className={styles["text-input-wrapper"]} style={style}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}

      <input
        type={type}
        id={name}
        name={name}
        className={`
          ${styles["text-input"]}
          ${disabled ? styles.disabled : null}
          ${label ? styles.hasLabel : null}
        `}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
