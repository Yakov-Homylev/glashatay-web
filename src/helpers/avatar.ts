const getHashOfString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return hash;
};

const normalizeHash = (hash: number, min: number, max: number) => {
    return Math.floor((hash % (max - min)) + min);
};

const hRange = [180, 360];
const sRange = [50, 75];
const lRange = [25, 60];

export const generateHSL = (name: string) => {
    const hash = getHashOfString(name);
    const h = normalizeHash(hash, hRange[0], hRange[1]);
    const s = normalizeHash(hash, sRange[0], sRange[1]);
    const l = normalizeHash(hash, lRange[0], lRange[1]);
    return [h, s, l];
};

export const getBackgroundColor = (string: string) => {
    if (!string) {
        return;
    }
    const [h, s, l] = generateHSL(string);
    return `background-color: hsl(${h}, ${s}%, ${l}%)`;
};

export const shortName = (name: string) => {
    if (!name) {
        return '';
    }
    const arr = name.split(' ');
    if (arr.length > 1) {
        const res = arr[0][0] + arr[1][0];
        return res.toUpperCase();
    } else if (arr.length === 1) {
        const res = arr[0][0];
        return res.toUpperCase();
    } else {
        return '';
    }
};
