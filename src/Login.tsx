import { AES, enc } from "crypto-js";
import { v4 as uuid } from "uuid";
import { FormEvent, useState } from "react";
import styles from "./Login.module.css";
import storage from "./storage";
import { userDataType } from "./types";

const PASSPHRASE_STORAGE_KEY = "passphrase";

type Props = {
  setUserData: (userData: userDataType) => void;
};

function Login({ setUserData }: Props) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [errorText, setErrorText] = useState<string>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const encryptedPassphrase = storage.get<string | undefined>(
      `${credentials.username}:${PASSPHRASE_STORAGE_KEY}`
    );

    if (!encryptedPassphrase) {
      const passphrase = uuid();
      storage.set(
        `${credentials.username}:${PASSPHRASE_STORAGE_KEY}`,
        AES.encrypt(passphrase, credentials.password).toString()
      );
      console.log({ credentials });
      setUserData({ username: credentials.username, passphrase: passphrase });
      return;
    }

    const passphrase = AES.decrypt(
      encryptedPassphrase,
      credentials.password
    ).toString(enc.Utf8);

    if (passphrase) {
      setUserData({ username: credentials.username, passphrase });
    } else {
      setErrorText("incorrect credentials");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <form className={styles.loginContainer} onSubmit={handleSubmit}>
        {errorText && <p>{errorText}</p>}
        <label htmlFor="username">
          <div className={styles.labelText}>Username</div>
          <input
            type="text"
            name="username"
            className={styles.textField}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
        </label>
        <label htmlFor="password">
          <div className={styles.labelText}>Password</div>
          <input
            type="password"
            name="password"
            className={styles.textField}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </label>
        <div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
