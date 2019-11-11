const fg = require('fast-glob');

const pageImages = fg.sync(['assets/pages/*']);
const doodleArray = [];

const firstPageOffset = 1;

pageImages.forEach((_, pageNumber) => {
    const doodlePath = 'assets/doodles/page_' + (pageNumber + firstPageOffset).toString() + '/*';
    doodleArray.push(fg.sync(doodlePath));
});

const pageAndDoodleTemplates = pageImages.map((pageImageSrc, pageIndex) => {
    const doodlesForPage = doodleArray[pageIndex].map((doodleSrc, doodleIndex) => {
        return `
            <li id="page_${pageIndex + 1}-doodle_${doodleIndex + 1}">
                <img src="${doodleSrc}"/>
            </li>        
        `;
    }).join('');
    return `
        <div class="page-template-container" id="page_${pageIndex + 1}">
            <div class="page-image-container">
                <img src="${pageImageSrc}"/>
            </div>
            <div class="doodle-images-container">
                <ul id="page_${pageIndex + 1}-ul">
                    ${doodlesForPage}
                </ul>
            </div>
        </div>    
    `;
});

module.exports = function(eleventyConfig) {

    eleventyConfig.addCollection('pages', function(collection) {
        return pageAndDoodleTemplates;
    });

    eleventyConfig.addPassthroughCopy('assets');
    eleventyConfig.addPassthroughCopy('css');
    eleventyConfig.addPassthroughCopy('js');
}