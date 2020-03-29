const en = {
    profile: {
        info: [
            'My name is {{name}}, I come from {{country}}',
            {
                name: undefined,
                country: 'USA',
            },
        ],
    },
    button: {
        submit: 'Submit',
        cancel: 'Cancel',
    },
};

export default en;
export type Locale = typeof en;
