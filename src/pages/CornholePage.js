import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../firebase";

function CornholePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const gameRef = firebase.database().ref(`cornholeGames/${id}`);

  useEffect(() => {
    const listener = gameRef.on("value", (snap) => {
      if (snap.exists()) {
        setGame(snap.val());
      } else {
        const data = {
          teamAName: "Team A",
          teamBName: "Team B",
          scoreA: 0,
          scoreB: 0,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        };
        gameRef.set(data);
      }
    });
    return () => gameRef.off("value", listener);
  }, [id]);

  if (!game) return null;

  const updateName = (team, value) => {
    const field = team === "A" ? "teamAName" : "teamBName";
    gameRef.child(field).set(value);
  };

  const changeScore = (team, delta) => {
    const field = team === "A" ? "scoreA" : "scoreB";
    gameRef.child(field).transaction((score) => {
      const newScore = (score || 0) + delta;
      return newScore < 0 ? 0 : newScore;
    });
  };

  const reset = () => {
    gameRef.update({ scoreA: 0, scoreB: 0 });
  };

  const winningScore = 21;
  const winner =
    game.scoreA >= winningScore
      ? game.teamAName
      : game.scoreB >= winningScore
      ? game.teamBName
      : null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cornhole Game: {id}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Team A"
            value={game.teamAName}
            onChange={(e) => updateName("A", e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <Typography variant="h3" align="center">
            {game.scoreA}
          </Typography>
          <Button
            variant="contained"
            onClick={() => changeScore("A", 1)}
            sx={{ mr: 1 }}
          >
            +1
          </Button>
          <Button variant="outlined" onClick={() => changeScore("A", -1)}>
            -1
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Team B"
            value={game.teamBName}
            onChange={(e) => updateName("B", e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <Typography variant="h3" align="center">
            {game.scoreB}
          </Typography>
          <Button
            variant="contained"
            onClick={() => changeScore("B", 1)}
            sx={{ mr: 1 }}
          >
            +1
          </Button>
          <Button variant="outlined" onClick={() => changeScore("B", -1)}>
            -1
          </Button>
        </Grid>
      </Grid>
      <Button onClick={reset} sx={{ mt: 2 }}>
        Reset Scores
      </Button>
      {winner && (
        <Typography variant="h5" align="center" sx={{ mt: 2 }}>
          {winner} wins!
        </Typography>
      )}
    </Container>
  );
}

export default CornholePage;
