import { Component, h } from "preact";
import { Route, Router, RouterOnChangeArgs } from "preact-router";

import Home from "../routes/home";
import HelloWorld from "../routes/hello_world";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import Pagination from "../routes/pagiantion";
import Sorting from "../routes/sorting";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
  // tslint:disable-next-line:no-var-requires
  require("preact/debug");
}

export default class App extends Component {
  public currentUrl: string;

  private handleRoute(e: RouterOnChangeArgs): void {
    this.currentUrl = e.url;
  }

  render() {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="py-10">
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-4 sm:px-0">
                <Router onChange={this.handleRoute.bind(this)}>
                  <Route path="/" component={Home} />
                  <Route path="/hello-world" component={HelloWorld} />
                  <Route path="/pagination" component={Pagination} />
                  <Route path="/sorting" component={Sorting} />
                  <NotFoundPage default />
                </Router>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
