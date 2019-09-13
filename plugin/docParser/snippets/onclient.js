/**
 * @const lx.Plugin Plugin
 * @const lx.Snippet Snippet
 * */

const classesBox = Plugin->classesBox;
const classesTree = Plugin->>classesTree;

classesBox.on('resize', function() {
    classesTree->move.left( this.width('px') - 50 + 'px' );
    classesTree->move.trigger('move');
});
classesBox.trigger('resize');
