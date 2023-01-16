#lx:namespace lxdoc.css;
class MainAsset extends lx.PluginCssAsset {
    init(css) {
        css.inheritClass('lxdoc-box', 'AbstractBox');
        css.addClass('lxdoc-title', {
            backgroundColor: css.preset.altMainBackgroundColor
        });

        css.addClass('parentClass', {
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer'
        });
        css.addClass('keyWord', {
            color: 'brown',
            fontWeight: 'bold'
        });
        css.addClass('propName0', {
            width: '100%',
            padding: '5px',
            backgroundColor: '#E6D2DC'
        });
        css.addClass('propName1', {
            width: '100%',
            padding: '5px',
            backgroundColor: '#DAE1DC'
        });
        css.addClass('propDoc0', {
            padding: '25px',
            backgroundColor: '#F0E8EC'
        });
        css.addClass('propDoc1', {
            padding: '25px',
            backgroundColor: '#E7EDE9'
        });
        css.addClass('docBut', {
            float: 'right',
            paddingLeft: '5px',
            paddingRight: '5px',
            backgroundColor: 'white',
            border: 'solid 1px gray'
        });
        css.addClass('pointed', {
            cursor: 'pointer'
        });
    }
}
