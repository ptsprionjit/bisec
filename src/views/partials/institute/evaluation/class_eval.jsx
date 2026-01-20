// ========================================================
// EVALUATE CLASS START APPLICATION (LAND + FACILITIES)
// ========================================================
import { CLASS_START_FACILITY_RULES, CLASS_START_LAND_RULES } from '../rules/class_rules.jsx';
import * as InputValidation from '../../input_validation.js';

export function classStartDataEvaluate(userData, buildPrintData) {
    const { inst_region } = buildPrintData;
    const stage = userData.inst_stage;
    const newErrors = {};

    // Helper for quick field check
    const checkValidity = (field, min, msg) => {
        if (userData[field] && Number(userData[field]) < min) newErrors[field] = msg;
    }

    // --- Computer Lab rule ---
    checkValidity('computer_room', 1, 'কমপক্ষে ১টি কম্পিউটার ল্যাব থাকতে হবে।');

    // --- Land requirement rule ---
    const landRule = CLASS_START_LAND_RULES[inst_region]?.[stage];
    if (landRule) checkValidity('khatiyan_total', landRule, `জমির পরিমাণ কমপক্ষে ${InputValidation.E2BDigit(landRule)} শতক হতে হবে`);

    // --- Facility requirement rule ---
    const facilityRules = CLASS_START_FACILITY_RULES[stage];
    if (facilityRules) {
        for (const [field, [min, msg]] of Object.entries(facilityRules)) {
            checkValidity(field, min, msg);
        }
    }

    return newErrors;
}
