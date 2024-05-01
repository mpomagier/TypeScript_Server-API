import express, { Application, Router } from "express";
import cors from "cors";
import departmentsRoutes from "./routes/departments.routes";
import employeesRoutes from "./routes/employees.routes";
import productsRoutes from "./routes/products.routes";

class App {
  private _app: express.Application;
  private _routes: { path: string; routes: Router }[] = [];
  private _server: any;

  constructor() {
    this._app = express();
  }

  public get app(): express.Application {
    return this._app;
  }

  public get routes(): { path: string; routes: Router }[] {
    return this._routes;
  }

  public set routes(routes: { path: string; routes: Router }[]) {
    this._routes = routes;
  }

  public get server(): any {
    return this._server;
  }

  public set server(server: any) {
    this._server = server;
  }

  public addRoutes(path: string, routes: Router): void {
    this.routes.push({ path, routes });
  }

  public prepareRoutes(): void {
    for (const group of this.routes) {
      this.app.use(group.path, group.routes);
    }
  }

  public run(port: number | string): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.prepareRoutes();

    this.server = this.app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  }
}

const app = new App();
app.addRoutes("/api/", departmentsRoutes);
app.addRoutes("/api/", employeesRoutes);
app.addRoutes("/api/", productsRoutes);
app.run("3000");

export default app;
