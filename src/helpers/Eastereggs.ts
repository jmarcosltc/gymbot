export default function printWithChance(): boolean {
    const random = Math.random();

    return random <= 1 / 100;
}

export function botLoves(message: string): boolean {
    const loveWords: string[] = ["sexo", "cabeça", "pica", "pau", "italo"]

    return loveWords.includes(message.toLowerCase());

}