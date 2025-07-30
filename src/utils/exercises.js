// Updated exercises.js with injury areas
const ExerciseData = {
    // Common aerial injury areas
    INJURY_AREAS: [
        "Hip Labrum",
        "Knee Meniscus", 
        "Tennis Elbow (Lateral Epicondylitis)",
        "Golfer's Elbow (Medial Epicondylitis)",
        "Shoulder Impingement",
        "Rotator Cuff",
        "Wrist Strain",
        "Lower Back",
        "Hip Flexors",
        "Ankle Sprain",
        "Neck Strain",
        "Forearm Tendonitis",
        "Rib Subluxation",
        "Thoracic Spine",
        "IT Band Syndrome",
        "Achilles Tendonitis",
        "Bicep Tendonitis",
        "Tricep Strain"
    ],

    // Default exercise library (like seed data)
    DEFAULT_EXERCISES: [
        {
            id: 1,
            name: "Gentle Hip Circles",
            description: "Lying on back, slowly circle leg in both directions",
            targetArea: "Hip Labrum",
            repRange: "10 each direction",
            completed: false
        },
        {
            id: 2,
            name: "Clamshells",
            description: "Side-lying, lift top knee while keeping feet together",
            targetArea: "Hip Labrum",
            repRange: "10-15 reps",
            completed: false
        },
        {
            id: 3,
            name: "Glute Bridges",
            description: "Lying on back, lift hips up gently",
            targetArea: "Hip/Knee Support",
            repRange: "10 reps, 5 sec hold",
            completed: false
        },
        {
            id: 4,
            name: "Straight Leg Raises",
            description: "Lying down, lift straight leg slowly",
            targetArea: "Knee Meniscus",
            repRange: "10 reps each leg",
            completed: false
        },
        {
            id: 5,
            name: "Heel Slides",
            description: "Lying down, slowly slide heel toward buttocks and back",
            targetArea: "Knee Meniscus",
            repRange: "10 reps",
            completed: false
        },
        {
            id: 6,
            name: "Gentle Cat-Cow Stretch",
            description: "On hands and knees, arch and round back gently",
            targetArea: "Overall Mobility",
            repRange: "10 movements",
            completed: false
        },
        {
            id: 7,
            name: "Seated Hip Flexor Stretch",
            description: "Seated, bring ankle to opposite knee, lean forward gently",
            targetArea: "Hip Labrum",
            repRange: "30 sec hold",
            completed: false
        },
        {
            id: 8,
            name: "Wall Sits (Modified)",
            description: "Back against wall, slide down slightly",
            targetArea: "Knee Support",
            repRange: "15-30 sec hold",
            completed: false
        }
    ],

    // Helper methods
    createNewExercise(name, description, targetArea, repRange) {
        return {
            id: Date.now(), // Simple ID generation
            name: name.trim(),
            description: description.trim(),
            targetArea: targetArea.trim(),
            repRange: repRange.trim(),
            completed: false
        };
    }
};

// Make available globally
window.ExerciseData = ExerciseData;
