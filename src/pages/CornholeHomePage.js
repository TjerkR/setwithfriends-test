import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import generate from "project-name-generator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CornholeHomePage() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");

  const createGame = () => {
    const id = generate({ words: 2 }).dashed;
    navigate(`/cornhole/${id}`);
  };

  const joinGame = () => {
    const id = gameId.trim();
    if (id) navigate(`/cornhole/${id}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cornhole Scoreboard
      </Typography>
      <Button variant="contained" onClick={createGame} sx={{ mr: 2 }}>
        Create Game
      </Button>
      <TextField
        label="Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        size="small"
        sx={{ mr: 1 }}
      />
      <Button variant="outlined" onClick={joinGame}>
        Join Game
      </Button>
    </Container>
  );
}

export default CornholeHomePage;
