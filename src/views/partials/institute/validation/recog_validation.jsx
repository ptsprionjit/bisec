import { checkMinTotal, checkPassRate } from '../rules/recog_rules';

export const recognitionAppEvalReg = (userData) => {
    if (!userData?.inst_region || !userData?.recog_inst_status) return null;

    const newErrors = {};

    switch (userData.inst_region) {
        case '01':
        case '02':
            switch (userData.recog_inst_status) {
                case '11':
                case '12':
                case '20':
                    ["six", "seven", "eight"].forEach((cls) => {
                        ["science"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const minReg = 40;
                            newErrors[prefix] = checkMinTotal(userData[prefix], minReg);
                        });
                    });

                    ["nine", "ten", "eleven", "twelve"].forEach((cls) => {
                        ["science", "humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const minReg = group === "science" ? 30 : 40;
                            newErrors[prefix] = checkMinTotal(userData[prefix], minReg);
                        });
                    });

                    break;
                case '13':
                    ["eleven", "twelve"].forEach((cls) => {
                        ["science", "humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const minReg = group === "science" ? 35 : 45;
                            newErrors[prefix] = checkMinTotal(userData[prefix], minReg);
                        });
                    });

                    break;
                case '26':
                    ["eleven", "twelve"].forEach((cls) => {
                        ["science", "humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const minReg = group === "science" ? 30 : 35;
                            newErrors[prefix] = checkMinTotal(userData[prefix], minReg);
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
                    ["six", "seven", "eight"].forEach((cls) => {
                        ["science"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const minReg = 30;
                            newErrors[prefix] = checkMinTotal(userData[prefix], minReg);
                        });
                    });

                    ["nine", "ten", "eleven", "twelve"].forEach((cls) => {
                        ["science", "humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const minReg = group === "science" ? 25 : 30;
                            newErrors[prefix] = checkMinTotal(userData[prefix], minReg);
                        });
                    });

                    break;
                case '13':
                    ["eleven", "twelve"].forEach((cls) => {
                        ["science", "humanities", "business"].forEach((group) => {
                            const prefix = `${cls}_${group}_total`;
                            const minReg = group === "science" ? 30 : 40;
                            newErrors[prefix] = checkMinTotal(userData[prefix], minReg);
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

export const recognitionAppEvalExm = (userData) => {
    if (!userData?.inst_region || !userData?.recog_inst_status) return null;

    const newErrors = {};

    switch (userData.inst_region) {
        case '01':
            switch (userData.recog_inst_status) {
                case '11':
                case '12':
                case '20':
                    ["jsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const minReg = 40;
                                const minApp = 35;
                                const minPas = 60;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
                            });
                        });
                    });

                    ["ssc", "hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const minReg = group === "science" ? 30 : 40;
                                const minApp = group === "science" ? 25 : 35;
                                const minPas = exm === "ssc" ? 55 : 50;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
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

                                const minReg = group === "science" ? 35 : 45;
                                const minApp = group === "science" ? 30 : 40;
                                const minPas = 50;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
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

                                const minReg = group === "science" ? 30 : 35;
                                const minApp = group === "science" ? 25 : 30;
                                const minPas = 50;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
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
                    ["jsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const minReg = 40;
                                const minApp = 35;
                                const minPas = 55;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
                            });
                        });
                    });

                    ["ssc", "hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const minReg = group === "science" ? 30 : 40;
                                const minApp = group === "science" ? 25 : 35;
                                const minPas = exm === "ssc" ? 50 : 45;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
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

                                const minReg = group === "science" ? 35 : 45;
                                const minApp = group === "science" ? 25 : 35;
                                const minPas = 45;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
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

                                const minReg = group === "science" ? 30 : 35;
                                const minApp = group === "science" ? 25 : 30;
                                const minPas = 45;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
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
                    ["jsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const minReg = 30;
                                const minApp = 25;
                                const minPas = 50;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
                            });
                        });
                    });

                    ["ssc", "hsc"].forEach((exm) => {
                        ["1", "2", "3"].forEach((n) => {
                            ["science", "humanities", "business"].forEach((group) => {
                                const prefix_reg = `${exm}${n}_${group}_registered`;
                                const prefix_app = `${exm}${n}_${group}_appeared`;
                                const prefix_pas = `${exm}${n}_${group}_passed`;

                                const minReg = group === "science" ? 25 : 30;
                                const minApp = group === "science" ? 20 : 25;
                                const minPas = exm === "ssc" ? 45 : 40;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
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

                                const minReg = group === "science" ? 30 : 40;
                                const minApp = group === "science" ? 25 : 35;
                                const minPas = 40;

                                newErrors[prefix_reg] = checkMinTotal(userData[prefix_reg], minReg);
                                newErrors[prefix_app] = checkMinTotal(userData[prefix_app], minApp);
                                newErrors[prefix_pas] = checkPassRate(userData[prefix_pas], userData[prefix_app], minPas);
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
