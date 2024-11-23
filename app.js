// Importacion de las librerias express y axios
const express = require("express");
const axios = require("axios");
const path = require("path");

// creacion de la instancia de express
const app = express();
const apiUrl = "https://pokeapi.co/api/v2";

app.set("view engine", "ejs"); // Configure EJS como el motor de plantillas
app.set("views", path.join(__dirname, "views")); // Configuracion de la carpeta de vistas


app.get("/pokemon/:name", async (req, res) => {
  try {
    // Realiza la solicitud a la API de Pokémon
    const response = await axios.get(`${apiUrl}/pokemon/${req.params.name}`);
    const data = response.data;
   

    // Extrae y organiza los datos necesarios
    const pokemon = {
      nombre: data.name,
      habilidades: data.abilities.map((ability) => ({
        nombre: ability.ability.name,
        es_oculta: ability.is_hidden,
      })),
      estadisticas: data.stats.map((stat) => ({
        nombre: stat.stat.name,
        base: stat.base_stat,
      })),
      tipo: data.types.map((type) => type.type.name),
    };

    // Renderiza la vista "pokemon" y le pasa los datos organizados
    res.render("pag1", pokemon);
  } catch (error) {
    console.error("Error al obtener datos del Pokémon:", error);
    res.status(500).send("Error al obtener datos del Pokémon");
    console.log(response);
  }
});


app.get("/pokemon/color/:color", async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/pokemon-color/${req.params.color}`);
    const data = response.data;

    const pokemon = {
      nombre: data.name,  
      pokemonEspecies: data.pokemon_species.map(specie => ({
        nombre: specie.name
      }))
    };

    res.render("pag2", pokemon); // Enviando 'pokemon' como variable
  } catch (error) {
    res.status(500).json({ error: "Error al obtener Pokémon de color específico" });
  }
});


app.get("/ability/:name", async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/ability/${req.params.name}`);
    const data = response.data;

    const habilidad = {
      nombre: data.name,
      efecto: data.effect_entries.map(entry => ({
        idioma: entry.language.name,
        efecto: entry.effect,
      })),
      pokemon: data.pokemon.map(poke => poke.pokemon.name),
    };

    res.render("pag3", { habilidad });
  } catch (error) {
    console.error("Error al obtener datos de la habilidad:", error);
    res.status(500).json({ error: "Error al obtener datos de la habilidad" });
  }
});

app.get("/abilities", async (req, res) => {
  try {
    const { offset = 0, limit = 20 } = req.query; // Parámetros para la paginación
    const response = await axios.get(`${apiUrl}/ability?offset=${offset}&limit=${limit}`);
    const data = response.data;

    const habilidades = data.results.map(ability => ability.name);

    res.render("pag4", { habilidades, siguiente: data.next, anterior: data.previous });
  } catch (error) {
    console.error("Error al listar las habilidades:", error);
    res.status(500).json({ error: "Error al listar las habilidades" });
  }
});

app.get("/type/:name", async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/type/${req.params.name}`);
    const data = response.data;

    const tipo = {
      nombre: data.name,
      relaciones: {
        doble_dano_a: data.damage_relations.double_damage_to.map(type => type.name),
        medio_dano_de: data.damage_relations.half_damage_from.map(type => type.name),
        sin_efecto_a: data.damage_relations.no_damage_to.map(type => type.name),
      },
      pokemon: data.pokemon.map(poke => poke.pokemon.name),
    };

    res.render("pag5", { tipo });
  } catch (error) {
    console.error("Error al obtener datos del tipo:", error);
    res.status(500).json({ error: "Error al obtener datos del tipo" });
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
