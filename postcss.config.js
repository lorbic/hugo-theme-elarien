const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
        './hugo_stats.json',
        './layouts/**/*.html',
        './content/**/*.md',
        './assets/js/**/*.js',
        './themes/elarien/layouts/**/*.html',
        './themes/elarien/assets/js/**/*.js'
    ],
    defaultExtractor: (content) => {
        if (content.trim().startsWith('{')) {
            try {
                const els = JSON.parse(content).htmlElements;
                return (els.tags || []).concat(els.classes || [], els.ids || []);
            } catch (e) {
                // Not valid JSON, fall through to regex
            }
        }
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    },
    safelist: {
        standard: [
            'active', 'visible', 'is-visible', 'hidden-step', 'is-expanded', 'is-expanded-state', 'success', 'selected',
            'show', 'hide', 'hidden', 
            'theme-icon-light', 'theme-icon-dark', 'hash-symbol',
            'dark', 'light', 'data-theme'
        ],
        deep: [
            /^chroma/, /^medium-zoom/, /^svg-icon/, /^fa-/, /^hljs/
        ],
        greedy: [
            // Hugo chroma short classes
            /^err$/, /^k$/, /^kd$/, /^kp$/, /^kr$/, /^kt$/,
            /^c$/, /^ch$/, /^cm$/, /^cp$/, /^cpf$/, /^c1$/, /^cs$/, 
            /^n$/, /^na$/, /^nb$/, /^nc$/, /^no$/, /^nd$/, /^ni$/, /^ne$/, /^nf$/, /^fm$/, /^nl$/, /^nn$/, /^nx$/, /^py$/, /^nt$/, /^nv$/, /^vc$/, /^vg$/, /^vi$/, /^vm$/, 
            /^l$/, /^ld$/, /^s$/, /^sa$/, /^sb$/, /^sc$/, /^dl$/, /^sd$/, /^s2$/, /^se$/, /^sh$/, /^si$/, /^sx$/, /^sr$/, /^s1$/, /^ss$/, 
            /^m$/, /^mb$/, /^mf$/, /^mh$/, /^mi$/, /^il$/, /^mo$/, 
            /^o$/, /^ow$/, /^p$/, /^w$/
        ]
    }
});

module.exports = {
    plugins: [
        require('autoprefixer'),
        purgecss
    ]
};
