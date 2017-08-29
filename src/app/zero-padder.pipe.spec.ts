import { ZeroPadderPipe } from './zero-padder.pipe';

describe('ZeroPadderPipe', () => {
  it('create an instance', () => {
    const pipe = new ZeroPadderPipe();
    expect(pipe).toBeTruthy();
  });
});
