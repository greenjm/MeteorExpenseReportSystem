describe('My first Mocha test suite', function() {
  const server = meteor();
  it('should just work', function() {
    return server.execute( function() {
      console.log('I am alive!');
    });
  });
});
