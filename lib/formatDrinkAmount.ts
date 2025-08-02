export function formatDrinkAmount(name: string, unit: 'ml' | 'oz'): string {
    const match = name.match(/\((\d+)\s*ml\)/);
    if (!match) return ''; // No amount in name

    const ml = parseInt(match[1], 10);
    if (unit === 'oz') {
        const oz = ml / 29.5735;
        return `(${oz.toFixed(1)} oz)`;
    }

    return `(${ml} ml)`;
}