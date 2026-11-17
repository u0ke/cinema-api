
import express from "express";
import { seances, films, prochainId, placesRestantes } from "../data.js";
import { validerId } from "../middlewares.js";

const router = express.Router();

// POST create a séance
router.post("/", (req, res) => {
    const filmId = req.body.filmId;
    const date = req.body.date;
    const heure = req.body.heure;
    const salle = req.body.salle;
    const places = req.body.places;

    if (!filmId || !date || !heure || !salle || !places || places < 1) {
        return res.status(400).json({
            erreur: "Données invalides"
        });
    }

    const film = films.find(film => film.id === filmId);

    if (!film) {
        return res.status(404).json({
            erreur: "Film introuvable"
        });
    }

    const nouvelleSeance = {
        id: prochainId(seances),
        filmId: filmId,
        date: date,
        heure: heure,
        salle: salle,
        places: places
    };

    seances.push(nouvelleSeance);

    res.status(201).json(nouvelleSeance);
});

// GET séance by ID
router.get("/:id", validerId, (req, res) => {
    const id = req.id;

    const seance = seances.find(seance => seance.id === id);

    if (!seance) {
        return res.status(404).json({
            erreur: "Séance introuvable"
        });
    }

    const resultat = {
        id: seance.id,
        filmId: seance.filmId,
        date: seance.date,
        heure: seance.heure,
        salle: seance.salle,
        places: seance.places,
        placesRestantes: placesRestantes(seance)
    };

    res.json(resultat);
});

export default router;
