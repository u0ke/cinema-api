
import express from "express";
import { reservations, seances, prochainId, placesRestantes } from "../data.js";
import { validerId } from "../middlewares.js";

const router = express.Router();

// POST create a reservation
router.post("/seances/:id/reservations", validerId, (req, res) => {
    const id = req.id;

    const nom = req.body.nom;
    const nbPlaces = req.body.nbPlaces;

    if (!nom || !nbPlaces || nbPlaces < 1 || nbPlaces > 10) {
        return res.status(400).json({
            erreur: "Nom et nombre de places entre 1 et 10 obligatoires"
        });
    }

    const seance = seances.find(seance => seance.id === id);

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
        nom: nom,
        nbPlaces: nbPlaces
    };

    reservations.push(nouvelleReservation);

    res.status(201).json(nouvelleReservation);
});

// GET reservations of a séance
router.get("/seances/:id/reservations", validerId, (req, res) => {
    const id = req.id;

    const seance = seances.find(seance => seance.id === id);

    if (!seance) {
        return res.status(404).json({
            erreur: "Séance introuvable"
        });
    }

    const resultat = reservations.filter(reservation => reservation.seanceId === id);

    res.json(resultat);
});

// DELETE a reservation
router.delete("/reservations/:id", validerId, (req, res) => {
    const id = req.id;

    const reservation = reservations.find(reservation => reservation.id === id);

    if (!reservation) {
        return res.status(404).json({
            erreur: "Réservation introuvable"
        });
    }

    const index = reservations.findIndex(reservation => reservation.id === id);

    reservations.splice(index, 1);

    res.status(204).send();
});

export default router;
