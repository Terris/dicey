import { getRandomInt } from "../../utils";
import styles from "./Die.module.scss";

interface DieProps {
  value: number;
  onClick?: (value: number) => void;
  disabled?: boolean;
}

export default function Die({ value, onClick, disabled }: DieProps) {
  const randomPlusOrMinus = getRandomInt(0, 1) ? "" : "-";

  return (
    <div
      className={styles.die}
      style={{
        transform: `rotate(${randomPlusOrMinus}0.0${getRandomInt(0, 3)}turn)`,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={() => (!disabled && onClick ? onClick(value) : null)}
    >
      {value}
    </div>
  );
}
