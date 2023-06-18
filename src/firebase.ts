require('dotenv').config({path: "../.env"})
import {initializeApp} from "firebase/app";
import {child, get, getDatabase, ref, update,} from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT,
};


const app = initializeApp(firebaseConfig);

const adicionarTreino = async (userId: string, name: string) => {
  const db = getDatabase();
  const dbRef = ref(db);
  const newUserId = userId.slice(0, 12);
  await get(child(dbRef, `treinos/${newUserId}`))
    .then(async (snapshot: any) => {
      if (snapshot.exists()) {
        // @ts-ignore
        if (Number(snapshot.val().treinos_semanais < 5)) {
          const treinos =
              Number(snapshot.val().treinos) == undefined
                  ? 1
                  : Number(snapshot.val().treinos) + 1;
          const treinosSemanais =
              Number(snapshot.val().treinos_semanais) == undefined
                  ? 1
                  : Number(snapshot.val().treinos_semanais) + 1;
          await update(ref(db, `treinos/${newUserId}`), {
            treinos: treinos,
            nome: name,
            treinos_semanais: treinosSemanais,
            ultimo_treino: Date.now().toString(),
          });
        } else {
          const treinosSemanais =
              Number(snapshot.val().treinos_semanais) == undefined
                  ? 1
                  : Number(snapshot.val().treinos_semanais) + 1;
          await update(ref(db, `treinos/${newUserId}`), {
            nome: name,
            treinos_semanais: treinosSemanais,
            ultimo_treino: Date.now().toString(),
          });
        }
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

export const pegarQtdTreinosSemanais = async (userId: string) => {
  const db = getDatabase();
  const dbRef = ref(db);
  const newUserId = userId.slice(0, 12);
  const treinos = await get(child(dbRef, `treinos/${newUserId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const treinos = Number(snapshot.val().treinos_semanais);
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
        const dataArray: any = Object.entries(snapshot.val());
        dataArray.sort((a: any, b: any) => b[1].treinos - a[1].treinos);
        return Object.fromEntries(dataArray);
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

  console.log("Treinos semanais limpos.");
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
          console.log("Ainda não é outro dia.");
          return true;
        } else {
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

export async function addTreino(userName: string, quantidade: number) {
  const db = getDatabase();
  const dbRef = ref(db);
  const treinos = await get(child(dbRef, `treinos`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let treino: any;
          for (treino of Object.entries(snapshot.val())) {
            if(treino[1].nome == userName){
                update(ref(db, `treinos/${treino[0]}`), {
                    treinos: Number(treino[1].treinos) + quantidade,
                    treinos_semanais: Number(treino[1].treinos_semanais) + quantidade,
                    ultimo_treino: Date.now().toString(),
                });
            }
          }
          return snapshot.val();
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });


  return treinos;
}

export default adicionarTreino;
