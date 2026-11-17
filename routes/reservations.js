
import express from "express";
import { reservations, seances, prochainId, placesRestantes } from "../data.js";

const router = express.Router();

router.post("/seances/:id/reservations", (req, res) => {
    const id = Number(req.params.id);
    const { nom, nbPlaces } = req.body;

    if (
        !nom ||
        typeof nom !== "string" ||
        !nom.trim() ||
        !Number.isInteger(nbPlaces) ||
        nbPlaces < 1 ||
        nbPlaces > 10
    ) {
        return res.status(400).json({
            erreur: "Nom et nombre de places entre 1 et 10 obligatoires"
        });
    }

    const seance = seances.find(s => s.id === id);

    if (!seance) {
        return res.status(404).json({
            erreur: "Séance introuvable"
        });
    }

    if (nbPlaces > placesRestantes(seance)) {
        return res.status(409).json({
            erreur: "Pas assez de places disponibles"
        });
    }

    const nouvelleReservation = {
        id: prochainId(reservations),
        seanceId: id,
        nom: nom.trim(),
        nbPlaces
    };

    reservations.push(nouvelleReservation);

    res.status(201).json(nouvelleReservation);
});

router.get("/seances/:id/reservations", (req, res) => {
    const id = Number(req.params.id);

    const seance = seances.find(s => s.id === id);

    if (!seance) {
        return res.status(404).json({
            erreur: "Séance introuvable"
        });
    }

    const resultat = reservations.filter(
        r => r.seanceId === id
    );

    res.json(resultat);
});

router.delete("/reservations/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = reservations.findIndex(
        r => r.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erreur: "Réservation introuvable"
        });
    }

    reservations.splice(index, 1);

    res.status(204).send();
});

export default router;
