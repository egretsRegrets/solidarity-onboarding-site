const fg = require('fast-glob');

const pageImages = fg.sync(['assets/pages/*']);
const doodleArray = [];

const firstPageOffset = 7;

pageImages.forEach((_, pageNumber) => {
    const doodlePath = 'assets/doodles/page_' + (pageNumber + firstPageOffset).toString() + '/*';
    doodleArray.push(fg.sync(doodlePath));
});

const pageAndDoodleTemplates = pageImages.map((pageImageSrc, pageIndex) => {
    const doodlesForPage = doodleArray[pageIndex].map((doodleSrc) => {
        return `
            <li>
                <img src="${doodleSrc}"/>
            </li>        
        `;
    }).join('');
    return `
        <div class="page-image-container">
            <img src="${pageImageSrc}"/>
        </div>
        <div class="doodle-images-container">
            <ul>
                ${doodlesForPage}
            </ul>
        </div>
    `;
});

module.exports = function(eleventyConfig) {
    // eleventyConfig.addCollection('pages', function(collection) {
    //     return pages
    // });

    eleventyConfig.addCollection('pages', function(collection) {
        return pageAndDoodleTemplates;
    });

    eleventyConfig.addPassthroughCopy('assets');
}