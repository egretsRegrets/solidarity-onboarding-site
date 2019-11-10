const fg = require('fast-glob');

const pages = fg.sync(['assets/pages/*']);

module.exports = function(eleventyConfig) {
    eleventyConfig.addCollection('pages', function(collection) {
        return pages
    });

    eleventyConfig.addPassthroughCopy('assets');
}