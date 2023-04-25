import { useState } from "react";
import Login from "./Login";
import Notes from "./Notes";
import { userDataType } from "./types";

type Props = {};

function App({}: Props) {
  const [userData, setUserData] = useState<userDataType>();

  return userData ? (
    <Notes userData={userData} />
  ) : (
    <Login setUserData={setUserData} />
  );
}

export default App;
