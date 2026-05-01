import { ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('does not expose non-http exception messages to clients', () => {
    const filter = new HttpExceptionFilter();
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({ url: '/api/v1/test', method: 'GET' }),
      }),
    } as unknown as ArgumentsHost;
    const loggerSpy = jest
      .spyOn(filter['logger'], 'error')
      .mockImplementation(() => undefined);

    filter.catch(new Error('provider secret response body'), host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Internal Server Error',
        message: 'Internal server error',
      }),
    );
    expect(JSON.stringify(response.json.mock.calls[0][0])).not.toContain('provider secret response body');
    loggerSpy.mockRestore();
  });
});
