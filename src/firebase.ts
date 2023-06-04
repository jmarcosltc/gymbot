// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  child,
  get,
  getDatabase,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNgXYi03Ep9wczFYWn190uuD3FuB7N0RQ",
  authDomain: "gymbot-dm.firebaseapp.com",
  projectId: "gymbot-dm",
  storageBucket: "gymbot-dm.appspot.com",
  messagingSenderId: "723960606884",
  appId: "1:723960606884:web:914587884e2839c1817631",
  measurementId: "G-GM2XYWBMW9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const adicionarTreino = async (userId: string, name: string) => {
  const db = getDatabase();
  const dbRef = ref(db);
  const newUserId = userId.slice(0, 12);
  await get(child(dbRef, `treinos/${newUserId}`))
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const treinos =
          Number(snapshot.val().treinos) == undefined
            ? 1
            : Number(snapshot.val().treinos) + 1;
        const treinosSemanais =
          Number(snapshot.val().treinos_semanais) == undefined
            ? 1
            : Number(snapshot.val().treinos_semanais) + 1;
        update(ref(db, `treinos/${newUserId}`), {
          treinos: treinos,
          nome: name,
          treinos_semanais: treinosSemanais,
          ultimo_treino: Date.now().toString(),
        });
      } else {
        console.log("No data available");
        update(ref(db, `treinos/${newUserId}`), {
          treinos: 1,
          nome: name,
          treinos_semanais: 1,
          ultimo_treino: Date.now().toString(),
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const pegarQtdTreinos = async (userId: string) => {
  const db = getDatabase();
  const dbRef = ref(db);
  const newUserId = userId.slice(0, 12);
  const treinos = await get(child(dbRef, `treinos/${newUserId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const treinos = Number(snapshot.val().treinos);
        return treinos;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return treinos;
};

export const pegarTodosTreinos = async () => {
  const db = getDatabase();
  const dbRef = ref(db);
  const treinos = await get(child(dbRef, `treinos`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const treinos = snapshot.val();
        return treinos;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return treinos;
};

export const limparTreinosSemanais = async () => {
  const db = getDatabase();
  const dbRef = ref(db);
  const treinos = await get(child(dbRef, `treinos`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const treinos = snapshot.val();
        console.log(treinos);
        for (const [key, value] of Object.entries(treinos)) {
          console.log(`${key}: ${value}`);
          update(ref(db, `treinos/${key}`), {
            treinos_semanais: 0,
          });
        }
        return treinos;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return treinos;
};

export const jaTreinou = async (userId: string) => {
  const db = getDatabase();
  const dbRef = ref(db);
  const newUserId = userId.slice(0, 12);
  const treinos = await get(child(dbRef, `treinos/${newUserId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const timestamp: any = Number(snapshot.val().ultimo_treino);
        const date: Date = new Date(timestamp);
        const day: number = date.getDay();

        const todayDate: Date = new Date();
        const todayDay: number = todayDate.getDay();

        if (day == todayDay) {
          console.log("It is not another day");
          return true;
        } else {
          console.log("It is another day");
          return false;
        }

      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return treinos;
};

export default adicionarTreino;
