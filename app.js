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

// Carregar horários disponíveis
async function carregarHorarios() {
    try {
        const horariosSnapshot = await getDocs(collection(db, "horarios"));
        listaHorarios.innerHTML = "";
        selectHorariosDisponiveis.innerHTML = "<option value=''>Selecione um horário</option>";

        horariosSnapshot.forEach((doc) => {
            const horario = doc.data();
            const li = document.createElement("li");
            li.textContent = `${horario.data} às ${horario.hora}`;
            li.dataset.id = doc.id;
            listaHorarios.appendChild(li);

            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = `${horario.data} às ${horario.hora}`;
            selectHorariosDisponiveis.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar horários:", error);
    }
}

// Adicionar horário disponível
formHorarios.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = document.getElementById("data-horario").value;
    const hora = document.getElementById("hora-horario").value;

    if (!data || !hora) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await addDoc(collection(db, "horarios"), { data, hora });
        formHorarios.reset();
        carregarHorarios();
        alert("Horário adicionado com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar horário:", error);
        alert("Erro ao adicionar horário.");
    }
});

// Agendar horário
formAgendamento.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idHorario = selectHorariosDisponiveis.value;
    const nomeCliente = document.getElementById("nome-cliente").value;

    if (!idHorario || !nomeCliente) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const horarioRef = doc(db, "horarios", idHorario);
        const horarioSnapshot = await getDocs(horarioRef);

        await addDoc(collection(db, "agendamentos"), {
            nome: nomeCliente,
            data: horarioSnapshot.data().data,
            hora: horarioSnapshot.data().hora,
        });

        await deleteDoc(horarioRef);
        formAgendamento.reset();
        carregarHorarios();
        alert("Agendamento realizado com sucesso!");
    } catch (error) {
        console.error("Erro ao agendar horário:", error);
        alert("Erro ao agendar horário.");
    }
});

// Carregar os horários ao iniciar
carregarHorarios();
