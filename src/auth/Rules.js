export const PAGES = [
    'view_admin',
    'view_home',
    'view_profile',
    'update_profile',
    'update_password',
    'new_profile',
    'modify_profile',
    'reset_password',
    'entry_notice',
    'auth_notice'
]

// USER TYPE, USER OFFICE, USER ROLE OBJECT
export const TYPE_OFFICE_ROLE = {
    '13': {
        '81': { "12": "modifier" },
        '82': { "12": "modifier" },
        '83': { "12": "modifier" },
        '84': { "12": "modifier" },
        '85': { "12": "modifier" },
    },

    '14': {
        '01': { "13": "initiator", "14": "checker", "15": "verifier", "16": "authorizer", },
        '02': { "13": "initiator", "14": "checker", "15": "verifier", "16": "authorizer", },
        '03': { "13": "initiator", "14": "checker", "15": "verifier", "16": "authorizer", "17": "admin", "18": "admin" },
        '04': { "13": "initiator", "14": "checker", "15": "verifier", "16": "authorizer", },
        '05': { "13": "initiator", "14": "checker", "15": "verifier", "16": "authorizer", },
        '06': { "13": "initiator", "14": "checker", "15": "verifier", "16": "authorizer", },
    },
}

TYPE_OFFICE_ROLE['15'] = TYPE_OFFICE_ROLE['14'];