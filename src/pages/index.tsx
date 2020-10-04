import { FormEvent, useEffect, useState } from "react";
import firebase from "firebase";
import { DataItemType, DataType } from "../type";
import { isValid, toNumber } from "../util";

const firebaseConfig = {
  apiKey: "AIzaSyD9oafee8GlSM-C-7R5v2Z6bxL_jfxowF8",
  authDomain: "firestore-type-test.firebaseapp.com",
  databaseURL: "https://firestore-type-test.firebaseio.com",
  projectId: "firestore-type-test",
  storageBucket: "firestore-type-test.appspot.com",
  messagingSenderId: "377802809919",
  appId: "1:377802809919:web:5d296d6072e292a687ce8a",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const converter = {
  toFirestore(user: DataItemType): firebase.firestore.DocumentData {
    return {
      name: user.name,
      age: user.age,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
    // ここにfirestoreのFieldの型を書く
  ): DataItemType {
    const data = snapshot.data(options)!;
    if (!isValid(data)) {
      console.error(data);
      alert("invalid data");
      throw new Error("invalid data");
    }
    return {
      name: data.name,
      age: data.age,
    };
  },
};

const db = firebase.firestore();

export default () => {
  const [state, setState] = useState<DataType | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    db.collection("user")
      .withConverter(converter)
      .get()
      .then((result) => {
        const data = result.docs.map((d) => ({
          name: d.data().name,
          age: d.data().age,
        }));
        setState(data);
      });
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPosting(true);
    const name = event.target["name"].value;
    const age = toNumber(event.target["age"].value);
    if (typeof name !== "string") throw new Error("invalid data type");
    db.collection("user")
      .withConverter(converter)
      .add({ name, age })
      .finally(() => {
        setPosting(false);
      });
  };
  return (
    <div>
      <h1>users</h1>
      {state
        ? state.map((s) => (
            <div>
              name: {s.name}/age: {s.age}
            </div>
          ))
        : "not data"}
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>name</label>
          <input name="name"></input>
        </fieldset>
        <fieldset>
          <label>age</label>
          <input name="age"></input>
        </fieldset>
        <button type="submit" disabled={posting}>
          {posting ? "loading" : "submit"}
        </button>
      </form>
    </div>
  );
};
