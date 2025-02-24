import React, {useEffect, useState} from 'react';
import {auth, db} from "../../firebase";
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";
import './home.css';

function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usuarioLogado, setUsuarioLogado] = useState(false);
    const [userDetails, setUserDetails] = useState({})

    async function novoUsuario() {
        await createUserWithEmailAndPassword(auth, email, password).then(() => {
            setEmail('');
            setPassword('');
            alert('Usuario cadastrado com sucesso')
        }).catch(err => {
            if (err.code === 'auth/weak-password') {
                alert('Senha muito fraca.')
            } else if (err.code === 'auth/email-already-in-use') {
                alert('Email já existe!')
            }
        })
    }

    async function logarUsuario() {
        await signInWithEmailAndPassword(auth, email, password).then((value) => {
            setUserDetails(value.user);
            setUsuarioLogado(true);
            setEmail('');
            setPassword('');
            alert('Login realizado com sucesso!')
        }).catch(err => {
            alert('Falha ao realizar login. Tente novamente.')
            console.log(err);
        })
    }

    async function logoutUser() {
        await signOut(auth);
        setUsuarioLogado(false);
        setEmail("");
        setPassword("");
    }

    return (
        <div className="home-container">
            <h1>Lista de tarefas</h1>
            <span>Gerencie suas tarefas de forma fácil</span>
            <form>
                <input type="email" placeholder="Digite um email" value={email}
                       onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Digite a senha" value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
                <input type="button" onClick={novoUsuario} value="Cadastrar"/><br/><br/>
                <button onClick={logarUsuario}>Autenticar Usuário</button>
            </form>
        </div>
    );
}

export default Home;