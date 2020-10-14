import React from "react";
import { Redirect } from "react-router-dom";
import "./Home.css";

import Input from "@components/Input";
import Button from "@components/Button";

import { socket } from "@app/socket";

const GAME_CODE_REGEX = /\w{4}/;
const GAME_CODE_LENGTH = 4;
function isValidCode(code) {
  if (code.length !== GAME_CODE_LENGTH) {
    return false;
  }

  return GAME_CODE_REGEX.test(code);
}

const Home = () => {
  const [step, setStep] = React.useState("START");
  const [name, setName] = React.useState("");
  const [game, setGame] = React.useState("");
  const [join, setJoin] = React.useState(false);

  const [errors, setErrors] = React.useState({ name: "", game: "" });

  const onNameChange = (ev) => {
    setErrors((errors) => ({ ...errors, name: "" }));

    const val = ev.target.value;
    setName(val);
  };

  const onGameChange = (ev) => {
    setErrors((errors) => ({ ...errors, game: "" }));

    const val = ev.target.value;
    setGame(val);
  };

  const onClickBack = () => {
    setName("");
    setGame("");
    setStep("START");

    setErrors({ name: "", game: "" });
  };

  const onCreateGame = () => {
    let valid = true;
    if (!name) {
      setErrors((errors) => ({ ...errors, name: "Please enter a name!" }));
      valid = false;
    }

    if (valid) {
      const id = Math.random().toString(36).substring(2, 6).toUpperCase();
      setGame(id);
      setJoin(true);
      socket.emit("CREATE_GAME", { gameID: id });
      socket.emit("JOIN_GAME", { name, gameID: id });
    }
  };

  const onJoinGame = () => {
    let valid = true;
    if (!name) {
      setErrors((errors) => ({ ...errors, name: "Please enter a name!" }));
      valid = false;
    }
    if (!game) {
      setErrors((errors) => ({ ...errors, game: "Please enter a game code!" }));
      valid = false;
    }
    if (game && !isValidCode(game)) {
      setErrors((errors) => ({
        ...errors,
        game: "A game code should be 4 alphanumeric characters!",
      }));
      valid = false;
    }

    if (valid) {
      setJoin(true);
    }
  };

  if (join) {
    return <Redirect push to={`/${game}`} />;
  }

  const renderInner = () => {
    switch (step) {
      case "START":
        return (
          <>
            <Button onClick={() => setStep("CREATING")}>Create Game</Button>
            <Button onClick={() => setStep("JOINING")}>Join Game</Button>
          </>
        );
      case "CREATING":
        return (
          <>
            <Input
              type="text"
              id="create-name"
              label="Name:"
              value={name}
              onChange={onNameChange}
              error={errors.name}
            />
            <Button onClick={onClickBack}>Back</Button>
            <Button onClick={onCreateGame}>Create</Button>
          </>
        );
      case "JOINING":
        return (
          <>
            <Input
              type="text"
              id="join-name"
              label="Name:"
              value={name}
              onChange={onNameChange}
              error={errors.name}
            />
            <Input
              type="text"
              id="join-game"
              label="Game:"
              value={game}
              onChange={onGameChange}
              error={errors.game}
            />
            <Button onClick={onClickBack}>Back</Button>
            <Button onClick={onJoinGame}>Join</Button>
          </>
        );
      default:
        return <div>Something broke...</div>;
    }
  };

  return (
    <div className="Home-container">
      <h1>Welcome to Jackbox BR!</h1>
      {renderInner()}
    </div>
  );
};

export default Home;
