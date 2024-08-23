import PortHttp from '#infrastructure/ports/http/Port.http';

import { init } from './App';
import PortSwagger from './ports/swagger/Port.swagger';

jest.unmock('./App');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize PortHttp', () => {
    init();
    expect(PortHttp.init).toHaveBeenCalled();
  });

  it('should initialize PortSwagger', () => {
    init();
    expect(PortSwagger.init).toHaveBeenCalled();
  });
});
