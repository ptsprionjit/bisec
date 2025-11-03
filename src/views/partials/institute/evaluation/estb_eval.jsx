// Evaluate distance/population compactly
import { ESTABLISHMENT_RULES } from '../rules/estb_rules.jsx';
import * as InputValidation from '../../input_validation.js';

export function estbDataEvaluate(userData) {
    const { inst_region, inst_status, inst_distance, inst_population } = userData;
    const rule = ESTABLISHMENT_RULES[inst_region]?.[inst_status];

    const estbErrors = {};
    estbErrors.inst_distance = '';
    estbErrors.inst_population = '';

    if (!rule) return estbErrors;
    if (inst_distance && Number(inst_distance) < rule.distance) estbErrors.inst_distance = `প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ${InputValidation.E2BDigit(rule.distance)} কিমি হতে হবে!`;
    if (inst_population && Number(inst_population) < rule.population) estbErrors.inst_population = `প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ${InputValidation.E2BDigit(rule.population)} হতে হবে!`;
    return estbErrors;
}