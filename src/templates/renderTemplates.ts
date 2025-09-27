import fs from 'fs';
import path from 'path';

export const renderTemplate = (templateName: string, data: Record<string, string>): string => {
    const templatePath = path.join(__dirname, 'emails', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf8');

    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, value);
    }

    return template;
}
