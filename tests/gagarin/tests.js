describe('My first Gagarin test suite', () => {
  const server = meteor();
  it('should just work', () => {
    return server.execute(() => {
      console.log('I am alive!');
    });
  });
});
