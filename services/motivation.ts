const LOCAL = [
    "¡Gran progreso!",
    "Pequeños pasos, grandes cambios",
    "Tu constancia paga dividendos",
    "Sigue así, hoy sumaste + 1",
    "Lo estas logrando día a día",
]

export async function getMotivation(name?: string, habitTitle?: string) {
    const endpoint = process.env.EXPO_PUBLIC
    if (!endpoint) return LOCAL[Math.floor(Math.random() * LOCAL.length)]

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, habitTitle })
        })

        if (!res.ok) throw new Error('Failed to get motivation')

        const data = await res.json()
        const text = (data?.message).toString()
        return text.slice(0, 120) || LOCAL[0]
    } catch (error) {
        console.warn(error)
        return LOCAL[Math.floor(Math.random() * LOCAL.length)]
    }
}
