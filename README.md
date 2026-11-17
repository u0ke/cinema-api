# L’API de réservation d’un cinéma

# 🎬 CINEMA API — POSTMAN TEST GRID

**Base URL:** `http://localhost:3000`

**Start server:**
```bash
npm run dev
```

For POST requests: Postman → Body → raw → JSON.

---

## 1. FILMS

| # | Test | Method | Endpoint | Expected Code | OK | NO OK |
|---|---|---|---|---:|:---:|:---:|
| 1 | Get all films | GET | `/films` | 200 | ☐ | ☐ |
| 2 | Filter by genre | GET | `/films?genre=animation` | 200 | ☐ | ☐ |
| 3 | Sort by duration | GET | `/films?tri=duree` | 200 | ☐ | ☐ |
| 4 | Invalid film ID | GET | `/films/abc` | 400 | ☐ | ☐ |
| 5 | Film not found | GET | `/films/99` | 404 | ☐ | ☐ |
| 6 | Duplicate film | POST | `/films` | 409 | ☐ | ☐ |
| 7 | Invalid duration | POST | `/films` | 400 | ☐ | ☐ |
| 8 | Create film | POST | `/films` | 201 | ☐ | ☐ |
| 9 | Get film by ID | GET | `/films/4` | 200 | ☐ | ☐ |

### POST — Duplicate film

```json
{
  "titre": "Coco",
  "genre": "animation",
  "duree": 105
}
```

Expected: **409 Conflict**

### POST — Invalid duration

```json
{
  "titre": "Dune",
  "genre": "science-fiction",
  "duree": -5
}
```

Expected: **400 Bad Request**

### POST — Create film

```json
{
  "titre": "Dune",
  "genre": "science-fiction",
  "duree": 155
}
```

Expected: **201 Created**

---

## 2. SÉANCES

| # | Test | Method | Endpoint | Expected Code | OK | NO OK |
|---|---|---|---|---:|:---:|:---:|
| 10 | Invalid number of seats | POST | `/seances` | 400 | ☐ | ☐ |
| 11 | Create séance | POST | `/seances` | 201 | ☐ | ☐ |
| 12 | Invalid séance ID | GET | `/seances/abc` | 400 | ☐ | ☐ |
| 13 | Séance not found | GET | `/seances/99` | 404 | ☐ | ☐ |
| 14 | Get séance by ID | GET | `/seances/2` | 200 | ☐ | ☐ |
| 15 | Get film's séances | GET | `/films/4/seances` | 200 | ☐ | ☐ |

### POST — Invalid séance

```json
{
  "filmId": 4,
  "date": "2026-12-07",
  "heure": "21:00",
  "salle": "B",
  "places": 0
}
```

Expected: **400 Bad Request**

### POST — Create séance

```json
{
  "filmId": 4,
  "date": "2026-12-07",
  "heure": "21:00",
  "salle": "B",
  "places": 30
}
```

Expected: **201 Created**

---

## 3. RÉSERVATIONS

**Initial available seats for séance ID 2: 3**

| # | Test | Method | Endpoint | Expected Code | OK | NO OK |
|---|---|---|---|---:|:---:|:---:|
| 16 | Create reservation | POST | `/seances/2/reservations` | 201 | ☐ | ☐ |
| 17 | Not enough seats | POST | `/seances/2/reservations` | 409 | ☐ | ☐ |
| 18 | Invalid reservation | POST | `/seances/2/reservations` | 400 | ☐ | ☐ |
| 19 | Get reservations | GET | `/seances/2/reservations` | 200 | ☐ | ☐ |
| 20 | Invalid séance ID | GET | `/seances/abc/reservations` | 400 | ☐ | ☐ |
| 21 | Delete reservation | DELETE | `/reservations/1` | 204 | ☐ | ☐ |
| 22 | Verify deletion | GET | `/seances/2/reservations` | 200 | ☐ | ☐ |

### POST — Create reservation

```json
{
  "nom": "Amina",
  "nbPlaces": 2
}
```

Expected: **201 Created**

### POST — Not enough seats

```json
{
  "nom": "Karim",
  "nbPlaces": 2
}
```

Expected: **409 Conflict**

Only 1 seat remains after Amina's reservation.

### POST — Invalid reservation

```json
{
  "nom": "Karim",
  "nbPlaces": 12
}
```

Expected: **400 Bad Request**

---

## 4. HTTP RESPONSE CODES

| HTTP Code | Meaning | Expected result |
|---:|---|---|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Resource deleted |
| 400 | Bad Request | Invalid data or ID |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate or insufficient seats |

---

## TEST SUMMARY

| Section | Total Tests | Completed |
|---|---:|---|
| Films | 9 | ____ / 9 |
| Séances | 6 | ____ / 6 |
| Réservations | 7 | ____ / 7 |
| **TOTAL** | **22** | **____ / 22** |

**Note:** Execute the tests in order. The tests assume the initial in-memory data and that each POST request succeeds when marked as expected. Data is reset when the server restarts.
