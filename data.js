
export const films = [
    { id: 1, titre: "Les Ailes du désir", duree: 128, genre: "drame" },
    { id: 2, titre: "Coco", duree: 105, genre: "animation" },
    { id: 3, titre: "Inception", duree: 148, genre: "science-fiction" }
];

export const seances = [
    { id: 1, filmId: 1, date: "2026-12-05", heure: "18:00", salle: "A", places: 40 },
    { id: 2, filmId: 2, date: "2026-12-05", heure: "14:00", salle: "B", places: 3 },
    { id: 3, filmId: 3, date: "2026-12-06", heure: "20:30", salle: "A", places: 40 }
];

export const reservations = [];

export function prochainId(liste) {
    if (liste.length === 0) {
        return 1;
    }

    return Math.max(...liste.map(item => item.id)) + 1;
}

export function placesRestantes(seance) {
    const reservees = reservations
        .filter(r => r.seanceId === seance.id)
        .reduce((total, r) => total + r.nbPlaces, 0);

    return seance.places - reservees;
}
