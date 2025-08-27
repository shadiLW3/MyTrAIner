import { Exercise } from '../types/index.js';

export const EXERCISES: Exercise[] = [
  // CHEST
  { id: '1', name: 'Barbell Bench Press', category: 'chest', equipment: 'barbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'] },
  { id: '2', name: 'Incline Barbell Press', category: 'chest', equipment: 'barbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'] },
  { id: '3', name: 'Decline Barbell Press', category: 'chest', equipment: 'barbell', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'] },
  { id: '4', name: 'Dumbbell Bench Press', category: 'chest', equipment: 'dumbbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'] },
  { id: '5', name: 'Incline Dumbbell Press', category: 'chest', equipment: 'dumbbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'] },
  { id: '6', name: 'Decline Dumbbell Press', category: 'chest', equipment: 'dumbbell', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'] },
  { id: '7', name: 'Dumbbell Flyes', category: 'chest', equipment: 'dumbbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'] },
  { id: '8', name: 'Incline Dumbbell Flyes', category: 'chest', equipment: 'dumbbell', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'] },
  { id: '9', name: 'Cable Flyes', category: 'chest', equipment: 'cable', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'] },
  { id: '10', name: 'Cable Crossover', category: 'chest', equipment: 'cable', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'] },
  { id: '11', name: 'Low-to-High Cable Flyes', category: 'chest', equipment: 'cable', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'] },
  { id: '12', name: 'Push-ups', category: 'chest', equipment: 'bodyweight', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'] },
  { id: '13', name: 'Diamond Push-ups', category: 'chest', equipment: 'bodyweight', primaryMuscles: ['triceps', 'chest'] },
  { id: '14', name: 'Wide-Grip Push-ups', category: 'chest', equipment: 'bodyweight', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'] },
  { id: '15', name: 'Archer Push-ups', category: 'chest', equipment: 'bodyweight', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'] },
  { id: '16', name: 'Chest Dips', category: 'chest', equipment: 'bodyweight', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'] },
  { id: '17', name: 'Pec Deck Machine', category: 'chest', equipment: 'machine', primaryMuscles: ['chest'] },
  { id: '18', name: 'Chest Press Machine', category: 'chest', equipment: 'machine', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'] },
  { id: '19', name: 'Smith Machine Bench Press', category: 'chest', equipment: 'machine', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'] },
  { id: '20', name: 'Hammer Strength Chest Press', category: 'chest', equipment: 'machine', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'] },

  // BACK - LATS
  { id: '21', name: 'Pull-ups', category: 'back', equipment: 'bodyweight', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps', 'rear_delts'] },
  { id: '22', name: 'Chin-ups', category: 'back', equipment: 'bodyweight', primaryMuscles: ['lats', 'biceps'], secondaryMuscles: ['rhomboids'] },
  { id: '23', name: 'Wide-Grip Pull-ups', category: 'back', equipment: 'bodyweight', primaryMuscles: ['lats'], secondaryMuscles: ['rhomboids', 'rear_delts'] },
  { id: '24', name: 'Neutral-Grip Pull-ups', category: 'back', equipment: 'bodyweight', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps'] },
  { id: '25', name: 'Lat Pulldown', category: 'back', equipment: 'cable', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'rhomboids'] },
  { id: '26', name: 'Close-Grip Lat Pulldown', category: 'back', equipment: 'cable', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'] },
  { id: '27', name: 'Wide-Grip Lat Pulldown', category: 'back', equipment: 'cable', primaryMuscles: ['lats'], secondaryMuscles: ['rhomboids'] },
  { id: '28', name: 'Straight-Arm Pulldown', category: 'back', equipment: 'cable', primaryMuscles: ['lats'], secondaryMuscles: ['triceps'] },

  // BACK - ROWS/MID-BACK
  { id: '29', name: 'Barbell Row', category: 'back', equipment: 'barbell', primaryMuscles: ['rhomboids', 'lats'], secondaryMuscles: ['biceps', 'rear_delts'] },
  { id: '30', name: 'Pendlay Row', category: 'back', equipment: 'barbell', primaryMuscles: ['rhomboids', 'lats'], secondaryMuscles: ['biceps'] },
  { id: '31', name: 'Yates Row', category: 'back', equipment: 'barbell', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps'] },
  { id: '32', name: 'T-Bar Row', category: 'back', equipment: 'barbell', primaryMuscles: ['rhomboids', 'lats'], secondaryMuscles: ['biceps'] },
  { id: '33', name: 'Dumbbell Row', category: 'back', equipment: 'dumbbell', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps'] },
  { id: '34', name: 'Kroc Row', category: 'back', equipment: 'dumbbell', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps'] },
  { id: '35', name: 'Cable Row', category: 'back', equipment: 'cable', primaryMuscles: ['rhomboids', 'lats'], secondaryMuscles: ['biceps'] },
  { id: '36', name: 'Face Pulls', category: 'back', equipment: 'cable', primaryMuscles: ['rear_delts', 'rhomboids'], secondaryMuscles: ['traps'] },

  // BACK - LOWER/ERECTORS
  { id: '37', name: 'Deadlift', category: 'back', equipment: 'barbell', primaryMuscles: ['lower_back', 'glutes', 'hamstrings'], secondaryMuscles: ['traps', 'lats', 'quads'] },
  { id: '38', name: 'Sumo Deadlift', category: 'back', equipment: 'barbell', primaryMuscles: ['glutes', 'hamstrings', 'lower_back'], secondaryMuscles: ['quads', 'traps'] },
  { id: '39', name: 'Romanian Deadlift', category: 'back', equipment: 'barbell', primaryMuscles: ['hamstrings', 'glutes', 'lower_back'] },
  { id: '40', name: 'Stiff-Leg Deadlift', category: 'back', equipment: 'barbell', primaryMuscles: ['hamstrings', 'lower_back'], secondaryMuscles: ['glutes'] },
  { id: '41', name: 'Rack Pulls', category: 'back', equipment: 'barbell', primaryMuscles: ['lower_back', 'traps'], secondaryMuscles: ['lats', 'glutes'] },
  { id: '42', name: 'Good Mornings', category: 'back', equipment: 'barbell', primaryMuscles: ['lower_back', 'hamstrings'], secondaryMuscles: ['glutes'] },
  { id: '43', name: 'Back Extensions', category: 'back', equipment: 'bodyweight', primaryMuscles: ['lower_back'], secondaryMuscles: ['glutes', 'hamstrings'] },

  // SHOULDERS
  { id: '44', name: 'Overhead Press', category: 'shoulders', equipment: 'barbell', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps', 'traps'] },
  { id: '45', name: 'Push Press', category: 'shoulders', equipment: 'barbell', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps', 'traps'] },
  { id: '46', name: 'Dumbbell Shoulder Press', category: 'shoulders', equipment: 'dumbbell', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps'] },
  { id: '47', name: 'Arnold Press', category: 'shoulders', equipment: 'dumbbell', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps'] },
  { id: '48', name: 'Lateral Raises', category: 'shoulders', equipment: 'dumbbell', primaryMuscles: ['side_delts'] },
  { id: '49', name: 'Front Raises', category: 'shoulders', equipment: 'dumbbell', primaryMuscles: ['front_delts'] },
  { id: '50', name: 'Rear Delt Flyes', category: 'shoulders', equipment: 'dumbbell', primaryMuscles: ['rear_delts'] },
  { id: '51', name: 'Cable Lateral Raises', category: 'shoulders', equipment: 'cable', primaryMuscles: ['side_delts'] },
  { id: '52', name: 'Upright Row', category: 'shoulders', equipment: 'barbell', primaryMuscles: ['side_delts', 'traps'], secondaryMuscles: ['biceps'] },

  // BICEPS
  { id: '53', name: 'Barbell Curl', category: 'arms', equipment: 'barbell', primaryMuscles: ['biceps'] },
  { id: '54', name: 'EZ-Bar Curl', category: 'arms', equipment: 'barbell', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'] },
  { id: '55', name: 'Preacher Curl', category: 'arms', equipment: 'barbell', primaryMuscles: ['biceps'] },
  { id: '56', name: 'Dumbbell Curl', category: 'arms', equipment: 'dumbbell', primaryMuscles: ['biceps'] },
  { id: '57', name: 'Hammer Curl', category: 'arms', equipment: 'dumbbell', primaryMuscles: ['biceps', 'forearms'] },
  { id: '58', name: 'Incline Dumbbell Curl', category: 'arms', equipment: 'dumbbell', primaryMuscles: ['biceps'] },
  { id: '59', name: 'Concentration Curl', category: 'arms', equipment: 'dumbbell', primaryMuscles: ['biceps'] },
  { id: '60', name: 'Cable Curl', category: 'arms', equipment: 'cable', primaryMuscles: ['biceps'] },
  { id: '61', name: '21s', category: 'arms', equipment: 'barbell', primaryMuscles: ['biceps'] },

  // TRICEPS  
  { id: '62', name: 'Close-Grip Bench Press', category: 'arms', equipment: 'barbell', primaryMuscles: ['triceps'], secondaryMuscles: ['chest', 'front_delts'] },
  { id: '63', name: 'Overhead Tricep Extension', category: 'arms', equipment: 'dumbbell', primaryMuscles: ['triceps'] },
  { id: '64', name: 'Skullcrushers', category: 'arms', equipment: 'barbell', primaryMuscles: ['triceps'] },
  { id: '65', name: 'Tricep Dips', category: 'arms', equipment: 'bodyweight', primaryMuscles: ['triceps'], secondaryMuscles: ['chest', 'front_delts'] },
  { id: '66', name: 'Cable Tricep Pushdown', category: 'arms', equipment: 'cable', primaryMuscles: ['triceps'] },
  { id: '67', name: 'Rope Tricep Pushdown', category: 'arms', equipment: 'cable', primaryMuscles: ['triceps'] },
  { id: '68', name: 'Diamond Push-ups', category: 'arms', equipment: 'bodyweight', primaryMuscles: ['triceps'], secondaryMuscles: ['chest'] },

  // LEGS - QUADS
  { id: '69', name: 'Back Squat', category: 'legs', equipment: 'barbell', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings', 'lower_back'] },
  { id: '70', name: 'Front Squat', category: 'legs', equipment: 'barbell', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'abs'] },
  { id: '71', name: 'Box Squat', category: 'legs', equipment: 'barbell', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'] },
  { id: '72', name: 'Goblet Squat', category: 'legs', equipment: 'dumbbell', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['abs'] },
  { id: '73', name: 'Bulgarian Split Squat', category: 'legs', equipment: 'dumbbell', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'] },
  { id: '74', name: 'Lunges', category: 'legs', equipment: 'dumbbell', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'] },
  { id: '75', name: 'Walking Lunges', category: 'legs', equipment: 'dumbbell', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'] },
  { id: '76', name: 'Leg Press', category: 'legs', equipment: 'machine', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'hamstrings'] },
  { id: '77', name: 'Leg Extension', category: 'legs', equipment: 'machine', primaryMuscles: ['quads'] },
  { id: '78', name: 'Hack Squat', category: 'legs', equipment: 'machine', primaryMuscles: ['quads'], secondaryMuscles: ['glutes'] },

  // LEGS - HAMSTRINGS/GLUTES
  { id: '79', name: 'Leg Curl', category: 'legs', equipment: 'machine', primaryMuscles: ['hamstrings'] },
  { id: '80', name: 'Nordic Curls', category: 'legs', equipment: 'bodyweight', primaryMuscles: ['hamstrings'], secondaryMuscles: ['glutes'] },
  { id: '81', name: 'Hip Thrust', category: 'glutes', equipment: 'barbell', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'] },
  { id: '82', name: 'Glute Bridge', category: 'glutes', equipment: 'bodyweight', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'] },
  { id: '83', name: 'Cable Pull-through', category: 'glutes', equipment: 'cable', primaryMuscles: ['glutes', 'hamstrings'] },

  // CALVES
  { id: '84', name: 'Standing Calf Raise', category: 'legs', equipment: 'machine', primaryMuscles: ['calves'] },
  { id: '85', name: 'Seated Calf Raise', category: 'legs', equipment: 'machine', primaryMuscles: ['calves'] },
  { id: '86', name: 'Single-Leg Calf Raise', category: 'legs', equipment: 'bodyweight', primaryMuscles: ['calves'] },

  // ABS
  { id: '87', name: 'Plank', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs'], secondaryMuscles: ['obliques'] },
  { id: '88', name: 'Side Plank', category: 'core', equipment: 'bodyweight', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'] },
  { id: '89', name: 'Crunches', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs'] },
  { id: '90', name: 'Bicycle Crunches', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs', 'obliques'] },
  { id: '91', name: 'Russian Twists', category: 'core', equipment: 'bodyweight', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'] },
  { id: '92', name: 'Leg Raises', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs'], secondaryMuscles: ['hip_flexors'] },
  { id: '93', name: 'Hanging Knee Raises', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs'], secondaryMuscles: ['hip_flexors'] },
  { id: '94', name: 'Hanging Leg Raises', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs'], secondaryMuscles: ['hip_flexors'] },
  { id: '95', name: 'Ab Wheel', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs'], secondaryMuscles: ['obliques'] },
  { id: '96', name: 'Cable Crunches', category: 'core', equipment: 'cable', primaryMuscles: ['abs'] },
  { id: '97', name: 'Woodchoppers', category: 'core', equipment: 'cable', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'] },
  { id: '98', name: 'Pallof Press', category: 'core', equipment: 'cable', primaryMuscles: ['obliques', 'abs'] },
  { id: '99', name: 'Dead Bug', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs'] },
  { id: '100', name: 'Bird Dog', category: 'core', equipment: 'bodyweight', primaryMuscles: ['abs', 'lower_back'] },

  // OLYMPIC LIFTS
  { id: '101', name: 'Clean and Jerk', category: 'legs', equipment: 'barbell', primaryMuscles: ['quads', 'glutes', 'traps'], secondaryMuscles: ['front_delts', 'lower_back'] },
  { id: '102', name: 'Snatch', category: 'legs', equipment: 'barbell', primaryMuscles: ['quads', 'glutes', 'traps'], secondaryMuscles: ['front_delts', 'lower_back'] },
  { id: '103', name: 'Power Clean', category: 'legs', equipment: 'barbell', primaryMuscles: ['quads', 'glutes', 'traps'], secondaryMuscles: ['lower_back'] },
  { id: '104', name: 'Hang Clean', category: 'legs', equipment: 'barbell', primaryMuscles: ['traps', 'glutes'], secondaryMuscles: ['quads', 'lower_back'] },
  { id: '105', name: 'Clean Pull', category: 'legs', equipment: 'barbell', primaryMuscles: ['traps', 'glutes'], secondaryMuscles: ['quads', 'lower_back'] },

  // CROSSFIT/FUNCTIONAL
  { id: '106', name: 'Burpees', category: 'core', equipment: 'bodyweight', primaryMuscles: ['chest', 'quads'], secondaryMuscles: ['abs', 'front_delts'] },
  { id: '107', name: 'Box Jumps', category: 'legs', equipment: 'bodyweight', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['calves'] },
  { id: '108', name: 'Wall Balls', category: 'legs', equipment: 'machine', primaryMuscles: ['quads', 'front_delts'], secondaryMuscles: ['glutes', 'abs'] },
  { id: '109', name: 'Thrusters', category: 'legs', equipment: 'barbell', primaryMuscles: ['quads', 'front_delts'], secondaryMuscles: ['glutes', 'triceps'] },
  { id: '110', name: 'Man Makers', category: 'core', equipment: 'dumbbell', primaryMuscles: ['chest', 'lats'], secondaryMuscles: ['abs', 'front_delts'] },
  { id: '111', name: 'Muscle-ups', category: 'back', equipment: 'bodyweight', primaryMuscles: ['lats', 'chest'], secondaryMuscles: ['triceps', 'abs'] },
  { id: '112', name: 'Handstand Push-ups', category: 'shoulders', equipment: 'bodyweight', primaryMuscles: ['front_delts', 'triceps'], secondaryMuscles: ['traps'] },
  { id: '113', name: 'Pistol Squats', category: 'legs', equipment: 'bodyweight', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'abs'] },
  { id: '114', name: 'Turkish Get-ups', category: 'core', equipment: 'dumbbell', primaryMuscles: ['abs', 'front_delts'], secondaryMuscles: ['glutes', 'traps'] },
  { id: '115', name: 'Farmers Walk', category: 'core', equipment: 'dumbbell', primaryMuscles: ['traps', 'forearms'], secondaryMuscles: ['abs', 'obliques'] },

  // KETTLEBELL
  { id: '116', name: 'Kettlebell Swing', category: 'glutes', equipment: 'kettlebell', primaryMuscles: ['glutes', 'hamstrings'], secondaryMuscles: ['lower_back', 'abs'] },
  { id: '117', name: 'Kettlebell Goblet Squat', category: 'legs', equipment: 'kettlebell', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['abs'] },
  { id: '118', name: 'Kettlebell Clean', category: 'legs', equipment: 'kettlebell', primaryMuscles: ['glutes', 'traps'], secondaryMuscles: ['front_delts'] },
  { id: '119', name: 'Kettlebell Snatch', category: 'legs', equipment: 'kettlebell', primaryMuscles: ['glutes', 'front_delts'], secondaryMuscles: ['traps', 'abs'] },
  { id: '120', name: 'Kettlebell Turkish Get-up', category: 'core', equipment: 'kettlebell', primaryMuscles: ['abs', 'front_delts'], secondaryMuscles: ['glutes'] },
  { id: '121', name: 'Kettlebell Windmill', category: 'core', equipment: 'kettlebell', primaryMuscles: ['obliques'], secondaryMuscles: ['front_delts', 'hamstrings'] },

  // CARDIO EQUIPMENT
  { id: '122', name: 'Running', category: 'legs', equipment: 'bodyweight', primaryMuscles: ['quads', 'hamstrings', 'calves'], secondaryMuscles: ['glutes'] },
  { id: '123', name: 'Cycling', category: 'legs', equipment: 'machine', primaryMuscles: ['quads'], secondaryMuscles: ['hamstrings', 'calves', 'glutes'] },
  { id: '124', name: 'Rowing', category: 'back', equipment: 'machine', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['quads', 'hamstrings', 'biceps'] },
  { id: '125', name: 'Stairmaster', category: 'legs', equipment: 'machine', primaryMuscles: ['glutes', 'quads'], secondaryMuscles: ['hamstrings', 'calves'] },
  { id: '126', name: 'Elliptical', category: 'legs', equipment: 'machine', primaryMuscles: ['quads'], secondaryMuscles: ['hamstrings', 'glutes', 'calves'] },
  { id: '127', name: 'Assault Bike', category: 'legs', equipment: 'machine', primaryMuscles: ['quads'], secondaryMuscles: ['hamstrings', 'front_delts', 'biceps'] },
  { id: '128', name: 'Battle Ropes', category: 'shoulders', equipment: 'bodyweight', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['abs', 'lats'] },

  // BANDS/MOBILITY
  { id: '129', name: 'Band Pull-aparts', category: 'back', equipment: 'bands', primaryMuscles: ['rear_delts', 'rhomboids'] },
  { id: '130', name: 'Band Face Pulls', category: 'back', equipment: 'bands', primaryMuscles: ['rear_delts'], secondaryMuscles: ['rhomboids'] },
  { id: '131', name: 'Band Squats', category: 'legs', equipment: 'bands', primaryMuscles: ['quads', 'glutes'] },
  { id: '132', name: 'Band Leg Curls', category: 'legs', equipment: 'bands', primaryMuscles: ['hamstrings'] },
  { id: '133', name: 'Band Chest Flyes', category: 'chest', equipment: 'bands', primaryMuscles: ['chest'] },
  { id: '134', name: 'Band Rows', category: 'back', equipment: 'bands', primaryMuscles: ['lats', 'rhomboids'] },

  // SPECIALIZED/STRONGMAN
  { id: '135', name: 'Atlas Stones', category: 'back', equipment: 'machine', primaryMuscles: ['lower_back', 'glutes'], secondaryMuscles: ['quads', 'biceps'] },
  { id: '136', name: 'Tire Flips', category: 'legs', equipment: 'machine', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['lower_back', 'biceps'] },
  { id: '137', name: 'Sled Push', category: 'legs', equipment: 'machine', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['calves'] },
  { id: '138', name: 'Sled Pull', category: 'back', equipment: 'machine', primaryMuscles: ['quads', 'lats'], secondaryMuscles: ['glutes', 'biceps'] },
  { id: '139', name: 'Yoke Carry', category: 'core', equipment: 'machine', primaryMuscles: ['traps', 'abs'], secondaryMuscles: ['quads', 'glutes'] },
  { id: '140', name: 'Log Press', category: 'shoulders', equipment: 'machine', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps', 'traps'] }
];