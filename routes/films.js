
import express from "express";
import { films, seances, prochainId } from "../data.js";
import { validerId } from "../middlewares.js";

const router = express.Router();

router.get("/", (req, res) => {
    let resultat = films;

    if (req.query.genre) {
        resultat = resultat.filter(
            film => film.genre === req.query.genre
        );
    }

    if (req.query.tri === "duree") {
        resultat = [...resultat].sort(
            (a, b) => a.duree - b.duree
        );
    }

    res.json(resultat);
});

router.get("/:id", validerId, (req, res) => {
    const id = req.id;

    const film = films.find(f => f.id === id);

    if (!film) {
        return res.status(404).json({
            erreur: "Film introuvable"
        });
    }

    res.json(film);
});

router.get("/:id/seances", validerId, (req, res) => {
    const id = req.id;

    const film = films.find(f => f.id === id);

    if (!film) {
        return res.status(404).json({
            erreur: "Film introuvable"
        });
    }

    const resultat = seances.filter(
        seance => seance.filmId === id
    );

    res.json(resultat);
});

router.post("/", (req, res) => {
    const { titre, genre, duree } = req.body;

    if (
        typeof titre !== "string" ||
        !titre.trim() ||
        typeof genre !== "string" ||
        !genre.trim() ||
        typeof duree !== "number" ||
        !Number.isFinite(duree) ||
        duree <= 0
    ) {
        return res.status(400).json({
            erreur: "Titre, genre et durée valide sont obligatoires"
        });
    }

    const existe = films.find(
        film => film.titre.toLowerCase() === titre.trim().toLowerCase()
    );

    if (existe) {
        return res.status(409).json({
            erreur: "Ce film existe déjà"
        });
    }

    const nouveauFilm = {
        id: prochainId(films),
        titre: titre.trim(),
        genre: genre.trim(),
        duree
    };

    films.push(nouveauFilm);

    res.status(201).json(nouveauFilm);
});

router.delete("/:id", validerId, (req, res) => {
    const id = req.id;

    const index = films.findIndex(
        film => film.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erreur: "Film introuvable"
        });
    }

    const existeSeance = seances.some(
        seance => seance.filmId === id
    );

    if (existeSeance) {
        return res.status(409).json({
            erreur: "Impossible de supprimer ce film : il possède encore des séances"
        });
    }

    films.splice(index, 1);

    res.status(204).send();
});

export default router;
