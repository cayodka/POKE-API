const pokeContainer = document.querySelector("#pokeContainer");
const pokemonCount = 90; 

// carregar os Pokémons salvos no localStorage
const loadSavedPokemons = () => {
    return JSON.parse(localStorage.getItem("pokemonsapi")) || {}; // Retorna um objeto vazio se não houver dados salvos
};

//salvar os Pokémons no localStorage
const savePokemonsToLocalStorage = (pokemons) => {
    localStorage.setItem("pokemonsapi", JSON.stringify(pokemons)); // Converte o objeto para JSON e armazena no localStorage
};

// Função principal que inicializa a busca dos Pokémons
const init = async () => {
    let savedPokemons = loadSavedPokemons(); // Carrega os Pokémons salvos
    let updatedPokemons = { ...savedPokemons }; // Cria uma cópia para atualizar
    
    for (let i = 1; i <= pokemonCount; i++) {
        let data = savedPokemons[i]; // Verifica se está salvo
        if (!data || !data.name) { // Se não estiver salvo, busca
            data = await pegaOsPokemons(i);
            updatedPokemons[i] = { name: data.name, id: data.id }; // Salva o nome e o ID
        }
        criarCardPokemon(data);
    }
    savePokemonsToLocalStorage(updatedPokemons);
};

//buscar os dados dos Pokémons
const pegaOsPokemons = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data; //
};

//criar o card do Pokémon
const criarCardPokemon = (poke) => {
    const savedPokemons = loadSavedPokemons();
    
    const card = document.createElement("div");
    card.className = "pokemon";

    const name = (savedPokemons[poke.id]?.name || poke.name || "Desconhecido").charAt(0).toUpperCase() + (savedPokemons[poke.id]?.name || poke.name || "").slice(1);
    const id = poke.id.toString().padStart(3, "0"); // addicona zeros a esquerda 
    
    const imgContainer = Object.assign(document.createElement("div"), { className: "imgContainer" });
    const img = Object.assign(document.createElement("img"), {
        src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`,
        alt: name
    });
    const info = Object.assign(document.createElement("div"), { className: "info" }); //informações
    const numberSpan = Object.assign(document.createElement("span"), { className: "number", textContent: id }); // ID
    const nameHeading = Object.assign(document.createElement("h3"), { className: "name", textContent: name }); // Nome 
    const editButton = Object.assign(document.createElement("button"), { className: "editar", textContent: "✏️" }); //edição
    
    // Adiciona evento ao botão de edição para permitir alterar o nome do Pokémon
    editButton.addEventListener("click", () => {
        const newName = prompt("Digite o novo nome:", name);
        if (newName) {
            savedPokemons[poke.id] = { ...savedPokemons[poke.id], name: newName };
            savePokemonsToLocalStorage(savedPokemons);
            nameHeading.textContent = newName;
        } 
    });
    
    imgContainer.appendChild(img);
    info.append(numberSpan, nameHeading, editButton);
    card.append(imgContainer, info);
    pokeContainer.appendChild(card);
};

init();
