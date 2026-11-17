
import express from "express";
import { films, seances, prochainId } from "../data.js";
import { validerId } from "../middlewares.js";

const router = express.Router();

// GET all films
router.get("/", (req, res) => {
    let resultat = films;

    if (req.query.genre) {
        resultat = films.filter(film => film.genre === req.query.genre);
    }

    if (req.query.tri === "duree") {
        resultat = resultat.sort((a, b) => a.duree - b.duree);
    }

    res.json(resultat);
});

// GET film by ID
router.get("/:id", validerId, (req, res) => {
    const id = req.id;

    const film = films.find(film => film.id === id);

    if (film) {
        res.json(film);
    } else {
        res.status(404).json({ erreur: "Film introuvable" });
    }
});

// GET séances of a film
router.get("/:id/seances", validerId, (req, res) => {
    const id = req.id;

    const film = films.find(film => film.id === id);

    if (!film) {
        return res.status(404).json({ erreur: "Film introuvable" });
    }

    const resultat = seances.filter(seance => seance.filmId === id);

    res.json(resultat);
});

// POST create a film
router.post("/", (req, res) => {
    const titre = req.body.titre;
    const genre = req.body.genre;
    const duree = req.body.duree;

    if (!titre || !genre || !duree || duree <= 0) {
        return res.status(400).json({ erreur: "Données invalides" });
    }

    const existe = films.find(film => film.titre === titre);

    if (existe) {
        return res.status(409).json({ erreur: "Ce film existe déjà" });
    }

    const nouveauFilm = {
        id: prochainId(films),
        titre: titre,
        genre: genre,
        duree: duree
    };

    films.push(nouveauFilm);

    res.status(201).json(nouveauFilm);
});

// DELETE film
router.delete("/:id", validerId, (req, res) => {
    const id = req.id;

    const film = films.find(film => film.id === id);

    if (!film) {
        return res.status(404).json({ erreur: "Film introuvable" });
    }

    const existeSeance = seances.find(seance => seance.filmId === id);

    if (existeSeance) {
        return res.status(409).json({
            erreur: "Impossible de supprimer ce film car il possède des séances"
        });
    }

    const index = films.findIndex(film => film.id === id);

    films.splice(index, 1);

    res.status(204).send();
});

export default router;
