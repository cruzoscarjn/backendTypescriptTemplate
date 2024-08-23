import PortHttp from './ports/http/Port.http';
import PortSwagger from './ports/swagger/Port.swagger';

export function init(): void {
  PortHttp.init();
  PortSwagger.init();
}

init();
