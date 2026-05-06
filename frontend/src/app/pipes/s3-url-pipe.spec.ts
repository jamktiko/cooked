import { S3UrlPipe } from './s3-url-pipe';

describe('S3UrlPipe', () => {
  it('create an instance', () => {
    const pipe = new S3UrlPipe();
    expect(pipe).toBeTruthy();
  });
});
