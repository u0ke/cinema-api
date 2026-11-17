
import express from "express";
import { seances, films, prochainId, placesRestantes } from "../data.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { filmId, date, heure, salle, places } = req.body;

    if (
        !date ||
        !heure ||
        !salle ||
        !Number.isInteger(places) ||
        places < 1
    ) {
        return res.status(400).json({
            erreur: "Date, heure, salle et places valides sont obligatoires"
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
        date,
        heure,
        salle,
        places
    };

    seances.push(nouvelleSeance);

    res.status(201).json(nouvelleSeance);
});

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

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
