export interface Bottle {
    _id: string;
    url: string;
    subname: string;
    aminoAcidContent: string;
    alcoholContent: string;
    price: string;
    award: string;
    sakeYeast: string;
    brand: string;
    volume: string;
    sakeRiceExceptForKojiMaking: string;
    sakeMeterValue: string;
    mariage: string;
    type: string;
    ricePolishingRate: string;
    brewery: string;
    breweryYear: string;
    matchDrinkingVessel: string;
    matchDrinkingSceneAndTarget: string;
    matchDrinkingTemperature: string;
    prefecture: string;
    starterCulture: string;
    acidity: string;
    description: string;
    riceForMakingKoji: string;
}

export interface Brewery {
    id: number;
    name: string;
    location: string;
}

export interface BestDrinkData {
    [gender: string]: {
        [weight: string]: number;
    };
}