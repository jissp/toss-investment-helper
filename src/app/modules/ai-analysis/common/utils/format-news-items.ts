export function formatNewsItems(
    items: { title: string; description?: string }[],
): string {
    return items
        .map(
            ({ title, description }) => `- **${title}** \n${description ?? ''}`,
        )
        .join('\n');
}
