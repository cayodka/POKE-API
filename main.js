const pokeContainer = document.querySelector("#pokeContainer");
const pokemonCount = 90;

const loadSavedPokemons = () => {
    return JSON.parse(localStorage.getItem("pokemonsapi")) || {};
};

const savePokemonsToLocalStorage = (pokemons) => {
    localStorage.setItem("pokemonsapi", JSON.stringify(pokemons)); 
};

// Função busca dos Pokémons
const init = async () => {
    let savedPokemons = loadSavedPokemons();
    let updatedPokemons = { ...savedPokemons }; 
    
    for (let i = 1; i <= pokemonCount; i++) {
        let data = savedPokemons[i]; // Verifica se está salvo
        if (!data || !data.name) { // Se não estiver salvo, busca
            data = await pegaOsPokemons(i);
            // se fopi editado, deixa salvo
            updatedPokemons[i] = {
                name: savedPokemons[i]?.name || data.name,
                id: data.id
            };
        }
       criarCardPokemon(updatedPokemons[i]); 
    }
    savePokemonsToLocalStorage(updatedPokemons);
};

const pegaOsPokemons = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
};

const criarCardPokemon = (poke) => {
    const savedPokemons = loadSavedPokemons();
    
    const card = document.createElement("div");
    card.className = "pokemon";

    const name = (savedPokemons[poke.id]?.name || poke.name || "Desconhecido").charAt(0).toUpperCase() + (savedPokemons[poke.id]?.name || poke.name || "").slice(1);
    const id = poke.id.toString().padStart(3, "0"); // Adiciona zeros à esquerda
    
    const imgContainer = Object.assign(document.createElement("div"), { className: "imgContainer" });
    const img = Object.assign(document.createElement("img"), {
        src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`,
        alt: name
    });
    const info = Object.assign(document.createElement("div"), { className: "info" }); 
    const numberSpan = Object.assign(document.createElement("span"), { className: "number", textContent: id }); 
    const nameHeading = Object.assign(document.createElement("h3"), { className: "name", textContent: name }); 
    const editButton = Object.assign(document.createElement("button"), { className: "editar", textContent: "✏️" }); 
    
    //alterar o nome
    editButton.addEventListener("click", () => {
        const newName = prompt("Digite o novo nome:", name);
        if (newName) {
            let updatedPokemons = loadSavedPokemons(); // recarrega os dados
            updatedPokemons[poke.id] = { ...updatedPokemons[poke.id], name: newName };
            savePokemonsToLocalStorage(updatedPokemons); // Salva sem perder modificaçãp
            nameHeading.textContent = newName;
        } 
    });
    
    imgContainer.appendChild(img);
    info.append(numberSpan, nameHeading, editButton);
    card.append(imgContainer, info);
    pokeContainer.appendChild(card);
};

init();
