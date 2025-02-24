import React, {useEffect, useState} from 'react';
import {addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";

function Home() {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [posts, setPosts] = useState([]);
    const [idPost, setIdPost] = useState('');
    const [usuarioLogado, setUsuarioLogado] = useState(false);
    const [userDetails, setUserDetails] = useState({})

    useEffect(() => {
        async function loadPosts() {
            const unsub = await onSnapshot(collection(db, 'posts'), (snapshot) => {
                let list = [];
                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        titulo: doc.data().titulo,
                        autor: doc.data().autor
                    })
                });
                setPosts(list)
            });
        }

        loadPosts();
    }, []);

    useEffect(() => {
        async function checkLogin() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log(user);
                    setUsuarioLogado(true);
                    setUserDetails(user);
                } else {
                    console.log('User is not logged in');
                    setUserDetails({});
                    setUsuarioLogado(false);
                }
            })
        }

        checkLogin();
    }, []);

    async function handleAdd() {
        // await setDoc(doc(db, "posts", ),{
        //     titulo: titulo,
        //     autor: autor
        // }).then(() =>{
        //     console.log("DADOS GERADOS NO BANCO")
        // }).catch(err => console.log(`Gerou erro ${err}`))

        await addDoc(collection(db, "posts"), {
            titulo: titulo,
            autor: autor
        }).then(() => {
            console.log("DADOS GERADOS NO BANCO")
        }).catch(err => console.log(`Gerou erro ${err}`))
        setTitulo("");
        setAutor("");
    }

    async function searchItems() {
        //     const post = doc(db, 'posts', "2wF9veAk2aJehJLRoZ5C");
        //     await getDoc(post)
        //         .then((snapshot) => {
        //             setAutor(snapshot.data().autor)
        //             setTitulo(snapshot.data().titulo)
        //         }).catch(err => console.log`Erro ao buscar dados ${err}`)
        const post = collection(db, 'posts');
        await getDocs(post).then((snapshot) => {
            let list = [];
            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    titulo: doc.data().titulo,
                    autor: doc.data().autor
                })
            });
            setPosts(list)
        }).catch(err => console.log`Erro ${err}`)
    }

    function loadDataForFields(post) {
        setIdPost(post.id)
        setTitulo(post.titulo)
        setAutor(post.autor)
    }

    async function editarPost() {
        const post = doc(db, 'posts', idPost);
        await updateDoc(post, {
            titulo: titulo,
            autor: autor
        }).then(() => {
            setIdPost('');
            setTitulo('');
            setAutor('');
            searchItems();
        }).catch(err => console.log`Erro ${err}`);
    }

    async function excluirPost(item) {
        const post = doc(db, 'posts', item.id);
        await deleteDoc(post).then(() => {
            searchItems();
        }).catch(err => console.log(`Erro ${err}`));
    }

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
        <div>
            React with firebase :)
            {!usuarioLogado && (
                <div className="container">
                    <label>Email:</label>
                    <input type="email" placeholder="Digite um email" value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                    <label>Senha:</label>
                    <input type="password" placeholder="Digite a senha" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <input type="button" onClick={novoUsuario} value="Cadastrar"/><br/><br/>
                    <button onClick={logarUsuario}>Autenticar Usuário</button>
                </div>
            )}
            <br/><br/>
            <hr/>
            {usuarioLogado && (
                <div className="container">
                    <strong>Seja Bem Vindo! Você está logado....</strong><br/>
                    <strong>ID: {userDetails.uid} Email: {userDetails.email}<span style={{marginLeft: 20 + "px"}}><button
                        onClick={logoutUser}>Sair da conta</button></span></strong>
                    <label>ID do Post:</label>
                    <input type="text" placeholder="ID do post" value={idPost}
                           onChange={(e) => setIdPost(e.target.value)}/>
                    <label>Título</label>
                    <textarea type="text" placeholder="Digite o título" value={titulo}
                              onChange={(e) => setTitulo(e.target.value)}/>

                    <label>Autor</label>
                    <input type="text" placeholder="Autor do post" value={autor}
                           onChange={(e) => setAutor(e.target.value)}/>

                    <input type="button" onClick={handleAdd} value="Postar"/>
                    <input type="button" onClick={editarPost} value="Atualizar"/>
                    <ul>
                        {
                            posts.map(item => (
                                <li key={item.id}>
                                    <span><strong><a href="#"
                                                     onClick={() => loadDataForFields(item)}>ID: {item.id}</a></strong></span><br/>
                                    <span>Título: {item.titulo}</span><br/>
                                    <span>Autor: {item.autor}</span><br/>
                                    <button onClick={() => excluirPost(item)}>Excluir</button>
                                    <br/><br/>
                                </li>
                            ))
                        }
                    </ul>
                </div>)}
        </div>
    );
}

export default Home;