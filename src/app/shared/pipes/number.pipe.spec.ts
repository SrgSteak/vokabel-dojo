import { NumberPipe } from './number.pipe';

xdescribe('NumberPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberPipe();
    expect(pipe).toBeTruthy();
  });
});
