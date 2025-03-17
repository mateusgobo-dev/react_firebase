import './admin.css'

import {useEffect, useState} from "react";
import {auth, db} from "../../firebase";
import {signOut} from "firebase/auth";

import {
    addDoc,
    deleteDoc,
    updateDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where, doc
} from 'firebase/firestore';

export default function Admin() {
    const [tarefaInput, setTarefaInput] = useState("");
    const [tarefas, setTarefas] = useState([]);
    const [user, setUser] = useState({});
    const [editTarefa, setEditTarefa] = useState({});

    useEffect(() => {
        async function loadTarefas() {
            const userDetails = localStorage.getItem("userData");
            setUser(JSON.parse(userDetails));
            if (userDetails) {
                const data = JSON.parse(userDetails);
                const tarefaRef = collection(db, "tarefas");
                const q = query(tarefaRef, orderBy("date", "desc"), where("userUid", "==", data.uuid));
                onSnapshot(q, (snapshot) => {
                    let lista = [];
                    snapshot.forEach(doc => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })
                    setTarefas(lista);
                })
            }
        }

        loadTarefas();
    }, [])

    async function handleRegister(e) {
        e.preventDefault();
        if (tarefaInput === '') {
            alert("Digite sua tarefa");
        }

        if(editarTarefa?.id == null){

        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            date: new Date(),
            userUid: user?.uuid
        }).then((data) => {
            document.getElementById('tarefa').innerHTML = '';
            console.log(data);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function deleteTarefa(id) {
        const docRef = doc(db, "tarefas", id);
        await deleteDoc(docRef);
    }

    function editarTarefa(tarefa) {
        setEditTarefa(tarefa)
        document.getElementById('tarefa').innerHTML = editTarefa.tarefa;
    }

    async function atualizarTarefa(){
        handleUpdateTarefa;
        atualizarTarefa();
    }

    async function handleLogout() {
        await signOut(auth);
    }

    return (
        <div className="admin-container">
            <h1>Minhas tarefas</h1>
            <form className="form" onSubmit={handleRegister}>
                <textarea placeholder="Digite sua tarefa" id="tarefa"
                          onChange={(e) => setTarefaInput(e.target.value)}/>
                {Object.keys(editTarefa).length > 0 ? (
                            <button type="submit">Atualizar tarefa</button>
                        ) :  (<button type="submit" className="btn-register">Registrar tarefa</button>)}
            </form>
            {
                tarefas.map((item) => (
                    <article className="list" key={item.id}>
                        <p>{item.tarefa}</p>
                        <div>
                            <button onClick={() => editarTarefa(item)}>Editar</button>
                            <button className="btn-delete" onClick={() => deleteTarefa(item.id)}>Concluir</button>
                        </div>
                    </article>
                ))}
            <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
    )
}