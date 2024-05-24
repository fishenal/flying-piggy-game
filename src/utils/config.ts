export const globalConfig = {
    groundHeight: 100,
    pileSpeed: 4,
};
export const pileConfig = {
    gapHeight: 250,
    pileHeight: 500,
    pileWidth: 80,
    pileGap: 400,
    firstPileX: 600,
};

export const getPileConfig = () => {
    if (window.innerWidth < 1100) {
        return {
            pileGap: 300,
            firstPileX: 500,
            pileWidth: 60,
        };
    }
    return {
        pileWidth: 80,
        pileGap: 500,
        firstPileX: 600,
    };
};
export const birdConfig = {
    x: 200,
    h: 105,
    w: 134,
    y: 200,
    downRate: 0.3,
    intSpeed: 6,
};

export const getBirdConfig = () => {
    if (window.innerHeight < 800) {
        return {
            downRate: 0.3,
            intSpeed: 5,
        };
    }
    return {
        downRate: 0.4,
        intSpeed: 7,
    };
};
