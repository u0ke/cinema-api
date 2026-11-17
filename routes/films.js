import express from "express";
import { films, seances } from "../data.js"

const router = express.Router();


router.get("/", (req, res) => {
    let resultat = films;

    if (req.query.genre) {
        resultat = resultat.filter(
            film => film.genre === req.query.genre
        );
    }

    res.json(resultat);
});


