import { checkMinTotal, checkPassRate } from '../rules/recog_rules';

// Check if Distance & Population Criterion is Matched
export const recognitionAppEvalReg = (userData) => {
    let newErrors = {};
    switch (userData.inst_region) {
        case '01':
        case '02':
            switch (userData.recog_inst_status) {
                case '11':
                case '12':
                case '20':
                    ["six", "seven", "eight", "nine", "ten", "eleven", "twelve"].forEach((cls) => {
                        ["science"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const min_reg = (cls === "six" || cls === "seven" || cls === "eight") ? 40 : 30;
                            newErrors[prefix] = checkMinTotal(userData[prefix], min_reg);
                        });
                    });

                    ["nine", "ten", "eleven", "twelve"].forEach((cls) => {
                        ["humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const min_reg = 40;
                            newErrors[prefix] = checkMinTotal(userData[prefix], min_reg);
                        });
                    });

                    break;
                case '13':
                    ["eleven", "twelve"].forEach((cls) => {
                        ["science", "humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const min_reg = group === "science" ? 35 : 45;
                            newErrors[prefix] = checkMinTotal(userData[prefix], min_reg);
                        });
                    });

                    break;
                case '26':
                    ["eleven", "twelve"].forEach((cls) => {
                        ["science", "humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const min_reg = group === "science" ? 30 : 35;
                            newErrors[prefix] = checkMinTotal(userData[prefix], min_reg);
                        });
                    });

                    break;
                default:
                    break;
            }
            break;
        case '03':
            switch (userData.recog_inst_status) {
                case '11':
                case '12':
                case '20':
                case '26':
                    ["six", "seven", "eight", "nine", "ten", "eleven", "twelve"].forEach((cls) => {
                        ["science"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const min_reg = (cls === "six" || cls === "seven" || cls === "eight") ? 30 : 25;
                            newErrors[prefix] = checkMinTotal(userData[prefix], min_reg);
                        });
                    });

                    ["nine", "ten", "eleven", "twelve"].forEach((cls) => {
                        ["humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const min_reg = 30;
                            newErrors[prefix] = checkMinTotal(userData[prefix], min_reg);
                        });
                    });

                    break;
                case '13':
                    ["eleven", "twelve"].forEach((cls) => {
                        ["science", "humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const min_reg = group === "science" ? 30 : 40;
                            newErrors[prefix] = checkMinTotal(userData[prefix], min_reg);
                        });
                    });

                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return newErrors;
}

// Check if Distance & Population Criterion is Matched
export const recognitionAppEvalExm = (userData) => {
    let newErrors = {};
    switch (userData.inst_region) {
        case '01':
            switch (userData.recog_inst_status) {
                case '11':
                case '12':
                case '20':
                    ["1", "2", "3"].forEach((n) => {
                        const prefix_reg = `jsc${n}_science_registered`;
                        const prefix_app = `jsc${n}_science_appeared`;
                        const prefix_pas = `jsc${n}_science_passed`;

                        const min_reg = 40;
                        const min_app = 35;
                        const min_pas = 60;

                        newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                        newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                        newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                    });

                    ["ssc", "hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const min_reg = group === "science" ? 30 : 40;
                                const min_app = group === "science" ? 25 : 35;
                                const min_pas = exm === "ssc" ? 55 : 50;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                            });
                        });
                    });

                    break;
                case '13':
                    ["hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const min_reg = group === "science" ? 35 : 45;
                                const min_app = group === "science" ? 30 : 40;
                                const min_pas = 50;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                            });
                        });
                    });

                    break;
                case '26':
                    ["hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const min_reg = group === "science" ? 30 : 35;
                                const min_app = group === "science" ? 25 : 30;
                                const min_pas = 50;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                            });
                        });
                    });

                    break;
                default:
                    break;
            }
            break;
        case '02':
            switch (userData.recog_inst_status) {
                case '11':
                case '12':
                case '20':
                    ["1", "2", "3"].forEach((n) => {
                        const prefix_reg = `jsc${n}_science_registered`;
                        const prefix_app = `jsc${n}_science_appeared`;
                        const prefix_pas = `jsc${n}_science_passed`;

                        const min_reg = 40;
                        const min_app = 35;
                        const min_pas = 55;

                        newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                        newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                        newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                    });

                    ["ssc", "hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const min_reg = group === "science" ? 30 : 40;
                                const min_app = group === "science" ? 25 : 35;
                                const min_pas = exm === "ssc" ? 50 : 45;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                            });
                        });
                    });

                    break;
                case '13':
                    ["hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const min_reg = group === "science" ? 35 : 45;
                                const min_app = group === "science" ? 25 : 35;
                                const min_pas = 45;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                            });
                        });
                    });

                    break;
                case '26':
                    ["hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const min_reg = group === "science" ? 30 : 35;
                                const min_app = group === "science" ? 25 : 30;
                                const min_pas = 45;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                            });
                        });
                    });

                    break;
                default:
                    break;
            }
            break;
        case '03':
            switch (userData.recog_inst_status) {
                case '11':
                case '12':
                case '20':
                case '26':
                    ["1", "2", "3"].forEach((n) => {
                        const prefix_reg = `jsc${n}_science_registered`;
                        const prefix_app = `jsc${n}_science_appeared`;
                        const prefix_pas = `jsc${n}_science_passed`;

                        const min_reg = 30;
                        const min_app = 25;
                        const min_pas = 50;

                        newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                        newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                        newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                    });

                    ["ssc", "hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const min_reg = group === "science" ? 25 : 30;
                                const min_app = group === "science" ? 20 : 25;
                                const min_pas = exm === "ssc" ? 45 : 40;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                            });
                        });
                    });

                    break;
                case '13':
                    ["hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const min_reg = group === "science" ? 30 : 40;
                                const min_app = group === "science" ? 25 : 35;
                                const min_pas = 40;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], min_reg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], min_app);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], min_pas);
                            });
                        });
                    });

                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return newErrors;
}
