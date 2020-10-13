import React from "react";
import { Redirect } from "react-router-dom";
import "./Home.css";

import Input from "../components/Input";
import Button from "../components/Button";

import { socket } from "../socket";

const ROOM_REGEX = /\w{4}/;
const ROOM_CODE_LENGTH = 4;
function isValidCode(code) {
  if (code.length !== ROOM_CODE_LENGTH) {
    return false;
  }

  return ROOM_REGEX.test(code);
}

const Home = () => {
  const [step, setStep] = React.useState("START");
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [join, setJoin] = React.useState(false);

  const [errors, setErrors] = React.useState({ name: "", room: "" });

  const onNameChange = (ev) => {
    setErrors((errors) => ({ ...errors, name: "" }));

    const val = ev.target.value;
    setName(val);
  };

  const onRoomChange = (ev) => {
    setErrors((errors) => ({ ...errors, room: "" }));

    const val = ev.target.value;
    setRoom(val);
  };

  const onClickBack = () => {
    setName("");
    setRoom("");
    setStep("START");

    setErrors({ name: "", room: "" });
  };

  const onCreateRoom = () => {
    socket.emit("create");
    let valid = true;
    if (!name) {
      setErrors((errors) => ({ ...errors, name: "Please enter a name!" }));
      valid = false;
    }

    if (valid) {
      const id = Math.random().toString(36).substring(2, 6).toUpperCase();
      setRoom(id);
      setJoin(true);
    }
  };

  const onJoinRoom = () => {
    let valid = true;
    if (!name) {
      setErrors((errors) => ({ ...errors, name: "Please enter a name!" }));
      valid = false;
    }
    if (!room) {
      setErrors((errors) => ({ ...errors, room: "Please enter a room code!" }));
      valid = false;
    }
    if (room && !isValidCode(room)) {
      setErrors((errors) => ({
        ...errors,
        room: "A room code should be 4 alphanumeric characters!",
      }));
      valid = false;
    }

    if (valid) {
      setJoin(true);
    }
  };

  if (join) {
    return <Redirect push to={`/${room}`} />;
  }

  const renderInner = () => {
    switch (step) {
      case "START":
        return (
          <>
            <Button onClick={() => setStep("CREATING")}>Create Room</Button>
            <Button onClick={() => setStep("JOINING")}>Join Room</Button>
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
            <Button onClick={onCreateRoom}>Create</Button>
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
              id="join-room"
              label="Room:"
              value={room}
              onChange={onRoomChange}
              error={errors.room}
            />
            <Button onClick={onClickBack}>Back</Button>
            <Button onClick={onJoinRoom}>Join</Button>
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
