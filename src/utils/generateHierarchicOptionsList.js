export default function( data ) {
  const options = [];

  const nest = function ( data, elements, nestLevel = 0 ) {
    elements.forEach( function( single ) {
      const titlePrefix = new Array( nestLevel + 1 ).join( '–' );

      options.push({
        key: single.id,
        text: `${titlePrefix} ${single.title}`,
        value: single.id
      });

      const children = data.filter( item => item.parentId === single.id );

      if ( children.length ) {
        nest( data, children, nestLevel + 1 );
      }
    });
  }

  const mainElements = data.filter( el => ! el.parentId );
  nest( data, mainElements );

  return options;
}
