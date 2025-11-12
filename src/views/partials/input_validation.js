import { isValid } from "date-fns";

//Function for Invalid name Parts Check
export const namePartCheck = (name_value) => {
    const invalid_name_parts = ['LATE ', 'LATE.', 'LAT ', 'LAT.', 'ADV ', 'ADV. ', 'ADVOCATE ', 'ADVOCATE.', 'ALHAJ ', 'AL-HAJ ', 'ALHAJ.', 'AL-HAJ.', 'ALHAZ ', 'AL-HAZ ', 'ALHAZ.', 'AL-HAZ.', 'BAR ', 'BAR.', 'BARR ', 'BARR.', 'BARRISTAR ', 'BARRISTAR.', 'BARRISTER ', 'BARRISTER.', 'DAKTAR ', 'DAKTAR.', 'DAKTER ', 'DAKTER.', 'DO ', 'DO.', 'DOCTOR ', 'DOCTOR.', 'DR ', 'DR.', 'ENG ', 'ENG.', 'ENGG ', 'ENGG.', 'ENGINEER ', 'ENGINEER.', 'HAJI ', 'HAJI.', 'HAZI ', 'HAZI.', 'KARI ', 'KARI.', 'MAOLANA ', 'MAOLANA.', 'MAWLANA ', 'MAWLANA.', 'MIS ', 'MIS.', 'MISS ', 'MISS.', 'MOULBI ', 'MOULBI.', 'MOULVI ', 'MOULVI.', 'MR ', 'MR.', 'MRS ', 'MRS.', 'MRSS ', 'MRSS.', 'PRINCIPLE ', 'PRINCIPLE.', 'PROF ', 'PROF.', 'PROFESSOR ', 'PROFESSOR.', 'PROFF ', 'PROFF.', 'SHREE ', 'SHREE.', 'SHREEMATI ', 'SHREEMATI.', 'SHREEMOTI ', 'SHREEMOTI.', 'SHREMATI ', 'SHREMATI.', 'SHREMOTI ', 'SHREMOTI.', 'SHRI ', 'SHRI.', 'SHRIMATI ', 'SHRIMATI.', 'SHRIMOTI ', 'SHRIMOTI.', 'SREE ', 'SREE.', 'SREEMATI ', 'SREEMATI.', 'SREEMOTI ', 'SREEMOTI.', 'SREMATI ', 'SREMATI.', 'SREMOTI ', 'SREMOTI.', 'SRI ', 'SRI.', 'SRIMATI ', 'SRIMATI.', 'SRIMOTI ', 'SRIMOTI.'];

    if (String(name_value)?.length) {
        name_value = String(name_value).trim().toUpperCase() + " ";
        for (let i = 0; i < invalid_name_parts.length; i++) {
            if (name_value.includes(invalid_name_parts[i])) {
                return `নামের মধ্যে ${invalid_name_parts[i]} শব্দটি ব্যবহার করা যাবে না`;
            }
        }
        return false;
    } else {
        return "নাম নির্বাচন/পূরণ করতে হবে";
    }
}

// Alphabet [A-Z] Check Function
export const alphaCheck = (name_value) => {
    if (String(name_value)?.length) {
        name_value = String(name_value).trim();
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            var prev_char = name_value.charCodeAt(i - 1);
            if (i === 0) {
                if (!((name_char < 91 && name_char > 64) || (name_char < 123 && name_char > 96))) {
                    return `শুরুতে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
                }
            } else {
                if (!((name_char < 91 && name_char > 64) || (name_char < 123 && name_char > 96) || name_char === 32 || name_char === 45 || name_char === 46 || name_char === 58)) {
                    return `${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
                }
                // Check for consecutive special characters
                if ((prev_char === 32 && name_char === 32) || (prev_char === 45 && name_char === 45) || (prev_char === 46 && name_char === 46) || (prev_char === 58 && name_char === 58)) {
                    return `একই স্পেশাল অক্ষর পরপর ব্যবহার করা যাবে না`;
                }
                // Check for sapce before special characters
                if ((prev_char === 32) && (name_char === 45 || name_char === 46 || name_char === 58)) {
                    return `স্পেস এর পরে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
                }
                // Check for sapce after special characters
                if ((name_char !== 32) && (prev_char === 45 || prev_char === 46 || prev_char === 58)) {
                    return `অক্ষর ${name_value[i]} এর পরে স্পেস দিতে হবে`;
                }
            }
        }
        return false;
    } else {
        return "নির্বাচন/পূরণ করতে হবে";
    }
}

// Bangla Alphabet Check Function
export const bengaliCheck = (name_value) => {
    if (String(name_value)?.length) {
        name_value = String(name_value).trim();
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            var prev_char = name_value.charCodeAt(i - 1);

            if (!((name_char < 2554 && name_char > 2432) || name_char === 2404 || name_char === 32 || name_char === 33 || name_char === 44 || name_char === 45 || name_char === 46 || name_char === 58 || name_char === 63)) {
                return `${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না। শুধুমাত্র বাংলা অক্ষর ব্যবহার করুন!`;
            }
            // Check for consecutive special characters
            if ((prev_char === 32 && name_char === 32) || (prev_char === 33 && name_char === 33) || (prev_char === 44 && name_char === 44) || (prev_char === 45 && name_char === 45) || (prev_char === 46 && name_char === 46) || (prev_char === 58 && name_char === 58) || (prev_char === 63 && name_char === 63)) {
                return `একই স্পেশাল অক্ষর পরপর ব্যবহার করা যাবে না`;
            }
            // Check for sapce before special characters
            if ((prev_char === 32) && (name_char === 2404 || name_char === 33 || name_char === 44 || name_char === 45 || name_char === 46 || name_char === 58 || name_char === 63)) {
                return `স্পেস এর পরে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
            }
            // Check for sapce after special characters
            if ((name_char !== 32) && (prev_char === 2404 || prev_char === 33 || prev_char === 44 || prev_char === 45 || prev_char === 46 || prev_char === 58 || prev_char === 63)) {
                return `অক্ষর ${name_value[i - 1]} এর পরে স্পেস দিতে হবে`;
            }
        }
        return false;
    } else {
        return "নির্বাচন/পূরণ করতে হবে";
    }
}

// Bangla Address Check Function
export const banglaAddressCheck = (name_value) => {
    if (String(name_value)?.length) {
        name_value = String(name_value).trim();
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            var prev_char = name_value.charCodeAt(i - 1);

            if (!((name_char < 2554 && name_char > 2432) || (name_char < 58 && name_char > 47) || name_char === 2404 || name_char === 32 || name_char === 33 || name_char === 40 || name_char === 41 || name_char === 44 || name_char === 45 || name_char === 46 || name_char === 58 || name_char === 63 || name_char === 91 || name_char === 93)) {
                return `${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না। শুধুমাত্র বাংলা অক্ষর ব্যবহার করুন!`;
            }
            // Check for consecutive special characters
            if ((prev_char === 32 && name_char === 32) || (prev_char === 33 && name_char === 33) || (prev_char === 40 && name_char === 40) || (prev_char === 41 && name_char === 41) || (prev_char === 44 && name_char === 44) || (prev_char === 45 && name_char === 45) || (prev_char === 46 && name_char === 46) || (prev_char === 58 && name_char === 58) || (prev_char === 63 && name_char === 63) || (prev_char === 91 && name_char === 91) || (prev_char === 93 && name_char === 93) || (prev_char === 2404 && name_char === 2404)) {
                return `একই স্পেশাল অক্ষর পরপর ব্যবহার করা যাবে না`;
            }
            // // Check for sapce before special characters
            // if ((prev_char === 32) && (name_char === 2404 || name_char === 33 || name_char === 44 || name_char === 45 || name_char === 46 || name_char === 58 || name_char === 63)) {
            //     return `স্পেস এর পরে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
            // }

            // // Check for sapce after special characters
            // if ((name_char !== 32) && (prev_char === 2404 || prev_char === 33 || prev_char === 44 || prev_char === 45 || prev_char === 46 || prev_char === 58 || prev_char === 63)) {
            //     return `অক্ষর ${name_value[i - 1]} এর পরে স্পেস দিতে হবে`;
            // }
        }
        return false;
    } else {
        return "নির্বাচন/পূরণ করতে হবে";
    }
}

// Alphanumeric [A-Z, 0-9] Check Function
export const alphanumCheck = (name_value) => {
    if (String(name_value)?.length) {
        name_value = String(name_value).trim();
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            if (!((name_char < 91 && name_char > 64) || (name_char < 123 && name_char > 96) || (name_char < 58 && name_char > 47) || name_char === 32 || name_char === 44 || name_char === 45 || name_char === 46 || name_char === 47 || name_char === 58)) {
                return `${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
            }
        }
        return false;
    } else {
        return "নির্বাচন/পূরণ করতে হবে";
    }
}

// Email Error Check Function
export const emailCheck = (name_value) => {
    if (String(name_value)?.length) {
        name_value = String(name_value).trim();
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            if (i === 0) {
                if (!((name_char < 91 && name_char > 64) || (name_char < 123 && name_char > 96))) {
                    return `ইমেইলের শুরুতে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
                }
            } else {
                if (!((name_char < 91 && name_char > 64) || (name_char < 123 && name_char > 96) || (name_char < 58 && name_char > 47) || name_char === 64 || name_char === 46)) {
                    return `ইমেইলে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
                }
            }
        }
        return false;
    } else {
        return "ইমেইল নির্বাচন/পূরণ করতে হবে";
    }
}

//Address Validity Check
export const addressCheck = (name_value) => {
    if (String(name_value)?.length) {
        name_value = String(name_value).trim();
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            var prev_char = name_value.charCodeAt(i - 1);

            if (!((name_char < 91 && name_char > 64) || (name_char < 123 && name_char > 96) || (name_char < 58 && name_char > 47) || name_char === 32 || name_char === 33 || name_char === 40 || name_char === 41 || name_char === 44 || name_char === 45 || name_char === 46 || name_char === 58 || name_char === 63 || name_char === 91 || name_char === 93)) {
                return `${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না। শুধুমাত্র ইংরেজি অক্ষর ব্যবহার করুন!`;
            }
            // Check for consecutive special characters
            if ((prev_char === 32 && name_char === 32) || (prev_char === 33 && name_char === 33) || (prev_char === 40 && name_char === 40) || (prev_char === 41 && name_char === 41) || (prev_char === 44 && name_char === 44) || (prev_char === 45 && name_char === 45) || (prev_char === 46 && name_char === 46) || (prev_char === 58 && name_char === 58) || (prev_char === 63 && name_char === 63) || (prev_char === 91 && name_char === 91) || (prev_char === 93 && name_char === 93)) {
                return `একই স্পেশাল অক্ষর পরপর ব্যবহার করা যাবে না`;
            }
            // // Check for sapce before special characters
            // if ((prev_char === 32) && (name_char === 33 || name_char === 44 || name_char === 45 || name_char === 46 || name_char === 58 || name_char === 63)) {
            //     return `স্পেস এর পরে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
            // }
            // // Check for sapce after special characters
            // if ((name_char !== 32) && (prev_char === 33 || prev_char === 44 || prev_char === 45 || prev_char === 46 || prev_char === 58 || prev_char === 63)) {
            //     return `অক্ষর ${name_value[i - 1]} এর পরে স্পেস দিতে হবে`;
            // }
        }
        return false;
    } else {
        return "নির্বাচন/পূরণ করতে হবে";
    }
}

//Number Validity Check
export const numberCheck = (name_value) => {
    if (String(name_value)?.length) {
        name_value = String(name_value).trim();
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            if (!(name_char < 58 && name_char > 47)) {
                return `${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
            }
        }
        return false;
    } else {
        return "নির্বাচন/পূরণ করতে হবে";
    }
}

//Decimal Number Validity Check
export const decimalCheck = (name_value) => {
    if (String(name_value)?.length) {
        name_value = String(name_value).trim();
        if (!isNaN(name_value) && !isNaN(parseFloat(name_value))) {
            return false;
        } else {
            return "শুধুমাত্র সংখ্যা দেয়া যাবে"
        }
    } else {
        return "নির্বাচন/পূরণ করতে হবে";
    }
}

//Date Validiy Check
export const dateCheck = (date_value, start_date, end_date) => {
    if (!date_value || !start_date || !end_date) {
        return "তারিখ নির্বাচন/পূরণ করতে হবে";
    } else {
        if (isValid(new Date(date_value)) && isValid(new Date(start_date)) && isValid(new Date(end_date))) {
            date_value = new Date(date_value);
            start_date = new Date(start_date);
            end_date = new Date(end_date);
            if (!(date_value >= start_date && date_value <= end_date)) {
                return "তারিখটি সঠিক নয়";
            } else {
                return false;
            }
        } else {
            return "তারিখ নির্বাচন/পূরণ করতে হবে";
        }
    }
}


//Password Validiy Check
export const passwordCheck = (name_value) => {
    if (String(name_value)?.length > 5 && String(name_value)?.length < 25) {
        name_value = String(name_value).trim();
        var uChar = false;
        var lChar = false;
        var nChar = false;
        var sChar = false;
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            if (name_char === 32) {
                return `পয়াসওয়ার্ডে স্পেস ব্যবহার করা যাবে না`;
            } else if (!(name_char < 127 && name_char > 32)) {
                return `পয়াসওয়ার্ডে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
            } else {
                if (!uChar && name_char < 91 && name_char > 64) {
                    uChar = true;
                } else if (!lChar && name_char < 123 && name_char > 96) {
                    lChar = true;
                } else if (!nChar && name_char < 58 && name_char > 47) {
                    nChar = true;
                } else if (!sChar) {
                    sChar = true;
                }
            }
        }
        if (uChar && lChar && nChar && sChar) {
            return false;
        } else {
            if (!uChar) {
                return `পয়াসওয়ার্ডে কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে`;
            } else if (!lChar) {
                return "পয়াসওয়ার্ডে কমপক্ষে একটি ছোট হাতের অক্ষর থাকতে হবে";
            } else if (!nChar) {
                return "পয়াসওয়ার্ডে কমপক্ষে একটি সংখ্যা থাকতে হবে";
            } else if (!sChar) {
                return "পয়াসওয়ার্ডে কমপক্ষে একটি বিশেষ অক্ষর থাকতে হবে";
            }
        }
    } else {
        return "পয়াসওয়ার্ডের দৈর্ঘ্য ৬ থেকে ২৪ অক্ষরের মধ্যে হতে হবে";
    }
}

//Simple Password Validiy Check
export const simplePassCheck = (name_value) => {
    if (String(name_value)?.length > 5 && String(name_value)?.length < 25) {
        name_value = String(name_value).trim();
        for (let i = 0; i < name_value.length; i++) {
            var name_char = name_value.charCodeAt(i);
            if (!((name_char < 91 && name_char > 64) || (name_char < 123 && name_char > 96) || (name_char < 58 && name_char > 47))) {
                return `পয়াসওয়ার্ডে ${name_value[i]} অক্ষরটি ব্যবহার করা যাবে না`;
            }
        }
        return false;
    } else {
        return "পয়াসওয়ার্ডের দৈর্ঘ্য ৬ থেকে ২৪ অক্ষরের মধ্যে হতে হবে";
    }
}

//English Digit to Bengali Digit Converter
export const E2BDigit = (eng_digit) => {
    eng_digit = String(eng_digit).trim();
    var bn_digit = '';
    var name_char = '';
    for (let i = 0; i < eng_digit.length; i++) {
        name_char = eng_digit.charCodeAt(i);
        if (name_char < 58 && name_char > 47) {
            bn_digit = String(bn_digit) + String.fromCharCode(2486 + name_char);
        } else {
            bn_digit = String(bn_digit) + String.fromCharCode(name_char);
        }
    }
    return bn_digit;
}