import {h, Component} from 'preact';
import Header from "./header";

export default class Wrapper extends Component {
  render() {
    return (
        <div className="min-h-screen bg-gray-100">
          <Header/>

          <div className="py-10">
            <header>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {this.props.title &&
                  <h1 className="text-3xl font-bold leading-tight text-gray-900">
                    {this.props.title}
                  </h1>
                }
              </div>
            </header>
            <main>
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-4 sm:px-0">
                  {this.props.children}
                </div>
              </div>
            </main>
          </div>
        </div>
    );
  }
}
