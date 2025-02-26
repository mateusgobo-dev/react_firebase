import React, {useState} from 'react';
import {auth} from "../../firebase";
import {signInWithEmailAndPassword, signOut} from "firebase/auth";
import './home.css';
import {Link, useNavigate} from "react-router-dom";

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    async function logarUsuario() {
        await signInWithEmailAndPassword(auth, email, password).then(() => {
            setEmail('');
            setPassword('');
            navigate('/admin', { replace: true });
        }).catch(err => {
            alert('Falha ao realizar login. Tente novamente.')
            console.log(err);
        })
    }

    async function logoutUser() {
        await signOut(auth);
        setEmail("");
        setPassword("");
    }

    async function handleLogin(e){
        e.preventDefault();
        if(email !== '' && password !== ''){
            await logarUsuario();
        }else{
            alert('Preencha todos os campos!')
            document.getElementById('email').focus();
        }
    }

    return (
        <div className="home-container">
            <h1>Lista de tarefas</h1>
            <span>Gerencie suas tarefas de forma fácil</span>
            <form onSubmit={handleLogin}>
                <input type="email" id="email" placeholder="Digite um email" value={email}
                       onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" id="password" placeholder="Digite a senha" value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
                <button>Autenticar Usuário</button>
                <Link to="/register" className="button-link">Não possui uma conta? Cadastra-se</Link>
            </form>
        </div>
    );
}