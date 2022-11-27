import { Fragment } from 'preact';
import PaginationLimit from '../../pipeline/limit/pagination';
import { classJoin, className } from '../../util/className';
import ServerPaginationLimit from '../../pipeline/limit/serverPagination';
import Tabular from '../../tabular';
import { useConfig } from '../../hooks/useConfig';
import { useEffect, useState } from 'preact/hooks';
import { useTranslator } from '../../i18n/language';


export interface PaginationConfig {
  limit?: number;
  page?: number;
  summary?: boolean;
  nextButton?: boolean;
  prevButton?: boolean;
  buttonsCount?: number;
  resetPageOnUpdate?: boolean;
  server?: {
    url?: (prevUrl: string, page: number, limit: number) => string;
    body?: (prevBody: BodyInit, page: number, limit: number) => BodyInit;
  };
}

export function Pagination(props: PaginationConfig) {
  props.summary = props.summary || true;
  props.nextButton = props.nextButton || true;
  props.prevButton = props.prevButton || true;
  props.buttonsCount = props.buttonsCount || 3;
  props.limit = props.limit || 10;
  props.page = props.page || 0;
  props.resetPageOnUpdate = props.resetPageOnUpdate || true;

  let processor: PaginationLimit | ServerPaginationLimit;

  const [currentPage, setCurrentPage] = useState(props.page);
  const [limit] = useState(props.limit);
  const [total, setTotal] = useState(0);
  const config = useConfig();
  const _ = useTranslator();

  const setTotalFromTabular = (tabular: Tabular) => {
    setTotal(tabular.length);
  }

  if (props.server) {
    processor = new ServerPaginationLimit({
      limit: limit,
      page: currentPage,
      url: props.server.url,
      body: props.server.body,
    });

    config.pipeline.on('afterProcess', setTotalFromTabular);
  } else {
    processor = new PaginationLimit({
      limit: limit,
      page: currentPage,
    });

    // Pagination (all Limit processors) is the last step in the pipeline
    // and we assume that at this stage, we have the rows that we care about.
    // Let's grab the rows before processing Pagination and set total number of rows
    processor.on('beforeProcess', setTotalFromTabular);
  }

  config.pipeline.register(processor);

  // we need to make sure that the state is set
  // to the default props when an error happens
  config.pipeline.on('error', () => {
    setTotal(0);
    setCurrentPage(0);
  });

  useEffect(() => {
    config.pipeline.on('updated', onUpdate);

    return () => {
      config.pipeline.unregister(processor);
      config.pipeline.off('updated', onUpdate);
    };
  }, []);

  const onUpdate = (updatedProcessor) => {
    // this is to ensure that the current page is set to 0
    // when a processor is updated for some reason
    if (props.resetPageOnUpdate && updatedProcessor !== processor) {
      setCurrentPage(0);
    }
  };

  const pages = () => Math.ceil(total / limit);

  const setPage = (page: number) => {
    if (page >= pages() || page < 0 || page === currentPage) {
      return null;
    }

    setCurrentPage(page);

    processor.setProps({
      page: page,
    });
  }

  const renderPages = () => {
    if (props.buttonsCount <= 0) {
      return null;
    }

    // how many pagination buttons to render?
    const maxCount: number = Math.min(pages(), props.buttonsCount);

    let pagePivot = Math.min(currentPage, Math.floor(maxCount / 2));
    if (currentPage + Math.floor(maxCount / 2) >= pages()) {
      pagePivot = maxCount - (pages() - currentPage);
    }

    return (
      <Fragment>
        {pages() > maxCount && currentPage - pagePivot > 0 && (
          <Fragment>
            <button
              tabIndex={0}
              role="button"
              onClick={setPage(0)}
              title={_('pagination.firstPage')}
              aria-label={_('pagination.firstPage')}
              className={config.className.paginationButton}
            >
              {_('1')}
            </button>
            <button
              tabIndex={-1}
              className={classJoin(
                className('spread'),
                config.className.paginationButton,
              )}
            >
              ...
            </button>
          </Fragment>
        )}

        {Array.from(Array(maxCount).keys())
          .map((i) => currentPage + (i - pagePivot))
          .map((i) => (
            <button
              tabIndex={0}
              role="button"
              onClick={setPage(i)}
              className={classJoin(
                currentPage === i
                  ? classJoin(
                      className('currentPage'),
                      config.className.paginationButtonCurrent,
                    )
                  : null,
                config.className.paginationButton,
              )}
              title={_('pagination.page', i + 1)}
              aria-label={_('pagination.page', i + 1)}
            >
              {_(`${i + 1}`)}
            </button>
          ))}

        {pages() > maxCount && pages() > currentPage + pagePivot + 1 && (
          <Fragment>
            <button
              tabIndex={-1}
              className={classJoin(
                className('spread'),
                config.className.paginationButton,
              )}
            >
              ...
            </button>
            <button
              tabIndex={0}
              role="button"
              onClick={setPage(pages() - 1)}
              title={_('pagination.page', pages())}
              aria-label={_('pagination.page', pages())}
              className={config.className.paginationButton}
            >
              {_(`${pages()}`)}
            </button>
          </Fragment>
        )}
      </Fragment>
    );
  }

  const renderSummary = () => {
    return (
      <Fragment>
        {props.summary && total > 0 && (
          <div
            role="status"
            aria-live="polite"
            className={classJoin(
              className('summary'),
              config.className.paginationSummary,
            )}
            title={_(
              'pagination.navigate',
              currentPage + 1,
              pages(),
            )}
          >
            {_('pagination.showing')}{' '}
            <b>{_(`${currentPage * limit + 1}`)}</b>{' '}
            {_('pagination.to')}{' '}
            <b>
              {_(
                `${Math.min(
                  (currentPage + 1) * limit,
                  total,
                )}`,
              )}
            </b>{' '}
            {_('pagination.of')} <b>{_(`${total}`)}</b>{' '}
            {_('pagination.results')}
          </div>
        )}
      </Fragment>
    );
  }

    return (
      <div
        className={classJoin(
          className('pagination'),
          config.className.pagination,
        )}
      >
        {renderSummary()}

        <div className={className('pages')}>
          {props.prevButton && (
            <button
              tabIndex={0}
              role="button"
              disabled={currentPage === 0}
              onClick={setPage(currentPage - 1)}
              title={_('pagination.previous')}
              aria-label={_('pagination.previous')}
              className={classJoin(
                config.className.paginationButton,
                config.className.paginationButtonPrev,
              )}
            >
              {_('pagination.previous')}
            </button>
          )}

          {renderPages()}

          {props.nextButton && (
            <button
              tabIndex={0}
              role="button"
              disabled={pages() === currentPage + 1 || pages() === 0}
              onClick={setPage(currentPage + 1)}
              title={_('pagination.next')}
              aria-label={_('pagination.next')}
              className={classJoin(
                config.className.paginationButton,
                config.className.paginationButtonNext,
              )}
            >
              {_('pagination.next')}
            </button>
          )}
        </div>
      </div>
    );
}
