export type Suggestion = {
    id: string;
    title: string;
    subtitle?: string;
    emoji?: string;
    priority: "low" | "mid" | "high";
}

const CATALOG: Record<string, Omit<Suggestion, "id">> = {
    "energy-water": {
        "title": "Drink water",
        "subtitle": "205 ml",
        "emoji": "💧",
        "priority": "low"
    },
    "energy-walk": {
        "title": "Walk for 10 minutes",
        "subtitle": "Fresh air",
        "emoji": "🍃",
        "priority": "mid"
    },
    "energy-breathe": {
        "title": "Breathe for 1 minute",
        "subtitle": "4-7-8 technique",
        "emoji": "😮‍💨",
        "priority": "low"
    },
    "focus-reading": {
        "title": "Read for 10 minutes",
        "subtitle": "Relevant topic",
        "emoji": "📚",
        "priority": "low"
    },
    "focus-pomodoro": {
        "title": "Pomodoro 25",
        "subtitle": "1 deep block",
        "emoji": "🕑",
        "priority": "mid"
    },
    "focus-notification": {
        "title": "Silence for 1 hour",
        "subtitle": "Stay focused",
        "emoji": "🔕",
        "priority": "mid"
    }
}

export type CategoryKey = "energy" | "focus";

export async function suggestFor(category: CategoryKey) {
    await new Promise(resolve => setTimeout(resolve, 4000));
    const keys = Object.keys(CATALOG).filter((key) => key.startsWith(category));

    const suggestions = keys.map((key, index) => ({
        id: `${key} - ${index}`,
        ...CATALOG[key]
    }));
    return suggestions;
}

export async function suggestViaAI(
    category: CategoryKey,
    context: { habitsCount: number, profileName?: string }
) {
    const endpoint = process.env.EXPO_PUBLIC_AI_SUGGESTION_ENDPOINT;
    if (!endpoint) return suggestFor(category);

    try {
        const resp = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category,
                context
            })
        })
        if (!resp.ok) throw new Error("AI endpoint error");
        return (await resp.json()) as Suggestion[];
    } catch (error) {
        console.error("AI fallback", error);
        return suggestFor(category);
    }
}