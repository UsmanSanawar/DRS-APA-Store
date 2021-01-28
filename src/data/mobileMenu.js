export default [
    {
        label: 'HOME',
        type: "link",url: '/'
    },

    {
        label: 'STORE',
        type: "link",url: '/store'
    },
    {
        label: 'FOLDING DOORS',
        type: "link",url: '/site/folding-doors',


        children: [
                {label: 'Eco Fold 90 "Folding Door"', type: "link",url: '/site/folding-doors/eco-fold-90-folding-door'},
            ],

    }, {
        label: 'SWING DOORS',
        type: "link",url: '/site/swing-doors',

            children: [
                {label: 'Eco-Swing 90 Swing Door Unit', type: "link",url: '/site/swing-doors/eco-swing-90-swing-door-unit-2'},
                {label: 'Eco-Swing IH "In Head" Swing Unit', type: "link",url: '/site/swing-doors/eco-swing-90-ih-in-head-swing-unit'},
                {label: 'Eco-Swing BD "Balance Door"', type: "link",url: '/site/swing-doors/eco-swing-bd-balance-door'},
                {label: 'Eco-Swing IF "In-Floor Operator"', type: "link",url: '/site/swing-doors/eco-swing-if-in-floor-operator'},
            ],

    }, {
        label: 'SLIDING DOORS',
        type: "link",url: '/site/sliding-doors',

            children: [
                {label: 'ES400 Sliding Door Unit"', type: "link",url: '/site/sliding-doors/es400-sliding-door-unit'},
                {label: 'Eco-Slide 400IH "In-Head" Sliding Door Unit', type: "link",url: '/site/sliding-doors/es400-sliding-door-unit-2'},
                {label: 'Eco-Slide 400T Telescopic Door Unit', type: "link",url: '/site/sliding-doors/eco-slide-400t-telescopic-door-unit'},
                {label: 'Eco-Slide 400T-IH "In-Head" Telescopic Sliding Door Unit', type: "link",url: '/site/sliding-doors/eco-slide-400t-telescopic-door-unit-2'},
            ],

    }, {
        label: 'RETRO-FIT KITS',
        type: "link",url: '/site/retro-fit-kit',

            children: [
                {label: 'Sliding Door Retro-Fit Kits', type: "link",url: '/site/retro-fit-kit/sliding-door-retro-fit-kits'},
                {label: 'Swing Door Retro-Fit Kits', type: "link",url: '/site/retro-fit-kit/swing-door-retro-fit-kits'},
            ],

    },  {
        label: 'CONTACT US',
        type: "link",url: '/site/contact-us',
    },

];
