import { h, Component } from "preact";

declare global {
  interface Window {
    hljs: any;
  }
}

export default class Example extends Component<any, any> {
  constructor() {
    super();

    this.state = {
      activeTab: "preview"
    };
  }

  setTab(tabName: string) {
    this.setState({
      activeTab: tabName
    });
  }

  isActive(tabName: string) {
    return this.state.activeTab === tabName;
  }

  getTabClass(isActive: boolean) {
    if (isActive) {
      return "bg-blue-50 text-blue-700";
    }

    return "text-gray-500 hover:text-blue-600 focus:text-blue-600";
  }

  render() {
    return (
      <div className="bg-white overflow-hidden sm:rounded-lg sm:shadow">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-no-wrap">
            <div className="ml-4 mt-2">
              <h3 className="text-2xl leading-6 font-medium text-gray-900">
                {this.props.title}
              </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <div className="hidden sm:flex items-center text-sm md:text-base">
                <button
                  onClick={() => this.setTab("preview")}
                  type="button"
                  className={`inline-block rounded-lg font-medium leading-none py-2 px-3 focus:outline-none ${this.getTabClass(
                    this.isActive("preview")
                  )}`}
                >
                  Preview
                </button>
                <button
                  onClick={() => this.setTab("code")}
                  type="button"
                  className={`ml-2 inline-block rounded-lg font-medium leading-none py-2 px-3 focus:outline-none ${this.getTabClass(
                    this.isActive("code")
                  )}`}
                >
                  Code
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ${
            this.isActive("code") ? "hidden" : ""
          }`}
        >
          {this.props.children}
        </div>
        <div
          className={`max-w-7xl mx-auto ${this.isActive("preview") &&
            "hidden"}`}
        >
          <pre>
            <code className="hljs">
              <div
                dangerouslySetInnerHTML={{
                  __html: window.hljs.highlight("javascript", this.props.code)
                    .value
                }}
              />
            </code>
          </pre>
        </div>
      </div>
    );
  }
}
