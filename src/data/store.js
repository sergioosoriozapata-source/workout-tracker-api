// Almacén en memoria (EV09). En fases posteriores se reemplaza por MySQL (mysql2).
// Cada recurso tiene seed inicial + contador para simular auto-increment.

let userIdSeq = 3;
let workoutIdSeq = 3;
let exerciseIdSeq = 4;
let progressIdSeq = 3;

const users = [
  { id: 1, name: 'Ana Torres', email: 'ana@example.com', age: 24, goal: 'hipertrofia' },
  { id: 2, name: 'Carlos Ruiz', email: 'carlos@example.com', age: 30, goal: 'resistencia' },
];

const workouts = [
  { id: 1, userId: 1, name: 'Tren superior', date: '2026-09-10', durationMin: 60, level: 'intermedio' },
  { id: 2, userId: 2, name: 'Cardio + core', date: '2026-09-12', durationMin: 45, level: 'principiante' },
];

const exercises = [
  { id: 1, workoutId: 1, name: 'Press banca', sets: 4, reps: 10, muscleGroup: 'pecho' },
  { id: 2, workoutId: 1, name: 'Remo con barra', sets: 4, reps: 12, muscleGroup: 'espalda' },
  { id: 3, workoutId: 2, name: 'Plancha', sets: 3, reps: 60, muscleGroup: 'core' },
];

const progress = [
  { id: 1, userId: 1, workoutId: 1, date: '2026-09-11', weightKg: 68.5, notes: 'Buena técnica' },
  { id: 2, userId: 2, workoutId: 2, date: '2026-09-13', weightKg: 80.0, notes: 'Falta constancia cardio' },
];

module.exports = {
  users,
  workouts,
  exercises,
  progress,
  seq: {
    nextUserId: () => userIdSeq++,
    nextWorkoutId: () => workoutIdSeq++,
    nextExerciseId: () => exerciseIdSeq++,
    nextProgressId: () => progressIdSeq++,
  },
};
