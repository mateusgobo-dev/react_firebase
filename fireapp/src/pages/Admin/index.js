import './admin.css'

import {useState } from "react";
import {auth} from "../../firebase";
import {signOut} from "firebase/auth";

export default function Admin(){
    const[tarefaInput, setTarefaInput] = useState("");

    async function handleRegister(e) {
        e.preventDefault();
        alert('CLICOU');
    }

    async function handleLogout() {
        await signOut(auth);
    }

    return (
        <div className="admin-container">
            <h1>Minhas tarefas</h1>
            <form className="form" onSubmit={handleRegister}>
                <textarea placeholder="Digite sua tarefa"
                onChange={(e) => setTarefaInput(e.target.value)}/>
                <button type="submit" className="btn-register">Registrar tarefa</button>
            </form>
            <article className="list">
                <p>Estudar javascript e react</p>
                <div>
                    <button>Editar</button>
                    <button className="btn-delete">Concluir</button>
                </div>
            </article>
            <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
    )
}