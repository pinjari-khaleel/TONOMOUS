window.addEventListener('load', function() {
    document.body.style.setProperty('--body-width-px', getWidowInnerWidth());
});
window.addEventListener('resize', function() {
    document.body.style.setProperty('--body-width-px', getWidowInnerWidth());
});

function getWidowInnerWidth() {
    const baseFontSize = 16;
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const paddingInline = style.getPropertyValue('--padding-inline')?.replace('rem', '') * 2;
    return (window.innerWidth - (paddingInline * baseFontSize)) + 'px';
}