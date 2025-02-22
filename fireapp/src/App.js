import './App.css';
import {db} from './firebase'
import {useEffect, useState} from "react";
import {addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc} from 'firebase/firestore'
import {auth} from './auth';

function App() {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[posts, setPosts] = useState([]);
    const[idPost, setIdPost] = useState('');

    useEffect(() => {
        async function loadPosts(){
            const unsub = await onSnapshot(collection(db, 'posts'), (snapshot) => {
                let list = [] ;
                snapshot.forEach((doc) => {
                    list.push({id: doc.id,
                        titulo: doc.data().titulo,
                        autor: doc.data().autor})
                });
                setPosts(list)
            });
        }
        loadPosts();
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
            let list = [] ;
            snapshot.forEach((doc) => {
                list.push({id: doc.id,
                    titulo: doc.data().titulo,
                    autor: doc.data().autor})
            });
            setPosts(list)
        }).catch(err => console.log`Erro ${err}`)
    }

    function loadDataForFields(post){
        setIdPost(post.id)
        setTitulo(post.titulo)
        setAutor(post.autor)
    }

    async function editarPost() {
        const post = doc(db, 'posts', idPost);
        await updateDoc(post, {
            titulo: titulo,
            autor: autor
        }).then(() =>{
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
            console.log("Usuario cadastrado com sucesso")
            setEmail('');
            setPassword('');
        }).catch(err => console`${err}`)
    }

  return (
    <div>
      React with firebase :)
        <div className="container">
            <label>Email:</label>
            <input type="email" placeholder="Digite um email" value={password} onChange={(e) => setEmail(e.target.value)}/>
            <label>Senha:</label>
            <input type="password" placeholder="Digite a senha" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="button" onClick={novoUsuario} value="Cadastrar" />
        </div>
        <br /><br />
        <hr />

        <div className="container">
            <label>ID do Post:</label>
            <input type="text" placeholder="ID do post" value={idPost} onChange={(e) => setIdPost(e.target.value)}/>
            <label>Título</label>
            <textarea type="text" placeholder="Digite o título" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>

            <label>Autor</label>
            <input type="text" placeholder="Autor do post" value={autor} onChange={(e) => setAutor(e.target.value)}/>

            <input type="button" onClick={handleAdd} value="Postar" />
            <input type="button" onClick={editarPost} value="Atualizar" />
            <ul>
                {
                    posts.map(item => (
                        <li key={item.id}>
                            <span><strong><a href="#" onClick={()=> loadDataForFields(item)}>ID: {item.id}</a></strong></span><br />
                            <span>Título: {item.titulo}</span><br />
                            <span>Autor: {item.autor}</span><br />
                            <button onClick={()=> excluirPost(item)}>Excluir</button><br /><br />
                        </li>
                    ))
                }
            </ul>
        </div>
    </div>
  );
}

export default App;
