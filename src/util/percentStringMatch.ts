const stringSimilarity = require('string-similarity');

export const percentStringMatch = (str1: string, str2: string, threshold: number): boolean => {
    const score = stringSimilarity.compareTwoStrings(str1, str2);
    return parseFloat(score) >= threshold;
};
