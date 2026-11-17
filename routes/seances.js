
import express from "express";
import {
    seances,
    films,
    prochainId,
    placesRestantes
} from "../data.js";
import { validerId } from "../middlewares.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { filmId, date, heure, salle, places } = req.body;

    if (
        !Number.isInteger(filmId) ||
        filmId <= 0 ||
        typeof date !== "string" ||
        !date.trim() ||
        typeof heure !== "string" ||
        !heure.trim() ||
        typeof salle !== "string" ||
        !salle.trim() ||
        !Number.isInteger(places) ||
        places < 1
    ) {
        return res.status(400).json({
            erreur: "FilmId, date, heure, salle et places valides sont obligatoires"
        });
    }

    const film = films.find(f => f.id === filmId);

    if (!film) {
        return res.status(404).json({
            erreur: "Film introuvable"
        });
    }

    const nouvelleSeance = {
        id: prochainId(seances),
        filmId,
        date: date.trim(),
        heure: heure.trim(),
        salle: salle.trim(),
        places
    };

    seances.push(nouvelleSeance);

    res.status(201).json(nouvelleSeance);
});

router.get("/:id", validerId, (req, res) => {
    const id = req.id;

    const seance = seances.find(s => s.id === id);

    if (!seance) {
        return res.status(404).json({
            erreur: "Séance introuvable"
        });
    }

    res.json({
        ...seance,
        placesRestantes: placesRestantes(seance)
    });
});

export default router;
