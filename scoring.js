// TeachWall - Teach Me Back Scoring Engine

const conceptChecklists = {
    pointers: {
        concepts: [
            {
                name: "Memory Address",
                keywords: [
                    "memory address",
                    "address of variable",
                    "memory location",
                    "location of variable",
                    "locationnode"
                ],
                weight: 20
            },
            {
                name: "Pointer Variable",
                keywords: [
                    "pointer",
                    "pointer variable",
                    "stores address",
                    "holds address"
                ],
                weight: 20
            },
            {
                name: "Address Operator",
                keywords: [
                    "& operator",
                    "address operator",
                    "ampersand",
                    "gets address"
                ],
                weight: 15
            },
            {
                name: "Dereferencing",
                keywords: [
                    "dereference",
                    "dereferencing",
                    "access value",
                    "gets value",
                    "access the value"
                ],
                weight: 25
            },
            {
                name: "Value Stored at Address",
                keywords: [
                    "value stored",
                    "value at address",
                    "stored value"
                ],
                weight: 20
            }
        ],

        misconceptions: [
            {
                keywords: [
                    "pointer stores the value"
                ],
                message:
                    "A pointer normally stores the memory address, not the actual value."
            },
            {
                keywords: [
                    "dereferencing gets the address"
                ],
                message:
                    "Dereferencing is used to access the value stored at the address."
            }
        ]
    }
};


function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s*&]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


function scoreExplanation(topic, text) {

    if (!conceptChecklists[topic]) {
        return {
            error: "Topic not available."
        };
    }

    const normalizedText = normalizeText(text);
    const topicData = conceptChecklists[topic];

    let score = 0;
    const understood = [];
    const missing = [];

    topicData.concepts.forEach(concept => {

        const found = concept.keywords.some(keyword =>
            normalizedText.includes(keyword.toLowerCase())
        );

        if (found) {
            score += concept.weight;
            understood.push(concept.name);
        } else {
            missing.push(concept.name);
        }
    });


    const misconceptions = [];

    topicData.misconceptions.forEach(item => {

        const found = item.keywords.some(keyword =>
            normalizedText.includes(keyword.toLowerCase())
        );

        if (found) {
            misconceptions.push(item.message);
        }
    });


    let level;

    if (score >= 80) {
        level = "Strong Understanding";
    } else if (score >= 60) {
        level = "Good Understanding";
    } else if (score >= 40) {
        level = "Partial Understanding";
    } else {
        level = "Needs Improvement";
    }


    let feedback;

    if (misconceptions.length > 0) {

        feedback =
            "Your explanation contains a possible misconception. Review the highlighted concept before continuing.";

    } else if (missing.length === 0) {

        feedback =
            "Excellent explanation! You covered the major concepts.";

    } else {

        feedback =
            "You understand some important parts, but try explaining the missing concepts: "
            + missing.join(", ") + ".";
    }


    return {
        score: score,
        level: level,
        understood: understood,
        missing: missing,
        misconceptions: misconceptions,
        feedback: feedback
    };
}


// Test explanation
const example = `
A pointer stores the memory address of another variable.
The & operator gets the address and dereferencing the pointer
allows us to access the value stored at that address.
`;

console.log(scoreExplanation("pointers", example));


// Export for backend
module.exports = {
    scoreExplanation
};
