import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCOjYH8blLNQ7SB4jl7udSnMntHAKngDyc",
    authDomain: "fashiohcabelos.firebaseapp.com",
    projectId: "fashiohcabelos",
    storageBucket: "fashiohcabelos.firebasestorage.app",
    messagingSenderId: "219159959141",
    appId: "1:219159959141:web:3290a6d926022e3b3c188c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referências do DOM
const formHorarios = document.getElementById("form-horarios");
const listaHorarios = document.getElementById("lista-horarios");
const formAgendamento = document.getElementById("form-agendamento");
const selectHorariosDisponiveis = document.getElementById("horarios-disponiveis");

// Função para carregar os horários do Firestore
async function carregarHorarios() {
    try {
        const horariosSnapshot = await getDocs(collection(db, "horarios"));
        listaHorarios.innerHTML = ""; // Limpar lista
        selectHorariosDisponiveis.innerHTML = "<option value=''>Selecione um horário</option>"; // Limpar opções do select

        horariosSnapshot.forEach((doc) => {
            const horario = doc.data();
            const li = document.createElement("li");
            li.textContent = `${horario.data} às ${horario.hora}`;
            li.dataset.id = doc.id;

            // Botão para remover horário
            const btnRemover = document.createElement("button");
            btnRemover.textContent = "Remover";
            btnRemover.onclick = async () => {
                await deleteDoc(doc(db, "horarios", doc.id));
                carregarHorarios(); // Atualizar lista após remoção
            };

            li.appendChild(btnRemover);
            listaHorarios.appendChild(li);

            // Adicionar opção no dropdown
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = `${horario.data} às ${horario.hora}`;
            selectHorariosDisponiveis.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar horários:", error);
    }
}

// Função para adicionar um horário
formHorarios.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = document.getElementById("data-horario").value;
    const hora = document.getElementById("hora-horario").value;

    if (!data || !hora) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        await addDoc(collection(db, "horarios"), { data, hora });
        formHorarios.reset(); // Limpar formulário
        carregarHorarios(); // Atualizar lista e dropdown
        alert("Horário adicionado com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar horário:", error);
        alert("Erro ao adicionar horário. Verifique o console para mais informações.");
    }
});

// Função para agendar um horário
formAgendamento.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idHorario = selectHorariosDisponiveis.value;
    const nomeCliente = document.getElementById("nome-cliente").value;

    if (!idHorario || !nomeCliente) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const horarioRef = doc(db, "horarios", idHorario);
        const horarioSnapshot = await getDocs(horarioRef);

        if (horarioSnapshot.exists()) {
            const horarioData = horarioSnapshot.data();
            await addDoc(collection(db, "agendamentos"), {
                nome: nomeCliente,
                data: horarioData.data,
                hora: horarioData.hora,
            });
            await deleteDoc(horarioRef); // Remover horário após agendamento
            carregarHorarios(); // Atualizar lista e dropdown
            formAgendamento.reset();
            alert("Agendamento realizado com sucesso!");
        } else {
            alert("Horário não encontrado!");
        }
    } catch (error) {
        console.error("Erro ao agendar horário:", error);
        alert("Erro ao agendar horário. Verifique o console para mais informações.");
    }
});

// Carregar horários ao iniciar
carregarHorarios();
