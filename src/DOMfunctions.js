/**
 * Returns the absolute XY position of the object.
 * Only works if no scroll. Does work if zoomed in.
 * @param {Object} el object whose position we calculate
 */
function offset (el)
{
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
