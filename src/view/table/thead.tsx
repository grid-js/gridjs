import { h } from 'preact';

import { TR } from './tr';
import { BaseComponent, BaseProps } from '../base';
import { TH } from './th';
import { className } from '../../util/className';
import Header from '../../header';
import Pipeline from '../../pipeline/pipeline';
import Dispatcher from '../../util/dispatcher';
import { GenericSortConfig } from '../plugin/sort/sort';

interface THeadProps extends BaseProps {
  dispatcher: Dispatcher<any>;
  pipeline: Pipeline<any>;
  header: Header;
  sort?: GenericSortConfig;
}

export class THead extends BaseComponent<THeadProps, {}> {
  render() {
    if (this.props.header) {
      return (
        <thead key={this.props.header.id} className={className('thead')}>
          <TR>
            {this.props.header.columns.map((col, i) => {
              return (
                <TH
                  dispatcher={this.props.dispatcher}
                  pipeline={this.props.pipeline}
                  sort={this.props.sort}
                  column={col}
                  index={i}
                />
              );
            })}
          </TR>
        </thead>
      );
    }

    return null;
  }
}
