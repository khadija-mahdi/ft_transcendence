export function Empty(text) {
    const container = document.createElement('div');
    container.className = 'emptyContainer';

    const image = document.createElement('img');
    image.src = '/src/lib/empty.svg';
    image.alt = 'empty';
    image.width = 50;
    image.height = 50;

    const paragraph = document.createElement('p');
    paragraph.className = 'emptyContainer-text';
    paragraph.textContent = text;

    container.appendChild(image);
    container.appendChild(paragraph);
    return container;
}
