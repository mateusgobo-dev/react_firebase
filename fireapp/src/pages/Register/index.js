import React, {useState} from 'react';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase";
import {Link, useNavigate} from "react-router-dom";

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function novoUsuario() {
        await createUserWithEmailAndPassword(auth, email, password).then(() => {
            setEmail('');
            setPassword('');
            navigate('/admin', { replace: true });
        }).catch(err => {
            if (err.code === 'auth/weak-password') {
                alert('Senha muito fraca.')
            } else if (err.code === 'auth/email-already-in-use') {
                alert('Email já existe!')
            }
        })
    }

    async  function handleRegister(e){
        e.preventDefault();
        if(email !== '' && password !== ''){
            await novoUsuario();
        }else{
            alert('Preencha todos os campos!')
            document.getElementById('email').focus();
        }
    }

    return (
        <div className="home-container">
            <h1>Cadastra-se</h1>
            <span>Vamos criar sua conta!</span>
            <form onSubmit={handleRegister}>
                <input type="email" id="email" placeholder="Digite um email" value={email}
                       onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" id="password" placeholder="Digite a senha" value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
                <button>Cadastrar Usuário</button>
                <Link to="/" className="button-link">Possui uma conta? Faça o Login</Link>
            </form>
        </div>
    );
}