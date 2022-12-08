import { useGame } from "../../context/GameContext";
import { Player } from "../../types/types";
import { FaDice } from "react-icons/fa";

export default function PlayerScores() {
  const { game } = useGame();

  if (!game || game.status !== "IN_PROGRESS") return null;
  return (
    <>
      <p style={{ fontWeight: 700, paddingBottom: "6px" }}>Score Board</p>
      {game.players.map((player: Player) => (
        <div key={player.uid}>
          <p style={{ padding: "6px 0" }}>
            {game.currentTurn.player === player.uid && (
              <FaDice style={{ marginRight: "5px", color: "#d07650" }} />
            )}
            {player.name}
            {game.owner === player.uid && "*"}
          </p>
        </div>
      ))}
    </>
  );
}
