import { OnyomiPipe } from './onyomi.pipe';

xdescribe('OnyomiPipe', () => {
  it('create an instance', () => {
    const pipe = new OnyomiPipe();
    expect(pipe).toBeTruthy();
  });
});
